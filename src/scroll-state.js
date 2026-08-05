export function canonicalScrollRoute(route, origin = "") {
  try {
    const base = origin
      || (typeof location !== "undefined" ? location.origin : "https://kapybara.okoun.cz");
    const url = new URL(route, base);
    url.searchParams.delete("bokoun");
    url.searchParams.delete("branch");
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return route;
  }
}

export function installScrollState(ctx) {
  const {
    SCROLL_KEY,
    SCROLL_SAVE_DELAY_MS = 250,
    SCROLL_ROUTE_LIMIT = 30,
    state,
  } = ctx;
  const maybeLoadOlder = (...args) => ctx.maybeLoadOlder(...args);

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

  Object.assign(ctx, {
    getScrollMap,
    scrollEntryKey,
    getScrollIndex,
    storedScroll,
    saveScroll,
    scheduleScrollSave,
    handleBokounScroll,
    restoreScroll,
  });
}
