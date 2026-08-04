export function isThreadBranchOnlyChange(previousRoute, nextRoute, origin = "") {
  try {
    const base = origin
      || (typeof location !== "undefined" ? location.origin : "https://kapybara.okoun.cz");
    const previous = new URL(previousRoute, base);
    const next = new URL(nextRoute, base);
    const previousBranch = previous.searchParams.get("branch") || "";
    const nextBranch = next.searchParams.get("branch") || "";
    previous.searchParams.delete("branch");
    next.searchParams.delete("branch");
    return previousBranch !== nextBranch
      && `${previous.pathname}${previous.search}` === `${next.pathname}${next.search}`
      && previous.searchParams.has("rootId");
  } catch {
    return false;
  }
}

export function installController(ctx) {
  const {
    VERSION,
    BOOT_TIMEOUT_MS,
    ROUTE_FALLBACK_POLL_MS,
    ROUTE_DATA_FALLBACK_MS,
    STRUCTURED_RESUME_MS,
    FAVORITES_REFRESH_MS = 60_000,
    SESSION_DISABLED_KEY,
    SELECTORS,
    state,
  } = ctx;
  const routeType = (...args) => ctx.routeType(...args);
  const routeKey = (...args) => ctx.routeKey(...args);
  const isMobileEligible = (...args) => ctx.isMobileEligible(...args);
  const shouldBoot = (...args) => ctx.shouldBoot(...args);
  const waitForBody = (...args) => ctx.waitForBody(...args);
  const mountShell = (...args) => ctx.mountShell(...args);
  const revealNative = (...args) => ctx.revealNative(...args);
  const showReturnControl = (...args) => ctx.showReturnControl(...args);
  const registerMenus = (...args) => ctx.registerMenus(...args);
  const saveScroll = (...args) => ctx.saveScroll(...args);
  const restoreScroll = (...args) => ctx.restoreScroll(...args);
  const nativeReady = (...args) => ctx.nativeReady(...args);
  const readFavoritesFromDom = (...args) => ctx.readFavoritesFromDom(...args);
  const cachedStructuredModel = (...args) => ctx.cachedStructuredModel(...args);
  const structuredModelAge = (...args) => ctx.structuredModelAge(...args);
  const ensureStructuredModel = (...args) => ctx.ensureStructuredModel(...args);
  const abortStructuredRequests = (...args) => ctx.abortStructuredRequests(...args);
  const invalidateStructuredModel = (...args) => ctx.invalidateStructuredModel(...args);
  const trafficSnapshot = (...args) => ctx.trafficSnapshot(...args);
  const resetTrafficCounters = (...args) => ctx.resetTrafficCounters(...args);
  const readBoardFromDom = (...args) => ctx.readBoardFromDom(...args);
  const resetBoardAccumulator = (...args) => ctx.resetBoardAccumulator(...args);
  const mergeBoardPage = (...args) => ctx.mergeBoardPage(...args);
  const refreshBoardNewestPage = (...args) => ctx.refreshBoardNewestPage(...args);
  const boardViewModel = (...args) => ctx.boardViewModel(...args);
  const restoreActiveComposer = (...args) => ctx.restoreActiveComposer(...args);
  const persistComposerDraft = (...args) => ctx.persistComposerDraft(...args);
  const signatureFor = (...args) => ctx.signatureFor(...args);
  const favoritesMarkup = (...args) => ctx.favoritesMarkup(...args);
  const boardMarkup = (...args) => ctx.boardMarkup(...args);
  const attachUiEvents = (...args) => ctx.attachUiEvents(...args);
  const applyVisualSettings = (...args) => ctx.applyVisualSettings(...args);
  const sortFavorites = (...args) => ctx.sortFavorites(...args);
  const currentFavoritesSettings = (...args) => ctx.currentFavoritesSettings(...args);
  const boardRouteIdentity = (...args) => ctx.boardRouteIdentity(...args);
  const navigateNative = (...args) => ctx.navigateNative(...args);
  const leaveBoardVisit = (...args) => ctx.leaveBoardVisit(...args);
  const readBoardVisit = (...args) => ctx.readBoardVisit(...args);
  const reconcileFavoriteReadState = (...args) => ctx.reconcileFavoriteReadState(...args);
  const syncBoardVisitRead = (...args) => ctx.syncBoardVisitRead(...args);
  const revealBokoun = (...args) => ctx.revealBokoun(...args);
  const completeBootHandoff = (...args) => ctx.completeBootHandoff(...args);
  const setLayered = (...args) => ctx.setLayered(...args);
  const setHostReveal = (...args) => ctx.setHostReveal(...args);
  const rememberRecentClub = (...args) => ctx.rememberRecentClub(...args);
  const prepareNavigationTransition = (...args) => ctx.prepareNavigationTransition(...args);
  const consumeNavigationTransition = (...args) => ctx.consumeNavigationTransition(...args);
  const animateRouteEntry = (...args) => ctx.animateRouteEntry(...args);
  const visualLog = (...args) => ctx.visualLog(...args);
  const clearVisualLog = (...args) => ctx.clearVisualLog(...args);
  const watchVisualState = (...args) => ctx.watchVisualState(...args);
  const commitLayerState = (...args) => ctx.commitLayerState(...args);
  const maybeScrollFirstUnread = (...args) => ctx.maybeScrollFirstUnread?.(...args);

  function requestStructuredRefresh(reason, { force = false } = {}) {
    const type = routeType();
    const key = routeKey();
    if (type === "unsupported") return Promise.resolve(null);
    return ensureStructuredModel(type, key, { reason, force });
  }

  function stopFavoritesRefresh() {
    clearTimeout(state.favoritesRefreshTimer);
    state.favoritesRefreshTimer = 0;
  }

  function scheduleFavoritesRefresh() {
    stopFavoritesRefresh();
    if (
      state.disabled
      || state.nativeMode
      || document.visibilityState === "hidden"
      || !["favorites", "board"].includes(routeType())
    ) return;
    state.favoritesRefreshTimer = window.setTimeout(async () => {
      state.favoritesRefreshTimer = 0;
      if (
        state.disabled
        || state.nativeMode
        || document.visibilityState === "hidden"
        || !["favorites", "board"].includes(routeType())
      ) return;
      try {
        await ensureStructuredModel("favorites", favoritesRefreshHref(), {
          reason: "favorites-poll",
          render: routeType() === "favorites",
        });
      } finally {
        scheduleFavoritesRefresh();
      }
    }, FAVORITES_REFRESH_MS);
  }

  function favoritesRefreshHref() {
    const url = new URL("/fav/activity", location.origin);
    if (new URL(location.href).searchParams.get("bokoun") === "on") {
      url.searchParams.set("bokoun", "on");
    }
    return `${url.pathname}${url.search}`;
  }

  function exposeDebugTools() {
    if (typeof window === "undefined") return;
    Object.defineProperty(window, "__bokounDebug", {
      configurable: true,
      value: Object.freeze({
        snapshot: () => trafficSnapshot(),
        reset: () => resetTrafficCounters(),
        refresh: () => requestStructuredRefresh("manual-refresh", { force: true }),
        measure: () => measureRenderScale(),
        visualLog: () => visualLog(),
        clearVisualLog: () => clearVisualLog(),
        watchVisualState: (enabled) => watchVisualState(enabled),
      }),
    });
  }

  function measureRenderScale() {
    const measurements = [];
    for (const count of [100, 500, 1_000]) {
      const posts = Array.from({ length: count }, (_, index) => ({
        id: String(index + 1),
        author: `reader-${index % 12}`,
        avatarUrl: "",
        date: "28.7.2026 12:00:00",
        datetime: "2026-07-28T03:00:00.000Z",
        rootId: "",
        depth: 0,
        bodyHtml: `<p>Kontrolní příspěvek ${index + 1}</p>`,
        replyReference: "",
      }));
      const model = {
        title: "Bokoun render scale",
        posts,
        threadRootId: "",
        threadFocusId: "",
        threadCount: posts.length,
        newPostIds: [],
        nextOlderHref: "",
        loading: false,
        end: true,
        retentionLimited: count >= 1_000,
        loadedPageCount: Math.ceil(count / 20),
      };
      const startedAt = performance.now();
      const template = document.createElement("template");
      template.innerHTML = boardMarkup(model);
      const durationMs = performance.now() - startedAt;
      measurements.push(Object.freeze({
        posts: count,
        renderedPosts: template.content.querySelectorAll("article.post").length,
        durationMs: Math.round(durationMs * 10) / 10,
      }));
    }
    return Object.freeze(measurements);
  }

  function finalizeBoardVisitTransition(previousKey, nextKey) {
    try {
      const previous = new URL(previousKey, location.origin);
      const next = new URL(nextKey, location.origin);
      if (
        routeType(previous.pathname) === "board"
        && previous.pathname !== next.pathname
      ) leaveBoardVisit(previous.pathname);
    } catch {
      // Route parsing failure should not block Kapybara navigation.
    }
  }

  function finalizeStoredBoardVisit(nextKey = routeKey()) {
    const visit = readBoardVisit();
    if (!visit?.boardPath) return;
    try {
      const next = new URL(nextKey, location.origin);
      if (next.pathname !== visit.boardPath) leaveBoardVisit(visit.boardPath);
    } catch {
      // A malformed restored route must not block startup.
    }
  }

  function render({ force = false } = {}) {
    if (state.disabled || state.nativeMode) return;
    const previousKey = state.currentRouteKey;
    const key = routeKey();
    finalizeBoardVisitTransition(previousKey, key);
    const type = routeType();

    if (type === "unsupported" || !isMobileEligible()) {
      stopFavoritesRefresh();
      revealNative();
      return;
    }
    if (type === "favorites" && location.pathname !== "/fav/activity") {
      navigateNative("/fav/activity");
      return;
    }

    if (!state.host?.isConnected) mountShell();
    applyVisualSettings();
    commitLayerState("render-settings-applied");

    const structuredRouteModel = cachedStructuredModel(type, key);
    const isThreadRoute = type === "board"
      && new URL(key, location.origin).searchParams.has("rootId");
    // A thread may arrive through a soft navigation before its structured
    // payload is ready (or when that payload fails). Keep the mounted shell
    // renderable so the DOM fallback can filter the loaded posts instead of
    // leaving the previous full-club view on screen.
    if (!structuredRouteModel && !nativeReady(type)) return;
    const previousY = state.scroller?.scrollTop || 0;
    let model;
    let readSource = "dom";
    if (type === "favorites") {
      model = structuredRouteModel;
      if (model) readSource = "structured";
      else model = readFavoritesFromDom();
      model = reconcileFavoriteReadState(model);
      state.favoriteSourceClubs = model.map((club) => ({ ...club }));
      if (currentFavoritesSettings().unreadOnly) {
        model = model.filter((club) => club.unread > 0);
      }
      model = sortFavorites(model);
      state.favoriteViewClubs = model.map((club) => ({ ...club }));
    } else {
      const structuredModel = structuredRouteModel;
      const nativeModel = structuredModel || readBoardFromDom(document, key);
      const structured = Boolean(structuredModel);
      if (structured) readSource = "structured";
      const retainLoadedThread = (
        isThreadRoute
        && !structured
        && state.boardPosts.length > 0
        && new URL(state.boardKey, location.origin).pathname
          === new URL(key, location.origin).pathname
      );
      if (retainLoadedThread) {
        // The normal club model already carries rootId for every loaded reply.
        // Keep it when Kapybara's new thread endpoint is slow or unavailable;
        // boardViewModel() can filter the complete loaded thread immediately.
        readSource = state.host.dataset.readSource || readSource;
      } else if (state.boardKey !== boardRouteIdentity(key)) {
        resetBoardAccumulator(nativeModel, key, { structured });
      } else if (
        structured
        && !new URL(key, location.origin).searchParams.has("f")
      ) {
        refreshBoardNewestPage(nativeModel, key);
        state.boardStructuredReady = true;
      } else {
        mergeBoardPage(nativeModel, key, {
          setNext: structured && !state.boardStructuredReady,
        });
        if (structured) state.boardStructuredReady = true;
      }
      restoreActiveComposer();
      model = boardViewModel();
      rememberRecentClub(location.pathname, model.title);
    }
    const signature = signatureFor(type, model);
    if (!force && signature === state.currentSignature) return;

    state.currentRouteKey = key;
    state.currentSignature = signature;
    state.host.dataset.readSource = readSource;
    const inner = state.shadow.querySelector(".app-inner");
    inner.innerHTML = type === "favorites" ? favoritesMarkup(model) : boardMarkup(model);
    attachUiEvents();
    commitLayerState("render-committed");

    const transitionDirection = consumeNavigationTransition(key);
    const scrollReady = restoreScroll(key, previousKey === key ? previousY : 0);
    maybeScrollFirstUnread({ model, key, restorePromise: scrollReady });
    if (transitionDirection) {
      void scrollReady.then(() => {
        if (state.currentRouteKey !== key) return;
        const animation = animateRouteEntry(transitionDirection);
        if (state.revealPending) {
          void Promise.all([
            animation,
            revealBokoun({ initial: true, instant: true }),
          ]).then(([, revealed]) => {
            if (revealed && state.currentRouteKey === key) void completeBootHandoff();
          });
        }
        return animation;
      });
    } else if (state.revealPending) {
      void revealBokoun({ initial: true, instant: true }).then((revealed) => {
        if (revealed && state.currentRouteKey === key) void completeBootHandoff();
      });
    }
  }

  function scheduleRender({ force = false } = {}) {
    clearTimeout(state.renderTimer);
    state.renderTimer = window.setTimeout(() => render({ force }), 40);
  }

  function handleRouteChange() {
    if (state.disabled || state.nativeMode) return;
    const key = routeKey();
    if (key === state.currentRouteKey) return;

    if (isThreadBranchOnlyChange(state.currentRouteKey, key)) {
      state.currentRouteKey = key;
      state.currentSignature = "";
      state.openHeaderPanel = "";
      state.openPostMenuId = "";
      scheduleRender({ force: true });
      return;
    }

    prepareNavigationTransition(key, {
      direction: state.historyTraversalPending ? "back" : "",
      sourceHref: state.currentRouteKey,
      persist: false,
      preserveExisting: true,
    });
    state.historyTraversalPending = false;
    finalizeBoardVisitTransition(state.currentRouteKey, key);

    saveScroll();
    state.currentSignature = "";
    state.openHeaderPanel = "";
    state.openPostMenuId = "";
    state.editingFavoriteOrder = false;
    clearTimeout(state.routeFallbackTimer);

    if (routeType() === "unsupported" || !isMobileEligible()) {
      stopFavoritesRefresh();
      state.currentRouteKey = key;
      revealNative();
      return;
    }

    state.currentRouteKey = key;
    const type = routeType();
    scheduleFavoritesRefresh();
    const reusePolledFavorites = (
      type === "favorites"
      && structuredModelAge(type, key) < FAVORITES_REFRESH_MS
    );
    abortStructuredRequests(reusePolledFavorites ? type : "", reusePolledFavorites ? key : "");
    if (!reusePolledFavorites) invalidateStructuredModel(type, key);
    if (!state.host?.isConnected) mountShell();
    const outgoingRoute = state.shadow.querySelector(".route-content");
    if (outgoingRoute) {
      outgoingRoute.dataset.routePending = "true";
      outgoingRoute.setAttribute("aria-busy", "true");
      outgoingRoute.inert = true;
    }
    commitLayerState("route-waiting-committed");
    state.routeFallbackTimer = window.setTimeout(() => {
      const isThreadRoute = type === "board"
        && new URL(key, location.origin).searchParams.has("rootId");
      if (
        state.currentRouteKey === key
        && (!nativeReady(type) || isThreadRoute)
        && !cachedStructuredModel(type, key)
      ) {
        void requestStructuredRefresh("route-transition");
      }
    }, ROUTE_DATA_FALLBACK_MS);
    scheduleRender({ force: true });
  }

  function handleVisibilityChange() {
    if (document.visibilityState === "hidden") {
      state.hiddenAt = Date.now();
      persistComposerDraft();
      saveScroll();
      state.boardLoadAbort?.abort();
      suspendNativeObservation();
      if (routeType() === "board") void syncBoardVisitRead();
      return;
    }

    const hiddenFor = state.hiddenAt ? Date.now() - state.hiddenAt : 0;
    state.hiddenAt = 0;
    resumeNativeObservation();
    handleRouteChange();
    if (
      state.disabled
      || state.nativeMode
      || hiddenFor < STRUCTURED_RESUME_MS
    ) return;
    void requestStructuredRefresh("visibility-resume");
  }

  function nativeObservationRoot() {
    const anchor = document.querySelector(
      `${SELECTORS.favoritesPage}, ${SELECTORS.boardHeader}`,
    );
    if (!anchor) return null;
    let root = anchor;
    while (root.parentElement && root.parentElement !== document.body) {
      root = root.parentElement;
    }
    return root === state.host ? null : root;
  }

  function connectNativeObserver() {
    if (!state.observer || document.visibilityState === "hidden") return;
    state.observer.disconnect();
    state.observer.observe(document.body, { childList: true });
    const root = nativeObservationRoot();
    state.observedNativeRoot = root;
    if (root && root !== document.body) {
      state.observer.observe(root, { childList: true, subtree: true });
    }
  }

  function startRouteFallback() {
    clearInterval(state.routeTimer);
    if (document.visibilityState === "hidden") return;
    state.routeTimer = window.setInterval(handleRouteChange, ROUTE_FALLBACK_POLL_MS);
  }

  function suspendNativeObservation() {
    clearInterval(state.routeTimer);
    state.routeTimer = 0;
    stopFavoritesRefresh();
    state.observer?.disconnect();
    state.observedNativeRoot = null;
  }

  function resumeNativeObservation() {
    if (!state.observing || state.disabled || state.nativeMode) return;
    connectNativeObserver();
    startRouteFallback();
    scheduleFavoritesRefresh();
  }

  function queueRouteCheck() {
    clearTimeout(state.routeEventTimer);
    state.routeEventTimer = window.setTimeout(handleRouteChange, 0);
  }

  function patchHistoryNavigation() {
    if (state.patchedPushState || state.patchedReplaceState) return;
    state.originalPushState = history.pushState;
    state.originalReplaceState = history.replaceState;
    state.patchedPushState = function bokounPushState(...args) {
      const result = state.originalPushState.apply(this, args);
      queueRouteCheck();
      return result;
    };
    state.patchedReplaceState = function bokounReplaceState(...args) {
      const result = state.originalReplaceState.apply(this, args);
      queueRouteCheck();
      return result;
    };
    history.pushState = state.patchedPushState;
    history.replaceState = state.patchedReplaceState;
  }

  function restoreHistoryNavigation() {
    if (history.pushState === state.patchedPushState && state.originalPushState) {
      history.pushState = state.originalPushState;
    }
    if (history.replaceState === state.patchedReplaceState && state.originalReplaceState) {
      history.replaceState = state.originalReplaceState;
    }
    state.originalPushState = null;
    state.originalReplaceState = null;
    state.patchedPushState = null;
    state.patchedReplaceState = null;
  }

  function handlePageHide() {
    persistComposerDraft();
    saveScroll();
    if (routeType() === "board") void syncBoardVisitRead();
  }

  function observeNative() {
    if (state.observing) return;
    state.observer = new MutationObserver((records) => {
      if (
        !state.observedNativeRoot?.isConnected
        || records.some((record) => record.target === document.body)
      ) connectNativeObserver();
      scheduleRender();
    });
    state.popStateHandler = () => {
      if (state.openHeaderPanel && routeKey() === state.currentRouteKey) {
        state.openHeaderPanel = "";
        state.currentSignature = "";
        scheduleRender({ force: true });
        return;
      }
      state.historyTraversalPending = true;
      queueRouteCheck();
    };
    state.hashChangeHandler = queueRouteCheck;
    state.pageHideHandler = handlePageHide;
    patchHistoryNavigation();
    window.addEventListener("popstate", state.popStateHandler);
    window.addEventListener("hashchange", state.hashChangeHandler);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", state.pageHideHandler);
    state.observing = true;
    resumeNativeObservation();
  }

  function stopRouteObservation() {
    suspendNativeObservation();
    clearTimeout(state.routeEventTimer);
    state.routeEventTimer = 0;
    if (state.popStateHandler) {
      window.removeEventListener("popstate", state.popStateHandler);
    }
    if (state.hashChangeHandler) {
      window.removeEventListener("hashchange", state.hashChangeHandler);
    }
    if (state.pageHideHandler) {
      window.removeEventListener("pagehide", state.pageHideHandler);
    }
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    restoreHistoryNavigation();
    state.observer = null;
    state.popStateHandler = null;
    state.hashChangeHandler = null;
    state.pageHideHandler = null;
    state.observing = false;
  }

  async function boot() {
    registerMenus();
    if (!shouldBoot()) {
      delete document.documentElement.dataset.bokounBooting;
      if (sessionStorage.getItem(SESSION_DISABLED_KEY) === "1") {
        await waitForBody();
        showReturnControl();
      }
      return;
    }

    await waitForBody();
    if (!shouldBoot()) {
      delete document.documentElement.dataset.bokounBooting;
      if (sessionStorage.getItem(SESSION_DISABLED_KEY) === "1") showReturnControl();
      return;
    }

    state.revealPending = true;
    setLayered("transition", true);
    mountShell();
    setHostReveal(0);
    finalizeStoredBoardVisit();
    state.currentRouteKey = routeKey();
    observeNative();
    exposeDebugTools();
    void requestStructuredRefresh("initial-route");
    render({ force: true });

    state.bootTimer = window.setTimeout(() => {
      const type = routeType();
      if (!nativeReady(type) && !cachedStructuredModel(type, routeKey())) {
        console.warn(`[Bokoun ${VERSION}] Native page was not ready; restored full Kapybara.`);
        revealNative({ stop: true });
      }
    }, BOOT_TIMEOUT_MS);
  }

  Object.assign(ctx, {
    render,
    finalizeBoardVisitTransition,
    finalizeStoredBoardVisit,
    scheduleRender,
    handleRouteChange,
    handleVisibilityChange,
    nativeObservationRoot,
    connectNativeObserver,
    startRouteFallback,
    suspendNativeObservation,
    resumeNativeObservation,
    queueRouteCheck,
    patchHistoryNavigation,
    restoreHistoryNavigation,
    handlePageHide,
    requestStructuredRefresh,
    stopFavoritesRefresh,
    scheduleFavoritesRefresh,
    exposeDebugTools,
    measureRenderScale,
    observeNative,
    stopRouteObservation,
    boot,
  });
}
