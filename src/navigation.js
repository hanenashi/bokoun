export function preserveForcedBokounMode(href, currentHref, origin = "") {
  try {
    const base = origin
      || (typeof location !== "undefined" ? location.origin : "https://kapybara.okoun.cz");
    const target = new URL(href, base);
    const current = new URL(currentHref, base);
    const supported = target.pathname === "/"
      || target.pathname === "/fav/activity"
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
    if (url.pathname === "/") return "/";
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
  const listRoutes = new Set(["/", "/fav/activity"]);
  const fromList = listRoutes.has(fromKey);
  const toList = listRoutes.has(toKey);
  if (fromList && !toList) return "forward";
  if (!fromList && toList) return "back";
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
    LIST_RETURN_KEY = "bokoun.list-return.v1",
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
  const ensureStructuredModel = (...args) => ctx.ensureStructuredModel(...args);
  const cachedStructuredModel = (...args) => ctx.cachedStructuredModel(...args);
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

  function storedListReturn() {
    try {
      const stored = JSON.parse(sessionStorage.getItem(LIST_RETURN_KEY) || "null");
      if (
        !stored
        || !["/", "/fav/activity"].includes(stored.list)
        || !/^\/boards\/[^/]+\/?$/.test(stored.boardPath)
      ) return null;
      return stored;
    } catch {
      return null;
    }
  }

  function listReturnTarget(boardPath = location.pathname) {
    const stored = storedListReturn();
    return stored?.boardPath.replace(/\/$/, "") === boardPath.replace(/\/$/, "")
      ? stored.list
      : "/fav/activity";
  }

  function rememberListReturn(target) {
    const sourceType = routeType();
    const targetType = routeType(target.pathname);
    if (["active", "favorites"].includes(sourceType) && targetType === "board") {
      sessionStorage.setItem(LIST_RETURN_KEY, JSON.stringify({
        list: sourceType === "active" ? "/" : "/fav/activity",
        boardPath: target.pathname,
      }));
      return;
    }
    if (sourceType === "board" && targetType === "board") {
      const stored = storedListReturn();
      if (stored?.boardPath.replace(/\/$/, "") !== location.pathname.replace(/\/$/, "")) return;
      sessionStorage.setItem(LIST_RETURN_KEY, JSON.stringify({
        ...stored,
        boardPath: target.pathname,
      }));
    }
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
      state.routeExitAnimation?.cancel();
      state.routeExitAnimation = null;
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
      state.routeExitAnimation?.cancel();
      state.routeExitAnimation = null;
      return Promise.resolve();
    }
    const routeContainer = routeAnimationTarget();
    if (!routeContainer || typeof routeContainer.animate !== "function") {
      return Promise.resolve();
    }
    pinRouteBackground();
    state.routeExitAnimation?.cancel();
    state.routeExitAnimation = null;
    state.routeTransitionAnimation?.cancel();
    const animation = routeContainer.animate(
      [
        { filter: "blur(12px)", opacity: 0.34 },
        { filter: "blur(0)", opacity: 1 },
      ],
      {
        duration: 190,
        easing: "cubic-bezier(.2,.72,.25,1)",
      },
    );
    state.routeTransitionAnimation = animation;
    return animation.finished.catch(() => undefined).then(() => {
      if (state.routeTransitionAnimation === animation) {
        state.routeTransitionAnimation = null;
      }
    });
  }

  function animateRouteExit() {
    if (!transitionsEnabled() || prefersReducedMotion()) return Promise.resolve();
    const routeContainer = routeAnimationTarget();
    if (!routeContainer || typeof routeContainer.animate !== "function") {
      return Promise.resolve();
    }
    pinRouteBackground();
    state.routeTransitionAnimation?.cancel();
    state.routeTransitionAnimation = null;
    state.routeExitAnimation?.cancel();
    const animation = routeContainer.animate(
      [
        { filter: "blur(0)", opacity: 1 },
        { filter: "blur(10px)", opacity: 0.34 },
      ],
      {
        duration: 130,
        easing: "cubic-bezier(.4,0,.8,.25)",
        fill: "forwards",
      },
    );
    state.routeExitAnimation = animation;
    return animation.finished.catch(() => undefined);
  }

  function routeAnimationTarget() {
    return state.shadow?.querySelector(".route-content") || state.scroller;
  }

  function pinRouteBackground() {
    const background = state.scroller
      ? getComputedStyle(state.scroller).backgroundColor
      : "";
    if (state.host && background && background !== "rgba(0, 0, 0, 0)") {
      state.host.style.backgroundColor = background;
    }
  }

  function navigateNative(href, { direction = "", bokoun = false } = {}) {
    if (!href) return;
    saveScroll();
    const target = preserveForcedBokounMode(href, location.href, location.origin);
    rememberListReturn(target);
    prepareNavigationTransition(target.href, { direction });
    if (routeType() === "board" && target.pathname !== location.pathname) {
      leaveBoardVisit(location.pathname);
    }
    const nativeLink = bokoun || target.searchParams.get("bokoun") === "on"
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

    const commitSequence = ++state.navigationCommitSequence;
    const performNavigation = () => {
      if (commitSequence !== state.navigationCommitSequence) return;
      const previous = location.href;
      if (bokoun) {
        history.pushState({}, "", target.href);
        return;
      }
      if (!nativeLink) {
        location.assign(target.href);
        return;
      }

      nativeLink.click();
      window.setTimeout(() => {
        if (commitSequence !== state.navigationCommitSequence) return;
        if (location.href === previous) location.assign(target.href);
      }, 1_200);
    };
    void animateRouteExit().then(performNavigation);
  }

  function goBack() {
    saveScroll();
    navigateNative(listReturnTarget(), { direction: "back" });
  }

  async function openThread(rootId, postId = "") {
    let normalized = String(rootId || "");
    const normalizedPostId = String(postId || "");
    if (routeType() !== "board") return false;
    if (!/^\d+$/.test(normalized)) {
      if (!/^\d+$/.test(normalizedPostId)) return false;
      const sourceRoute = routeKey();
      const entry = await ensureStructuredModel("board", sourceRoute, {
        reason: "manual-refresh",
      });
      if (routeKey() !== sourceRoute || routeType() !== "board") return false;
      const model = entry?.model || cachedStructuredModel("board", sourceRoute);
      const post = model?.posts?.find((candidate) => candidate.id === normalizedPostId);
      normalized = String(post?.rootId || post?.id || "");
    }
    if (!/^\d+$/.test(normalized)) return false;
    const target = new URL(routeKey(), location.origin);
    target.searchParams.delete("f");
    target.searchParams.set("rootId", normalized);
    target.searchParams.set("p", normalizedPostId || normalized);
    navigateNative(`${target.pathname}${target.search}`, { direction: "forward", bokoun: true });
    return true;
  }

  function closeThread() {
    if (routeType() !== "board") return;
    const target = new URL(routeKey(), location.origin);
    target.searchParams.delete("f");
    target.searchParams.delete("rootId");
    target.searchParams.delete("p");
    target.searchParams.delete("branch");
    navigateNative(`${target.pathname}${target.search}`, { direction: "back", bokoun: true });
  }

  function toggleThreadBranch(branchId = "") {
    if (routeType() !== "board") return;
    const target = new URL(routeKey(), location.origin);
    if (!target.searchParams.has("rootId")) return;
    const current = target.searchParams.get("branch") || "";
    const normalized = String(branchId || "");

    if (current) {
      if (history.state?.bokounThreadBranch === current) {
        history.back();
        return;
      }
      target.searchParams.delete("branch");
      history.replaceState({ ...history.state, bokounThreadBranch: "" }, "", target.href);
      return;
    }
    if (!normalized) return;
    target.searchParams.set("branch", normalized);
    history.pushState(
      { ...history.state, bokounThreadBranch: normalized },
      "",
      target.href,
    );
  }

  function captureBokounAnchor() {
    if (!state.scroller || !state.shadow) return null;
    const scrollerRect = state.scroller.getBoundingClientRect();
    if (["active", "favorites"].includes(routeType())) {
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
    if (["active", "favorites"].includes(routeType())) {
      const selector = routeType() === "active" ? SELECTORS.activeRows : SELECTORS.favoriteRows;
      const rows = [...document.querySelectorAll(selector)];
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
      const target = ["active", "favorites"].includes(routeType())
        ? [...document.querySelectorAll(
          routeType() === "active" ? SELECTORS.activeRows : SELECTORS.favoriteRows,
        )]
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
        const items = ["active", "favorites"].includes(routeType())
          ? [...state.shadow.querySelectorAll(".favorite-item [data-native-href]")]
          : [...state.shadow.querySelectorAll("[data-bokoun-post-id]")];
        const target = ["active", "favorites"].includes(routeType())
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
    if (!state.nativeMode || state.visualIntent === "bokoun-transition") return false;
    const anchor = captureNativeAnchor();
    sessionStorage.removeItem(SESSION_DISABLED_KEY);
    document.getElementById(RETURN_HOST_ID)?.remove();
    state.nativeMode = false;
    state.disabled = false;
    state.visualIntent = "bokoun-transition";

    if (!isMobileEligible() || routeType() === "unsupported") return false;
    await waitForBody();
    setLayered("transition", true);
    mountShell();
    setHostReveal(0);
    state.currentRouteKey = routeKey();
    observeNative();
    render({ force: true });
    restoreBokounAnchor(anchor);
    await revealBokoun();
    return true;
  }

  Object.assign(ctx, {
    navigateNative,
    prepareNavigationTransition,
    consumeNavigationTransition,
    animateRouteEntry,
    animateRouteExit,
    routeAnimationTarget,
    listReturnTarget,
    goBack,
    openThread,
    closeThread,
    toggleThreadBranch,
    captureBokounAnchor,
    captureNativeAnchor,
    nativePostById,
    restoreNativeAnchor,
    restoreBokounAnchor,
    navigateNativeRoute,
    returnToBokoun,
  });
}
