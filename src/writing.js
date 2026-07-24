export function installWriting(ctx) {
  const {
    VERSION,
    COMPOSER_TIMEOUT_MS,
    POST_CONFIRM_TIMEOUT_MS,
    WRITE_FEEDBACK_MS,
    DRAFTS_KEY,
    ACTIVE_COMPOSER_KEY,
    SELECTORS,
    state,
    gmGet,
    gmSet,
  } = ctx;
  const routeType = (...args) => ctx.routeType(...args);
  const routeKey = (...args) => ctx.routeKey(...args);
  const text = (...args) => ctx.text(...args);
  const invalidateStructuredModel = (...args) => ctx.invalidateStructuredModel(...args);
  const readBoardFromDom = (...args) => ctx.readBoardFromDom(...args);
  const resetBoardAccumulator = (...args) => ctx.resetBoardAccumulator(...args);
  const nativePostById = (...args) => ctx.nativePostById(...args);
  const navigateNativeRoute = (...args) => ctx.navigateNativeRoute(...args);
  const render = (...args) => ctx.render(...args);
  const scheduleRender = (...args) => ctx.scheduleRender(...args);

  function currentBoardId() {
    const match = location.pathname.match(/^\/boards\/([^/]+)\/?$/);
    return match ? decodeURIComponent(match[1]) : "";
  }

  function composerDraftKey(kind, replyTo = "", boardId = currentBoardId()) {
    return `${boardId}:${kind}:${replyTo || ""}`;
  }

  function getDrafts() {
    const drafts = gmGet(DRAFTS_KEY, {});
    return drafts && typeof drafts === "object" && !Array.isArray(drafts) ? drafts : {};
  }

  function loadDraft(kind, replyTo = "", boardId = currentBoardId()) {
    const value = getDrafts()[composerDraftKey(kind, replyTo, boardId)];
    return typeof value === "string" ? value : "";
  }

  function saveDraft(kind, replyTo, body, boardId = currentBoardId()) {
    const drafts = getDrafts();
    const key = composerDraftKey(kind, replyTo, boardId);
    if (body) drafts[key] = body;
    else delete drafts[key];
    gmSet(DRAFTS_KEY, drafts);
  }

  function clearDraft(kind, replyTo = "", boardId = currentBoardId()) {
    saveDraft(kind, replyTo, "", boardId);
  }

  function getActiveComposer() {
    const active = gmGet(ACTIVE_COMPOSER_KEY, null);
    return active && typeof active === "object" && !Array.isArray(active) ? active : null;
  }

  function rememberActiveComposer(composer) {
    if (!composer) return;
    gmSet(ACTIVE_COMPOSER_KEY, {
      boardId: composer.boardId,
      kind: composer.kind,
      replyTo: composer.replyTo,
      replyAuthor: composer.replyAuthor,
    });
  }

  function forgetActiveComposer() {
    gmSet(ACTIVE_COMPOSER_KEY, null);
  }

  function restoreActiveComposer() {
    const boardId = currentBoardId();
    if (!boardId || state.writeBusy) return;
    if (state.composer?.boardId === boardId) return;
    if (state.composer && state.composer.boardId !== boardId) state.composer = null;

    const active = getActiveComposer();
    if (!active || active.boardId !== boardId || !["new", "reply"].includes(active.kind)) return;
    const replyTo = active.replyTo ? String(active.replyTo) : "";
    if (active.kind === "reply" && !state.boardPostIndex.has(replyTo)) return;
    const body = loadDraft(active.kind, replyTo, boardId);
    if (!body) return;

    const targetIndex = replyTo ? state.boardPostIndex.get(replyTo) : undefined;
    const target = targetIndex === undefined ? null : state.boardPosts[targetIndex];
    state.composer = {
      boardId,
      kind: active.kind,
      replyTo,
      replyAuthor: target?.author || active.replyAuthor || "",
      body,
      status: "editing",
      error: "",
      ambiguous: false,
    };
  }

  function openComposer(kind, replyTo = "") {
    if (state.writeBusy || routeType() !== "board") return;
    const boardId = currentBoardId();
    const targetIndex = replyTo ? state.boardPostIndex.get(String(replyTo)) : undefined;
    const target = targetIndex === undefined ? null : state.boardPosts[targetIndex];
    state.composer = {
      boardId,
      kind,
      replyTo: replyTo ? String(replyTo) : "",
      replyAuthor: target?.author || "",
      body: loadDraft(kind, replyTo, boardId),
      status: "editing",
      error: "",
      ambiguous: false,
    };
    rememberActiveComposer(state.composer);
    scheduleRender({ force: true });
    window.setTimeout(() => {
      const targetPost = state.composer?.kind === "reply"
        ? state.shadow?.querySelector(`[data-bokoun-post-id="${CSS.escape(state.composer.replyTo)}"]`)
        : state.shadow?.querySelector(".composer-panel--new");
      targetPost?.scrollIntoView({ block: "center", behavior: "smooth" });
      state.shadow?.querySelector(".composer-textarea")?.focus();
    }, 100);
  }

  function closeComposer() {
    if (state.writeBusy) return;
    if (!state.composer?.ambiguous) dismissNativeComposers();
    forgetActiveComposer();
    state.composer = null;
    scheduleRender({ force: true });
  }

  function discardComposerDraft() {
    if (!state.composer || state.writeBusy) return;
    const { kind, replyTo, boardId, ambiguous } = state.composer;
    clearDraft(kind, replyTo, boardId);
    forgetActiveComposer();
    if (!ambiguous) dismissNativeComposers();
    state.composer = null;
    scheduleRender({ force: true });
  }

  function updateDraftUi(value) {
    const hasDraft = Boolean(value);
    const status = state.shadow?.querySelector("[data-draft-status]");
    const discard = state.shadow?.querySelector("[data-action='discard-draft']");
    if (status) {
      status.textContent = hasDraft
        ? "Koncept uložen v zařízení"
        : "Koncept se ukládá automaticky";
    }
    if (discard) discard.hidden = !hasDraft;
  }

  function updateComposerBody(value) {
    if (!state.composer || state.writeBusy) return;
    state.composer.body = value;
    state.composer.error = "";
    saveDraft(state.composer.kind, state.composer.replyTo, value, state.composer.boardId);
    rememberActiveComposer(state.composer);
    updateDraftUi(value);
  }

  function persistComposerDraft() {
    if (!state.composer) return;
    const textarea = state.shadow?.querySelector(".composer-textarea");
    if (textarea) state.composer.body = textarea.value;
    saveDraft(
      state.composer.kind,
      state.composer.replyTo,
      state.composer.body,
      state.composer.boardId,
    );
    rememberActiveComposer(state.composer);
  }

  function clearWriteFeedback({ render = true } = {}) {
    clearTimeout(state.feedbackTimer);
    state.feedbackTimer = 0;
    state.writeFeedback = null;
    if (render) scheduleRender({ force: true });
  }

  function showWriteFeedback(composer, postId) {
    clearWriteFeedback({ render: false });
    state.writeFeedback = {
      boardId: composer.boardId,
      kind: composer.kind,
      postId,
      replyTo: composer.replyTo,
      message: composer.kind === "reply" ? "Odpověď odeslána." : "Příspěvek odeslán.",
    };
    state.feedbackTimer = window.setTimeout(clearWriteFeedback, WRITE_FEEDBACK_MS);
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
    const selectors = `${SELECTORS.newPostComposer}, ${SELECTORS.replyComposer}`;
    for (const section of document.querySelectorAll(selectors)) {
      const cancel = [...section.querySelectorAll("button")]
        .find((button) => text(button) === "Zrušit" || button.getAttribute("aria-label") === "Zrušit");
      cancel?.click();
    }
  }

  async function injectNativeMarkdown(section, body) {
    const toggle = section.querySelector(SELECTORS.composerModeToggle);
    if (!toggle) throw new Error("Native Markdown toggle is unavailable");
    if (toggle.getAttribute("aria-pressed") !== "true") toggle.click();

    const editable = await waitForNative(
      () => {
        const candidate = section.querySelector(SELECTORS.composerEditable);
        return candidate?.querySelector(SELECTORS.composerMarkdownNode) ? candidate : null;
      },
      COMPOSER_TIMEOUT_MS,
      "Native Markdown editor did not open",
    );
    editable.focus();
    const range = document.createRange();
    range.selectNodeContents(editable);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    const accepted = document.execCommand("insertText", false, body);
    if (!accepted) throw new Error("Native editor rejected the draft");

    await waitForNative(
      () => normalizeEditorText(editable.innerText) === normalizeEditorText(body),
      3_000,
      "Native editor did not retain the draft",
    );
  }

  function normalizeEditorText(value) {
    return String(value || "")
      .replace(/\r\n?/g, "\n")
      .replace(/\u00a0/g, " ")
      .trim();
  }

  function findCreatedPost(beforeIds, root = document) {
    return [...root.querySelectorAll(SELECTORS.posts)]
      .filter((post) => !beforeIds.has(post.getAttribute("data-post-id") || ""))
      .sort((left, right) => (
        Number(right.getAttribute("data-post-id") || 0)
        - Number(left.getAttribute("data-post-id") || 0)
      ))[0] || null;
  }

  async function waitForCreatedPost(beforeIds) {
    const started = Date.now();
    while (Date.now() - started < POST_CONFIRM_TIMEOUT_MS) {
      const created = findCreatedPost(beforeIds);
      if (created) return { created, root: document, pageHref: routeKey() };
      await new Promise((resolve) => window.setTimeout(resolve, 120));
    }

    const boardId = currentBoardId();
    if (!boardId) return null;
    const pageHref = `/boards/${encodeURIComponent(boardId)}`;
    const response = await fetch(pageHref, {
      credentials: "same-origin",
      headers: { Accept: "text/html" },
    });
    if (!response.ok) return null;
    const html = await response.text();
    const root = new DOMParser().parseFromString(html, "text/html");
    const created = findCreatedPost(beforeIds, root);
    return created ? { created, root, pageHref } : null;
  }

  async function submitThroughNative(composer) {
    const beforeIds = new Set([
      ...state.boardPostIndex.keys(),
      ...[...document.querySelectorAll(SELECTORS.posts)]
        .map((post) => post.getAttribute("data-post-id") || ""),
    ]);
    let submitted = false;
    let stage = "prepare";
    document.documentElement.dataset.bokounBridge = "true";

    try {
      dismissNativeComposers();
      let section;
      let submitLabel;

      if (composer.kind === "reply") {
        stage = "open-reply";
        const pageHref = state.boardPostPages.get(composer.replyTo) || routeKey();
        if (!nativePostById(composer.replyTo)) {
          await navigateNativeRoute(pageHref, composer.replyTo);
        }
        const target = nativePostById(composer.replyTo);
        const reply = target?.querySelector(SELECTORS.postReplyAction);
        if (!reply) throw new Error("Native reply action is unavailable");
        reply.click();
        section = await waitForNative(
          () => document.querySelector(SELECTORS.replyComposer),
          COMPOSER_TIMEOUT_MS,
          "Native reply composer did not open",
        );
        submitLabel = "Odeslat";
      } else {
        stage = "open-new-post";
        const launcher = document.querySelector(SELECTORS.newPostLauncher);
        if (!launcher) throw new Error("Native new-post action is unavailable");
        launcher.click();
        section = await waitForNative(
          () => document.querySelector(SELECTORS.newPostComposer),
          COMPOSER_TIMEOUT_MS,
          "Native new-post composer did not open",
        );
        submitLabel = "Odeslat příspěvek";
      }

      stage = "inject-markdown";
      await injectNativeMarkdown(section, composer.body.trim());
      const submit = [...section.querySelectorAll("button")]
        .find((button) => button.type === "submit" && text(button) === submitLabel);
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
    if (!state.composer || state.writeBusy || state.composer.ambiguous) return;
    const body = state.composer.body.trim();
    if (!body) {
      state.composer.error = "Napište nejdřív text příspěvku.";
      scheduleRender({ force: true });
      return;
    }

    state.composer.body = body;
    state.composer.status = "sending";
    state.composer.error = "";
    state.writeBusy = true;
    saveDraft(
      state.composer.kind,
      state.composer.replyTo,
      body,
      state.composer.boardId,
    );
    rememberActiveComposer(state.composer);
    scheduleRender({ force: true });

    try {
      const sent = { ...state.composer };
      const result = await submitThroughNative(sent);
      clearDraft(sent.kind, sent.replyTo, sent.boardId);
      forgetActiveComposer();
      state.composer = null;
      state.writeBusy = false;
      showWriteFeedback(sent, result.postId);
      invalidateStructuredModel("board", result.pageHref);
      resetBoardAccumulator(result.model, result.pageHref);
      state.currentSignature = "";
      render({ force: true });
      requestAnimationFrame(() => {
        state.shadow
          ?.querySelector(`[data-bokoun-post-id="${CSS.escape(result.postId)}"]`)
          ?.scrollIntoView({ block: "start", behavior: "smooth" });
      });
    } catch (error) {
      state.writeBusy = false;
      if (!state.composer) return;
      state.composer.status = "error";
      state.composer.ambiguous = Boolean(error?.bokounSubmitted);
      state.composer.error = error?.bokounSubmitted
        ? "Kapybara příspěvek převzala, ale Bokoun jej nedokázal potvrdit. Neodesílejte znovu; zkontrolujte plnou verzi."
        : "Příspěvek se nepodařilo odeslat. Koncept zůstal uložený.";
      scheduleRender({ force: true });
      console.warn(
        `[Bokoun ${VERSION}] Native write failed at ${error?.bokounStage || "unknown"}.`,
        error?.name || "Error",
      );
    }
  }

  Object.assign(ctx, {
    currentBoardId,
    composerDraftKey,
    getDrafts,
    loadDraft,
    saveDraft,
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
    injectNativeMarkdown,
    normalizeEditorText,
    findCreatedPost,
    waitForCreatedPost,
    submitThroughNative,
    submitComposer,
  });
}
