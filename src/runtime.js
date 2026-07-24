import { STYLES } from "./styles.js";

export const VERSION = "0.4.1";
export const HOST_ID = "bokoun-host";
export const RETURN_HOST_ID = "bokoun-return";
export const BOOT_TIMEOUT_MS = 10_000;
export const PAGE_LOAD_TIMEOUT_MS = 15_000;
export const COMPOSER_TIMEOUT_MS = 8_000;
export const POST_CONFIRM_TIMEOUT_MS = 15_000;
export const WRITE_FEEDBACK_MS = 8_000;
export const STRUCTURED_REFRESH_MS = 30_000;
export const ROUTE_POLL_MS = 150;
export const OLDER_TRIGGER_PX = 900;
export const MOBILE_QUERY = "(max-width: 760px)";
export const SESSION_DISABLED_KEY = "bokoun.disabled-for-tab.v1";
export const SCROLL_KEY = "bokoun.scroll.v1";
export const PREF_ENABLED_KEY = "bokoun.enabled";
export const DRAFTS_KEY = "bokoun.drafts.v1";
export const ACTIVE_COMPOSER_KEY = "bokoun.active-composer.v1";

export const SELECTORS = Object.freeze({
  favoritesPage: ".favorites-page",
  favoriteRows: ".favorites-page a[href^='/boards/']",
  favoriteName: ".name",
  favoriteUnreadCompact: ".pill-compact",
  favoriteUnreadFull: ".pill-full",
  favoriteTime: "time.ts",
  favoriteRelativeTime: ".ts-rel",
  boardHeader: "header.board-header",
  boardTitle: "header.board-header .title-link h1, header.board-header h1",
  posts: "article.post[data-post-id]",
  postAuthor: ".post-header .author",
  postTime: ".post-header time[datetime]",
  postDate: ".post-header .date",
  postReplyReference: ".reply-ref",
  postBody: ".body .markdown, .body",
  postReplyAction: ".reply-action",
  olderPosts: "a[aria-label^='Starší příspěvky'][href]",
  newPostLauncher: "button.entry-placeholder, button.new-post",
  newPostComposer: "section.new-post-composer[aria-label='Nový příspěvek']",
  replyComposer: "section.reply-composer[aria-label='Odpověď']",
  composerEditable: ".composer-content-editable[role='textbox'][contenteditable='true']",
  composerModeToggle: "button.mode-toggle[aria-pressed]",
  composerMarkdownNode: "code[data-language='markdown']",
});

export const ICONS = Object.freeze({
  back: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 12H5M11 18l-6-6 6-6"></path>
    </svg>
  `,
  write: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"></path>
    </svg>
  `,
});
export const state = {
  active: false,
  disabled: false,
  host: null,
  shadow: null,
  scroller: null,
  currentRouteKey: "",
  currentSignature: "",
  bootTimer: 0,
  renderTimer: 0,
  routeTimer: 0,
  saveTimer: 0,
  feedbackTimer: 0,
  observer: null,
  observing: false,
  nativeMode: false,
  pendingAnchor: null,
  boardKey: "",
  boardTitle: "",
  boardPosts: [],
  boardPostIndex: new Map(),
  boardPostPages: new Map(),
  boardLoadedPages: new Set(),
  boardNextHref: "",
  boardLoading: false,
  boardEnd: false,
  boardError: "",
  boardLoadAbort: null,
  boardAutoCooldownUntil: 0,
  boardStructuredReady: false,
  structuredCache: new Map(),
  structuredPending: new Map(),
  structuredFailures: new Map(),
  composer: null,
  writeFeedback: null,
  writeBusy: false,
};

export const gmGet = typeof GM_getValue === "function"
  ? GM_getValue
  : (key, fallback) => {
      const raw = localStorage.getItem(`bokoun.gm.${key}`);
      return raw === null ? fallback : JSON.parse(raw);
    };

export const gmSet = typeof GM_setValue === "function"
  ? GM_setValue
  : (key, value) => localStorage.setItem(`bokoun.gm.${key}`, JSON.stringify(value));

export const gmMenu = typeof GM_registerMenuCommand === "function"
  ? GM_registerMenuCommand
  : () => undefined;

export { STYLES };
