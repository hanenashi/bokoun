export function installController(ctx) {
  const {
    VERSION,
    BOOT_TIMEOUT_MS,
    ROUTE_POLL_MS,
    SESSION_DISABLED_KEY,
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
  const primeStructuredModel = (...args) => ctx.primeStructuredModel(...args);
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

  function render({ force = false } = {}) {
    if (state.disabled || state.nativeMode) return;
    const type = routeType();

    if (type === "unsupported" || !isMobileEligible()) {
      revealNative();
      return;
    }

    if (!state.host?.isConnected) mountShell();
    applyVisualSettings();

    const previousKey = state.currentRouteKey;
    const key = routeKey();
    primeStructuredModel(type, key);
    const structuredRouteModel = cachedStructuredModel(type, key);
    if (!structuredRouteModel && !nativeReady(type)) return;
    const previousY = state.scroller?.scrollTop || 0;
    let model;
    let readSource = "dom";
    if (type === "favorites") {
      model = structuredRouteModel;
      if (model) readSource = "structured";
      else model = readFavoritesFromDom();
      state.favoriteSourceClubs = model.map((club) => ({ ...club }));
      model = sortFavorites(model);
      state.favoriteViewClubs = model.map((club) => ({ ...club }));
    } else {
      const structuredModel = structuredRouteModel;
      const nativeModel = structuredModel || readBoardFromDom(document, key);
      const structured = Boolean(structuredModel);
      if (structured) readSource = "structured";
      if (state.boardKey !== location.pathname) {
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
    }
    const signature = signatureFor(type, model);
    if (!force && signature === state.currentSignature) return;

    state.currentRouteKey = key;
    state.currentSignature = signature;
    state.host.dataset.readSource = readSource;
    const inner = state.shadow.querySelector(".app-inner");
    inner.innerHTML = type === "favorites" ? favoritesMarkup(model) : boardMarkup(model);
    attachUiEvents();

    restoreScroll(key, previousKey === key ? previousY : 0);
  }

  function scheduleRender({ force = false } = {}) {
    clearTimeout(state.renderTimer);
    state.renderTimer = window.setTimeout(() => render({ force }), 40);
  }

  function handleRouteChange() {
    if (state.disabled || state.nativeMode) return;
    const key = routeKey();
    if (key === state.currentRouteKey) {
      const type = routeType();
      if (type !== "unsupported") primeStructuredModel(type, key);
      return;
    }

    saveScroll();
    state.currentSignature = "";
    state.openHeaderPanel = "";
    state.openPostMenuId = "";
    state.editingFavoriteOrder = false;

    if (routeType() === "unsupported" || !isMobileEligible()) {
      state.currentRouteKey = key;
      revealNative();
      return;
    }

    state.currentRouteKey = key;
    if (!state.host?.isConnected) mountShell();
    state.shadow.querySelector(".app-inner").innerHTML = '<div class="loading" aria-label="Načítám"></div>';
    scheduleRender({ force: true });
  }

  function observeNative() {
    if (state.observing) return;
    state.observer = new MutationObserver(() => scheduleRender());
    state.observer.observe(document.body, { childList: true, subtree: true });
    state.routeTimer = window.setInterval(handleRouteChange, ROUTE_POLL_MS);
    window.addEventListener("popstate", () => window.setTimeout(handleRouteChange, 0));
    window.addEventListener("pagehide", () => {
      persistComposerDraft();
      saveScroll();
    });
    state.observing = true;
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

    mountShell();
    state.currentRouteKey = routeKey();
    observeNative();
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
    scheduleRender,
    handleRouteChange,
    observeNative,
    boot,
  });
}
