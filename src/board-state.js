export function installBoardState(ctx) {
  const {
    state,
  } = ctx;
  const routeKey = (...args) => ctx.routeKey(...args);
  const normalizeHref = (...args) => ctx.normalizeHref(...args);

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
      nextOlderHref: state.boardNextHref,
      loading: state.boardLoading,
      end: state.boardEnd,
      error: state.boardError,
      loadedPageCount: state.boardLoadedPages.size,
    };
  }

  Object.assign(ctx, {
    boardRouteIdentity,
    threadRootId,
    threadPosts,
    resetBoardAccumulator,
    mergeBoardPage,
    refreshBoardNewestPage,
    boardViewModel,
  });
}
