// ==UserScript==
// @name         Bokoun
// @namespace    https://github.com/hanenashi/bokoun
// @version      0.9.3
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
    COMPARE_HOST_ID: () => COMPARE_HOST_ID,
    COMPOSER_TIMEOUT_MS: () => COMPOSER_TIMEOUT_MS,
    DISPLAY_SETTINGS_KEY: () => DISPLAY_SETTINGS_KEY,
    DRAFTS_KEY: () => DRAFTS_KEY,
    DRAFT_LIMIT: () => DRAFT_LIMIT,
    DRAFT_SAVE_DELAY_MS: () => DRAFT_SAVE_DELAY_MS,
    FAVORITES_ORDER_KEY: () => FAVORITES_ORDER_KEY,
    FAVORITES_REFRESH_MS: () => FAVORITES_REFRESH_MS,
    FAVORITES_SETTINGS_KEY: () => FAVORITES_SETTINGS_KEY,
    FONT_SETTINGS_KEY: () => FONT_SETTINGS_KEY,
    HOST_ID: () => HOST_ID,
    ICONS: () => ICONS,
    MOBILE_QUERY: () => MOBILE_QUERY,
    NAVIGATION_INTENT_KEY: () => NAVIGATION_INTENT_KEY,
    OLDER_TRIGGER_PX: () => OLDER_TRIGGER_PX,
    PAGE_LOAD_TIMEOUT_MS: () => PAGE_LOAD_TIMEOUT_MS,
    POST_CONFIRM_TIMEOUT_MS: () => POST_CONFIRM_TIMEOUT_MS,
    PREF_ENABLED_KEY: () => PREF_ENABLED_KEY,
    READ_SYNC_BACKOFF_BASE_MS: () => READ_SYNC_BACKOFF_BASE_MS,
    READ_SYNC_BACKOFF_MAX_MS: () => READ_SYNC_BACKOFF_MAX_MS,
    READ_SYNC_MIN_INTERVAL_MS: () => READ_SYNC_MIN_INTERVAL_MS,
    READ_SYNC_STATE_KEY: () => READ_SYNC_STATE_KEY,
    RECENT_CLUBS_KEY: () => RECENT_CLUBS_KEY,
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

  .route-content[data-route-pending="true"] {
    pointer-events: none;
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
    grid-template-columns: 44px minmax(0, 1fr) 44px 44px 44px;
    padding-left: 4px;
    padding-right: 0;
  }

  .topbar--favorites {
    grid-template-columns: minmax(0, 1fr) 44px 44px;
    padding-right: 0;
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

  .icon-button {
    min-width: 44px;
    min-height: 44px;
    border: 0;
    background: transparent;
    cursor: pointer;
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

  .mode-switch span {
    color: var(--accent);
    font-size: 22px;
    font-weight: 650;
    line-height: 1;
  }

  .overflow-toggle span {
    font-size: 26px;
    line-height: 1;
  }

  .mode-switch:hover,
  .mode-switch:focus-visible,
  .overflow-toggle:hover,
  .overflow-toggle:focus-visible,
  .overflow-toggle[aria-expanded="true"] {
    background: color-mix(in srgb, var(--accent) 12%, transparent);
    outline: none;
  }

  .favorites {
    margin: 0;
    padding: 0 16px max(24px, env(safe-area-inset-bottom));
    font-family: var(--favorite-font-family, inherit);
    list-style: none;
  }

  .route-content {
    min-width: 0;
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

  .favorite-row--unread .favorite-name {
    color: var(--accent);
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
    padding: var(--post-spacing, 14px) 16px calc(var(--post-spacing, 14px) + 2px);
    border-bottom: 1px solid #c7cfdb;
    background: #edf4ff;
    scroll-margin-top: calc(var(--header-height) + env(safe-area-inset-top) + 56px);
  }

  .app[data-post-separators="hidden"] .post {
    border-bottom-color: transparent;
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
    width: 44px;
    height: 44px;
    place-items: center;
  }

  .header-panel {
    position: absolute;
    top: 44px;
    right: 0;
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

  .overflow-control .header-panel {
    right: -44px;
  }

  .favorites-panel {
    width: min(310px, calc(100vw - 20px));
  }

  .overflow-menu {
    display: grid;
    width: min(280px, calc(100vw - 16px));
    padding: 4px 0;
    border-radius: 4px;
  }

  .overflow-menu button {
    display: flex;
    min-height: 44px;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px;
    border: 0;
    border-bottom: 1px solid var(--border);
    background: transparent;
    color: inherit;
    cursor: pointer;
    text-align: left;
  }

  .overflow-menu button:last-child {
    border-bottom: 0;
  }

  .overflow-menu button:hover,
  .overflow-menu button:focus-visible {
    background: color-mix(in srgb, var(--accent) 12%, transparent);
    outline: none;
  }

  .overflow-menu .overflow-danger {
    color: #c04444;
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

  .settings-field--wide-label {
    grid-template-columns: 68px minmax(0, 1fr);
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

  .startup-shell {
    min-height: 100dvh;
    background: var(--bg);
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
      grid-template-columns: 40px minmax(0, 1fr) 40px 40px 40px;
    }

    .topbar--board .title {
      font-size: 20px;
    }

    .topbar--board .icon-button {
      min-width: 40px;
    }

    .post--avatar-left .post-layout {
      gap: 10px;
    }
  }

  /*
   * Compact reader preset
   *
   * This is deliberately a skin over the existing route and post model.
   * It does not add navigation, fetches, media handling or duplicate content.
   */
  .app[data-interface-preset="compact-reader"] {
    --bg: #eceae5;
    --surface: #f8f7f3;
    --surface-raised: #ffffff;
    --text: #202225;
    --muted: #686b70;
    --border: #c8c5bd;
    --accent: #c75b35;
    --accent-soft: #f4ded5;
    --link: #4e6e8d;
    --post-read: #efede8;
    --post-new: #faf9f6;
    --post-reply: #f3eee6;
    --post-thread: #e8eef2;
    --code-bg: #e4e2dc;
    --success-bg: #e5f1e8;
    --success-text: #2d6840;
    --error-text: #9b3e35;
    --heat-few-bg: #e5f0e7;
    --heat-more-bg: #ece6f3;
    --heat-most-bg: #f3e3e0;
    --header-bg: rgba(248, 247, 243, 0.96);
    --drag-bg: rgba(255, 255, 255, 0.9);
    --header-height: 46px;
    --club-strip-height: 34px;
    --compact-avatar-size: min(var(--post-avatar-size, 40px), 32px);
    color-scheme: light;
    background: var(--bg);
  }

  .app[data-interface-preset="compact-reader"][data-color-scheme="dark"] {
    --bg: #0e0f10;
    --surface: #17191b;
    --surface-raised: #202326;
    --text: #e7e4de;
    --muted: #9a9da2;
    --border: #34383b;
    --accent: #ef805a;
    --accent-soft: #3b261f;
    --link: #91aec7;
    --post-read: #181b1d;
    --post-new: #23272a;
    --post-reply: #211f1c;
    --post-thread: #1d252b;
    --code-bg: #101214;
    --success-bg: #183024;
    --success-text: #98d3aa;
    --error-text: #ef9b91;
    --heat-few-bg: #1a2b21;
    --heat-more-bg: #292333;
    --heat-most-bg: #34211f;
    --header-bg: rgba(23, 25, 27, 0.96);
    --drag-bg: rgba(32, 35, 38, 0.92);
    color-scheme: dark;
  }

  .app[data-interface-preset="compact-reader"] .app-inner {
    background: var(--surface);
  }

  .app[data-interface-preset="compact-reader"] .topbar {
    min-height: var(--header-height);
    padding-top: env(safe-area-inset-top);
    border-color: var(--border);
    background: var(--header-bg);
  }

  .app[data-interface-preset="compact-reader"] .topbar--board {
    grid-template-columns: 40px minmax(0, 1fr) 40px 40px 40px;
    padding-left: 2px;
    padding-right: 0;
  }

  .app[data-interface-preset="compact-reader"] .topbar--favorites {
    grid-template-columns: minmax(0, 1fr) 40px 40px;
    padding-left: 12px;
    padding-right: 0;
  }

  .app[data-interface-preset="compact-reader"] .header-control {
    width: 40px;
  }

  .app[data-interface-preset="compact-reader"] .overflow-control .header-panel {
    right: -40px;
  }

  .app[data-interface-preset="compact-reader"] .club-strip {
    position: sticky;
    top: calc(var(--header-height) + env(safe-area-inset-top));
    z-index: 9;
    display: flex;
    height: var(--club-strip-height);
    overflow-x: auto;
    overflow-y: hidden;
    border-bottom: 1px solid var(--border);
    background: var(--header-bg);
    scrollbar-width: none;
    overscroll-behavior-x: contain;
  }

  .app[data-interface-preset="compact-reader"] .club-strip::-webkit-scrollbar {
    display: none;
  }

  .app[data-interface-preset="compact-reader"] .club-strip-link {
    display: inline-flex;
    flex: none;
    align-items: center;
    max-width: min(44vw, 180px);
    padding: 0 10px;
    overflow: hidden;
    color: var(--muted);
    font-size: 12px;
    font-weight: 650;
    line-height: var(--club-strip-height);
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .app[data-interface-preset="compact-reader"] .club-strip-link--active {
    color: var(--accent);
    box-shadow: inset 0 -2px var(--accent);
  }

  .app[data-interface-preset="compact-reader"][data-club-strip="visible"] .thread-banner,
  .app[data-interface-preset="compact-reader"][data-club-strip="visible"] .write-feedback {
    top: calc(
      var(--header-height)
      + env(safe-area-inset-top)
      + var(--club-strip-height)
    );
  }

  .app[data-interface-preset="compact-reader"][data-club-strip="visible"] .post {
    scroll-margin-top: calc(
      var(--header-height)
      + env(safe-area-inset-top)
      + var(--club-strip-height)
      + 42px
    );
  }

  .app[data-interface-preset="compact-reader"] .title {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0;
  }

  .app[data-interface-preset="compact-reader"] .title--brand {
    font-size: 20px;
  }

  .app[data-interface-preset="compact-reader"] .icon-button {
    min-width: 40px;
    min-height: 40px;
  }

  .app[data-interface-preset="compact-reader"] .icon-button svg {
    width: 22px;
    height: 22px;
  }

  .app[data-interface-preset="compact-reader"] .favorites {
    padding: 0 0 max(16px, env(safe-area-inset-bottom));
    background: var(--surface);
  }

  .app[data-interface-preset="compact-reader"] .favorite-row {
    gap: 10px;
    min-height: 38px;
    padding: min(var(--favorite-row-padding, 12px), 8px) 12px;
    border-color: var(--border);
  }

  .app[data-interface-preset="compact-reader"] .favorite-name {
    font-weight: 650;
    line-height: 1.18;
    letter-spacing: 0;
  }

  .app[data-interface-preset="compact-reader"] .favorite-time {
    margin-top: 2px;
    font-size: max(10px, calc(var(--favorite-font-size, 17px) - 4px));
  }

  .app[data-interface-preset="compact-reader"] .favorite-unread {
    min-width: 28px;
  }

  .app[data-interface-preset="compact-reader"] .favorite-row--heat-few {
    padding-left: 12px;
    background: var(--heat-few-bg);
  }

  .app[data-interface-preset="compact-reader"] .favorite-row--heat-more {
    padding-left: 12px;
    background: var(--heat-more-bg);
  }

  .app[data-interface-preset="compact-reader"] .favorite-row--heat-most {
    padding-left: 12px;
    background: var(--heat-most-bg);
  }

  .app[data-interface-preset="compact-reader"] .favorite-drag-handle {
    top: 0;
    right: 4px;
    bottom: 0;
    width: 42px;
    border-radius: 0;
    background: var(--drag-bg);
  }

  .app[data-interface-preset="compact-reader"] .posts {
    background: var(--surface);
  }

  .app[data-interface-preset="compact-reader"] .post {
    padding: var(--post-spacing, 9px) 12px calc(var(--post-spacing, 9px) + 2px);
    border-color: var(--border);
    background: var(--post-read);
    scroll-margin-top: calc(var(--header-height) + env(safe-area-inset-top) + 42px);
  }

  .app[data-interface-preset="compact-reader"] .post--visit-new {
    background: var(--post-new);
  }

  .app[data-interface-preset="compact-reader"] .post--just-sent {
    background: var(--post-reply);
  }

  .app[data-interface-preset="compact-reader"] .post--reply-context {
    background: var(--post-reply);
    box-shadow: inset 2px 0 var(--accent);
  }

  .app[data-interface-preset="compact-reader"] .post--thread-root {
    background: var(--post-new);
    box-shadow: inset 3px 0 var(--accent);
  }

  .app[data-interface-preset="compact-reader"] .post--thread-reply {
    background: var(--post-thread);
    box-shadow: inset 3px 0 var(--link);
  }

  .app[data-interface-preset="compact-reader"] .thread-banner {
    min-height: 30px;
    padding: 6px 12px;
    border-color: var(--border);
    background: var(--post-thread);
    color: var(--link);
    font-size: 12px;
  }

  .app[data-interface-preset="compact-reader"] .post-header {
    gap: 6px 9px;
    margin-bottom: 7px;
  }

  .app[data-interface-preset="compact-reader"] .post-author {
    gap: 7px;
    font-size: 16px;
    font-weight: 720;
  }

  .app[data-interface-preset="compact-reader"] .post-date {
    font-size: 11px;
  }

  .app[data-interface-preset="compact-reader"] .post-body {
    line-height: 1.45;
  }

  .app[data-interface-preset="compact-reader"] .post-body p,
  .app[data-interface-preset="compact-reader"] .post-body ul,
  .app[data-interface-preset="compact-reader"] .post-body ol,
  .app[data-interface-preset="compact-reader"] .post-body blockquote,
  .app[data-interface-preset="compact-reader"] .post-body pre {
    margin-bottom: 0.65em;
  }

  .app[data-interface-preset="compact-reader"] .post-body blockquote {
    color: var(--muted);
  }

  .app[data-interface-preset="compact-reader"] .post-body a,
  .app[data-interface-preset="compact-reader"] button.reply-reference {
    color: var(--link);
  }

  .app[data-interface-preset="compact-reader"] .post-body pre {
    padding: 9px;
    background: var(--code-bg);
  }

  .app[data-interface-preset="compact-reader"] .reply-reference {
    min-height: 24px;
    margin-top: 6px;
    padding-top: 2px;
    font-size: 11px;
  }

  .app[data-interface-preset="compact-reader"] .post-avatar-trigger,
  .app[data-interface-preset="compact-reader"] .post-avatar--inline,
  .app[data-interface-preset="compact-reader"] .post-avatar--left {
    width: var(--compact-avatar-size);
    height: var(--compact-avatar-size);
  }

  .app[data-interface-preset="compact-reader"] .post-avatar--inline,
  .app[data-interface-preset="compact-reader"] .post-avatar--left {
    flex-basis: var(--compact-avatar-size);
    font-size: 12px;
    line-height: var(--compact-avatar-size);
  }

  .app[data-interface-preset="compact-reader"] .post--avatar-left .post-layout {
    grid-template-columns: var(--compact-avatar-size) minmax(0, 1fr);
    gap: 8px;
  }

  .app[data-interface-preset="compact-reader"] .mode-switch:hover,
  .app[data-interface-preset="compact-reader"] .mode-switch:focus-visible,
  .app[data-interface-preset="compact-reader"] .overflow-toggle:hover,
  .app[data-interface-preset="compact-reader"] .overflow-toggle:focus-visible,
  .app[data-interface-preset="compact-reader"] .overflow-toggle[aria-expanded="true"] {
    border-radius: 3px;
    background: var(--accent-soft);
  }

  .app[data-interface-preset="compact-reader"] .header-panel,
  .app[data-interface-preset="compact-reader"] .post-menu {
    border-radius: 4px;
    background: var(--surface-raised);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.34);
  }

  .app[data-interface-preset="compact-reader"] .settings-field select,
  .app[data-interface-preset="compact-reader"] .settings-field input[type="text"],
  .app[data-interface-preset="compact-reader"] .settings-field input[type="number"],
  .app[data-interface-preset="compact-reader"] .composer-textarea {
    border-radius: 3px;
    background: var(--surface);
  }

  .app[data-interface-preset="compact-reader"] .settings-field--wide-label {
    grid-template-columns: 68px minmax(0, 1fr);
  }

  .app[data-interface-preset="compact-reader"] .panel-actions button,
  .app[data-interface-preset="compact-reader"] .composer-action,
  .app[data-interface-preset="compact-reader"] .tail-action {
    border-radius: 3px;
    background: var(--surface);
  }

  .app[data-interface-preset="compact-reader"] .post-menu button:hover,
  .app[data-interface-preset="compact-reader"] .post-menu button:focus-visible {
    background: var(--accent-soft);
  }

  .app[data-interface-preset="compact-reader"] .composer-panel {
    padding: 12px;
    border-radius: 0;
    background: var(--surface-raised);
  }

  .app[data-interface-preset="compact-reader"] .composer-panel--new {
    margin: 0;
    border-width: 0 0 1px;
  }

  .app[data-interface-preset="compact-reader"] .composer-panel--reply {
    margin-top: 9px;
    background: var(--surface-raised);
  }

  .app[data-interface-preset="compact-reader"] .composer-textarea {
    min-height: 130px;
  }

  .app[data-interface-preset="compact-reader"] .composer-action--send {
    background: var(--accent);
  }

  .app[data-interface-preset="compact-reader"] .write-feedback {
    min-height: 40px;
    padding: 6px 12px;
    border-color: var(--border);
    background: var(--success-bg);
    color: var(--success-text);
    font-size: 13px;
  }

  .app[data-interface-preset="compact-reader"] .composer-error,
  .app[data-interface-preset="compact-reader"] .tail-error {
    color: var(--error-text);
  }

  .app[data-interface-preset="compact-reader"] .board-tail {
    min-height: 68px;
    padding: 12px 12px max(20px, env(safe-area-inset-bottom));
    background: var(--surface);
  }

  @media (prefers-color-scheme: dark) {
    .app[data-interface-preset="compact-reader"][data-color-scheme="system"] {
      --bg: #0e0f10;
      --surface: #17191b;
      --surface-raised: #202326;
      --text: #e7e4de;
      --muted: #9a9da2;
      --border: #34383b;
      --accent: #ef805a;
      --accent-soft: #3b261f;
      --link: #91aec7;
      --post-read: #181b1d;
      --post-new: #23272a;
      --post-reply: #211f1c;
      --post-thread: #1d252b;
      --code-bg: #101214;
      --success-bg: #183024;
      --success-text: #98d3aa;
      --error-text: #ef9b91;
      --heat-few-bg: #1a2b21;
      --heat-more-bg: #292333;
      --heat-most-bg: #34211f;
      --header-bg: rgba(23, 25, 27, 0.96);
      --drag-bg: rgba(32, 35, 38, 0.92);
      color-scheme: dark;
    }
  }

`;

  // src/runtime.js
  var VERSION = "0.9.1";
  var HOST_ID = "bokoun-host";
  var RETURN_HOST_ID = "bokoun-return";
  var COMPARE_HOST_ID = "bokoun-compare";
  var BOOT_TIMEOUT_MS = 1e4;
  var PAGE_LOAD_TIMEOUT_MS = 15e3;
  var COMPOSER_TIMEOUT_MS = 8e3;
  var POST_CONFIRM_TIMEOUT_MS = 15e3;
  var WRITE_FEEDBACK_MS = 8e3;
  var STRUCTURED_REFRESH_MS = 3e4;
  var STRUCTURED_RESUME_MS = 2 * 6e4;
  var FAVORITES_REFRESH_MS = 6e4;
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
  var RECENT_CLUBS_KEY = "bokoun.recent-clubs.v1";
  var NAVIGATION_INTENT_KEY = "bokoun.navigation-intent.v1";
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
    bootHandoffGeneration: 0,
    renderTimer: 0,
    routeTimer: 0,
    routeEventTimer: 0,
    routeFallbackTimer: 0,
    favoritesRefreshTimer: 0,
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
    layerReasons: /* @__PURE__ */ new Set(),
    revealPending: false,
    revealRunning: false,
    visualGeneration: 0,
    visualIntent: "native",
    hostRevealAnimation: null,
    visualWatching: false,
    visualWatchFrame: 0,
    visualLogEntries: [],
    visualLastWarning: "",
    compareHost: null,
    comparePercent: 100,
    compareAnchor: null,
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
    editingFavoriteOrder: false,
    recentClubs: null,
    pendingNavigationIntent: null,
    routeTransitionAnimation: null,
    routeExitAnimation: null,
    navigationCommitSequence: 0,
    historyTraversalPending: false,
    navigationEntryTransitionConsumed: false,
    fullscreenOwned: false,
    fullscreenRequestPending: false,
    fullscreenSuppressed: false,
    fullscreenChangeHandler: null
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
      COMPARE_HOST_ID: COMPARE_HOST_ID2,
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
    const currentDisplaySettings = (...args) => ctx2.currentDisplaySettings(...args);
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
      html[data-bokoun-booting="true"] {
        background: #f4f2ee !important;
        color-scheme: light dark;
      }
      html[data-bokoun-booting="true"]::before {
        content: "";
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        height: 100dvh;
        z-index: 2147483647;
        background: #f4f2ee;
        pointer-events: auto;
      }
      html[data-bokoun-booting="true"] body {
        visibility: hidden !important;
      }
      html[data-bokoun-booting="true"] #${HOST_ID2} {
        z-index: 2147483646 !important;
      }
      @media (prefers-color-scheme: dark) {
        html[data-bokoun-booting="true"],
        html[data-bokoun-booting="true"]::before {
          background: #17191b !important;
        }
      }
      html[data-bokoun-active="true"] body > :not(#${HOST_ID2}):not(#${COMPARE_HOST_ID2}) {
        display: none !important;
      }
      html[data-bokoun-active="true"][data-bokoun-layered="true"] body > :not(#${HOST_ID2}):not(#${COMPARE_HOST_ID2}),
      html[data-bokoun-active="true"][data-bokoun-bridge="true"] body > :not(#${HOST_ID2}):not(#${COMPARE_HOST_ID2}) {
        display: revert !important;
      }
      html[data-bokoun-active="true"][data-bokoun-layered="true"] body > :not(#${HOST_ID2}):not(#${COMPARE_HOST_ID2}) {
        pointer-events: none !important;
      }
      html[data-bokoun-active="true"][data-bokoun-layered="true"],
      html[data-bokoun-active="true"][data-bokoun-layered="true"] body {
        height: auto !important;
        overflow: hidden !important;
      }
      html[data-bokoun-active="true"],
      html[data-bokoun-active="true"] body {
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        overflow: hidden !important;
        background: #fff !important;
      }
      html[data-bokoun-active="true"][data-bokoun-aligning="true"],
      html[data-bokoun-active="true"][data-bokoun-aligning="true"] body {
        height: auto !important;
        overflow: auto !important;
      }
      #${HOST_ID2} {
        display: block !important;
        visibility: visible !important;
        position: fixed !important;
        inset: 0 !important;
        z-index: 2147483647 !important;
        opacity: 1 !important;
        background: #fff;
        isolation: isolate;
        contain: layout paint style;
        backface-visibility: hidden;
      }
      #${COMPARE_HOST_ID2} {
        display: block !important;
        visibility: visible !important;
      }
    `;
      document.documentElement.append(style);
    }
    function startPaintGuard() {
      if (shouldBoot()) {
        installGlobalStyle();
        document.documentElement.dataset.bokounBooting = "true";
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
    function fullscreenEnabled() {
      return currentDisplaySettings().fullscreenMode !== false;
    }
    function fullscreenGestureAllowed(event) {
      if (!event?.isTrusted || !state2.active || state2.nativeMode) return false;
      return !event.composedPath().some((node) => node instanceof Element && (node.matches("a, input, select, textarea") || node.matches("[data-native-href]") || node.matches("[data-action='mode-switch']") || node.matches("[data-action='overflow']") || node.matches("[data-action='back']") || node.matches("[data-action='thread-back']") || node.matches("[data-action='thread']") || node.matches("[data-setting='fullscreen-mode']")));
    }
    async function requestBokounFullscreen({ force = false } = {}) {
      if (!fullscreenEnabled() || !state2.active || state2.nativeMode || state2.fullscreenRequestPending) return false;
      if (document.fullscreenElement) return true;
      if (force) state2.fullscreenSuppressed = false;
      if (state2.fullscreenSuppressed) return false;
      const request = document.documentElement?.requestFullscreen;
      if (typeof request !== "function") {
        state2.fullscreenSuppressed = true;
        return false;
      }
      state2.fullscreenRequestPending = true;
      try {
        await request.call(document.documentElement);
        state2.fullscreenOwned = document.fullscreenElement === document.documentElement;
        if (state2.fullscreenOwned && (!state2.active || state2.nativeMode || !fullscreenEnabled())) {
          await exitBokounFullscreen();
          return false;
        }
        state2.fullscreenSuppressed = !state2.fullscreenOwned;
        return state2.fullscreenOwned;
      } catch {
        state2.fullscreenOwned = false;
        state2.fullscreenSuppressed = true;
        return false;
      } finally {
        state2.fullscreenRequestPending = false;
      }
    }
    async function exitBokounFullscreen({ suppress = true } = {}) {
      if (suppress) state2.fullscreenSuppressed = true;
      if (!state2.fullscreenOwned || !document.fullscreenElement) {
        state2.fullscreenOwned = false;
        return false;
      }
      state2.fullscreenOwned = false;
      try {
        await document.exitFullscreen();
        return true;
      } catch {
        return false;
      }
    }
    function handleFullscreenChange() {
      const active = Boolean(document.fullscreenElement);
      if (state2.scroller) state2.scroller.dataset.fullscreen = active ? "active" : "inactive";
      if (!active && state2.fullscreenOwned) {
        state2.fullscreenOwned = false;
        state2.fullscreenSuppressed = true;
      }
    }
    function handleFullscreenGesture(event) {
      if (!fullscreenEnabled() || !fullscreenGestureAllowed(event)) return;
      void requestBokounFullscreen();
    }
    function syncFullscreenMode() {
      if (!fullscreenEnabled()) {
        void exitBokounFullscreen();
        return;
      }
      if (state2.scroller) {
        state2.scroller.dataset.fullscreen = document.fullscreenElement ? "active" : "inactive";
      }
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
          <div class="startup-shell" role="status" aria-label="Spouštím Bokouna"></div>
        </div>
      </main>
    `;
      document.body.append(host);
      state2.host = host;
      state2.shadow = shadow;
      state2.scroller = shadow.querySelector(".app");
      state2.scroller.addEventListener("scroll", handleBokounScroll, { passive: true });
      shadow.addEventListener("click", handleFullscreenGesture, { capture: true });
      if (!state2.fullscreenChangeHandler) {
        state2.fullscreenChangeHandler = handleFullscreenChange;
        document.addEventListener("fullscreenchange", state2.fullscreenChangeHandler);
      }
      state2.active = true;
      state2.visualIntent = "bokoun";
      commitLayerState("mount-shell");
    }
    function prefersReducedMotion() {
      return matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    function visualExposureAllowed() {
      return state2.nativeMode || state2.layerReasons.has("transition") || state2.layerReasons.has("compare");
    }
    function visualSnapshot(action = "snapshot") {
      const host = state2.host;
      const connected = Boolean(host?.isConnected);
      const style = connected ? getComputedStyle(host) : null;
      const root = document.documentElement;
      const clip = host?.style.clipPath || style?.clipPath || "";
      const effectiveReveal = state2.active && !visualExposureAllowed() ? 100 : state2.comparePercent;
      return Object.freeze({
        at: Math.round(performance.now() * 10) / 10,
        route: routeKey(),
        action,
        generation: state2.visualGeneration,
        intent: state2.visualIntent,
        hostConnected: connected,
        hostDisplay: style?.display || "",
        hostVisibility: style?.visibility || "",
        hostOpacity: style?.opacity || "",
        hostClip: clip,
        revealPercent: effectiveReveal,
        activeAttribute: root?.dataset.bokounActive === "true",
        layeredAttribute: root?.dataset.bokounLayered === "true",
        bootingAttribute: root?.dataset.bokounBooting === "true",
        nativeMode: state2.nativeMode,
        comparisonMode: state2.layerReasons.has("compare"),
        revealRunning: state2.revealRunning
      });
    }
    function visualProblems(snapshot) {
      if (!state2.active || state2.nativeMode) return [];
      const problems = [];
      if (!snapshot.hostConnected) problems.push("active-host-disconnected");
      if (snapshot.hostDisplay === "none") problems.push("active-host-display-none");
      if (snapshot.hostVisibility === "hidden") problems.push("active-host-hidden");
      if (Number(snapshot.hostOpacity) < 0.99) problems.push("active-host-transparent");
      if (!snapshot.activeAttribute) problems.push("active-attribute-missing");
      if (!visualExposureAllowed() && snapshot.revealPercent < 99.9) {
        problems.push("unexpected-native-exposure");
      }
      return problems;
    }
    function recordVisualState(action, { force = false } = {}) {
      if (!state2.visualWatching && !force) return null;
      const snapshot = visualSnapshot(action);
      state2.visualLogEntries.push(snapshot);
      if (state2.visualLogEntries.length > 250) state2.visualLogEntries.shift();
      if (state2.visualWatching) {
        const warning = visualProblems(snapshot).join(",");
        if (warning && warning !== state2.visualLastWarning) {
          console.warn(`[Bokoun ${VERSION2}] Invalid visual state: ${warning}.`);
        }
        state2.visualLastWarning = warning;
      }
      return snapshot;
    }
    function watchVisualState(enabled = true) {
      state2.visualWatching = enabled === true;
      cancelAnimationFrame(state2.visualWatchFrame);
      state2.visualWatchFrame = 0;
      state2.visualLastWarning = "";
      if (!state2.visualWatching) return false;
      const sample = () => {
        if (!state2.visualWatching) return;
        recordVisualState("animation-frame");
        state2.visualWatchFrame = requestAnimationFrame(sample);
      };
      recordVisualState("watch-start", { force: true });
      state2.visualWatchFrame = requestAnimationFrame(sample);
      return true;
    }
    function clearVisualLog() {
      state2.visualLogEntries.length = 0;
      state2.visualLastWarning = "";
    }
    function visualLog() {
      return state2.visualLogEntries.map((entry) => ({ ...entry }));
    }
    function commitLayerState(reason = "commit") {
      const root = document.documentElement;
      if (root) {
        if (state2.active) {
          root.dataset.bokounActive = "true";
        } else {
          delete root.dataset.bokounActive;
        }
        if (state2.active && state2.layerReasons.size) root.dataset.bokounLayered = "true";
        else delete root.dataset.bokounLayered;
      }
      if (state2.host?.isConnected) {
        const reveal = state2.active && !visualExposureAllowed() ? 100 : Math.min(100, Math.max(0, Number(state2.comparePercent) || 0));
        state2.host.style.display = "block";
        state2.host.style.visibility = "visible";
        state2.host.style.opacity = "1";
        state2.host.style.clipPath = `inset(0 ${100 - reveal}% 0 0)`;
        const background = state2.scroller ? getComputedStyle(state2.scroller).backgroundColor : "";
        if (background && background !== "rgba(0, 0, 0, 0)") {
          state2.host.style.backgroundColor = background;
        }
      }
      recordVisualState(reason);
    }
    function setLayered(reason, enabled) {
      if (enabled) state2.layerReasons.add(reason);
      else state2.layerReasons.delete(reason);
      commitLayerState(`layer:${reason}:${enabled ? "on" : "off"}`);
    }
    function setHostReveal(percent) {
      const normalized = Math.min(100, Math.max(0, Number(percent) || 0));
      state2.comparePercent = normalized;
      commitLayerState(`reveal:${normalized}`);
      const control = state2.compareHost?.shadowRoot?.querySelector("[role='slider']");
      if (control) {
        control.style.setProperty("--compare-percent", `${normalized}%`);
        control.setAttribute("aria-valuenow", String(Math.round(normalized)));
        control.setAttribute(
          "aria-valuetext",
          `${Math.round(normalized)} % Bokoun, ${Math.round(100 - normalized)} % Kapybara`
        );
      }
    }
    function beginVisualTransition(intent) {
      state2.visualGeneration += 1;
      state2.visualIntent = intent;
      state2.hostRevealAnimation?.cancel();
      state2.hostRevealAnimation = null;
      recordVisualState(`transition:${intent}:begin`);
      return state2.visualGeneration;
    }
    function ownsVisualTransition(generation) {
      return generation === state2.visualGeneration;
    }
    async function animateHostReveal(from, to, generation = state2.visualGeneration) {
      const host = state2.host;
      if (!host || !ownsVisualTransition(generation)) return false;
      setHostReveal(from);
      if (prefersReducedMotion() || typeof host.animate !== "function") {
        if (!ownsVisualTransition(generation) || state2.host !== host) return false;
        setHostReveal(to);
        return true;
      }
      const animation = host.animate(
        [
          { clipPath: `inset(0 ${100 - from}% 0 0)` },
          { clipPath: `inset(0 ${100 - to}% 0 0)` }
        ],
        { duration: 360, easing: "cubic-bezier(.22,.8,.25,1)", fill: "forwards" }
      );
      state2.hostRevealAnimation = animation;
      await animation.finished.catch(() => void 0);
      if (state2.hostRevealAnimation === animation) state2.hostRevealAnimation = null;
      if (!ownsVisualTransition(generation) || state2.host !== host) return false;
      animation.cancel();
      setHostReveal(to);
      return true;
    }
    function removeCompareHandle() {
      state2.compareHost?.remove();
      state2.compareHost = null;
      state2.compareAnchor = null;
      setLayered("compare", false);
      if (state2.active) setHostReveal(100);
    }
    function showCompareHandle() {
      if (!state2.active || !state2.host || state2.compareHost?.isConnected) return;
      setLayered("compare", true);
      setHostReveal(100);
      const host = document.createElement("div");
      host.id = COMPARE_HOST_ID2;
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
      state2.compareHost = host;
      const slider = shadow.querySelector("[role='slider']");
      const updateFromClientX = (clientX) => {
        const width = Math.max(1, document.documentElement.clientWidth);
        setHostReveal(clientX / width * 100);
      };
      slider.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        state2.compareAnchor = captureBokounAnchor();
        restoreNativeAnchor(state2.compareAnchor);
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
        if (!state2.compareAnchor) {
          state2.compareAnchor = captureBokounAnchor();
          restoreNativeAnchor(state2.compareAnchor);
        }
        setHostReveal(
          event.key === "Home" ? 0 : event.key === "End" ? 100 : state2.comparePercent + amounts[event.key]
        );
      });
      setHostReveal(state2.comparePercent);
    }
    function syncCompareMode() {
      if (!state2.active || state2.nativeMode || state2.revealRunning || document.documentElement.dataset.bokounBooting === "true") return;
      if (currentDisplaySettings().compareHandle) showCompareHandle();
      else removeCompareHandle();
    }
    async function revealBokoun({ initial = false, instant = false } = {}) {
      if (!state2.host) return false;
      const generation = beginVisualTransition("bokoun");
      state2.revealPending = false;
      state2.revealRunning = true;
      removeCompareHandle();
      setLayered("transition", true);
      if (instant) setHostReveal(100);
      try {
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        if (!ownsVisualTransition(generation)) return false;
        if (!instant && !await animateHostReveal(0, 100, generation)) return false;
        if (!ownsVisualTransition(generation)) return false;
        return true;
      } finally {
        if (ownsVisualTransition(generation)) {
          setLayered("transition", false);
          state2.revealRunning = false;
          state2.visualIntent = "bokoun";
          commitLayerState("reveal-bokoun:complete");
          syncCompareMode();
          if (initial) state2.host?.setAttribute("data-initial-reveal-complete", "true");
        }
      }
    }
    async function completeBootHandoff() {
      const root = document.documentElement;
      if (root?.dataset.bokounBooting !== "true") return true;
      const generation = ++state2.bootHandoffGeneration;
      const visualGeneration = state2.visualGeneration;
      const host = state2.host;
      const routeContent = state2.shadow?.querySelector(".route-content");
      if (!state2.active || state2.nativeMode || !host?.isConnected || !routeContent || host.getAttribute("data-initial-reveal-complete") !== "true") return false;
      commitLayerState("boot-handoff:ready");
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (generation !== state2.bootHandoffGeneration || visualGeneration !== state2.visualGeneration || !state2.active || state2.nativeMode || state2.host !== host || !host.isConnected || !state2.shadow?.querySelector(".route-content")) return false;
      const background = getComputedStyle(host).backgroundColor;
      if (!background || background === "rgba(0, 0, 0, 0)") return false;
      delete root.dataset.bokounBooting;
      clearTimeout(state2.bootTimer);
      state2.bootTimer = 0;
      syncCompareMode();
      recordVisualState("boot-handoff:complete");
      return true;
    }
    function revealNative({ stop = false, generation = null, reason = "native" } = {}) {
      const owner = generation ?? beginVisualTransition(reason);
      if (!ownsVisualTransition(owner)) return false;
      saveScroll();
      void exitBokounFullscreen();
      state2.active = false;
      state2.revealPending = false;
      state2.revealRunning = false;
      state2.bootHandoffGeneration += 1;
      removeCompareHandle();
      state2.layerReasons.clear();
      state2.visualIntent = "native";
      delete document.documentElement.dataset.bokounBooting;
      commitLayerState(`reveal-native:${reason}`);
      state2.host?.remove();
      state2.host = null;
      state2.shadow = null;
      state2.scroller = null;
      state2.currentSignature = "";
      if (stop) {
        document.getElementById(RETURN_HOST_ID2)?.remove();
        state2.disabled = true;
        clearTimeout(state2.bootTimer);
        clearTimeout(state2.renderTimer);
        clearTimeout(state2.routeFallbackTimer);
        stopRouteObservation();
      }
      recordVisualState(`reveal-native:${reason}:complete`);
      return true;
    }
    async function openFullKapybara() {
      if (state2.nativeMode || state2.visualIntent === "native-transition") return false;
      const generation = beginVisualTransition("native-transition");
      const anchor = captureBokounAnchor();
      sessionStorage.setItem(SESSION_DISABLED_KEY2, "1");
      state2.nativeMode = true;
      state2.revealRunning = true;
      removeCompareHandle();
      setLayered("transition", true);
      if (anchor?.pageHref) {
        try {
          await navigateNativeRoute(anchor.pageHref, anchor.postId);
        } catch (error) {
          console.warn(`[Bokoun ${VERSION2}] Could not align the native page; using the closest loaded position.`, error?.name || "Error");
        }
      }
      if (!ownsVisualTransition(generation)) return false;
      restoreNativeAnchor(anchor);
      await new Promise((resolve) => window.setTimeout(resolve, 300));
      if (!ownsVisualTransition(generation)) return false;
      if (!await animateHostReveal(100, 0, generation)) return false;
      if (!revealNative({ generation, reason: "mode-switch" })) return false;
      showReturnControl();
      return true;
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
          top: env(safe-area-inset-top);
          right: max(0px, calc((100vw - 720px) / 2));
          z-index: 2147483646;
          display: block;
          width: 44px;
          height: 46px;
          pointer-events: none;
        }

        button {
          display: grid;
          width: 44px;
          height: 46px;
          place-items: center;
          padding: 0;
          border: 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 0;
          background: rgba(20, 22, 24, 0.88);
          color: #ef805a;
          font: 500 22px/1 system-ui, sans-serif;
          cursor: pointer;
          pointer-events: auto;
          backdrop-filter: blur(8px);
          -webkit-tap-highlight-color: transparent;
        }

        button:focus-visible {
          outline: 2px solid #ef805a;
          outline-offset: -3px;
        }
      </style>
      <button
        type="button"
        aria-label="Přepnout do Bokouna"
        title="Přepnout do Bokouna"
      >◐</button>
    `;
      shadow.querySelector("button").addEventListener("click", returnToBokoun);
      document.body.append(host);
    }
    function disableBokoun() {
      gmSet2(PREF_ENABLED_KEY2, false);
      sessionStorage.removeItem(SESSION_DISABLED_KEY2);
      document.getElementById(RETURN_HOST_ID2)?.remove();
      revealNative({ stop: true });
    }
    function registerMenus() {
      if (sessionStorage.getItem(SESSION_DISABLED_KEY2) === "1") {
        gmMenu2("Bokoun: zapnout v tomto panelu", returnToBokoun);
      } else {
        gmMenu2("Bokoun: otevřít plnou Kapybaru", openFullKapybara);
      }
      gmMenu2(
        gmGet2(PREF_ENABLED_KEY2, true) ? "Bokoun: vypnout trvale" : "Bokoun: zapnout trvale",
        gmGet2(PREF_ENABLED_KEY2, true) ? disableBokoun : () => {
          gmSet2(PREF_ENABLED_KEY2, true);
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
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            state2.scroller?.scrollTo({ top: y, behavior: "auto" });
            resolve(y);
          });
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
      prefersReducedMotion,
      requestBokounFullscreen,
      exitBokounFullscreen,
      handleFullscreenChange,
      handleFullscreenGesture,
      syncFullscreenMode,
      visualExposureAllowed,
      visualSnapshot,
      visualProblems,
      recordVisualState,
      watchVisualState,
      clearVisualLog,
      visualLog,
      commitLayerState,
      beginVisualTransition,
      ownsVisualTransition,
      revealNative,
      setLayered,
      setHostReveal,
      animateHostReveal,
      showCompareHandle,
      removeCompareHandle,
      syncCompareMode,
      revealBokoun,
      completeBootHandoff,
      openFullKapybara,
      showReturnControl,
      disableBokoun,
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
      "favorites-poll",
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
    function structuredModelAge(type, pageHref) {
      const entry = state2.structuredCache.get(structuredCacheKey(type, pageHref));
      const fetchedAt = Number(entry?.fetchedAt);
      return Number.isFinite(fetchedAt) ? Math.max(0, now() - fetchedAt) : Number.POSITIVE_INFINITY;
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
      render = true,
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
        if (render) {
          state2.currentSignature = "";
          scheduleRender({ force: true });
        }
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
      structuredModelAge,
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
      const accepted = replaceLexicalMarkdown(editable, body) || replaceBrowserText(editable, body);
      if (!accepted) throw new Error("Native editor rejected the draft");
      await waitForNative(
        () => normalizeEditorText(editable.innerText) === normalizeEditorText(body),
        3e3,
        "Native editor did not retain the draft"
      );
    }
    function replaceLexicalMarkdown(editable, body) {
      try {
        const editor = editable?.__lexicalEditor;
        if (!editor || typeof editor.getEditorState !== "function" || typeof editor.parseEditorState !== "function" || typeof editor.setEditorState !== "function") return false;
        const json = editor.getEditorState().toJSON();
        const container = json?.root?.children?.[0];
        const textNode = container?.children?.find((node) => node?.type === "text");
        if (!container || !textNode) return false;
        textNode.text = body;
        container.children = [textNode];
        json.root.children = [container];
        editor.setEditorState(editor.parseEditorState(json));
        return true;
      } catch {
        return false;
      }
    }
    function replaceBrowserText(editable, body) {
      try {
        editable.focus();
        const range = document.createRange();
        range.selectNodeContents(editable);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        return document.execCommand("insertText", false, body);
      } catch {
        return false;
      }
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
      replaceLexicalMarkdown,
      replaceBrowserText,
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

  // src/first-unread.js
  function installFirstUnread(ctx2) {
    const { state: state2 } = ctx2;
    const routeType = (...args) => ctx2.routeType(...args);
    const currentDisplaySettings = (...args) => ctx2.currentDisplaySettings(...args);
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
      const scroller = state2.scroller;
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
      return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }
    function firstUnreadElement(ids, posts = []) {
      const wanted = new Set(ids.map(String));
      const orderedIds = posts.filter((post) => wanted.has(String(post.id))).sort((left, right) => (Date.parse(left.datetime) || 0) - (Date.parse(right.datetime) || 0) || (Number(left.sequence) || 0) - (Number(right.sequence) || 0) || String(left.id).localeCompare(String(right.id), void 0, { numeric: true })).map((post) => String(post.id));
      const candidates = orderedIds.length ? orderedIds : [...wanted];
      const elements = [...state2.scroller.querySelectorAll("[data-bokoun-post-id]")];
      return candidates.map((id) => elements.find((element) => element.dataset.bokounPostId === id)).find(Boolean);
    }
    function scrollToFirstUnread(target) {
      const scrollerRect = state2.scroller.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const topbar = state2.shadow?.querySelector(".topbar");
      const topbarRect = topbar?.getBoundingClientRect();
      const headerOffset = topbarRect ? Math.max(0, topbarRect.bottom - scrollerRect.top + 8) : 8;
      const top = state2.scroller.scrollTop + targetRect.top - scrollerRect.top - headerOffset;
      state2.scroller.scrollTo({ top: Math.max(0, top), behavior: "auto" });
    }
    function maybeScrollFirstUnread({ model, key, restorePromise }) {
      attachCancellationListeners();
      if (key !== observedRoute) {
        observedRoute = key;
        handledRoute = "";
        cancelledRoute = "";
        generation += 1;
      }
      if (state2.disabled || state2.nativeMode || routeType() !== "board" || !currentDisplaySettings().firstUnread || handledRoute === key || cancelledRoute === key) return;
      const url = new URL(key, location.origin);
      if (url.hash || model.threadRootId || !model.newPostIds?.length) {
        handledRoute = key;
        return;
      }
      const token = ++generation;
      Promise.resolve(restorePromise).then(nextPaint).then(() => {
        if (token !== generation || state2.currentRouteKey !== key || state2.disabled || state2.nativeMode || cancelledRoute === key) return;
        const target = firstUnreadElement(model.newPostIds, model.posts);
        if (!target) return;
        scrollToFirstUnread(target);
        handledRoute = key;
      }).catch(() => {
      });
    }
    Object.assign(ctx2, { maybeScrollFirstUnread, resetFirstUnread });
  }

  // src/settings.js
  var DEFAULT_DISPLAY_SETTINGS = Object.freeze({
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
    firstUnread: false
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
    spacing: 12,
    unreadOnly: false
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
  var INTERFACE_PRESETS = /* @__PURE__ */ new Set(["default", "compact-reader"]);
  var COLOR_SCHEMES = /* @__PURE__ */ new Set(["system", "light", "dark"]);
  var FAVORITE_SORTS = /* @__PURE__ */ new Set(["activity", "alphabetical", "unread", "manual"]);
  var UNREAD_MODES = /* @__PURE__ */ new Set(["count", "heat", "both", "hidden"]);
  var MAX_CUSTOM_FAMILY_LENGTH = 160;
  var MIN_FONT_SIZE = 8;
  var MAX_FONT_SIZE = 72;
  var MAX_RECENT_CLUBS = 8;
  function installSettings(ctx2) {
    const {
      DISPLAY_SETTINGS_KEY: DISPLAY_SETTINGS_KEY2,
      FAVORITES_ORDER_KEY: FAVORITES_ORDER_KEY2,
      FAVORITES_SETTINGS_KEY: FAVORITES_SETTINGS_KEY2,
      FONT_SETTINGS_KEY: FONT_SETTINGS_KEY2,
      RECENT_CLUBS_KEY: RECENT_CLUBS_KEY2 = "bokoun.recent-clubs.v1",
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
      if (!state2.recentClubs) {
        state2.recentClubs = normalizeRecentClubs(gmGet2(RECENT_CLUBS_KEY2, []));
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
        interfacePreset: INTERFACE_PRESETS.has(value.interfacePreset) ? value.interfacePreset : DEFAULT_DISPLAY_SETTINGS.interfacePreset,
        colorScheme: COLOR_SCHEMES.has(value.colorScheme) ? value.colorScheme : DEFAULT_DISPLAY_SETTINGS.colorScheme,
        showClubStrip: value.showClubStrip !== false,
        pageTransitions: value.pageTransitions !== false,
        fullscreenMode: value.fullscreenMode !== false,
        showAvatars: value.showAvatars !== false,
        avatarPosition: AVATAR_POSITIONS.has(value.avatarPosition) ? value.avatarPosition : DEFAULT_DISPLAY_SETTINGS.avatarPosition,
        avatarSize: normalizeAvatarSize(value.avatarSize),
        avatarShape: AVATAR_SHAPES.has(value.avatarShape) ? value.avatarShape : DEFAULT_DISPLAY_SETTINGS.avatarShape,
        replyMeta: REPLY_META_MODES.has(value.replyMeta) ? value.replyMeta : DEFAULT_DISPLAY_SETTINGS.replyMeta,
        postSpacing: normalizePostSpacing(value.postSpacing),
        postSeparators: value.postSeparators !== false,
        compareHandle: value.compareHandle === true,
        firstUnread: value.firstUnread === true
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
        spacing: normalizeFavoriteSpacing(value.spacing),
        unreadOnly: value.unreadOnly === true
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
    function normalizeRecentClubs(value) {
      if (!Array.isArray(value)) return [];
      const normalized = [];
      const seen = /* @__PURE__ */ new Set();
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
        const base = typeof location !== "undefined" ? location.origin : "https://kapybara.okoun.cz";
        const url = new URL(value, base);
        if (url.origin !== base || !/^\/boards\/[^/]+\/?$/.test(url.pathname)) return "";
        return url.pathname.replace(/\/$/, "");
      } catch {
        return "";
      }
    }
    function currentRecentClubs() {
      loadSettings();
      return state2.recentClubs.map((club) => ({ ...club }));
    }
    function rememberRecentClub(href, name) {
      const candidate = normalizeRecentClubs([{ href, name }])[0];
      if (!candidate) return currentRecentClubs();
      const current = currentRecentClubs();
      const next = [
        candidate,
        ...current.filter((club) => club.href !== candidate.href)
      ].slice(0, MAX_RECENT_CLUBS);
      if (next.length !== current.length || next.some((club, index) => club.href !== current[index]?.href || club.name !== current[index]?.name)) {
        state2.recentClubs = next;
        gmSet2(RECENT_CLUBS_KEY2, next);
      }
      return next.map((club) => ({ ...club }));
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
      const scroller = state2.scroller;
      if (!scroller) return;
      const display = currentDisplaySettings();
      const font = currentFontSettings();
      const favorites = currentFavoritesSettings();
      const stack = fontStack(font.family, font.customFamily);
      const favoriteStack = fontStack(favorites.fontFamily, favorites.customFontFamily);
      scroller.dataset.avatars = display.showAvatars ? "visible" : "hidden";
      scroller.dataset.interfacePreset = display.interfacePreset;
      scroller.dataset.colorScheme = display.colorScheme;
      scroller.dataset.clubStrip = display.interfacePreset === "compact-reader" && display.showClubStrip ? "visible" : "hidden";
      scroller.dataset.pageTransitions = display.interfacePreset === "compact-reader" && display.pageTransitions ? "enabled" : "disabled";
      scroller.dataset.avatarPosition = display.avatarPosition;
      scroller.dataset.avatarShape = display.avatarShape;
      scroller.dataset.postSeparators = display.postSeparators ? "visible" : "hidden";
      scroller.style.setProperty("--post-avatar-size", `${display.avatarSize}px`);
      scroller.style.setProperty(
        "--post-avatar-font-size",
        `${Math.max(12, Math.round(display.avatarSize * 0.38))}px`
      );
      scroller.style.setProperty("--post-font-size", `${displayFontSize(font.size)}px`);
      scroller.style.setProperty("--post-spacing", `${display.postSpacing}px`);
      if (stack) scroller.style.setProperty("--post-font-family", stack);
      else scroller.style.removeProperty("--post-font-family");
      scroller.style.setProperty("--favorite-font-size", `${displayFontSize(favorites.fontSize)}px`);
      scroller.style.setProperty("--favorite-row-padding", `${favorites.spacing}px`);
      if (favoriteStack) scroller.style.setProperty("--favorite-font-family", favoriteStack);
      else scroller.style.removeProperty("--favorite-font-family");
      ctx2.syncCompareMode?.();
      ctx2.syncFullscreenMode?.();
    }
    Object.assign(ctx2, {
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
    const routeType = (...args) => ctx2.routeType(...args);
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
    const resetFirstUnread = (...args) => ctx2.resetFirstUnread?.(...args);
    const updateFontSettings = (...args) => ctx2.updateFontSettings(...args);
    const resetFontSettings = (...args) => ctx2.resetFontSettings(...args);
    const displayFontSize = (...args) => ctx2.displayFontSize(...args);
    const normalizeCustomFamily = (...args) => ctx2.normalizeCustomFamily(...args);
    const currentFavoritesSettings = (...args) => ctx2.currentFavoritesSettings(...args);
    const currentRecentClubs = (...args) => ctx2.currentRecentClubs(...args);
    const normalizeClubRoute = (...args) => ctx2.normalizeClubRoute(...args);
    const updateFavoritesSettings = (...args) => ctx2.updateFavoritesSettings(...args);
    const resetFavoritesAppearance = (...args) => ctx2.resetFavoritesAppearance(...args);
    const saveFavoriteOrder = (...args) => ctx2.saveFavoriteOrder(...args);
    const resetFavoriteOrder = (...args) => ctx2.resetFavoriteOrder(...args);
    const unreadHeat = (...args) => ctx2.unreadHeat(...args);
    const openThread = (...args) => ctx2.openThread(...args);
    const closeThread = (...args) => ctx2.closeThread(...args);
    const startBoardVisitFromFavorite = (...args) => ctx2.startBoardVisitFromFavorite(...args);
    const requestBokounFullscreen = (...args) => ctx2.requestBokounFullscreen(...args);
    const requestStructuredRefresh = (...args) => ctx2.requestStructuredRefresh(...args);
    const disableBokoun = (...args) => ctx2.disableBokoun(...args);
    function escapeHtml(value) {
      const div = document.createElement("div");
      div.textContent = value ?? "";
      return div.innerHTML;
    }
    function signatureFor(type, model) {
      if (type === "favorites") {
        return [
          routeKey(),
          JSON.stringify(currentDisplaySettings()),
          JSON.stringify(currentFavoritesSettings()),
          JSON.stringify(currentRecentClubs()),
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
        JSON.stringify(currentRecentClubs()),
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
    function modeSwitchButton() {
      return `
      <button
        class="icon-button mode-switch"
        type="button"
        data-action="mode-switch"
        aria-label="Přepnout do plné Kapybary"
        title="Přepnout do plné Kapybary"
      >
        <span aria-hidden="true">◐</span>
      </button>
    `;
    }
    function clubStripMarkup(currentTitle = "") {
      const display = currentDisplaySettings();
      if (display.interfacePreset !== "compact-reader" || !display.showClubStrip) return "";
      const activeClub = normalizeClubRoute(location.pathname);
      const favoritesActive = routeType() === "favorites";
      const recent = currentRecentClubs();
      const candidates = favoritesActive ? [{
        href: "/fav/activity",
        name: "Oblíbené",
        active: true
      }, ...recent] : [{
        href: activeClub,
        name: currentTitle || recent.find((club) => club.href === activeClub)?.name || "Klub",
        active: true
      }, ...recent];
      const seen = /* @__PURE__ */ new Set();
      const links = candidates.filter((link) => {
        const href = normalizeClubRoute(link.href) || link.href;
        if (!href || seen.has(href)) return false;
        seen.add(href);
        return true;
      }).slice(0, favoritesActive ? 7 : 6).map((link) => ({
        ...link,
        active: favoritesActive ? link.href === "/fav/activity" : normalizeClubRoute(link.href) === activeClub
      }));
      return `
      <nav class="club-strip" aria-label="Rychlé přepínání klubů">
        ${links.map((link) => `
          <a
            class="club-strip-link${link.active ? " club-strip-link--active" : ""}"
            href="${escapeHtml(link.href)}"
            data-native-href="${escapeHtml(link.href)}"
            ${link.active ? 'aria-current="page"' : ""}
          >${escapeHtml(link.name)}</a>
        `).join("")}
      </nav>
    `;
    }
    function favoritesMarkup(clubs) {
      const favorites = currentFavoritesSettings();
      const editing = favorites.sort === "manual" && state2.editingFavoriteOrder;
      const showCount = ["count", "both"].includes(favorites.unreadMode);
      const showHeat = ["heat", "both"].includes(favorites.unreadMode);
      const rows = clubs.length ? clubs.map((club) => {
        const heat = showHeat ? unreadHeat(club.unread) : "";
        const unreadClass = club.unread ? " favorite-row--unread" : "";
        const heatClass = heat ? ` favorite-row--heat-${heat}` : "";
        const unreadLabel = club.unread ? `${club.unread} nových příspěvků` : "bez nových příspěvků";
        return `
          <li
            class="favorite-item${editing ? " favorite-item--editing" : ""}"
            data-favorite-href="${escapeHtml(club.href)}"
          >
            <a
              class="favorite-row${unreadClass}${heatClass}"
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
        ${overflowControlMarkup("favorites")}
        ${modeSwitchButton()}
      </header>
      ${clubStripMarkup()}
      <div class="route-content">
        <ul class="favorites">${rows}</ul>
      </div>
    `;
    }
    function overflowControlMarkup(type) {
      const open = state2.openHeaderPanel === "overflow";
      return `
      <div class="header-control overflow-control">
        <button
          class="icon-button header-panel-toggle overflow-toggle"
          type="button"
          data-action="overflow"
          aria-label="Další možnosti"
          aria-expanded="${open ? "true" : "false"}"
          title="Další možnosti"
        ><span aria-hidden="true">⋮</span></button>
        ${activeHeaderPanelMarkup(type)}
      </div>
    `;
    }
    function activeHeaderPanelMarkup(type) {
      if (state2.openHeaderPanel === "overflow") return overflowMenuMarkup(type);
      if (state2.openHeaderPanel === "favorite-sort") return favoriteSortPanelMarkup();
      if (state2.openHeaderPanel === "favorites-appearance") return favoritesPanelMarkup();
      if (state2.openHeaderPanel === "font") return fontPanelMarkup();
      if (state2.openHeaderPanel === "display") return displayPanelMarkup();
      if (state2.openHeaderPanel === "settings") return bokounSettingsPanelMarkup();
      return "";
    }
    function overflowMenuMarkup(type) {
      const favorites = type === "favorites";
      const unreadOnly = currentFavoritesSettings().unreadOnly;
      return `
      <div class="header-panel overflow-menu" role="menu" aria-label="${favorites ? "Možnosti oblíbených" : "Možnosti klubu"}">
        ${favorites ? `
          <button type="button" role="menuitem" data-action="open-panel" data-panel="favorite-sort">Řazení…</button>
          <button
            type="button"
            role="menuitemcheckbox"
            aria-checked="${unreadOnly ? "true" : "false"}"
            data-action="toggle-unread-only"
          ><span>Pouze nepřečtené</span><span aria-hidden="true">${unreadOnly ? "✓" : ""}</span></button>
          <button type="button" role="menuitem" data-action="edit-favorite-order">${state2.editingFavoriteOrder ? "Dokončit pořadí" : "Upravit pořadí"}</button>
          <button type="button" role="menuitem" data-action="open-panel" data-panel="favorites-appearance">Písmo a vzhled…</button>
        ` : `
          <button type="button" role="menuitem" data-action="refresh">Obnovit</button>
          <button type="button" role="menuitem" data-action="header-newest">Přejít na nejnovější</button>
          <button type="button" role="menuitem" data-action="open-panel" data-panel="font">Písmo a vzhled…</button>
          <button type="button" role="menuitem" data-action="open-panel" data-panel="display">Zobrazení příspěvků…</button>
        `}
        <button type="button" role="menuitem" data-action="full">Plná Kapybara</button>
        <button type="button" role="menuitem" data-action="open-panel" data-panel="settings">Nastavení Bokouna…</button>
        <button type="button" role="menuitem" class="overflow-danger" data-action="disable-bokoun">Vypnout Bokouna</button>
      </div>
    `;
    }
    function favoriteSortPanelMarkup() {
      const favorites = currentFavoritesSettings();
      return `
      <section class="header-panel favorites-panel" aria-label="Řazení oblíbených">
        <header class="panel-head">
          <strong>Řazení</strong>
          <button type="button" data-action="close-header-panel" aria-label="Zavřít">×</button>
        </header>
        <label class="settings-field">
          <span>Pořadí</span>
          <select data-setting="favorites-sort" aria-label="Řazení oblíbených">
            <option value="activity" ${favorites.sort === "activity" ? "selected" : ""}>Aktivita + nové</option>
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
        ${favorites.sort === "manual" ? `
          <div class="panel-actions">
            <button type="button" data-action="edit-favorite-order">
              ${state2.editingFavoriteOrder ? "Hotovo" : "Upravit pořadí"}
            </button>
            <button type="button" data-action="reset-favorite-order">Obnovit pořadí</button>
          </div>
        ` : ""}
      </section>
    `;
    }
    function favoritesPanelMarkup() {
      const favorites = currentFavoritesSettings();
      const display = currentDisplaySettings();
      const customFont = favorites.fontFamily === "custom";
      const normalizedCustomFont = normalizeCustomFamily(favorites.customFontFamily);
      const invalidCustomFont = Boolean(favorites.customFontFamily.trim() && !normalizedCustomFont);
      return `
      <section class="header-panel favorites-panel" aria-label="Písmo a vzhled oblíbených">
        <header class="panel-head">
          <strong>Písmo a vzhled</strong>
          <button type="button" data-action="close-header-panel" aria-label="Zavřít">×</button>
        </header>
        ${interfaceAppearanceMarkup(display)}
        <div class="panel-section-title">Oblíbené</div>
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
        <div class="panel-actions">
          <button type="button" data-action="reset-favorites-appearance">Obnovit vzhled</button>
        </div>
      </section>
    `;
    }
    function setHeaderPanel(panel = "") {
      const previous = state2.openHeaderPanel;
      const next = previous === panel ? "" : panel;
      if (next && !previous) {
        const historyState = history.state && typeof history.state === "object" ? history.state : {};
        history.pushState({ ...historyState, bokounHeaderPanel: true }, "", location.href);
      } else if (!next && previous && history.state?.bokounHeaderPanel) {
        history.back();
      }
      state2.openHeaderPanel = next;
      state2.openPostMenuId = "";
      state2.currentSignature = "";
      scheduleRender({ force: true });
      window.setTimeout(() => {
        if (!state2.shadow) return;
        const target = state2.openHeaderPanel ? state2.shadow.querySelector(".header-panel button, .header-panel select, .header-panel input") : state2.shadow.querySelector("[data-action='overflow']");
        target?.focus();
      }, 60);
    }
    function setPostMenu(postId = "") {
      state2.openPostMenuId = state2.openPostMenuId === String(postId) ? "" : String(postId);
      state2.openHeaderPanel = "";
      state2.currentSignature = "";
      scheduleRender({ force: true });
    }
    function fontPanelMarkup() {
      const font = currentFontSettings();
      const display = currentDisplaySettings();
      const custom = font.family === "custom";
      const options = fontOptionsMarkup(font.family);
      const normalizedCustom = normalizeCustomFamily(font.customFamily);
      const invalidCustom = Boolean(font.customFamily.trim() && !normalizedCustom);
      return `
      <section class="header-panel font-panel" aria-label="Nastavení písma">
        <header class="panel-head">
          <strong>Písmo a vzhled</strong>
          <button type="button" data-action="close-header-panel" aria-label="Zavřít">×</button>
        </header>
        ${interfaceAppearanceMarkup(display)}
        <div class="panel-section-title">Příspěvky</div>
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
        <div class="settings-field">
          <span>Hustota</span>
          <span class="compact-range-controls">
            <input type="range" min="4" max="24" step="1" value="${escapeHtml(display.postSpacing)}" aria-label="Svislé odsazení příspěvků">
            <output>${escapeHtml(display.postSpacing)} px</output>
          </span>
        </div>
        <div class="panel-actions">
          <button type="button" data-action="reset-font">Obnovit písmo</button>
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
        <div class="panel-section-title">Příspěvky</div>
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
          <span>Odsazení</span>
          <span class="compact-range-controls">
            <input type="range" min="4" max="24" step="1" value="${escapeHtml(display.postSpacing)}" aria-label="Svislé odsazení příspěvků">
            <output>${escapeHtml(display.postSpacing)} px</output>
          </span>
        </div>
        <label class="settings-switch">
          <span>Oddělovače příspěvků</span>
          <input
            type="checkbox"
            data-setting="post-separators"
            ${display.postSeparators ? "checked" : ""}
          >
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
        <label class="settings-switch">
          <span>Porovnávací madlo</span>
          <input
            type="checkbox"
            data-setting="compare-handle"
            ${display.compareHandle ? "checked" : ""}
          >
        </label>
        <label class="settings-switch">
          <span>Při vstupu přeskočit na první nepřečtený</span>
          <input
            type="checkbox"
            data-setting="first-unread"
            ${display.firstUnread ? "checked" : ""}
          >
        </label>
        <p class="settings-note">Tažením svislé čáry porovnáte Bokouna s živou Kapybarou pod ním.</p>
        <p class="settings-note">Kliknutí na avatar nebo jméno otevře nabídku příspěvku.</p>
      </section>
    `;
    }
    function interfaceAppearanceMarkup(display) {
      return `
      <label class="settings-field settings-field--wide-label">
        <span>Rozhraní</span>
        <select data-setting="interface-preset" aria-label="Vzhled rozhraní">
          <option value="default" ${display.interfacePreset === "default" ? "selected" : ""}>Výchozí Bokoun</option>
          <option value="compact-reader" ${display.interfacePreset === "compact-reader" ? "selected" : ""}>Kompaktní čtečka</option>
        </select>
      </label>
      <label class="settings-field settings-field--wide-label">
        <span>Barvy</span>
        <select data-setting="color-scheme" aria-label="Barevný režim">
          <option value="system" ${display.colorScheme === "system" ? "selected" : ""}>Podle systému</option>
          <option value="light" ${display.colorScheme === "light" ? "selected" : ""}>Světlý</option>
          <option value="dark" ${display.colorScheme === "dark" ? "selected" : ""}>Tmavý</option>
        </select>
      </label>
    `;
    }
    function bokounSettingsPanelMarkup() {
      const display = currentDisplaySettings();
      return `
      <section class="header-panel settings-panel" aria-label="Nastavení Bokouna">
        <header class="panel-head">
          <strong>Nastavení Bokouna</strong>
          <button type="button" data-action="close-header-panel" aria-label="Zavřít">×</button>
        </header>
      <label class="settings-switch">
        <span>Lišta klubů</span>
        <input
          type="checkbox"
          data-setting="show-club-strip"
          ${display.showClubStrip ? "checked" : ""}
          ${display.interfacePreset === "compact-reader" ? "" : "disabled"}
        >
      </label>
      <label class="settings-switch">
        <span>Přechody stránek</span>
        <input
          type="checkbox"
          data-setting="page-transitions"
          ${display.pageTransitions ? "checked" : ""}
          ${display.interfacePreset === "compact-reader" ? "" : "disabled"}
        >
      </label>
      <label class="settings-switch">
        <span>Celá obrazovka</span>
        <input
          type="checkbox"
          data-setting="fullscreen-mode"
          ${display.fullscreenMode ? "checked" : ""}
        >
      </label>
      <p class="settings-note">Prohlížeč povolí celou obrazovku po prvním klepnutí v Bokounu.</p>
      <p class="settings-note">Kompaktní čtečka mění pouze vzhled; vaše písmo, avatary a řazení zůstanou zachované.</p>
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
        <button class="icon-button" type="button" data-action="compose" aria-label="Napsat příspěvek">${ICONS2.write}</button>
        ${overflowControlMarkup("board")}
        ${modeSwitchButton()}
      </header>
      ${clubStripMarkup(board.title)}
      <div class="route-content">
        ${threadMode ? `<div class="thread-banner" role="status">Vlákno · ${board.threadCount} příspěvků</div>` : ""}
        ${feedbackMarkup}
        ${newComposer}
        <section class="posts${replyingTo ? " is-replying" : ""}" aria-label="Příspěvky">${posts}</section>
        <footer class="board-tail">${tailState}${newest}</footer>
      </div>
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
      state2.shadow.querySelector("[data-action='mode-switch']")?.addEventListener("click", openFullKapybara);
      state2.shadow.querySelector("[data-action='full']")?.addEventListener("click", () => {
        setHeaderPanel("");
        void openFullKapybara();
      });
      state2.shadow.querySelector("[data-action='back']")?.addEventListener("click", () => {
        if (state2.openHeaderPanel) setHeaderPanel("");
        else goBack();
      });
      state2.shadow.querySelector("[data-action='thread-back']")?.addEventListener("click", () => {
        if (state2.openHeaderPanel) setHeaderPanel("");
        else closeThread();
      });
      state2.shadow.querySelector("[data-action='compose']")?.addEventListener("click", () => openComposer("new"));
      state2.shadow.querySelector("[data-action='overflow']")?.addEventListener("click", () => {
        setHeaderPanel("overflow");
      });
      state2.shadow.querySelectorAll("[data-action='open-panel']").forEach((button) => {
        button.addEventListener("click", () => setHeaderPanel(button.dataset.panel));
      });
      state2.shadow.querySelector("[data-action='close-header-panel']")?.addEventListener("click", () => setHeaderPanel(""));
      state2.shadow.querySelector("[data-action='refresh']")?.addEventListener("click", () => {
        setHeaderPanel("");
        void requestStructuredRefresh("manual-refresh", { force: true });
      });
      state2.shadow.querySelector("[data-action='header-newest']")?.addEventListener("click", () => {
        setHeaderPanel("");
        state2.scroller?.scrollTo({ top: 0, behavior: "smooth" });
      });
      state2.shadow.querySelector("[data-action='toggle-unread-only']")?.addEventListener("click", () => {
        updateFavoritesSettings({ unreadOnly: !currentFavoritesSettings().unreadOnly });
      });
      state2.shadow.querySelector("[data-action='edit-favorite-order']")?.addEventListener("click", () => {
        const enteringEditMode = !state2.editingFavoriteOrder;
        updateFavoritesSettings(
          { sort: "manual" },
          { clubs: state2.favoriteSourceClubs, render: false }
        );
        state2.editingFavoriteOrder = enteringEditMode;
        setHeaderPanel("");
        state2.currentSignature = "";
        scheduleRender({ force: true });
      });
      state2.shadow.querySelector("[data-action='disable-bokoun']")?.addEventListener("click", () => {
        setHeaderPanel("");
        disableBokoun();
      });
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
      state2.shadow.querySelector("[data-setting='interface-preset']")?.addEventListener("change", (event) => {
        updateDisplaySettings({ interfacePreset: event.currentTarget.value });
      });
      state2.shadow.querySelector("[data-setting='color-scheme']")?.addEventListener("change", (event) => {
        updateDisplaySettings({ colorScheme: event.currentTarget.value });
      });
      state2.shadow.querySelector("[data-setting='show-club-strip']")?.addEventListener("change", (event) => {
        updateDisplaySettings({ showClubStrip: event.currentTarget.checked });
      });
      state2.shadow.querySelector("[data-setting='page-transitions']")?.addEventListener("change", (event) => {
        updateDisplaySettings({ pageTransitions: event.currentTarget.checked });
      });
      state2.shadow.querySelector("[data-setting='fullscreen-mode']")?.addEventListener("change", (event) => {
        updateDisplaySettings({ fullscreenMode: event.currentTarget.checked });
        if (event.currentTarget.checked) void requestBokounFullscreen({ force: true });
      });
      state2.shadow.querySelector("[data-setting='avatar-position']")?.addEventListener("change", (event) => {
        updateDisplaySettings({ avatarPosition: event.currentTarget.value });
      });
      state2.shadow.querySelector("[data-setting='avatar-shape']")?.addEventListener("change", (event) => {
        updateDisplaySettings({ avatarShape: event.currentTarget.value });
      });
      const postSpacingRange = state2.shadow.querySelector("[aria-label='Svislé odsazení příspěvků']");
      postSpacingRange?.addEventListener("input", (event) => {
        updateDisplaySettings({ postSpacing: event.currentTarget.value }, { render: false });
        const output = event.currentTarget.parentElement?.querySelector("output");
        if (output) output.textContent = `${event.currentTarget.value} px`;
      });
      postSpacingRange?.addEventListener("change", (event) => {
        updateDisplaySettings({ postSpacing: event.currentTarget.value });
      });
      state2.shadow.querySelector("[data-setting='post-separators']")?.addEventListener("change", (event) => {
        updateDisplaySettings({ postSeparators: event.currentTarget.checked });
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
      state2.shadow.querySelector("[data-setting='compare-handle']")?.addEventListener("change", (event) => {
        updateDisplaySettings({ compareHandle: event.currentTarget.checked }, { render: false });
      });
      state2.shadow.querySelector("[data-setting='first-unread']")?.addEventListener("change", (event) => {
        resetFirstUnread();
        updateDisplaySettings({ firstUnread: event.currentTarget.checked });
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
          if (link.matches("[aria-current='page']")) return;
          if (link.closest(".favorite-item")) {
            startBoardVisitFromFavorite(
              href,
              link.dataset.unreadCount,
              link.dataset.boardId
            );
          } else if (link.closest(".club-strip")) {
            const normalizedHref = normalizeClubRoute(href);
            const favorite = normalizedHref && state2.favoriteSourceClubs.find(
              (club) => normalizeClubRoute(club.href) === normalizedHref
            );
            if (favorite) {
              startBoardVisitFromFavorite(
                favorite.href,
                favorite.unread,
                favorite.id
              );
            }
          }
          navigateNative(href);
        });
      }
      attachFavoriteReordering();
      const inner = state2.shadow.querySelector(".app-inner");
      inner.onpointerdown = (event) => {
        if (state2.openPostMenuId && !event.target.closest(".post-menu, .post-menu-trigger")) setPostMenu("");
        if (state2.openHeaderPanel && !event.target.closest(".header-panel, .header-panel-toggle")) setHeaderPanel("");
      };
      state2.shadow.onkeydown = (event) => {
        if (event.key === "Escape") {
          if (state2.openPostMenuId) setPostMenu("");
          else if (state2.openHeaderPanel) setHeaderPanel("");
          return;
        }
        const menu = event.target.closest(".overflow-menu");
        if (!menu || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
        const items = [...menu.querySelectorAll("[role^='menuitem']:not([disabled])")];
        if (!items.length) return;
        event.preventDefault();
        const current = items.indexOf(event.target);
        const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : (current + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        items[next].focus();
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
      modeSwitchButton,
      favoritesMarkup,
      clubStripMarkup,
      overflowControlMarkup,
      overflowMenuMarkup,
      favoriteSortPanelMarkup,
      favoritesPanelMarkup,
      boardMarkup,
      composerMarkup,
      attachUiEvents,
      setHeaderPanel,
      setPostMenu,
      fontPanelMarkup,
      displayPanelMarkup,
      avatarImageMarkup,
      postMenuMarkup,
      replyMetaMarkup,
      attachFavoriteReordering
    });
  }

  // src/navigation.js
  function preserveForcedBokounMode(href, currentHref, origin = "") {
    try {
      const base = origin || (typeof location !== "undefined" ? location.origin : "https://kapybara.okoun.cz");
      const target = new URL(href, base);
      const current = new URL(currentHref, base);
      const supported = target.pathname === "/fav/activity" || target.pathname === "/fav/topics" || /^\/boards\/[^/]+\/?$/.test(target.pathname);
      if (supported && current.searchParams.get("bokoun") === "on" && !target.searchParams.has("bokoun")) {
        target.searchParams.set("bokoun", "on");
      }
      return target;
    } catch {
      return new URL(href, origin || "https://kapybara.okoun.cz");
    }
  }
  function sameFavoriteRoute(left, right, origin = "") {
    try {
      const base = origin || (typeof location !== "undefined" ? location.origin : "https://kapybara.okoun.cz");
      const leftUrl = new URL(left, base);
      const rightUrl = new URL(right, base);
      return leftUrl.origin === rightUrl.origin && leftUrl.pathname.replace(/\/$/, "") === rightUrl.pathname.replace(/\/$/, "");
    } catch {
      return false;
    }
  }
  function transitionRouteKey(value, origin = "") {
    try {
      const base = origin || (typeof location !== "undefined" ? location.origin : "https://kapybara.okoun.cz");
      const url = new URL(value, base);
      if (url.origin !== base) return "";
      if (url.pathname === "/fav/activity" || url.pathname === "/fav/topics") {
        return "/fav/activity";
      }
      if (!/^\/boards\/[^/]+\/?$/.test(url.pathname)) return "";
      const rootId = url.searchParams.get("rootId");
      const path = url.pathname.replace(/\/$/, "");
      return rootId && /^\d+$/.test(rootId) ? `${path}?rootId=${rootId}` : path;
    } catch {
      return "";
    }
  }
  function inferNavigationDirection(from, to, { historyTraversal = false } = {}) {
    const fromKey = transitionRouteKey(from);
    const toKey = transitionRouteKey(to);
    if (!fromKey || !toKey || fromKey === toKey) return "";
    const fromFavorite = fromKey === "/fav/activity";
    const toFavorite = toKey === "/fav/activity";
    if (fromFavorite && !toFavorite) return "forward";
    if (!fromFavorite && toFavorite) return "back";
    const fromThread = fromKey.includes("?rootId=");
    const toThread = toKey.includes("?rootId=");
    if (!fromThread && toThread) return "forward";
    if (fromThread && !toThread) return "back";
    if (historyTraversal) return "back";
    return "lateral";
  }
  function installNavigation(ctx2) {
    const {
      HOST_ID: HOST_ID2,
      RETURN_HOST_ID: RETURN_HOST_ID2,
      BOOT_TIMEOUT_MS: BOOT_TIMEOUT_MS2,
      NAVIGATION_INTENT_KEY: NAVIGATION_INTENT_KEY2 = "bokoun.navigation-intent.v1",
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
    const setLayered = (...args) => ctx2.setLayered(...args);
    const setHostReveal = (...args) => ctx2.setHostReveal(...args);
    const revealBokoun = (...args) => ctx2.revealBokoun(...args);
    const currentDisplaySettings = (...args) => ctx2.currentDisplaySettings(...args);
    const prefersReducedMotion = (...args) => ctx2.prefersReducedMotion(...args);
    function transitionsEnabled() {
      const display = currentDisplaySettings();
      return display.interfacePreset === "compact-reader" && display.pageTransitions;
    }
    function prepareNavigationTransition(href, {
      direction = "",
      sourceHref = location.href,
      persist = true,
      preserveExisting = false
    } = {}) {
      if (!transitionsEnabled()) {
        state2.pendingNavigationIntent = null;
        if (persist) sessionStorage.removeItem(NAVIGATION_INTENT_KEY2);
        return null;
      }
      const target = transitionRouteKey(href, location.origin);
      const source = transitionRouteKey(sourceHref, location.origin);
      if (!target || !source || target === source) return null;
      if (preserveExisting && state2.pendingNavigationIntent?.target === target && Date.now() - state2.pendingNavigationIntent.createdAt < 5e3) return state2.pendingNavigationIntent;
      const resolvedDirection = ["forward", "back", "lateral"].includes(direction) ? direction : inferNavigationDirection(source, target);
      if (!resolvedDirection) return null;
      const intent = {
        source,
        target,
        direction: resolvedDirection,
        createdAt: Date.now()
      };
      state2.pendingNavigationIntent = intent;
      if (persist) sessionStorage.setItem(NAVIGATION_INTENT_KEY2, JSON.stringify(intent));
      return intent;
    }
    function consumeNavigationTransition(href = location.href) {
      if (!transitionsEnabled()) {
        state2.pendingNavigationIntent = null;
        state2.navigationEntryTransitionConsumed = true;
        state2.routeTransitionAnimation?.cancel();
        state2.routeTransitionAnimation = null;
        state2.routeExitAnimation?.cancel();
        state2.routeExitAnimation = null;
        sessionStorage.removeItem(NAVIGATION_INTENT_KEY2);
        return "";
      }
      let intent = state2.pendingNavigationIntent;
      if (!intent) {
        try {
          intent = JSON.parse(sessionStorage.getItem(NAVIGATION_INTENT_KEY2) || "null");
        } catch {
          intent = null;
        }
      }
      sessionStorage.removeItem(NAVIGATION_INTENT_KEY2);
      state2.pendingNavigationIntent = null;
      const target = transitionRouteKey(href, location.origin);
      const intentAge = Date.now() - Number(intent?.createdAt || 0);
      if (intent && intent.target === target && ["forward", "back", "lateral"].includes(intent.direction) && intentAge >= 0 && intentAge < 5e3) {
        state2.navigationEntryTransitionConsumed = true;
        return intent.direction;
      }
      if (state2.navigationEntryTransitionConsumed) return "";
      state2.navigationEntryTransitionConsumed = true;
      const navigation = performance.getEntriesByType?.("navigation")?.[0];
      return navigation?.type === "back_forward" ? "back" : "";
    }
    function animateRouteEntry(direction) {
      if (!["forward", "back", "lateral"].includes(direction)) return Promise.resolve();
      if (!transitionsEnabled() || prefersReducedMotion()) {
        state2.routeTransitionAnimation?.cancel();
        state2.routeTransitionAnimation = null;
        state2.routeExitAnimation?.cancel();
        state2.routeExitAnimation = null;
        return Promise.resolve();
      }
      const routeContainer = routeAnimationTarget();
      if (!routeContainer || typeof routeContainer.animate !== "function") {
        return Promise.resolve();
      }
      pinRouteBackground();
      state2.routeExitAnimation?.cancel();
      state2.routeExitAnimation = null;
      state2.routeTransitionAnimation?.cancel();
      const animation = routeContainer.animate(
        [
          { filter: "blur(12px)", opacity: 0.34 },
          { filter: "blur(0)", opacity: 1 }
        ],
        {
          duration: 190,
          easing: "cubic-bezier(.2,.72,.25,1)"
        }
      );
      state2.routeTransitionAnimation = animation;
      return animation.finished.catch(() => void 0).then(() => {
        if (state2.routeTransitionAnimation === animation) {
          state2.routeTransitionAnimation = null;
        }
      });
    }
    function animateRouteExit() {
      if (!transitionsEnabled() || prefersReducedMotion()) return Promise.resolve();
      const routeContainer = routeAnimationTarget();
      if (!routeContainer || typeof routeContainer.animate !== "function") {
        return Promise.resolve();
      }
      pinRouteBackground();
      state2.routeTransitionAnimation?.cancel();
      state2.routeTransitionAnimation = null;
      state2.routeExitAnimation?.cancel();
      const animation = routeContainer.animate(
        [
          { filter: "blur(0)", opacity: 1 },
          { filter: "blur(10px)", opacity: 0.34 }
        ],
        {
          duration: 130,
          easing: "cubic-bezier(.4,0,.8,.25)",
          fill: "forwards"
        }
      );
      state2.routeExitAnimation = animation;
      return animation.finished.catch(() => void 0);
    }
    function routeAnimationTarget() {
      return state2.shadow?.querySelector(".route-content") || state2.scroller;
    }
    function pinRouteBackground() {
      const background = state2.scroller ? getComputedStyle(state2.scroller).backgroundColor : "";
      if (state2.host && background && background !== "rgba(0, 0, 0, 0)") {
        state2.host.style.backgroundColor = background;
      }
    }
    function navigateNative(href, { direction = "" } = {}) {
      if (!href) return;
      saveScroll();
      const target = preserveForcedBokounMode(href, location.href, location.origin);
      prepareNavigationTransition(target.href, { direction });
      if (routeType() === "board" && target.pathname !== location.pathname) {
        leaveBoardVisit(location.pathname);
      }
      const nativeLink = target.searchParams.get("bokoun") === "on" ? null : [...document.querySelectorAll("a[href]")].find((link) => {
        if (link.closest(`#${HOST_ID2}`)) return false;
        try {
          return new URL(link.href, location.origin).href === target.href;
        } catch {
          return false;
        }
      });
      const commitSequence = ++state2.navigationCommitSequence;
      const performNavigation = () => {
        if (commitSequence !== state2.navigationCommitSequence) return;
        const previous = location.href;
        if (!nativeLink) {
          location.assign(target.href);
          return;
        }
        nativeLink.click();
        window.setTimeout(() => {
          if (commitSequence !== state2.navigationCommitSequence) return;
          if (location.href === previous) location.assign(target.href);
        }, 1200);
      };
      void animateRouteExit().then(performNavigation);
    }
    function goBack() {
      saveScroll();
      navigateNative("/fav/activity", { direction: "back" });
    }
    function openThread(rootId) {
      const normalized = String(rootId || "");
      if (!/^\d+$/.test(normalized) || routeType() !== "board") return;
      const target = new URL(routeKey(), location.origin);
      target.searchParams.delete("f");
      target.searchParams.set("rootId", normalized);
      navigateNative(`${target.pathname}${target.search}`, { direction: "forward" });
    }
    function closeThread() {
      if (routeType() !== "board") return;
      const target = new URL(routeKey(), location.origin);
      target.searchParams.delete("f");
      target.searchParams.delete("rootId");
      navigateNative(`${target.pathname}${target.search}`, { direction: "back" });
    }
    function captureBokounAnchor() {
      if (!state2.scroller || !state2.shadow) return null;
      const scrollerRect = state2.scroller.getBoundingClientRect();
      if (routeType() === "favorites") {
        const rows = [...state2.shadow.querySelectorAll(".favorite-item [data-native-href]")];
        const row = rows.find((item) => item.getBoundingClientRect().bottom > scrollerRect.top) || rows.at(-1);
        if (!row) return null;
        return {
          favoriteHref: row.getAttribute("data-native-href"),
          offset: row.getBoundingClientRect().top - scrollerRect.top,
          pageHref: routeKey()
        };
      }
      if (routeType() !== "board") return null;
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
      if (routeType() === "favorites") {
        const rows = [...document.querySelectorAll(SELECTORS2.favoriteRows)];
        const row = rows.find((item) => item.getBoundingClientRect().bottom > 0) || rows.at(-1);
        if (!row) return null;
        return {
          favoriteHref: row.getAttribute("href"),
          offset: row.getBoundingClientRect().top,
          pageHref: routeKey()
        };
      }
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
      if (!anchor) return;
      document.documentElement.dataset.bokounAligning = "true";
      const apply = () => {
        const target = routeType() === "favorites" ? [...document.querySelectorAll(SELECTORS2.favoriteRows)].find((row) => sameFavoriteRoute(row.getAttribute("href"), anchor.favoriteHref)) : nativePostById(anchor.postId) || [...document.querySelectorAll(SELECTORS2.posts)].at(-1);
        if (!target) return;
        const delta = target.getBoundingClientRect().top - anchor.offset;
        for (const scroller of /* @__PURE__ */ new Set([
          document.scrollingElement,
          document.documentElement,
          document.body
        ])) {
          if (!scroller) continue;
          scroller.scrollTop = Math.max(0, scroller.scrollTop + delta);
        }
      };
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          apply();
          window.setTimeout(() => {
            apply();
            delete document.documentElement.dataset.bokounAligning;
          }, 250);
        });
      });
    }
    function restoreBokounAnchor(anchor) {
      if (!anchor || !state2.scroller || !state2.shadow) return;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const items = routeType() === "favorites" ? [...state2.shadow.querySelectorAll(".favorite-item [data-native-href]")] : [...state2.shadow.querySelectorAll("[data-bokoun-post-id]")];
          const target = routeType() === "favorites" ? items.find((row) => sameFavoriteRoute(
            row.getAttribute("data-native-href"),
            anchor.favoriteHref
          )) : items.find((post) => post.getAttribute("data-bokoun-post-id") === String(anchor.postId)) || items.at(-1);
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
      const target = preserveForcedBokounMode(href, location.href, location.origin);
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
      if (!state2.nativeMode || state2.visualIntent === "bokoun-transition") return false;
      const anchor = captureNativeAnchor();
      sessionStorage.removeItem(SESSION_DISABLED_KEY2);
      document.getElementById(RETURN_HOST_ID2)?.remove();
      state2.nativeMode = false;
      state2.disabled = false;
      state2.visualIntent = "bokoun-transition";
      if (!isMobileEligible() || routeType() === "unsupported") return false;
      await waitForBody();
      setLayered("transition", true);
      mountShell();
      setHostReveal(0);
      state2.currentRouteKey = routeKey();
      observeNative();
      render({ force: true });
      restoreBokounAnchor(anchor);
      await revealBokoun();
      return true;
    }
    Object.assign(ctx2, {
      navigateNative,
      prepareNavigationTransition,
      consumeNavigationTransition,
      animateRouteEntry,
      animateRouteExit,
      routeAnimationTarget,
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
      FAVORITES_REFRESH_MS: FAVORITES_REFRESH_MS2 = 6e4,
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
    const structuredModelAge = (...args) => ctx2.structuredModelAge(...args);
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
    const currentFavoritesSettings = (...args) => ctx2.currentFavoritesSettings(...args);
    const boardRouteIdentity = (...args) => ctx2.boardRouteIdentity(...args);
    const navigateNative = (...args) => ctx2.navigateNative(...args);
    const leaveBoardVisit = (...args) => ctx2.leaveBoardVisit(...args);
    const readBoardVisit = (...args) => ctx2.readBoardVisit(...args);
    const reconcileFavoriteReadState = (...args) => ctx2.reconcileFavoriteReadState(...args);
    const syncBoardVisitRead = (...args) => ctx2.syncBoardVisitRead(...args);
    const revealBokoun = (...args) => ctx2.revealBokoun(...args);
    const completeBootHandoff = (...args) => ctx2.completeBootHandoff(...args);
    const setLayered = (...args) => ctx2.setLayered(...args);
    const setHostReveal = (...args) => ctx2.setHostReveal(...args);
    const rememberRecentClub = (...args) => ctx2.rememberRecentClub(...args);
    const prepareNavigationTransition = (...args) => ctx2.prepareNavigationTransition(...args);
    const consumeNavigationTransition = (...args) => ctx2.consumeNavigationTransition(...args);
    const animateRouteEntry = (...args) => ctx2.animateRouteEntry(...args);
    const visualLog = (...args) => ctx2.visualLog(...args);
    const clearVisualLog = (...args) => ctx2.clearVisualLog(...args);
    const watchVisualState = (...args) => ctx2.watchVisualState(...args);
    const commitLayerState = (...args) => ctx2.commitLayerState(...args);
    const maybeScrollFirstUnread = (...args) => ctx2.maybeScrollFirstUnread?.(...args);
    function requestStructuredRefresh(reason, { force = false } = {}) {
      const type = routeType();
      const key = routeKey();
      if (type === "unsupported") return Promise.resolve(null);
      return ensureStructuredModel(type, key, { reason, force });
    }
    function stopFavoritesRefresh() {
      clearTimeout(state2.favoritesRefreshTimer);
      state2.favoritesRefreshTimer = 0;
    }
    function scheduleFavoritesRefresh() {
      stopFavoritesRefresh();
      if (state2.disabled || state2.nativeMode || document.visibilityState === "hidden" || !["favorites", "board"].includes(routeType())) return;
      state2.favoritesRefreshTimer = window.setTimeout(async () => {
        state2.favoritesRefreshTimer = 0;
        if (state2.disabled || state2.nativeMode || document.visibilityState === "hidden" || !["favorites", "board"].includes(routeType())) return;
        try {
          await ensureStructuredModel("favorites", favoritesRefreshHref(), {
            reason: "favorites-poll",
            render: routeType() === "favorites"
          });
        } finally {
          scheduleFavoritesRefresh();
        }
      }, FAVORITES_REFRESH_MS2);
    }
    function favoritesRefreshHref() {
      const url = new URL("/fav/activity", location.origin);
      if (new URL(location.href).searchParams.get("bokoun") === "on") {
        url.searchParams.set("bokoun", "on");
      }
      return `${url.pathname}${url.search}`;
    }
    function exposeDebugTools() {
      if (typeof window === "undefined") return;
      Object.defineProperty(window, "__bokounDebug", {
        configurable: true,
        value: Object.freeze({
          snapshot: () => trafficSnapshot(),
          reset: () => resetTrafficCounters(),
          refresh: () => requestStructuredRefresh("manual-refresh", { force: true }),
          measure: () => measureRenderScale(),
          visualLog: () => visualLog(),
          clearVisualLog: () => clearVisualLog(),
          watchVisualState: (enabled) => watchVisualState(enabled)
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
        stopFavoritesRefresh();
        revealNative();
        return;
      }
      if (type === "favorites" && location.pathname !== "/fav/activity") {
        navigateNative("/fav/activity");
        return;
      }
      if (!state2.host?.isConnected) mountShell();
      applyVisualSettings();
      commitLayerState("render-settings-applied");
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
        if (currentFavoritesSettings().unreadOnly) {
          model = model.filter((club) => club.unread > 0);
        }
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
        rememberRecentClub(location.pathname, model.title);
      }
      const signature = signatureFor(type, model);
      if (!force && signature === state2.currentSignature) return;
      state2.currentRouteKey = key;
      state2.currentSignature = signature;
      state2.host.dataset.readSource = readSource;
      const inner = state2.shadow.querySelector(".app-inner");
      inner.innerHTML = type === "favorites" ? favoritesMarkup(model) : boardMarkup(model);
      attachUiEvents();
      commitLayerState("render-committed");
      const transitionDirection = consumeNavigationTransition(key);
      const scrollReady = restoreScroll(key, previousKey === key ? previousY : 0);
      maybeScrollFirstUnread({ model, key, restorePromise: scrollReady });
      if (transitionDirection) {
        void scrollReady.then(() => {
          if (state2.currentRouteKey !== key) return;
          const animation = animateRouteEntry(transitionDirection);
          if (state2.revealPending) {
            void Promise.all([
              animation,
              revealBokoun({ initial: true, instant: true })
            ]).then(([, revealed]) => {
              if (revealed && state2.currentRouteKey === key) void completeBootHandoff();
            });
          }
          return animation;
        });
      } else if (state2.revealPending) {
        void revealBokoun({ initial: true, instant: true }).then((revealed) => {
          if (revealed && state2.currentRouteKey === key) void completeBootHandoff();
        });
      }
    }
    function scheduleRender({ force = false } = {}) {
      clearTimeout(state2.renderTimer);
      state2.renderTimer = window.setTimeout(() => render({ force }), 40);
    }
    function handleRouteChange() {
      if (state2.disabled || state2.nativeMode) return;
      const key = routeKey();
      if (key === state2.currentRouteKey) return;
      prepareNavigationTransition(key, {
        direction: state2.historyTraversalPending ? "back" : "",
        sourceHref: state2.currentRouteKey,
        persist: false,
        preserveExisting: true
      });
      state2.historyTraversalPending = false;
      finalizeBoardVisitTransition(state2.currentRouteKey, key);
      saveScroll();
      state2.currentSignature = "";
      state2.openHeaderPanel = "";
      state2.openPostMenuId = "";
      state2.editingFavoriteOrder = false;
      clearTimeout(state2.routeFallbackTimer);
      if (routeType() === "unsupported" || !isMobileEligible()) {
        stopFavoritesRefresh();
        state2.currentRouteKey = key;
        revealNative();
        return;
      }
      state2.currentRouteKey = key;
      const type = routeType();
      scheduleFavoritesRefresh();
      const reusePolledFavorites = type === "favorites" && structuredModelAge(type, key) < FAVORITES_REFRESH_MS2;
      abortStructuredRequests(reusePolledFavorites ? type : "", reusePolledFavorites ? key : "");
      if (!reusePolledFavorites) invalidateStructuredModel(type, key);
      if (!state2.host?.isConnected) mountShell();
      const outgoingRoute = state2.shadow.querySelector(".route-content");
      if (outgoingRoute) {
        outgoingRoute.dataset.routePending = "true";
        outgoingRoute.setAttribute("aria-busy", "true");
        outgoingRoute.inert = true;
      }
      commitLayerState("route-waiting-committed");
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
      stopFavoritesRefresh();
      state2.observer?.disconnect();
      state2.observedNativeRoot = null;
    }
    function resumeNativeObservation() {
      if (!state2.observing || state2.disabled || state2.nativeMode) return;
      connectNativeObserver();
      startRouteFallback();
      scheduleFavoritesRefresh();
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
      state2.popStateHandler = () => {
        if (state2.openHeaderPanel && routeKey() === state2.currentRouteKey) {
          state2.openHeaderPanel = "";
          state2.currentSignature = "";
          scheduleRender({ force: true });
          return;
        }
        state2.historyTraversalPending = true;
        queueRouteCheck();
      };
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
      state2.revealPending = true;
      setLayered("transition", true);
      mountShell();
      setHostReveal(0);
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
      stopFavoritesRefresh,
      scheduleFavoritesRefresh,
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
  installFirstUnread(ctx);
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
