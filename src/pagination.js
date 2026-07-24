export function installPagination(ctx) {
  const {
    PAGE_LOAD_TIMEOUT_MS,
    OLDER_TRIGGER_PX,
    state,
  } = ctx;
  const routeType = (...args) => ctx.routeType(...args);
  const text = (...args) => ctx.text(...args);
  const fetchStructuredModel = (...args) => ctx.fetchStructuredModel(...args);
  const structuredCacheKey = (...args) => ctx.structuredCacheKey(...args);
  const readBoardFromDom = (...args) => ctx.readBoardFromDom(...args);
  const mergeBoardPage = (...args) => ctx.mergeBoardPage(...args);
  const scheduleRender = (...args) => ctx.scheduleRender(...args);

  function validatedOlderPage(value) {
    if (!value) return null;
    try {
      const url = new URL(value, location.origin);
      if (url.origin !== location.origin) return null;
      if (url.pathname !== location.pathname) return null;
      if (!url.searchParams.has("f")) return null;
      return url;
    } catch {
      return null;
    }
  }

  async function loadOlderPosts() {
    if (
      state.nativeMode
      || state.boardLoading
      || state.boardEnd
      || routeType() !== "board"
    ) return;

    const target = validatedOlderPage(state.boardNextHref);
    if (!target) {
      state.boardEnd = true;
      state.boardNextHref = "";
      scheduleRender({ force: true });
      return;
    }

    const targetHref = `${target.pathname}${target.search}`;
    if (state.boardLoadedPages.has(targetHref)) {
      state.boardEnd = true;
      state.boardNextHref = "";
      scheduleRender({ force: true });
      return;
    }

    state.boardLoading = true;
    state.boardError = "";
    state.boardLoadAbort = new AbortController();
    const timeout = window.setTimeout(() => state.boardLoadAbort?.abort(), PAGE_LOAD_TIMEOUT_MS);
    scheduleRender({ force: true });

    try {
      let model;
      try {
        const entry = await fetchStructuredModel("board", targetHref, {
          signal: state.boardLoadAbort.signal,
        });
        model = entry.model;
        state.structuredCache.set(structuredCacheKey("board", targetHref), entry);
      } catch (structuredError) {
        if (structuredError?.name === "AbortError") throw structuredError;
        const response = await fetch(targetHref, {
          credentials: "same-origin",
          headers: { Accept: "text/html" },
          signal: state.boardLoadAbort.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const html = await response.text();
        const page = new DOMParser().parseFromString(html, "text/html");
        model = readBoardFromDom(page, targetHref);
        if (!model.posts.length || page.querySelector("#api-access-code")) {
          throw new Error("Unexpected board page");
        }
      }

      const added = mergeBoardPage(model, targetHref, { setNext: true });
      if (added === 0) {
        state.boardEnd = true;
        state.boardNextHref = "";
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        state.boardError = "Starší příspěvky se nepodařilo načíst.";
      }
    } finally {
      window.clearTimeout(timeout);
      state.boardLoading = false;
      state.boardLoadAbort = null;
      state.boardAutoCooldownUntil = Date.now() + 700;
      scheduleRender({ force: true });
    }
  }

  function maybeLoadOlder() {
    if (
      state.nativeMode
      || routeType() !== "board"
      || !state.scroller
      || state.boardLoading
      || state.boardEnd
      || state.boardError
      || Date.now() < state.boardAutoCooldownUntil
    ) return;

    const remaining = state.scroller.scrollHeight
      - state.scroller.scrollTop
      - state.scroller.clientHeight;
    if (remaining <= OLDER_TRIGGER_PX) loadOlderPosts();
  }

  Object.assign(ctx, {
    validatedOlderPage,
    loadOlderPosts,
    maybeLoadOlder,
  });
}
