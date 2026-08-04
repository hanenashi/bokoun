export function installBoardState(ctx) {
  const {
    BOARD_VISIT_KEY = "bokoun.board-visit.v1",
    BOARD_READ_BOUNDARIES_KEY = "bokoun.board-read-boundaries.v1",
    BOARD_POST_LIMIT = 1_000,
    gmGet = () => ({}),
    gmSet = () => undefined,
    state,
  } = ctx;
  const routeKey = (...args) => ctx.routeKey(...args);
  const normalizeHref = (...args) => ctx.normalizeHref(...args);
  const syncNativeBoardRead = (...args) => ctx.syncNativeBoardRead(...args);

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
        boardId: typeof visit.boardId === "string" ? visit.boardId : "",
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
      laterReadBoundary(visit?.lastRead || "", new Date().toISOString()),
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

  function boardReadTimestamp() {
    return state.boardPosts.reduce(
      (latest, post) => laterReadBoundary(latest, post.datetime),
      state.boardLastPosted || "",
    );
  }

  function reconcileFavoriteReadState(clubs) {
    return clubs.map((club) => {
      const boundary = Date.parse(localReadBoundary(boardPath(club.href)));
      const lastPosted = Date.parse(club.lastPosted);
      return Number.isFinite(boundary)
        && Number.isFinite(lastPosted)
        && boundary >= lastPosted
        ? { ...club, unread: 0 }
        : club;
    });
  }

  function startBoardVisit(
    pageHref,
    {
      id = "",
      lastRead = "",
      newPostsCount = 0,
      unreadCount = newPostsCount,
    } = {},
  ) {
    const path = boardPath(pageHref);
    const visit = {
      boardPath: path,
      boardId: String(id || ""),
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
        return startBoardVisit(pageHref, {
          ...model,
          id: model.id || stored.boardId,
        });
      }
      state.boardVisit = stored;
      return stored;
    }
    return startBoardVisit(pageHref, model);
  }

  function syncBoardVisitRead() {
    const stored = readBoardVisit();
    if (!stored || !state.boardId) return Promise.resolve(false);
    return syncNativeBoardRead(state.boardId, boardReadTimestamp());
  }

  function leaveBoardVisit(path = "") {
    const stored = readBoardVisit();
    if (!stored) {
      state.boardVisit = null;
      return;
    }
    if (path && stored?.boardPath && stored.boardPath !== path) return;
    void syncBoardVisitRead();
    rememberBoardReadBoundary(stored?.boardPath || path);
    state.boardVisit = null;
    if (typeof sessionStorage === "undefined") return;
    try {
      sessionStorage.removeItem(BOARD_VISIT_KEY);
    } catch {
      // Session storage is an enhancement; navigation must still proceed.
    }
  }

  function startBoardVisitFromFavorite(pageHref, unreadCount = 0, boardId = "") {
    return startBoardVisit(pageHref, {
      id: boardId,
      newPostsCount: unreadCount,
    });
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

  function threadFocusId(pageHref = routeKey()) {
    try {
      const url = new URL(pageHref, location.origin);
      return url.searchParams.get("p") || url.searchParams.get("rootId") || "";
    } catch {
      return "";
    }
  }

  function threadBranchFocusId(pageHref = routeKey()) {
    try {
      return new URL(pageHref, location.origin).searchParams.get("branch") || "";
    } catch {
      return "";
    }
  }

  function threadBranchTone(branchId) {
    let hash = 0;
    for (const character of String(branchId || "")) {
      hash = ((hash * 31) + character.charCodeAt(0)) >>> 0;
    }
    return hash % 4;
  }

  function assignThreadBranches(posts, rootId) {
    if (!rootId) return posts.map((post) => ({ ...post }));
    const byId = new Map(posts.map((post) => [String(post.id), post]));
    return posts.map((post) => {
      if (String(post.id) === String(rootId)) {
        return { ...post, threadBranchId: "", threadBranchTone: -1 };
      }

      let branch = post;
      const seen = new Set();
      for (let index = 0; index <= posts.length; index += 1) {
        const branchId = String(branch.id || "");
        const parentId = String(branch.parentId || "");
        if (!parentId || parentId === String(rootId)) break;
        if (seen.has(branchId)) break;
        seen.add(branchId);
        const parent = byId.get(parentId);
        if (!parent || String(parent.id) === String(rootId)) break;
        branch = parent;
      }

      const branchId = String(branch.id || post.id || "");
      return {
        ...post,
        threadBranchId: branchId,
        threadBranchTone: threadBranchTone(branchId),
      };
    });
  }

  function threadPosts(posts, rootId) {
    if (!rootId) return [...posts];
    const members = posts
      .filter((post) => post.id === rootId || post.rootId === rootId)
      .sort((left, right) => {
        const leftTime = Date.parse(left.datetime) || 0;
        const rightTime = Date.parse(right.datetime) || 0;
        return -1 * (
          leftTime - rightTime
          || left.sequence - right.sequence
          || Number(left.id) - Number(right.id)
        );
      });
    return members;
  }

  function resetBoardAccumulator(model, pageHref, { structured = false } = {}) {
    state.boardLoadAbort?.abort();
    state.boardLoadAbort = null;
    const visit = ensureBoardVisit(pageHref, model);
    state.boardKey = boardRouteIdentity(pageHref);
    state.boardId = model.id || visit?.boardId || "";
    state.boardLastPosted = model.lastPosted || "";
    state.boardTitle = model.title;
    state.boardPosts = [];
    state.boardPostIndex = new Map();
    state.boardPostPages = new Map();
    state.boardLoadedPages = new Set();
    state.boardNextHref = "";
    state.boardLoading = false;
    state.boardEnd = false;
    state.boardRetentionLimited = false;
    state.boardError = "";
    state.boardAutoCooldownUntil = 0;
    state.boardStructuredReady = structured;
    mergeBoardPage(model, pageHref, { setNext: true });
  }

  function mergeBoardPage(model, pageHref, { setNext = false } = {}) {
    const normalizedPage = normalizeHref(pageHref);
    let added = 0;
    let retentionLimited = false;

    if (normalizedPage) state.boardLoadedPages.add(normalizedPage);
    if (model.title) state.boardTitle = model.title;
    if (model.id) state.boardId = model.id;
    if (model.lastPosted) state.boardLastPosted = model.lastPosted;

    for (const post of model.posts) {
      const index = state.boardPostIndex.get(post.id);
      if (index === undefined) {
        if (state.boardPosts.length >= BOARD_POST_LIMIT) {
          retentionLimited = true;
          break;
        }
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
    if (
      retentionLimited
      || (state.boardPosts.length >= BOARD_POST_LIMIT && Boolean(model.nextOlderHref))
    ) {
      state.boardRetentionLimited = true;
      state.boardEnd = true;
      state.boardNextHref = "";
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
    if (model.id) state.boardId = model.id;
    if (model.lastPosted) state.boardLastPosted = model.lastPosted;

    for (const post of model.posts) {
      state.boardPostIndex.set(post.id, state.boardPosts.length);
      state.boardPostPages.set(post.id, normalizedPage || post.pageHref);
      state.boardPosts.push({ ...post, pageHref: normalizedPage || post.pageHref });
    }
    for (const { post, pageHref: olderPageHref } of older) {
      if (state.boardPosts.length >= BOARD_POST_LIMIT) {
        state.boardRetentionLimited = true;
        break;
      }
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
    const activeFocusId = threadFocusId();
    const posts = assignThreadBranches(
      threadPosts(state.boardPosts, activeRootId),
      activeRootId,
    );
    const requestedBranchId = threadBranchFocusId();
    const activeBranchId = posts.some((post) => post.threadBranchId === requestedBranchId)
      ? requestedBranchId
      : "";
    return {
      title: state.boardTitle,
      posts,
      threadRootId: activeRootId,
      threadFocusId: activeFocusId,
      threadBranchFocusId: activeBranchId,
      threadCount: posts.length,
      newPostIds: newPostIdsForVisit(state.boardPosts),
      nextOlderHref: state.boardNextHref,
      loading: state.boardLoading,
      end: state.boardEnd,
      retentionLimited: state.boardRetentionLimited,
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
    boardReadTimestamp,
    reconcileFavoriteReadState,
    startBoardVisit,
    ensureBoardVisit,
    syncBoardVisitRead,
    leaveBoardVisit,
    startBoardVisitFromFavorite,
    newPostIdsForVisit,
    threadRootId,
    threadFocusId,
    threadBranchFocusId,
    threadBranchTone,
    assignThreadBranches,
    threadPosts,
    resetBoardAccumulator,
    mergeBoardPage,
    refreshBoardNewestPage,
    boardViewModel,
  });
}
