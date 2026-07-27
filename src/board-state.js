export function installBoardState(ctx) {
  const {
    BOARD_VISIT_KEY = "bokoun.board-visit.v1",
    BOARD_READ_BOUNDARIES_KEY = "bokoun.board-read-boundaries.v1",
    gmGet = () => ({}),
    gmSet = () => undefined,
    state,
  } = ctx;
  const routeKey = (...args) => ctx.routeKey(...args);
  const normalizeHref = (...args) => ctx.normalizeHref(...args);
  const fetchStructuredModel = (...args) => ctx.fetchStructuredModel(...args);
  const structuredCacheKey = (...args) => ctx.structuredCacheKey(...args);

  function boardPath(pageHref = routeKey()) {
    try {
      return new URL(pageHref, location.origin).pathname;
    } catch {
      return "";
    }
  }

  function readBoardVisit() {
    if (typeof sessionStorage === "undefined") return state.boardVisit || null;
    try {
      const visit = JSON.parse(sessionStorage.getItem(BOARD_VISIT_KEY) || "null");
      if (!visit || typeof visit.boardPath !== "string") return null;
      return {
        boardPath: visit.boardPath,
        lastRead: typeof visit.lastRead === "string" ? visit.lastRead : "",
        unreadCount: Math.max(0, Number(visit.unreadCount) || 0),
      };
    } catch {
      return null;
    }
  }

  function writeBoardVisit(visit) {
    state.boardVisit = visit;
    if (typeof sessionStorage === "undefined") return;
    try {
      sessionStorage.setItem(BOARD_VISIT_KEY, JSON.stringify(visit));
    } catch {
      // A blocked session store must not prevent reading the board.
    }
  }

  function laterReadBoundary(...values) {
    return values.reduce((latest, value) => {
      const timestamp = Date.parse(value);
      return Number.isFinite(timestamp) && timestamp > (Date.parse(latest) || 0)
        ? new Date(timestamp).toISOString()
        : latest;
    }, "");
  }

  function readLocalBoundaries() {
    try {
      const stored = gmGet(BOARD_READ_BOUNDARIES_KEY, {});
      return stored && typeof stored === "object" && !Array.isArray(stored)
        ? stored
        : {};
    } catch {
      return {};
    }
  }

  function localReadBoundary(path) {
    const value = readLocalBoundaries()[path];
    return typeof value === "string" ? value : "";
  }

  function rememberBoardReadBoundary(path, posts = state.boardPosts) {
    if (!path) return "";
    const visit = readBoardVisit();
    const newestSeen = posts.reduce(
      (latest, post) => laterReadBoundary(latest, post.datetime),
      visit?.lastRead || "",
    );
    if (!newestSeen) return "";

    const boundaries = {
      ...readLocalBoundaries(),
      [path]: laterReadBoundary(localReadBoundary(path), newestSeen),
    };
    const trimmed = Object.fromEntries(
      Object.entries(boundaries)
        .filter(([key, value]) => key.startsWith("/boards/") && Number.isFinite(Date.parse(value)))
        .sort((left, right) => Date.parse(right[1]) - Date.parse(left[1]))
        .slice(0, 100),
    );
    try {
      gmSet(BOARD_READ_BOUNDARIES_KEY, trimmed);
    } catch {
      // Read tracking is local enhancement state, never a navigation blocker.
    }
    return trimmed[path] || "";
  }

  function startBoardVisit(
    pageHref,
    { lastRead = "", newPostsCount = 0, unreadCount = newPostsCount } = {},
  ) {
    const path = boardPath(pageHref);
    const visit = {
      boardPath: path,
      lastRead: laterReadBoundary(
        typeof lastRead === "string" ? lastRead : "",
        localReadBoundary(path),
      ),
      unreadCount: Math.max(0, Number(unreadCount) || 0),
    };
    writeBoardVisit(visit);
    return visit;
  }

  function ensureBoardVisit(pageHref, model = {}) {
    const path = boardPath(pageHref);
    const stored = readBoardVisit();
    if (stored?.boardPath === path) {
      if (!stored.lastRead && typeof model.lastRead === "string" && model.lastRead) {
        return startBoardVisit(pageHref, model);
      }
      state.boardVisit = stored;
      return stored;
    }
    return startBoardVisit(pageHref, model);
  }

  function leaveBoardVisit(path = "") {
    const stored = readBoardVisit();
    if (path && stored?.boardPath && stored.boardPath !== path) return;
    rememberBoardReadBoundary(stored?.boardPath || path);
    state.boardVisit = null;
    if (typeof sessionStorage === "undefined") return;
    try {
      sessionStorage.removeItem(BOARD_VISIT_KEY);
    } catch {
      // Session storage is an enhancement; navigation must still proceed.
    }
  }

  async function prepareBoardVisitFromFavorite(pageHref, fallbackUnreadCount = 0) {
    let model = null;
    try {
      const entry = await fetchStructuredModel("board", pageHref);
      state.structuredCache.set(structuredCacheKey("board", pageHref), entry);
      model = entry.model;
    } catch {
      // Preserve a count-based fallback when structured preflight is unavailable.
    }
    return startBoardVisit(pageHref, model || { newPostsCount: fallbackUnreadCount });
  }

  function newPostIdsForVisit(posts, visit = state.boardVisit) {
    if (!visit) return [];
    const boundary = Date.parse(visit.lastRead);
    if (Number.isFinite(boundary)) {
      return posts
        .filter((post) => {
          const posted = Date.parse(post.datetime);
          return Number.isFinite(posted) && posted > boundary;
        })
        .map((post) => post.id);
    }
    return posts
      .slice(0, Math.max(0, Number(visit.unreadCount) || 0))
      .map((post) => post.id);
  }

  function boardRouteIdentity(pageHref = routeKey()) {
    const url = new URL(pageHref, location.origin);
    const rootId = url.searchParams.get("rootId") || "";
    return `${url.pathname}${rootId ? `?rootId=${encodeURIComponent(rootId)}` : ""}`;
  }

  function threadRootId(pageHref = routeKey()) {
    try {
      return new URL(pageHref, location.origin).searchParams.get("rootId") || "";
    } catch {
      return "";
    }
  }

  function threadPosts(posts, rootId) {
    if (!rootId) return [...posts];
    return posts
      .filter((post) => post.id === rootId || post.rootId === rootId)
      .sort((left, right) => {
        if (left.id === rootId) return -1;
        if (right.id === rootId) return 1;
        const leftTime = Date.parse(left.datetime) || 0;
        const rightTime = Date.parse(right.datetime) || 0;
        return leftTime - rightTime
          || left.sequence - right.sequence
          || Number(left.id) - Number(right.id);
      });
  }

  function resetBoardAccumulator(model, pageHref, { structured = false } = {}) {
    state.boardLoadAbort?.abort();
    state.boardLoadAbort = null;
    state.boardKey = boardRouteIdentity(pageHref);
    state.boardTitle = model.title;
    state.boardPosts = [];
    state.boardPostIndex = new Map();
    state.boardPostPages = new Map();
    state.boardLoadedPages = new Set();
    state.boardNextHref = "";
    state.boardLoading = false;
    state.boardEnd = false;
    state.boardError = "";
    state.boardAutoCooldownUntil = 0;
    state.boardStructuredReady = structured;
    ensureBoardVisit(pageHref, model);
    mergeBoardPage(model, pageHref, { setNext: true });
  }

  function mergeBoardPage(model, pageHref, { setNext = false } = {}) {
    const normalizedPage = normalizeHref(pageHref);
    let added = 0;

    if (normalizedPage) state.boardLoadedPages.add(normalizedPage);
    if (model.title) state.boardTitle = model.title;

    for (const post of model.posts) {
      const index = state.boardPostIndex.get(post.id);
      if (index === undefined) {
        const page = normalizedPage || post.pageHref || routeKey();
        state.boardPostIndex.set(post.id, state.boardPosts.length);
        state.boardPostPages.set(post.id, page);
        state.boardPosts.push({ ...post, pageHref: page });
        added += 1;
      } else {
        const page = state.boardPostPages.get(post.id) || normalizedPage || post.pageHref;
        state.boardPosts[index] = { ...post, pageHref: page };
      }
    }

    if (setNext) {
      state.boardNextHref = model.nextOlderHref;
      state.boardEnd = !model.nextOlderHref;
    }
    return added;
  }

  function refreshBoardNewestPage(model, pageHref) {
    ensureBoardVisit(pageHref, model);
    const normalizedPage = normalizeHref(pageHref);
    const freshIds = new Set(model.posts.map((post) => post.id));
    const older = state.boardPosts
      .filter((post) => !freshIds.has(post.id))
      .map((post) => ({
        post,
        pageHref: state.boardPostPages.get(post.id) || post.pageHref,
      }));

    state.boardPosts = [];
    state.boardPostIndex = new Map();
    state.boardPostPages = new Map();
    if (normalizedPage) state.boardLoadedPages.add(normalizedPage);
    if (model.title) state.boardTitle = model.title;

    for (const post of model.posts) {
      state.boardPostIndex.set(post.id, state.boardPosts.length);
      state.boardPostPages.set(post.id, normalizedPage || post.pageHref);
      state.boardPosts.push({ ...post, pageHref: normalizedPage || post.pageHref });
    }
    for (const { post, pageHref: olderPageHref } of older) {
      state.boardPostIndex.set(post.id, state.boardPosts.length);
      state.boardPostPages.set(post.id, olderPageHref);
      state.boardPosts.push(post);
    }

    if (!state.boardStructuredReady || state.boardLoadedPages.size <= 1) {
      state.boardNextHref = model.nextOlderHref;
      state.boardEnd = !model.nextOlderHref;
    }
  }

  function boardViewModel() {
    const activeRootId = threadRootId();
    const posts = threadPosts(state.boardPosts, activeRootId);
    return {
      title: state.boardTitle,
      posts,
      threadRootId: activeRootId,
      threadCount: posts.length,
      newPostIds: newPostIdsForVisit(state.boardPosts),
      nextOlderHref: state.boardNextHref,
      loading: state.boardLoading,
      end: state.boardEnd,
      error: state.boardError,
      loadedPageCount: state.boardLoadedPages.size,
    };
  }

  Object.assign(ctx, {
    boardRouteIdentity,
    boardPath,
    readBoardVisit,
    laterReadBoundary,
    localReadBoundary,
    rememberBoardReadBoundary,
    startBoardVisit,
    ensureBoardVisit,
    leaveBoardVisit,
    prepareBoardVisitFromFavorite,
    newPostIdsForVisit,
    threadRootId,
    threadPosts,
    resetBoardAccumulator,
    mergeBoardPage,
    refreshBoardNewestPage,
    boardViewModel,
  });
}
