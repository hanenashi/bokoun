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

  function navigateNative(href) {
    if (!href) return;
    saveScroll();
    const target = new URL(href, location.origin);
    if (routeType() === "board" && target.pathname !== location.pathname) {
      leaveBoardVisit(location.pathname);
    }
    const nativeLink = [...document.querySelectorAll("a[href]")]
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
    if (history.length > 1) {
      history.back();
    } else {
      navigateNative("/fav/activity");
    }
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
    if (routeType() !== "board" || !state.scroller || !state.shadow) return null;
    const scrollerRect = state.scroller.getBoundingClientRect();
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
    if (!anchor || routeType() !== "board") return;
    const apply = () => {
      const target = nativePostById(anchor.postId)
        || [...document.querySelectorAll(SELECTORS.posts)].at(-1);
      if (!target) return;
      const delta = target.getBoundingClientRect().top - anchor.offset;
      window.scrollTo({ top: Math.max(0, window.scrollY + delta), behavior: "auto" });
    };
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        apply();
        window.setTimeout(apply, 250);
      });
    });
  }

  function restoreBokounAnchor(anchor) {
    if (!anchor || !state.scroller || !state.shadow || routeType() !== "board") return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const posts = [...state.shadow.querySelectorAll("[data-bokoun-post-id]")];
        const target = posts.find((post) => post.getAttribute("data-bokoun-post-id") === String(anchor.postId))
          || posts.at(-1);
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
    const target = new URL(href, location.origin);
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
    mountShell();
    state.currentRouteKey = routeKey();
    observeNative();
    render({ force: true });
    restoreBokounAnchor(anchor);
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
