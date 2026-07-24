const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const scriptPath = path.join(__dirname, "..", "bokoun.user.js");
const source = fs.readFileSync(scriptPath, "utf8");
const structured = require(scriptPath);

function fixture(name) {
  return fs.readFileSync(path.join(__dirname, "fixtures", name), "utf8");
}

test("is an installable document-start Kapybara userscript", () => {
  assert.match(source, /@match\s+https:\/\/kapybara\.okoun\.cz\/\*/);
  assert.match(source, /@run-at\s+document-start/);
  assert.match(source, /@version\s+0\.4\.0/);
});

test("older-page fallback stays authenticated and same-origin", () => {
  assert.match(source, /fetch\(targetHref/);
  assert.match(source, /credentials: "same-origin"/);
  assert.match(source, /headers: \{ Accept: "text\/html" \}/);
  assert.match(source, /url\.origin !== location\.origin/);
  assert.match(source, /url\.pathname !== location\.pathname/);
  assert.doesNotMatch(source, /\bXMLHttpRequest\b/);
  assert.doesNotMatch(source, /\bCreatePost\b/);
  assert.doesNotMatch(source, /okapi\.okoun\.cz/);
});

test("compatibility layer uses semantic selectors, not generated Svelte classes", () => {
  assert.match(source, /favoriteRows: ".favorites-page a\[href\^='\/boards\/'\]"/);
  assert.match(source, /posts: "article.post\[data-post-id\]"/);
  assert.doesNotMatch(source, /🇸-/);
});

test("failure and full-version paths reveal native Kapybara", () => {
  assert.match(source, /function revealNative/);
  assert.match(source, /function openFullKapybara/);
  assert.match(source, /Native page was not ready; restored full Kapybara/);
});

test("temporary full mode always provides a visible route back to Bokoun", () => {
  assert.match(source, /const RETURN_HOST_ID = "bokoun-return"/);
  assert.match(source, /function showReturnControl/);
  assert.match(source, /function returnToBokoun/);
  assert.match(source, /aria-label="Zpět do Bokouna"/);
  assert.match(source, /state\.nativeMode = false/);
});

test("endless loading is single-flight, deduplicated, and recoverable", () => {
  assert.match(source, /state\.boardLoading/);
  assert.match(source, /state\.boardPostIndex\.get\(post\.id\)/);
  assert.match(source, /data-action="load-older"/);
  assert.match(source, /Starší příspěvky se nepodařilo načíst/);
  assert.match(source, /data-action="newest"/);
});

test("full/native handoff follows the visible post without reloading", () => {
  assert.match(source, /function captureBokounAnchor/);
  assert.match(source, /function captureNativeAnchor/);
  assert.match(source, /data-sveltekit-replacestate/);
  assert.match(source, /state\.boardPostPages\.get\(postId\)/);
});

test("scroll restoration happens after the lite content is rendered", () => {
  const renderIndex = source.indexOf("inner.innerHTML =");
  const restoreIndex = source.indexOf("restoreScroll(key", renderIndex);
  assert.ok(renderIndex > -1);
  assert.ok(restoreIndex > renderIndex);
  assert.match(source, /requestAnimationFrame\(\(\) => \{\s*requestAnimationFrame/);
});

test("simple writing uses hidden native Kapybara composers only", () => {
  assert.match(source, /newPostLauncher: "button\.entry-placeholder, button\.new-post"/);
  assert.match(source, /newPostComposer: "section\.new-post-composer/);
  assert.match(source, /replyComposer: "section\.reply-composer/);
  assert.match(source, /postReplyAction: "\.reply-action"/);
  assert.match(source, /document\.execCommand\("insertText", false, body\)/);
  assert.match(source, /composerMarkdownNode: "code\[data-language='markdown'\]"/);
  assert.doesNotMatch(source, /\bAuthorization\b/);
  assert.doesNotMatch(source, /X-API-Access-Code/);
});

test("composer preserves drafts and prevents ambiguous retries", () => {
  assert.match(source, /const DRAFTS_KEY = "bokoun\.drafts\.v1"/);
  assert.match(source, /const ACTIVE_COMPOSER_KEY = "bokoun\.active-composer\.v1"/);
  assert.match(source, /saveDraft\(state\.composer\.kind, state\.composer\.replyTo, value, state\.composer\.boardId\)/);
  assert.match(source, /function rememberActiveComposer/);
  assert.match(source, /function restoreActiveComposer/);
  assert.match(source, /function persistComposerDraft/);
  assert.match(source, /state\.composer\.ambiguous = Boolean\(error\?\.bokounSubmitted\)/);
  assert.match(source, /Neodesílejte znovu/);
});

test("board UI exposes new-post and per-post reply actions", () => {
  assert.match(source, /data-action="compose"/);
  assert.match(source, /data-action="reply"/);
  assert.match(source, /class="composer-textarea"/);
  assert.match(source, /Markdown/);
});

test("composers stay in the board flow and dim non-target posts while replying", () => {
  assert.match(source, /composer-panel composer-panel--\$\{composer\.kind === "reply" \? "reply" : "new"\}/);
  assert.match(source, /\.posts\.is-replying \.post:not\(\.post--reply-target\)/);
  assert.match(source, /replyTarget \? composerMarkup\(\) : ""/);
  assert.match(source, /\$\{newComposer\}\s+<section class="posts/);
  assert.doesNotMatch(source, /composer-backdrop/);
  assert.doesNotMatch(source, /aria-modal="true"/);
});

test("writing UX exposes saved drafts, explicit discard, and success context", () => {
  assert.match(source, /Koncept uložen v zařízení/);
  assert.match(source, /data-action="discard-draft"/);
  assert.match(source, /function discardComposerDraft/);
  assert.match(source, /function showWriteFeedback/);
  assert.match(source, /Odpověď odeslána\./);
  assert.match(source, /post--just-sent/);
  assert.match(source, /post--reply-context/);
  assert.match(source, /data-action="dismiss-feedback"/);
});

test("narrow board headers preserve more room for the title", () => {
  assert.match(source, /@media \(max-width: 420px\)/);
  assert.match(source, /full-label--short/);
  assert.match(source, /<span class="full-label--short" aria-hidden="true">Plná<\/span>/);
});

test("decodes a sanitized streamed SvelteKit board contract", () => {
  const roots = structured.decodeSvelteDataText(fixture("board.svelte-data.ndjson"));
  const model = structured.boardModelFromSvelteRoots(
    roots,
    "/boards/fixture-board",
    { sanitize: (html) => html },
  );

  assert.equal(model.title, "Fixture Board");
  assert.equal(model.posts.length, 1);
  assert.deepEqual(model.posts[0], {
    id: "1001",
    author: "fixture-user",
    date: "25.7.2026 12:00:00",
    datetime: "2026-07-25T10:00:00.000Z",
    replyReference: "Reakce na parent-user, 25.7.2026 11:00:00",
    bodyHtml: "<p>Fixture <strong>body</strong></p>",
    pageHref: "/boards/fixture-board",
  });
  assert.equal(
    model.nextOlderHref,
    "/boards/fixture-board?f=20260724-120000",
  );
});

test("decodes a sanitized streamed SvelteKit Favorites contract", () => {
  const roots = structured.decodeSvelteDataText(fixture("favorites.svelte-data.ndjson"));
  const model = structured.favoritesModelFromSvelteRoots(roots);

  assert.equal(model.length, 1);
  assert.equal(model[0].href, "/boards/fixture-club");
  assert.equal(model[0].name, "Fixture Club");
  assert.equal(model[0].unread, 3);
  assert.match(model[0].activity, /^před \d+ dny$/);
});

test("structured reads are primary and retain an explicit DOM fallback", () => {
  assert.match(source, /headers: \{ Accept: "text\/sveltekit-data" \}/);
  assert.match(source, /cachedStructuredModel\(type, key\)/);
  assert.match(source, /if \(!structuredRouteModel && !nativeReady\(type\)\) return/);
  assert.match(source, /!nativeReady\(type\) && !cachedStructuredModel\(type, routeKey\(\)\)/);
  assert.match(source, /else model = readFavoritesFromDom\(\)/);
  assert.match(source, /structuredModel \|\| readBoardFromDom\(document, key\)/);
  assert.match(source, /Structured \$\{type\} data unavailable; using DOM fallback/);
});
