export const STYLES = `
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

  .favorite-item {
    position: relative;
  }

  .favorite-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 14px;
    align-items: center;
    min-height: 72px;
    padding-right: 0;
    padding-left: 0;
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
    position: relative;
    display: flex;
    flex-wrap: wrap;
    gap: 5px 12px;
    align-items: center;
    margin-bottom: 11px;
  }

  .post-author {
    display: inline-flex;
    gap: 7px;
    align-items: center;
    min-width: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--text);
    font-size: 16px;
    font-weight: 700;
    line-height: 1.3;
    cursor: pointer;
    text-align: left;
  }

  .post-date {
    color: var(--muted);
    font-size: 14px;
    font-variant-numeric: tabular-nums;
    font-weight: 400;
    line-height: 1.3;
  }

  .reply-reference {
    margin: 10px 0 0;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.35;
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
    grid-template-columns: 48px minmax(0, 1fr);
    gap: 12px;
    align-items: start;
  }

  .post-avatar-trigger {
    display: grid;
    width: 48px;
    height: 48px;
    place-items: center;
    padding: 0;
    overflow: hidden;
    border: 0;
    border-radius: 50%;
    background: #f3f4f6;
    cursor: pointer;
  }

  .post-avatar {
    display: block;
    object-fit: cover;
    border-radius: 50%;
    background: #f3f4f6;
    color: var(--muted);
    font-weight: 700;
    text-align: center;
  }

  .post-avatar--inline {
    width: 26px;
    height: 26px;
    flex: 0 0 26px;
    font-size: 12px;
    line-height: 26px;
  }

  .post-avatar--left {
    width: 48px;
    height: 48px;
    font-size: 18px;
    line-height: 48px;
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
      grid-template-columns: 42px minmax(0, 1fr);
      gap: 10px;
    }

    .post-avatar-trigger,
    .post-avatar--left {
      width: 42px;
      height: 42px;
    }

    .post-avatar--left {
      line-height: 42px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loading::after {
      animation-duration: 1.8s;
    }
  }
`;
