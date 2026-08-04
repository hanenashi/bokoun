export function installUiEvents(ctx) {
  const { state } = ctx;
  const routeKey = (...args) => ctx.routeKey(...args);
  const openFullKapybara = (...args) => ctx.openFullKapybara(...args);
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
  const updateDisplaySettings = (...args) => ctx.updateDisplaySettings(...args);
  const resetFirstUnread = (...args) => ctx.resetFirstUnread?.(...args);
  const updateFontSettings = (...args) => ctx.updateFontSettings(...args);
  const resetFontSettings = (...args) => ctx.resetFontSettings(...args);
  const displayFontSize = (...args) => ctx.displayFontSize(...args);
  const normalizeCustomFamily = (...args) => ctx.normalizeCustomFamily(...args);
  const currentFavoritesSettings = (...args) => ctx.currentFavoritesSettings(...args);
  const normalizeClubRoute = (...args) => ctx.normalizeClubRoute(...args);
  const updateFavoritesSettings = (...args) => ctx.updateFavoritesSettings(...args);
  const resetFavoritesAppearance = (...args) => ctx.resetFavoritesAppearance(...args);
  const saveFavoriteOrder = (...args) => ctx.saveFavoriteOrder(...args);
  const resetFavoriteOrder = (...args) => ctx.resetFavoriteOrder(...args);
  const openThread = (...args) => ctx.openThread(...args);
  const closeThread = (...args) => ctx.closeThread(...args);
  const toggleThreadBranch = (...args) => ctx.toggleThreadBranch(...args);
  const startBoardVisitFromFavorite = (...args) => ctx.startBoardVisitFromFavorite(...args);
  const requestBokounFullscreen = (...args) => ctx.requestBokounFullscreen(...args);
  const requestStructuredRefresh = (...args) => ctx.requestStructuredRefresh(...args);
  const disableBokoun = (...args) => ctx.disableBokoun(...args);
  const setHeaderPanel = (...args) => ctx.setHeaderPanel(...args);
  const setPostMenu = (...args) => ctx.setPostMenu(...args);

  function attachUiEvents() {
    state.shadow.querySelector("[data-action='mode-switch']")?.addEventListener("click", openFullKapybara);
    const fullscreenToggle = state.shadow.querySelector("[data-action='fullscreen-toggle']");
    let longPress = false;
    let longPressTimer = 0;
    const clearLongPress = () => {
      clearTimeout(longPressTimer);
      longPressTimer = 0;
    };
    fullscreenToggle?.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      longPress = false;
      clearLongPress();
      longPressTimer = window.setTimeout(() => {
        longPress = true;
        window.location.reload();
      }, 700);
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((type) => {
      fullscreenToggle?.addEventListener(type, clearLongPress);
    });
    fullscreenToggle?.addEventListener("contextmenu", (event) => event.preventDefault());
    fullscreenToggle?.addEventListener("click", async (event) => {
      if (longPress) {
        event.preventDefault();
        longPress = false;
        return;
      }
      if (document.fullscreenElement) {
        if (state.fullscreenOwned) await ctx.exitBokounFullscreen({ suppress: true });
        else await document.exitFullscreen?.();
        return;
      }
      await requestBokounFullscreen({ force: true });
    });
    state.shadow.querySelector("[data-action='full']")?.addEventListener("click", () => {
      setHeaderPanel("");
      void openFullKapybara();
    });
    state.shadow.querySelector("[data-action='back']")?.addEventListener("click", () => {
      if (state.openHeaderPanel) setHeaderPanel("");
      else goBack();
    });
    state.shadow.querySelector("[data-action='thread-back']")?.addEventListener("click", () => {
      if (state.openHeaderPanel) setHeaderPanel("");
      else if (new URL(routeKey(), location.origin).searchParams.has("branch")) {
        toggleThreadBranch();
      } else closeThread();
    });
    state.shadow.querySelector("[data-action='compose']")?.addEventListener("click", () => openComposer("new"));
    state.shadow.querySelector("[data-action='overflow']")?.addEventListener("click", () => {
      setHeaderPanel("overflow");
    });
    state.shadow.querySelectorAll("[data-action='open-panel']").forEach((button) => {
      button.addEventListener("click", () => setHeaderPanel(button.dataset.panel));
    });
    state.shadow.querySelector("[data-action='close-header-panel']")?.addEventListener("click", () => setHeaderPanel(""));
    state.shadow.querySelector("[data-action='refresh']")?.addEventListener("click", () => {
      setHeaderPanel("");
      void requestStructuredRefresh("manual-refresh", { force: true });
    });
    state.shadow.querySelector("[data-action='header-newest']")?.addEventListener("click", () => {
      setHeaderPanel("");
      state.scroller?.scrollTo({ top: 0, behavior: "smooth" });
    });
    state.shadow.querySelector("[data-action='toggle-unread-only']")?.addEventListener("click", () => {
      updateFavoritesSettings({ unreadOnly: !currentFavoritesSettings().unreadOnly });
    });
    state.shadow.querySelector("[data-action='edit-favorite-order']")?.addEventListener("click", () => {
      const enteringEditMode = !state.editingFavoriteOrder;
      updateFavoritesSettings(
        { sort: "manual" },
        { clubs: state.favoriteSourceClubs, render: false },
      );
      state.editingFavoriteOrder = enteringEditMode;
      setHeaderPanel("");
      state.currentSignature = "";
      scheduleRender({ force: true });
    });
    state.shadow.querySelector("[data-action='disable-bokoun']")?.addEventListener("click", () => {
      setHeaderPanel("");
      disableBokoun();
    });
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
    state.shadow.querySelector("[data-setting='color-scheme']")?.addEventListener("change", (event) => {
      updateDisplaySettings({ colorScheme: event.currentTarget.value });
    });
    state.shadow.querySelector("[data-setting='show-club-strip']")?.addEventListener("change", (event) => {
      updateDisplaySettings({ showClubStrip: event.currentTarget.checked });
    });
    state.shadow.querySelector("[data-setting='page-transitions']")?.addEventListener("change", (event) => {
      updateDisplaySettings({ pageTransitions: event.currentTarget.checked });
    });
    state.shadow.querySelector("[data-setting='fullscreen-mode']")?.addEventListener("change", (event) => {
      updateDisplaySettings({ fullscreenMode: event.currentTarget.checked });
      if (event.currentTarget.checked) void requestBokounFullscreen({ force: true });
    });
    state.shadow.querySelector("[data-setting='avatar-position']")?.addEventListener("change", (event) => {
      updateDisplaySettings({ avatarPosition: event.currentTarget.value });
    });
    state.shadow.querySelector("[data-setting='avatar-shape']")?.addEventListener("change", (event) => {
      updateDisplaySettings({ avatarShape: event.currentTarget.value });
    });
    const postSpacingRange = state.shadow.querySelector("[aria-label='Svislé odsazení příspěvků']");
    postSpacingRange?.addEventListener("input", (event) => {
      updateDisplaySettings({ postSpacing: event.currentTarget.value }, { render: false });
      const output = event.currentTarget.parentElement?.querySelector("output");
      if (output) output.textContent = `${event.currentTarget.value} px`;
    });
    postSpacingRange?.addEventListener("change", (event) => {
      updateDisplaySettings({ postSpacing: event.currentTarget.value });
    });
    state.shadow.querySelector("[data-setting='post-separators']")?.addEventListener("change", (event) => {
      updateDisplaySettings({ postSeparators: event.currentTarget.checked });
    });
    const postAvatarRange = state.shadow.querySelector("[aria-label='Velikost avataru příspěvku posuvníkem']");
    postAvatarRange?.addEventListener("input", (event) => {
      updateDisplaySettings({ avatarSize: event.currentTarget.value }, { render: false });
      const output = event.currentTarget.parentElement?.querySelector("output");
      if (output) output.textContent = `${event.currentTarget.value} px`;
    });
    postAvatarRange?.addEventListener("change", (event) => {
      updateDisplaySettings({ avatarSize: event.currentTarget.value });
    });
    state.shadow.querySelector("[data-setting='reply-meta']")?.addEventListener("change", (event) => {
      updateDisplaySettings({ replyMeta: event.currentTarget.value });
    });
    state.shadow.querySelector("[data-setting='compare-handle']")?.addEventListener("change", (event) => {
      updateDisplaySettings({ compareHandle: event.currentTarget.checked }, { render: false });
    });
    state.shadow.querySelector("[data-setting='first-unread']")?.addEventListener("change", (event) => {
      resetFirstUnread();
      updateDisplaySettings({ firstUnread: event.currentTarget.checked });
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
    state.shadow.querySelector("[data-setting='favorite-font-family']")?.addEventListener("change", (event) => {
      updateFavoritesSettings({ fontFamily: event.currentTarget.value });
    });
    state.shadow.querySelector("[aria-label='Vlastní písmo oblíbených']")?.addEventListener("input", (event) => {
      updateFavoritesSettings(
        { customFontFamily: event.currentTarget.value },
        { render: false },
      );
      const normalized = normalizeCustomFamily(event.currentTarget.value);
      const invalid = Boolean(event.currentTarget.value.trim() && !normalized);
      event.currentTarget.setAttribute("aria-invalid", invalid ? "true" : "false");
      const hint = event.currentTarget.parentElement?.querySelector("small");
      if (hint) hint.textContent = invalid
        ? "Použijte jen názvy písem oddělené čárkami"
        : "Místní písma, oddělená čárkami";
    });
    const favoriteFontRange = state.shadow.querySelector("[aria-label='Velikost písma oblíbených posuvníkem']");
    const favoriteFontNumber = state.shadow.querySelector("[aria-label='Velikost písma oblíbených v pixelech']");
    favoriteFontRange?.addEventListener("input", (event) => {
      updateFavoritesSettings({ fontSize: event.currentTarget.value }, { render: false });
      if (favoriteFontNumber) favoriteFontNumber.value = displayFontSize(event.currentTarget.value);
    });
    favoriteFontNumber?.addEventListener("input", (event) => {
      if (event.currentTarget.value === "") return;
      updateFavoritesSettings({ fontSize: event.currentTarget.value }, { render: false });
      if (favoriteFontRange) favoriteFontRange.value = String(
        Math.min(32, Math.max(10, Number(event.currentTarget.value))),
      );
    });
    favoriteFontNumber?.addEventListener("change", (event) => {
      updateFavoritesSettings({ fontSize: event.currentTarget.value });
    });
    const favoriteSpacingRange = state.shadow.querySelector("[aria-label='Svislé odsazení oblíbených posuvníkem']");
    favoriteSpacingRange?.addEventListener("input", (event) => {
      updateFavoritesSettings({ spacing: event.currentTarget.value }, { render: false });
      const output = event.currentTarget.parentElement?.querySelector("output");
      if (output) output.textContent = `${event.currentTarget.value} px`;
    });
    favoriteSpacingRange?.addEventListener("change", (event) => {
      updateFavoritesSettings({ spacing: event.currentTarget.value });
    });
    state.shadow.querySelector("[data-action='reset-favorites-appearance']")?.addEventListener("click", resetFavoritesAppearance);
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
    for (const button of state.shadow.querySelectorAll("[data-action='thread']")) {
      button.addEventListener("click", async () => {
        const originalLabel = button.textContent;
        const needsResolution = !button.dataset.rootId;
        if (needsResolution) {
          button.disabled = true;
          button.textContent = "Načítám vlákno…";
        }
        const opened = await openThread(button.dataset.rootId, button.dataset.postId);
        if (!opened && button.isConnected) {
          button.disabled = false;
          button.textContent = "Vlákno nelze načíst";
          window.setTimeout(() => {
            if (button.isConnected) button.textContent = originalLabel;
          }, 1_500);
        }
      });
    }
    for (const post of state.shadow.querySelectorAll("[data-thread-branch]:not(.post--thread-muted)")) {
      const activate = (event) => {
        if (event.type === "keydown" && !["Enter", " "].includes(event.key)) return;
        if (event.target.closest("a, button, input, select, textarea, label")) return;
        if (event.type === "click" && window.getSelection?.().toString()) return;
        event.preventDefault();
        toggleThreadBranch(post.dataset.threadBranch);
      };
      post.addEventListener("click", activate);
      post.addEventListener("keydown", activate);
    }
    for (const link of state.shadow.querySelectorAll("[data-native-href]")) {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        if (state.editingFavoriteOrder && link.closest(".favorite-item")) return;
        const href = link.getAttribute("data-native-href");
        if (link.matches("[aria-current='page']")) return;
        if (link.closest(".favorite-item")) {
          startBoardVisitFromFavorite(
            href,
            link.dataset.unreadCount,
            link.dataset.boardId,
          );
        } else if (link.closest(".club-strip")) {
          const normalizedHref = normalizeClubRoute(href);
          const favorite = normalizedHref && state.favoriteSourceClubs.find(
            (club) => normalizeClubRoute(club.href) === normalizedHref,
          );
          if (favorite) {
            startBoardVisitFromFavorite(
              favorite.href,
              favorite.unread,
              favorite.id,
            );
          }
        }
        navigateNative(href);
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
        && !event.target.closest(".header-panel, .header-panel-toggle")
      ) setHeaderPanel("");
    };
    state.shadow.onkeydown = (event) => {
      if (event.key === "Escape") {
        if (state.openPostMenuId) setPostMenu("");
        else if (state.openHeaderPanel) setHeaderPanel("");
        return;
      }
      const menu = event.target.closest(".overflow-menu");
      if (!menu || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      const items = [...menu.querySelectorAll("[role^='menuitem']:not([disabled])")];
      if (!items.length) return;
      event.preventDefault();
      const current = items.indexOf(event.target);
      const next = event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : (current + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      items[next].focus();
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
    attachUiEvents,
    attachFavoriteReordering,
  });
}
