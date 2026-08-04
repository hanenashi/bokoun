import { escapeHtml } from "./ui-shared.js";

export function installUiPanels(ctx) {
  const { state } = ctx;
  const currentDisplaySettings = (...args) => ctx.currentDisplaySettings(...args);
  const currentFontSettings = (...args) => ctx.currentFontSettings(...args);
  const currentFavoritesSettings = (...args) => ctx.currentFavoritesSettings(...args);
  const displayFontSize = (...args) => ctx.displayFontSize(...args);
  const normalizeCustomFamily = (...args) => ctx.normalizeCustomFamily(...args);

  function overflowControlMarkup(type) {
    const open = state.openHeaderPanel === "overflow";
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
    if (state.openHeaderPanel === "overflow") return overflowMenuMarkup(type);
    if (state.openHeaderPanel === "favorite-sort") return favoriteSortPanelMarkup();
    if (state.openHeaderPanel === "favorites-appearance") return favoritesPanelMarkup();
    if (state.openHeaderPanel === "font") return fontPanelMarkup();
    if (state.openHeaderPanel === "display") return displayPanelMarkup();
    if (state.openHeaderPanel === "settings") return bokounSettingsPanelMarkup();
    return "";
  }

  function overflowMenuMarkup(type) {
    const favorites = type === "favorites";
    const unreadOnly = currentFavoritesSettings().unreadOnly;
    return `
      <div class="header-panel overflow-menu" role="menu" aria-label="${
        favorites ? "Možnosti oblíbených" : "Možnosti klubu"
      }">
        ${favorites ? `
          <button type="button" role="menuitem" data-action="open-panel" data-panel="favorite-sort">Řazení…</button>
          <button
            type="button"
            role="menuitemcheckbox"
            aria-checked="${unreadOnly ? "true" : "false"}"
            data-action="toggle-unread-only"
          ><span>Pouze nepřečtené</span><span aria-hidden="true">${unreadOnly ? "✓" : ""}</span></button>
          <button type="button" role="menuitem" data-action="edit-favorite-order">${
            state.editingFavoriteOrder ? "Dokončit pořadí" : "Upravit pořadí"
          }</button>
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
              ${state.editingFavoriteOrder ? "Hotovo" : "Upravit pořadí"}
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
    return ctx.fontFamilies.map(({ value, label, stack }) => `
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
        <span>Barvy</span>
        <select data-setting="color-scheme" aria-label="Barevný režim">
          <option value="kapybara" ${display.colorScheme === "kapybara" ? "selected" : ""}>Kapybara (automaticky)</option>
          <option value="traditional" ${display.colorScheme === "traditional" ? "selected" : ""}>Tradiční</option>
          <option value="light" ${display.colorScheme === "light" ? "selected" : ""}>Světlé</option>
          <option value="dark" ${display.colorScheme === "dark" ? "selected" : ""}>Tmavé</option>
          <option value="system" ${display.colorScheme === "system" ? "selected" : ""}>Podle systému</option>
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

  Object.assign(ctx, {
    overflowControlMarkup,
    overflowMenuMarkup,
    favoriteSortPanelMarkup,
    favoritesPanelMarkup,
    fontPanelMarkup,
    displayPanelMarkup,
  });
}
