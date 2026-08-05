export function installComparison(ctx) {
  const { COMPARE_HOST_ID, state } = ctx;
  const currentDisplaySettings = (...args) => ctx.currentDisplaySettings(...args);
  const setLayered = (...args) => ctx.setLayered(...args);
  const setHostReveal = (...args) => ctx.setHostReveal(...args);
  const captureBokounAnchor = (...args) => ctx.captureBokounAnchor(...args);
  const restoreNativeAnchor = (...args) => ctx.restoreNativeAnchor(...args);

  function removeCompareHandle() {
    state.compareHost?.remove();
    state.compareHost = null;
    state.compareAnchor = null;
    setLayered("compare", false);
    if (state.active) setHostReveal(100);
  }

  function showCompareHandle() {
    if (!state.active || !state.host || state.compareHost?.isConnected) return;
    setLayered("compare", true);
    setHostReveal(100);

    const host = document.createElement("div");
    host.id = COMPARE_HOST_ID;
    const shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host {
          all: initial;
          position: fixed;
          inset: 0;
          z-index: 2147483647;
          display: block;
          pointer-events: none;
        }
        button {
          --compare-percent: 100%;
          position: absolute;
          top: 0;
          bottom: 0;
          left: clamp(0px, var(--compare-percent), 100%);
          width: 44px;
          margin: 0;
          padding: 0;
          border: 0;
          background: transparent;
          color: #a85a00;
          cursor: ew-resize;
          pointer-events: auto;
          touch-action: none;
          transform: translateX(-50%);
          -webkit-tap-highlight-color: transparent;
        }
        button::before {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 21px;
          width: 2px;
          background: currentColor;
          box-shadow: 0 0 0 1px rgba(255,255,255,.7);
        }
        span {
          position: absolute;
          top: 50%;
          left: 50%;
          display: grid;
          width: 32px;
          height: 56px;
          place-items: center;
          border: 1px solid currentColor;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 2px 12px rgba(0,0,0,.22);
          color: currentColor;
          font: 700 15px/1 system-ui, sans-serif;
          transform: translate(-50%, -50%);
        }
        button:focus-visible span {
          outline: 3px solid #a85a00;
          outline-offset: 2px;
        }
      </style>
      <button
        type="button"
        role="slider"
        aria-label="Porovnání Bokouna a Kapybary"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="100"
      ><span aria-hidden="true">↔</span></button>
    `;
    document.body.append(host);
    state.compareHost = host;
    const slider = shadow.querySelector("[role='slider']");

    const updateFromClientX = (clientX) => {
      const width = Math.max(1, document.documentElement.clientWidth);
      setHostReveal((clientX / width) * 100);
    };
    slider.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      state.compareAnchor = captureBokounAnchor();
      restoreNativeAnchor(state.compareAnchor);
      slider.setPointerCapture(event.pointerId);
      updateFromClientX(event.clientX);
    });
    slider.addEventListener("pointermove", (event) => {
      if (!slider.hasPointerCapture(event.pointerId)) return;
      updateFromClientX(event.clientX);
    });
    slider.addEventListener("keydown", (event) => {
      const amounts = { ArrowLeft: -5, ArrowRight: 5, Home: -100, End: 100 };
      if (!(event.key in amounts)) return;
      event.preventDefault();
      if (!state.compareAnchor) {
        state.compareAnchor = captureBokounAnchor();
        restoreNativeAnchor(state.compareAnchor);
      }
      setHostReveal(
        event.key === "Home" ? 0
          : event.key === "End" ? 100
            : state.comparePercent + amounts[event.key],
      );
    });
    setHostReveal(state.comparePercent);
  }

  function syncCompareMode() {
    if (
      !state.active
      || state.nativeMode
      || state.revealRunning
      || document.documentElement.dataset.bokounBooting === "true"
    ) return;
    if (currentDisplaySettings().compareHandle) showCompareHandle();
    else removeCompareHandle();
  }

  Object.assign(ctx, {
    showCompareHandle,
    removeCompareHandle,
    syncCompareMode,
  });
}
