export function installFullscreen(ctx) {
  const { state } = ctx;
  const currentDisplaySettings = (...args) => ctx.currentDisplaySettings(...args);

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
        || node.matches("[data-action='mode-switch']")
        || node.matches("[data-action='overflow']")
        || node.matches("[data-action='back']")
        || node.matches("[data-action='thread-back']")
        || node.matches("[data-action='thread']")
        || node.matches("[data-action='fullscreen-toggle']")
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
    // A failed request can be retried on the next safe Bokoun gesture. Browsers
    // only grant fullscreen from a live user activation, so this is deliberately
    // event-driven rather than timer-based.
    state.fullscreenSuppressed = false;
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

  Object.assign(ctx, {
    fullscreenEnabled,
    fullscreenGestureAllowed,
    requestBokounFullscreen,
    exitBokounFullscreen,
    handleFullscreenChange,
    handleFullscreenGesture,
    syncFullscreenMode,
  });
}
