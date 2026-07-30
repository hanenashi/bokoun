export function preserveForcedBokounMode(href, currentHref, origin = "") {
  try {
    const base = origin
      || (typeof location !== "undefined" ? location.origin : "https://kapybara.okoun.cz");
    const target = new URL(href, base);
    const current = new URL(currentHref, base);
    const supported = target.pathname === "/fav/activity"
      || target.pathname === "/fav/topics"
      || /^\/boards\/[^/]+\/?$/.test(target.pathname);
    if (
      supported
      && current.searchParams.get("bokoun") === "on"
      && !target.searchParams.has("bokoun")
    ) {
      target.searchParams.set("bokoun", "on");
    }
    return target;
  } catch {
    return new URL(href, origin || "https://kapybara.okoun.cz");
  }
}

export function sameFavoriteRoute(left, right, origin = "") {
  try {
    const base = origin
      || (typeof location !== "undefined" ? location.origin : "https://kapybara.okoun.cz");
    const leftUrl = new URL(left, base);
    const rightUrl = new URL(right, base);
    return leftUrl.origin === rightUrl.origin
      && leftUrl.pathname.replace(/\/$/, "") === rightUrl.pathname.replace(/\/$/, "");
  } catch {
    return false;
  }
}

export function transitionRouteKey(value, origin = "") {
  try {
    const base = origin
      || (typeof location !== "undefined" ? location.origin : "https://kapybara.okoun.cz");
    const url = new URL(value, base);
    if (url.origin !== base) return "";
    if (url.pathname === "/fav/activity" || url.pathname === "/fav/topics") {
      return "/fav/activity";
    }
    if (!/^\/boards\/[^/]+\/?$/.test(url.pathname)) return "";
    const rootId = url.searchParams.get("rootId");
    const path = url.pathname.replace(/\/$/, "");
    return rootId && /^\d+$/.test(rootId)
      ? `${path}?rootId=${rootId}`
      : path;
  } catch {
    return "";
  }
}

export function inferNavigationDirection(from, to, { historyTraversal = false } = {}) {
  const fromKey = transitionRouteKey(from);
  const toKey = transitionRouteKey(to);
  if (!fromKey || !toKey || fromKey === toKey) return "";
  const fromFavorite = fromKey === "/fav/activity";
  const toFavorite = toKey === "/fav/activity";
  if (fromFavorite && !toFavorite) return "forward";
  if (!fromFavorite && toFavorite) return "back";
  const fromThread = fromKey.includes("?rootId=");
  const toThread = toKey.includes("?rootId=");
  if (!fromThread && toThread) return "forward";
  if (fromThread && !toThread) return "back";
  if (historyTraversal) return "back";
  return "lateral";
}

export function installNavigation(ctx) {
  const {
    HOST_ID,
    RETURN_HOST_ID,
    BOOT_TIMEOUT_MS,
    NAVIGATION_INTENT_KEY = "bokoun.navigation-intent.v1",
    SESSION_DISABLED_KEY,
    SELECTORS,
    state,
  } = ctx;
  const routeType = (...args) => ctx.routeType(...args);
  const routeKey = (...args) => ctx.routeKey(...args);
  const isMobileEligible = (...args) => ctx.isMobileEligible(...args);
  const waitForBody = (...args) => ctx.waitForBody(...args);
  const mountShell = (...args) => ctx.mountShell(...args);
  const saveScroll = (...args) => ctx.saveScroll(...args);
  const nativeReady = (...args) => ctx.nativeReady(...args);
  const render = (...args) => ctx.render(...args);
  const observeNative = (...args) => ctx.observeNative(...args);
  const leaveBoardVisit = (...args) => ctx.leaveBoardVisit(...args);
  const setLayered = (...args) => ctx.setLayered(...args);
  const setHostReveal = (...args) => ctx.setHostReveal(...args);
  const revealBokoun = (...args) => ctx.revealBokoun(...args);
  const currentDisplaySettings = (...args) => ctx.currentDisplaySettings(...args);
  const prefersReducedMotion = (...args) => ctx.prefersReducedMotion(...args);

  function transitionsEnabled() {
    const display = currentDisplaySettings();
    return display.interfacePreset === "compact-reader" && display.pageTransitions;
  }

  function prepareNavigationTransition(
    href,
    {
      direction = "",
      sourceHref = location.href,
      persist = true,
      preserveExisting = false,
    } = {},
  ) {
    if (!transitionsEnabled()) {
      state.pendingNavigationIntent = null;
      if (persist) sessionStorage.removeItem(NAVIGATION_INTENT_KEY);
      return null;
    }
    const target = transitionRouteKey(href, location.origin);
    const source = transitionRouteKey(sourceHref, location.origin);
    if (!target || !source || target === source) return null;
    if (
      preserveExisting
      && state.pendingNavigationIntent?.target === target
      && Date.now() - state.pendingNavigationIntent.createdAt < 5_000
    ) return state.pendingNavigationIntent;
    const resolvedDirection = ["forward", "back", "lateral"].includes(direction)
      ? direction
      : inferNavigationDirection(source, target);
    if (!resolvedDirection) return null;
    const intent = {
      source,
      target,
      direction: resolvedDirection,
      createdAt: Date.now(),
    };
    state.pendingNavigationIntent = intent;
    if (persist) sessionStorage.setItem(NAVIGATION_INTENT_KEY, JSON.stringify(intent));
    return intent;
  }

  function consumeNavigationTransition(href = location.href) {
    if (!transitionsEnabled()) {
      state.pendingNavigationIntent = null;
      state.navigationEntryTransitionConsumed = true;
      state.routeTransitionAnimation?.cancel();
      state.routeTransitionAnimation = null;
      sessionStorage.removeItem(NAVIGATION_INTENT_KEY);
      return "";
    }
    let intent = state.pendingNavigationIntent;
    if (!intent) {
      try {
        intent = JSON.parse(sessionStorage.getItem(NAVIGATION_INTENT_KEY) || "null");
      } catch {
        intent = null;
      }
    }
    sessionStorage.removeItem(NAVIGATION_INTENT_KEY);
    state.pendingNavigationIntent = null;
    const target = transitionRouteKey(href, location.origin);
    const intentAge = Date.now() - Number(intent?.createdAt || 0);
    if (
      intent
      && intent.target === target
      && ["forward", "back", "lateral"].includes(intent.direction)
      && intentAge >= 0
      && intentAge < 5_000
    ) {
      state.navigationEntryTransitionConsumed = true;
      return intent.direction;
    }
    if (state.navigationEntryTransitionConsumed) return "";
    state.navigationEntryTransitionConsumed = true;
    const navigation = performance.getEntriesByType?.("navigation")?.[0];
    return navigation?.type === "back_forward" ? "back" : "";
  }

  function animateRouteEntry(direction) {
    if (!["forward", "back", "lateral"].includes(direction)) return Promise.resolve();
    if (!transitionsEnabled() || prefersReducedMotion()) {
      state.routeTransitionAnimation?.cancel();
      state.routeTransitionAnimation = null;
      return Promise.resolve();
    }
    const routeContainer = state.scroller;
    if (!routeContainer || typeof routeContainer.animate !== "function") {
      return Promise.resolve();
    }
    state.routeTransitionAnimation?.cancel();
    const offset = direction === "back" ? "-10%" : "10%";
    const animation = routeContainer.animate(
      [
        { transform: `translate3d(${offset}, 0, 0)`, opacity: 0.82 },
        { transform: "translate3d(0, 0, 0)", opacity: 1 },
      ],
      {
        duration: 210,
        easing: "cubic-bezier(.2,.75,.25,1)",
      },
    );
    state.routeTransitionAnimation = animation;
    return animation.finished.catch(() => undefined).then(() => {
      if (state.routeTransitionAnimation === animation) {
        state.routeTransitionAnimation = null;
      }
    });
  }

  function navigateNative(href, { direction = "" } = {}) {
    if (!href) return;
    saveScroll();
    const target = preserveForcedBokounMode(href, location.href, location.origin);
    prepareNavigationTransition(target.href, { direction });
    if (routeType() === "board" && target.pathname !== location.pathname) {
      leaveBoardVisit(location.pathname);
    }
    const nativeLink = target.searchParams.get("bokoun") === "on"
      ? null
      : [...document.querySelectorAll("a[href]")]
      .find((link) => {
        if (link.closest(`#${HOST_ID}`)) return false;
        try {
          return new URL(link.href, location.origin).href === target.href;
        } catch {
          return false;
        }
      });

    const previous = location.href;
    if (!nativeLink) {
      location.assign(target.href);
      return;
    }

    nativeLink.click();
    window.setTimeout(() => {
      if (location.href === previous) location.assign(target.href);
    }, 1_200);
  }

  function goBack() {
    saveScroll();
    navigateNative("/fav/activity", { direction: "back" });
  }

  function openThread(rootId) {
    const normalized = String(rootId || "");
    if (!/^\d+$/.test(normalized) || routeType() !== "board") return;
    const target = new URL(routeKey(), location.origin);
    target.searchParams.delete("f");
    target.searchParams.set("rootId", normalized);
    navigateNative(`${target.pathname}${target.search}`, { direction: "forward" });
  }

  function closeThread() {
    if (routeType() !== "board") return;
    const target = new URL(routeKey(), location.origin);
    target.searchParams.delete("f");
    target.searchParams.delete("rootId");
    navigateNative(`${target.pathname}${target.search}`, { direction: "back" });
  }

  function captureBokounAnchor() {
    if (!state.scroller || !state.shadow) return null;
    const scrollerRect = state.scroller.getBoundingClientRect();
    if (routeType() === "favorites") {
      const rows = [...state.shadow.querySelectorAll(".favorite-item [data-native-href]")];
      const row = rows.find((item) => item.getBoundingClientRect().bottom > scrollerRect.top)
        || rows.at(-1);
      if (!row) return null;
      return {
        favoriteHref: row.getAttribute("data-native-href"),
        offset: row.getBoundingClientRect().top - scrollerRect.top,
        pageHref: routeKey(),
      };
    }
    if (routeType() !== "board") return null;
    const headerHeight = state.shadow.querySelector(".topbar--board")?.getBoundingClientRect().height || 0;
    const visibleTop = scrollerRect.top + headerHeight;
    const posts = [...state.shadow.querySelectorAll("[data-bokoun-post-id]")];
    const post = posts.find((item) => item.getBoundingClientRect().bottom > visibleTop) || posts.at(-1);
    if (!post) return null;

    const postId = post.getAttribute("data-bokoun-post-id");
    return {
      postId,
      offset: post.getBoundingClientRect().top - scrollerRect.top,
      pageHref: state.boardPostPages.get(postId) || routeKey(),
    };
  }

  function captureNativeAnchor() {
    if (routeType() === "favorites") {
      const rows = [...document.querySelectorAll(SELECTORS.favoriteRows)];
      const row = rows.find((item) => item.getBoundingClientRect().bottom > 0) || rows.at(-1);
      if (!row) return null;
      return {
        favoriteHref: row.getAttribute("href"),
        offset: row.getBoundingClientRect().top,
        pageHref: routeKey(),
      };
    }
    if (routeType() !== "board") return null;
    const posts = [...document.querySelectorAll(SELECTORS.posts)];
    const post = posts.find((item) => item.getBoundingClientRect().bottom > 0) || posts.at(-1);
    if (!post) return null;
    return {
      postId: post.getAttribute("data-post-id"),
      offset: post.getBoundingClientRect().top,
      pageHref: routeKey(),
    };
  }

  function nativePostById(postId) {
    return [...document.querySelectorAll(SELECTORS.posts)]
      .find((post) => post.getAttribute("data-post-id") === String(postId)) || null;
  }

  function restoreNativeAnchor(anchor) {
    if (!anchor) return;
    document.documentElement.dataset.bokounAligning = "true";
    const apply = () => {
      const target = routeType() === "favorites"
        ? [...document.querySelectorAll(SELECTORS.favoriteRows)]
          .find((row) => sameFavoriteRoute(row.getAttribute("href"), anchor.favoriteHref))
        : nativePostById(anchor.postId)
          || [...document.querySelectorAll(SELECTORS.posts)].at(-1);
      if (!target) return;
      const delta = target.getBoundingClientRect().top - anchor.offset;
      for (const scroller of new Set([
        document.scrollingElement,
        document.documentElement,
        document.body,
      ])) {
        if (!scroller) continue;
        scroller.scrollTop = Math.max(0, scroller.scrollTop + delta);
      }
    };
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        apply();
        window.setTimeout(() => {
          apply();
          delete document.documentElement.dataset.bokounAligning;
        }, 250);
      });
    });
  }

  function restoreBokounAnchor(anchor) {
    if (!anchor || !state.scroller || !state.shadow) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const items = routeType() === "favorites"
          ? [...state.shadow.querySelectorAll(".favorite-item [data-native-href]")]
          : [...state.shadow.querySelectorAll("[data-bokoun-post-id]")];
        const target = routeType() === "favorites"
          ? items.find((row) => sameFavoriteRoute(
            row.getAttribute("data-native-href"),
            anchor.favoriteHref,
          ))
          : items.find((post) => post.getAttribute("data-bokoun-post-id") === String(anchor.postId))
            || items.at(-1);
        if (!target || !state.scroller) return;
        const scrollerRect = state.scroller.getBoundingClientRect();
        const delta = target.getBoundingClientRect().top - scrollerRect.top - anchor.offset;
        state.scroller.scrollTo({
          top: Math.max(0, state.scroller.scrollTop + delta),
          behavior: "auto",
        });
      });
    });
  }

  async function navigateNativeRoute(href, postId) {
    const target = preserveForcedBokounMode(href, location.href, location.origin);
    if (target.origin !== location.origin || routeType(target.pathname) !== "board") {
      throw new Error("Unsafe native route");
    }
    const targetKey = `${target.pathname}${target.search}`;
    if (routeKey() === targetKey && (!postId || nativePostById(postId))) return;

    const link = document.createElement("a");
    link.href = target.href;
    link.hidden = true;
    link.setAttribute("data-sveltekit-replacestate", "");
    document.body.append(link);
    link.click();
    window.setTimeout(() => link.remove(), 0);

    const started = Date.now();
    while (Date.now() - started < BOOT_TIMEOUT_MS) {
      if (routeKey() === targetKey && nativeReady("board") && (!postId || nativePostById(postId))) return;
      await new Promise((resolve) => window.setTimeout(resolve, 80));
    }
    throw new Error("Native route timeout");
  }

  async function returnToBokoun() {
    const anchor = captureNativeAnchor();
    sessionStorage.removeItem(SESSION_DISABLED_KEY);
    document.getElementById(RETURN_HOST_ID)?.remove();
    state.nativeMode = false;
    state.disabled = false;

    if (!isMobileEligible() || routeType() === "unsupported") return;
    await waitForBody();
    setLayered("transition", true);
    mountShell();
    setHostReveal(0);
    state.currentRouteKey = routeKey();
    observeNative();
    render({ force: true });
    restoreBokounAnchor(anchor);
    await revealBokoun();
  }

  Object.assign(ctx, {
    navigateNative,
    prepareNavigationTransition,
    consumeNavigationTransition,
    animateRouteEntry,
    goBack,
    openThread,
    closeThread,
    captureBokounAnchor,
    captureNativeAnchor,
    nativePostById,
    restoreNativeAnchor,
    restoreBokounAnchor,
    navigateNativeRoute,
    returnToBokoun,
  });
}
