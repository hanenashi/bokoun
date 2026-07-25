const DEFAULT_DISPLAY_SETTINGS = Object.freeze({
  showAvatars: true,
  avatarPosition: "inline",
});

const DEFAULT_FONT_SETTINGS = Object.freeze({
  family: "default",
  customFamily: "",
  size: 17,
});

const FONT_FAMILIES = Object.freeze([
  { value: "default", label: "Bokoun default", stack: "" },
  { value: "classic-okoun", label: "Classic Okoun", stack: 'Verdana, "Bitstream Vera Sans", Arial, sans-serif' },
  { value: "system", label: "System sans", stack: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  { value: "system-serif", label: "System serif", stack: 'ui-serif, Georgia, Cambria, "Times New Roman", serif' },
  { value: "system-mono", label: "System monospace", stack: 'ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", monospace' },
  { value: "roboto", label: "Roboto", stack: "Roboto, Arial, sans-serif" },
  { value: "noto-sans", label: "Noto Sans", stack: '"Noto Sans", Arial, sans-serif' },
  { value: "segoe", label: "Segoe UI", stack: '"Segoe UI", Arial, sans-serif' },
  { value: "helvetica", label: "Helvetica", stack: "Helvetica, Arial, sans-serif" },
  { value: "arial", label: "Arial", stack: "Arial, sans-serif" },
  { value: "verdana", label: "Verdana", stack: "Verdana, Geneva, sans-serif" },
  { value: "tahoma", label: "Tahoma", stack: "Tahoma, sans-serif" },
  { value: "trebuchet", label: "Trebuchet MS", stack: '"Trebuchet MS", sans-serif' },
  { value: "georgia", label: "Georgia", stack: "Georgia, serif" },
  { value: "times", label: "Times New Roman", stack: '"Times New Roman", Times, serif' },
  { value: "garamond", label: "Garamond", stack: "Garamond, Georgia, serif" },
  { value: "palatino", label: "Palatino", stack: 'Palatino, "Palatino Linotype", serif' },
  { value: "courier", label: "Courier New", stack: '"Courier New", monospace' },
  { value: "consolas", label: "Consolas", stack: 'Consolas, "Liberation Mono", monospace' },
  { value: "comic-sans", label: "Comic Sans MS", stack: '"Comic Sans MS", cursive' },
  { value: "custom", label: "Custom…", stack: "" },
]);

const AVATAR_POSITIONS = new Set(["inline", "left"]);
const MAX_CUSTOM_FAMILY_LENGTH = 160;
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 72;

export function installSettings(ctx) {
  const {
    DISPLAY_SETTINGS_KEY,
    FONT_SETTINGS_KEY,
    gmGet,
    gmSet,
    state,
  } = ctx;
  const scheduleRender = (...args) => ctx.scheduleRender(...args);

  function loadSettings() {
    if (!state.displaySettings) {
      const stored = safeStoredObject(gmGet(DISPLAY_SETTINGS_KEY, {}));
      state.displaySettings = normalizeDisplaySettings(stored);
    }
    if (!state.fontSettings) {
      const stored = safeStoredObject(gmGet(FONT_SETTINGS_KEY, {}));
      state.fontSettings = normalizeFontSettings(stored);
    }
    return {
      display: state.displaySettings,
      font: state.fontSettings,
    };
  }

  function safeStoredObject(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }

  function normalizeDisplaySettings(value = {}) {
    return {
      showAvatars: value.showAvatars !== false,
      avatarPosition: AVATAR_POSITIONS.has(value.avatarPosition)
        ? value.avatarPosition
        : DEFAULT_DISPLAY_SETTINGS.avatarPosition,
    };
  }

  function normalizeFontSettings(value = {}) {
    return {
      family: validFontFamily(value.family),
      customFamily: String(value.customFamily || "").slice(0, MAX_CUSTOM_FAMILY_LENGTH),
      size: normalizeFontSize(value.size),
    };
  }

  function currentDisplaySettings() {
    return loadSettings().display;
  }

  function currentFontSettings() {
    return loadSettings().font;
  }

  function updateDisplaySettings(patch) {
    state.displaySettings = normalizeDisplaySettings({
      ...currentDisplaySettings(),
      ...patch,
    });
    gmSet(DISPLAY_SETTINGS_KEY, state.displaySettings);
    state.currentSignature = "";
    scheduleRender({ force: true });
  }

  function updateFontSettings(patch, { render = false } = {}) {
    state.fontSettings = normalizeFontSettings({
      ...currentFontSettings(),
      ...patch,
    });
    gmSet(FONT_SETTINGS_KEY, state.fontSettings);
    applyVisualSettings();
    if (render) {
      state.currentSignature = "";
      scheduleRender({ force: true });
    }
  }

  function resetFontSettings() {
    state.fontSettings = { ...DEFAULT_FONT_SETTINGS };
    gmSet(FONT_SETTINGS_KEY, state.fontSettings);
    applyVisualSettings();
    state.currentSignature = "";
    scheduleRender({ force: true });
  }

  function validFontFamily(value) {
    const candidate = String(value || "default");
    return FONT_FAMILIES.some((font) => font.value === candidate)
      ? candidate
      : DEFAULT_FONT_SETTINGS.family;
  }

  function fontStack(value, customFamily = "") {
    const family = validFontFamily(value);
    if (family === "custom") return normalizeCustomFamily(customFamily);
    return FONT_FAMILIES.find((font) => font.value === family)?.stack || "";
  }

  function normalizeFontSize(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return DEFAULT_FONT_SETTINGS.size;
    const clamped = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, parsed));
    return Math.round(clamped * 2) / 2;
  }

  function displayFontSize(value) {
    const size = normalizeFontSize(value);
    return Number.isInteger(size) ? String(size) : size.toFixed(1);
  }

  function normalizeCustomFamily(value) {
    const source = String(value || "").trim();
    if (!source || source.length > MAX_CUSTOM_FAMILY_LENGTH) return "";
    if (/[;{}()\\/:]/.test(source) || /[\u0000-\u001f\u007f]/.test(source)) return "";

    const tokens = [];
    let token = "";
    let quote = "";
    for (const character of source) {
      if ((character === '"' || character === "'") && !quote) quote = character;
      else if (character === quote) quote = "";
      if (character === "," && !quote) {
        tokens.push(token.trim());
        token = "";
      } else {
        token += character;
      }
    }
    if (quote) return "";
    tokens.push(token.trim());
    if (tokens.some((item) => !item)) return "";

    const safeName = /^[\p{L}\p{N} ._-]+$/u;
    const normalized = [];
    for (const item of tokens) {
      const opening = item[0];
      const quoted = opening === '"' || opening === "'";
      if (quoted) {
        if (item.length < 3 || item.at(-1) !== opening) return "";
        const name = item.slice(1, -1).trim().replace(/\s+/g, " ");
        if (!name || !safeName.test(name)) return "";
        normalized.push(`${opening}${name}${opening}`);
      } else {
        const name = item.replace(/\s+/g, " ");
        if (!safeName.test(name)) return "";
        normalized.push(name);
      }
    }
    return normalized.join(", ");
  }

  function applyVisualSettings() {
    const scroller = state.scroller;
    if (!scroller) return;
    const display = currentDisplaySettings();
    const font = currentFontSettings();
    const stack = fontStack(font.family, font.customFamily);

    scroller.dataset.avatars = display.showAvatars ? "visible" : "hidden";
    scroller.dataset.avatarPosition = display.avatarPosition;
    scroller.style.setProperty("--post-font-size", `${displayFontSize(font.size)}px`);
    if (stack) scroller.style.setProperty("--post-font-family", stack);
    else scroller.style.removeProperty("--post-font-family");
  }

  Object.assign(ctx, {
    fontFamilies: FONT_FAMILIES,
    loadSettings,
    normalizeDisplaySettings,
    normalizeFontSettings,
    currentDisplaySettings,
    currentFontSettings,
    updateDisplaySettings,
    updateFontSettings,
    resetFontSettings,
    validFontFamily,
    fontStack,
    normalizeFontSize,
    displayFontSize,
    normalizeCustomFamily,
    applyVisualSettings,
  });
}
