export function installShell(ctx) {
  const {
    VERSION,
    HOST_ID,
    RETURN_HOST_ID,
    COMPARE_HOST_ID,
    MOBILE_QUERY,
    SESSION_DISABLED_KEY,
    PREF_ENABLED_KEY,
    SELECTORS,
    STYLES,
    state,
    gmGet,
    gmSet,
    gmMenu,
  } = ctx;
  const saveScroll = (...args) => ctx.saveScroll(...args);
  const handleBokounScroll = (...args) => ctx.handleBokounScroll(...args);
  const captureBokounAnchor = (...args) => ctx.captureBokounAnchor(...args);
  const restoreNativeAnchor = (...args) => ctx.restoreNativeAnchor(...args);
  const navigateNativeRoute = (...args) => ctx.navigateNativeRoute(...args);
  const returnToBokoun = (...args) => ctx.returnToBokoun(...args);
  const stopRouteObservation = (...args) => ctx.stopRouteObservation?.(...args);
  const exitBokounFullscreen = (...args) => ctx.exitBokounFullscreen(...args);
  const handleFullscreenChange = (...args) => ctx.handleFullscreenChange(...args);
  const handleFullscreenGesture = (...args) => ctx.handleFullscreenGesture(...args);
  const removeCompareHandle = (...args) => ctx.removeCompareHandle(...args);
  const syncCompareMode = (...args) => ctx.syncCompareMode(...args);

  function routeType(pathname = location.pathname) {
    if (pathname === "/") return "active";
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
      html[data-bokoun-booting="true"] {
        background: #f4f2ee !important;
        color-scheme: light dark;
      }
      html[data-bokoun-booting="true"]::before {
        content: "";
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        height: 100dvh;
        z-index: 2147483647;
        background: #f4f2ee;
        pointer-events: auto;
      }
      html[data-bokoun-booting="true"] body {
        visibility: hidden !important;
      }
      html[data-bokoun-booting="true"] #${HOST_ID} {
        z-index: 2147483646 !important;
      }
      @media (prefers-color-scheme: dark) {
        html[data-bokoun-booting="true"],
        html[data-bokoun-booting="true"]::before {
          background: #17191b !important;
        }
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
      /* Fullscreen changes the browser gesture negotiation surface. Explicitly
         retain pinch zoom for both Firefox and Chromium-based mobile browsers. */
      html:fullscreen,
      html:fullscreen body,
      #${HOST_ID}:fullscreen {
        touch-action: pan-x pan-y pinch-zoom !important;
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
        opacity: 1 !important;
        background: #fff;
        isolation: isolate;
        contain: layout paint style;
        backface-visibility: hidden;
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
      installGlobalStyle();
      document.documentElement.dataset.bokounBooting = "true";
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
          <div class="startup-shell" role="status" aria-label="Spouštím Bokouna"></div>
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
    state.visualIntent = "bokoun";
    commitLayerState("mount-shell");
  }

  function prefersReducedMotion() {
    return matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function visualExposureAllowed() {
    return state.nativeMode
      || state.layerReasons.has("transition")
      || state.layerReasons.has("compare");
  }

  function visualSnapshot(action = "snapshot") {
    const host = state.host;
    const connected = Boolean(host?.isConnected);
    const style = connected ? getComputedStyle(host) : null;
    const root = document.documentElement;
    const clip = host?.style.clipPath || style?.clipPath || "";
    const effectiveReveal = state.active && !visualExposureAllowed()
      ? 100
      : state.comparePercent;
    return Object.freeze({
      at: Math.round(performance.now() * 10) / 10,
      route: routeKey(),
      action,
      generation: state.visualGeneration,
      intent: state.visualIntent,
      hostConnected: connected,
      hostDisplay: style?.display || "",
      hostVisibility: style?.visibility || "",
      hostOpacity: style?.opacity || "",
      hostClip: clip,
      revealPercent: effectiveReveal,
      activeAttribute: root?.dataset.bokounActive === "true",
      layeredAttribute: root?.dataset.bokounLayered === "true",
      bootingAttribute: root?.dataset.bokounBooting === "true",
      nativeMode: state.nativeMode,
      comparisonMode: state.layerReasons.has("compare"),
      revealRunning: state.revealRunning,
    });
  }

  function visualProblems(snapshot) {
    if (!state.active || state.nativeMode) return [];
    const problems = [];
    if (!snapshot.hostConnected) problems.push("active-host-disconnected");
    if (snapshot.hostDisplay === "none") problems.push("active-host-display-none");
    if (snapshot.hostVisibility === "hidden") problems.push("active-host-hidden");
    if (Number(snapshot.hostOpacity) < 0.99) problems.push("active-host-transparent");
    if (!snapshot.activeAttribute) problems.push("active-attribute-missing");
    if (!visualExposureAllowed() && snapshot.revealPercent < 99.9) {
      problems.push("unexpected-native-exposure");
    }
    return problems;
  }

  function recordVisualState(action, { force = false } = {}) {
    if (!state.visualWatching && !force) return null;
    const snapshot = visualSnapshot(action);
    state.visualLogEntries.push(snapshot);
    if (state.visualLogEntries.length > 250) state.visualLogEntries.shift();
    if (state.visualWatching) {
      const warning = visualProblems(snapshot).join(",");
      if (warning && warning !== state.visualLastWarning) {
        console.warn(`[Bokoun ${VERSION}] Invalid visual state: ${warning}.`);
      }
      state.visualLastWarning = warning;
    }
    return snapshot;
  }

  function watchVisualState(enabled = true) {
    state.visualWatching = enabled === true;
    cancelAnimationFrame(state.visualWatchFrame);
    state.visualWatchFrame = 0;
    state.visualLastWarning = "";
    if (!state.visualWatching) return false;
    const sample = () => {
      if (!state.visualWatching) return;
      recordVisualState("animation-frame");
      state.visualWatchFrame = requestAnimationFrame(sample);
    };
    recordVisualState("watch-start", { force: true });
    state.visualWatchFrame = requestAnimationFrame(sample);
    return true;
  }

  function clearVisualLog() {
    state.visualLogEntries.length = 0;
    state.visualLastWarning = "";
  }

  function visualLog() {
    return state.visualLogEntries.map((entry) => ({ ...entry }));
  }

  function commitLayerState(reason = "commit") {
    const root = document.documentElement;
    if (root) {
      if (state.active) {
        root.dataset.bokounActive = "true";
      } else {
        delete root.dataset.bokounActive;
      }
      if (state.active && state.layerReasons.size) root.dataset.bokounLayered = "true";
      else delete root.dataset.bokounLayered;
    }

    if (state.host?.isConnected) {
      const reveal = state.active && !visualExposureAllowed()
        ? 100
        : Math.min(100, Math.max(0, Number(state.comparePercent) || 0));
      state.host.style.display = "block";
      state.host.style.visibility = "visible";
      state.host.style.opacity = "1";
      state.host.style.clipPath = `inset(0 ${100 - reveal}% 0 0)`;
      const background = state.scroller ? getComputedStyle(state.scroller).backgroundColor : "";
      if (background && background !== "rgba(0, 0, 0, 0)") {
        state.host.style.backgroundColor = background;
      }
    }
    recordVisualState(reason);
  }

  function setLayered(reason, enabled) {
    if (enabled) state.layerReasons.add(reason);
    else state.layerReasons.delete(reason);
    commitLayerState(`layer:${reason}:${enabled ? "on" : "off"}`);
  }

  function setHostReveal(percent) {
    const normalized = Math.min(100, Math.max(0, Number(percent) || 0));
    state.comparePercent = normalized;
    commitLayerState(`reveal:${normalized}`);
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

  function beginVisualTransition(intent) {
    state.visualGeneration += 1;
    state.visualIntent = intent;
    state.hostRevealAnimation?.cancel();
    state.hostRevealAnimation = null;
    recordVisualState(`transition:${intent}:begin`);
    return state.visualGeneration;
  }

  function ownsVisualTransition(generation) {
    return generation === state.visualGeneration;
  }

  async function animateHostReveal(from, to, generation = state.visualGeneration) {
    const host = state.host;
    if (!host || !ownsVisualTransition(generation)) return false;
    setHostReveal(from);
    if (prefersReducedMotion() || typeof host.animate !== "function") {
      if (!ownsVisualTransition(generation) || state.host !== host) return false;
      setHostReveal(to);
      return true;
    }
    const animation = host.animate(
      [
        { clipPath: `inset(0 ${100 - from}% 0 0)` },
        { clipPath: `inset(0 ${100 - to}% 0 0)` },
      ],
      { duration: 360, easing: "cubic-bezier(.22,.8,.25,1)", fill: "forwards" },
    );
    state.hostRevealAnimation = animation;
    await animation.finished.catch(() => undefined);
    if (state.hostRevealAnimation === animation) state.hostRevealAnimation = null;
    if (!ownsVisualTransition(generation) || state.host !== host) return false;
    animation.cancel();
    setHostReveal(to);
    return true;
  }


  async function revealBokoun({ initial = false, instant = false } = {}) {
    if (!state.host) return false;
    const generation = beginVisualTransition("bokoun");
    state.revealPending = false;
    state.revealRunning = true;
    removeCompareHandle();
    setLayered("transition", true);
    if (instant) setHostReveal(100);
    try {
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (!ownsVisualTransition(generation)) return false;
      if (!instant && !await animateHostReveal(0, 100, generation)) return false;
      if (!ownsVisualTransition(generation)) return false;
      return true;
    } finally {
      if (ownsVisualTransition(generation)) {
        setLayered("transition", false);
        state.revealRunning = false;
        state.visualIntent = "bokoun";
        commitLayerState("reveal-bokoun:complete");
        syncCompareMode();
        if (initial) state.host?.setAttribute("data-initial-reveal-complete", "true");
      }
    }
  }

  async function completeBootHandoff() {
    const root = document.documentElement;
    if (root?.dataset.bokounBooting !== "true") return true;
    const generation = ++state.bootHandoffGeneration;
    const visualGeneration = state.visualGeneration;
    const host = state.host;
    const routeContent = state.shadow?.querySelector(".route-content");
    if (
      !state.active
      || state.nativeMode
      || !host?.isConnected
      || !routeContent
      || host.getAttribute("data-initial-reveal-complete") !== "true"
    ) return false;

    commitLayerState("boot-handoff:ready");
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    if (
      generation !== state.bootHandoffGeneration
      || visualGeneration !== state.visualGeneration
      || !state.active
      || state.nativeMode
      || state.host !== host
      || !host.isConnected
      || !state.shadow?.querySelector(".route-content")
    ) return false;

    const background = getComputedStyle(host).backgroundColor;
    if (!background || background === "rgba(0, 0, 0, 0)") return false;
    delete root.dataset.bokounBooting;
    clearTimeout(state.bootTimer);
    state.bootTimer = 0;
    syncCompareMode();
    recordVisualState("boot-handoff:complete");
    return true;
  }

  function revealNative({ stop = false, generation = null, reason = "native" } = {}) {
    const owner = generation ?? beginVisualTransition(reason);
    if (!ownsVisualTransition(owner)) return false;
    saveScroll();
    void exitBokounFullscreen();
    state.active = false;
    state.revealPending = false;
    state.revealRunning = false;
    state.bootHandoffGeneration += 1;
    removeCompareHandle();
    state.layerReasons.clear();
    state.visualIntent = "native";
    delete document.documentElement.dataset.bokounBooting;
    commitLayerState(`reveal-native:${reason}`);
    state.host?.remove();
    state.host = null;
    state.shadow = null;
    state.scroller = null;
    state.currentSignature = "";

    if (stop) {
      document.getElementById(RETURN_HOST_ID)?.remove();
      state.disabled = true;
      clearTimeout(state.bootTimer);
      clearTimeout(state.renderTimer);
      clearTimeout(state.routeFallbackTimer);
      stopRouteObservation();
    }
    recordVisualState(`reveal-native:${reason}:complete`);
    return true;
  }

  async function openFullKapybara() {
    if (state.nativeMode || state.visualIntent === "native-transition") return false;
    const generation = beginVisualTransition("native-transition");
    const anchor = captureBokounAnchor();
    sessionStorage.setItem(SESSION_DISABLED_KEY, "1");
    state.nativeMode = true;
    state.revealRunning = true;
    removeCompareHandle();
    setLayered("transition", true);

    if (anchor?.pageHref) {
      try {
        await navigateNativeRoute(anchor.pageHref, anchor.postId);
      } catch (error) {
        console.warn(`[Bokoun ${VERSION}] Could not align the native page; using the closest loaded position.`, error?.name || "Error");
      }
    }
    if (!ownsVisualTransition(generation)) return false;

    restoreNativeAnchor(anchor);
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    if (!ownsVisualTransition(generation)) return false;
    if (!await animateHostReveal(100, 0, generation)) return false;
    if (!revealNative({ generation, reason: "mode-switch" })) return false;
    showReturnControl();
    return true;
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
          top: env(safe-area-inset-top);
          right: max(0px, calc((100vw - 720px) / 2));
          z-index: 2147483646;
          display: block;
          width: 44px;
          height: 46px;
          pointer-events: none;
        }

        button {
          display: grid;
          width: 44px;
          height: 46px;
          place-items: center;
          padding: 0;
          border: 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 0;
          background: rgba(20, 22, 24, 0.88);
          color: #ef805a;
          font: 500 22px/1 system-ui, sans-serif;
          cursor: pointer;
          pointer-events: auto;
          backdrop-filter: blur(8px);
          -webkit-tap-highlight-color: transparent;
        }

        button:focus-visible {
          outline: 2px solid #ef805a;
          outline-offset: -3px;
        }
      </style>
      <button
        type="button"
        aria-label="Přepnout do Bokouna"
        title="Přepnout do Bokouna"
      >◐</button>
    `;
    shadow.querySelector("button").addEventListener("click", returnToBokoun);
    document.body.append(host);
  }

  function disableBokoun() {
    gmSet(PREF_ENABLED_KEY, false);
    sessionStorage.removeItem(SESSION_DISABLED_KEY);
    document.getElementById(RETURN_HOST_ID)?.remove();
    revealNative({ stop: true });
  }

  function registerMenus() {
    if (sessionStorage.getItem(SESSION_DISABLED_KEY) === "1") {
      gmMenu("Bokoun: zapnout v tomto panelu", returnToBokoun);
    } else {
      gmMenu("Bokoun: otevřít plnou Kapybaru", openFullKapybara);
    }

    gmMenu(
      gmGet(PREF_ENABLED_KEY, true) ? "Bokoun: vypnout trvale" : "Bokoun: zapnout trvale",
      gmGet(PREF_ENABLED_KEY, true)
        ? disableBokoun
        : () => {
            gmSet(PREF_ENABLED_KEY, true);
            sessionStorage.removeItem(SESSION_DISABLED_KEY);
            location.reload();
          },
    );
  }


  function nativeReady(type) {
    if (type === "active") {
      return Boolean(document.querySelector(SELECTORS.activePage));
    }
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
    visualExposureAllowed,
    visualSnapshot,
    visualProblems,
    recordVisualState,
    watchVisualState,
    clearVisualLog,
    visualLog,
    commitLayerState,
    beginVisualTransition,
    ownsVisualTransition,
    revealNative,
    setLayered,
    setHostReveal,
    animateHostReveal,
    revealBokoun,
    completeBootHandoff,
    openFullKapybara,
    showReturnControl,
    disableBokoun,
    registerMenus,
    nativeReady,
  });
}
