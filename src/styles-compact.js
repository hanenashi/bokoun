export const COMPACT_READER_STYLES = `
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
