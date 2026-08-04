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
    /* Keep browser pinch-zoom available, including while the document is fullscreen. */
    touch-action: pan-x pan-y pinch-zoom;
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
    grid-template-columns: 44px minmax(0, 1fr) 44px 44px 44px 44px;
    padding-left: 4px;
    padding-right: 0;
  }

  .topbar--favorites {
    grid-template-columns: minmax(0, 1fr) 44px 44px 44px;
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
    background: var(--post-new, #fff);
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

  .post--thread-focus {
    background: #fff;
    box-shadow: inset 3px 0 #a85a00;
  }

  .post--thread-reply {
    background: #edf4ff;
    box-shadow: inset 3px 0 #8baee8;
  }

  .post--thread-branch[data-thread-tone="0"] {
    --thread-branch-tint: color-mix(in srgb, var(--post-thread, #edf4ff) 91%, #cf8b42);
  }

  .post--thread-branch[data-thread-tone="1"] {
    --thread-branch-tint: color-mix(in srgb, var(--post-thread, #edf4ff) 91%, #6ca377);
  }

  .post--thread-branch[data-thread-tone="2"] {
    --thread-branch-tint: color-mix(in srgb, var(--post-thread, #edf4ff) 91%, #747fbd);
  }

  .post--thread-branch[data-thread-tone="3"] {
    --thread-branch-tint: color-mix(in srgb, var(--post-thread, #edf4ff) 91%, #a46f9a);
  }

  .post--thread-branch {
    background: var(--thread-branch-tint, var(--post-thread, #edf4ff));
    cursor: pointer;
  }

  .post--thread-branch-active {
    box-shadow: inset 3px 0 var(--accent);
  }

  .post--thread-muted {
    cursor: default;
  }

  .post--thread-muted .post-layout {
    visibility: hidden;
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
    right: 0;
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
      grid-template-columns: 40px minmax(0, 1fr) 40px 40px 40px 40px;
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

  /* Kapybara-compatible color schemes. */
  .app[data-color-scheme="traditional"] {
    --bg: #dce8fa;
    --surface: #e8f0fc;
    --surface-raised: #ffffff;
    --text: #000000;
    --muted: #40516a;
    --border: #9aaac1;
    --accent: #8a4f00;
    --accent-soft: #f3dfbd;
    --link: #164f91;
    --post-read: #dce8fa;
    --post-new: #ffffff;
    --post-reply: #eef4fd;
    --post-thread: #d1e0f5;
    --code-bg: #d2e0f4;
    --header-bg: rgba(232, 240, 252, 0.98);
    color-scheme: light;
  }

  .app[data-color-scheme="light"] {
    --bg: #ffffff;
    --surface: #ffffff;
    --surface-raised: #ffffff;
    --text: #000000;
    --muted: #5f6368;
    --border: #c7c7c7;
    --accent: #8a4f00;
    --accent-soft: #f1e2cd;
    --link: #164f91;
    --post-read: #ffffff;
    --post-new: #ffffff;
    --post-reply: #f5f5f5;
    --post-thread: #eeeeee;
    --code-bg: #eeeeee;
    --header-bg: rgba(248, 248, 248, 0.98);
    color-scheme: light;
  }

  .app[data-color-scheme="dark"] {
    --bg: #121212;
    --surface: #1e1e1e;
    --surface-raised: #2a2a2a;
    --text: #ffffff;
    --muted: #b5b5b5;
    --border: #555555;
    --accent: #ef9a62;
    --accent-soft: #3a2a20;
    --link: #9fc5ef;
    --post-read: #181818;
    --post-new: #30363d;
    --post-reply: #282828;
    --post-thread: #29333d;
    --code-bg: #101010;
    --header-bg: rgba(30, 30, 30, 0.98);
    color-scheme: dark;
  }

  @media (prefers-color-scheme: dark) {
    .app[data-color-scheme="system"] {
      --bg: #121212;
      --surface: #1e1e1e;
      --surface-raised: #2a2a2a;
      --text: #ffffff;
      --muted: #b5b5b5;
      --border: #555555;
      --accent: #ef9a62;
      --accent-soft: #3a2a20;
      --link: #9fc5ef;
      --post-read: #181818;
      --post-new: #30363d;
      --post-reply: #282828;
      --post-thread: #29333d;
      --code-bg: #101010;
      --header-bg: rgba(30, 30, 30, 0.98);
      color-scheme: dark;
    }
  }

  .app[data-color-scheme="traditional"] .topbar,
  .app[data-color-scheme="light"] .topbar,
  .app[data-color-scheme="dark"] .topbar,
  .app[data-color-scheme="system"] .topbar,
  .app[data-color-scheme="traditional"] .club-strip,
  .app[data-color-scheme="light"] .club-strip,
  .app[data-color-scheme="dark"] .club-strip,
  .app[data-color-scheme="system"] .club-strip {
    background: var(--header-bg);
    border-color: var(--border);
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
    --post-new: #30363d;
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

  /* Firefox fullscreen exposes the punch-hole area as usable viewport space.
     Move only Bokoun's compact header into that edge-to-edge inset. */
  .app[data-interface-preset="compact-reader"][data-fullscreen="active"] .topbar {
    transform: translateY(calc(-1 * env(safe-area-inset-top)));
  }

  .app[data-interface-preset="compact-reader"][data-fullscreen="active"] .club-strip {
    transform: translateY(calc(-1 * env(safe-area-inset-top)));
  }

  .app[data-interface-preset="compact-reader"] .topbar--board {
    grid-template-columns: 40px minmax(0, 1fr) 40px 40px 40px 40px;
    padding-left: 2px;
    padding-right: 0;
  }

  .app[data-interface-preset="compact-reader"] .topbar--favorites {
    grid-template-columns: minmax(0, 1fr) 40px 40px 40px;
    padding-left: 12px;
    padding-right: 0;
  }

  .app[data-interface-preset="compact-reader"] .header-control {
    width: 40px;
  }

  .app[data-interface-preset="compact-reader"] .overflow-control .header-panel {
    right: 0;
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

  .app[data-interface-preset="compact-reader"] .post--thread-focus {
    background: var(--post-new);
    box-shadow: inset 3px 0 var(--accent);
  }

  .app[data-interface-preset="compact-reader"] .post--thread-reply {
    background: var(--post-thread);
    box-shadow: inset 3px 0 var(--link);
  }

  .app[data-interface-preset="compact-reader"] .post--thread-branch {
    background: var(--thread-branch-tint, var(--post-thread));
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
    padding: 8px;
    border-radius: 0;
    background: var(--surface-raised);
  }

  .app[data-interface-preset="compact-reader"] .composer-form {
    position: relative;
    padding-bottom: 20px;
  }

  .app[data-interface-preset="compact-reader"] .composer-heading {
    display: none;
  }

  .app[data-interface-preset="compact-reader"] .composer-target {
    margin: 0 0 5px;
    font-size: 11px;
    line-height: 1.25;
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
    min-height: 88px;
    max-height: 30vh;
    padding: 8px;
    font-size: 14px;
    line-height: 1.35;
  }

  .app[data-interface-preset="compact-reader"] .composer-draft {
    position: absolute;
    right: auto;
    bottom: 0;
    left: 0;
    gap: 6px;
    min-height: 16px;
    margin: 0;
  }

  .app[data-interface-preset="compact-reader"] .draft-status {
    width: 14px;
    height: 16px;
    overflow: hidden;
    color: #4f9f62;
    font-size: 0;
    line-height: 16px;
  }

  .app[data-interface-preset="compact-reader"] .draft-status::before {
    content: "●";
    font-size: 12px;
  }

  .app[data-interface-preset="compact-reader"] .draft-discard {
    min-width: 16px;
    min-height: 16px;
    color: #5f9b69;
    font-size: 16px;
    font-weight: 700;
    line-height: 16px;
  }

  .app[data-interface-preset="compact-reader"] .composer-actions {
    gap: 6px;
    margin-top: 6px;
  }

  .app[data-interface-preset="compact-reader"] .composer-action {
    min-height: 28px;
    padding: 0 8px;
    font-size: 12px;
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
      --post-new: #30363d;
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

  .app[data-interface-preset="compact-reader"][data-color-scheme="traditional"] {
    --bg: #dce8fa;
    --surface: #dce8fa;
    --surface-raised: #e8f0fc;
    --text: #000000;
    --muted: #40516a;
    --border: #9aaac1;
    --accent: #8a4f00;
    --accent-soft: #f3dfbd;
    --link: #164f91;
    --post-read: #dce8fa;
    --post-new: #ffffff;
    --post-reply: #eef4fd;
    --post-thread: #d1e0f5;
    --code-bg: #d2e0f4;
    --header-bg: rgba(232, 240, 252, 0.98);
    color-scheme: light;
  }

`;
