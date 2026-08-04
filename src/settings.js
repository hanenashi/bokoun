const DEFAULT_DISPLAY_SETTINGS = Object.freeze({
  interfacePreset: "default",
  colorScheme: "system",
  showClubStrip: true,
  pageTransitions: true,
  fullscreenMode: true,
  showAvatars: true,
  avatarPosition: "inline",
  avatarSize: 40,
  avatarShape: "circle",
  replyMeta: "full",
  postSpacing: 9,
  postSeparators: true,
  compareHandle: false,
  firstUnread: false,
});

const DEFAULT_FONT_SETTINGS = Object.freeze({
  family: "default",
  customFamily: "",
  size: 17,
});

const DEFAULT_FAVORITES_SETTINGS = Object.freeze({
  sort: "activity",
  unreadMode: "count",
  fontFamily: "default",
  customFontFamily: "",
  fontSize: 17,
  spacing: 12,
  unreadOnly: false,
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
const AVATAR_SHAPES = new Set(["circle", "rounded", "square"]);
const REPLY_META_MODES = new Set(["full", "compact", "hidden"]);
const INTERFACE_PRESETS = new Set(["default", "compact-reader"]);
const COLOR_SCHEMES = new Set(["system", "light", "dark"]);
const FAVORITE_SORTS = new Set(["activity", "alphabetical", "unread", "manual"]);
const UNREAD_MODES = new Set(["count", "heat", "both", "hidden"]);
const MAX_CUSTOM_FAMILY_LENGTH = 160;
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 72;
const MAX_RECENT_CLUBS = 8;

export function installSettings(ctx) {
  const {
    DISPLAY_SETTINGS_KEY,
    FAVORITES_ORDER_KEY,
    FAVORITES_SETTINGS_KEY,
    FONT_SETTINGS_KEY,
    RECENT_CLUBS_KEY = "bokoun.recent-clubs.v1",
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
    if (!state.favoritesSettings) {
      const stored = safeStoredObject(gmGet(FAVORITES_SETTINGS_KEY, {}));
      state.favoritesSettings = normalizeFavoritesSettings(stored);
    }
    if (!state.favoriteManualOrder) {
      state.favoriteManualOrder = normalizeFavoriteOrder(
        gmGet(FAVORITES_ORDER_KEY, []),
      );
    }
    if (!state.recentClubs) {
      state.recentClubs = normalizeRecentClubs(gmGet(RECENT_CLUBS_KEY, []));
    }
    return {
      display: state.displaySettings,
      favorites: state.favoritesSettings,
      font: state.fontSettings,
    };
  }

  function safeStoredObject(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }

  function normalizeDisplaySettings(value = {}) {
    return {
      interfacePreset: INTERFACE_PRESETS.has(value.interfacePreset)
        ? value.interfacePreset
        : DEFAULT_DISPLAY_SETTINGS.interfacePreset,
      colorScheme: COLOR_SCHEMES.has(value.colorScheme)
        ? value.colorScheme
        : DEFAULT_DISPLAY_SETTINGS.colorScheme,
      showClubStrip: value.showClubStrip !== false,
      pageTransitions: value.pageTransitions !== false,
      fullscreenMode: value.fullscreenMode !== false,
      showAvatars: value.showAvatars !== false,
      avatarPosition: AVATAR_POSITIONS.has(value.avatarPosition)
        ? value.avatarPosition
        : DEFAULT_DISPLAY_SETTINGS.avatarPosition,
      avatarSize: normalizeAvatarSize(value.avatarSize),
      avatarShape: AVATAR_SHAPES.has(value.avatarShape)
        ? value.avatarShape
        : DEFAULT_DISPLAY_SETTINGS.avatarShape,
      replyMeta: REPLY_META_MODES.has(value.replyMeta)
        ? value.replyMeta
        : DEFAULT_DISPLAY_SETTINGS.replyMeta,
      postSpacing: normalizePostSpacing(value.postSpacing),
      postSeparators: value.postSeparators !== false,
      compareHandle: value.compareHandle === true,
      firstUnread: value.firstUnread === true,
    };
  }

  function normalizeFontSettings(value = {}) {
    return {
      family: validFontFamily(value.family),
      customFamily: String(value.customFamily || "").slice(0, MAX_CUSTOM_FAMILY_LENGTH),
      size: normalizeFontSize(value.size),
    };
  }

  function normalizeFavoritesSettings(value = {}) {
    return {
      sort: FAVORITE_SORTS.has(value.sort)
        ? value.sort
        : DEFAULT_FAVORITES_SETTINGS.sort,
      unreadMode: UNREAD_MODES.has(value.unreadMode)
        ? value.unreadMode
        : DEFAULT_FAVORITES_SETTINGS.unreadMode,
      fontFamily: validFontFamily(value.fontFamily),
      customFontFamily: String(value.customFontFamily || "").slice(0, MAX_CUSTOM_FAMILY_LENGTH),
      fontSize: normalizeFontSize(value.fontSize),
      spacing: normalizeFavoriteSpacing(value.spacing),
      unreadOnly: value.unreadOnly === true,
    };
  }

  function normalizeFavoriteOrder(value) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value.map(String).filter((href) => href.startsWith("/boards/")))];
  }

  function currentDisplaySettings() {
    return loadSettings().display;
  }

  function currentFontSettings() {
    return loadSettings().font;
  }

  function currentFavoritesSettings() {
    return loadSettings().favorites;
  }

  function currentFavoriteOrder() {
    loadSettings();
    return [...state.favoriteManualOrder];
  }

  function normalizeRecentClubs(value) {
    if (!Array.isArray(value)) return [];
    const normalized = [];
    const seen = new Set();
    for (const entry of value) {
      const href = normalizeClubRoute(entry?.href);
      const name = String(entry?.name || "").replace(/\s+/g, " ").trim().slice(0, 100);
      if (!href || !name || seen.has(href)) continue;
      seen.add(href);
      normalized.push({ href, name });
      if (normalized.length >= MAX_RECENT_CLUBS) break;
    }
    return normalized;
  }

  function normalizeClubRoute(value) {
    try {
      const base = typeof location !== "undefined"
        ? location.origin
        : "https://kapybara.okoun.cz";
      const url = new URL(value, base);
      if (url.origin !== base || !/^\/boards\/[^/]+\/?$/.test(url.pathname)) return "";
      return url.pathname.replace(/\/$/, "");
    } catch {
      return "";
    }
  }

  function currentRecentClubs() {
    loadSettings();
    return state.recentClubs.map((club) => ({ ...club }));
  }

  function rememberRecentClub(href, name) {
    const candidate = normalizeRecentClubs([{ href, name }])[0];
    if (!candidate) return currentRecentClubs();
    const current = currentRecentClubs();
    const next = [
      candidate,
      ...current.filter((club) => club.href !== candidate.href),
    ].slice(0, MAX_RECENT_CLUBS);
    if (
      next.length !== current.length
      || next.some((club, index) => (
        club.href !== current[index]?.href || club.name !== current[index]?.name
      ))
    ) {
      state.recentClubs = next;
      gmSet(RECENT_CLUBS_KEY, next);
    }
    return next.map((club) => ({ ...club }));
  }

  function updateDisplaySettings(patch, { render = true } = {}) {
    state.displaySettings = normalizeDisplaySettings({
      ...currentDisplaySettings(),
      ...patch,
    });
    gmSet(DISPLAY_SETTINGS_KEY, state.displaySettings);
    applyVisualSettings();
    if (render) {
      state.currentSignature = "";
      scheduleRender({ force: true });
    }
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

  function updateFavoritesSettings(
    patch,
    { clubs = state.favoriteSourceClubs, render = true } = {},
  ) {
    state.favoritesSettings = normalizeFavoritesSettings({
      ...currentFavoritesSettings(),
      ...patch,
    });
    gmSet(FAVORITES_SETTINGS_KEY, state.favoritesSettings);
    if (state.favoritesSettings.sort === "manual" && !state.favoriteManualOrder.length) {
      saveFavoriteOrder(clubs.map((club) => club.href));
    }
    if (state.favoritesSettings.sort !== "manual") state.editingFavoriteOrder = false;
    applyVisualSettings();
    if (render) {
      state.currentSignature = "";
      scheduleRender({ force: true });
    }
  }

  function resetFavoritesAppearance() {
    updateFavoritesSettings({
      fontFamily: DEFAULT_FAVORITES_SETTINGS.fontFamily,
      customFontFamily: DEFAULT_FAVORITES_SETTINGS.customFontFamily,
      fontSize: DEFAULT_FAVORITES_SETTINGS.fontSize,
      spacing: DEFAULT_FAVORITES_SETTINGS.spacing,
    });
  }

  function saveFavoriteOrder(order) {
    state.favoriteManualOrder = normalizeFavoriteOrder(order);
    gmSet(FAVORITES_ORDER_KEY, state.favoriteManualOrder);
  }

  function resetFavoriteOrder(clubs = state.favoriteSourceClubs) {
    saveFavoriteOrder(clubs.map((club) => club.href));
    state.currentSignature = "";
    scheduleRender({ force: true });
  }

  function sortFavorites(clubs) {
    const source = clubs.map((club) => ({ ...club }));
    const { sort } = currentFavoritesSettings();
    const collator = new Intl.Collator("cs", {
      numeric: true,
      sensitivity: "base",
    });

    if (sort === "alphabetical") {
      return source.sort((left, right) => collator.compare(left.name, right.name));
    }
    if (sort === "unread") {
      return source.sort((left, right) => (
        right.unread - left.unread
        || collator.compare(left.name, right.name)
      ));
    }
    if (sort === "manual") {
      const available = new Set(source.map((club) => club.href));
      const known = currentFavoriteOrder().filter((href) => available.has(href));
      const knownSet = new Set(known);
      const appended = source
        .map((club) => club.href)
        .filter((href) => !knownSet.has(href));
      const normalized = [...known, ...appended];
      if (
        normalized.length !== state.favoriteManualOrder.length
        || normalized.some((href, index) => href !== state.favoriteManualOrder[index])
      ) saveFavoriteOrder(normalized);
      const positions = new Map(normalized.map((href, index) => [href, index]));
      return source.sort((left, right) => (
        (positions.get(left.href) ?? Number.MAX_SAFE_INTEGER)
        - (positions.get(right.href) ?? Number.MAX_SAFE_INTEGER)
      ));
    }
    return source.sort((left, right) => right.unread - left.unread);
  }

  function unreadHeat(unread) {
    const count = Math.max(0, Number(unread) || 0);
    if (count === 0) return "";
    if (count <= 4) return "few";
    if (count <= 14) return "more";
    return "most";
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

  function normalizeAvatarSize(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return DEFAULT_DISPLAY_SETTINGS.avatarSize;
    return Math.round(Math.min(96, Math.max(20, parsed)));
  }

  function normalizeFavoriteSpacing(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return DEFAULT_FAVORITES_SETTINGS.spacing;
    return Math.round(Math.min(24, Math.max(0, parsed)));
  }

  function normalizePostSpacing(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return DEFAULT_DISPLAY_SETTINGS.postSpacing;
    return Math.round(Math.min(24, Math.max(4, parsed)));
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
    const favorites = currentFavoritesSettings();
    const stack = fontStack(font.family, font.customFamily);
    const favoriteStack = fontStack(favorites.fontFamily, favorites.customFontFamily);

    scroller.dataset.avatars = display.showAvatars ? "visible" : "hidden";
    scroller.dataset.interfacePreset = display.interfacePreset;
    scroller.dataset.colorScheme = display.colorScheme;
    scroller.dataset.clubStrip = (
      display.interfacePreset === "compact-reader" && display.showClubStrip
    ) ? "visible" : "hidden";
    scroller.dataset.pageTransitions = (
      display.interfacePreset === "compact-reader" && display.pageTransitions
    ) ? "enabled" : "disabled";
    scroller.dataset.avatarPosition = display.avatarPosition;
    scroller.dataset.avatarShape = display.avatarShape;
    scroller.dataset.postSeparators = display.postSeparators ? "visible" : "hidden";
    scroller.style.setProperty("--post-avatar-size", `${display.avatarSize}px`);
    scroller.style.setProperty(
      "--post-avatar-font-size",
      `${Math.max(12, Math.round(display.avatarSize * 0.38))}px`,
    );
    scroller.style.setProperty("--post-font-size", `${displayFontSize(font.size)}px`);
    scroller.style.setProperty("--post-spacing", `${display.postSpacing}px`);
    if (stack) scroller.style.setProperty("--post-font-family", stack);
    else scroller.style.removeProperty("--post-font-family");
    scroller.style.setProperty("--favorite-font-size", `${displayFontSize(favorites.fontSize)}px`);
    scroller.style.setProperty("--favorite-row-padding", `${favorites.spacing}px`);
    if (favoriteStack) scroller.style.setProperty("--favorite-font-family", favoriteStack);
    else scroller.style.removeProperty("--favorite-font-family");
    ctx.syncCompareMode?.();
    ctx.syncFullscreenMode?.();
  }

  Object.assign(ctx, {
    fontFamilies: FONT_FAMILIES,
    loadSettings,
    normalizeDisplaySettings,
    normalizeFontSettings,
    normalizeFavoritesSettings,
    normalizeFavoriteOrder,
    normalizeRecentClubs,
    normalizeClubRoute,
    currentDisplaySettings,
    currentFontSettings,
    currentFavoritesSettings,
    currentFavoriteOrder,
    currentRecentClubs,
    rememberRecentClub,
    updateDisplaySettings,
    updateFontSettings,
    updateFavoritesSettings,
    resetFavoritesAppearance,
    saveFavoriteOrder,
    resetFavoriteOrder,
    sortFavorites,
    unreadHeat,
    resetFontSettings,
    validFontFamily,
    fontStack,
    normalizeFontSize,
    displayFontSize,
    normalizeAvatarSize,
    normalizeFavoriteSpacing,
    normalizePostSpacing,
    normalizeCustomFamily,
    applyVisualSettings,
  });
}
