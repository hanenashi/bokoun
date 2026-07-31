export function installAdapters(ctx) {
  const {
    VERSION,
    STRUCTURED_REFRESH_MS,
    STRUCTURED_RESUME_MS = 2 * 60_000,
    STRUCTURED_CACHE_LIMIT = 24,
    SELECTORS,
    state,
  } = ctx;
  const routeKey = (...args) => ctx.routeKey(...args);
  const scheduleRender = (...args) => ctx.scheduleRender(...args);
  const now = () => typeof ctx.now === "function" ? ctx.now() : Date.now();
  const STRUCTURED_REASONS = new Set([
    "initial-route",
    "route-transition",
    "visibility-resume",
    "favorites-poll",
    "successful-post",
    "manual-refresh",
    "pagination",
  ]);

  function recordTraffic(kind, reason = "unspecified") {
    const counters = state.trafficCounters;
    if (!counters || !Object.hasOwn(counters, kind)) return;
    counters[kind] += 1;
    counters.byReason[reason] = (counters.byReason[reason] || 0) + 1;
  }

  function trafficSnapshot() {
    const counters = state.trafficCounters || {};
    return {
      structuredGets: Number(counters.structuredGets) || 0,
      htmlFallbacks: Number(counters.htmlFallbacks) || 0,
      readMutations: Number(counters.readMutations) || 0,
      byReason: { ...(counters.byReason || {}) },
    };
  }

  function resetTrafficCounters() {
    if (!state.trafficCounters) return;
    state.trafficCounters.structuredGets = 0;
    state.trafficCounters.htmlFallbacks = 0;
    state.trafficCounters.readMutations = 0;
    state.trafficCounters.byReason = {};
  }

  function documentIsHidden() {
    return typeof document !== "undefined" && document.visibilityState === "hidden";
  }

  function text(node) {
    return node?.textContent?.replace(/\s+/g, " ").trim() || "";
  }

  function normalizeHref(value) {
    if (!value) return "";
    try {
      const url = new URL(value, location.origin);
      return url.origin === location.origin ? `${url.pathname}${url.search}${url.hash}` : url.href;
    } catch {
      return "";
    }
  }

  function normalizeImageHref(value) {
    if (!value) return "";
    try {
      const url = new URL(value, "https://kapybara.okoun.cz");
      if (!["http:", "https:"].includes(url.protocol)) return "";
      return url.origin === "https://kapybara.okoun.cz"
        ? `${url.pathname}${url.search}${url.hash}`
        : url.href;
    } catch {
      return "";
    }
  }

  function unreadCount(row) {
    const compact = text(row.querySelector(SELECTORS.favoriteUnreadCompact));
    const full = text(row.querySelector(SELECTORS.favoriteUnreadFull));
    const match = (compact || full).match(/\d+/);
    return match ? Number.parseInt(match[0], 10) : 0;
  }

  function relativeActivityFromTimestamp(datetime) {
    if (!datetime) return "";
    const timestamp = Date.parse(datetime);
    if (!Number.isFinite(timestamp)) return "";

    const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
    if (seconds < 60) return "právě teď";
    if (seconds < 3600) return `před ${Math.floor(seconds / 60)} min`;
    if (seconds < 86_400) return `před ${Math.floor(seconds / 3600)} h`;
    if (seconds < 172_800) return "včera";
    return `před ${Math.floor(seconds / 86_400)} dny`;
  }

  function relativeActivity(row) {
    const nativeRelative = text(row.querySelector(SELECTORS.favoriteRelativeTime));
    if (nativeRelative) return nativeRelative;
    return relativeActivityFromTimestamp(
      row.querySelector(SELECTORS.favoriteTime)?.getAttribute("datetime"),
    );
  }

  function readFavoritesFromDom() {
    return [...document.querySelectorAll(SELECTORS.favoriteRows)]
      .map((row) => ({
        id: String(row.dataset.boardId || ""),
        href: normalizeHref(row.getAttribute("href")),
        name: text(row.querySelector(SELECTORS.favoriteName)),
        unread: unreadCount(row),
        activity: relativeActivity(row),
        lastPosted: row.querySelector(SELECTORS.favoriteTime)?.getAttribute("datetime") || "",
      }))
      .filter((club) => club.href && club.name);
  }

  function decodeSvelteDataValues(values) {
    if (!Array.isArray(values) || !values.length) {
      throw new Error("Invalid Svelte data values");
    }

    const hydrated = new Array(values.length);
    const hasHydrated = new Set();
    const special = new Map([
      [-1, undefined],
      [-2, undefined],
      [-3, Number.NaN],
      [-4, Number.POSITIVE_INFINITY],
      [-5, Number.NEGATIVE_INFINITY],
      [-6, -0],
    ]);

    const hydrate = (index) => {
      if (special.has(index)) return special.get(index);
      if (!Number.isInteger(index) || index < 0 || index >= values.length) {
        throw new Error("Invalid Svelte data reference");
      }
      if (hasHydrated.has(index)) return hydrated[index];

      const encoded = values[index];
      if (encoded === null || typeof encoded !== "object") {
        hasHydrated.add(index);
        hydrated[index] = encoded;
        return encoded;
      }

      if (Array.isArray(encoded) && typeof encoded[0] === "string") {
        const tag = encoded[0];
        let decoded;
        if (tag === "Date") decoded = new Date(encoded[1]);
        else if (tag === "BigInt") decoded = BigInt(encoded[1]);
        else if (tag === "RegExp") decoded = new RegExp(encoded[1], encoded[2] || "");
        else throw new Error(`Unsupported Svelte data type: ${tag}`);
        hasHydrated.add(index);
        hydrated[index] = decoded;
        return decoded;
      }

      const decoded = Array.isArray(encoded) ? [] : Object.create(null);
      hasHydrated.add(index);
      hydrated[index] = decoded;

      if (Array.isArray(encoded)) {
        for (const reference of encoded) decoded.push(hydrate(reference));
      } else {
        for (const [key, reference] of Object.entries(encoded)) {
          if (["__proto__", "constructor", "prototype"].includes(key)) continue;
          decoded[key] = hydrate(reference);
        }
      }
      return decoded;
    };

    return hydrate(0);
  }

  function decodeSvelteDataText(raw) {
    const roots = [];
    const lines = String(raw || "").split(/\r?\n/).filter(Boolean);
    for (const line of lines) {
      const packet = JSON.parse(line);
      if (packet?.type === "chunk" && Array.isArray(packet.data)) {
        roots.push(decodeSvelteDataValues(packet.data));
      }
    }
    if (!roots.length) throw new Error("Svelte data contained no chunks");
    return roots;
  }

  function formatPragueParts(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    const parts = Object.create(null);
    for (const part of new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Prague",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date)) {
      if (part.type !== "literal") parts[part.type] = part.value;
    }
    return parts;
  }

  function formatPostTimestamp(value) {
    const parts = formatPragueParts(value);
    if (!parts) return "";
    return `${Number(parts.day)}.${Number(parts.month)}.${parts.year} ${parts.hour}:${parts.minute}:${parts.second}`;
  }

  function formatPaginationCursor(value) {
    const parts = formatPragueParts(value);
    if (!parts) return "";
    return `${parts.year}${parts.month}${parts.day}-${parts.hour}${parts.minute}${parts.second}`;
  }

  function olderHrefFromPagination(pagination, pageHref) {
    if (!pagination || pagination.isOldest) return "";
    const boundary = pagination.olderBoundaries?.[0];
    const cursor = formatPaginationCursor(boundary?.date);
    if (!cursor) return "";
    const url = new URL(pageHref, "https://kapybara.okoun.cz");
    const query = new URLSearchParams();
    query.set("f", cursor);
    const threadRoot = url.searchParams.get("rootId");
    if (threadRoot) query.set("rootId", threadRoot);
    return `${url.pathname}?${query}`;
  }

  function normalizedStructuredPageHref(pageHref) {
    const url = new URL(pageHref, "https://kapybara.okoun.cz");
    return url.origin === "https://kapybara.okoun.cz"
      ? `${url.pathname}${url.search}${url.hash}`
      : "";
  }

  function boardModelFromSvelteRoots(
    roots,
    pageHref,
    { sanitize = sanitizeHtml } = {},
  ) {
    const boardRoot = roots.find((root) => root?.board && typeof root.board === "object");
    const pageRoot = roots
      .filter((root) => Array.isArray(root?.posts) && root.pagination)
      .at(-1);
    if (!boardRoot?.board || !pageRoot || boardRoot.apiAccessRequired || pageRoot.postsError) {
      throw new Error("Incomplete structured board data");
    }

    const posts = pageRoot.posts.map((post) => {
      const parentAuthor = post?.parent?.author?.login;
      const parentDate = formatPostTimestamp(post?.parent?.posted);
      const parentId = post?.parent?.id ? String(post.parent.id) : "";
      const rootId = post?.rootId
        ? String(post.rootId)
        : parentId;
      return {
        id: String(post?.id || ""),
        author: String(post?.author?.login || "neznámý"),
        avatarUrl: normalizeImageHref(post?.author?.iconUrl),
        date: formatPostTimestamp(post?.posted),
        datetime: typeof post?.posted === "string" ? post.posted : "",
        parentId,
        parentAuthor: String(parentAuthor || ""),
        parentDate,
        rootId,
        depth: Math.max(0, Number(post?.depth) || 0),
        sequence: Number(post?.sequence) || 0,
        replyReference: post?.parent
          ? `Reakce na ${parentAuthor || "neznámý"}${parentDate ? `, ${parentDate}` : ""}`
          : "",
        bodyHtml: sanitize(typeof post?.htmlBody === "string" ? post.htmlBody : ""),
        pageHref: normalizedStructuredPageHref(pageHref),
      };
    }).filter((post) => post.id);

    return {
      id: String(boardRoot.board.id || ""),
      title: String(boardRoot.board.name || boardRoot.board.slug || "Klub"),
      posts,
      nextOlderHref: olderHrefFromPagination(pageRoot.pagination, pageHref),
      lastPosted: typeof boardRoot.board.lastPosted === "string"
        ? boardRoot.board.lastPosted
        : "",
      lastRead: typeof boardRoot.board.lastRead === "string"
        ? boardRoot.board.lastRead
        : "",
      newPostsCount: Number.isFinite(boardRoot.board.newPostsCount)
        ? Math.max(0, boardRoot.board.newPostsCount)
        : 0,
    };
  }

  function favoritesModelFromSvelteRoots(roots) {
    const root = roots.filter((candidate) => Array.isArray(candidate?.boards)).at(-1);
    if (!root || root.apiAccessRequired || root.error) {
      throw new Error("Incomplete structured Favorites data");
    }
    return root.boards.map((board) => ({
      id: String(board?.id || ""),
      href: `/boards/${encodeURIComponent(String(board?.slug || ""))}`,
      name: String(board?.name || ""),
      unread: Number.isFinite(board?.newPostsCount) ? Math.max(0, board.newPostsCount) : 0,
      activity: relativeActivityFromTimestamp(board?.lastPosted),
      lastPosted: typeof board?.lastPosted === "string" ? board.lastPosted : "",
    })).filter((club) => club.href !== "/boards/" && club.name);
  }

  function structuredDataUrl(pageHref) {
    const url = new URL(pageHref, location.origin);
    if (url.origin !== location.origin) throw new Error("Unsafe structured data URL");
    url.pathname = `${url.pathname.replace(/\/$/, "")}/__data.json`;
    url.searchParams.delete("bokoun");
    url.hash = "";
    return url;
  }

  async function fetchStructuredModel(
    type,
    pageHref,
    { signal, reason = "manual-refresh" } = {},
  ) {
    recordTraffic("structuredGets", reason);
    const response = await fetch(structuredDataUrl(pageHref), {
      cache: "no-store",
      credentials: "same-origin",
      headers: { Accept: "text/sveltekit-data" },
      signal,
    });
    if (!response.ok || !response.headers.get("content-type")?.includes("text/sveltekit-data")) {
      throw new Error(`Structured data HTTP ${response.status}`);
    }
    const roots = decodeSvelteDataText(await response.text());
    const model = type === "favorites"
      ? favoritesModelFromSvelteRoots(roots)
      : boardModelFromSvelteRoots(roots, pageHref);
    return { type, model, fetchedAt: now() };
  }

  function structuredCacheKey(type, pageHref) {
    return `${type}:${normalizeHref(pageHref)}`;
  }

  function cachedStructuredModel(type, pageHref) {
    const cacheKey = structuredCacheKey(type, pageHref);
    const entry = state.structuredCache.get(cacheKey);
    if (!entry) return null;
    state.structuredCache.delete(cacheKey);
    state.structuredCache.set(cacheKey, entry);
    return entry.model || null;
  }

  function structuredModelAge(type, pageHref) {
    const entry = state.structuredCache.get(structuredCacheKey(type, pageHref));
    const fetchedAt = Number(entry?.fetchedAt);
    return Number.isFinite(fetchedAt)
      ? Math.max(0, now() - fetchedAt)
      : Number.POSITIVE_INFINITY;
  }

  function storeStructuredEntry(cacheKey, entry) {
    state.structuredCache.delete(cacheKey);
    state.structuredCache.set(cacheKey, entry);
    while (state.structuredCache.size > STRUCTURED_CACHE_LIMIT) {
      const oldestKey = state.structuredCache.keys().next().value;
      if (oldestKey === undefined) break;
      state.structuredCache.delete(oldestKey);
      state.structuredFailures.delete(oldestKey);
    }
    return entry;
  }

  function ensureStructuredModel(
    type,
    pageHref,
    {
      reason = "initial-route",
      force = false,
      render = true,
      minimumAge = reason === "visibility-resume"
        ? STRUCTURED_RESUME_MS
        : STRUCTURED_REFRESH_MS,
    } = {},
  ) {
    if (!STRUCTURED_REASONS.has(reason)) {
      throw new Error(`Unsupported structured refresh reason: ${reason}`);
    }
    if (documentIsHidden()) return Promise.resolve(null);

    const cacheKey = structuredCacheKey(type, pageHref);
    const cached = state.structuredCache.get(cacheKey);
    if (!force && cached && now() - cached.fetchedAt < minimumAge) {
      return Promise.resolve(cached);
    }
    const existing = state.structuredPending.get(cacheKey);
    if (existing) return existing.promise;
    const lastFailure = state.structuredFailures.get(cacheKey) || 0;
    if (!force && now() - lastFailure < 30_000) return Promise.resolve(null);

    const controller = new AbortController();
    const pending = {
      controller,
      promise: null,
    };
    pending.promise = fetchStructuredModel(type, pageHref, {
      signal: controller.signal,
      reason,
    })
      .then((entry) => {
        storeStructuredEntry(cacheKey, entry);
        state.structuredFailures.delete(cacheKey);
        if (render) {
          state.currentSignature = "";
          scheduleRender({ force: true });
        }
      })
      .catch((error) => {
        if (error?.name === "AbortError") return null;
        state.structuredFailures.delete(cacheKey);
        state.structuredFailures.set(cacheKey, now());
        while (state.structuredFailures.size > STRUCTURED_CACHE_LIMIT) {
          const oldestKey = state.structuredFailures.keys().next().value;
          if (oldestKey === undefined) break;
          state.structuredFailures.delete(oldestKey);
        }
        console.warn(
          `[Bokoun ${VERSION}] Structured ${type} data unavailable; using DOM fallback.`,
          error?.name || "Error",
        );
        return null;
      })
      .finally(() => {
        if (state.structuredPending.get(cacheKey) === pending) {
          state.structuredPending.delete(cacheKey);
        }
      });
    state.structuredPending.set(cacheKey, pending);
    return pending.promise;
  }

  function abortStructuredRequests(exceptType = "", exceptHref = "") {
    const keep = exceptType && exceptHref
      ? structuredCacheKey(exceptType, exceptHref)
      : "";
    for (const [key, entry] of state.structuredPending) {
      if (key !== keep) entry.controller?.abort();
    }
  }

  function invalidateStructuredModel(type, pageHref) {
    const cacheKey = structuredCacheKey(type, pageHref);
    state.structuredPending.get(cacheKey)?.controller?.abort();
    state.structuredPending.delete(cacheKey);
    state.structuredCache.delete(cacheKey);
    state.structuredFailures.delete(cacheKey);
  }

  function sanitizeHtml(html) {
    const template = document.createElement("template");
    template.innerHTML = html || "";

    const allowedTags = new Set([
      "A", "B", "BLOCKQUOTE", "BR", "CODE", "DEL", "DIV", "EM", "HR", "I",
      "IMG", "LI", "OL", "P", "PRE", "S", "SPAN", "STRONG", "U", "UL",
    ]);
    const removeTags = new Set([
      "BASE", "BUTTON", "EMBED", "FORM", "IFRAME", "INPUT", "LINK", "META",
      "OBJECT", "SCRIPT", "STYLE", "SVG", "MATH", "TEXTAREA",
    ]);
    const elements = [...template.content.querySelectorAll("*")];

    for (const element of elements) {
      if (removeTags.has(element.tagName)) {
        element.remove();
        continue;
      }
      if (!allowedTags.has(element.tagName)) {
        element.replaceWith(...element.childNodes);
        continue;
      }

      for (const attribute of [...element.attributes]) {
        const name = attribute.name.toLowerCase();
        const allowed = (
          (element.tagName === "A" && ["href", "title"].includes(name))
          || (element.tagName === "IMG" && ["src", "alt", "title", "width", "height"].includes(name))
          || (element.tagName === "SPAN" && name === "title")
        );
        if (!allowed) element.removeAttribute(attribute.name);
      }

      if (element.tagName === "A") {
        const href = element.getAttribute("href");
        if (!safeUrl(href, { image: false })) {
          element.removeAttribute("href");
        } else {
          element.setAttribute("rel", "noopener noreferrer");
        }
      }

      if (element.tagName === "IMG") {
        const src = element.getAttribute("src");
        if (!safeUrl(src, { image: true })) {
          element.remove();
        } else {
          element.setAttribute("loading", "lazy");
          element.setAttribute("decoding", "async");
        }
      }
    }

    return template.innerHTML;
  }

  function safeUrl(value, { image }) {
    if (!value) return false;
    try {
      const url = new URL(value, location.href);
      if (["http:", "https:"].includes(url.protocol)) return true;
      return image && url.protocol === "data:" && /^data:image\//i.test(value);
    } catch {
      return false;
    }
  }

  function compactDate(post) {
    const time = post.querySelector(SELECTORS.postTime);
    const visible = text(post.querySelector(SELECTORS.postDate));
    if (visible) return visible;
    const datetime = time?.getAttribute("datetime");
    if (!datetime) return "";
    const date = new Date(datetime);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("cs-CZ", {
      day: "numeric",
      month: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  function replyReferenceParts(value) {
    const reference = String(value || "").trim();
    const match = reference.match(
      /^Reakce na\s+(.+?)(?:,\s*(\d{1,2}\.\d{1,2}\.\d{4}\s+\d{1,2}:\d{2}(?::\d{2})?))?$/i,
    );
    return {
      author: match?.[1]?.trim() || "",
      date: match?.[2]?.trim() || "",
    };
  }

  function readBoardFromDom(root = document, pageHref = routeKey()) {
    const title = text(root.querySelector(SELECTORS.boardTitle))
      || decodeURIComponent(location.pathname.split("/").filter(Boolean).at(-1) || "Klub");
    const posts = [...root.querySelectorAll(SELECTORS.posts)].map((post) => {
      const body = post.querySelector(SELECTORS.postBody);
      const replyReference = text(post.querySelector(SELECTORS.postReplyReference));
      const replyParts = replyReferenceParts(replyReference);
      const threadHref = post.querySelector('a[href*="rootId="]')?.getAttribute("href") || "";
      let rootId = "";
      try {
        rootId = new URL(threadHref, location.origin).searchParams.get("rootId") || "";
      } catch {
        rootId = "";
      }
      return {
        id: post.getAttribute("data-post-id") || "",
        author: text(post.querySelector(SELECTORS.postAuthor)) || "neznámý",
        avatarUrl: normalizeImageHref(
          post.querySelector(SELECTORS.postAvatar)?.getAttribute("src"),
        ),
        date: compactDate(post),
        datetime: post.querySelector(SELECTORS.postTime)?.getAttribute("datetime") || "",
        parentId: "",
        parentAuthor: replyParts.author,
        parentDate: replyParts.date,
        rootId,
        depth: 0,
        sequence: 0,
        replyReference,
        bodyHtml: sanitizeHtml(body?.innerHTML || ""),
        pageHref: normalizeHref(pageHref),
      };
    }).filter((post) => post.id);
    const olderLinks = [...root.querySelectorAll(SELECTORS.olderPosts)];
    const nextOlderHref = normalizeHref(olderLinks.at(-1)?.getAttribute("href") || "");
    return {
      id: "",
      title,
      posts,
      nextOlderHref,
      lastPosted: "",
      lastRead: "",
      newPostsCount: 0,
    };
  }

  Object.assign(ctx, {
    text,
    normalizeHref,
    normalizeImageHref,
    unreadCount,
    relativeActivityFromTimestamp,
    relativeActivity,
    readFavoritesFromDom,
    decodeSvelteDataValues,
    decodeSvelteDataText,
    formatPragueParts,
    formatPostTimestamp,
    formatPaginationCursor,
    olderHrefFromPagination,
    normalizedStructuredPageHref,
    boardModelFromSvelteRoots,
    favoritesModelFromSvelteRoots,
    structuredDataUrl,
    fetchStructuredModel,
    structuredCacheKey,
    storeStructuredEntry,
    cachedStructuredModel,
    structuredModelAge,
    ensureStructuredModel,
    abortStructuredRequests,
    invalidateStructuredModel,
    recordTraffic,
    trafficSnapshot,
    resetTrafficCounters,
    sanitizeHtml,
    safeUrl,
    compactDate,
    replyReferenceParts,
    readBoardFromDom,
  });
}
