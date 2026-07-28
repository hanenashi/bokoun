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
      html[data-bokoun-active="true"] body > :not(#${HOST_ID}) {
        display: none !important;
      }
      html[data-bokoun-active="true"][data-bokoun-bridge="true"] body > :not(#${HOST_ID}) {
        display: revert !important;
      }
      html[data-bokoun-active="true"],
      html[data-bokoun-active="true"] body {
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        overflow: hidden !important;
        background: #fff !important;
      }
      #${HOST_ID} {
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
    state.active = true;
    document.documentElement.dataset.bokounActive = "true";
    delete document.documentElement.dataset.bokounBooting;
  }

  function revealNative({ stop = false } = {}) {
    saveScroll();
    state.active = false;
    if (document.documentElement) {
      delete document.documentElement.dataset.bokounBooting;
      delete document.documentElement.dataset.bokounActive;
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

    revealNative();
    showReturnControl();
    restoreNativeAnchor(anchor);
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
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        state.scroller?.scrollTo({ top: y, behavior: "auto" });
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
    revealNative,
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
