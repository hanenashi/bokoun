export function normalizeImageHref(value) {
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

export function relativeActivityFromTimestamp(datetime, currentTime = Date.now()) {
  if (!datetime) return "";
  const timestamp = Date.parse(datetime);
  if (!Number.isFinite(timestamp)) return "";

  const seconds = Math.max(0, Math.round((currentTime - timestamp) / 1000));
  if (seconds < 60) return "právě teď";
  if (seconds < 3600) return `před ${Math.floor(seconds / 60)} min`;
  if (seconds < 86_400) return `před ${Math.floor(seconds / 3600)} h`;
  if (seconds < 172_800) return "včera";
  return `před ${Math.floor(seconds / 86_400)} dny`;
}

export function decodeSvelteDataValues(values) {
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

export function decodeSvelteDataText(raw) {
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

export function formatPragueParts(value) {
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

export function formatPostTimestamp(value) {
  const parts = formatPragueParts(value);
  if (!parts) return "";
  return `${Number(parts.day)}.${Number(parts.month)}.${parts.year} ${parts.hour}:${parts.minute}:${parts.second}`;
}

export function formatPaginationCursor(value) {
  const parts = formatPragueParts(value);
  if (!parts) return "";
  return `${parts.year}${parts.month}${parts.day}-${parts.hour}${parts.minute}${parts.second}`;
}

export function olderHrefFromPagination(pagination, pageHref) {
  if (!pagination || pagination.isOldest) return "";
  const boundary = pagination.olderBoundaries?.[0];
  const cursor = formatPaginationCursor(boundary?.date);
  if (!cursor) return "";
  const url = new URL(pageHref, "https://kapybara.okoun.cz");
  const query = new URLSearchParams();
  query.set("f", cursor);
  const threadRoot = url.searchParams.get("rootId");
  if (threadRoot) query.set("rootId", threadRoot);
  const threadFocus = url.searchParams.get("p");
  if (threadFocus) query.set("p", threadFocus);
  return `${url.pathname}?${query}`;
}

export function normalizedStructuredPageHref(pageHref) {
  const url = new URL(pageHref, "https://kapybara.okoun.cz");
  return url.origin === "https://kapybara.okoun.cz"
    ? `${url.pathname}${url.search}${url.hash}`
    : "";
}

export function boardModelFromSvelteRoots(
  roots,
  pageHref,
  { sanitize } = {},
) {
  if (typeof sanitize !== "function") {
    throw new Error("A structured post sanitizer is required");
  }
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
    const rootId = post?.rootId ? String(post.rootId) : parentId;
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

export function favoritesModelFromSvelteRoots(roots) {
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
