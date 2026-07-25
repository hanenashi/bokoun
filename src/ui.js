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
  const scheduleRender = (...args) => ctx.scheduleRender(...args);
  const currentDisplaySettings = (...args) => ctx.currentDisplaySettings(...args);
  const currentFontSettings = (...args) => ctx.currentFontSettings(...args);
  const updateDisplaySettings = (...args) => ctx.updateDisplaySettings(...args);
  const updateFontSettings = (...args) => ctx.updateFontSettings(...args);
  const resetFontSettings = (...args) => ctx.resetFontSettings(...args);
  const displayFontSize = (...args) => ctx.displayFontSize(...args);
  const normalizeCustomFamily = (...args) => ctx.normalizeCustomFamily(...args);
  const currentFavoritesSettings = (...args) => ctx.currentFavoritesSettings(...args);
  const updateFavoritesSettings = (...args) => ctx.updateFavoritesSettings(...args);
  const saveFavoriteOrder = (...args) => ctx.saveFavoriteOrder(...args);
  const resetFavoriteOrder = (...args) => ctx.resetFavoriteOrder(...args);
  const unreadHeat = (...args) => ctx.unreadHeat(...args);

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
      state.openHeaderPanel,
      state.openPostMenuId,
      JSON.stringify(currentDisplaySettings()),
      JSON.stringify(currentFontSettings()),
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
    const favorites = currentFavoritesSettings();
    const editing = favorites.sort === "manual" && state.editingFavoriteOrder;
    const showCount = ["count", "both"].includes(favorites.unreadMode);
    const showHeat = ["heat", "both"].includes(favorites.unreadMode);
    const rows = clubs.length
      ? clubs.map((club) => {
        const heat = showHeat ? unreadHeat(club.unread) : "";
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
              class="favorite-row${heatClass}"
              href="${escapeHtml(club.href)}"
              data-native-href="${escapeHtml(club.href)}"
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
        ${favoritesControlMarkup()}
        ${fullButton()}
      </header>
      <nav class="tabs" aria-label="Řazení oblíbených klubů">
        <a class="tab" href="/fav/activity" data-native-href="/fav/activity" ${selectedActivity ? 'aria-current="page"' : ""}>Aktivita</a>
        <a class="tab" href="/fav/topics" data-native-href="/fav/topics" ${selectedActivity ? "" : 'aria-current="page"'}>Témata</a>
      </nav>
      <ul class="favorites">${rows}</ul>
    `;
  }

  function favoritesControlMarkup() {
    const open = state.openHeaderPanel === "favorites";
    return `
      <div class="header-control favorites-control">
        <button
          class="icon-button header-panel-toggle favorites-settings-toggle"
          type="button"
          data-action="favorites-panel"
          aria-label="Nastavení oblíbených"
          aria-expanded="${open ? "true" : "false"}"
        >${ICONS.settings}</button>
        ${open ? favoritesPanelMarkup() : ""}
      </div>
    `;
  }

  function favoritesPanelMarkup() {
    const favorites = currentFavoritesSettings();
    const manual = favorites.sort === "manual";
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
        ${manual ? `
          <p class="settings-note">V režimu úprav přetahujte kluby za madlo. Odkazy jsou dočasně vypnuté.</p>
          <div class="panel-actions">
            <button type="button" data-action="toggle-favorite-edit">
              ${state.editingFavoriteOrder ? "Hotovo" : "Upravit pořadí"}
            </button>
            <button type="button" data-action="reset-favorite-order">Obnovit pořadí</button>
          </div>
        ` : `
          <p class="settings-note">Výchozí zachovává pořadí Kapybary pro zvolenou kartu.</p>
        `}
      </section>
    `;
  }

  function setHeaderPanel(panel = "") {
    state.openHeaderPanel = state.openHeaderPanel === panel ? "" : panel;
    state.openPostMenuId = "";
    state.currentSignature = "";
    scheduleRender({ force: true });
  }

  function setPostMenu(postId = "") {
    state.openPostMenuId = state.openPostMenuId === String(postId) ? "" : String(postId);
    state.openHeaderPanel = "";
    state.currentSignature = "";
    scheduleRender({ force: true });
  }

  function fontControlMarkup() {
    const open = state.openHeaderPanel === "font";
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
        ${state.openHeaderPanel === "display" ? displayPanelMarkup() : ""}
      </div>
    `;
  }

  function fontPanelMarkup() {
    const font = currentFontSettings();
    const custom = font.family === "custom";
    const options = ctx.fontFamilies.map(({ value, label, stack }) => `
      <option
        value="${escapeHtml(value)}"
        ${font.family === value ? "selected" : ""}
        ${stack ? `style="font-family:${escapeHtml(stack)}"` : ""}
      >${escapeHtml(label)}</option>
    `).join("");
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
            <input
              type="range"
              min="10"
              max="32"
              step="0.5"
              value="${escapeHtml(Math.min(32, Math.max(10, font.size)))}"
              aria-label="Velikost písma posuvníkem"
            >
            <input
              type="number"
              min="8"
              max="72"
              step="0.5"
              inputmode="decimal"
              value="${escapeHtml(displayFontSize(font.size))}"
              aria-label="Velikost písma v pixelech"
            >
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
        <p class="settings-note">Kliknutí na avatar nebo jméno otevře nabídku příspěvku.</p>
        <div class="panel-actions">
          <button type="button" data-action="font-panel">← Písmo</button>
        </div>
      </section>
    `;
  }

  function avatarImageMarkup(post, className = "") {
    return post.avatarUrl
      ? `<img class="${className}" src="${escapeHtml(post.avatarUrl)}" alt="" loading="lazy" decoding="async">`
      : `<span class="${className} avatar-fallback" aria-hidden="true">${escapeHtml(post.author.slice(0, 1).toUpperCase())}</span>`;
  }

  function postMenuMarkup(post) {
    return `
      <div class="post-menu" role="menu" aria-label="Akce příspěvku">
        <button
          type="button"
          role="menuitem"
          data-action="reply"
          data-post-id="${escapeHtml(post.id)}"
        >Odpovědět</button>
      </div>
    `;
  }

  function boardMarkup(board) {
    const display = currentDisplaySettings();
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
          display.showAvatars ? `post--avatar-${display.avatarPosition}` : "post--avatar-hidden",
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
          <article class="${postClasses}" data-bokoun-post-id="${escapeHtml(post.id)}">
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
                ${post.replyReference ? `<div class="reply-reference">${escapeHtml(post.replyReference)}</div>` : ""}
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
        ${fontControlMarkup()}
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
    state.shadow.querySelector("[data-action='favorites-panel']")?.addEventListener("click", () => {
      setHeaderPanel("favorites");
    });
    const fontToggle = state.shadow.querySelector(".font-toggle");
    fontToggle?.addEventListener("click", (event) => {
      if (Date.now() < state.suppressFontClickUntil) {
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
          state.suppressFontClickUntil = Date.now() + 800;
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
    state.shadow.querySelectorAll("[data-action='font-panel']").forEach((button) => {
      if (button === fontToggle) return;
      button.addEventListener("click", () => setHeaderPanel("font"));
    });
    state.shadow.querySelector("[data-action='display-panel']")?.addEventListener("click", () => setHeaderPanel("display"));
    state.shadow.querySelector("[data-action='close-header-panel']")?.addEventListener("click", () => setHeaderPanel(""));
    state.shadow.querySelector("[data-action='reset-font']")?.addEventListener("click", resetFontSettings);
    state.shadow.querySelector("[data-setting='font-family']")?.addEventListener("change", (event) => {
      updateFontSettings({ family: event.currentTarget.value }, { render: true });
    });
    state.shadow.querySelector("[aria-label='Vlastní rodina písma']")?.addEventListener("input", (event) => {
      updateFontSettings({ customFamily: event.currentTarget.value });
      const normalized = normalizeCustomFamily(event.currentTarget.value);
      const invalid = Boolean(event.currentTarget.value.trim() && !normalized);
      event.currentTarget.setAttribute("aria-invalid", invalid ? "true" : "false");
      const hint = event.currentTarget.parentElement?.querySelector("small");
      if (hint) {
        hint.textContent = invalid
          ? "Použijte jen názvy písem oddělené čárkami"
          : "Místní písma, oddělená čárkami";
      }
    });
    const fontRange = state.shadow.querySelector("[aria-label='Velikost písma posuvníkem']");
    const fontNumber = state.shadow.querySelector("[aria-label='Velikost písma v pixelech']");
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
    state.shadow.querySelector("[data-setting='show-avatars']")?.addEventListener("change", (event) => {
      updateDisplaySettings({ showAvatars: event.currentTarget.checked });
    });
    state.shadow.querySelector("[data-setting='avatar-position']")?.addEventListener("change", (event) => {
      updateDisplaySettings({ avatarPosition: event.currentTarget.value });
    });
    state.shadow.querySelector("[data-setting='favorites-sort']")?.addEventListener("change", (event) => {
      updateFavoritesSettings(
        { sort: event.currentTarget.value },
        { clubs: state.favoriteSourceClubs },
      );
    });
    state.shadow.querySelector("[data-setting='unread-mode']")?.addEventListener("change", (event) => {
      updateFavoritesSettings({ unreadMode: event.currentTarget.value });
    });
    state.shadow.querySelector("[data-action='toggle-favorite-edit']")?.addEventListener("click", () => {
      const enteringEditMode = !state.editingFavoriteOrder;
      state.editingFavoriteOrder = enteringEditMode;
      if (enteringEditMode) state.openHeaderPanel = "";
      state.currentSignature = "";
      scheduleRender({ force: true });
    });
    state.shadow.querySelector("[data-action='reset-favorite-order']")?.addEventListener("click", () => {
      resetFavoriteOrder(state.favoriteSourceClubs);
    });
    for (const button of state.shadow.querySelectorAll("[data-action='post-menu']")) {
      button.addEventListener("click", () => setPostMenu(button.dataset.postId));
    }
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
      button.addEventListener("click", () => {
        state.openPostMenuId = "";
        openComposer("reply", button.dataset.postId);
      });
    }
    for (const link of state.shadow.querySelectorAll("[data-native-href]")) {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        if (state.editingFavoriteOrder && link.closest(".favorite-item")) return;
        navigateNative(link.getAttribute("data-native-href"));
      });
    }
    attachFavoriteReordering();
    const inner = state.shadow.querySelector(".app-inner");
    inner.onpointerdown = (event) => {
      if (
        state.openPostMenuId
        && !event.target.closest(".post-menu, .post-menu-trigger")
      ) setPostMenu("");
      if (
        state.openHeaderPanel
        && !event.target.closest(".header-panel, .header-panel-toggle, .font-toggle")
      ) setHeaderPanel("");
    };
    state.shadow.onkeydown = (event) => {
      if (event.key !== "Escape") return;
      if (state.openPostMenuId) setPostMenu("");
      else if (state.openHeaderPanel) setHeaderPanel("");
    };
  }

  function attachFavoriteReordering() {
    if (!state.editingFavoriteOrder) return;
    const list = state.shadow.querySelector(".favorites");
    if (!list) return;

    let dragged = null;
    let pointerId = null;
    const finish = (event) => {
      if (!dragged || (event && event.pointerId !== pointerId)) return;
      dragged.classList.remove("favorite-item--dragging");
      list.classList.remove("favorites--dragging");
      saveFavoriteOrder(
        [...list.querySelectorAll("[data-favorite-href]")]
          .map((item) => item.dataset.favoriteHref),
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
      const scrollerRect = state.scroller?.getBoundingClientRect();
      if (scrollerRect && event.clientY < scrollerRect.top + 90) {
        state.scroller.scrollBy({ top: -14, behavior: "auto" });
      } else if (scrollerRect && event.clientY > scrollerRect.bottom - 70) {
        state.scroller.scrollBy({ top: 14, behavior: "auto" });
      }

      const rows = [...list.querySelectorAll(".favorite-item")]
        .filter((item) => item !== dragged);
      const target = rows.find((item) => (
        event.clientY < item.getBoundingClientRect().top
          + item.getBoundingClientRect().height / 2
      ));
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

  Object.assign(ctx, {
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
    attachFavoriteReordering,
  });
}
