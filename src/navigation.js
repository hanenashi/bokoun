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

export function installNavigation(ctx) {
  const {
    HOST_ID,
    RETURN_HOST_ID,
    BOOT_TIMEOUT_MS,
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

  function navigateNative(href) {
    if (!href) return;
    saveScroll();
    const target = preserveForcedBokounMode(href, location.href, location.origin);
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
    navigateNative("/fav/activity");
  }

  function openThread(rootId) {
    const normalized = String(rootId || "");
    if (!/^\d+$/.test(normalized) || routeType() !== "board") return;
    const target = new URL(routeKey(), location.origin);
    target.searchParams.delete("f");
    target.searchParams.set("rootId", normalized);
    navigateNative(`${target.pathname}${target.search}`);
  }

  function closeThread() {
    if (routeType() !== "board") return;
    const target = new URL(routeKey(), location.origin);
    target.searchParams.delete("f");
    target.searchParams.delete("rootId");
    navigateNative(`${target.pathname}${target.search}`);
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
          .find((row) => row.getAttribute("href") === anchor.favoriteHref)
        : nativePostById(anchor.postId)
          || [...document.querySelectorAll(SELECTORS.posts)].at(-1);
      if (!target) return;
      const delta = target.getBoundingClientRect().top - anchor.offset;
      window.scrollTo({ top: Math.max(0, window.scrollY + delta), behavior: "auto" });
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
          ? items.find((row) => row.getAttribute("data-native-href") === anchor.favoriteHref)
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
