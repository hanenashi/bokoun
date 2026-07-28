// ==UserScript==
// @name         Bokoun
// @namespace    https://github.com/hanenashi/bokoun
// @version      0.6.11
// @description  Minimal mobile reading and Markdown writing interface for Kapybara/Okoun
// @author       BeeChan
// @icon         https://github.com/hanenashi/bokoun/raw/refs/heads/main/assets/bokoun.ico
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
    BOARD_POST_LIMIT: () => BOARD_POST_LIMIT,
    BOARD_READ_BOUNDARIES_KEY: () => BOARD_READ_BOUNDARIES_KEY,
    BOARD_VISIT_KEY: () => BOARD_VISIT_KEY,
    BOOT_TIMEOUT_MS: () => BOOT_TIMEOUT_MS,
    COMPOSER_TIMEOUT_MS: () => COMPOSER_TIMEOUT_MS,
    DISPLAY_SETTINGS_KEY: () => DISPLAY_SETTINGS_KEY,
    DRAFTS_KEY: () => DRAFTS_KEY,
    DRAFT_LIMIT: () => DRAFT_LIMIT,
    DRAFT_SAVE_DELAY_MS: () => DRAFT_SAVE_DELAY_MS,
    FAVORITES_ORDER_KEY: () => FAVORITES_ORDER_KEY,
    FAVORITES_SETTINGS_KEY: () => FAVORITES_SETTINGS_KEY,
    FONT_SETTINGS_KEY: () => FONT_SETTINGS_KEY,
    HOST_ID: () => HOST_ID,
    ICONS: () => ICONS,
    MOBILE_QUERY: () => MOBILE_QUERY,
    OLDER_TRIGGER_PX: () => OLDER_TRIGGER_PX,
    PAGE_LOAD_TIMEOUT_MS: () => PAGE_LOAD_TIMEOUT_MS,
    POST_CONFIRM_TIMEOUT_MS: () => POST_CONFIRM_TIMEOUT_MS,
    PREF_ENABLED_KEY: () => PREF_ENABLED_KEY,
    READ_SYNC_BACKOFF_BASE_MS: () => READ_SYNC_BACKOFF_BASE_MS,
    READ_SYNC_BACKOFF_MAX_MS: () => READ_SYNC_BACKOFF_MAX_MS,
    READ_SYNC_MIN_INTERVAL_MS: () => READ_SYNC_MIN_INTERVAL_MS,
    READ_SYNC_STATE_KEY: () => READ_SYNC_STATE_KEY,
    RETURN_HOST_ID: () => RETURN_HOST_ID,
    ROUTE_DATA_FALLBACK_MS: () => ROUTE_DATA_FALLBACK_MS,
    ROUTE_FALLBACK_POLL_MS: () => ROUTE_FALLBACK_POLL_MS,
    SCROLL_KEY: () => SCROLL_KEY,
    SCROLL_ROUTE_LIMIT: () => SCROLL_ROUTE_LIMIT,
    SCROLL_SAVE_DELAY_MS: () => SCROLL_SAVE_DELAY_MS,
    SELECTORS: () => SELECTORS,
    SESSION_DISABLED_KEY: () => SESSION_DISABLED_KEY,
    STRUCTURED_CACHE_LIMIT: () => STRUCTURED_CACHE_LIMIT,
    STRUCTURED_REFRESH_MS: () => STRUCTURED_REFRESH_MS,
    STRUCTURED_RESUME_MS: () => STRUCTURED_RESUME_MS,
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
    grid-template-columns: 44px minmax(0, 1fr) 36px 44px auto;
    padding-left: 4px;
  }

  .topbar--favorites {
    grid-template-columns: minmax(0, 1fr) 44px auto;
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

  .favorites {
    margin: 0;
    padding: 0 16px max(24px, env(safe-area-inset-bottom));
    font-family: var(--favorite-font-family, inherit);
    list-style: none;
  }

  .favorite-item {
    position: relative;
    min-width: 0;
  }

  .favorite-row {
    display: flex;
    gap: 14px;
    align-items: center;
    min-height: 44px;
    padding: var(--favorite-row-padding, 12px) 0;
    border-bottom: 1px solid var(--border);
    color: inherit;
    text-decoration: none;
    transition:
      background-color 120ms ease,
      box-shadow 120ms ease,
      padding 120ms ease;
  }

  .favorite-row--heat-few {
    padding-left: 12px;
    background: #edf8f0;
    box-shadow: inset 3px 0 #5a9f6b;
  }

  .favorite-row--heat-more {
    padding-left: 12px;
    background: #f4efff;
    box-shadow: inset 3px 0 #8864bc;
  }

  .favorite-row--heat-most {
    padding-left: 12px;
    background: #fff0ef;
    box-shadow: inset 3px 0 #c65353;
  }

  .favorite-item--editing .favorite-row {
    padding-right: 52px;
    cursor: default;
  }

  .favorite-drag-handle {
    position: absolute;
    top: 10px;
    right: 0;
    bottom: 10px;
    display: grid;
    width: 48px;
    place-items: center;
    padding: 0;
    border: 0;
    border-left: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.78);
    color: var(--muted);
    cursor: grab;
    font-size: 24px;
    font-weight: 700;
    line-height: 1;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }

  .favorite-drag-handle:active {
    cursor: grabbing;
  }

  .favorite-item--dragging {
    z-index: 2;
    opacity: 0.88;
    filter: drop-shadow(0 8px 10px rgba(18, 27, 43, 0.2));
  }

  .favorites--dragging .favorite-item:not(.favorite-item--dragging) {
    transition: transform 100ms ease;
  }

  .favorite-main {
    flex: 1 1 auto;
    min-width: 0;
    padding: 0;
  }

  .favorite-name {
    display: block;
    overflow: hidden;
    color: var(--text);
    font-size: var(--favorite-font-size, 17px);
    font-weight: 650;
    line-height: 1.25;
    letter-spacing: -0.008em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .favorite-time {
    margin-top: 4px;
    color: var(--muted);
    font-size: max(10px, calc(var(--favorite-font-size, 17px) - 3px));
    font-weight: 400;
    line-height: 1.25;
  }

  .favorite-unread {
    min-width: 32px;
    color: var(--accent);
    font-size: var(--favorite-font-size, 17px);
    font-variant-numeric: tabular-nums;
    font-weight: 650;
    text-align: right;
  }

  .posts {
    padding: 0 0 max(28px, env(safe-area-inset-bottom));
  }

  .post {
    padding: 14px 16px 16px;
    border-bottom: 1px solid #c7cfdb;
    background: #edf4ff;
    scroll-margin-top: calc(var(--header-height) + env(safe-area-inset-top) + 56px);
  }

  .post--visit-new {
    background: #fff;
  }

  .post--just-sent,
  .post--reply-context {
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

  .post--thread-root {
    background: #fff;
    box-shadow: inset 3px 0 #a85a00;
  }

  .post--thread-reply {
    background: #edf4ff;
    box-shadow: inset 3px 0 #8baee8;
  }

  .thread-banner {
    position: sticky;
    top: calc(var(--header-height) + env(safe-area-inset-top));
    z-index: 9;
    min-height: 36px;
    padding: 9px 16px 8px;
    border-bottom: 1px solid #b8cae8;
    background: rgba(237, 244, 255, 0.98);
    color: #415b82;
    font-size: 13px;
    font-weight: 700;
    text-align: center;
  }

  .post-header {
    position: relative;
    display: flex;
    gap: 8px 12px;
    align-items: center;
    margin-bottom: 13px;
  }

  .post-author {
    display: inline-flex;
    gap: 10px;
    align-items: center;
    min-width: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--text);
    font-size: 20px;
    font-weight: 750;
    line-height: 1.2;
    cursor: pointer;
    text-align: left;
  }

  .post-author > span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .post-date {
    margin-left: auto;
    color: var(--muted);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    font-weight: 400;
    line-height: 1.3;
  }

  .reply-reference {
    display: flex;
    flex-wrap: wrap;
    gap: 3px 7px;
    align-items: center;
    justify-content: flex-end;
    width: fit-content;
    max-width: 100%;
    min-height: 30px;
    margin: 10px 0 -5px auto;
    padding: 3px 0 0 10px;
    border: 0;
    background: transparent;
    color: var(--muted);
    font-size: 12px;
    line-height: 1.3;
    text-align: right;
  }

  button.reply-reference {
    color: #53657f;
    cursor: pointer;
  }

  button.reply-reference:hover,
  button.reply-reference:focus-visible {
    color: var(--accent);
  }

  .reply-reference strong {
    font-weight: 700;
  }

  .reply-reference time {
    padding-left: 7px;
    border-left: 1px solid var(--border);
    font-variant-numeric: tabular-nums;
  }

  .post-body {
    overflow-wrap: anywhere;
    color: var(--text);
    font-family: var(--post-font-family, inherit);
    font-size: var(--post-font-size, 17px);
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

  .post-layout,
  .post-content {
    min-width: 0;
  }

  .post--avatar-left .post-layout {
    display: grid;
    grid-template-columns: var(--post-avatar-size, 40px) minmax(0, 1fr);
    gap: 12px;
    align-items: start;
  }

  .post-avatar-trigger {
    display: grid;
    width: var(--post-avatar-size, 40px);
    height: var(--post-avatar-size, 40px);
    place-items: center;
    padding: 0;
    overflow: hidden;
    border: 0;
    border-radius: var(--post-avatar-radius, 50%);
    background: #f3f4f6;
    cursor: pointer;
  }

  .post-avatar {
    display: block;
    object-fit: cover;
    border-radius: var(--post-avatar-radius, 50%);
    background: #f3f4f6;
    color: var(--muted);
    font-weight: 700;
    text-align: center;
  }

  .post-avatar--inline {
    width: var(--post-avatar-size, 40px);
    height: var(--post-avatar-size, 40px);
    flex: 0 0 var(--post-avatar-size, 40px);
    font-size: var(--post-avatar-font-size, 15px);
    line-height: var(--post-avatar-size, 40px);
  }

  .post-avatar--left {
    width: var(--post-avatar-size, 40px);
    height: var(--post-avatar-size, 40px);
    font-size: var(--post-avatar-font-size, 15px);
    line-height: var(--post-avatar-size, 40px);
  }

  .app[data-avatar-shape="circle"] {
    --post-avatar-radius: 50%;
  }

  .app[data-avatar-shape="rounded"] {
    --post-avatar-radius: 22%;
  }

  .app[data-avatar-shape="square"] {
    --post-avatar-radius: 0;
  }

  .avatar-fallback {
    display: grid;
    place-items: center;
  }

  .post-menu {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    z-index: 5;
    min-width: 148px;
    padding: 5px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg);
    box-shadow: 0 10px 28px rgba(18, 27, 43, 0.2);
  }

  .post-menu button {
    width: 100%;
    min-height: 40px;
    padding: 0 12px;
    border: 0;
    border-radius: 5px;
    background: transparent;
    color: var(--accent);
    font-size: 14px;
    font-weight: 650;
    cursor: pointer;
    text-align: left;
  }

  .post-menu button:hover,
  .post-menu button:focus-visible {
    background: #fff6e8;
  }

  .header-control {
    position: relative;
    display: grid;
    width: 36px;
    height: 44px;
    place-items: center;
  }

  .favorites-control {
    width: 44px;
  }

  .favorites-settings-toggle[aria-expanded="true"] {
    border-radius: 50%;
    background: #fff6e8;
    color: var(--accent);
  }

  .font-toggle {
    display: grid;
    width: 36px;
    height: 36px;
    place-items: center;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--accent);
    cursor: pointer;
    font: italic 800 20px/1 Georgia, serif;
    user-select: none;
    -webkit-touch-callout: none;
  }

  .font-toggle:hover,
  .font-toggle[aria-expanded="true"] {
    background: #fff6e8;
  }

  .header-panel {
    position: absolute;
    top: 44px;
    right: -44px;
    z-index: 15;
    width: min(300px, calc(100vw - 20px));
    max-height: calc(100dvh - 72px);
    padding: 12px;
    overflow: auto;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--bg);
    color: var(--text);
    box-shadow: 0 12px 32px rgba(18, 27, 43, 0.24);
    font: 14px/1.35 Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .favorites-panel {
    right: -70px;
    width: min(310px, calc(100vw - 20px));
  }

  .panel-head {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .panel-head strong {
    font-size: 14px;
  }

  .panel-head button {
    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    border-radius: 5px;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    font-size: 20px;
    font-weight: 700;
    line-height: 1;
  }

  .settings-field {
    display: grid;
    grid-template-columns: 58px minmax(0, 1fr);
    gap: 9px;
    align-items: center;
    margin: 9px 0;
    font-weight: 650;
  }

  .settings-field[hidden] {
    display: none;
  }

  .settings-field select,
  .settings-field input[type="text"],
  .settings-field input[type="number"] {
    width: 100%;
    min-height: 36px;
    padding: 0 8px;
    border: 1px solid var(--border);
    border-radius: 7px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
  }

  .settings-field--custom {
    align-items: start;
  }

  .settings-field--custom > span:first-child {
    padding-top: 9px;
  }

  .custom-font-wrap {
    display: grid;
    gap: 4px;
    min-width: 0;
  }

  .custom-font-wrap small,
  .settings-note {
    color: var(--muted);
    font-size: 11px;
    font-weight: 500;
  }

  .panel-section-title {
    margin: 13px -12px 8px;
    padding: 9px 12px 0;
    border-top: 1px solid var(--border);
    color: var(--muted);
    font-size: 11px;
    font-weight: 750;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .compact-range-controls {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 48px;
    gap: 8px;
    align-items: center;
  }

  .compact-range-controls input[type="range"] {
    width: 100%;
    accent-color: var(--accent);
  }

  .compact-range-controls output {
    color: var(--muted);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
    text-align: right;
    white-space: nowrap;
  }

  .custom-font-wrap input[aria-invalid="true"] {
    border-color: #b42318;
  }

  .font-size-controls {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 62px auto;
    gap: 7px;
    align-items: center;
  }

  .font-size-controls input[type="range"] {
    width: 100%;
    accent-color: var(--accent);
  }

  .font-size-controls input[type="number"] {
    text-align: right;
  }

  .font-size-controls > span {
    color: var(--muted);
    font-size: 12px;
  }

  .settings-switch {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    min-height: 44px;
    font-weight: 650;
  }

  .settings-switch input {
    width: 20px;
    height: 20px;
    accent-color: var(--accent);
  }

  .settings-note {
    margin: 12px 0 4px;
    line-height: 1.45;
  }

  .heat-legend {
    display: flex;
    gap: 12px;
    align-items: center;
    margin: 10px 0 4px 67px;
    color: var(--muted);
    font-size: 11px;
    font-weight: 600;
  }

  .heat-legend span {
    display: inline-flex;
    gap: 5px;
    align-items: center;
  }

  .heat-swatch {
    display: inline-block;
    width: 13px;
    height: 13px;
    border-radius: 3px;
  }

  .heat-swatch--few {
    background: #5a9f6b;
  }

  .heat-swatch--more {
    background: #8864bc;
  }

  .heat-swatch--most {
    background: #c65353;
  }

  .panel-actions {
    display: flex;
    gap: 8px;
    justify-content: space-between;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid var(--border);
  }

  .panel-actions button {
    min-height: 36px;
    padding: 0 10px;
    border: 1px solid var(--border);
    border-radius: 7px;
    background: #f8f9fb;
    color: var(--text);
    cursor: pointer;
    font-size: 12px;
    font-weight: 650;
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
    .app {
      scrollbar-gutter: auto;
    }

    .topbar--board {
      grid-template-columns: 40px minmax(0, 1fr) 36px 40px auto;
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

    .post--avatar-left .post-layout {
      gap: 10px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loading::after {
      animation-duration: 1.8s;
    }
  }
`;

  // src/runtime.js
  var VERSION = "0.6.11";
  var HOST_ID = "bokoun-host";
  var RETURN_HOST_ID = "bokoun-return";
  var BOOT_TIMEOUT_MS = 1e4;
  var PAGE_LOAD_TIMEOUT_MS = 15e3;
  var COMPOSER_TIMEOUT_MS = 8e3;
  var POST_CONFIRM_TIMEOUT_MS = 15e3;
  var WRITE_FEEDBACK_MS = 8e3;
  var STRUCTURED_REFRESH_MS = 3e4;
  var STRUCTURED_RESUME_MS = 2 * 6e4;
  var ROUTE_FALLBACK_POLL_MS = 1e4;
  var ROUTE_DATA_FALLBACK_MS = 2e3;
  var DRAFT_SAVE_DELAY_MS = 350;
  var SCROLL_SAVE_DELAY_MS = 250;
  var STRUCTURED_CACHE_LIMIT = 24;
  var SCROLL_ROUTE_LIMIT = 30;
  var BOARD_POST_LIMIT = 1e3;
  var DRAFT_LIMIT = 50;
  var OLDER_TRIGGER_PX = 900;
  var READ_SYNC_MIN_INTERVAL_MS = 5e3;
  var READ_SYNC_BACKOFF_BASE_MS = 15e3;
  var READ_SYNC_BACKOFF_MAX_MS = 15 * 6e4;
  var MOBILE_QUERY = "(max-width: 760px)";
  var SESSION_DISABLED_KEY = "bokoun.disabled-for-tab.v1";
  var BOARD_VISIT_KEY = "bokoun.board-visit.v1";
  var BOARD_READ_BOUNDARIES_KEY = "bokoun.board-read-boundaries.v1";
  var READ_SYNC_STATE_KEY = "bokoun.read-sync-state.v1";
  var SCROLL_KEY = "bokoun.scroll.v1";
  var PREF_ENABLED_KEY = "bokoun.enabled";
  var DRAFTS_KEY = "bokoun.drafts.v1";
  var ACTIVE_COMPOSER_KEY = "bokoun.active-composer.v1";
  var DISPLAY_SETTINGS_KEY = "bokoun.display.v1";
  var FONT_SETTINGS_KEY = "bokoun.fonts.v1";
  var FAVORITES_SETTINGS_KEY = "bokoun.favorites.v1";
  var FAVORITES_ORDER_KEY = "bokoun.favorites-order.v1";
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
    postAvatar: ".avatar img",
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
  `,
    settings: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h10M18 7h2M10 17h10M4 17h2M4 12h3M11 12h9"></path>
      <circle cx="16" cy="7" r="2"></circle>
      <circle cx="8" cy="17" r="2"></circle>
      <circle cx="9" cy="12" r="2"></circle>
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
    routeEventTimer: 0,
    routeFallbackTimer: 0,
    saveTimer: 0,
    draftSaveTimer: 0,
    feedbackTimer: 0,
    observer: null,
    observedNativeRoot: null,
    observing: false,
    originalPushState: null,
    originalReplaceState: null,
    patchedPushState: null,
    patchedReplaceState: null,
    pageHideHandler: null,
    popStateHandler: null,
    hashChangeHandler: null,
    nativeMode: false,
    pendingAnchor: null,
    boardKey: "",
    boardId: "",
    boardLastPosted: "",
    boardTitle: "",
    boardPosts: [],
    boardPostIndex: /* @__PURE__ */ new Map(),
    boardPostPages: /* @__PURE__ */ new Map(),
    boardLoadedPages: /* @__PURE__ */ new Set(),
    boardNextHref: "",
    boardLoading: false,
    boardEnd: false,
    boardRetentionLimited: false,
    boardError: "",
    boardLoadAbort: null,
    boardAutoCooldownUntil: 0,
    boardStructuredReady: false,
    boardVisit: null,
    structuredCache: /* @__PURE__ */ new Map(),
    structuredPending: /* @__PURE__ */ new Map(),
    structuredFailures: /* @__PURE__ */ new Map(),
    hiddenAt: 0,
    trafficCounters: {
      structuredGets: 0,
      htmlFallbacks: 0,
      readMutations: 0,
      byReason: {}
    },
    composer: null,
    writeFeedback: null,
    writeBusy: false,
    displaySettings: null,
    fontSettings: null,
    openHeaderPanel: "",
    openPostMenuId: "",
    suppressFontClickUntil: 0,
    favoritesSettings: null,
    favoriteManualOrder: null,
    favoriteSourceClubs: [],
    favoriteViewClubs: [],
    editingFavoriteOrder: false
  };
  var gmGet = typeof GM_getValue === "function" ? GM_getValue : (key, fallback) => {
    const raw = localStorage.getItem(`bokoun.gm.${key}`);
    return raw === null ? fallback : JSON.parse(raw);
  };
  var gmSet = typeof GM_setValue === "function" ? GM_setValue : (key, value) => localStorage.setItem(`bokoun.gm.${key}`, JSON.stringify(value));
  var gmMenu = typeof GM_registerMenuCommand === "function" ? GM_registerMenuCommand : () => void 0;

  // src/shell.js
  function canonicalScrollRoute(route, origin = "") {
    try {
      const base = origin || (typeof location !== "undefined" ? location.origin : "https://kapybara.okoun.cz");
      const url = new URL(route, base);
      url.searchParams.delete("bokoun");
      return `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return route;
    }
  }
  function installShell(ctx2) {
    const {
      VERSION: VERSION2,
      HOST_ID: HOST_ID2,
      RETURN_HOST_ID: RETURN_HOST_ID2,
      MOBILE_QUERY: MOBILE_QUERY2,
      SESSION_DISABLED_KEY: SESSION_DISABLED_KEY2,
      SCROLL_KEY: SCROLL_KEY2,
      SCROLL_SAVE_DELAY_MS: SCROLL_SAVE_DELAY_MS2 = 250,
      SCROLL_ROUTE_LIMIT: SCROLL_ROUTE_LIMIT2 = 30,
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
    const stopRouteObservation = (...args) => ctx2.stopRouteObservation?.(...args);
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
        clearTimeout(state2.routeFallbackTimer);
        stopRouteObservation();
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
    function scrollEntryKey(route) {
      return `${SCROLL_KEY2}:${encodeURIComponent(canonicalScrollRoute(route))}`;
    }
    function scrollIndexKey() {
      return `${SCROLL_KEY2}.index`;
    }
    function getScrollIndex() {
      try {
        const index = JSON.parse(sessionStorage.getItem(scrollIndexKey()) || "[]");
        return Array.isArray(index) ? index.filter((route) => typeof route === "string") : [];
      } catch {
        return [];
      }
    }
    function touchScrollRoute(route) {
      const normalizedRoute = canonicalScrollRoute(route);
      const index = [
        normalizedRoute,
        ...getScrollIndex().filter((entry) => entry !== normalizedRoute)
      ];
      const retained = index.slice(0, SCROLL_ROUTE_LIMIT2);
      for (const evicted of index.slice(SCROLL_ROUTE_LIMIT2)) {
        sessionStorage.removeItem(scrollEntryKey(evicted));
      }
      sessionStorage.setItem(scrollIndexKey(), JSON.stringify(retained));
    }
    function storedScroll(route) {
      const raw = sessionStorage.getItem(scrollEntryKey(route));
      if (raw !== null) {
        const value = Number(raw);
        if (Number.isFinite(value)) return Math.max(0, value);
      }
      const legacyRaw = sessionStorage.getItem(
        `${SCROLL_KEY2}:${encodeURIComponent(route)}`
      );
      if (legacyRaw !== null) {
        const value = Number(legacyRaw);
        if (Number.isFinite(value)) return Math.max(0, value);
      }
      const map = getScrollMap();
      return map[canonicalScrollRoute(route)] ?? map[route];
    }
    function saveScroll() {
      if (!state2.scroller || !state2.currentRouteKey) return;
      const route = canonicalScrollRoute(state2.currentRouteKey);
      const value = Math.max(0, Math.round(state2.scroller.scrollTop));
      if (storedScroll(route) === value) return;
      sessionStorage.setItem(scrollEntryKey(route), String(value));
      touchScrollRoute(route);
    }
    function scheduleScrollSave() {
      clearTimeout(state2.saveTimer);
      state2.saveTimer = window.setTimeout(saveScroll, SCROLL_SAVE_DELAY_MS2);
    }
    function handleBokounScroll() {
      scheduleScrollSave();
      maybeLoadOlder();
    }
    function restoreScroll(key, fallback = 0) {
      const y = storedScroll(key) ?? fallback;
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
      scrollEntryKey,
      getScrollIndex,
      storedScroll,
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
      STRUCTURED_RESUME_MS: STRUCTURED_RESUME_MS2 = 2 * 6e4,
      STRUCTURED_CACHE_LIMIT: STRUCTURED_CACHE_LIMIT2 = 24,
      SELECTORS: SELECTORS2,
      state: state2
    } = ctx2;
    const routeKey = (...args) => ctx2.routeKey(...args);
    const scheduleRender = (...args) => ctx2.scheduleRender(...args);
    const now = () => typeof ctx2.now === "function" ? ctx2.now() : Date.now();
    const STRUCTURED_REASONS = /* @__PURE__ */ new Set([
      "initial-route",
      "route-transition",
      "visibility-resume",
      "successful-post",
      "manual-refresh",
      "pagination"
    ]);
    function recordTraffic(kind, reason = "unspecified") {
      const counters = state2.trafficCounters;
      if (!counters || !Object.hasOwn(counters, kind)) return;
      counters[kind] += 1;
      counters.byReason[reason] = (counters.byReason[reason] || 0) + 1;
    }
    function trafficSnapshot() {
      const counters = state2.trafficCounters || {};
      return {
        structuredGets: Number(counters.structuredGets) || 0,
        htmlFallbacks: Number(counters.htmlFallbacks) || 0,
        readMutations: Number(counters.readMutations) || 0,
        byReason: { ...counters.byReason || {} }
      };
    }
    function resetTrafficCounters() {
      if (!state2.trafficCounters) return;
      state2.trafficCounters.structuredGets = 0;
      state2.trafficCounters.htmlFallbacks = 0;
      state2.trafficCounters.readMutations = 0;
      state2.trafficCounters.byReason = {};
    }
    function documentIsHidden() {
      return typeof document !== "undefined" && document.visibilityState === "hidden";
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
    function normalizeImageHref(value) {
      if (!value) return "";
      try {
        const url = new URL(value, "https://kapybara.okoun.cz");
        if (!["http:", "https:"].includes(url.protocol)) return "";
        return url.origin === "https://kapybara.okoun.cz" ? `${url.pathname}${url.search}${url.hash}` : url.href;
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
        id: String(row.dataset.boardId || ""),
        href: normalizeHref(row.getAttribute("href")),
        name: text(row.querySelector(SELECTORS2.favoriteName)),
        unread: unreadCount(row),
        activity: relativeActivity(row),
        lastPosted: row.querySelector(SELECTORS2.favoriteTime)?.getAttribute("datetime") || ""
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
      const threadRoot = url.searchParams.get("rootId");
      if (threadRoot) query.set("rootId", threadRoot);
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
        const parentId = post?.parent?.id ? String(post.parent.id) : "";
        const rootId = post?.rootId ? String(post.rootId) : parentId;
        return {
          id: String(post?.id || ""),
          author: String(post?.author?.login || "neznámý"),
          avatarUrl: normalizeImageHref(post?.author?.iconUrl),
          date: formatPostTimestamp(post?.posted),
          datetime: typeof post?.posted === "string" ? post.posted : "",
          parentId,
          parentAuthor: String(parentAuthor || ""),
          parentDate,
          rootId,
          depth: Math.max(0, Number(post?.depth) || 0),
          sequence: Number(post?.sequence) || 0,
          replyReference: post?.parent ? `Reakce na ${parentAuthor || "neznámý"}${parentDate ? `, ${parentDate}` : ""}` : "",
          bodyHtml: sanitize(typeof post?.htmlBody === "string" ? post.htmlBody : ""),
          pageHref: normalizedStructuredPageHref(pageHref)
        };
      }).filter((post) => post.id);
      return {
        id: String(boardRoot.board.id || ""),
        title: String(boardRoot.board.name || boardRoot.board.slug || "Klub"),
        posts,
        nextOlderHref: olderHrefFromPagination(pageRoot.pagination, pageHref),
        lastPosted: typeof boardRoot.board.lastPosted === "string" ? boardRoot.board.lastPosted : "",
        lastRead: typeof boardRoot.board.lastRead === "string" ? boardRoot.board.lastRead : "",
        newPostsCount: Number.isFinite(boardRoot.board.newPostsCount) ? Math.max(0, boardRoot.board.newPostsCount) : 0
      };
    }
    function favoritesModelFromSvelteRoots(roots) {
      const root = roots.filter((candidate) => Array.isArray(candidate?.boards)).at(-1);
      if (!root || root.apiAccessRequired || root.error) {
        throw new Error("Incomplete structured Favorites data");
      }
      return root.boards.map((board) => ({
        id: String(board?.id || ""),
        href: `/boards/${encodeURIComponent(String(board?.slug || ""))}`,
        name: String(board?.name || ""),
        unread: Number.isFinite(board?.newPostsCount) ? Math.max(0, board.newPostsCount) : 0,
        activity: relativeActivityFromTimestamp(board?.lastPosted),
        lastPosted: typeof board?.lastPosted === "string" ? board.lastPosted : ""
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
    async function fetchStructuredModel(type, pageHref, { signal, reason = "manual-refresh" } = {}) {
      recordTraffic("structuredGets", reason);
      const response = await fetch(structuredDataUrl(pageHref), {
        cache: "no-store",
        credentials: "same-origin",
        headers: { Accept: "text/sveltekit-data" },
        signal
      });
      if (!response.ok || !response.headers.get("content-type")?.includes("text/sveltekit-data")) {
        throw new Error(`Structured data HTTP ${response.status}`);
      }
      const roots = decodeSvelteDataText(await response.text());
      const model = type === "favorites" ? favoritesModelFromSvelteRoots(roots) : boardModelFromSvelteRoots(roots, pageHref);
      return { type, model, fetchedAt: now() };
    }
    function structuredCacheKey(type, pageHref) {
      return `${type}:${normalizeHref(pageHref)}`;
    }
    function cachedStructuredModel(type, pageHref) {
      const cacheKey = structuredCacheKey(type, pageHref);
      const entry = state2.structuredCache.get(cacheKey);
      if (!entry) return null;
      state2.structuredCache.delete(cacheKey);
      state2.structuredCache.set(cacheKey, entry);
      return entry.model || null;
    }
    function storeStructuredEntry(cacheKey, entry) {
      state2.structuredCache.delete(cacheKey);
      state2.structuredCache.set(cacheKey, entry);
      while (state2.structuredCache.size > STRUCTURED_CACHE_LIMIT2) {
        const oldestKey = state2.structuredCache.keys().next().value;
        if (oldestKey === void 0) break;
        state2.structuredCache.delete(oldestKey);
        state2.structuredFailures.delete(oldestKey);
      }
      return entry;
    }
    function ensureStructuredModel(type, pageHref, {
      reason = "initial-route",
      force = false,
      minimumAge = reason === "visibility-resume" ? STRUCTURED_RESUME_MS2 : STRUCTURED_REFRESH_MS2
    } = {}) {
      if (!STRUCTURED_REASONS.has(reason)) {
        throw new Error(`Unsupported structured refresh reason: ${reason}`);
      }
      if (documentIsHidden()) return Promise.resolve(null);
      const cacheKey = structuredCacheKey(type, pageHref);
      const cached = state2.structuredCache.get(cacheKey);
      if (!force && cached && now() - cached.fetchedAt < minimumAge) {
        return Promise.resolve(cached);
      }
      const existing = state2.structuredPending.get(cacheKey);
      if (existing) return existing.promise;
      const lastFailure = state2.structuredFailures.get(cacheKey) || 0;
      if (!force && now() - lastFailure < 3e4) return Promise.resolve(null);
      const controller = new AbortController();
      const pending = {
        controller,
        promise: null
      };
      pending.promise = fetchStructuredModel(type, pageHref, {
        signal: controller.signal,
        reason
      }).then((entry) => {
        storeStructuredEntry(cacheKey, entry);
        state2.structuredFailures.delete(cacheKey);
        state2.currentSignature = "";
        scheduleRender({ force: true });
      }).catch((error) => {
        if (error?.name === "AbortError") return null;
        state2.structuredFailures.delete(cacheKey);
        state2.structuredFailures.set(cacheKey, now());
        while (state2.structuredFailures.size > STRUCTURED_CACHE_LIMIT2) {
          const oldestKey = state2.structuredFailures.keys().next().value;
          if (oldestKey === void 0) break;
          state2.structuredFailures.delete(oldestKey);
        }
        console.warn(
          `[Bokoun ${VERSION2}] Structured ${type} data unavailable; using DOM fallback.`,
          error?.name || "Error"
        );
        return null;
      }).finally(() => {
        if (state2.structuredPending.get(cacheKey) === pending) {
          state2.structuredPending.delete(cacheKey);
        }
      });
      state2.structuredPending.set(cacheKey, pending);
      return pending.promise;
    }
    function abortStructuredRequests(exceptType = "", exceptHref = "") {
      const keep = exceptType && exceptHref ? structuredCacheKey(exceptType, exceptHref) : "";
      for (const [key, entry] of state2.structuredPending) {
        if (key !== keep) entry.controller?.abort();
      }
    }
    function invalidateStructuredModel(type, pageHref) {
      const cacheKey = structuredCacheKey(type, pageHref);
      state2.structuredPending.get(cacheKey)?.controller?.abort();
      state2.structuredPending.delete(cacheKey);
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
    function replyReferenceParts(value) {
      const reference = String(value || "").trim();
      const match = reference.match(
        /^Reakce na\s+(.+?)(?:,\s*(\d{1,2}\.\d{1,2}\.\d{4}\s+\d{1,2}:\d{2}(?::\d{2})?))?$/i
      );
      return {
        author: match?.[1]?.trim() || "",
        date: match?.[2]?.trim() || ""
      };
    }
    function readBoardFromDom(root = document, pageHref = routeKey()) {
      const title = text(root.querySelector(SELECTORS2.boardTitle)) || decodeURIComponent(location.pathname.split("/").filter(Boolean).at(-1) || "Klub");
      const posts = [...root.querySelectorAll(SELECTORS2.posts)].map((post) => {
        const body = post.querySelector(SELECTORS2.postBody);
        const replyReference = text(post.querySelector(SELECTORS2.postReplyReference));
        const replyParts = replyReferenceParts(replyReference);
        const threadHref = post.querySelector('a[href*="rootId="]')?.getAttribute("href") || "";
        let rootId = "";
        try {
          rootId = new URL(threadHref, location.origin).searchParams.get("rootId") || "";
        } catch {
          rootId = "";
        }
        return {
          id: post.getAttribute("data-post-id") || "",
          author: text(post.querySelector(SELECTORS2.postAuthor)) || "neznámý",
          avatarUrl: normalizeImageHref(
            post.querySelector(SELECTORS2.postAvatar)?.getAttribute("src")
          ),
          date: compactDate(post),
          datetime: post.querySelector(SELECTORS2.postTime)?.getAttribute("datetime") || "",
          parentId: "",
          parentAuthor: replyParts.author,
          parentDate: replyParts.date,
          rootId,
          depth: 0,
          sequence: 0,
          replyReference,
          bodyHtml: sanitizeHtml(body?.innerHTML || ""),
          pageHref: normalizeHref(pageHref)
        };
      }).filter((post) => post.id);
      const olderLinks = [...root.querySelectorAll(SELECTORS2.olderPosts)];
      const nextOlderHref = normalizeHref(olderLinks.at(-1)?.getAttribute("href") || "");
      return {
        id: "",
        title,
        posts,
        nextOlderHref,
        lastPosted: "",
        lastRead: "",
        newPostsCount: 0
      };
    }
    Object.assign(ctx2, {
      text,
      normalizeHref,
      normalizeImageHref,
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
      storeStructuredEntry,
      cachedStructuredModel,
      ensureStructuredModel,
      abortStructuredRequests,
      invalidateStructuredModel,
      recordTraffic,
      trafficSnapshot,
      resetTrafficCounters,
      sanitizeHtml,
      safeUrl,
      compactDate,
      replyReferenceParts,
      readBoardFromDom
    });
  }

  // src/read-sync.js
  function installReadSync(ctx2) {
    const {
      READ_SYNC_MIN_INTERVAL_MS: READ_SYNC_MIN_INTERVAL_MS2 = 5e3,
      READ_SYNC_BACKOFF_BASE_MS: READ_SYNC_BACKOFF_BASE_MS2 = 15e3,
      READ_SYNC_BACKOFF_MAX_MS: READ_SYNC_BACKOFF_MAX_MS2 = 15 * 6e4,
      READ_SYNC_STATE_KEY: READ_SYNC_STATE_KEY2 = "bokoun.read-sync-state.v1"
    } = ctx2;
    const now = () => typeof ctx2.now === "function" ? ctx2.now() : Date.now();
    const recordTraffic = (...args) => ctx2.recordTraffic?.(...args);
    const successful = /* @__PURE__ */ new Map();
    const submitted = /* @__PURE__ */ new Map();
    const pending = /* @__PURE__ */ new Map();
    const lastAttempt = /* @__PURE__ */ new Map();
    const failures = /* @__PURE__ */ new Map();
    function restoreSyncState() {
      if (typeof sessionStorage === "undefined") return;
      let stored;
      try {
        stored = JSON.parse(sessionStorage?.getItem(READ_SYNC_STATE_KEY2) || "{}");
      } catch {
        stored = {};
      }
      if (!stored || typeof stored !== "object" || Array.isArray(stored)) return;
      for (const [rawBoardId, value] of Object.entries(stored)) {
        const boardId = Number.parseInt(rawBoardId, 10);
        if (!Number.isSafeInteger(boardId) || !value || typeof value !== "object") continue;
        const success = Number(value.success) || 0;
        const submittedBoundary = Number(value.submitted) || 0;
        const attemptedAt = Number(value.attemptedAt) || 0;
        const attempts = Math.max(0, Number(value.attempts) || 0);
        const retryAt = Number(value.retryAt) || 0;
        if (success > 0) successful.set(boardId, success);
        if (submittedBoundary > 0) submitted.set(boardId, submittedBoundary);
        if (attemptedAt > 0) lastAttempt.set(boardId, attemptedAt);
        if (attempts > 0 && retryAt > 0) failures.set(boardId, { attempts, retryAt });
      }
    }
    function persistSyncState() {
      if (typeof sessionStorage === "undefined") return;
      const boardIds = /* @__PURE__ */ new Set([
        ...successful.keys(),
        ...submitted.keys(),
        ...lastAttempt.keys(),
        ...failures.keys()
      ]);
      const entries = [...boardIds].map((boardId) => {
        const failure = failures.get(boardId);
        return [boardId, {
          success: successful.get(boardId) || 0,
          submitted: submitted.get(boardId) || 0,
          attemptedAt: lastAttempt.get(boardId) || 0,
          attempts: failure?.attempts || 0,
          retryAt: failure?.retryAt || 0
        }];
      }).sort((left, right) => Math.max(right[1].success, right[1].submitted, right[1].attemptedAt, right[1].retryAt) - Math.max(left[1].success, left[1].submitted, left[1].attemptedAt, left[1].retryAt)).slice(0, 100);
      try {
        sessionStorage?.setItem(READ_SYNC_STATE_KEY2, JSON.stringify(Object.fromEntries(entries)));
      } catch {
      }
    }
    restoreSyncState();
    function storageValue(store, key) {
      try {
        return store?.getItem(key) || "";
      } catch {
        return "";
      }
    }
    function cookieValue(name) {
      try {
        const prefix = `${name}=`;
        const entry = document.cookie.split(";").map((value) => value.trim()).find((value) => value.startsWith(prefix));
        return entry ? decodeURIComponent(entry.slice(prefix.length)) : "";
      } catch {
        return "";
      }
    }
    function currentAuthToken() {
      const fromCookie = cookieValue("auth_token");
      if (fromCookie) return fromCookie;
      const fromSession = storageValue(sessionStorage, "auth_token");
      if (fromSession) return fromSession;
      return storageValue(localStorage, "auth_remembered") === "true" ? storageValue(localStorage, "auth_token") : "";
    }
    function nativeGraphqlEndpoint() {
      const declared = document.querySelector('meta[name="okoun-graphql-endpoint"]')?.content;
      try {
        const url = new URL(declared || "/graphql", location.origin);
        return ["https:", "http:"].includes(url.protocol) ? url.href : "";
      } catch {
        return "";
      }
    }
    function nativeReadTimestamp(timestamp) {
      const date = new Date(timestamp);
      if (Number.isNaN(date.getTime())) return "";
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
      if (!parts.year || !parts.month || !parts.day || !parts.hour || !parts.minute || !parts.second) {
        return "";
      }
      return `${parts.year}${parts.month}${parts.day}-${parts.hour}${parts.minute}${parts.second}`;
    }
    function noteFailure(boardId) {
      const attempts = (failures.get(boardId)?.attempts || 0) + 1;
      const delay = Math.min(
        READ_SYNC_BACKOFF_MAX_MS2,
        READ_SYNC_BACKOFF_BASE_MS2 * 2 ** (attempts - 1)
      );
      failures.set(boardId, { attempts, retryAt: now() + delay });
      persistSyncState();
    }
    async function syncNativeBoardRead(boardId, timestamp) {
      const normalizedBoardId = Number.parseInt(String(boardId || ""), 10);
      const boundary = new Date(timestamp).getTime();
      const nativeTimestamp = nativeReadTimestamp(timestamp);
      if (!Number.isSafeInteger(normalizedBoardId) || normalizedBoardId < 1) return false;
      if (!nativeTimestamp || !Number.isFinite(boundary)) return false;
      if ((successful.get(normalizedBoardId) || 0) >= boundary) return true;
      const currentPending = pending.get(normalizedBoardId);
      if (currentPending) {
        if (currentPending.boundary >= boundary) return currentPending.promise;
        return currentPending.promise.then(() => syncNativeBoardRead(normalizedBoardId, timestamp));
      }
      if ((submitted.get(normalizedBoardId) || 0) >= boundary) return true;
      const failure = failures.get(normalizedBoardId);
      if (failure && now() < failure.retryAt) return false;
      const previousAttempt = lastAttempt.get(normalizedBoardId);
      if (previousAttempt !== void 0 && now() - previousAttempt < READ_SYNC_MIN_INTERVAL_MS2) {
        return false;
      }
      const token = currentAuthToken();
      const endpoint = nativeGraphqlEndpoint();
      if (!token || !endpoint) return false;
      const headers = {
        "Content-Type": "application/json",
        "X-Client-App": "bokoun",
        Authorization: `Bearer ${token}`
      };
      const accessCode = storageValue(localStorage, "okoun-api-access-code");
      if (accessCode) headers["X-API-Access-Code"] = accessCode;
      lastAttempt.set(normalizedBoardId, now());
      submitted.set(
        normalizedBoardId,
        Math.max(submitted.get(normalizedBoardId) || 0, boundary)
      );
      persistSyncState();
      recordTraffic("readMutations", "visit-boundary");
      const entry = {
        boundary,
        promise: null
      };
      entry.promise = (async () => {
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            credentials: "include",
            keepalive: true,
            headers,
            body: JSON.stringify({
              query: `mutation MarkBoardAsRead($boardId: Int!, $timestamp: String!) {
              markBoardAsRead(boardId: $boardId, timestamp: $timestamp) { id }
            }`,
              variables: {
                boardId: normalizedBoardId,
                timestamp: nativeTimestamp
              }
            })
          });
          if (!response.ok) {
            if (submitted.get(normalizedBoardId) === boundary) {
              submitted.delete(normalizedBoardId);
            }
            noteFailure(normalizedBoardId);
            return false;
          }
          const payload = await response.json().catch(() => null);
          const synced = Boolean(payload?.data?.markBoardAsRead?.id);
          if (synced) {
            successful.set(
              normalizedBoardId,
              Math.max(successful.get(normalizedBoardId) || 0, boundary)
            );
            submitted.delete(normalizedBoardId);
            failures.delete(normalizedBoardId);
            persistSyncState();
          } else {
            if (submitted.get(normalizedBoardId) === boundary) {
              submitted.delete(normalizedBoardId);
            }
            noteFailure(normalizedBoardId);
          }
          return synced;
        } catch {
          if (submitted.get(normalizedBoardId) === boundary) {
            submitted.delete(normalizedBoardId);
          }
          noteFailure(normalizedBoardId);
          return false;
        } finally {
          if (pending.get(normalizedBoardId) === entry) pending.delete(normalizedBoardId);
        }
      })();
      pending.set(normalizedBoardId, entry);
      return entry.promise;
    }
    Object.assign(ctx2, { syncNativeBoardRead });
  }

  // src/board-state.js
  function installBoardState(ctx2) {
    const {
      BOARD_VISIT_KEY: BOARD_VISIT_KEY2 = "bokoun.board-visit.v1",
      BOARD_READ_BOUNDARIES_KEY: BOARD_READ_BOUNDARIES_KEY2 = "bokoun.board-read-boundaries.v1",
      BOARD_POST_LIMIT: BOARD_POST_LIMIT2 = 1e3,
      gmGet: gmGet2 = () => ({}),
      gmSet: gmSet2 = () => void 0,
      state: state2
    } = ctx2;
    const routeKey = (...args) => ctx2.routeKey(...args);
    const normalizeHref = (...args) => ctx2.normalizeHref(...args);
    const syncNativeBoardRead = (...args) => ctx2.syncNativeBoardRead(...args);
    function boardPath(pageHref = routeKey()) {
      try {
        return new URL(pageHref, location.origin).pathname;
      } catch {
        return "";
      }
    }
    function readBoardVisit() {
      if (typeof sessionStorage === "undefined") return state2.boardVisit || null;
      try {
        const visit = JSON.parse(sessionStorage.getItem(BOARD_VISIT_KEY2) || "null");
        if (!visit || typeof visit.boardPath !== "string") return null;
        return {
          boardPath: visit.boardPath,
          boardId: typeof visit.boardId === "string" ? visit.boardId : "",
          lastRead: typeof visit.lastRead === "string" ? visit.lastRead : "",
          unreadCount: Math.max(0, Number(visit.unreadCount) || 0)
        };
      } catch {
        return null;
      }
    }
    function writeBoardVisit(visit) {
      state2.boardVisit = visit;
      if (typeof sessionStorage === "undefined") return;
      try {
        sessionStorage.setItem(BOARD_VISIT_KEY2, JSON.stringify(visit));
      } catch {
      }
    }
    function laterReadBoundary(...values) {
      return values.reduce((latest, value) => {
        const timestamp = Date.parse(value);
        return Number.isFinite(timestamp) && timestamp > (Date.parse(latest) || 0) ? new Date(timestamp).toISOString() : latest;
      }, "");
    }
    function readLocalBoundaries() {
      try {
        const stored = gmGet2(BOARD_READ_BOUNDARIES_KEY2, {});
        return stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
      } catch {
        return {};
      }
    }
    function localReadBoundary(path) {
      const value = readLocalBoundaries()[path];
      return typeof value === "string" ? value : "";
    }
    function rememberBoardReadBoundary(path, posts = state2.boardPosts) {
      if (!path) return "";
      const visit = readBoardVisit();
      const newestSeen = posts.reduce(
        (latest, post) => laterReadBoundary(latest, post.datetime),
        laterReadBoundary(visit?.lastRead || "", (/* @__PURE__ */ new Date()).toISOString())
      );
      if (!newestSeen) return "";
      const boundaries = {
        ...readLocalBoundaries(),
        [path]: laterReadBoundary(localReadBoundary(path), newestSeen)
      };
      const trimmed = Object.fromEntries(
        Object.entries(boundaries).filter(([key, value]) => key.startsWith("/boards/") && Number.isFinite(Date.parse(value))).sort((left, right) => Date.parse(right[1]) - Date.parse(left[1])).slice(0, 100)
      );
      try {
        gmSet2(BOARD_READ_BOUNDARIES_KEY2, trimmed);
      } catch {
      }
      return trimmed[path] || "";
    }
    function boardReadTimestamp() {
      return state2.boardPosts.reduce(
        (latest, post) => laterReadBoundary(latest, post.datetime),
        state2.boardLastPosted || ""
      );
    }
    function reconcileFavoriteReadState(clubs) {
      return clubs.map((club) => {
        const boundary = Date.parse(localReadBoundary(boardPath(club.href)));
        const lastPosted = Date.parse(club.lastPosted);
        return Number.isFinite(boundary) && Number.isFinite(lastPosted) && boundary >= lastPosted ? { ...club, unread: 0 } : club;
      });
    }
    function startBoardVisit(pageHref, {
      id = "",
      lastRead = "",
      newPostsCount = 0,
      unreadCount = newPostsCount
    } = {}) {
      const path = boardPath(pageHref);
      const visit = {
        boardPath: path,
        boardId: String(id || ""),
        lastRead: laterReadBoundary(
          typeof lastRead === "string" ? lastRead : "",
          localReadBoundary(path)
        ),
        unreadCount: Math.max(0, Number(unreadCount) || 0)
      };
      writeBoardVisit(visit);
      return visit;
    }
    function ensureBoardVisit(pageHref, model = {}) {
      const path = boardPath(pageHref);
      const stored = readBoardVisit();
      if (stored?.boardPath === path) {
        if (!stored.lastRead && typeof model.lastRead === "string" && model.lastRead) {
          return startBoardVisit(pageHref, {
            ...model,
            id: model.id || stored.boardId
          });
        }
        state2.boardVisit = stored;
        return stored;
      }
      return startBoardVisit(pageHref, model);
    }
    function syncBoardVisitRead() {
      const stored = readBoardVisit();
      if (!stored || !state2.boardId) return Promise.resolve(false);
      return syncNativeBoardRead(state2.boardId, boardReadTimestamp());
    }
    function leaveBoardVisit(path = "") {
      const stored = readBoardVisit();
      if (!stored) {
        state2.boardVisit = null;
        return;
      }
      if (path && stored?.boardPath && stored.boardPath !== path) return;
      void syncBoardVisitRead();
      rememberBoardReadBoundary(stored?.boardPath || path);
      state2.boardVisit = null;
      if (typeof sessionStorage === "undefined") return;
      try {
        sessionStorage.removeItem(BOARD_VISIT_KEY2);
      } catch {
      }
    }
    function startBoardVisitFromFavorite(pageHref, unreadCount = 0, boardId = "") {
      return startBoardVisit(pageHref, {
        id: boardId,
        newPostsCount: unreadCount
      });
    }
    function newPostIdsForVisit(posts, visit = state2.boardVisit) {
      if (!visit) return [];
      const boundary = Date.parse(visit.lastRead);
      if (Number.isFinite(boundary)) {
        return posts.filter((post) => {
          const posted = Date.parse(post.datetime);
          return Number.isFinite(posted) && posted > boundary;
        }).map((post) => post.id);
      }
      return posts.slice(0, Math.max(0, Number(visit.unreadCount) || 0)).map((post) => post.id);
    }
    function boardRouteIdentity(pageHref = routeKey()) {
      const url = new URL(pageHref, location.origin);
      const rootId = url.searchParams.get("rootId") || "";
      return `${url.pathname}${rootId ? `?rootId=${encodeURIComponent(rootId)}` : ""}`;
    }
    function threadRootId(pageHref = routeKey()) {
      try {
        return new URL(pageHref, location.origin).searchParams.get("rootId") || "";
      } catch {
        return "";
      }
    }
    function threadPosts(posts, rootId) {
      if (!rootId) return [...posts];
      return posts.filter((post) => post.id === rootId || post.rootId === rootId).sort((left, right) => {
        if (left.id === rootId) return -1;
        if (right.id === rootId) return 1;
        const leftTime = Date.parse(left.datetime) || 0;
        const rightTime = Date.parse(right.datetime) || 0;
        return leftTime - rightTime || left.sequence - right.sequence || Number(left.id) - Number(right.id);
      });
    }
    function resetBoardAccumulator(model, pageHref, { structured = false } = {}) {
      state2.boardLoadAbort?.abort();
      state2.boardLoadAbort = null;
      const visit = ensureBoardVisit(pageHref, model);
      state2.boardKey = boardRouteIdentity(pageHref);
      state2.boardId = model.id || visit?.boardId || "";
      state2.boardLastPosted = model.lastPosted || "";
      state2.boardTitle = model.title;
      state2.boardPosts = [];
      state2.boardPostIndex = /* @__PURE__ */ new Map();
      state2.boardPostPages = /* @__PURE__ */ new Map();
      state2.boardLoadedPages = /* @__PURE__ */ new Set();
      state2.boardNextHref = "";
      state2.boardLoading = false;
      state2.boardEnd = false;
      state2.boardRetentionLimited = false;
      state2.boardError = "";
      state2.boardAutoCooldownUntil = 0;
      state2.boardStructuredReady = structured;
      mergeBoardPage(model, pageHref, { setNext: true });
    }
    function mergeBoardPage(model, pageHref, { setNext = false } = {}) {
      const normalizedPage = normalizeHref(pageHref);
      let added = 0;
      let retentionLimited = false;
      if (normalizedPage) state2.boardLoadedPages.add(normalizedPage);
      if (model.title) state2.boardTitle = model.title;
      if (model.id) state2.boardId = model.id;
      if (model.lastPosted) state2.boardLastPosted = model.lastPosted;
      for (const post of model.posts) {
        const index = state2.boardPostIndex.get(post.id);
        if (index === void 0) {
          if (state2.boardPosts.length >= BOARD_POST_LIMIT2) {
            retentionLimited = true;
            break;
          }
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
      if (retentionLimited || state2.boardPosts.length >= BOARD_POST_LIMIT2 && Boolean(model.nextOlderHref)) {
        state2.boardRetentionLimited = true;
        state2.boardEnd = true;
        state2.boardNextHref = "";
      }
      return added;
    }
    function refreshBoardNewestPage(model, pageHref) {
      ensureBoardVisit(pageHref, model);
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
      if (model.id) state2.boardId = model.id;
      if (model.lastPosted) state2.boardLastPosted = model.lastPosted;
      for (const post of model.posts) {
        state2.boardPostIndex.set(post.id, state2.boardPosts.length);
        state2.boardPostPages.set(post.id, normalizedPage || post.pageHref);
        state2.boardPosts.push({ ...post, pageHref: normalizedPage || post.pageHref });
      }
      for (const { post, pageHref: olderPageHref } of older) {
        if (state2.boardPosts.length >= BOARD_POST_LIMIT2) {
          state2.boardRetentionLimited = true;
          break;
        }
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
      const activeRootId = threadRootId();
      const posts = threadPosts(state2.boardPosts, activeRootId);
      return {
        title: state2.boardTitle,
        posts,
        threadRootId: activeRootId,
        threadCount: posts.length,
        newPostIds: newPostIdsForVisit(state2.boardPosts),
        nextOlderHref: state2.boardNextHref,
        loading: state2.boardLoading,
        end: state2.boardEnd,
        retentionLimited: state2.boardRetentionLimited,
        error: state2.boardError,
        loadedPageCount: state2.boardLoadedPages.size
      };
    }
    Object.assign(ctx2, {
      boardRouteIdentity,
      boardPath,
      readBoardVisit,
      laterReadBoundary,
      localReadBoundary,
      rememberBoardReadBoundary,
      boardReadTimestamp,
      reconcileFavoriteReadState,
      startBoardVisit,
      ensureBoardVisit,
      syncBoardVisitRead,
      leaveBoardVisit,
      startBoardVisitFromFavorite,
      newPostIdsForVisit,
      threadRootId,
      threadPosts,
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
      DRAFT_SAVE_DELAY_MS: DRAFT_SAVE_DELAY_MS2 = 350,
      DRAFT_LIMIT: DRAFT_LIMIT2 = 50,
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
    const ensureStructuredModel = (...args) => ctx2.ensureStructuredModel(...args);
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
      if (body) {
        delete drafts[key];
        drafts[key] = body;
        while (Object.keys(drafts).length > DRAFT_LIMIT2) {
          delete drafts[Object.keys(drafts)[0]];
        }
      } else delete drafts[key];
      gmSet2(DRAFTS_KEY2, drafts);
    }
    function cancelDraftSave() {
      clearTimeout(state2.draftSaveTimer);
      state2.draftSaveTimer = 0;
    }
    function clearDraft(kind, replyTo = "", boardId = currentBoardId()) {
      cancelDraftSave();
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
      persistComposerDraft();
      if (!state2.composer?.ambiguous) dismissNativeComposers();
      forgetActiveComposer();
      state2.composer = null;
      scheduleRender({ force: true });
    }
    function discardComposerDraft() {
      if (!state2.composer || state2.writeBusy) return;
      const { kind, replyTo, boardId, ambiguous } = state2.composer;
      cancelDraftSave();
      clearDraft(kind, replyTo, boardId);
      forgetActiveComposer();
      if (!ambiguous) dismissNativeComposers();
      state2.composer = null;
      scheduleRender({ force: true });
    }
    function updateDraftUi(value, { pending = false } = {}) {
      const hasDraft = Boolean(value);
      const status = state2.shadow?.querySelector("[data-draft-status]");
      const discard = state2.shadow?.querySelector("[data-action='discard-draft']");
      if (status) {
        status.textContent = hasDraft ? pending ? "Ukládám koncept…" : "Koncept uložen v zařízení" : "Koncept se ukládá automaticky";
      }
      if (discard) discard.hidden = !hasDraft;
    }
    function updateComposerBody(value) {
      if (!state2.composer || state2.writeBusy) return;
      state2.composer.body = value;
      state2.composer.error = "";
      cancelDraftSave();
      state2.draftSaveTimer = window.setTimeout(
        persistComposerDraft,
        DRAFT_SAVE_DELAY_MS2
      );
      updateDraftUi(value, { pending: true });
    }
    function persistComposerDraft() {
      if (!state2.composer) return;
      cancelDraftSave();
      const textarea = state2.shadow?.querySelector(".composer-textarea");
      if (textarea) state2.composer.body = textarea.value;
      saveDraft(
        state2.composer.kind,
        state2.composer.replyTo,
        state2.composer.body,
        state2.composer.boardId
      );
      rememberActiveComposer(state2.composer);
      updateDraftUi(state2.composer.body);
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
    function visibleNativeElement(selectors, root = document) {
      return [...root.querySelectorAll(selectors)].find((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true" && element.getClientRects().length > 0) || null;
    }
    function visibleNativeComposer(selectors = "") {
      return visibleNativeElement(
        selectors || `${SELECTORS2.newPostComposer}, ${SELECTORS2.replyComposer}`
      );
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
        await waitForNative(
          () => !visibleNativeComposer(),
          COMPOSER_TIMEOUT_MS2,
          "Native composer did not close"
        );
        let section;
        let submitLabel;
        if (composer.kind === "reply") {
          stage = "open-reply";
          const pageHref = state2.boardPostPages.get(composer.replyTo) || routeKey();
          if (!nativePostById(composer.replyTo)) {
            await navigateNativeRoute(pageHref, composer.replyTo);
          }
          const target = nativePostById(composer.replyTo);
          const reply = await waitForNative(
            () => target && visibleNativeElement(SELECTORS2.postReplyAction, target),
            COMPOSER_TIMEOUT_MS2,
            "Native reply action is unavailable"
          );
          reply.click();
          section = await waitForNative(
            () => visibleNativeComposer(SELECTORS2.replyComposer),
            COMPOSER_TIMEOUT_MS2,
            "Native reply composer did not open"
          );
          submitLabel = "Odeslat";
        } else {
          stage = "open-new-post";
          const launcher = await waitForNative(
            () => visibleNativeElement(SELECTORS2.newPostLauncher),
            COMPOSER_TIMEOUT_MS2,
            "Native new-post action is unavailable"
          );
          launcher.click();
          section = await waitForNative(
            () => visibleNativeComposer(SELECTORS2.newPostComposer),
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
      cancelDraftSave();
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
        const result = await ctx2.submitThroughNative(sent);
        clearDraft(sent.kind, sent.replyTo, sent.boardId);
        forgetActiveComposer();
        state2.composer = null;
        state2.writeBusy = false;
        showWriteFeedback(sent, result.postId);
        invalidateStructuredModel("board", result.pageHref);
        void ensureStructuredModel("board", result.pageHref, {
          reason: "successful-post",
          force: true
        });
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
      cancelDraftSave,
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
      visibleNativeElement,
      visibleNativeComposer,
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
    const storeStructuredEntry = (...args) => ctx2.storeStructuredEntry(...args);
    const readBoardFromDom = (...args) => ctx2.readBoardFromDom(...args);
    const mergeBoardPage = (...args) => ctx2.mergeBoardPage(...args);
    const scheduleRender = (...args) => ctx2.scheduleRender(...args);
    const recordTraffic = (...args) => ctx2.recordTraffic?.(...args);
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
      if (state2.nativeMode || document.visibilityState === "hidden" || state2.boardLoading || state2.boardEnd || routeType() !== "board") return;
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
            signal: state2.boardLoadAbort.signal,
            reason: "pagination"
          });
          model = entry.model;
          storeStructuredEntry(structuredCacheKey("board", targetHref), entry);
        } catch (structuredError) {
          if (structuredError?.name === "AbortError") throw structuredError;
          if (document.visibilityState === "hidden") {
            throw new DOMException("Document hidden", "AbortError");
          }
          recordTraffic("htmlFallbacks", "pagination");
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
      if (state2.nativeMode || document.visibilityState === "hidden" || routeType() !== "board" || !state2.scroller || state2.boardLoading || state2.boardEnd || state2.boardError || Date.now() < state2.boardAutoCooldownUntil) return;
      const remaining = state2.scroller.scrollHeight - state2.scroller.scrollTop - state2.scroller.clientHeight;
      if (remaining <= OLDER_TRIGGER_PX2) loadOlderPosts();
    }
    Object.assign(ctx2, {
      validatedOlderPage,
      loadOlderPosts,
      maybeLoadOlder
    });
  }

  // src/settings.js
  var DEFAULT_DISPLAY_SETTINGS = Object.freeze({
    showAvatars: true,
    avatarPosition: "inline",
    avatarSize: 40,
    avatarShape: "circle",
    replyMeta: "full"
  });
  var DEFAULT_FONT_SETTINGS = Object.freeze({
    family: "default",
    customFamily: "",
    size: 17
  });
  var DEFAULT_FAVORITES_SETTINGS = Object.freeze({
    sort: "activity",
    unreadMode: "count",
    fontFamily: "default",
    customFontFamily: "",
    fontSize: 17,
    spacing: 12
  });
  var FONT_FAMILIES = Object.freeze([
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
    { value: "custom", label: "Custom…", stack: "" }
  ]);
  var AVATAR_POSITIONS = /* @__PURE__ */ new Set(["inline", "left"]);
  var AVATAR_SHAPES = /* @__PURE__ */ new Set(["circle", "rounded", "square"]);
  var REPLY_META_MODES = /* @__PURE__ */ new Set(["full", "compact", "hidden"]);
  var FAVORITE_SORTS = /* @__PURE__ */ new Set(["activity", "alphabetical", "unread", "manual"]);
  var UNREAD_MODES = /* @__PURE__ */ new Set(["count", "heat", "both", "hidden"]);
  var MAX_CUSTOM_FAMILY_LENGTH = 160;
  var MIN_FONT_SIZE = 8;
  var MAX_FONT_SIZE = 72;
  function installSettings(ctx2) {
    const {
      DISPLAY_SETTINGS_KEY: DISPLAY_SETTINGS_KEY2,
      FAVORITES_ORDER_KEY: FAVORITES_ORDER_KEY2,
      FAVORITES_SETTINGS_KEY: FAVORITES_SETTINGS_KEY2,
      FONT_SETTINGS_KEY: FONT_SETTINGS_KEY2,
      gmGet: gmGet2,
      gmSet: gmSet2,
      state: state2
    } = ctx2;
    const scheduleRender = (...args) => ctx2.scheduleRender(...args);
    function loadSettings() {
      if (!state2.displaySettings) {
        const stored = safeStoredObject(gmGet2(DISPLAY_SETTINGS_KEY2, {}));
        state2.displaySettings = normalizeDisplaySettings(stored);
      }
      if (!state2.fontSettings) {
        const stored = safeStoredObject(gmGet2(FONT_SETTINGS_KEY2, {}));
        state2.fontSettings = normalizeFontSettings(stored);
      }
      if (!state2.favoritesSettings) {
        const stored = safeStoredObject(gmGet2(FAVORITES_SETTINGS_KEY2, {}));
        state2.favoritesSettings = normalizeFavoritesSettings(stored);
      }
      if (!state2.favoriteManualOrder) {
        state2.favoriteManualOrder = normalizeFavoriteOrder(
          gmGet2(FAVORITES_ORDER_KEY2, [])
        );
      }
      return {
        display: state2.displaySettings,
        favorites: state2.favoritesSettings,
        font: state2.fontSettings
      };
    }
    function safeStoredObject(value) {
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    }
    function normalizeDisplaySettings(value = {}) {
      return {
        showAvatars: value.showAvatars !== false,
        avatarPosition: AVATAR_POSITIONS.has(value.avatarPosition) ? value.avatarPosition : DEFAULT_DISPLAY_SETTINGS.avatarPosition,
        avatarSize: normalizeAvatarSize(value.avatarSize),
        avatarShape: AVATAR_SHAPES.has(value.avatarShape) ? value.avatarShape : DEFAULT_DISPLAY_SETTINGS.avatarShape,
        replyMeta: REPLY_META_MODES.has(value.replyMeta) ? value.replyMeta : DEFAULT_DISPLAY_SETTINGS.replyMeta
      };
    }
    function normalizeFontSettings(value = {}) {
      return {
        family: validFontFamily(value.family),
        customFamily: String(value.customFamily || "").slice(0, MAX_CUSTOM_FAMILY_LENGTH),
        size: normalizeFontSize(value.size)
      };
    }
    function normalizeFavoritesSettings(value = {}) {
      return {
        sort: FAVORITE_SORTS.has(value.sort) ? value.sort : DEFAULT_FAVORITES_SETTINGS.sort,
        unreadMode: UNREAD_MODES.has(value.unreadMode) ? value.unreadMode : DEFAULT_FAVORITES_SETTINGS.unreadMode,
        fontFamily: validFontFamily(value.fontFamily),
        customFontFamily: String(value.customFontFamily || "").slice(0, MAX_CUSTOM_FAMILY_LENGTH),
        fontSize: normalizeFontSize(value.fontSize),
        spacing: normalizeFavoriteSpacing(value.spacing)
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
      return [...state2.favoriteManualOrder];
    }
    function updateDisplaySettings(patch, { render = true } = {}) {
      state2.displaySettings = normalizeDisplaySettings({
        ...currentDisplaySettings(),
        ...patch
      });
      gmSet2(DISPLAY_SETTINGS_KEY2, state2.displaySettings);
      applyVisualSettings();
      if (render) {
        state2.currentSignature = "";
        scheduleRender({ force: true });
      }
    }
    function updateFontSettings(patch, { render = false } = {}) {
      state2.fontSettings = normalizeFontSettings({
        ...currentFontSettings(),
        ...patch
      });
      gmSet2(FONT_SETTINGS_KEY2, state2.fontSettings);
      applyVisualSettings();
      if (render) {
        state2.currentSignature = "";
        scheduleRender({ force: true });
      }
    }
    function updateFavoritesSettings(patch, { clubs = state2.favoriteSourceClubs, render = true } = {}) {
      state2.favoritesSettings = normalizeFavoritesSettings({
        ...currentFavoritesSettings(),
        ...patch
      });
      gmSet2(FAVORITES_SETTINGS_KEY2, state2.favoritesSettings);
      if (state2.favoritesSettings.sort === "manual" && !state2.favoriteManualOrder.length) {
        saveFavoriteOrder(clubs.map((club) => club.href));
      }
      if (state2.favoritesSettings.sort !== "manual") state2.editingFavoriteOrder = false;
      applyVisualSettings();
      if (render) {
        state2.currentSignature = "";
        scheduleRender({ force: true });
      }
    }
    function resetFavoritesAppearance() {
      updateFavoritesSettings({
        fontFamily: DEFAULT_FAVORITES_SETTINGS.fontFamily,
        customFontFamily: DEFAULT_FAVORITES_SETTINGS.customFontFamily,
        fontSize: DEFAULT_FAVORITES_SETTINGS.fontSize,
        spacing: DEFAULT_FAVORITES_SETTINGS.spacing
      });
    }
    function saveFavoriteOrder(order) {
      state2.favoriteManualOrder = normalizeFavoriteOrder(order);
      gmSet2(FAVORITES_ORDER_KEY2, state2.favoriteManualOrder);
    }
    function resetFavoriteOrder(clubs = state2.favoriteSourceClubs) {
      saveFavoriteOrder(clubs.map((club) => club.href));
      state2.currentSignature = "";
      scheduleRender({ force: true });
    }
    function sortFavorites(clubs) {
      const source = clubs.map((club) => ({ ...club }));
      const { sort } = currentFavoritesSettings();
      const collator = new Intl.Collator("cs", {
        numeric: true,
        sensitivity: "base"
      });
      if (sort === "alphabetical") {
        return source.sort((left, right) => collator.compare(left.name, right.name));
      }
      if (sort === "unread") {
        return source.sort((left, right) => right.unread - left.unread || collator.compare(left.name, right.name));
      }
      if (sort === "manual") {
        const available = new Set(source.map((club) => club.href));
        const known = currentFavoriteOrder().filter((href) => available.has(href));
        const knownSet = new Set(known);
        const appended = source.map((club) => club.href).filter((href) => !knownSet.has(href));
        const normalized = [...known, ...appended];
        if (normalized.length !== state2.favoriteManualOrder.length || normalized.some((href, index) => href !== state2.favoriteManualOrder[index])) saveFavoriteOrder(normalized);
        const positions = new Map(normalized.map((href, index) => [href, index]));
        return source.sort((left, right) => (positions.get(left.href) ?? Number.MAX_SAFE_INTEGER) - (positions.get(right.href) ?? Number.MAX_SAFE_INTEGER));
      }
      return source;
    }
    function unreadHeat(unread) {
      const count = Math.max(0, Number(unread) || 0);
      if (count === 0) return "";
      if (count <= 4) return "few";
      if (count <= 14) return "more";
      return "most";
    }
    function resetFontSettings() {
      state2.fontSettings = { ...DEFAULT_FONT_SETTINGS };
      gmSet2(FONT_SETTINGS_KEY2, state2.fontSettings);
      applyVisualSettings();
      state2.currentSignature = "";
      scheduleRender({ force: true });
    }
    function validFontFamily(value) {
      const candidate = String(value || "default");
      return FONT_FAMILIES.some((font) => font.value === candidate) ? candidate : DEFAULT_FONT_SETTINGS.family;
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
      const scroller = state2.scroller;
      if (!scroller) return;
      const display = currentDisplaySettings();
      const font = currentFontSettings();
      const favorites = currentFavoritesSettings();
      const stack = fontStack(font.family, font.customFamily);
      const favoriteStack = fontStack(favorites.fontFamily, favorites.customFontFamily);
      scroller.dataset.avatars = display.showAvatars ? "visible" : "hidden";
      scroller.dataset.avatarPosition = display.avatarPosition;
      scroller.dataset.avatarShape = display.avatarShape;
      scroller.style.setProperty("--post-avatar-size", `${display.avatarSize}px`);
      scroller.style.setProperty(
        "--post-avatar-font-size",
        `${Math.max(12, Math.round(display.avatarSize * 0.38))}px`
      );
      scroller.style.setProperty("--post-font-size", `${displayFontSize(font.size)}px`);
      if (stack) scroller.style.setProperty("--post-font-family", stack);
      else scroller.style.removeProperty("--post-font-family");
      scroller.style.setProperty("--favorite-font-size", `${displayFontSize(favorites.fontSize)}px`);
      scroller.style.setProperty("--favorite-row-padding", `${favorites.spacing}px`);
      if (favoriteStack) scroller.style.setProperty("--favorite-font-family", favoriteStack);
      else scroller.style.removeProperty("--favorite-font-family");
    }
    Object.assign(ctx2, {
      fontFamilies: FONT_FAMILIES,
      loadSettings,
      normalizeDisplaySettings,
      normalizeFontSettings,
      normalizeFavoritesSettings,
      normalizeFavoriteOrder,
      currentDisplaySettings,
      currentFontSettings,
      currentFavoritesSettings,
      currentFavoriteOrder,
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
      normalizeCustomFamily,
      applyVisualSettings
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
    const scheduleRender = (...args) => ctx2.scheduleRender(...args);
    const currentDisplaySettings = (...args) => ctx2.currentDisplaySettings(...args);
    const currentFontSettings = (...args) => ctx2.currentFontSettings(...args);
    const updateDisplaySettings = (...args) => ctx2.updateDisplaySettings(...args);
    const updateFontSettings = (...args) => ctx2.updateFontSettings(...args);
    const resetFontSettings = (...args) => ctx2.resetFontSettings(...args);
    const displayFontSize = (...args) => ctx2.displayFontSize(...args);
    const normalizeCustomFamily = (...args) => ctx2.normalizeCustomFamily(...args);
    const currentFavoritesSettings = (...args) => ctx2.currentFavoritesSettings(...args);
    const updateFavoritesSettings = (...args) => ctx2.updateFavoritesSettings(...args);
    const resetFavoritesAppearance = (...args) => ctx2.resetFavoritesAppearance(...args);
    const saveFavoriteOrder = (...args) => ctx2.saveFavoriteOrder(...args);
    const resetFavoriteOrder = (...args) => ctx2.resetFavoriteOrder(...args);
    const unreadHeat = (...args) => ctx2.unreadHeat(...args);
    const openThread = (...args) => ctx2.openThread(...args);
    const closeThread = (...args) => ctx2.closeThread(...args);
    const startBoardVisitFromFavorite = (...args) => ctx2.startBoardVisitFromFavorite(...args);
    function escapeHtml(value) {
      const div = document.createElement("div");
      div.textContent = value ?? "";
      return div.innerHTML;
    }
    function signatureFor(type, model) {
      if (type === "favorites") {
        return [
          routeKey(),
          JSON.stringify(currentFavoritesSettings()),
          state2.openHeaderPanel,
          state2.editingFavoriteOrder,
          model.length,
          model.map((club) => `${club.href}:${club.unread}:${club.activity}`).join(";")
        ].join("|");
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
        model.newPostIds.join(","),
        state2.openHeaderPanel,
        state2.openPostMenuId,
        JSON.stringify(currentDisplaySettings()),
        JSON.stringify(currentFontSettings()),
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
        ].join(":") : "",
        model.threadRootId
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
      const favorites = currentFavoritesSettings();
      const editing = favorites.sort === "manual" && state2.editingFavoriteOrder;
      const showCount = ["count", "both"].includes(favorites.unreadMode);
      const showHeat = ["heat", "both"].includes(favorites.unreadMode);
      const rows = clubs.length ? clubs.map((club) => {
        const heat = showHeat ? unreadHeat(club.unread) : "";
        const heatClass = heat ? ` favorite-row--heat-${heat}` : "";
        const unreadLabel = club.unread ? `${club.unread} nových příspěvků` : "bez nových příspěvků";
        return `
          <li
            class="favorite-item${editing ? " favorite-item--editing" : ""}"
            data-favorite-href="${escapeHtml(club.href)}"
          >
            <a
              class="favorite-row${heatClass}"
              href="${escapeHtml(club.href)}"
              data-native-href="${escapeHtml(club.href)}"
              data-board-id="${escapeHtml(club.id)}"
              data-unread-count="${escapeHtml(club.unread)}"
              aria-label="${escapeHtml(`${club.name}, ${unreadLabel}${club.activity ? `, ${club.activity}` : ""}`)}"
              ${editing ? 'aria-disabled="true"' : ""}
            >
              <span class="favorite-main">
                <span class="favorite-name">${escapeHtml(club.name)}</span>
                <span class="favorite-time">${escapeHtml(club.activity)}</span>
              </span>
              ${showCount && club.unread ? `<span class="favorite-unread" aria-hidden="true">${club.unread}</span>` : ""}
            </a>
            ${editing ? `
              <button
                class="favorite-drag-handle"
                type="button"
                aria-label="Přesunout ${escapeHtml(club.name)}"
                title="Přetáhnout"
              >
                <span aria-hidden="true">≡</span>
              </button>
            ` : ""}
          </li>
        `;
      }).join("") : `<li class="empty">Žádné oblíbené kluby.</li>`;
      return `
      <header class="topbar topbar--favorites">
        <h1 class="title title--brand">Bokoun</h1>
        ${favoritesControlMarkup()}
        ${fullButton()}
      </header>
      <ul class="favorites">${rows}</ul>
    `;
    }
    function favoritesControlMarkup() {
      const open = state2.openHeaderPanel === "favorites";
      return `
      <div class="header-control favorites-control">
        <button
          class="icon-button header-panel-toggle favorites-settings-toggle"
          type="button"
          data-action="favorites-panel"
          aria-label="Nastavení oblíbených"
          aria-expanded="${open ? "true" : "false"}"
        >${ICONS2.settings}</button>
        ${open ? favoritesPanelMarkup() : ""}
      </div>
    `;
    }
    function favoritesPanelMarkup() {
      const favorites = currentFavoritesSettings();
      const manual = favorites.sort === "manual";
      const customFont = favorites.fontFamily === "custom";
      const normalizedCustomFont = normalizeCustomFamily(favorites.customFontFamily);
      const invalidCustomFont = Boolean(favorites.customFontFamily.trim() && !normalizedCustomFont);
      return `
      <section class="header-panel favorites-panel" aria-label="Nastavení oblíbených">
        <header class="panel-head">
          <strong>Oblíbené</strong>
          <button type="button" data-action="close-header-panel" aria-label="Zavřít">×</button>
        </header>
        <label class="settings-field">
          <span>Řazení</span>
          <select data-setting="favorites-sort" aria-label="Řazení oblíbených">
            <option value="activity" ${favorites.sort === "activity" ? "selected" : ""}>Výchozí</option>
            <option value="alphabetical" ${favorites.sort === "alphabetical" ? "selected" : ""}>Abecedně</option>
            <option value="unread" ${favorites.sort === "unread" ? "selected" : ""}>Podle nových</option>
            <option value="manual" ${favorites.sort === "manual" ? "selected" : ""}>Ručně</option>
          </select>
        </label>
        <label class="settings-field">
          <span>Nové</span>
          <select data-setting="unread-mode" aria-label="Zobrazení nových příspěvků">
            <option value="count" ${favorites.unreadMode === "count" ? "selected" : ""}>Číslo</option>
            <option value="heat" ${favorites.unreadMode === "heat" ? "selected" : ""}>Barva</option>
            <option value="both" ${favorites.unreadMode === "both" ? "selected" : ""}>Číslo + barva</option>
            <option value="hidden" ${favorites.unreadMode === "hidden" ? "selected" : ""}>Skrýt</option>
          </select>
        </label>
        <div class="heat-legend" aria-label="Barevná stupnice nových příspěvků">
          <span><i class="heat-swatch heat-swatch--few"></i>1–4</span>
          <span><i class="heat-swatch heat-swatch--more"></i>5–14</span>
          <span><i class="heat-swatch heat-swatch--most"></i>15+</span>
        </div>
        <div class="panel-section-title">Vzhled</div>
        <label class="settings-field">
          <span>Písmo</span>
          <select data-setting="favorite-font-family" aria-label="Písmo oblíbených">${fontOptionsMarkup(favorites.fontFamily)}</select>
        </label>
        <label class="settings-field settings-field--custom" ${customFont ? "" : "hidden"}>
          <span>Vlastní</span>
          <span class="custom-font-wrap">
            <input
              type="text"
              maxlength="160"
              autocomplete="off"
              spellcheck="false"
              value="${escapeHtml(favorites.customFontFamily)}"
              aria-label="Vlastní písmo oblíbených"
              aria-invalid="${invalidCustomFont ? "true" : "false"}"
            >
            <small>${invalidCustomFont ? "Použijte jen názvy písem oddělené čárkami" : "Místní písma, oddělená čárkami"}</small>
          </span>
        </label>
        <div class="settings-field">
          <span>Velikost</span>
          <span class="font-size-controls">
            <input type="range" min="10" max="32" step="0.5" value="${escapeHtml(Math.min(32, Math.max(10, favorites.fontSize)))}" aria-label="Velikost písma oblíbených posuvníkem">
            <input type="number" min="8" max="72" step="0.5" inputmode="decimal" value="${escapeHtml(displayFontSize(favorites.fontSize))}" aria-label="Velikost písma oblíbených v pixelech">
            <span>px</span>
          </span>
        </div>
        <div class="settings-field">
          <span>Odsazení</span>
          <span class="compact-range-controls">
            <input type="range" min="0" max="24" step="1" value="${escapeHtml(favorites.spacing)}" aria-label="Svislé odsazení oblíbených posuvníkem">
            <output>${escapeHtml(favorites.spacing)} px</output>
          </span>
        </div>
        ${manual ? `
          <p class="settings-note">V režimu úprav přetahujte kluby za madlo. Odkazy jsou dočasně vypnuté.</p>
          <div class="panel-actions">
            <button type="button" data-action="toggle-favorite-edit">
              ${state2.editingFavoriteOrder ? "Hotovo" : "Upravit pořadí"}
            </button>
            <button type="button" data-action="reset-favorite-order">Obnovit pořadí</button>
          </div>
        ` : `
          <p class="settings-note">Výchozí zachovává pořadí Kapybary pro zvolenou kartu.</p>
        `}
        <div class="panel-actions">
          <button type="button" data-action="reset-favorites-appearance">Obnovit vzhled</button>
        </div>
      </section>
    `;
    }
    function setHeaderPanel(panel = "") {
      state2.openHeaderPanel = state2.openHeaderPanel === panel ? "" : panel;
      state2.openPostMenuId = "";
      state2.currentSignature = "";
      scheduleRender({ force: true });
    }
    function setPostMenu(postId = "") {
      state2.openPostMenuId = state2.openPostMenuId === String(postId) ? "" : String(postId);
      state2.openHeaderPanel = "";
      state2.currentSignature = "";
      scheduleRender({ force: true });
    }
    function fontControlMarkup() {
      const open = state2.openHeaderPanel === "font";
      return `
      <div class="header-control">
        <button
          class="font-toggle"
          type="button"
          data-action="font-panel"
          aria-label="Písmo příspěvků"
          aria-expanded="${open ? "true" : "false"}"
          title="Písmo příspěvků"
        >f</button>
        ${open ? fontPanelMarkup() : ""}
        ${state2.openHeaderPanel === "display" ? displayPanelMarkup() : ""}
      </div>
    `;
    }
    function fontPanelMarkup() {
      const font = currentFontSettings();
      const custom = font.family === "custom";
      const options = fontOptionsMarkup(font.family);
      const normalizedCustom = normalizeCustomFamily(font.customFamily);
      const invalidCustom = Boolean(font.customFamily.trim() && !normalizedCustom);
      return `
      <section class="header-panel font-panel" aria-label="Nastavení písma">
        <header class="panel-head">
          <strong>Písmo příspěvků</strong>
          <button type="button" data-action="close-header-panel" aria-label="Zavřít">×</button>
        </header>
        <label class="settings-field">
          <span>Písmo</span>
          <select data-setting="font-family" aria-label="Písmo příspěvků">${options}</select>
        </label>
        <label class="settings-field settings-field--custom" ${custom ? "" : "hidden"}>
          <span>Vlastní</span>
          <span class="custom-font-wrap">
            <input
              type="text"
              maxlength="160"
              autocomplete="off"
              spellcheck="false"
              value="${escapeHtml(font.customFamily)}"
              aria-label="Vlastní rodina písma"
              aria-invalid="${invalidCustom ? "true" : "false"}"
              placeholder='"Atkinson Hyperlegible", Arial, sans-serif'
            >
            <small>${invalidCustom ? "Použijte jen názvy písem oddělené čárkami" : "Místní písma, oddělená čárkami"}</small>
          </span>
        </label>
        <div class="settings-field">
          <span>Velikost</span>
          <span class="font-size-controls">
            <input type="range" min="10" max="32" step="0.5" value="${escapeHtml(Math.min(32, Math.max(10, font.size)))}" aria-label="Velikost písma posuvníkem">
            <input type="number" min="8" max="72" step="0.5" inputmode="decimal" value="${escapeHtml(displayFontSize(font.size))}" aria-label="Velikost písma v pixelech">
            <span>px</span>
          </span>
        </div>
        <div class="panel-actions">
          <button type="button" data-action="display-panel">Zobrazení…</button>
          <button type="button" data-action="reset-font">Obnovit</button>
        </div>
      </section>
    `;
    }
    function fontOptionsMarkup(selectedFamily) {
      return ctx2.fontFamilies.map(({ value, label, stack }) => `
      <option
        value="${escapeHtml(value)}"
        ${selectedFamily === value ? "selected" : ""}
        ${stack ? `style="font-family:${escapeHtml(stack)}"` : ""}
      >${escapeHtml(label)}</option>
    `).join("");
    }
    function displayPanelMarkup() {
      const display = currentDisplaySettings();
      return `
      <section class="header-panel display-panel" aria-label="Nastavení zobrazení">
        <header class="panel-head">
          <strong>Zobrazení příspěvků</strong>
          <button type="button" data-action="close-header-panel" aria-label="Zavřít">×</button>
        </header>
        <label class="settings-switch">
          <span>Zobrazovat avatary</span>
          <input
            type="checkbox"
            data-setting="show-avatars"
            ${display.showAvatars ? "checked" : ""}
          >
        </label>
        <label class="settings-field">
          <span>Tvar</span>
          <select data-setting="avatar-shape" aria-label="Tvar avataru" ${display.showAvatars ? "" : "disabled"}>
            <option value="circle" ${display.avatarShape === "circle" ? "selected" : ""}>Kruh</option>
            <option value="rounded" ${display.avatarShape === "rounded" ? "selected" : ""}>Zaoblený</option>
            <option value="square" ${display.avatarShape === "square" ? "selected" : ""}>Čtverec</option>
          </select>
        </label>
        <div class="settings-field">
          <span>Velikost</span>
          <span class="compact-range-controls">
            <input type="range" min="20" max="96" step="1" value="${escapeHtml(display.avatarSize)}" aria-label="Velikost avataru příspěvku posuvníkem" ${display.showAvatars ? "" : "disabled"}>
            <output>${escapeHtml(display.avatarSize)} px</output>
          </span>
        </div>
        <label class="settings-field">
          <span>Pozice</span>
          <select
            data-setting="avatar-position"
            aria-label="Pozice avataru"
            ${display.showAvatars ? "" : "disabled"}
          >
            <option value="inline" ${display.avatarPosition === "inline" ? "selected" : ""}>Malý u jména</option>
            <option value="left" ${display.avatarPosition === "left" ? "selected" : ""}>Vlevo od příspěvku</option>
          </select>
        </label>
        <label class="settings-field">
          <span>Reakce</span>
          <select data-setting="reply-meta" aria-label="Zobrazení odkazu na původní příspěvek">
            <option value="full" ${display.replyMeta === "full" ? "selected" : ""}>Jméno + čas</option>
            <option value="compact" ${display.replyMeta === "compact" ? "selected" : ""}>Jen jméno</option>
            <option value="hidden" ${display.replyMeta === "hidden" ? "selected" : ""}>Skrýt</option>
          </select>
        </label>
        <p class="settings-note">Kliknutí na avatar nebo jméno otevře nabídku příspěvku.</p>
        <div class="panel-actions">
          <button type="button" data-action="font-panel">← Písmo</button>
        </div>
      </section>
    `;
    }
    function avatarImageMarkup(post, className = "") {
      return post.avatarUrl ? `<img class="${className}" src="${escapeHtml(post.avatarUrl)}" alt="" loading="lazy" decoding="async">` : `<span class="${className} avatar-fallback" aria-hidden="true">${escapeHtml(post.author.slice(0, 1).toUpperCase())}</span>`;
    }
    function postMenuMarkup(post) {
      const threadRootId = post.rootId || post.id;
      return `
      <div class="post-menu" role="menu" aria-label="Akce příspěvku">
        <button
          type="button"
          role="menuitem"
          data-action="reply"
          data-post-id="${escapeHtml(post.id)}"
        >Odpovědět</button>
        ${threadRootId ? `
          <button
            type="button"
            role="menuitem"
            data-action="thread"
            data-root-id="${escapeHtml(threadRootId)}"
          >Vlákno</button>
        ` : ""}
      </div>
    `;
    }
    function replyMetaMarkup(post, display) {
      if (display.replyMeta === "hidden" || !post.replyReference) return "";
      const author = post.parentAuthor || post.replyReference.replace(/^Reakce na\s+/i, "").split(/,\s*\d{1,2}\./)[0] || "neznámý";
      const time = display.replyMeta === "full" && post.parentDate ? `<time>${escapeHtml(post.parentDate)}</time>` : "";
      const content = `<span class="reply-prefix">re:</span> <strong>${escapeHtml(author)}</strong>${time}`;
      return post.rootId ? `
        <button
          class="reply-reference"
          type="button"
          data-action="thread"
          data-root-id="${escapeHtml(post.rootId)}"
          aria-label="Zobrazit vlákno reakce na ${escapeHtml(author)}"
        >${content}</button>
      ` : `<div class="reply-reference">${content}</div>`;
    }
    function boardMarkup(board) {
      const display = currentDisplaySettings();
      const threadMode = Boolean(board.threadRootId);
      const replyingTo = state2.composer?.kind === "reply" ? state2.composer.replyTo : "";
      const newComposer = state2.composer?.kind === "new" ? composerMarkup() : "";
      const feedback = state2.writeFeedback?.boardId === currentBoardId() ? state2.writeFeedback : null;
      const newPostIds = new Set(board.newPostIds);
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
          display.showAvatars ? `post--avatar-${display.avatarPosition}` : "post--avatar-hidden",
          threadMode && post.id === board.threadRootId ? "post--thread-root" : "",
          threadMode && post.id !== board.threadRootId ? "post--thread-reply" : "",
          !threadMode && newPostIds.has(post.id) ? "post--visit-new" : "",
          replyTarget ? "post--reply-target" : "",
          justSent ? "post--just-sent" : "",
          replyContext ? "post--reply-context" : ""
        ].filter(Boolean).join(" ");
        const menuOpen = state2.openPostMenuId === post.id;
        const leftAvatar = display.showAvatars && display.avatarPosition === "left" ? `
            <button
              class="post-avatar-trigger post-menu-trigger"
              type="button"
              data-action="post-menu"
              data-post-id="${escapeHtml(post.id)}"
              aria-label="Nabídka příspěvku od ${escapeHtml(post.author)}"
              aria-haspopup="menu"
              aria-expanded="${menuOpen ? "true" : "false"}"
            >${avatarImageMarkup(post, "post-avatar post-avatar--left")}</button>
          ` : "";
        const inlineAvatar = display.showAvatars && display.avatarPosition === "inline" ? avatarImageMarkup(post, "post-avatar post-avatar--inline") : "";
        return `
          <article
            class="${postClasses}"
            data-bokoun-post-id="${escapeHtml(post.id)}"
            ${threadMode ? `data-thread-depth="${escapeHtml(post.depth)}"` : ""}
          >
            <div class="post-layout">
              ${leftAvatar}
              <div class="post-content">
                <header class="post-header">
                  <button
                    class="post-author post-menu-trigger"
                    type="button"
                    data-action="post-menu"
                    data-post-id="${escapeHtml(post.id)}"
                    aria-haspopup="menu"
                    aria-expanded="${menuOpen ? "true" : "false"}"
                  >${inlineAvatar}<span>${escapeHtml(post.author)}</span></button>
                  <time class="post-date" ${post.datetime ? `datetime="${escapeHtml(post.datetime)}"` : ""}>${escapeHtml(post.date)}</time>
                  ${menuOpen ? postMenuMarkup(post) : ""}
                </header>
                <div class="post-body">${post.bodyHtml}</div>
                ${replyMetaMarkup(post, display)}
                ${replyTarget ? composerMarkup() : ""}
              </div>
            </div>
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
        tailState = `<div class="tail-end">${threadMode ? "Celé vlákno." : board.retentionLimited ? `Načteno posledních ${escapeHtml(board.posts.length)} příspěvků.` : "Začátek klubu."}</div>`;
      } else {
        tailState = '<button class="tail-action" type="button" data-action="load-older">Načíst starší</button>';
      }
      const newest = !threadMode && board.loadedPageCount > 1 ? '<button class="tail-action tail-action--accent" type="button" data-action="newest">↑ Nejnovější</button>' : "";
      return `
      <header class="topbar topbar--board">
        <button
          class="icon-button"
          type="button"
          data-action="${threadMode ? "thread-back" : "back"}"
          aria-label="${threadMode ? "Zpět do klubu" : "Zpět do oblíbených"}"
        >${ICONS2.back}</button>
        <h1 class="title">${escapeHtml(board.title)}</h1>
        ${fontControlMarkup()}
        <button class="icon-button" type="button" data-action="compose" aria-label="Napsat příspěvek">${ICONS2.write}</button>
        ${fullButton()}
      </header>
      ${threadMode ? `<div class="thread-banner" role="status">Vlákno · ${board.threadCount} příspěvků</div>` : ""}
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
      state2.shadow.querySelector("[data-action='thread-back']")?.addEventListener("click", closeThread);
      state2.shadow.querySelector("[data-action='compose']")?.addEventListener("click", () => openComposer("new"));
      state2.shadow.querySelector("[data-action='favorites-panel']")?.addEventListener("click", () => {
        setHeaderPanel("favorites");
      });
      const fontToggle = state2.shadow.querySelector(".font-toggle");
      fontToggle?.addEventListener("click", (event) => {
        if (Date.now() < state2.suppressFontClickUntil) {
          event.preventDefault();
          return;
        }
        setHeaderPanel("font");
      });
      fontToggle?.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        setHeaderPanel("display");
      });
      if (fontToggle) {
        let longPressTimer = 0;
        let start = null;
        const cancelLongPress = () => {
          window.clearTimeout(longPressTimer);
          longPressTimer = 0;
          start = null;
        };
        fontToggle.addEventListener("pointerdown", (event) => {
          if (event.button !== 0 || event.pointerType === "mouse") return;
          cancelLongPress();
          start = { x: event.clientX, y: event.clientY };
          longPressTimer = window.setTimeout(() => {
            state2.suppressFontClickUntil = Date.now() + 800;
            setHeaderPanel("display");
          }, 520);
        });
        fontToggle.addEventListener("pointermove", (event) => {
          if (!start) return;
          if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10) cancelLongPress();
        });
        fontToggle.addEventListener("pointerup", cancelLongPress);
        fontToggle.addEventListener("pointercancel", cancelLongPress);
      }
      state2.shadow.querySelectorAll("[data-action='font-panel']").forEach((button) => {
        if (button === fontToggle) return;
        button.addEventListener("click", () => setHeaderPanel("font"));
      });
      state2.shadow.querySelector("[data-action='display-panel']")?.addEventListener("click", () => setHeaderPanel("display"));
      state2.shadow.querySelector("[data-action='close-header-panel']")?.addEventListener("click", () => setHeaderPanel(""));
      state2.shadow.querySelector("[data-action='reset-font']")?.addEventListener("click", resetFontSettings);
      state2.shadow.querySelector("[data-setting='font-family']")?.addEventListener("change", (event) => {
        updateFontSettings({ family: event.currentTarget.value }, { render: true });
      });
      state2.shadow.querySelector("[aria-label='Vlastní rodina písma']")?.addEventListener("input", (event) => {
        updateFontSettings({ customFamily: event.currentTarget.value });
        const normalized = normalizeCustomFamily(event.currentTarget.value);
        const invalid = Boolean(event.currentTarget.value.trim() && !normalized);
        event.currentTarget.setAttribute("aria-invalid", invalid ? "true" : "false");
        const hint = event.currentTarget.parentElement?.querySelector("small");
        if (hint) {
          hint.textContent = invalid ? "Použijte jen názvy písem oddělené čárkami" : "Místní písma, oddělená čárkami";
        }
      });
      const fontRange = state2.shadow.querySelector("[aria-label='Velikost písma posuvníkem']");
      const fontNumber = state2.shadow.querySelector("[aria-label='Velikost písma v pixelech']");
      fontRange?.addEventListener("input", (event) => {
        updateFontSettings({ size: event.currentTarget.value });
        if (fontNumber) fontNumber.value = displayFontSize(event.currentTarget.value);
      });
      fontNumber?.addEventListener("input", (event) => {
        if (event.currentTarget.value === "") return;
        updateFontSettings({ size: event.currentTarget.value });
        if (fontRange) {
          fontRange.value = String(Math.min(32, Math.max(10, Number(event.currentTarget.value))));
        }
      });
      fontNumber?.addEventListener("change", (event) => {
        updateFontSettings({ size: event.currentTarget.value }, { render: true });
      });
      state2.shadow.querySelector("[data-setting='show-avatars']")?.addEventListener("change", (event) => {
        updateDisplaySettings({ showAvatars: event.currentTarget.checked });
      });
      state2.shadow.querySelector("[data-setting='avatar-position']")?.addEventListener("change", (event) => {
        updateDisplaySettings({ avatarPosition: event.currentTarget.value });
      });
      state2.shadow.querySelector("[data-setting='avatar-shape']")?.addEventListener("change", (event) => {
        updateDisplaySettings({ avatarShape: event.currentTarget.value });
      });
      const postAvatarRange = state2.shadow.querySelector("[aria-label='Velikost avataru příspěvku posuvníkem']");
      postAvatarRange?.addEventListener("input", (event) => {
        updateDisplaySettings({ avatarSize: event.currentTarget.value }, { render: false });
        const output = event.currentTarget.parentElement?.querySelector("output");
        if (output) output.textContent = `${event.currentTarget.value} px`;
      });
      postAvatarRange?.addEventListener("change", (event) => {
        updateDisplaySettings({ avatarSize: event.currentTarget.value });
      });
      state2.shadow.querySelector("[data-setting='reply-meta']")?.addEventListener("change", (event) => {
        updateDisplaySettings({ replyMeta: event.currentTarget.value });
      });
      state2.shadow.querySelector("[data-setting='favorites-sort']")?.addEventListener("change", (event) => {
        updateFavoritesSettings(
          { sort: event.currentTarget.value },
          { clubs: state2.favoriteSourceClubs }
        );
      });
      state2.shadow.querySelector("[data-setting='unread-mode']")?.addEventListener("change", (event) => {
        updateFavoritesSettings({ unreadMode: event.currentTarget.value });
      });
      state2.shadow.querySelector("[data-setting='favorite-font-family']")?.addEventListener("change", (event) => {
        updateFavoritesSettings({ fontFamily: event.currentTarget.value });
      });
      state2.shadow.querySelector("[aria-label='Vlastní písmo oblíbených']")?.addEventListener("input", (event) => {
        updateFavoritesSettings(
          { customFontFamily: event.currentTarget.value },
          { render: false }
        );
        const normalized = normalizeCustomFamily(event.currentTarget.value);
        const invalid = Boolean(event.currentTarget.value.trim() && !normalized);
        event.currentTarget.setAttribute("aria-invalid", invalid ? "true" : "false");
        const hint = event.currentTarget.parentElement?.querySelector("small");
        if (hint) hint.textContent = invalid ? "Použijte jen názvy písem oddělené čárkami" : "Místní písma, oddělená čárkami";
      });
      const favoriteFontRange = state2.shadow.querySelector("[aria-label='Velikost písma oblíbených posuvníkem']");
      const favoriteFontNumber = state2.shadow.querySelector("[aria-label='Velikost písma oblíbených v pixelech']");
      favoriteFontRange?.addEventListener("input", (event) => {
        updateFavoritesSettings({ fontSize: event.currentTarget.value }, { render: false });
        if (favoriteFontNumber) favoriteFontNumber.value = displayFontSize(event.currentTarget.value);
      });
      favoriteFontNumber?.addEventListener("input", (event) => {
        if (event.currentTarget.value === "") return;
        updateFavoritesSettings({ fontSize: event.currentTarget.value }, { render: false });
        if (favoriteFontRange) favoriteFontRange.value = String(
          Math.min(32, Math.max(10, Number(event.currentTarget.value)))
        );
      });
      favoriteFontNumber?.addEventListener("change", (event) => {
        updateFavoritesSettings({ fontSize: event.currentTarget.value });
      });
      const favoriteSpacingRange = state2.shadow.querySelector("[aria-label='Svislé odsazení oblíbených posuvníkem']");
      favoriteSpacingRange?.addEventListener("input", (event) => {
        updateFavoritesSettings({ spacing: event.currentTarget.value }, { render: false });
        const output = event.currentTarget.parentElement?.querySelector("output");
        if (output) output.textContent = `${event.currentTarget.value} px`;
      });
      favoriteSpacingRange?.addEventListener("change", (event) => {
        updateFavoritesSettings({ spacing: event.currentTarget.value });
      });
      state2.shadow.querySelector("[data-action='reset-favorites-appearance']")?.addEventListener("click", resetFavoritesAppearance);
      state2.shadow.querySelector("[data-action='toggle-favorite-edit']")?.addEventListener("click", () => {
        const enteringEditMode = !state2.editingFavoriteOrder;
        state2.editingFavoriteOrder = enteringEditMode;
        if (enteringEditMode) state2.openHeaderPanel = "";
        state2.currentSignature = "";
        scheduleRender({ force: true });
      });
      state2.shadow.querySelector("[data-action='reset-favorite-order']")?.addEventListener("click", () => {
        resetFavoriteOrder(state2.favoriteSourceClubs);
      });
      for (const button of state2.shadow.querySelectorAll("[data-action='post-menu']")) {
        button.addEventListener("click", () => setPostMenu(button.dataset.postId));
      }
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
        button.addEventListener("click", () => {
          state2.openPostMenuId = "";
          openComposer("reply", button.dataset.postId);
        });
      }
      for (const button of state2.shadow.querySelectorAll("[data-action='thread']")) {
        button.addEventListener("click", () => openThread(button.dataset.rootId));
      }
      for (const link of state2.shadow.querySelectorAll("[data-native-href]")) {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          if (state2.editingFavoriteOrder && link.closest(".favorite-item")) return;
          const href = link.getAttribute("data-native-href");
          if (link.closest(".favorite-item")) {
            startBoardVisitFromFavorite(
              href,
              link.dataset.unreadCount,
              link.dataset.boardId
            );
          }
          navigateNative(href);
        });
      }
      attachFavoriteReordering();
      const inner = state2.shadow.querySelector(".app-inner");
      inner.onpointerdown = (event) => {
        if (state2.openPostMenuId && !event.target.closest(".post-menu, .post-menu-trigger")) setPostMenu("");
        if (state2.openHeaderPanel && !event.target.closest(".header-panel, .header-panel-toggle, .font-toggle")) setHeaderPanel("");
      };
      state2.shadow.onkeydown = (event) => {
        if (event.key !== "Escape") return;
        if (state2.openPostMenuId) setPostMenu("");
        else if (state2.openHeaderPanel) setHeaderPanel("");
      };
    }
    function attachFavoriteReordering() {
      if (!state2.editingFavoriteOrder) return;
      const list = state2.shadow.querySelector(".favorites");
      if (!list) return;
      let dragged = null;
      let pointerId = null;
      const finish = (event) => {
        if (!dragged || event && event.pointerId !== pointerId) return;
        dragged.classList.remove("favorite-item--dragging");
        list.classList.remove("favorites--dragging");
        saveFavoriteOrder(
          [...list.querySelectorAll("[data-favorite-href]")].map((item) => item.dataset.favoriteHref)
        );
        if (pointerId !== null && list.hasPointerCapture(pointerId)) {
          list.releasePointerCapture(pointerId);
        }
        dragged = null;
        pointerId = null;
      };
      list.addEventListener("pointermove", (event) => {
        if (!dragged || event.pointerId !== pointerId) return;
        event.preventDefault();
        const scrollerRect = state2.scroller?.getBoundingClientRect();
        if (scrollerRect && event.clientY < scrollerRect.top + 90) {
          state2.scroller.scrollBy({ top: -14, behavior: "auto" });
        } else if (scrollerRect && event.clientY > scrollerRect.bottom - 70) {
          state2.scroller.scrollBy({ top: 14, behavior: "auto" });
        }
        const rows = [...list.querySelectorAll(".favorite-item")].filter((item) => item !== dragged);
        const target = rows.find((item) => event.clientY < item.getBoundingClientRect().top + item.getBoundingClientRect().height / 2);
        if (target && target !== dragged.nextElementSibling) target.before(dragged);
        else if (!target && dragged !== list.lastElementChild) list.append(dragged);
      });
      list.addEventListener("pointerup", finish);
      list.addEventListener("pointercancel", finish);
      list.addEventListener("lostpointercapture", finish);
      for (const handle of list.querySelectorAll(".favorite-drag-handle")) {
        handle.addEventListener("pointerdown", (event) => {
          if (event.button !== 0) return;
          event.preventDefault();
          dragged = handle.closest(".favorite-item");
          if (!dragged) return;
          pointerId = event.pointerId;
          list.setPointerCapture(pointerId);
          dragged.classList.add("favorite-item--dragging");
          list.classList.add("favorites--dragging");
        });
      }
    }
    Object.assign(ctx2, {
      escapeHtml,
      signatureFor,
      fullButton,
      favoritesMarkup,
      favoritesControlMarkup,
      favoritesPanelMarkup,
      boardMarkup,
      composerMarkup,
      attachUiEvents,
      setHeaderPanel,
      setPostMenu,
      fontControlMarkup,
      fontPanelMarkup,
      displayPanelMarkup,
      avatarImageMarkup,
      postMenuMarkup,
      replyMetaMarkup,
      attachFavoriteReordering
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
    const leaveBoardVisit = (...args) => ctx2.leaveBoardVisit(...args);
    function navigateNative(href) {
      if (!href) return;
      saveScroll();
      const target = new URL(href, location.origin);
      if (routeType() === "board" && target.pathname !== location.pathname) {
        leaveBoardVisit(location.pathname);
      }
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
      navigateNative("/fav/activity");
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
      openThread,
      closeThread,
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
      ROUTE_FALLBACK_POLL_MS: ROUTE_FALLBACK_POLL_MS2,
      ROUTE_DATA_FALLBACK_MS: ROUTE_DATA_FALLBACK_MS2,
      STRUCTURED_RESUME_MS: STRUCTURED_RESUME_MS2,
      SESSION_DISABLED_KEY: SESSION_DISABLED_KEY2,
      SELECTORS: SELECTORS2,
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
    const ensureStructuredModel = (...args) => ctx2.ensureStructuredModel(...args);
    const abortStructuredRequests = (...args) => ctx2.abortStructuredRequests(...args);
    const invalidateStructuredModel = (...args) => ctx2.invalidateStructuredModel(...args);
    const trafficSnapshot = (...args) => ctx2.trafficSnapshot(...args);
    const resetTrafficCounters = (...args) => ctx2.resetTrafficCounters(...args);
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
    const applyVisualSettings = (...args) => ctx2.applyVisualSettings(...args);
    const sortFavorites = (...args) => ctx2.sortFavorites(...args);
    const boardRouteIdentity = (...args) => ctx2.boardRouteIdentity(...args);
    const navigateNative = (...args) => ctx2.navigateNative(...args);
    const leaveBoardVisit = (...args) => ctx2.leaveBoardVisit(...args);
    const readBoardVisit = (...args) => ctx2.readBoardVisit(...args);
    const reconcileFavoriteReadState = (...args) => ctx2.reconcileFavoriteReadState(...args);
    const syncBoardVisitRead = (...args) => ctx2.syncBoardVisitRead(...args);
    function requestStructuredRefresh(reason, { force = false } = {}) {
      const type = routeType();
      const key = routeKey();
      if (type === "unsupported") return Promise.resolve(null);
      return ensureStructuredModel(type, key, { reason, force });
    }
    function exposeDebugTools() {
      if (typeof window === "undefined") return;
      Object.defineProperty(window, "__bokounDebug", {
        configurable: true,
        value: Object.freeze({
          snapshot: () => trafficSnapshot(),
          reset: () => resetTrafficCounters(),
          refresh: () => requestStructuredRefresh("manual-refresh", { force: true }),
          measure: () => measureRenderScale()
        })
      });
    }
    function measureRenderScale() {
      const measurements = [];
      for (const count of [100, 500, 1e3]) {
        const posts = Array.from({ length: count }, (_, index) => ({
          id: String(index + 1),
          author: `reader-${index % 12}`,
          avatarUrl: "",
          date: "28.7.2026 12:00:00",
          datetime: "2026-07-28T03:00:00.000Z",
          rootId: "",
          depth: 0,
          bodyHtml: `<p>Kontrolní příspěvek ${index + 1}</p>`,
          replyReference: ""
        }));
        const model = {
          title: "Bokoun render scale",
          posts,
          threadRootId: "",
          threadCount: posts.length,
          newPostIds: [],
          nextOlderHref: "",
          loading: false,
          end: true,
          retentionLimited: count >= 1e3,
          loadedPageCount: Math.ceil(count / 20)
        };
        const startedAt = performance.now();
        const template = document.createElement("template");
        template.innerHTML = boardMarkup(model);
        const durationMs = performance.now() - startedAt;
        measurements.push(Object.freeze({
          posts: count,
          renderedPosts: template.content.querySelectorAll("article.post").length,
          durationMs: Math.round(durationMs * 10) / 10
        }));
      }
      return Object.freeze(measurements);
    }
    function finalizeBoardVisitTransition(previousKey, nextKey) {
      try {
        const previous = new URL(previousKey, location.origin);
        const next = new URL(nextKey, location.origin);
        if (routeType(previous.pathname) === "board" && previous.pathname !== next.pathname) leaveBoardVisit(previous.pathname);
      } catch {
      }
    }
    function finalizeStoredBoardVisit(nextKey = routeKey()) {
      const visit = readBoardVisit();
      if (!visit?.boardPath) return;
      try {
        const next = new URL(nextKey, location.origin);
        if (next.pathname !== visit.boardPath) leaveBoardVisit(visit.boardPath);
      } catch {
      }
    }
    function render({ force = false } = {}) {
      if (state2.disabled || state2.nativeMode) return;
      const previousKey = state2.currentRouteKey;
      const key = routeKey();
      finalizeBoardVisitTransition(previousKey, key);
      const type = routeType();
      if (type === "unsupported" || !isMobileEligible()) {
        revealNative();
        return;
      }
      if (type === "favorites" && location.pathname !== "/fav/activity") {
        navigateNative("/fav/activity");
        return;
      }
      if (!state2.host?.isConnected) mountShell();
      applyVisualSettings();
      const structuredRouteModel = cachedStructuredModel(type, key);
      if (!structuredRouteModel && !nativeReady(type)) return;
      const previousY = state2.scroller?.scrollTop || 0;
      let model;
      let readSource = "dom";
      if (type === "favorites") {
        model = structuredRouteModel;
        if (model) readSource = "structured";
        else model = readFavoritesFromDom();
        model = reconcileFavoriteReadState(model);
        state2.favoriteSourceClubs = model.map((club) => ({ ...club }));
        model = sortFavorites(model);
        state2.favoriteViewClubs = model.map((club) => ({ ...club }));
      } else {
        const structuredModel = structuredRouteModel;
        const nativeModel = structuredModel || readBoardFromDom(document, key);
        const structured = Boolean(structuredModel);
        if (structured) readSource = "structured";
        if (state2.boardKey !== boardRouteIdentity(key)) {
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
      if (key === state2.currentRouteKey) return;
      finalizeBoardVisitTransition(state2.currentRouteKey, key);
      saveScroll();
      state2.currentSignature = "";
      state2.openHeaderPanel = "";
      state2.openPostMenuId = "";
      state2.editingFavoriteOrder = false;
      clearTimeout(state2.routeFallbackTimer);
      if (routeType() === "unsupported" || !isMobileEligible()) {
        state2.currentRouteKey = key;
        revealNative();
        return;
      }
      state2.currentRouteKey = key;
      const type = routeType();
      abortStructuredRequests();
      invalidateStructuredModel(type, key);
      if (!state2.host?.isConnected) mountShell();
      state2.shadow.querySelector(".app-inner").innerHTML = '<div class="loading" aria-label="Načítám"></div>';
      state2.routeFallbackTimer = window.setTimeout(() => {
        if (state2.currentRouteKey === key && !nativeReady(type) && !cachedStructuredModel(type, key)) {
          void requestStructuredRefresh("route-transition");
        }
      }, ROUTE_DATA_FALLBACK_MS2);
      scheduleRender({ force: true });
    }
    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        state2.hiddenAt = Date.now();
        persistComposerDraft();
        saveScroll();
        state2.boardLoadAbort?.abort();
        suspendNativeObservation();
        if (routeType() === "board") void syncBoardVisitRead();
        return;
      }
      const hiddenFor = state2.hiddenAt ? Date.now() - state2.hiddenAt : 0;
      state2.hiddenAt = 0;
      resumeNativeObservation();
      handleRouteChange();
      if (state2.disabled || state2.nativeMode || hiddenFor < STRUCTURED_RESUME_MS2) return;
      void requestStructuredRefresh("visibility-resume");
    }
    function nativeObservationRoot() {
      const anchor = document.querySelector(
        `${SELECTORS2.favoritesPage}, ${SELECTORS2.boardHeader}`
      );
      if (!anchor) return null;
      let root = anchor;
      while (root.parentElement && root.parentElement !== document.body) {
        root = root.parentElement;
      }
      return root === state2.host ? null : root;
    }
    function connectNativeObserver() {
      if (!state2.observer || document.visibilityState === "hidden") return;
      state2.observer.disconnect();
      state2.observer.observe(document.body, { childList: true });
      const root = nativeObservationRoot();
      state2.observedNativeRoot = root;
      if (root && root !== document.body) {
        state2.observer.observe(root, { childList: true, subtree: true });
      }
    }
    function startRouteFallback() {
      clearInterval(state2.routeTimer);
      if (document.visibilityState === "hidden") return;
      state2.routeTimer = window.setInterval(handleRouteChange, ROUTE_FALLBACK_POLL_MS2);
    }
    function suspendNativeObservation() {
      clearInterval(state2.routeTimer);
      state2.routeTimer = 0;
      state2.observer?.disconnect();
      state2.observedNativeRoot = null;
    }
    function resumeNativeObservation() {
      if (!state2.observing || state2.disabled || state2.nativeMode) return;
      connectNativeObserver();
      startRouteFallback();
    }
    function queueRouteCheck() {
      clearTimeout(state2.routeEventTimer);
      state2.routeEventTimer = window.setTimeout(handleRouteChange, 0);
    }
    function patchHistoryNavigation() {
      if (state2.patchedPushState || state2.patchedReplaceState) return;
      state2.originalPushState = history.pushState;
      state2.originalReplaceState = history.replaceState;
      state2.patchedPushState = function bokounPushState(...args) {
        const result = state2.originalPushState.apply(this, args);
        queueRouteCheck();
        return result;
      };
      state2.patchedReplaceState = function bokounReplaceState(...args) {
        const result = state2.originalReplaceState.apply(this, args);
        queueRouteCheck();
        return result;
      };
      history.pushState = state2.patchedPushState;
      history.replaceState = state2.patchedReplaceState;
    }
    function restoreHistoryNavigation() {
      if (history.pushState === state2.patchedPushState && state2.originalPushState) {
        history.pushState = state2.originalPushState;
      }
      if (history.replaceState === state2.patchedReplaceState && state2.originalReplaceState) {
        history.replaceState = state2.originalReplaceState;
      }
      state2.originalPushState = null;
      state2.originalReplaceState = null;
      state2.patchedPushState = null;
      state2.patchedReplaceState = null;
    }
    function handlePageHide() {
      persistComposerDraft();
      saveScroll();
      if (routeType() === "board") void syncBoardVisitRead();
    }
    function observeNative() {
      if (state2.observing) return;
      state2.observer = new MutationObserver((records) => {
        if (!state2.observedNativeRoot?.isConnected || records.some((record) => record.target === document.body)) connectNativeObserver();
        scheduleRender();
      });
      state2.popStateHandler = queueRouteCheck;
      state2.hashChangeHandler = queueRouteCheck;
      state2.pageHideHandler = handlePageHide;
      patchHistoryNavigation();
      window.addEventListener("popstate", state2.popStateHandler);
      window.addEventListener("hashchange", state2.hashChangeHandler);
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("pagehide", state2.pageHideHandler);
      state2.observing = true;
      resumeNativeObservation();
    }
    function stopRouteObservation() {
      suspendNativeObservation();
      clearTimeout(state2.routeEventTimer);
      state2.routeEventTimer = 0;
      if (state2.popStateHandler) {
        window.removeEventListener("popstate", state2.popStateHandler);
      }
      if (state2.hashChangeHandler) {
        window.removeEventListener("hashchange", state2.hashChangeHandler);
      }
      if (state2.pageHideHandler) {
        window.removeEventListener("pagehide", state2.pageHideHandler);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      restoreHistoryNavigation();
      state2.observer = null;
      state2.popStateHandler = null;
      state2.hashChangeHandler = null;
      state2.pageHideHandler = null;
      state2.observing = false;
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
      finalizeStoredBoardVisit();
      state2.currentRouteKey = routeKey();
      observeNative();
      exposeDebugTools();
      void requestStructuredRefresh("initial-route");
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
      finalizeBoardVisitTransition,
      finalizeStoredBoardVisit,
      scheduleRender,
      handleRouteChange,
      handleVisibilityChange,
      nativeObservationRoot,
      connectNativeObserver,
      startRouteFallback,
      suspendNativeObservation,
      resumeNativeObservation,
      queueRouteCheck,
      patchHistoryNavigation,
      restoreHistoryNavigation,
      handlePageHide,
      requestStructuredRefresh,
      exposeDebugTools,
      measureRenderScale,
      observeNative,
      stopRouteObservation,
      boot
    });
  }

  // src/main.js
  var ctx = { ...runtime_exports };
  installShell(ctx);
  installAdapters(ctx);
  installReadSync(ctx);
  installBoardState(ctx);
  installWriting(ctx);
  installPagination(ctx);
  installSettings(ctx);
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
