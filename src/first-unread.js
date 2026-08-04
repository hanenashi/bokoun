export function installFirstUnread(ctx) {
  const { state } = ctx;
  const routeType = (...args) => ctx.routeType(...args);
  const currentDisplaySettings = (...args) => ctx.currentDisplaySettings(...args);
  let observedRoute = "";
  let handledRoute = "";
  let cancelledRoute = "";
  let generation = 0;
  let listeningScroller = null;

  function cancelForCurrentRoute() {
    if (observedRoute) cancelledRoute = observedRoute;
  }

  function resetFirstUnread() {
    observedRoute = "";
    handledRoute = "";
    cancelledRoute = "";
    generation += 1;
  }

  function attachCancellationListeners() {
    const scroller = state.scroller;
    if (!scroller || scroller === listeningScroller) return;
    listeningScroller = scroller;
    scroller.addEventListener("wheel", cancelForCurrentRoute, { passive: true });
    scroller.addEventListener("touchstart", cancelForCurrentRoute, { passive: true });
    scroller.addEventListener("keydown", (event) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
        cancelForCurrentRoute();
      }
    });
  }

  function nextPaint() {
    return new Promise((resolve) => requestAnimationFrame(() => (
      requestAnimationFrame(resolve)
    )));
  }

  function firstUnreadElement(ids, posts = []) {
    const wanted = new Set(ids.map(String));
    const orderedIds = posts
      .filter((post) => wanted.has(String(post.id)))
      .sort((left, right) => (
        (Date.parse(left.datetime) || 0) - (Date.parse(right.datetime) || 0)
        || (Number(left.sequence) || 0) - (Number(right.sequence) || 0)
        || String(left.id).localeCompare(String(right.id), undefined, { numeric: true })
      ))
      .map((post) => String(post.id));
    const candidates = orderedIds.length ? orderedIds : [...wanted];
    const elements = [...state.scroller.querySelectorAll("[data-bokoun-post-id]")];
    return candidates
      .map((id) => elements.find((element) => element.dataset.bokounPostId === id))
      .find(Boolean);
  }

  function scrollToFirstUnread(target) {
    const scrollerRect = state.scroller.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const topbar = state.shadow?.querySelector(".topbar");
    const topbarRect = topbar?.getBoundingClientRect();
    const headerOffset = topbarRect
      ? Math.max(0, topbarRect.bottom - scrollerRect.top + 8)
      : 8;
    const top = state.scroller.scrollTop + targetRect.top - scrollerRect.top - headerOffset;
    state.scroller.scrollTo({ top: Math.max(0, top), behavior: "auto" });
  }

  function maybeScrollFirstUnread({ model, key, restorePromise }) {
    attachCancellationListeners();
    if (key !== observedRoute) {
      observedRoute = key;
      handledRoute = "";
      cancelledRoute = "";
      generation += 1;
    }
    if (
      state.disabled
      || state.nativeMode
      || routeType() !== "board"
      || !currentDisplaySettings().firstUnread
      || handledRoute === key
      || cancelledRoute === key
    ) return;
    const url = new URL(key, location.origin);
    if (url.hash || model.threadRootId || !model.newPostIds?.length) {
      handledRoute = key;
      return;
    }
    const token = ++generation;
    Promise.resolve(restorePromise)
      .then(nextPaint)
      .then(() => {
        if (
          token !== generation
          || state.currentRouteKey !== key
          || state.disabled
          || state.nativeMode
          || cancelledRoute === key
        ) return;
        const target = firstUnreadElement(model.newPostIds, model.posts);
        if (!target) return;
        scrollToFirstUnread(target);
        handledRoute = key;
      })
      .catch(() => {});
  }

  Object.assign(ctx, { maybeScrollFirstUnread, resetFirstUnread });
}
