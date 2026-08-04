import { escapeHtml } from "./ui-shared.js";

export function installUi(ctx) {
  const {
    ICONS,
    state,
  } = ctx;
  const routeKey = (...args) => ctx.routeKey(...args);
  const routeType = (...args) => ctx.routeType(...args);
  const currentBoardId = (...args) => ctx.currentBoardId(...args);
  const scheduleRender = (...args) => ctx.scheduleRender(...args);
  const currentDisplaySettings = (...args) => ctx.currentDisplaySettings(...args);
  const currentFontSettings = (...args) => ctx.currentFontSettings(...args);
  const currentFavoritesSettings = (...args) => ctx.currentFavoritesSettings(...args);
  const currentRecentClubs = (...args) => ctx.currentRecentClubs(...args);
  const normalizeClubRoute = (...args) => ctx.normalizeClubRoute(...args);
  const unreadHeat = (...args) => ctx.unreadHeat(...args);
  const overflowControlMarkup = (...args) => ctx.overflowControlMarkup(...args);

  function signatureFor(type, model) {
    if (type === "favorites") {
      return [
        routeKey(),
        JSON.stringify(currentDisplaySettings()),
        JSON.stringify(currentFavoritesSettings()),
        JSON.stringify(currentRecentClubs()),
        state.openHeaderPanel,
        state.editingFavoriteOrder,
        model.length,
        model.map((club) => `${club.href}:${club.unread}:${club.activity}`).join(";"),
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
      state.openHeaderPanel,
      state.openPostMenuId,
      JSON.stringify(currentDisplaySettings()),
      JSON.stringify(currentFontSettings()),
      JSON.stringify(currentRecentClubs()),
      state.composer
        ? [
            state.composer.kind,
            state.composer.replyTo,
            state.composer.status,
            state.composer.error,
            state.composer.ambiguous,
          ].join(":")
        : "",
      state.writeFeedback
        ? [
            state.writeFeedback.boardId,
            state.writeFeedback.postId,
            state.writeFeedback.replyTo,
            state.writeFeedback.message,
          ].join(":")
        : "",
      model.threadRootId,
      model.threadFocusId,
      model.threadBranchFocusId,
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

  function fullscreenButton() {
    const active = Boolean(document.fullscreenElement);
    return `
      <button
        class="icon-button fullscreen-toggle"
        type="button"
        data-action="fullscreen-toggle"
        aria-label="${active ? "Opustit celou obrazovku" : "Celá obrazovka"}"
        aria-pressed="${active ? "true" : "false"}"
        title="${active ? "Opustit celou obrazovku" : "Celá obrazovka"}"
      ><span aria-hidden="true">⛶</span></button>
    `;
  }

  function clubStripMarkup(currentTitle = "") {
    const display = currentDisplaySettings();
    if (display.interfacePreset !== "compact-reader" || !display.showClubStrip) return "";
    const activeClub = normalizeClubRoute(location.pathname);
    const favoritesActive = routeType() === "favorites";
    const recent = currentRecentClubs();
    const candidates = favoritesActive
      ? [{
        href: "/fav/activity",
        name: "Oblíbené",
        active: true,
      }, ...recent]
      : [{
        href: activeClub,
        name: currentTitle || recent.find((club) => club.href === activeClub)?.name || "Klub",
        active: true,
      }, ...recent];
    const seen = new Set();
    const links = candidates
      .filter((link) => {
        const href = normalizeClubRoute(link.href) || link.href;
        if (!href || seen.has(href)) return false;
        seen.add(href);
        return true;
      })
      .slice(0, favoritesActive ? 7 : 6)
      .map((link) => ({
        ...link,
        active: favoritesActive
          ? link.href === "/fav/activity"
          : normalizeClubRoute(link.href) === activeClub,
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
    const editing = favorites.sort === "manual" && state.editingFavoriteOrder;
    const showCount = ["count", "both"].includes(favorites.unreadMode);
    const showHeat = ["heat", "both"].includes(favorites.unreadMode);
    const rows = clubs.length
      ? clubs.map((club) => {
        const heat = showHeat ? unreadHeat(club.unread) : "";
        const unreadClass = club.unread ? " favorite-row--unread" : "";
        const heatClass = heat ? ` favorite-row--heat-${heat}` : "";
        const unreadLabel = club.unread
          ? `${club.unread} nových příspěvků`
          : "bez nových příspěvků";
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
      }).join("")
      : `<li class="empty">Žádné oblíbené kluby.</li>`;

    return `
      <header class="topbar topbar--favorites">
        <h1 class="title title--brand">Bokoun</h1>
        ${modeSwitchButton()}
        ${fullscreenButton()}
        ${overflowControlMarkup("favorites")}
      </header>
      ${clubStripMarkup()}
      <div class="route-content">
        <ul class="favorites">${rows}</ul>
      </div>
    `;
  }

  function setHeaderPanel(panel = "") {
    const previous = state.openHeaderPanel;
    const next = previous === panel ? "" : panel;
    if (next && !previous) {
      const historyState = history.state && typeof history.state === "object"
        ? history.state
        : {};
      history.pushState({ ...historyState, bokounHeaderPanel: true }, "", location.href);
    } else if (!next && previous && history.state?.bokounHeaderPanel) {
      history.back();
    }
    state.openHeaderPanel = next;
    state.openPostMenuId = "";
    state.currentSignature = "";
    scheduleRender({ force: true });
    window.setTimeout(() => {
      if (!state.shadow) return;
      const target = state.openHeaderPanel
        ? state.shadow.querySelector(".header-panel button, .header-panel select, .header-panel input")
        : state.shadow.querySelector("[data-action='overflow']");
      target?.focus();
    }, 60);
  }

  function setPostMenu(postId = "") {
    state.openPostMenuId = state.openPostMenuId === String(postId) ? "" : String(postId);
    state.openHeaderPanel = "";
    state.currentSignature = "";
    scheduleRender({ force: true });
  }

  function avatarImageMarkup(post, className = "") {
    return post.avatarUrl
      ? `<img class="${className}" src="${escapeHtml(post.avatarUrl)}" alt="" loading="lazy" decoding="async">`
      : `<span class="${className} avatar-fallback" aria-hidden="true">${escapeHtml(post.author.slice(0, 1).toUpperCase())}</span>`;
  }

  function postMenuMarkup(post) {
    const rootMetadataKnown = Boolean(post.rootId)
      || state.host?.dataset.readSource === "structured";
    const threadRootId = post.rootId || (rootMetadataKnown ? post.id : "");
    return `
      <div class="post-menu" role="menu" aria-label="Akce příspěvku">
        <button
          type="button"
          role="menuitem"
          data-action="reply"
          data-post-id="${escapeHtml(post.id)}"
        >Odpovědět</button>
        <button
          type="button"
          role="menuitem"
          data-action="thread"
          data-post-id="${escapeHtml(post.id)}"
          data-root-id="${escapeHtml(threadRootId)}"
        >Vlákno</button>
      </div>
    `;
  }

  function replyMetaMarkup(post, display) {
    if (display.replyMeta === "hidden" || !post.replyReference) return "";
    const author = post.parentAuthor
      || post.replyReference.replace(/^Reakce na\s+/i, "").split(/,\s*\d{1,2}\./)[0]
      || "neznámý";
    const time = display.replyMeta === "full" && post.parentDate
      ? `<time>${escapeHtml(post.parentDate)}</time>`
      : "";
    const content = `<span class="reply-prefix">re:</span> <strong>${escapeHtml(author)}</strong>${time}`;
    return post.rootId
      ? `
        <button
          class="reply-reference"
          type="button"
          data-action="thread"
          data-post-id="${escapeHtml(post.id)}"
          data-root-id="${escapeHtml(post.rootId)}"
          aria-label="Zobrazit vlákno reakce na ${escapeHtml(author)}"
        >${content}</button>
      `
      : `<div class="reply-reference">${content}</div>`;
  }

  function boardMarkup(board) {
    const display = currentDisplaySettings();
    const threadMode = Boolean(board.threadRootId);
    const replyingTo = state.composer?.kind === "reply" ? state.composer.replyTo : "";
    const newComposer = state.composer?.kind === "new" ? composerMarkup() : "";
    const feedback = state.writeFeedback?.boardId === currentBoardId()
      ? state.writeFeedback
      : null;
    const newPostIds = new Set(board.newPostIds);
    const feedbackMarkup = feedback
      ? `
        <div class="write-feedback" role="status">
          <span>${escapeHtml(feedback.message)}</span>
          <button
            class="write-feedback-dismiss"
            type="button"
            data-action="dismiss-feedback"
            aria-label="Skrýt potvrzení"
          >×</button>
        </div>
      `
      : "";
    const posts = board.posts.length
      ? board.posts.map((post) => {
        const replyTarget = replyingTo === post.id;
        const justSent = feedback?.postId === post.id;
        const replyContext = feedback?.replyTo === post.id;
        const branchFocused = Boolean(board.threadBranchFocusId);
        const inFocusedBranch = branchFocused
          && Boolean(post.threadBranchId)
          && post.threadBranchId === board.threadBranchFocusId;
        const branchMuted = threadMode
          && branchFocused
          && Boolean(post.threadBranchId)
          && !inFocusedBranch;
        const postClasses = [
          "post",
          display.showAvatars ? `post--avatar-${display.avatarPosition}` : "post--avatar-hidden",
          threadMode && post.id === board.threadFocusId ? "post--thread-focus" : "",
          threadMode && post.id !== board.threadFocusId ? "post--thread-reply" : "",
          threadMode && post.threadBranchId ? "post--thread-branch" : "",
          inFocusedBranch ? "post--thread-branch-active" : "",
          branchMuted ? "post--thread-muted" : "",
          !threadMode && newPostIds.has(post.id) ? "post--visit-new" : "",
          replyTarget ? "post--reply-target" : "",
          justSent ? "post--just-sent" : "",
          replyContext ? "post--reply-context" : "",
        ].filter(Boolean).join(" ");
        const menuOpen = state.openPostMenuId === post.id;
        const leftAvatar = display.showAvatars && display.avatarPosition === "left"
          ? `
            <button
              class="post-avatar-trigger post-menu-trigger"
              type="button"
              data-action="post-menu"
              data-post-id="${escapeHtml(post.id)}"
              aria-label="Nabídka příspěvku od ${escapeHtml(post.author)}"
              aria-haspopup="menu"
              aria-expanded="${menuOpen ? "true" : "false"}"
            >${avatarImageMarkup(post, "post-avatar post-avatar--left")}</button>
          `
          : "";
        const inlineAvatar = display.showAvatars && display.avatarPosition === "inline"
          ? avatarImageMarkup(post, "post-avatar post-avatar--inline")
          : "";
        return `
          <article
            class="${postClasses}"
            data-bokoun-post-id="${escapeHtml(post.id)}"
            ${threadMode ? `data-thread-depth="${escapeHtml(post.depth)}"` : ""}
            ${post.threadBranchId ? `data-thread-branch="${escapeHtml(post.threadBranchId)}"` : ""}
            ${post.threadBranchId ? `data-thread-tone="${escapeHtml(post.threadBranchTone)}"` : ""}
            ${post.threadBranchId && !branchMuted ? `tabindex="0" aria-label="${inFocusedBranch ? "Zobrazit celé vlákno" : "Zobrazit pouze tuto větev vlákna"}"` : ""}
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
      }).join("")
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
      tailState = `<div class="tail-end">${
        threadMode
          ? "Celé vlákno."
          : board.retentionLimited
            ? `Načteno posledních ${escapeHtml(board.posts.length)} příspěvků.`
            : "Začátek klubu."
      }</div>`;
    } else {
      tailState = '<button class="tail-action" type="button" data-action="load-older">Načíst starší</button>';
    }
    const newest = !threadMode && board.loadedPageCount > 1
      ? '<button class="tail-action tail-action--accent" type="button" data-action="newest">↑ Nejnovější</button>'
      : "";

    return `
      <header class="topbar topbar--board">
        <button
          class="icon-button"
          type="button"
          data-action="${threadMode ? "thread-back" : "back"}"
          aria-label="${threadMode ? "Zpět do klubu" : "Zpět do oblíbených"}"
        >${ICONS.back}</button>
        <h1 class="title">${escapeHtml(board.title)}</h1>
        <button class="icon-button" type="button" data-action="compose" aria-label="Napsat příspěvek">${ICONS.write}</button>
        ${modeSwitchButton()}
        ${fullscreenButton()}
        ${overflowControlMarkup("board")}
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
    const composer = state.composer;
    if (!composer) return "";
    const busy = state.writeBusy || composer.status === "sending";
    const disabled = busy || composer.ambiguous;
    const title = composer.kind === "reply" ? "Odpověď" : "Nový příspěvek";
    const target = composer.kind === "reply"
      ? `<p class="composer-target">Odpověď na ${escapeHtml(composer.replyAuthor || `příspěvek ${composer.replyTo}`)}</p>`
      : "";
    const error = composer.error
      ? `<div class="composer-error" role="alert">${escapeHtml(composer.error)}</div>`
      : "";
    const inspect = composer.ambiguous
      ? '<button class="composer-action" type="button" data-action="inspect-write">Zkontrolovat plnou verzi</button>'
      : "";
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
              aria-label="Zahodit koncept"
              title="Zahodit koncept"
              ${hasDraft ? "" : "hidden"}
            >×</button>
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


  Object.assign(ctx, {
    escapeHtml,
    signatureFor,
    modeSwitchButton,
    fullscreenButton,
    favoritesMarkup,
    clubStripMarkup,
    boardMarkup,
    composerMarkup,
    setHeaderPanel,
    setPostMenu,
    avatarImageMarkup,
    postMenuMarkup,
    replyMetaMarkup,
  });
}
