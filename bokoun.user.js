// ==UserScript==
// @name         Bokoun
// @namespace    https://github.com/hanenashi/bokoun
// @version      0.4.1
// @description  Minimal mobile reading and Markdown writing interface for Kapybara/Okoun
// @author       BeeChan
// @match        https://kapybara.okoun.cz/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/runtime.js
  var runtime_exports = {};
  __export(runtime_exports, {
    ACTIVE_COMPOSER_KEY: () => ACTIVE_COMPOSER_KEY,
    BOOT_TIMEOUT_MS: () => BOOT_TIMEOUT_MS,
    COMPOSER_TIMEOUT_MS: () => COMPOSER_TIMEOUT_MS,
    DRAFTS_KEY: () => DRAFTS_KEY,
    HOST_ID: () => HOST_ID,
    ICONS: () => ICONS,
    MOBILE_QUERY: () => MOBILE_QUERY,
    OLDER_TRIGGER_PX: () => OLDER_TRIGGER_PX,
    PAGE_LOAD_TIMEOUT_MS: () => PAGE_LOAD_TIMEOUT_MS,
    POST_CONFIRM_TIMEOUT_MS: () => POST_CONFIRM_TIMEOUT_MS,
    PREF_ENABLED_KEY: () => PREF_ENABLED_KEY,
    RETURN_HOST_ID: () => RETURN_HOST_ID,
    ROUTE_POLL_MS: () => ROUTE_POLL_MS,
    SCROLL_KEY: () => SCROLL_KEY,
    SELECTORS: () => SELECTORS,
    SESSION_DISABLED_KEY: () => SESSION_DISABLED_KEY,
    STRUCTURED_REFRESH_MS: () => STRUCTURED_REFRESH_MS,
    STYLES: () => STYLES,
    VERSION: () => VERSION,
    WRITE_FEEDBACK_MS: () => WRITE_FEEDBACK_MS,
    gmGet: () => gmGet,
    gmMenu: () => gmMenu,
    gmSet: () => gmSet,
    state: () => state
  });

  // src/styles.js
  var STYLES = `
  :host {
    --bg: #ffffff;
    --text: #172033;
    --muted: #667085;
    --border: #d0d5dd;
    --accent: #a85a00;
    --header-height: 52px;
    all: initial;
    color: var(--text);
    font-family: Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  button, a {
    font: inherit;
    -webkit-tap-highlight-color: transparent;
  }

  button {
    color: inherit;
  }

  .app {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    height: 100vh;
    height: 100dvh;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    background: var(--bg);
    color: var(--text);
    scrollbar-gutter: stable;
  }

  .topbar {
    position: sticky;
    top: 0;
    z-index: 10;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    min-height: var(--header-height);
    padding: env(safe-area-inset-top) 16px 0;
    border-bottom: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.98);
  }

  .topbar--board {
    grid-template-columns: 44px minmax(0, 1fr) 44px auto;
    padding-left: 4px;
  }

  .title {
    min-width: 0;
    margin: 0;
    overflow: hidden;
    color: var(--text);
    font-size: 22px;
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.015em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .title--brand {
    font-size: 24px;
  }

  .full-link,
  .icon-button {
    min-width: 44px;
    min-height: 44px;
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  .full-link {
    padding: 0 0 0 12px;
    color: var(--accent);
    font-size: 15px;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
  }

  .full-label--short {
    display: none;
  }

  .icon-button {
    display: inline-grid;
    place-items: center;
    padding: 0;
    color: var(--text);
  }

  .icon-button svg {
    width: 25px;
    height: 25px;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.8;
  }

  .tabs {
    position: sticky;
    top: calc(var(--header-height) + env(safe-area-inset-top));
    z-index: 9;
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 48px;
    border-bottom: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.98);
  }

  .tab {
    position: relative;
    display: grid;
    place-items: center;
    color: var(--muted);
    font-size: 15px;
    font-weight: 500;
    text-decoration: none;
  }

  .tab[aria-current="page"] {
    color: var(--accent);
  }

  .tab[aria-current="page"]::after {
    position: absolute;
    right: 12px;
    bottom: -1px;
    left: 12px;
    height: 2px;
    background: var(--accent);
    content: "";
  }

  .favorites {
    margin: 0;
    padding: 0 16px max(24px, env(safe-area-inset-bottom));
    list-style: none;
  }

  .favorite-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 14px;
    align-items: center;
    min-height: 72px;
    border-bottom: 1px solid var(--border);
    color: inherit;
    text-decoration: none;
  }

  .favorite-main {
    min-width: 0;
    padding: 12px 0;
  }

  .favorite-name {
    display: block;
    overflow: hidden;
    color: var(--text);
    font-size: 17px;
    font-weight: 650;
    line-height: 1.25;
    letter-spacing: -0.008em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .favorite-time {
    margin-top: 4px;
    color: var(--muted);
    font-size: 14px;
    font-weight: 400;
    line-height: 1.25;
  }

  .favorite-unread {
    min-width: 32px;
    color: var(--accent);
    font-size: 17px;
    font-variant-numeric: tabular-nums;
    font-weight: 650;
    text-align: right;
  }

  .posts {
    padding: 0 16px max(28px, env(safe-area-inset-bottom));
  }

  .post {
    padding: 20px 0 22px;
    border-bottom: 1px solid var(--border);
    scroll-margin-top: calc(var(--header-height) + env(safe-area-inset-top) + 56px);
  }

  .post--just-sent,
  .post--reply-context {
    margin-right: -12px;
    margin-left: -12px;
    padding-right: 12px;
    padding-left: 12px;
    transition: background 180ms ease, box-shadow 180ms ease;
  }

  .post--just-sent {
    background: #fff8ed;
    box-shadow: inset 3px 0 0 var(--accent);
  }

  .post--reply-context {
    background: #faf7f2;
    box-shadow: inset 2px 0 0 #d9b58e;
  }

  .post-header {
    display: flex;
    flex-wrap: wrap;
    gap: 5px 12px;
    align-items: baseline;
    margin-bottom: 11px;
  }

  .post-author {
    color: var(--text);
    font-size: 16px;
    font-weight: 700;
    line-height: 1.3;
  }

  .post-date {
    color: var(--muted);
    font-size: 14px;
    font-variant-numeric: tabular-nums;
    font-weight: 400;
    line-height: 1.3;
  }

  .reply-reference {
    margin: -4px 0 8px;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.35;
  }

  .post-body {
    overflow-wrap: anywhere;
    color: var(--text);
    font-size: 17px;
    font-weight: 400;
    line-height: 1.55;
  }

  .post-body > :first-child {
    margin-top: 0;
  }

  .post-body > :last-child {
    margin-bottom: 0;
  }

  .post-body p,
  .post-body ul,
  .post-body ol,
  .post-body blockquote,
  .post-body pre {
    margin: 0 0 0.8em;
  }

  .post-body ul,
  .post-body ol {
    padding-left: 1.4em;
  }

  .post-body blockquote {
    padding-left: 12px;
    border-left: 2px solid var(--border);
    color: #344054;
  }

  .post-body a {
    color: var(--accent);
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
  }

  .post-body img,
  .post-body video {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 12px 0;
  }

  .post-body pre,
  .post-body code {
    font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
  }

  .post-body pre {
    max-width: 100%;
    overflow-x: auto;
    padding: 12px;
    border: 1px solid var(--border);
    background: #f8f9fb;
    font-size: 14px;
    line-height: 1.45;
  }

  .post-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
  }

  .reply-button {
    min-height: 36px;
    padding: 0 4px;
    border: 0;
    background: transparent;
    color: var(--accent);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }

  .posts.is-replying .post {
    transition: opacity 140ms ease;
  }

  .posts.is-replying .post:not(.post--reply-target) {
    opacity: 0.34;
  }

  .composer-panel {
    position: relative;
    z-index: 2;
    padding: 16px;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: var(--bg);
  }

  .composer-panel--new {
    margin: 16px 16px 0;
  }

  .composer-panel--reply {
    margin-top: 14px;
    background: #f8f9fb;
  }

  .composer-heading {
    display: flex;
    gap: 12px;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .composer-title {
    margin: 0;
    font-size: 17px;
    font-weight: 700;
    line-height: 1.3;
  }

  .composer-kind {
    color: var(--muted);
    font-size: 13px;
    white-space: nowrap;
  }

  .composer-target {
    margin: -2px 0 10px;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.35;
  }

  .composer-textarea {
    display: block;
    width: 100%;
    min-height: 150px;
    max-height: 42vh;
    resize: vertical;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: #fff;
    color: var(--text);
    font: 400 16px/1.45 ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
  }

  .composer-textarea:focus {
    border-color: var(--accent);
    outline: 1px solid var(--accent);
  }

  .composer-error {
    margin-top: 10px;
    color: #9b2c2c;
    font-size: 14px;
    line-height: 1.4;
  }

  .composer-draft {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    min-height: 34px;
    margin-top: 5px;
  }

  .draft-status {
    color: var(--muted);
    font-size: 13px;
    line-height: 1.3;
  }

  .draft-discard {
    min-height: 34px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #8b3a3a;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
  }

  .draft-discard[hidden] {
    display: none;
  }

  .composer-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 12px;
  }

  .composer-action {
    min-height: 42px;
    padding: 0 16px;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: var(--bg);
    color: var(--text);
    font-size: 15px;
    font-weight: 650;
    cursor: pointer;
  }

  .composer-action--send {
    border-color: var(--accent);
    background: var(--accent);
    color: #fff;
  }

  .composer-action:disabled,
  .composer-textarea:disabled {
    cursor: default;
    opacity: 0.58;
  }

  .write-feedback {
    position: sticky;
    top: calc(var(--header-height) + env(safe-area-inset-top));
    z-index: 9;
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    min-height: 48px;
    padding: 8px 16px;
    border-bottom: 1px solid #b7dfc5;
    background: #ecf8f0;
    color: #1e6338;
    font-size: 14px;
    font-weight: 600;
  }

  .write-feedback-dismiss {
    min-width: 36px;
    min-height: 36px;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
  }

  .board-tail {
    display: grid;
    justify-items: center;
    gap: 12px;
    min-height: 84px;
    padding: 18px 16px max(28px, env(safe-area-inset-bottom));
    color: var(--muted);
    font-size: 14px;
    line-height: 1.35;
    text-align: center;
  }

  .tail-action {
    min-width: 132px;
    min-height: 42px;
    padding: 0 16px;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: var(--bg);
    color: var(--text);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }

  .tail-action--accent {
    border-color: var(--accent);
    color: var(--accent);
  }

  .tail-loading {
    display: inline-flex;
    gap: 10px;
    align-items: center;
    min-height: 42px;
  }

  .tail-loading::before {
    width: 18px;
    height: 18px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    content: "";
    animation: bokoun-spin 0.8s linear infinite;
  }

  .tail-error {
    color: #9b2c2c;
  }

  .tail-end {
    min-height: 42px;
    display: grid;
    place-items: center;
  }

  .empty {
    display: grid;
    min-height: 45vh;
    place-items: center;
    padding: 32px;
    color: var(--muted);
    font-size: 15px;
    text-align: center;
  }

  .loading {
    display: grid;
    min-height: 40vh;
    place-items: center;
    color: var(--muted);
    font-size: 15px;
  }

  .loading::after {
    width: 22px;
    height: 22px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    content: "";
    animation: bokoun-spin 0.8s linear infinite;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  a:focus-visible,
  button:focus-visible,
  textarea:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: -2px;
  }

  @keyframes bokoun-spin {
    to { transform: rotate(360deg); }
  }

  @media (min-width: 620px) {
    .app-inner {
      width: min(100%, 720px);
      min-height: 100%;
      margin: 0 auto;
      border-right: 1px solid var(--border);
      border-left: 1px solid var(--border);
      background: var(--bg);
    }
  }

  @media (max-width: 420px) {
    .topbar--board {
      grid-template-columns: 40px minmax(0, 1fr) 40px auto;
    }

    .topbar--board .title {
      font-size: 20px;
    }

    .topbar--board .icon-button {
      min-width: 40px;
    }

    .topbar--board .full-link {
      min-width: 40px;
      padding-left: 4px;
      font-size: 14px;
    }

    .topbar--board .full-label--long {
      display: none;
    }

    .topbar--board .full-label--short {
      display: inline;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loading::after {
      animation-duration: 1.8s;
    }
  }
`;

  // src/runtime.js
  var VERSION = "0.4.1";
  var HOST_ID = "bokoun-host";
  var RETURN_HOST_ID = "bokoun-return";
  var BOOT_TIMEOUT_MS = 1e4;
  var PAGE_LOAD_TIMEOUT_MS = 15e3;
  var COMPOSER_TIMEOUT_MS = 8e3;
  var POST_CONFIRM_TIMEOUT_MS = 15e3;
  var WRITE_FEEDBACK_MS = 8e3;
  var STRUCTURED_REFRESH_MS = 3e4;
  var ROUTE_POLL_MS = 150;
  var OLDER_TRIGGER_PX = 900;
  var MOBILE_QUERY = "(max-width: 760px)";
  var SESSION_DISABLED_KEY = "bokoun.disabled-for-tab.v1";
  var SCROLL_KEY = "bokoun.scroll.v1";
  var PREF_ENABLED_KEY = "bokoun.enabled";
  var DRAFTS_KEY = "bokoun.drafts.v1";
  var ACTIVE_COMPOSER_KEY = "bokoun.active-composer.v1";
  var SELECTORS = Object.freeze({
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
    composerMarkdownNode: "code[data-language='markdown']"
  });
  var ICONS = Object.freeze({
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
  `
  });
  var state = {
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
    boardPostIndex: /* @__PURE__ */ new Map(),
    boardPostPages: /* @__PURE__ */ new Map(),
    boardLoadedPages: /* @__PURE__ */ new Set(),
    boardNextHref: "",
    boardLoading: false,
    boardEnd: false,
    boardError: "",
    boardLoadAbort: null,
    boardAutoCooldownUntil: 0,
    boardStructuredReady: false,
    structuredCache: /* @__PURE__ */ new Map(),
    structuredPending: /* @__PURE__ */ new Map(),
    structuredFailures: /* @__PURE__ */ new Map(),
    composer: null,
    writeFeedback: null,
    writeBusy: false
  };
  var gmGet = typeof GM_getValue === "function" ? GM_getValue : (key, fallback) => {
    const raw = localStorage.getItem(`bokoun.gm.${key}`);
    return raw === null ? fallback : JSON.parse(raw);
  };
  var gmSet = typeof GM_setValue === "function" ? GM_setValue : (key, value) => localStorage.setItem(`bokoun.gm.${key}`, JSON.stringify(value));
  var gmMenu = typeof GM_registerMenuCommand === "function" ? GM_registerMenuCommand : () => void 0;

  // src/shell.js
  function installShell(ctx2) {
    const {
      VERSION: VERSION2,
      HOST_ID: HOST_ID2,
      RETURN_HOST_ID: RETURN_HOST_ID2,
      MOBILE_QUERY: MOBILE_QUERY2,
      SESSION_DISABLED_KEY: SESSION_DISABLED_KEY2,
      SCROLL_KEY: SCROLL_KEY2,
      PREF_ENABLED_KEY: PREF_ENABLED_KEY2,
      SELECTORS: SELECTORS2,
      STYLES: STYLES2,
      state: state2,
      gmGet: gmGet2,
      gmSet: gmSet2,
      gmMenu: gmMenu2
    } = ctx2;
    const maybeLoadOlder = (...args) => ctx2.maybeLoadOlder(...args);
    const captureBokounAnchor = (...args) => ctx2.captureBokounAnchor(...args);
    const restoreNativeAnchor = (...args) => ctx2.restoreNativeAnchor(...args);
    const navigateNativeRoute = (...args) => ctx2.navigateNativeRoute(...args);
    const returnToBokoun = (...args) => ctx2.returnToBokoun(...args);
    function routeType(pathname = location.pathname) {
      if (pathname === "/fav/activity" || pathname === "/fav/topics") return "favorites";
      if (/^\/boards\/[^/]+\/?$/.test(pathname)) return "board";
      return "unsupported";
    }
    function routeKey() {
      return `${location.pathname}${location.search}`;
    }
    function isMobileEligible() {
      const params = new URLSearchParams(location.search);
      if (params.get("bokoun") === "on") return true;
      if (params.get("bokoun") === "off") return false;
      return matchMedia(MOBILE_QUERY2).matches;
    }
    function shouldBoot() {
      return Boolean(gmGet2(PREF_ENABLED_KEY2, true)) && sessionStorage.getItem(SESSION_DISABLED_KEY2) !== "1" && isMobileEligible() && routeType() !== "unsupported";
    }
    function installGlobalStyle() {
      if (document.getElementById("bokoun-global-style")) return;
      const style = document.createElement("style");
      style.id = "bokoun-global-style";
      style.textContent = `
      html[data-bokoun-booting="true"] body {
        visibility: hidden !important;
      }
      html[data-bokoun-active="true"] body > :not(#${HOST_ID2}) {
        display: none !important;
      }
      html[data-bokoun-active="true"][data-bokoun-bridge="true"] body > :not(#${HOST_ID2}) {
        display: revert !important;
      }
      html[data-bokoun-active="true"],
      html[data-bokoun-active="true"] body {
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        overflow: hidden !important;
        background: #fff !important;
      }
      #${HOST_ID2} {
        display: block !important;
        visibility: visible !important;
      }
    `;
      document.documentElement.append(style);
    }
    function startPaintGuard() {
      if (shouldBoot()) {
        document.documentElement.dataset.bokounBooting = "true";
        installGlobalStyle();
      }
    }
    function waitForDocumentElement() {
      if (document.documentElement) return Promise.resolve();
      return new Promise((resolve) => {
        const observer = new MutationObserver(() => {
          if (!document.documentElement) return;
          observer.disconnect();
          resolve();
        });
        observer.observe(document, { childList: true });
      });
    }
    function waitForBody() {
      if (document.body) return Promise.resolve();
      return new Promise((resolve) => {
        const observer = new MutationObserver(() => {
          if (!document.body) return;
          observer.disconnect();
          resolve();
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
      });
    }
    function mountShell() {
      if (state2.host?.isConnected) return;
      document.getElementById(RETURN_HOST_ID2)?.remove();
      const host = document.createElement("div");
      host.id = HOST_ID2;
      host.setAttribute("role", "application");
      host.setAttribute("aria-label", "Bokoun");
      const shadow = host.attachShadow({ mode: "open" });
      shadow.innerHTML = `
      <style>${STYLES2}</style>
      <main class="app" tabindex="-1">
        <div class="app-inner">
          <div class="loading" aria-label="Načítám"></div>
        </div>
      </main>
    `;
      document.body.append(host);
      state2.host = host;
      state2.shadow = shadow;
      state2.scroller = shadow.querySelector(".app");
      state2.scroller.addEventListener("scroll", handleBokounScroll, { passive: true });
      state2.active = true;
      document.documentElement.dataset.bokounActive = "true";
      delete document.documentElement.dataset.bokounBooting;
    }
    function revealNative({ stop = false } = {}) {
      saveScroll();
      state2.active = false;
      if (document.documentElement) {
        delete document.documentElement.dataset.bokounBooting;
        delete document.documentElement.dataset.bokounActive;
      }
      state2.host?.remove();
      state2.host = null;
      state2.shadow = null;
      state2.scroller = null;
      state2.currentSignature = "";
      if (stop) {
        state2.disabled = true;
        clearTimeout(state2.bootTimer);
        clearTimeout(state2.renderTimer);
        clearInterval(state2.routeTimer);
        state2.observer?.disconnect();
        state2.observer = null;
        state2.observing = false;
      }
    }
    async function openFullKapybara() {
      const anchor = captureBokounAnchor();
      sessionStorage.setItem(SESSION_DISABLED_KEY2, "1");
      state2.nativeMode = true;
      if (anchor?.pageHref) {
        try {
          await navigateNativeRoute(anchor.pageHref, anchor.postId);
        } catch (error) {
          console.warn(`[Bokoun ${VERSION2}] Could not align the native page; using the closest loaded position.`, error?.name || "Error");
        }
      }
      revealNative();
      showReturnControl();
      restoreNativeAnchor(anchor);
    }
    function showReturnControl() {
      if (!document.body || document.getElementById(RETURN_HOST_ID2)) return;
      const host = document.createElement("div");
      host.id = RETURN_HOST_ID2;
      const shadow = host.attachShadow({ mode: "open" });
      shadow.innerHTML = `
      <style>
        :host {
          all: initial;
          position: fixed;
          right: 12px;
          bottom: max(72px, calc(env(safe-area-inset-bottom) + 60px));
          z-index: 2147483646;
          display: block;
        }

        button {
          display: grid;
          width: 44px;
          height: 44px;
          place-items: center;
          padding: 0;
          border: 1px solid #a85a00;
          border-radius: 50%;
          background: #ffffff;
          color: #a85a00;
          font: 700 19px/1 Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        button:focus-visible {
          outline: 2px solid #a85a00;
          outline-offset: 2px;
        }
      </style>
      <button type="button" aria-label="Zpět do Bokouna" title="Zpět do Bokouna">B</button>
    `;
      shadow.querySelector("button").addEventListener("click", returnToBokoun);
      document.body.append(host);
    }
    function registerMenus() {
      if (sessionStorage.getItem(SESSION_DISABLED_KEY2) === "1") {
        gmMenu2("Bokoun: zapnout v tomto panelu", returnToBokoun);
      } else {
        gmMenu2("Bokoun: otevřít plnou Kapybaru", openFullKapybara);
      }
      gmMenu2(
        gmGet2(PREF_ENABLED_KEY2, true) ? "Bokoun: vypnout trvale" : "Bokoun: zapnout trvale",
        () => {
          const next = !gmGet2(PREF_ENABLED_KEY2, true);
          gmSet2(PREF_ENABLED_KEY2, next);
          sessionStorage.removeItem(SESSION_DISABLED_KEY2);
          location.reload();
        }
      );
    }
    function getScrollMap() {
      try {
        return JSON.parse(sessionStorage.getItem(SCROLL_KEY2) || "{}");
      } catch {
        return {};
      }
    }
    function saveScroll() {
      if (!state2.scroller || !state2.currentRouteKey) return;
      const map = getScrollMap();
      map[state2.currentRouteKey] = Math.max(0, Math.round(state2.scroller.scrollTop));
      sessionStorage.setItem(SCROLL_KEY2, JSON.stringify(map));
    }
    function scheduleScrollSave() {
      clearTimeout(state2.saveTimer);
      state2.saveTimer = window.setTimeout(saveScroll, 100);
    }
    function handleBokounScroll() {
      scheduleScrollSave();
      maybeLoadOlder();
    }
    function restoreScroll(key, fallback = 0) {
      const y = getScrollMap()[key] ?? fallback;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          state2.scroller?.scrollTo({ top: y, behavior: "auto" });
        });
      });
    }
    function nativeReady(type) {
      if (type === "favorites") {
        return Boolean(document.querySelector(SELECTORS2.favoritesPage));
      }
      if (type === "board") {
        return Boolean(
          document.querySelector(SELECTORS2.boardHeader) && (document.querySelector(SELECTORS2.posts) || document.querySelector(".posts, .empty-state, .board-page"))
        );
      }
      return false;
    }
    Object.assign(ctx2, {
      routeType,
      routeKey,
      isMobileEligible,
      shouldBoot,
      installGlobalStyle,
      startPaintGuard,
      waitForDocumentElement,
      waitForBody,
      mountShell,
      revealNative,
      openFullKapybara,
      showReturnControl,
      registerMenus,
      getScrollMap,
      saveScroll,
      scheduleScrollSave,
      handleBokounScroll,
      restoreScroll,
      nativeReady
    });
  }

  // src/adapters.js
  function installAdapters(ctx2) {
    const {
      VERSION: VERSION2,
      STRUCTURED_REFRESH_MS: STRUCTURED_REFRESH_MS2,
      SELECTORS: SELECTORS2,
      state: state2
    } = ctx2;
    const routeKey = (...args) => ctx2.routeKey(...args);
    const scheduleRender = (...args) => ctx2.scheduleRender(...args);
    function text(node) {
      return node?.textContent?.replace(/\s+/g, " ").trim() || "";
    }
    function normalizeHref(value) {
      if (!value) return "";
      try {
        const url = new URL(value, location.origin);
        return url.origin === location.origin ? `${url.pathname}${url.search}${url.hash}` : url.href;
      } catch {
        return "";
      }
    }
    function unreadCount(row) {
      const compact = text(row.querySelector(SELECTORS2.favoriteUnreadCompact));
      const full = text(row.querySelector(SELECTORS2.favoriteUnreadFull));
      const match = (compact || full).match(/\d+/);
      return match ? Number.parseInt(match[0], 10) : 0;
    }
    function relativeActivityFromTimestamp(datetime) {
      if (!datetime) return "";
      const timestamp = Date.parse(datetime);
      if (!Number.isFinite(timestamp)) return "";
      const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1e3));
      if (seconds < 60) return "právě teď";
      if (seconds < 3600) return `před ${Math.floor(seconds / 60)} min`;
      if (seconds < 86400) return `před ${Math.floor(seconds / 3600)} h`;
      if (seconds < 172800) return "včera";
      return `před ${Math.floor(seconds / 86400)} dny`;
    }
    function relativeActivity(row) {
      const nativeRelative = text(row.querySelector(SELECTORS2.favoriteRelativeTime));
      if (nativeRelative) return nativeRelative;
      return relativeActivityFromTimestamp(
        row.querySelector(SELECTORS2.favoriteTime)?.getAttribute("datetime")
      );
    }
    function readFavoritesFromDom() {
      return [...document.querySelectorAll(SELECTORS2.favoriteRows)].map((row) => ({
        href: normalizeHref(row.getAttribute("href")),
        name: text(row.querySelector(SELECTORS2.favoriteName)),
        unread: unreadCount(row),
        activity: relativeActivity(row)
      })).filter((club) => club.href && club.name);
    }
    function decodeSvelteDataValues(values) {
      if (!Array.isArray(values) || !values.length) {
        throw new Error("Invalid Svelte data values");
      }
      const hydrated = new Array(values.length);
      const hasHydrated = /* @__PURE__ */ new Set();
      const special = /* @__PURE__ */ new Map([
        [-1, void 0],
        [-2, void 0],
        [-3, Number.NaN],
        [-4, Number.POSITIVE_INFINITY],
        [-5, Number.NEGATIVE_INFINITY],
        [-6, -0]
      ]);
      const hydrate = (index) => {
        if (special.has(index)) return special.get(index);
        if (!Number.isInteger(index) || index < 0 || index >= values.length) {
          throw new Error("Invalid Svelte data reference");
        }
        if (hasHydrated.has(index)) return hydrated[index];
        const encoded = values[index];
        if (encoded === null || typeof encoded !== "object") {
          hasHydrated.add(index);
          hydrated[index] = encoded;
          return encoded;
        }
        if (Array.isArray(encoded) && typeof encoded[0] === "string") {
          const tag = encoded[0];
          let decoded2;
          if (tag === "Date") decoded2 = new Date(encoded[1]);
          else if (tag === "BigInt") decoded2 = BigInt(encoded[1]);
          else if (tag === "RegExp") decoded2 = new RegExp(encoded[1], encoded[2] || "");
          else throw new Error(`Unsupported Svelte data type: ${tag}`);
          hasHydrated.add(index);
          hydrated[index] = decoded2;
          return decoded2;
        }
        const decoded = Array.isArray(encoded) ? [] : /* @__PURE__ */ Object.create(null);
        hasHydrated.add(index);
        hydrated[index] = decoded;
        if (Array.isArray(encoded)) {
          for (const reference of encoded) decoded.push(hydrate(reference));
        } else {
          for (const [key, reference] of Object.entries(encoded)) {
            if (["__proto__", "constructor", "prototype"].includes(key)) continue;
            decoded[key] = hydrate(reference);
          }
        }
        return decoded;
      };
      return hydrate(0);
    }
    function decodeSvelteDataText(raw) {
      const roots = [];
      const lines = String(raw || "").split(/\r?\n/).filter(Boolean);
      for (const line of lines) {
        const packet = JSON.parse(line);
        if (packet?.type === "chunk" && Array.isArray(packet.data)) {
          roots.push(decodeSvelteDataValues(packet.data));
        }
      }
      if (!roots.length) throw new Error("Svelte data contained no chunks");
      return roots;
    }
    function formatPragueParts(value) {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return null;
      const parts = /* @__PURE__ */ Object.create(null);
      for (const part of new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Prague",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23"
      }).formatToParts(date)) {
        if (part.type !== "literal") parts[part.type] = part.value;
      }
      return parts;
    }
    function formatPostTimestamp(value) {
      const parts = formatPragueParts(value);
      if (!parts) return "";
      return `${Number(parts.day)}.${Number(parts.month)}.${parts.year} ${parts.hour}:${parts.minute}:${parts.second}`;
    }
    function formatPaginationCursor(value) {
      const parts = formatPragueParts(value);
      if (!parts) return "";
      return `${parts.year}${parts.month}${parts.day}-${parts.hour}${parts.minute}${parts.second}`;
    }
    function olderHrefFromPagination(pagination, pageHref) {
      if (!pagination || pagination.isOldest) return "";
      const boundary = pagination.olderBoundaries?.[0];
      const cursor = formatPaginationCursor(boundary?.date);
      if (!cursor) return "";
      const url = new URL(pageHref, "https://kapybara.okoun.cz");
      const query = new URLSearchParams();
      query.set("f", cursor);
      const threaded = url.searchParams.get("t");
      if (threaded) query.set("t", threaded);
      return `${url.pathname}?${query}`;
    }
    function normalizedStructuredPageHref(pageHref) {
      const url = new URL(pageHref, "https://kapybara.okoun.cz");
      return url.origin === "https://kapybara.okoun.cz" ? `${url.pathname}${url.search}${url.hash}` : "";
    }
    function boardModelFromSvelteRoots(roots, pageHref, { sanitize = sanitizeHtml } = {}) {
      const boardRoot = roots.find((root) => root?.board && typeof root.board === "object");
      const pageRoot = roots.filter((root) => Array.isArray(root?.posts) && root.pagination).at(-1);
      if (!boardRoot?.board || !pageRoot || boardRoot.apiAccessRequired || pageRoot.postsError) {
        throw new Error("Incomplete structured board data");
      }
      const posts = pageRoot.posts.map((post) => {
        const parentAuthor = post?.parent?.author?.login;
        const parentDate = formatPostTimestamp(post?.parent?.posted);
        return {
          id: String(post?.id || ""),
          author: String(post?.author?.login || "neznámý"),
          date: formatPostTimestamp(post?.posted),
          datetime: typeof post?.posted === "string" ? post.posted : "",
          replyReference: post?.parent ? `Reakce na ${parentAuthor || "neznámý"}${parentDate ? `, ${parentDate}` : ""}` : "",
          bodyHtml: sanitize(typeof post?.htmlBody === "string" ? post.htmlBody : ""),
          pageHref: normalizedStructuredPageHref(pageHref)
        };
      }).filter((post) => post.id);
      return {
        title: String(boardRoot.board.name || boardRoot.board.slug || "Klub"),
        posts,
        nextOlderHref: olderHrefFromPagination(pageRoot.pagination, pageHref)
      };
    }
    function favoritesModelFromSvelteRoots(roots) {
      const root = roots.filter((candidate) => Array.isArray(candidate?.boards)).at(-1);
      if (!root || root.apiAccessRequired || root.error) {
        throw new Error("Incomplete structured Favorites data");
      }
      return root.boards.map((board) => ({
        href: `/boards/${encodeURIComponent(String(board?.slug || ""))}`,
        name: String(board?.name || ""),
        unread: Number.isFinite(board?.newPostsCount) ? Math.max(0, board.newPostsCount) : 0,
        activity: relativeActivityFromTimestamp(board?.lastPosted)
      })).filter((club) => club.href !== "/boards/" && club.name);
    }
    function structuredDataUrl(pageHref) {
      const url = new URL(pageHref, location.origin);
      if (url.origin !== location.origin) throw new Error("Unsafe structured data URL");
      url.pathname = `${url.pathname.replace(/\/$/, "")}/__data.json`;
      url.searchParams.delete("bokoun");
      url.hash = "";
      return url;
    }
    async function fetchStructuredModel(type, pageHref, { signal } = {}) {
      const response = await fetch(structuredDataUrl(pageHref), {
        credentials: "same-origin",
        headers: { Accept: "text/sveltekit-data" },
        signal
      });
      if (!response.ok || !response.headers.get("content-type")?.includes("text/sveltekit-data")) {
        throw new Error(`Structured data HTTP ${response.status}`);
      }
      const roots = decodeSvelteDataText(await response.text());
      const model = type === "favorites" ? favoritesModelFromSvelteRoots(roots) : boardModelFromSvelteRoots(roots, pageHref);
      return { type, model, fetchedAt: Date.now() };
    }
    function structuredCacheKey(type, pageHref) {
      return `${type}:${normalizeHref(pageHref)}`;
    }
    function cachedStructuredModel(type, pageHref) {
      return state2.structuredCache.get(structuredCacheKey(type, pageHref))?.model || null;
    }
    function primeStructuredModel(type, pageHref) {
      const cacheKey = structuredCacheKey(type, pageHref);
      const cached = state2.structuredCache.get(cacheKey);
      if (cached && Date.now() - cached.fetchedAt < STRUCTURED_REFRESH_MS2 || state2.structuredPending.has(cacheKey)) return;
      const lastFailure = state2.structuredFailures.get(cacheKey) || 0;
      if (Date.now() - lastFailure < 3e4) return;
      const pending = fetchStructuredModel(type, pageHref).then((entry) => {
        state2.structuredCache.set(cacheKey, entry);
        state2.structuredFailures.delete(cacheKey);
        state2.currentSignature = "";
        scheduleRender({ force: true });
      }).catch((error) => {
        state2.structuredFailures.set(cacheKey, Date.now());
        console.warn(
          `[Bokoun ${VERSION2}] Structured ${type} data unavailable; using DOM fallback.`,
          error?.name || "Error"
        );
      }).finally(() => state2.structuredPending.delete(cacheKey));
      state2.structuredPending.set(cacheKey, pending);
    }
    function invalidateStructuredModel(type, pageHref) {
      const cacheKey = structuredCacheKey(type, pageHref);
      state2.structuredCache.delete(cacheKey);
      state2.structuredFailures.delete(cacheKey);
    }
    function sanitizeHtml(html) {
      const template = document.createElement("template");
      template.innerHTML = html || "";
      const allowedTags = /* @__PURE__ */ new Set([
        "A",
        "B",
        "BLOCKQUOTE",
        "BR",
        "CODE",
        "DEL",
        "DIV",
        "EM",
        "HR",
        "I",
        "IMG",
        "LI",
        "OL",
        "P",
        "PRE",
        "S",
        "SPAN",
        "STRONG",
        "U",
        "UL"
      ]);
      const removeTags = /* @__PURE__ */ new Set([
        "BASE",
        "BUTTON",
        "EMBED",
        "FORM",
        "IFRAME",
        "INPUT",
        "LINK",
        "META",
        "OBJECT",
        "SCRIPT",
        "STYLE",
        "SVG",
        "MATH",
        "TEXTAREA"
      ]);
      const elements = [...template.content.querySelectorAll("*")];
      for (const element of elements) {
        if (removeTags.has(element.tagName)) {
          element.remove();
          continue;
        }
        if (!allowedTags.has(element.tagName)) {
          element.replaceWith(...element.childNodes);
          continue;
        }
        for (const attribute of [...element.attributes]) {
          const name = attribute.name.toLowerCase();
          const allowed = element.tagName === "A" && ["href", "title"].includes(name) || element.tagName === "IMG" && ["src", "alt", "title", "width", "height"].includes(name) || element.tagName === "SPAN" && name === "title";
          if (!allowed) element.removeAttribute(attribute.name);
        }
        if (element.tagName === "A") {
          const href = element.getAttribute("href");
          if (!safeUrl(href, { image: false })) {
            element.removeAttribute("href");
          } else {
            element.setAttribute("rel", "noopener noreferrer");
          }
        }
        if (element.tagName === "IMG") {
          const src = element.getAttribute("src");
          if (!safeUrl(src, { image: true })) {
            element.remove();
          } else {
            element.setAttribute("loading", "lazy");
            element.setAttribute("decoding", "async");
          }
        }
      }
      return template.innerHTML;
    }
    function safeUrl(value, { image }) {
      if (!value) return false;
      try {
        const url = new URL(value, location.href);
        if (["http:", "https:"].includes(url.protocol)) return true;
        return image && url.protocol === "data:" && /^data:image\//i.test(value);
      } catch {
        return false;
      }
    }
    function compactDate(post) {
      const time = post.querySelector(SELECTORS2.postTime);
      const visible = text(post.querySelector(SELECTORS2.postDate));
      if (visible) return visible;
      const datetime = time?.getAttribute("datetime");
      if (!datetime) return "";
      const date = new Date(datetime);
      if (Number.isNaN(date.getTime())) return "";
      return new Intl.DateTimeFormat("cs-CZ", {
        day: "numeric",
        month: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(date);
    }
    function readBoardFromDom(root = document, pageHref = routeKey()) {
      const title = text(root.querySelector(SELECTORS2.boardTitle)) || decodeURIComponent(location.pathname.split("/").filter(Boolean).at(-1) || "Klub");
      const posts = [...root.querySelectorAll(SELECTORS2.posts)].map((post) => {
        const body = post.querySelector(SELECTORS2.postBody);
        return {
          id: post.getAttribute("data-post-id") || "",
          author: text(post.querySelector(SELECTORS2.postAuthor)) || "neznámý",
          date: compactDate(post),
          datetime: post.querySelector(SELECTORS2.postTime)?.getAttribute("datetime") || "",
          replyReference: text(post.querySelector(SELECTORS2.postReplyReference)),
          bodyHtml: sanitizeHtml(body?.innerHTML || ""),
          pageHref: normalizeHref(pageHref)
        };
      }).filter((post) => post.id);
      const olderLinks = [...root.querySelectorAll(SELECTORS2.olderPosts)];
      const nextOlderHref = normalizeHref(olderLinks.at(-1)?.getAttribute("href") || "");
      return { title, posts, nextOlderHref };
    }
    Object.assign(ctx2, {
      text,
      normalizeHref,
      unreadCount,
      relativeActivityFromTimestamp,
      relativeActivity,
      readFavoritesFromDom,
      decodeSvelteDataValues,
      decodeSvelteDataText,
      formatPragueParts,
      formatPostTimestamp,
      formatPaginationCursor,
      olderHrefFromPagination,
      normalizedStructuredPageHref,
      boardModelFromSvelteRoots,
      favoritesModelFromSvelteRoots,
      structuredDataUrl,
      fetchStructuredModel,
      structuredCacheKey,
      cachedStructuredModel,
      primeStructuredModel,
      invalidateStructuredModel,
      sanitizeHtml,
      safeUrl,
      compactDate,
      readBoardFromDom
    });
  }

  // src/board-state.js
  function installBoardState(ctx2) {
    const {
      state: state2
    } = ctx2;
    const routeKey = (...args) => ctx2.routeKey(...args);
    const normalizeHref = (...args) => ctx2.normalizeHref(...args);
    function resetBoardAccumulator(model, pageHref, { structured = false } = {}) {
      state2.boardLoadAbort?.abort();
      state2.boardLoadAbort = null;
      state2.boardKey = location.pathname;
      state2.boardTitle = model.title;
      state2.boardPosts = [];
      state2.boardPostIndex = /* @__PURE__ */ new Map();
      state2.boardPostPages = /* @__PURE__ */ new Map();
      state2.boardLoadedPages = /* @__PURE__ */ new Set();
      state2.boardNextHref = "";
      state2.boardLoading = false;
      state2.boardEnd = false;
      state2.boardError = "";
      state2.boardAutoCooldownUntil = 0;
      state2.boardStructuredReady = structured;
      mergeBoardPage(model, pageHref, { setNext: true });
    }
    function mergeBoardPage(model, pageHref, { setNext = false } = {}) {
      const normalizedPage = normalizeHref(pageHref);
      let added = 0;
      if (normalizedPage) state2.boardLoadedPages.add(normalizedPage);
      if (model.title) state2.boardTitle = model.title;
      for (const post of model.posts) {
        const index = state2.boardPostIndex.get(post.id);
        if (index === void 0) {
          const page = normalizedPage || post.pageHref || routeKey();
          state2.boardPostIndex.set(post.id, state2.boardPosts.length);
          state2.boardPostPages.set(post.id, page);
          state2.boardPosts.push({ ...post, pageHref: page });
          added += 1;
        } else {
          const page = state2.boardPostPages.get(post.id) || normalizedPage || post.pageHref;
          state2.boardPosts[index] = { ...post, pageHref: page };
        }
      }
      if (setNext) {
        state2.boardNextHref = model.nextOlderHref;
        state2.boardEnd = !model.nextOlderHref;
      }
      return added;
    }
    function refreshBoardNewestPage(model, pageHref) {
      const normalizedPage = normalizeHref(pageHref);
      const freshIds = new Set(model.posts.map((post) => post.id));
      const older = state2.boardPosts.filter((post) => !freshIds.has(post.id)).map((post) => ({
        post,
        pageHref: state2.boardPostPages.get(post.id) || post.pageHref
      }));
      state2.boardPosts = [];
      state2.boardPostIndex = /* @__PURE__ */ new Map();
      state2.boardPostPages = /* @__PURE__ */ new Map();
      if (normalizedPage) state2.boardLoadedPages.add(normalizedPage);
      if (model.title) state2.boardTitle = model.title;
      for (const post of model.posts) {
        state2.boardPostIndex.set(post.id, state2.boardPosts.length);
        state2.boardPostPages.set(post.id, normalizedPage || post.pageHref);
        state2.boardPosts.push({ ...post, pageHref: normalizedPage || post.pageHref });
      }
      for (const { post, pageHref: olderPageHref } of older) {
        state2.boardPostIndex.set(post.id, state2.boardPosts.length);
        state2.boardPostPages.set(post.id, olderPageHref);
        state2.boardPosts.push(post);
      }
      if (!state2.boardStructuredReady || state2.boardLoadedPages.size <= 1) {
        state2.boardNextHref = model.nextOlderHref;
        state2.boardEnd = !model.nextOlderHref;
      }
    }
    function boardViewModel() {
      return {
        title: state2.boardTitle,
        posts: state2.boardPosts,
        nextOlderHref: state2.boardNextHref,
        loading: state2.boardLoading,
        end: state2.boardEnd,
        error: state2.boardError,
        loadedPageCount: state2.boardLoadedPages.size
      };
    }
    Object.assign(ctx2, {
      resetBoardAccumulator,
      mergeBoardPage,
      refreshBoardNewestPage,
      boardViewModel
    });
  }

  // src/writing.js
  function installWriting(ctx2) {
    const {
      VERSION: VERSION2,
      COMPOSER_TIMEOUT_MS: COMPOSER_TIMEOUT_MS2,
      POST_CONFIRM_TIMEOUT_MS: POST_CONFIRM_TIMEOUT_MS2,
      WRITE_FEEDBACK_MS: WRITE_FEEDBACK_MS2,
      DRAFTS_KEY: DRAFTS_KEY2,
      ACTIVE_COMPOSER_KEY: ACTIVE_COMPOSER_KEY2,
      SELECTORS: SELECTORS2,
      state: state2,
      gmGet: gmGet2,
      gmSet: gmSet2
    } = ctx2;
    const routeType = (...args) => ctx2.routeType(...args);
    const routeKey = (...args) => ctx2.routeKey(...args);
    const text = (...args) => ctx2.text(...args);
    const invalidateStructuredModel = (...args) => ctx2.invalidateStructuredModel(...args);
    const readBoardFromDom = (...args) => ctx2.readBoardFromDom(...args);
    const resetBoardAccumulator = (...args) => ctx2.resetBoardAccumulator(...args);
    const nativePostById = (...args) => ctx2.nativePostById(...args);
    const navigateNativeRoute = (...args) => ctx2.navigateNativeRoute(...args);
    const render = (...args) => ctx2.render(...args);
    const scheduleRender = (...args) => ctx2.scheduleRender(...args);
    function currentBoardId() {
      const match = location.pathname.match(/^\/boards\/([^/]+)\/?$/);
      return match ? decodeURIComponent(match[1]) : "";
    }
    function composerDraftKey(kind, replyTo = "", boardId = currentBoardId()) {
      return `${boardId}:${kind}:${replyTo || ""}`;
    }
    function getDrafts() {
      const drafts = gmGet2(DRAFTS_KEY2, {});
      return drafts && typeof drafts === "object" && !Array.isArray(drafts) ? drafts : {};
    }
    function loadDraft(kind, replyTo = "", boardId = currentBoardId()) {
      const value = getDrafts()[composerDraftKey(kind, replyTo, boardId)];
      return typeof value === "string" ? value : "";
    }
    function saveDraft(kind, replyTo, body, boardId = currentBoardId()) {
      const drafts = getDrafts();
      const key = composerDraftKey(kind, replyTo, boardId);
      if (body) drafts[key] = body;
      else delete drafts[key];
      gmSet2(DRAFTS_KEY2, drafts);
    }
    function clearDraft(kind, replyTo = "", boardId = currentBoardId()) {
      saveDraft(kind, replyTo, "", boardId);
    }
    function getActiveComposer() {
      const active = gmGet2(ACTIVE_COMPOSER_KEY2, null);
      return active && typeof active === "object" && !Array.isArray(active) ? active : null;
    }
    function rememberActiveComposer(composer) {
      if (!composer) return;
      gmSet2(ACTIVE_COMPOSER_KEY2, {
        boardId: composer.boardId,
        kind: composer.kind,
        replyTo: composer.replyTo,
        replyAuthor: composer.replyAuthor
      });
    }
    function forgetActiveComposer() {
      gmSet2(ACTIVE_COMPOSER_KEY2, null);
    }
    function restoreActiveComposer() {
      const boardId = currentBoardId();
      if (!boardId || state2.writeBusy) return;
      if (state2.composer?.boardId === boardId) return;
      if (state2.composer && state2.composer.boardId !== boardId) state2.composer = null;
      const active = getActiveComposer();
      if (!active || active.boardId !== boardId || !["new", "reply"].includes(active.kind)) return;
      const replyTo = active.replyTo ? String(active.replyTo) : "";
      if (active.kind === "reply" && !state2.boardPostIndex.has(replyTo)) return;
      const body = loadDraft(active.kind, replyTo, boardId);
      if (!body) return;
      const targetIndex = replyTo ? state2.boardPostIndex.get(replyTo) : void 0;
      const target = targetIndex === void 0 ? null : state2.boardPosts[targetIndex];
      state2.composer = {
        boardId,
        kind: active.kind,
        replyTo,
        replyAuthor: target?.author || active.replyAuthor || "",
        body,
        status: "editing",
        error: "",
        ambiguous: false
      };
    }
    function openComposer(kind, replyTo = "") {
      if (state2.writeBusy || routeType() !== "board") return;
      const boardId = currentBoardId();
      const targetIndex = replyTo ? state2.boardPostIndex.get(String(replyTo)) : void 0;
      const target = targetIndex === void 0 ? null : state2.boardPosts[targetIndex];
      state2.composer = {
        boardId,
        kind,
        replyTo: replyTo ? String(replyTo) : "",
        replyAuthor: target?.author || "",
        body: loadDraft(kind, replyTo, boardId),
        status: "editing",
        error: "",
        ambiguous: false
      };
      rememberActiveComposer(state2.composer);
      scheduleRender({ force: true });
      window.setTimeout(() => {
        const targetPost = state2.composer?.kind === "reply" ? state2.shadow?.querySelector(`[data-bokoun-post-id="${CSS.escape(state2.composer.replyTo)}"]`) : state2.shadow?.querySelector(".composer-panel--new");
        targetPost?.scrollIntoView({ block: "center", behavior: "smooth" });
        state2.shadow?.querySelector(".composer-textarea")?.focus();
      }, 100);
    }
    function closeComposer() {
      if (state2.writeBusy) return;
      if (!state2.composer?.ambiguous) dismissNativeComposers();
      forgetActiveComposer();
      state2.composer = null;
      scheduleRender({ force: true });
    }
    function discardComposerDraft() {
      if (!state2.composer || state2.writeBusy) return;
      const { kind, replyTo, boardId, ambiguous } = state2.composer;
      clearDraft(kind, replyTo, boardId);
      forgetActiveComposer();
      if (!ambiguous) dismissNativeComposers();
      state2.composer = null;
      scheduleRender({ force: true });
    }
    function updateDraftUi(value) {
      const hasDraft = Boolean(value);
      const status = state2.shadow?.querySelector("[data-draft-status]");
      const discard = state2.shadow?.querySelector("[data-action='discard-draft']");
      if (status) {
        status.textContent = hasDraft ? "Koncept uložen v zařízení" : "Koncept se ukládá automaticky";
      }
      if (discard) discard.hidden = !hasDraft;
    }
    function updateComposerBody(value) {
      if (!state2.composer || state2.writeBusy) return;
      state2.composer.body = value;
      state2.composer.error = "";
      saveDraft(state2.composer.kind, state2.composer.replyTo, value, state2.composer.boardId);
      rememberActiveComposer(state2.composer);
      updateDraftUi(value);
    }
    function persistComposerDraft() {
      if (!state2.composer) return;
      const textarea = state2.shadow?.querySelector(".composer-textarea");
      if (textarea) state2.composer.body = textarea.value;
      saveDraft(
        state2.composer.kind,
        state2.composer.replyTo,
        state2.composer.body,
        state2.composer.boardId
      );
      rememberActiveComposer(state2.composer);
    }
    function clearWriteFeedback({ render: render2 = true } = {}) {
      clearTimeout(state2.feedbackTimer);
      state2.feedbackTimer = 0;
      state2.writeFeedback = null;
      if (render2) scheduleRender({ force: true });
    }
    function showWriteFeedback(composer, postId) {
      clearWriteFeedback({ render: false });
      state2.writeFeedback = {
        boardId: composer.boardId,
        kind: composer.kind,
        postId,
        replyTo: composer.replyTo,
        message: composer.kind === "reply" ? "Odpověď odeslána." : "Příspěvek odeslán."
      };
      state2.feedbackTimer = window.setTimeout(clearWriteFeedback, WRITE_FEEDBACK_MS2);
    }
    async function waitForNative(probe, timeout, message) {
      const started = Date.now();
      while (Date.now() - started < timeout) {
        const result = probe();
        if (result) return result;
        await new Promise((resolve) => window.setTimeout(resolve, 50));
      }
      throw new Error(message);
    }
    function dismissNativeComposers() {
      const selectors = `${SELECTORS2.newPostComposer}, ${SELECTORS2.replyComposer}`;
      for (const section of document.querySelectorAll(selectors)) {
        const cancel = [...section.querySelectorAll("button")].find((button) => text(button) === "Zrušit" || button.getAttribute("aria-label") === "Zrušit");
        cancel?.click();
      }
    }
    async function injectNativeMarkdown(section, body) {
      const toggle = section.querySelector(SELECTORS2.composerModeToggle);
      if (!toggle) throw new Error("Native Markdown toggle is unavailable");
      if (toggle.getAttribute("aria-pressed") !== "true") toggle.click();
      const editable = await waitForNative(
        () => {
          const candidate = section.querySelector(SELECTORS2.composerEditable);
          return candidate?.querySelector(SELECTORS2.composerMarkdownNode) ? candidate : null;
        },
        COMPOSER_TIMEOUT_MS2,
        "Native Markdown editor did not open"
      );
      editable.focus();
      const range = document.createRange();
      range.selectNodeContents(editable);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      const accepted = document.execCommand("insertText", false, body);
      if (!accepted) throw new Error("Native editor rejected the draft");
      await waitForNative(
        () => normalizeEditorText(editable.innerText) === normalizeEditorText(body),
        3e3,
        "Native editor did not retain the draft"
      );
    }
    function normalizeEditorText(value) {
      return String(value || "").replace(/\r\n?/g, "\n").replace(/\u00a0/g, " ").trim();
    }
    function findCreatedPost(beforeIds, root = document) {
      return [...root.querySelectorAll(SELECTORS2.posts)].filter((post) => !beforeIds.has(post.getAttribute("data-post-id") || "")).sort((left, right) => Number(right.getAttribute("data-post-id") || 0) - Number(left.getAttribute("data-post-id") || 0))[0] || null;
    }
    async function waitForCreatedPost(beforeIds) {
      const started = Date.now();
      while (Date.now() - started < POST_CONFIRM_TIMEOUT_MS2) {
        const created2 = findCreatedPost(beforeIds);
        if (created2) return { created: created2, root: document, pageHref: routeKey() };
        await new Promise((resolve) => window.setTimeout(resolve, 120));
      }
      const boardId = currentBoardId();
      if (!boardId) return null;
      const pageHref = `/boards/${encodeURIComponent(boardId)}`;
      const response = await fetch(pageHref, {
        credentials: "same-origin",
        headers: { Accept: "text/html" }
      });
      if (!response.ok) return null;
      const html = await response.text();
      const root = new DOMParser().parseFromString(html, "text/html");
      const created = findCreatedPost(beforeIds, root);
      return created ? { created, root, pageHref } : null;
    }
    async function submitThroughNative(composer) {
      const beforeIds = /* @__PURE__ */ new Set([
        ...state2.boardPostIndex.keys(),
        ...[...document.querySelectorAll(SELECTORS2.posts)].map((post) => post.getAttribute("data-post-id") || "")
      ]);
      let submitted = false;
      let stage = "prepare";
      document.documentElement.dataset.bokounBridge = "true";
      try {
        dismissNativeComposers();
        let section;
        let submitLabel;
        if (composer.kind === "reply") {
          stage = "open-reply";
          const pageHref = state2.boardPostPages.get(composer.replyTo) || routeKey();
          if (!nativePostById(composer.replyTo)) {
            await navigateNativeRoute(pageHref, composer.replyTo);
          }
          const target = nativePostById(composer.replyTo);
          const reply = target?.querySelector(SELECTORS2.postReplyAction);
          if (!reply) throw new Error("Native reply action is unavailable");
          reply.click();
          section = await waitForNative(
            () => document.querySelector(SELECTORS2.replyComposer),
            COMPOSER_TIMEOUT_MS2,
            "Native reply composer did not open"
          );
          submitLabel = "Odeslat";
        } else {
          stage = "open-new-post";
          const launcher = document.querySelector(SELECTORS2.newPostLauncher);
          if (!launcher) throw new Error("Native new-post action is unavailable");
          launcher.click();
          section = await waitForNative(
            () => document.querySelector(SELECTORS2.newPostComposer),
            COMPOSER_TIMEOUT_MS2,
            "Native new-post composer did not open"
          );
          submitLabel = "Odeslat příspěvek";
        }
        stage = "inject-markdown";
        await injectNativeMarkdown(section, composer.body.trim());
        const submit = [...section.querySelectorAll("button")].find((button) => button.type === "submit" && text(button) === submitLabel);
        if (!submit || submit.disabled) throw new Error("Native submit action is unavailable");
        stage = "submit";
        submitted = true;
        submit.click();
        stage = "confirm";
        const confirmation = await waitForCreatedPost(beforeIds);
        if (!confirmation) throw new Error("Submitted post could not be confirmed");
        const model = readBoardFromDom(confirmation.root, confirmation.pageHref);
        const postId = confirmation.created.getAttribute("data-post-id") || "";
        if (!postId || !model.posts.some((post) => post.id === postId)) {
          throw new Error("Confirmed post could not be read");
        }
        return { postId, model, pageHref: confirmation.pageHref };
      } catch (error) {
        error.bokounSubmitted = submitted;
        error.bokounStage = stage;
        throw error;
      } finally {
        delete document.documentElement.dataset.bokounBridge;
      }
    }
    async function submitComposer(event) {
      event?.preventDefault();
      if (!state2.composer || state2.writeBusy || state2.composer.ambiguous) return;
      const body = state2.composer.body.trim();
      if (!body) {
        state2.composer.error = "Napište nejdřív text příspěvku.";
        scheduleRender({ force: true });
        return;
      }
      state2.composer.body = body;
      state2.composer.status = "sending";
      state2.composer.error = "";
      state2.writeBusy = true;
      saveDraft(
        state2.composer.kind,
        state2.composer.replyTo,
        body,
        state2.composer.boardId
      );
      rememberActiveComposer(state2.composer);
      scheduleRender({ force: true });
      try {
        const sent = { ...state2.composer };
        const result = await submitThroughNative(sent);
        clearDraft(sent.kind, sent.replyTo, sent.boardId);
        forgetActiveComposer();
        state2.composer = null;
        state2.writeBusy = false;
        showWriteFeedback(sent, result.postId);
        invalidateStructuredModel("board", result.pageHref);
        resetBoardAccumulator(result.model, result.pageHref);
        state2.currentSignature = "";
        render({ force: true });
        requestAnimationFrame(() => {
          state2.shadow?.querySelector(`[data-bokoun-post-id="${CSS.escape(result.postId)}"]`)?.scrollIntoView({ block: "start", behavior: "smooth" });
        });
      } catch (error) {
        state2.writeBusy = false;
        if (!state2.composer) return;
        state2.composer.status = "error";
        state2.composer.ambiguous = Boolean(error?.bokounSubmitted);
        state2.composer.error = error?.bokounSubmitted ? "Kapybara příspěvek převzala, ale Bokoun jej nedokázal potvrdit. Neodesílejte znovu; zkontrolujte plnou verzi." : "Příspěvek se nepodařilo odeslat. Koncept zůstal uložený.";
        scheduleRender({ force: true });
        console.warn(
          `[Bokoun ${VERSION2}] Native write failed at ${error?.bokounStage || "unknown"}.`,
          error?.name || "Error"
        );
      }
    }
    Object.assign(ctx2, {
      currentBoardId,
      composerDraftKey,
      getDrafts,
      loadDraft,
      saveDraft,
      clearDraft,
      getActiveComposer,
      rememberActiveComposer,
      forgetActiveComposer,
      restoreActiveComposer,
      openComposer,
      closeComposer,
      discardComposerDraft,
      updateDraftUi,
      updateComposerBody,
      persistComposerDraft,
      clearWriteFeedback,
      showWriteFeedback,
      waitForNative,
      dismissNativeComposers,
      injectNativeMarkdown,
      normalizeEditorText,
      findCreatedPost,
      waitForCreatedPost,
      submitThroughNative,
      submitComposer
    });
  }

  // src/pagination.js
  function installPagination(ctx2) {
    const {
      PAGE_LOAD_TIMEOUT_MS: PAGE_LOAD_TIMEOUT_MS2,
      OLDER_TRIGGER_PX: OLDER_TRIGGER_PX2,
      state: state2
    } = ctx2;
    const routeType = (...args) => ctx2.routeType(...args);
    const text = (...args) => ctx2.text(...args);
    const fetchStructuredModel = (...args) => ctx2.fetchStructuredModel(...args);
    const structuredCacheKey = (...args) => ctx2.structuredCacheKey(...args);
    const readBoardFromDom = (...args) => ctx2.readBoardFromDom(...args);
    const mergeBoardPage = (...args) => ctx2.mergeBoardPage(...args);
    const scheduleRender = (...args) => ctx2.scheduleRender(...args);
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
      if (state2.nativeMode || state2.boardLoading || state2.boardEnd || routeType() !== "board") return;
      const target = validatedOlderPage(state2.boardNextHref);
      if (!target) {
        state2.boardEnd = true;
        state2.boardNextHref = "";
        scheduleRender({ force: true });
        return;
      }
      const targetHref = `${target.pathname}${target.search}`;
      if (state2.boardLoadedPages.has(targetHref)) {
        state2.boardEnd = true;
        state2.boardNextHref = "";
        scheduleRender({ force: true });
        return;
      }
      state2.boardLoading = true;
      state2.boardError = "";
      state2.boardLoadAbort = new AbortController();
      const timeout = window.setTimeout(() => state2.boardLoadAbort?.abort(), PAGE_LOAD_TIMEOUT_MS2);
      scheduleRender({ force: true });
      try {
        let model;
        try {
          const entry = await fetchStructuredModel("board", targetHref, {
            signal: state2.boardLoadAbort.signal
          });
          model = entry.model;
          state2.structuredCache.set(structuredCacheKey("board", targetHref), entry);
        } catch (structuredError) {
          if (structuredError?.name === "AbortError") throw structuredError;
          const response = await fetch(targetHref, {
            credentials: "same-origin",
            headers: { Accept: "text/html" },
            signal: state2.boardLoadAbort.signal
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
          state2.boardEnd = true;
          state2.boardNextHref = "";
        }
      } catch (error) {
        if (error?.name !== "AbortError") {
          state2.boardError = "Starší příspěvky se nepodařilo načíst.";
        }
      } finally {
        window.clearTimeout(timeout);
        state2.boardLoading = false;
        state2.boardLoadAbort = null;
        state2.boardAutoCooldownUntil = Date.now() + 700;
        scheduleRender({ force: true });
      }
    }
    function maybeLoadOlder() {
      if (state2.nativeMode || routeType() !== "board" || !state2.scroller || state2.boardLoading || state2.boardEnd || state2.boardError || Date.now() < state2.boardAutoCooldownUntil) return;
      const remaining = state2.scroller.scrollHeight - state2.scroller.scrollTop - state2.scroller.clientHeight;
      if (remaining <= OLDER_TRIGGER_PX2) loadOlderPosts();
    }
    Object.assign(ctx2, {
      validatedOlderPage,
      loadOlderPosts,
      maybeLoadOlder
    });
  }

  // src/ui.js
  function installUi(ctx2) {
    const {
      ICONS: ICONS2,
      state: state2
    } = ctx2;
    const routeKey = (...args) => ctx2.routeKey(...args);
    const openFullKapybara = (...args) => ctx2.openFullKapybara(...args);
    const currentBoardId = (...args) => ctx2.currentBoardId(...args);
    const openComposer = (...args) => ctx2.openComposer(...args);
    const closeComposer = (...args) => ctx2.closeComposer(...args);
    const discardComposerDraft = (...args) => ctx2.discardComposerDraft(...args);
    const updateComposerBody = (...args) => ctx2.updateComposerBody(...args);
    const clearWriteFeedback = (...args) => ctx2.clearWriteFeedback(...args);
    const submitComposer = (...args) => ctx2.submitComposer(...args);
    const loadOlderPosts = (...args) => ctx2.loadOlderPosts(...args);
    const navigateNative = (...args) => ctx2.navigateNative(...args);
    const goBack = (...args) => ctx2.goBack(...args);
    function escapeHtml(value) {
      const div = document.createElement("div");
      div.textContent = value ?? "";
      return div.innerHTML;
    }
    function signatureFor(type, model) {
      if (type === "favorites") {
        return `${routeKey()}|${model.length}|${model.map((club) => `${club.href}:${club.unread}:${club.activity}`).join(";")}`;
      }
      return [
        location.pathname,
        model.title,
        model.posts.map((post) => post.id).join(","),
        model.nextOlderHref,
        model.loading,
        model.end,
        model.error,
        model.loadedPageCount,
        state2.composer ? [
          state2.composer.kind,
          state2.composer.replyTo,
          state2.composer.status,
          state2.composer.error,
          state2.composer.ambiguous
        ].join(":") : "",
        state2.writeFeedback ? [
          state2.writeFeedback.boardId,
          state2.writeFeedback.postId,
          state2.writeFeedback.replyTo,
          state2.writeFeedback.message
        ].join(":") : ""
      ].join("|");
    }
    function fullButton() {
      return `
      <button class="full-link" type="button" data-action="full">
        <span class="full-label--long">Plná verze</span>
        <span class="full-label--short" aria-hidden="true">Plná</span>
      </button>
    `;
    }
    function favoritesMarkup(clubs) {
      const selectedActivity = location.pathname === "/fav/activity";
      const rows = clubs.length ? clubs.map((club) => `
          <li>
            <a class="favorite-row" href="${escapeHtml(club.href)}" data-native-href="${escapeHtml(club.href)}">
              <span class="favorite-main">
                <span class="favorite-name">${escapeHtml(club.name)}</span>
                <span class="favorite-time">${escapeHtml(club.activity)}</span>
              </span>
              ${club.unread ? `<span class="favorite-unread" aria-label="${club.unread} nových">${club.unread}</span>` : ""}
            </a>
          </li>
        `).join("") : `<li class="empty">Žádné oblíbené kluby.</li>`;
      return `
      <header class="topbar">
        <h1 class="title title--brand">Bokoun</h1>
        ${fullButton()}
      </header>
      <nav class="tabs" aria-label="Řazení oblíbených klubů">
        <a class="tab" href="/fav/activity" data-native-href="/fav/activity" ${selectedActivity ? 'aria-current="page"' : ""}>Aktivita</a>
        <a class="tab" href="/fav/topics" data-native-href="/fav/topics" ${selectedActivity ? "" : 'aria-current="page"'}>Témata</a>
      </nav>
      <ul class="favorites">${rows}</ul>
    `;
    }
    function boardMarkup(board) {
      const replyingTo = state2.composer?.kind === "reply" ? state2.composer.replyTo : "";
      const newComposer = state2.composer?.kind === "new" ? composerMarkup() : "";
      const feedback = state2.writeFeedback?.boardId === currentBoardId() ? state2.writeFeedback : null;
      const feedbackMarkup = feedback ? `
        <div class="write-feedback" role="status">
          <span>${escapeHtml(feedback.message)}</span>
          <button
            class="write-feedback-dismiss"
            type="button"
            data-action="dismiss-feedback"
            aria-label="Skrýt potvrzení"
          >×</button>
        </div>
      ` : "";
      const posts = board.posts.length ? board.posts.map((post) => {
        const replyTarget = replyingTo === post.id;
        const justSent = feedback?.postId === post.id;
        const replyContext = feedback?.replyTo === post.id;
        const postClasses = [
          "post",
          replyTarget ? "post--reply-target" : "",
          justSent ? "post--just-sent" : "",
          replyContext ? "post--reply-context" : ""
        ].filter(Boolean).join(" ");
        return `
          <article class="${postClasses}" data-bokoun-post-id="${escapeHtml(post.id)}">
            <header class="post-header">
              <span class="post-author">${escapeHtml(post.author)}</span>
              <time class="post-date" ${post.datetime ? `datetime="${escapeHtml(post.datetime)}"` : ""}>${escapeHtml(post.date)}</time>
            </header>
            ${post.replyReference ? `<div class="reply-reference">${escapeHtml(post.replyReference)}</div>` : ""}
            <div class="post-body">${post.bodyHtml}</div>
            <div class="post-actions">
              <button class="reply-button" type="button" data-action="reply" data-post-id="${escapeHtml(post.id)}">Odpovědět</button>
            </div>
            ${replyTarget ? composerMarkup() : ""}
          </article>
        `;
      }).join("") : `<div class="empty">V tomto klubu zatím nejsou příspěvky.</div>`;
      let tailState = "";
      if (board.loading) {
        tailState = '<div class="tail-loading" role="status">Načítám starší příspěvky…</div>';
      } else if (board.error) {
        tailState = `
        <div class="tail-error" role="alert">${escapeHtml(board.error)}</div>
        <button class="tail-action tail-action--accent" type="button" data-action="load-older">Zkusit znovu</button>
      `;
      } else if (board.end) {
        tailState = '<div class="tail-end">Začátek klubu.</div>';
      } else {
        tailState = '<button class="tail-action" type="button" data-action="load-older">Načíst starší</button>';
      }
      const newest = board.loadedPageCount > 1 ? '<button class="tail-action tail-action--accent" type="button" data-action="newest">↑ Nejnovější</button>' : "";
      return `
      <header class="topbar topbar--board">
        <button class="icon-button" type="button" data-action="back" aria-label="Zpět do oblíbených">${ICONS2.back}</button>
        <h1 class="title">${escapeHtml(board.title)}</h1>
        <button class="icon-button" type="button" data-action="compose" aria-label="Napsat příspěvek">${ICONS2.write}</button>
        ${fullButton()}
      </header>
      ${feedbackMarkup}
      ${newComposer}
      <section class="posts${replyingTo ? " is-replying" : ""}" aria-label="Příspěvky">${posts}</section>
      <footer class="board-tail">${tailState}${newest}</footer>
    `;
    }
    function composerMarkup() {
      const composer = state2.composer;
      if (!composer) return "";
      const busy = state2.writeBusy || composer.status === "sending";
      const disabled = busy || composer.ambiguous;
      const title = composer.kind === "reply" ? "Odpověď" : "Nový příspěvek";
      const target = composer.kind === "reply" ? `<p class="composer-target">Odpověď na ${escapeHtml(composer.replyAuthor || `příspěvek ${composer.replyTo}`)}</p>` : "";
      const error = composer.error ? `<div class="composer-error" role="alert">${escapeHtml(composer.error)}</div>` : "";
      const inspect = composer.ambiguous ? '<button class="composer-action" type="button" data-action="inspect-write">Zkontrolovat plnou verzi</button>' : "";
      const hasDraft = Boolean(composer.body);
      return `
      <section
        class="composer-panel composer-panel--${composer.kind === "reply" ? "reply" : "new"}"
        aria-labelledby="bokoun-composer-title"
      >
        <form class="composer-form">
          <div class="composer-heading">
            <h2 class="composer-title" id="bokoun-composer-title">${title}</h2>
            <span class="composer-kind">Markdown</span>
          </div>
          ${target}
          <label class="sr-only" for="bokoun-composer-body">Text příspěvku v Markdownu</label>
          <textarea
            class="composer-textarea"
            id="bokoun-composer-body"
            maxlength="20000"
            placeholder="Napište Markdown…"
            ${disabled ? "disabled" : ""}
          >${escapeHtml(composer.body)}</textarea>
          ${error}
          <div class="composer-draft">
            <span class="draft-status" role="status" aria-live="polite" data-draft-status>
              ${hasDraft ? "Koncept uložen v zařízení" : "Koncept se ukládá automaticky"}
            </span>
            <button
              class="draft-discard"
              type="button"
              data-action="discard-draft"
              ${hasDraft ? "" : "hidden"}
            >Zahodit koncept</button>
          </div>
          <div class="composer-actions">
            ${inspect}
            <button class="composer-action" type="button" data-action="cancel-compose" ${busy ? "disabled" : ""}>Zrušit</button>
            <button class="composer-action composer-action--send" type="submit" ${disabled ? "disabled" : ""}>
              ${busy ? "Odesílám…" : "Odeslat"}
            </button>
          </div>
        </form>
      </section>
    `;
    }
    function attachUiEvents() {
      state2.shadow.querySelector("[data-action='full']")?.addEventListener("click", openFullKapybara);
      state2.shadow.querySelector("[data-action='back']")?.addEventListener("click", goBack);
      state2.shadow.querySelector("[data-action='compose']")?.addEventListener("click", () => openComposer("new"));
      state2.shadow.querySelector("[data-action='cancel-compose']")?.addEventListener("click", closeComposer);
      state2.shadow.querySelector("[data-action='discard-draft']")?.addEventListener("click", discardComposerDraft);
      state2.shadow.querySelector("[data-action='dismiss-feedback']")?.addEventListener("click", clearWriteFeedback);
      state2.shadow.querySelector("[data-action='inspect-write']")?.addEventListener("click", openFullKapybara);
      state2.shadow.querySelector("[data-action='load-older']")?.addEventListener("click", loadOlderPosts);
      state2.shadow.querySelector("[data-action='newest']")?.addEventListener("click", () => {
        state2.scroller?.scrollTo({ top: 0, behavior: "smooth" });
      });
      state2.shadow.querySelector(".composer-form")?.addEventListener("submit", submitComposer);
      state2.shadow.querySelector(".composer-textarea")?.addEventListener("input", (event) => {
        updateComposerBody(event.currentTarget.value);
      });
      for (const button of state2.shadow.querySelectorAll("[data-action='reply']")) {
        button.addEventListener("click", () => openComposer("reply", button.dataset.postId));
      }
      for (const link of state2.shadow.querySelectorAll("[data-native-href]")) {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          navigateNative(link.getAttribute("data-native-href"));
        });
      }
    }
    Object.assign(ctx2, {
      escapeHtml,
      signatureFor,
      fullButton,
      favoritesMarkup,
      boardMarkup,
      composerMarkup,
      attachUiEvents
    });
  }

  // src/navigation.js
  function installNavigation(ctx2) {
    const {
      HOST_ID: HOST_ID2,
      RETURN_HOST_ID: RETURN_HOST_ID2,
      BOOT_TIMEOUT_MS: BOOT_TIMEOUT_MS2,
      SESSION_DISABLED_KEY: SESSION_DISABLED_KEY2,
      SELECTORS: SELECTORS2,
      state: state2
    } = ctx2;
    const routeType = (...args) => ctx2.routeType(...args);
    const routeKey = (...args) => ctx2.routeKey(...args);
    const isMobileEligible = (...args) => ctx2.isMobileEligible(...args);
    const waitForBody = (...args) => ctx2.waitForBody(...args);
    const mountShell = (...args) => ctx2.mountShell(...args);
    const saveScroll = (...args) => ctx2.saveScroll(...args);
    const nativeReady = (...args) => ctx2.nativeReady(...args);
    const render = (...args) => ctx2.render(...args);
    const observeNative = (...args) => ctx2.observeNative(...args);
    function navigateNative(href) {
      if (!href) return;
      saveScroll();
      const target = new URL(href, location.origin);
      const nativeLink = [...document.querySelectorAll("a[href]")].find((link) => {
        if (link.closest(`#${HOST_ID2}`)) return false;
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
      }, 1200);
    }
    function goBack() {
      saveScroll();
      if (history.length > 1) {
        history.back();
      } else {
        navigateNative("/fav/activity");
      }
    }
    function captureBokounAnchor() {
      if (routeType() !== "board" || !state2.scroller || !state2.shadow) return null;
      const scrollerRect = state2.scroller.getBoundingClientRect();
      const headerHeight = state2.shadow.querySelector(".topbar--board")?.getBoundingClientRect().height || 0;
      const visibleTop = scrollerRect.top + headerHeight;
      const posts = [...state2.shadow.querySelectorAll("[data-bokoun-post-id]")];
      const post = posts.find((item) => item.getBoundingClientRect().bottom > visibleTop) || posts.at(-1);
      if (!post) return null;
      const postId = post.getAttribute("data-bokoun-post-id");
      return {
        postId,
        offset: post.getBoundingClientRect().top - scrollerRect.top,
        pageHref: state2.boardPostPages.get(postId) || routeKey()
      };
    }
    function captureNativeAnchor() {
      if (routeType() !== "board") return null;
      const posts = [...document.querySelectorAll(SELECTORS2.posts)];
      const post = posts.find((item) => item.getBoundingClientRect().bottom > 0) || posts.at(-1);
      if (!post) return null;
      return {
        postId: post.getAttribute("data-post-id"),
        offset: post.getBoundingClientRect().top,
        pageHref: routeKey()
      };
    }
    function nativePostById(postId) {
      return [...document.querySelectorAll(SELECTORS2.posts)].find((post) => post.getAttribute("data-post-id") === String(postId)) || null;
    }
    function restoreNativeAnchor(anchor) {
      if (!anchor || routeType() !== "board") return;
      const apply = () => {
        const target = nativePostById(anchor.postId) || [...document.querySelectorAll(SELECTORS2.posts)].at(-1);
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
      if (!anchor || !state2.scroller || !state2.shadow || routeType() !== "board") return;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const posts = [...state2.shadow.querySelectorAll("[data-bokoun-post-id]")];
          const target = posts.find((post) => post.getAttribute("data-bokoun-post-id") === String(anchor.postId)) || posts.at(-1);
          if (!target || !state2.scroller) return;
          const scrollerRect = state2.scroller.getBoundingClientRect();
          const delta = target.getBoundingClientRect().top - scrollerRect.top - anchor.offset;
          state2.scroller.scrollTo({
            top: Math.max(0, state2.scroller.scrollTop + delta),
            behavior: "auto"
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
      while (Date.now() - started < BOOT_TIMEOUT_MS2) {
        if (routeKey() === targetKey && nativeReady("board") && (!postId || nativePostById(postId))) return;
        await new Promise((resolve) => window.setTimeout(resolve, 80));
      }
      throw new Error("Native route timeout");
    }
    async function returnToBokoun() {
      const anchor = captureNativeAnchor();
      sessionStorage.removeItem(SESSION_DISABLED_KEY2);
      document.getElementById(RETURN_HOST_ID2)?.remove();
      state2.nativeMode = false;
      state2.disabled = false;
      if (!isMobileEligible() || routeType() === "unsupported") return;
      await waitForBody();
      mountShell();
      state2.currentRouteKey = routeKey();
      observeNative();
      render({ force: true });
      restoreBokounAnchor(anchor);
    }
    Object.assign(ctx2, {
      navigateNative,
      goBack,
      captureBokounAnchor,
      captureNativeAnchor,
      nativePostById,
      restoreNativeAnchor,
      restoreBokounAnchor,
      navigateNativeRoute,
      returnToBokoun
    });
  }

  // src/controller.js
  function installController(ctx2) {
    const {
      VERSION: VERSION2,
      BOOT_TIMEOUT_MS: BOOT_TIMEOUT_MS2,
      ROUTE_POLL_MS: ROUTE_POLL_MS2,
      SESSION_DISABLED_KEY: SESSION_DISABLED_KEY2,
      state: state2
    } = ctx2;
    const routeType = (...args) => ctx2.routeType(...args);
    const routeKey = (...args) => ctx2.routeKey(...args);
    const isMobileEligible = (...args) => ctx2.isMobileEligible(...args);
    const shouldBoot = (...args) => ctx2.shouldBoot(...args);
    const waitForBody = (...args) => ctx2.waitForBody(...args);
    const mountShell = (...args) => ctx2.mountShell(...args);
    const revealNative = (...args) => ctx2.revealNative(...args);
    const showReturnControl = (...args) => ctx2.showReturnControl(...args);
    const registerMenus = (...args) => ctx2.registerMenus(...args);
    const saveScroll = (...args) => ctx2.saveScroll(...args);
    const restoreScroll = (...args) => ctx2.restoreScroll(...args);
    const nativeReady = (...args) => ctx2.nativeReady(...args);
    const readFavoritesFromDom = (...args) => ctx2.readFavoritesFromDom(...args);
    const cachedStructuredModel = (...args) => ctx2.cachedStructuredModel(...args);
    const primeStructuredModel = (...args) => ctx2.primeStructuredModel(...args);
    const readBoardFromDom = (...args) => ctx2.readBoardFromDom(...args);
    const resetBoardAccumulator = (...args) => ctx2.resetBoardAccumulator(...args);
    const mergeBoardPage = (...args) => ctx2.mergeBoardPage(...args);
    const refreshBoardNewestPage = (...args) => ctx2.refreshBoardNewestPage(...args);
    const boardViewModel = (...args) => ctx2.boardViewModel(...args);
    const restoreActiveComposer = (...args) => ctx2.restoreActiveComposer(...args);
    const persistComposerDraft = (...args) => ctx2.persistComposerDraft(...args);
    const signatureFor = (...args) => ctx2.signatureFor(...args);
    const favoritesMarkup = (...args) => ctx2.favoritesMarkup(...args);
    const boardMarkup = (...args) => ctx2.boardMarkup(...args);
    const attachUiEvents = (...args) => ctx2.attachUiEvents(...args);
    function render({ force = false } = {}) {
      if (state2.disabled || state2.nativeMode) return;
      const type = routeType();
      if (type === "unsupported" || !isMobileEligible()) {
        revealNative();
        return;
      }
      if (!state2.host?.isConnected) mountShell();
      const previousKey = state2.currentRouteKey;
      const key = routeKey();
      primeStructuredModel(type, key);
      const structuredRouteModel = cachedStructuredModel(type, key);
      if (!structuredRouteModel && !nativeReady(type)) return;
      const previousY = state2.scroller?.scrollTop || 0;
      let model;
      let readSource = "dom";
      if (type === "favorites") {
        model = structuredRouteModel;
        if (model) readSource = "structured";
        else model = readFavoritesFromDom();
      } else {
        const structuredModel = structuredRouteModel;
        const nativeModel = structuredModel || readBoardFromDom(document, key);
        const structured = Boolean(structuredModel);
        if (structured) readSource = "structured";
        if (state2.boardKey !== location.pathname) {
          resetBoardAccumulator(nativeModel, key, { structured });
        } else if (structured && !new URL(key, location.origin).searchParams.has("f")) {
          refreshBoardNewestPage(nativeModel, key);
          state2.boardStructuredReady = true;
        } else {
          mergeBoardPage(nativeModel, key, {
            setNext: structured && !state2.boardStructuredReady
          });
          if (structured) state2.boardStructuredReady = true;
        }
        restoreActiveComposer();
        model = boardViewModel();
      }
      const signature = signatureFor(type, model);
      if (!force && signature === state2.currentSignature) return;
      state2.currentRouteKey = key;
      state2.currentSignature = signature;
      state2.host.dataset.readSource = readSource;
      const inner = state2.shadow.querySelector(".app-inner");
      inner.innerHTML = type === "favorites" ? favoritesMarkup(model) : boardMarkup(model);
      attachUiEvents();
      restoreScroll(key, previousKey === key ? previousY : 0);
    }
    function scheduleRender({ force = false } = {}) {
      clearTimeout(state2.renderTimer);
      state2.renderTimer = window.setTimeout(() => render({ force }), 40);
    }
    function handleRouteChange() {
      if (state2.disabled || state2.nativeMode) return;
      const key = routeKey();
      if (key === state2.currentRouteKey) {
        const type = routeType();
        if (type !== "unsupported") primeStructuredModel(type, key);
        return;
      }
      saveScroll();
      state2.currentSignature = "";
      if (routeType() === "unsupported" || !isMobileEligible()) {
        state2.currentRouteKey = key;
        revealNative();
        return;
      }
      state2.currentRouteKey = key;
      if (!state2.host?.isConnected) mountShell();
      state2.shadow.querySelector(".app-inner").innerHTML = '<div class="loading" aria-label="Načítám"></div>';
      scheduleRender({ force: true });
    }
    function observeNative() {
      if (state2.observing) return;
      state2.observer = new MutationObserver(() => scheduleRender());
      state2.observer.observe(document.body, { childList: true, subtree: true });
      state2.routeTimer = window.setInterval(handleRouteChange, ROUTE_POLL_MS2);
      window.addEventListener("popstate", () => window.setTimeout(handleRouteChange, 0));
      window.addEventListener("pagehide", () => {
        persistComposerDraft();
        saveScroll();
      });
      state2.observing = true;
    }
    async function boot() {
      registerMenus();
      if (!shouldBoot()) {
        delete document.documentElement.dataset.bokounBooting;
        if (sessionStorage.getItem(SESSION_DISABLED_KEY2) === "1") {
          await waitForBody();
          showReturnControl();
        }
        return;
      }
      await waitForBody();
      if (!shouldBoot()) {
        delete document.documentElement.dataset.bokounBooting;
        if (sessionStorage.getItem(SESSION_DISABLED_KEY2) === "1") showReturnControl();
        return;
      }
      mountShell();
      state2.currentRouteKey = routeKey();
      observeNative();
      render({ force: true });
      state2.bootTimer = window.setTimeout(() => {
        const type = routeType();
        if (!nativeReady(type) && !cachedStructuredModel(type, routeKey())) {
          console.warn(`[Bokoun ${VERSION2}] Native page was not ready; restored full Kapybara.`);
          revealNative({ stop: true });
        }
      }, BOOT_TIMEOUT_MS2);
    }
    Object.assign(ctx2, {
      render,
      scheduleRender,
      handleRouteChange,
      observeNative,
      boot
    });
  }

  // src/main.js
  var ctx = { ...runtime_exports };
  installShell(ctx);
  installAdapters(ctx);
  installBoardState(ctx);
  installWriting(ctx);
  installPagination(ctx);
  installUi(ctx);
  installNavigation(ctx);
  installController(ctx);
  ctx.waitForDocumentElement().then(() => {
    ctx.startPaintGuard();
    return ctx.boot();
  }).catch((error) => {
    console.warn(
      `[Bokoun ${ctx.VERSION}] Initialization failed; restored full Kapybara.`,
      error?.name || "Error"
    );
    ctx.revealNative({ stop: true });
  });
})();
