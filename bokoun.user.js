// ==UserScript==
// @name         Bokoun
// @namespace    https://github.com/hanenashi/bokoun
// @version      0.2.0
// @description  Minimal read-only mobile interface for Kapybara/Okoun
// @author       BeeChan
// @match        https://kapybara.okoun.cz/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(() => {
  "use strict";

  const VERSION = "0.2.0";
  const HOST_ID = "bokoun-host";
  const RETURN_HOST_ID = "bokoun-return";
  const BOOT_TIMEOUT_MS = 10_000;
  const PAGE_LOAD_TIMEOUT_MS = 15_000;
  const ROUTE_POLL_MS = 150;
  const OLDER_TRIGGER_PX = 900;
  const MOBILE_QUERY = "(max-width: 760px)";
  const SESSION_DISABLED_KEY = "bokoun.disabled-for-tab.v1";
  const SCROLL_KEY = "bokoun.scroll.v1";
  const PREF_ENABLED_KEY = "bokoun.enabled";

  const SELECTORS = Object.freeze({
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
    olderPosts: "a[aria-label^='Starší příspěvky'][href]",
  });

  const ICONS = Object.freeze({
    back: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 12H5M11 18l-6-6 6-6"></path>
      </svg>
    `,
  });

  const STYLES = `
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
      grid-template-columns: 44px minmax(0, 1fr) auto;
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
    button:focus-visible {
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

    @media (prefers-reduced-motion: reduce) {
      .loading::after {
        animation-duration: 1.8s;
      }
    }
  `;

  const state = {
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
  };

  const gmGet = typeof GM_getValue === "function"
    ? GM_getValue
    : (key, fallback) => {
        const raw = localStorage.getItem(`bokoun.gm.${key}`);
        return raw === null ? fallback : JSON.parse(raw);
      };

  const gmSet = typeof GM_setValue === "function"
    ? GM_setValue
    : (key, value) => localStorage.setItem(`bokoun.gm.${key}`, JSON.stringify(value));

  const gmMenu = typeof GM_registerMenuCommand === "function"
    ? GM_registerMenuCommand
    : () => undefined;

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
    return matchMedia(MOBILE_QUERY).matches;
  }

  function shouldBoot() {
    return Boolean(gmGet(PREF_ENABLED_KEY, true))
      && sessionStorage.getItem(SESSION_DISABLED_KEY) !== "1"
      && isMobileEligible()
      && routeType() !== "unsupported";
  }

  function installGlobalStyle() {
    if (document.getElementById("bokoun-global-style")) return;
    const style = document.createElement("style");
    style.id = "bokoun-global-style";
    style.textContent = `
      html[data-bokoun-booting="true"] body {
        visibility: hidden !important;
      }
      html[data-bokoun-active="true"] body > :not(#${HOST_ID}) {
        display: none !important;
      }
      html[data-bokoun-active="true"],
      html[data-bokoun-active="true"] body {
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        overflow: hidden !important;
        background: #fff !important;
      }
      #${HOST_ID} {
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
    if (state.host?.isConnected) return;

    document.getElementById(RETURN_HOST_ID)?.remove();
    const host = document.createElement("div");
    host.id = HOST_ID;
    host.setAttribute("role", "application");
    host.setAttribute("aria-label", "Bokoun");
    const shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>${STYLES}</style>
      <main class="app" tabindex="-1">
        <div class="app-inner">
          <div class="loading" aria-label="Načítám"></div>
        </div>
      </main>
    `;
    document.body.append(host);

    state.host = host;
    state.shadow = shadow;
    state.scroller = shadow.querySelector(".app");
    state.scroller.addEventListener("scroll", handleBokounScroll, { passive: true });
    state.active = true;
    document.documentElement.dataset.bokounActive = "true";
    delete document.documentElement.dataset.bokounBooting;
  }

  function revealNative({ stop = false } = {}) {
    saveScroll();
    state.active = false;
    if (document.documentElement) {
      delete document.documentElement.dataset.bokounBooting;
      delete document.documentElement.dataset.bokounActive;
    }
    state.host?.remove();
    state.host = null;
    state.shadow = null;
    state.scroller = null;
    state.currentSignature = "";

    if (stop) {
      state.disabled = true;
      clearTimeout(state.bootTimer);
      clearTimeout(state.renderTimer);
      clearInterval(state.routeTimer);
      state.observer?.disconnect();
      state.observer = null;
      state.observing = false;
    }
  }

  async function openFullKapybara() {
    const anchor = captureBokounAnchor();
    sessionStorage.setItem(SESSION_DISABLED_KEY, "1");
    state.nativeMode = true;

    if (anchor?.pageHref) {
      try {
        await navigateNativeRoute(anchor.pageHref, anchor.postId);
      } catch (error) {
        console.warn(`[Bokoun ${VERSION}] Could not align the native page; using the closest loaded position.`, error?.name || "Error");
      }
    }

    revealNative();
    showReturnControl();
    restoreNativeAnchor(anchor);
  }

  function showReturnControl() {
    if (!document.body || document.getElementById(RETURN_HOST_ID)) return;

    const host = document.createElement("div");
    host.id = RETURN_HOST_ID;
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
    if (sessionStorage.getItem(SESSION_DISABLED_KEY) === "1") {
      gmMenu("Bokoun: zapnout v tomto panelu", returnToBokoun);
    } else {
      gmMenu("Bokoun: otevřít plnou Kapybaru", openFullKapybara);
    }

    gmMenu(
      gmGet(PREF_ENABLED_KEY, true) ? "Bokoun: vypnout trvale" : "Bokoun: zapnout trvale",
      () => {
        const next = !gmGet(PREF_ENABLED_KEY, true);
        gmSet(PREF_ENABLED_KEY, next);
        sessionStorage.removeItem(SESSION_DISABLED_KEY);
        location.reload();
      },
    );
  }

  function getScrollMap() {
    try {
      return JSON.parse(sessionStorage.getItem(SCROLL_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveScroll() {
    if (!state.scroller || !state.currentRouteKey) return;
    const map = getScrollMap();
    map[state.currentRouteKey] = Math.max(0, Math.round(state.scroller.scrollTop));
    sessionStorage.setItem(SCROLL_KEY, JSON.stringify(map));
  }

  function scheduleScrollSave() {
    clearTimeout(state.saveTimer);
    state.saveTimer = window.setTimeout(saveScroll, 100);
  }

  function handleBokounScroll() {
    scheduleScrollSave();
    maybeLoadOlder();
  }

  function restoreScroll(key, fallback = 0) {
    const y = getScrollMap()[key] ?? fallback;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        state.scroller?.scrollTo({ top: y, behavior: "auto" });
      });
    });
  }

  function nativeReady(type) {
    if (type === "favorites") {
      return Boolean(document.querySelector(SELECTORS.favoritesPage));
    }
    if (type === "board") {
      return Boolean(
        document.querySelector(SELECTORS.boardHeader)
        && (
          document.querySelector(SELECTORS.posts)
          || document.querySelector(".posts, .empty-state, .board-page")
        )
      );
    }
    return false;
  }

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
    const compact = text(row.querySelector(SELECTORS.favoriteUnreadCompact));
    const full = text(row.querySelector(SELECTORS.favoriteUnreadFull));
    const match = (compact || full).match(/\d+/);
    return match ? Number.parseInt(match[0], 10) : 0;
  }

  function relativeActivity(row) {
    const nativeRelative = text(row.querySelector(SELECTORS.favoriteRelativeTime));
    if (nativeRelative) return nativeRelative;

    const datetime = row.querySelector(SELECTORS.favoriteTime)?.getAttribute("datetime");
    if (!datetime) return "";
    const timestamp = Date.parse(datetime);
    if (!Number.isFinite(timestamp)) return "";

    const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
    if (seconds < 60) return "právě teď";
    if (seconds < 3600) return `před ${Math.floor(seconds / 60)} min`;
    if (seconds < 86_400) return `před ${Math.floor(seconds / 3600)} h`;
    if (seconds < 172_800) return "včera";
    return `před ${Math.floor(seconds / 86_400)} dny`;
  }

  function readFavorites() {
    return [...document.querySelectorAll(SELECTORS.favoriteRows)]
      .map((row) => ({
        href: normalizeHref(row.getAttribute("href")),
        name: text(row.querySelector(SELECTORS.favoriteName)),
        unread: unreadCount(row),
        activity: relativeActivity(row),
      }))
      .filter((club) => club.href && club.name);
  }

  function sanitizeHtml(html) {
    const template = document.createElement("template");
    template.innerHTML = html || "";

    const allowedTags = new Set([
      "A", "B", "BLOCKQUOTE", "BR", "CODE", "DEL", "DIV", "EM", "HR", "I",
      "IMG", "LI", "OL", "P", "PRE", "S", "SPAN", "STRONG", "U", "UL",
    ]);
    const removeTags = new Set([
      "BASE", "BUTTON", "EMBED", "FORM", "IFRAME", "INPUT", "LINK", "META",
      "OBJECT", "SCRIPT", "STYLE", "SVG", "MATH", "TEXTAREA",
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
        const allowed = (
          (element.tagName === "A" && ["href", "title"].includes(name))
          || (element.tagName === "IMG" && ["src", "alt", "title", "width", "height"].includes(name))
          || (element.tagName === "SPAN" && name === "title")
        );
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
    const time = post.querySelector(SELECTORS.postTime);
    const visible = text(post.querySelector(SELECTORS.postDate));
    if (visible) return visible;
    const datetime = time?.getAttribute("datetime");
    if (!datetime) return "";
    const date = new Date(datetime);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("cs-CZ", {
      day: "numeric",
      month: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  function readBoard(root = document, pageHref = routeKey()) {
    const title = text(root.querySelector(SELECTORS.boardTitle))
      || decodeURIComponent(location.pathname.split("/").filter(Boolean).at(-1) || "Klub");
    const posts = [...root.querySelectorAll(SELECTORS.posts)].map((post) => {
      const body = post.querySelector(SELECTORS.postBody);
      return {
        id: post.getAttribute("data-post-id") || "",
        author: text(post.querySelector(SELECTORS.postAuthor)) || "neznámý",
        date: compactDate(post),
        datetime: post.querySelector(SELECTORS.postTime)?.getAttribute("datetime") || "",
        replyReference: text(post.querySelector(SELECTORS.postReplyReference)),
        bodyHtml: sanitizeHtml(body?.innerHTML || ""),
        pageHref: normalizeHref(pageHref),
      };
    }).filter((post) => post.id);
    const olderLinks = [...root.querySelectorAll(SELECTORS.olderPosts)];
    const nextOlderHref = normalizeHref(olderLinks.at(-1)?.getAttribute("href") || "");
    return { title, posts, nextOlderHref };
  }

  function resetBoardAccumulator(model, pageHref) {
    state.boardLoadAbort?.abort();
    state.boardLoadAbort = null;
    state.boardKey = location.pathname;
    state.boardTitle = model.title;
    state.boardPosts = [];
    state.boardPostIndex = new Map();
    state.boardPostPages = new Map();
    state.boardLoadedPages = new Set();
    state.boardNextHref = "";
    state.boardLoading = false;
    state.boardEnd = false;
    state.boardError = "";
    state.boardAutoCooldownUntil = 0;
    mergeBoardPage(model, pageHref, { setNext: true });
  }

  function mergeBoardPage(model, pageHref, { setNext = false } = {}) {
    const normalizedPage = normalizeHref(pageHref);
    let added = 0;

    if (normalizedPage) state.boardLoadedPages.add(normalizedPage);
    if (model.title) state.boardTitle = model.title;

    for (const post of model.posts) {
      const index = state.boardPostIndex.get(post.id);
      if (index === undefined) {
        const page = normalizedPage || post.pageHref || routeKey();
        state.boardPostIndex.set(post.id, state.boardPosts.length);
        state.boardPostPages.set(post.id, page);
        state.boardPosts.push({ ...post, pageHref: page });
        added += 1;
      } else {
        const page = state.boardPostPages.get(post.id) || normalizedPage || post.pageHref;
        state.boardPosts[index] = { ...post, pageHref: page };
      }
    }

    if (setNext) {
      state.boardNextHref = model.nextOlderHref;
      state.boardEnd = !model.nextOlderHref;
    }
    return added;
  }

  function boardViewModel() {
    return {
      title: state.boardTitle,
      posts: state.boardPosts,
      nextOlderHref: state.boardNextHref,
      loading: state.boardLoading,
      end: state.boardEnd,
      error: state.boardError,
      loadedPageCount: state.boardLoadedPages.size,
    };
  }

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
      const response = await fetch(targetHref, {
        credentials: "same-origin",
        headers: { Accept: "text/html" },
        signal: state.boardLoadAbort.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const html = await response.text();
      const page = new DOMParser().parseFromString(html, "text/html");
      const model = readBoard(page, targetHref);
      if (!model.posts.length || page.querySelector("#api-access-code")) {
        throw new Error("Unexpected board page");
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
    ].join("|");
  }

  function fullButton() {
    return `<button class="full-link" type="button" data-action="full">Plná verze</button>`;
  }

  function favoritesMarkup(clubs) {
    const selectedActivity = location.pathname === "/fav/activity";
    const rows = clubs.length
      ? clubs.map((club) => `
          <li>
            <a class="favorite-row" href="${escapeHtml(club.href)}" data-native-href="${escapeHtml(club.href)}">
              <span class="favorite-main">
                <span class="favorite-name">${escapeHtml(club.name)}</span>
                <span class="favorite-time">${escapeHtml(club.activity)}</span>
              </span>
              ${club.unread ? `<span class="favorite-unread" aria-label="${club.unread} nových">${club.unread}</span>` : ""}
            </a>
          </li>
        `).join("")
      : `<li class="empty">Žádné oblíbené kluby.</li>`;

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
    const posts = board.posts.length
      ? board.posts.map((post) => `
          <article class="post" data-bokoun-post-id="${escapeHtml(post.id)}">
            <header class="post-header">
              <span class="post-author">${escapeHtml(post.author)}</span>
              <time class="post-date" ${post.datetime ? `datetime="${escapeHtml(post.datetime)}"` : ""}>${escapeHtml(post.date)}</time>
            </header>
            ${post.replyReference ? `<div class="reply-reference">${escapeHtml(post.replyReference)}</div>` : ""}
            <div class="post-body">${post.bodyHtml}</div>
          </article>
        `).join("")
      : `<div class="empty">V tomto klubu zatím nejsou příspěvky.</div>`;
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
    const newest = board.loadedPageCount > 1
      ? '<button class="tail-action tail-action--accent" type="button" data-action="newest">↑ Nejnovější</button>'
      : "";

    return `
      <header class="topbar topbar--board">
        <button class="icon-button" type="button" data-action="back" aria-label="Zpět do oblíbených">${ICONS.back}</button>
        <h1 class="title">${escapeHtml(board.title)}</h1>
        ${fullButton()}
      </header>
      <section class="posts" aria-label="Příspěvky">${posts}</section>
      <footer class="board-tail">${tailState}${newest}</footer>
    `;
  }

  function attachUiEvents() {
    state.shadow.querySelector("[data-action='full']")?.addEventListener("click", openFullKapybara);
    state.shadow.querySelector("[data-action='back']")?.addEventListener("click", goBack);
    state.shadow.querySelector("[data-action='load-older']")?.addEventListener("click", loadOlderPosts);
    state.shadow.querySelector("[data-action='newest']")?.addEventListener("click", () => {
      state.scroller?.scrollTo({ top: 0, behavior: "smooth" });
    });
    for (const link of state.shadow.querySelectorAll("[data-native-href]")) {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        navigateNative(link.getAttribute("data-native-href"));
      });
    }
  }

  function navigateNative(href) {
    if (!href) return;
    saveScroll();
    const target = new URL(href, location.origin);
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

  function render({ force = false } = {}) {
    if (state.disabled || state.nativeMode) return;
    const type = routeType();

    if (type === "unsupported" || !isMobileEligible()) {
      revealNative();
      return;
    }

    if (!nativeReady(type)) return;
    if (!state.host?.isConnected) mountShell();

    const previousKey = state.currentRouteKey;
    const key = routeKey();
    const previousY = state.scroller?.scrollTop || 0;
    let model;
    if (type === "favorites") {
      model = readFavorites();
    } else {
      const nativeModel = readBoard(document, key);
      if (state.boardKey !== location.pathname) {
        resetBoardAccumulator(nativeModel, key);
      } else {
        mergeBoardPage(nativeModel, key);
      }
      model = boardViewModel();
    }
    const signature = signatureFor(type, model);
    if (!force && signature === state.currentSignature) return;

    state.currentRouteKey = key;
    state.currentSignature = signature;
    const inner = state.shadow.querySelector(".app-inner");
    inner.innerHTML = type === "favorites" ? favoritesMarkup(model) : boardMarkup(model);
    attachUiEvents();

    restoreScroll(key, previousKey === key ? previousY : 0);
  }

  function scheduleRender({ force = false } = {}) {
    clearTimeout(state.renderTimer);
    state.renderTimer = window.setTimeout(() => render({ force }), 40);
  }

  function handleRouteChange() {
    if (state.disabled || state.nativeMode) return;
    const key = routeKey();
    if (key === state.currentRouteKey) return;

    saveScroll();
    state.currentSignature = "";

    if (routeType() === "unsupported" || !isMobileEligible()) {
      state.currentRouteKey = key;
      revealNative();
      return;
    }

    state.currentRouteKey = key;
    if (!state.host?.isConnected) mountShell();
    state.shadow.querySelector(".app-inner").innerHTML = '<div class="loading" aria-label="Načítám"></div>';
    scheduleRender({ force: true });
  }

  function observeNative() {
    if (state.observing) return;
    state.observer = new MutationObserver(() => scheduleRender());
    state.observer.observe(document.body, { childList: true, subtree: true });
    state.routeTimer = window.setInterval(handleRouteChange, ROUTE_POLL_MS);
    window.addEventListener("popstate", () => window.setTimeout(handleRouteChange, 0));
    window.addEventListener("pagehide", saveScroll);
    state.observing = true;
  }

  async function boot() {
    registerMenus();
    if (!shouldBoot()) {
      delete document.documentElement.dataset.bokounBooting;
      if (sessionStorage.getItem(SESSION_DISABLED_KEY) === "1") {
        await waitForBody();
        showReturnControl();
      }
      return;
    }

    await waitForBody();
    if (!shouldBoot()) {
      delete document.documentElement.dataset.bokounBooting;
      if (sessionStorage.getItem(SESSION_DISABLED_KEY) === "1") showReturnControl();
      return;
    }

    mountShell();
    state.currentRouteKey = routeKey();
    observeNative();
    render({ force: true });

    state.bootTimer = window.setTimeout(() => {
      if (!nativeReady(routeType())) {
        console.warn(`[Bokoun ${VERSION}] Native page was not ready; restored full Kapybara.`);
        revealNative({ stop: true });
      }
    }, BOOT_TIMEOUT_MS);
  }

  waitForDocumentElement().then(() => {
    startPaintGuard();
    return boot();
  }).catch((error) => {
    console.warn(`[Bokoun ${VERSION}] Initialization failed; restored full Kapybara.`, error?.name || "Error");
    revealNative({ stop: true });
  });
})();
