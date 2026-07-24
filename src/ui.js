export function installUi(ctx) {
  const {
    ICONS,
    state,
  } = ctx;
  const routeKey = (...args) => ctx.routeKey(...args);
  const openFullKapybara = (...args) => ctx.openFullKapybara(...args);
  const currentBoardId = (...args) => ctx.currentBoardId(...args);
  const openComposer = (...args) => ctx.openComposer(...args);
  const closeComposer = (...args) => ctx.closeComposer(...args);
  const discardComposerDraft = (...args) => ctx.discardComposerDraft(...args);
  const updateComposerBody = (...args) => ctx.updateComposerBody(...args);
  const clearWriteFeedback = (...args) => ctx.clearWriteFeedback(...args);
  const submitComposer = (...args) => ctx.submitComposer(...args);
  const loadOlderPosts = (...args) => ctx.loadOlderPosts(...args);
  const navigateNative = (...args) => ctx.navigateNative(...args);
  const goBack = (...args) => ctx.goBack(...args);

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
    const replyingTo = state.composer?.kind === "reply" ? state.composer.replyTo : "";
    const newComposer = state.composer?.kind === "new" ? composerMarkup() : "";
    const feedback = state.writeFeedback?.boardId === currentBoardId()
      ? state.writeFeedback
      : null;
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
        const postClasses = [
          "post",
          replyTarget ? "post--reply-target" : "",
          justSent ? "post--just-sent" : "",
          replyContext ? "post--reply-context" : "",
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
        <button class="icon-button" type="button" data-action="compose" aria-label="Napsat příspěvek">${ICONS.write}</button>
        ${fullButton()}
      </header>
      ${feedbackMarkup}
      ${newComposer}
      <section class="posts${replyingTo ? " is-replying" : ""}" aria-label="Příspěvky">${posts}</section>
      <footer class="board-tail">${tailState}${newest}</footer>
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
    state.shadow.querySelector("[data-action='full']")?.addEventListener("click", openFullKapybara);
    state.shadow.querySelector("[data-action='back']")?.addEventListener("click", goBack);
    state.shadow.querySelector("[data-action='compose']")?.addEventListener("click", () => openComposer("new"));
    state.shadow.querySelector("[data-action='cancel-compose']")?.addEventListener("click", closeComposer);
    state.shadow.querySelector("[data-action='discard-draft']")?.addEventListener("click", discardComposerDraft);
    state.shadow.querySelector("[data-action='dismiss-feedback']")?.addEventListener("click", clearWriteFeedback);
    state.shadow.querySelector("[data-action='inspect-write']")?.addEventListener("click", openFullKapybara);
    state.shadow.querySelector("[data-action='load-older']")?.addEventListener("click", loadOlderPosts);
    state.shadow.querySelector("[data-action='newest']")?.addEventListener("click", () => {
      state.scroller?.scrollTo({ top: 0, behavior: "smooth" });
    });
    state.shadow.querySelector(".composer-form")?.addEventListener("submit", submitComposer);
    state.shadow.querySelector(".composer-textarea")?.addEventListener("input", (event) => {
      updateComposerBody(event.currentTarget.value);
    });
    for (const button of state.shadow.querySelectorAll("[data-action='reply']")) {
      button.addEventListener("click", () => openComposer("reply", button.dataset.postId));
    }
    for (const link of state.shadow.querySelectorAll("[data-native-href]")) {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        navigateNative(link.getAttribute("data-native-href"));
      });
    }
  }

  Object.assign(ctx, {
    escapeHtml,
    signatureFor,
    fullButton,
    favoritesMarkup,
    boardMarkup,
    composerMarkup,
    attachUiEvents,
  });
}
