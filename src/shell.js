export function canonicalScrollRoute(route, origin = "") {
  try {
    const base = origin
      || (typeof location !== "undefined" ? location.origin : "https://kapybara.okoun.cz");
    const url = new URL(route, base);
    url.searchParams.delete("bokoun");
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return route;
  }
}

export function installShell(ctx) {
  const {
    VERSION,
    HOST_ID,
    RETURN_HOST_ID,
    COMPARE_HOST_ID,
    MOBILE_QUERY,
    SESSION_DISABLED_KEY,
    SCROLL_KEY,
    SCROLL_SAVE_DELAY_MS = 250,
    SCROLL_ROUTE_LIMIT = 30,
    PREF_ENABLED_KEY,
    SELECTORS,
    STYLES,
    state,
    gmGet,
    gmSet,
    gmMenu,
  } = ctx;
  const maybeLoadOlder = (...args) => ctx.maybeLoadOlder(...args);
  const captureBokounAnchor = (...args) => ctx.captureBokounAnchor(...args);
  const restoreNativeAnchor = (...args) => ctx.restoreNativeAnchor(...args);
  const navigateNativeRoute = (...args) => ctx.navigateNativeRoute(...args);
  const returnToBokoun = (...args) => ctx.returnToBokoun(...args);
  const stopRouteObservation = (...args) => ctx.stopRouteObservation?.(...args);
  const currentDisplaySettings = (...args) => ctx.currentDisplaySettings(...args);

  function routeType(pathname = location.pathname) {
    if (pathname === "/fav/activity" || pathname === "/fav/topics") return "favorites";
    if (/^\/boards\/[^/]+\/?$/.test(pathname)) return "board";
    return "unsupported";
  }

  function routeKey() {
    return `${location.pathname}${location.search}`;
  }

  function isMobileEligible() {
    const params = new URLSearchParams(location.search);
    if (params.get("bokoun") === "on") return true;
    if (params.get("bokoun") === "off") return false;
    return matchMedia(MOBILE_QUERY).matches;
  }

  function shouldBoot() {
    return Boolean(gmGet(PREF_ENABLED_KEY, true))
      && sessionStorage.getItem(SESSION_DISABLED_KEY) !== "1"
      && isMobileEligible()
      && routeType() !== "unsupported";
  }

  function installGlobalStyle() {
    if (document.getElementById("bokoun-global-style")) return;
    const style = document.createElement("style");
    style.id = "bokoun-global-style";
    style.textContent = `
      html[data-bokoun-booting="true"] body {
        visibility: hidden !important;
      }
      html[data-bokoun-active="true"] body > :not(#${HOST_ID}):not(#${COMPARE_HOST_ID}) {
        display: none !important;
      }
      html[data-bokoun-active="true"][data-bokoun-layered="true"] body > :not(#${HOST_ID}):not(#${COMPARE_HOST_ID}),
      html[data-bokoun-active="true"][data-bokoun-bridge="true"] body > :not(#${HOST_ID}):not(#${COMPARE_HOST_ID}) {
        display: revert !important;
      }
      html[data-bokoun-active="true"][data-bokoun-layered="true"] body > :not(#${HOST_ID}):not(#${COMPARE_HOST_ID}) {
        pointer-events: none !important;
      }
      html[data-bokoun-active="true"][data-bokoun-layered="true"],
      html[data-bokoun-active="true"][data-bokoun-layered="true"] body {
        height: auto !important;
        overflow: hidden !important;
      }
      html[data-bokoun-active="true"],
      html[data-bokoun-active="true"] body {
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        overflow: hidden !important;
        background: #fff !important;
      }
      html[data-bokoun-active="true"][data-bokoun-aligning="true"],
      html[data-bokoun-active="true"][data-bokoun-aligning="true"] body {
        height: auto !important;
        overflow: auto !important;
      }
      #${HOST_ID} {
        display: block !important;
        visibility: visible !important;
        position: fixed !important;
        inset: 0 !important;
        z-index: 2147483647 !important;
      }
      #${COMPARE_HOST_ID} {
        display: block !important;
        visibility: visible !important;
      }
    `;
    document.documentElement.append(style);
  }

  function startPaintGuard() {
    if (shouldBoot()) {
      document.documentElement.dataset.bokounBooting = "true";
      installGlobalStyle();
    }
  }

  function waitForDocumentElement() {
    if (document.documentElement) return Promise.resolve();
    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        if (!document.documentElement) return;
        observer.disconnect();
        resolve();
      });
      observer.observe(document, { childList: true });
    });
  }

  function waitForBody() {
    if (document.body) return Promise.resolve();
    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        if (!document.body) return;
        observer.disconnect();
        resolve();
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    });
  }

  function fullscreenEnabled() {
    return currentDisplaySettings().fullscreenMode !== false;
  }

  function fullscreenGestureAllowed(event) {
    if (!event?.isTrusted || !state.active || state.nativeMode) return false;
    return !event.composedPath().some((node) => (
      node instanceof Element
      && (
        node.matches("a, input, select, textarea")
        || node.matches("[data-native-href]")
        || node.matches("[data-action='full']")
        || node.matches("[data-action='back']")
        || node.matches("[data-action='thread-back']")
        || node.matches("[data-action='thread']")
        || node.matches("[data-setting='fullscreen-mode']")
      )
    ));
  }

  async function requestBokounFullscreen({ force = false } = {}) {
    if (
      !fullscreenEnabled()
      || !state.active
      || state.nativeMode
      || state.fullscreenRequestPending
    ) return false;
    if (document.fullscreenElement) return true;
    if (force) state.fullscreenSuppressed = false;
    if (state.fullscreenSuppressed) return false;
    const request = document.documentElement?.requestFullscreen;
    if (typeof request !== "function") {
      state.fullscreenSuppressed = true;
      return false;
    }

    state.fullscreenRequestPending = true;
    try {
      await request.call(document.documentElement);
      state.fullscreenOwned = document.fullscreenElement === document.documentElement;
      if (
        state.fullscreenOwned
        && (!state.active || state.nativeMode || !fullscreenEnabled())
      ) {
        await exitBokounFullscreen();
        return false;
      }
      state.fullscreenSuppressed = !state.fullscreenOwned;
      return state.fullscreenOwned;
    } catch {
      state.fullscreenOwned = false;
      state.fullscreenSuppressed = true;
      return false;
    } finally {
      state.fullscreenRequestPending = false;
    }
  }

  async function exitBokounFullscreen({ suppress = true } = {}) {
    if (suppress) state.fullscreenSuppressed = true;
    if (!state.fullscreenOwned || !document.fullscreenElement) {
      state.fullscreenOwned = false;
      return false;
    }
    state.fullscreenOwned = false;
    try {
      await document.exitFullscreen();
      return true;
    } catch {
      return false;
    }
  }

  function handleFullscreenChange() {
    const active = Boolean(document.fullscreenElement);
    if (state.scroller) state.scroller.dataset.fullscreen = active ? "active" : "inactive";
    if (!active && state.fullscreenOwned) {
      state.fullscreenOwned = false;
      state.fullscreenSuppressed = true;
    }
  }

  function handleFullscreenGesture(event) {
    if (!fullscreenEnabled() || !fullscreenGestureAllowed(event)) return;
    void requestBokounFullscreen();
  }

  function syncFullscreenMode() {
    if (!fullscreenEnabled()) {
      void exitBokounFullscreen();
      return;
    }
    if (state.scroller) {
      state.scroller.dataset.fullscreen = document.fullscreenElement ? "active" : "inactive";
    }
  }

  function mountShell() {
    if (state.host?.isConnected) return;

    document.getElementById(RETURN_HOST_ID)?.remove();
    const host = document.createElement("div");
    host.id = HOST_ID;
    host.setAttribute("role", "application");
    host.setAttribute("aria-label", "Bokoun");
    const shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>${STYLES}</style>
      <main class="app" tabindex="-1">
        <div class="app-inner">
          <div class="loading" aria-label="Načítám"></div>
        </div>
      </main>
    `;
    document.body.append(host);

    state.host = host;
    state.shadow = shadow;
    state.scroller = shadow.querySelector(".app");
    state.scroller.addEventListener("scroll", handleBokounScroll, { passive: true });
    shadow.addEventListener("click", handleFullscreenGesture, { capture: true });
    if (!state.fullscreenChangeHandler) {
      state.fullscreenChangeHandler = handleFullscreenChange;
      document.addEventListener("fullscreenchange", state.fullscreenChangeHandler);
    }
    state.active = true;
    document.documentElement.dataset.bokounActive = "true";
    delete document.documentElement.dataset.bokounBooting;
  }

  function prefersReducedMotion() {
    return matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function setLayered(reason, enabled) {
    if (enabled) state.layerReasons.add(reason);
    else state.layerReasons.delete(reason);
    if (!document.documentElement) return;
    if (state.layerReasons.size) document.documentElement.dataset.bokounLayered = "true";
    else delete document.documentElement.dataset.bokounLayered;
  }

  function setHostReveal(percent) {
    const normalized = Math.min(100, Math.max(0, Number(percent) || 0));
    state.comparePercent = normalized;
    if (state.host) {
      state.host.style.clipPath = `inset(0 ${100 - normalized}% 0 0)`;
    }
    const control = state.compareHost?.shadowRoot?.querySelector("[role='slider']");
    if (control) {
      control.style.setProperty("--compare-percent", `${normalized}%`);
      control.setAttribute("aria-valuenow", String(Math.round(normalized)));
      control.setAttribute(
        "aria-valuetext",
        `${Math.round(normalized)} % Bokoun, ${Math.round(100 - normalized)} % Kapybara`,
      );
    }
  }

  function animateHostReveal(from, to) {
    const host = state.host;
    if (!host) return Promise.resolve();
    if (prefersReducedMotion() || typeof host.animate !== "function") {
      setHostReveal(to);
      return Promise.resolve();
    }
    const entering = to > from;
    setHostReveal(100);
    const animation = host.animate(
      entering
        ? [
            { filter: "blur(16px)", opacity: 0 },
            { filter: "blur(0)", opacity: 1 },
          ]
        : [
            { filter: "blur(0)", opacity: 1 },
            { filter: "blur(16px)", opacity: 0 },
          ],
      { duration: 220, easing: "cubic-bezier(.22,.7,.25,1)", fill: "forwards" },
    );
    return animation.finished.catch(() => undefined).then(() => {
      animation.cancel();
      setHostReveal(to);
    });
  }

  function removeCompareHandle() {
    state.compareHost?.remove();
    state.compareHost = null;
    state.compareAnchor = null;
    setLayered("compare", false);
    if (state.active) setHostReveal(100);
  }

  function showCompareHandle() {
    if (!state.active || !state.host || state.compareHost?.isConnected) return;
    setLayered("compare", true);
    setHostReveal(100);

    const host = document.createElement("div");
    host.id = COMPARE_HOST_ID;
    const shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host {
          all: initial;
          position: fixed;
          inset: 0;
          z-index: 2147483647;
          display: block;
          pointer-events: none;
        }
        button {
          --compare-percent: 100%;
          position: absolute;
          top: 0;
          bottom: 0;
          left: clamp(0px, var(--compare-percent), 100%);
          width: 44px;
          margin: 0;
          padding: 0;
          border: 0;
          background: transparent;
          color: #a85a00;
          cursor: ew-resize;
          pointer-events: auto;
          touch-action: none;
          transform: translateX(-50%);
          -webkit-tap-highlight-color: transparent;
        }
        button::before {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 21px;
          width: 2px;
          background: currentColor;
          box-shadow: 0 0 0 1px rgba(255,255,255,.7);
        }
        span {
          position: absolute;
          top: 50%;
          left: 50%;
          display: grid;
          width: 32px;
          height: 56px;
          place-items: center;
          border: 1px solid currentColor;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 2px 12px rgba(0,0,0,.22);
          color: currentColor;
          font: 700 15px/1 system-ui, sans-serif;
          transform: translate(-50%, -50%);
        }
        button:focus-visible span {
          outline: 3px solid #a85a00;
          outline-offset: 2px;
        }
      </style>
      <button
        type="button"
        role="slider"
        aria-label="Porovnání Bokouna a Kapybary"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="100"
      ><span aria-hidden="true">↔</span></button>
    `;
    document.body.append(host);
    state.compareHost = host;
    const slider = shadow.querySelector("[role='slider']");

    const updateFromClientX = (clientX) => {
      const width = Math.max(1, document.documentElement.clientWidth);
      setHostReveal((clientX / width) * 100);
    };
    slider.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      state.compareAnchor = captureBokounAnchor();
      restoreNativeAnchor(state.compareAnchor);
      slider.setPointerCapture(event.pointerId);
      updateFromClientX(event.clientX);
    });
    slider.addEventListener("pointermove", (event) => {
      if (!slider.hasPointerCapture(event.pointerId)) return;
      updateFromClientX(event.clientX);
    });
    slider.addEventListener("keydown", (event) => {
      const amounts = { ArrowLeft: -5, ArrowRight: 5, Home: -100, End: 100 };
      if (!(event.key in amounts)) return;
      event.preventDefault();
      if (!state.compareAnchor) {
        state.compareAnchor = captureBokounAnchor();
        restoreNativeAnchor(state.compareAnchor);
      }
      setHostReveal(
        event.key === "Home" ? 0
          : event.key === "End" ? 100
            : state.comparePercent + amounts[event.key],
      );
    });
    setHostReveal(state.comparePercent);
  }

  function syncCompareMode() {
    if (!state.active || state.nativeMode || state.revealRunning) return;
    if (currentDisplaySettings().compareHandle) showCompareHandle();
    else removeCompareHandle();
  }

  async function revealBokoun({ initial = false, instant = false } = {}) {
    if (!state.host || state.revealRunning) return;
    state.revealPending = false;
    state.revealRunning = true;
    removeCompareHandle();
    setLayered("transition", true);
    if (instant) setHostReveal(100);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    if (!instant) await animateHostReveal(0, 100);
    setLayered("transition", false);
    state.revealRunning = false;
    syncCompareMode();
    if (initial) state.host?.setAttribute("data-initial-reveal-complete", "true");
  }

  function revealNative({ stop = false } = {}) {
    saveScroll();
    void exitBokounFullscreen();
    state.active = false;
    state.revealPending = false;
    state.revealRunning = false;
    removeCompareHandle();
    state.layerReasons.clear();
    if (document.documentElement) {
      delete document.documentElement.dataset.bokounBooting;
      delete document.documentElement.dataset.bokounActive;
      delete document.documentElement.dataset.bokounLayered;
    }
    state.host?.remove();
    state.host = null;
    state.shadow = null;
    state.scroller = null;
    state.currentSignature = "";

    if (stop) {
      state.disabled = true;
      clearTimeout(state.bootTimer);
      clearTimeout(state.renderTimer);
      clearTimeout(state.routeFallbackTimer);
      stopRouteObservation();
    }
  }

  async function openFullKapybara() {
    const anchor = captureBokounAnchor();
    sessionStorage.setItem(SESSION_DISABLED_KEY, "1");
    state.nativeMode = true;

    if (anchor?.pageHref) {
      try {
        await navigateNativeRoute(anchor.pageHref, anchor.postId);
      } catch (error) {
        console.warn(`[Bokoun ${VERSION}] Could not align the native page; using the closest loaded position.`, error?.name || "Error");
      }
    }

    removeCompareHandle();
    setLayered("transition", true);
    restoreNativeAnchor(anchor);
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    await animateHostReveal(100, 0);
    revealNative();
    showReturnControl();
  }

  function showReturnControl() {
    if (!document.body || document.getElementById(RETURN_HOST_ID)) return;

    const host = document.createElement("div");
    host.id = RETURN_HOST_ID;
    const shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host {
          all: initial;
          position: fixed;
          right: 12px;
          bottom: max(72px, calc(env(safe-area-inset-bottom) + 60px));
          z-index: 2147483646;
          display: block;
        }

        button {
          display: grid;
          width: 44px;
          height: 44px;
          place-items: center;
          padding: 0;
          border: 1px solid #a85a00;
          border-radius: 50%;
          background: #ffffff;
          color: #a85a00;
          font: 700 19px/1 Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        button:focus-visible {
          outline: 2px solid #a85a00;
          outline-offset: 2px;
        }
      </style>
      <button type="button" aria-label="Zpět do Bokouna" title="Zpět do Bokouna">B</button>
    `;
    shadow.querySelector("button").addEventListener("click", returnToBokoun);
    document.body.append(host);
  }

  function registerMenus() {
    if (sessionStorage.getItem(SESSION_DISABLED_KEY) === "1") {
      gmMenu("Bokoun: zapnout v tomto panelu", returnToBokoun);
    } else {
      gmMenu("Bokoun: otevřít plnou Kapybaru", openFullKapybara);
    }

    gmMenu(
      gmGet(PREF_ENABLED_KEY, true) ? "Bokoun: vypnout trvale" : "Bokoun: zapnout trvale",
      () => {
        const next = !gmGet(PREF_ENABLED_KEY, true);
        gmSet(PREF_ENABLED_KEY, next);
        sessionStorage.removeItem(SESSION_DISABLED_KEY);
        location.reload();
      },
    );
  }

  function getScrollMap() {
    try {
      return JSON.parse(sessionStorage.getItem(SCROLL_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function scrollEntryKey(route) {
    return `${SCROLL_KEY}:${encodeURIComponent(canonicalScrollRoute(route))}`;
  }

  function scrollIndexKey() {
    return `${SCROLL_KEY}.index`;
  }

  function getScrollIndex() {
    try {
      const index = JSON.parse(sessionStorage.getItem(scrollIndexKey()) || "[]");
      return Array.isArray(index) ? index.filter((route) => typeof route === "string") : [];
    } catch {
      return [];
    }
  }

  function touchScrollRoute(route) {
    const normalizedRoute = canonicalScrollRoute(route);
    const index = [
      normalizedRoute,
      ...getScrollIndex().filter((entry) => entry !== normalizedRoute),
    ];
    const retained = index.slice(0, SCROLL_ROUTE_LIMIT);
    for (const evicted of index.slice(SCROLL_ROUTE_LIMIT)) {
      sessionStorage.removeItem(scrollEntryKey(evicted));
    }
    sessionStorage.setItem(scrollIndexKey(), JSON.stringify(retained));
  }

  function storedScroll(route) {
    const raw = sessionStorage.getItem(scrollEntryKey(route));
    if (raw !== null) {
      const value = Number(raw);
      if (Number.isFinite(value)) return Math.max(0, value);
    }
    const legacyRaw = sessionStorage.getItem(
      `${SCROLL_KEY}:${encodeURIComponent(route)}`,
    );
    if (legacyRaw !== null) {
      const value = Number(legacyRaw);
      if (Number.isFinite(value)) return Math.max(0, value);
    }
    const map = getScrollMap();
    return map[canonicalScrollRoute(route)] ?? map[route];
  }

  function saveScroll() {
    if (!state.scroller || !state.currentRouteKey) return;
    const route = canonicalScrollRoute(state.currentRouteKey);
    const value = Math.max(0, Math.round(state.scroller.scrollTop));
    if (storedScroll(route) === value) return;
    sessionStorage.setItem(scrollEntryKey(route), String(value));
    touchScrollRoute(route);
  }

  function scheduleScrollSave() {
    clearTimeout(state.saveTimer);
    state.saveTimer = window.setTimeout(saveScroll, SCROLL_SAVE_DELAY_MS);
  }

  function handleBokounScroll() {
    scheduleScrollSave();
    maybeLoadOlder();
  }

  function restoreScroll(key, fallback = 0) {
    const y = storedScroll(key) ?? fallback;
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          state.scroller?.scrollTo({ top: y, behavior: "auto" });
          resolve(y);
        });
      });
    });
  }

  function nativeReady(type) {
    if (type === "favorites") {
      return Boolean(document.querySelector(SELECTORS.favoritesPage));
    }
    if (type === "board") {
      return Boolean(
        document.querySelector(SELECTORS.boardHeader)
        && (
          document.querySelector(SELECTORS.posts)
          || document.querySelector(".posts, .empty-state, .board-page")
        )
      );
    }
    return false;
  }

  Object.assign(ctx, {
    routeType,
    routeKey,
    isMobileEligible,
    shouldBoot,
    installGlobalStyle,
    startPaintGuard,
    waitForDocumentElement,
    waitForBody,
    mountShell,
    prefersReducedMotion,
    requestBokounFullscreen,
    exitBokounFullscreen,
    handleFullscreenChange,
    handleFullscreenGesture,
    syncFullscreenMode,
    revealNative,
    setLayered,
    setHostReveal,
    animateHostReveal,
    showCompareHandle,
    removeCompareHandle,
    syncCompareMode,
    revealBokoun,
    openFullKapybara,
    showReturnControl,
    registerMenus,
    getScrollMap,
    scrollEntryKey,
    getScrollIndex,
    storedScroll,
    saveScroll,
    scheduleScrollSave,
    handleBokounScroll,
    restoreScroll,
    nativeReady,
  });
}
