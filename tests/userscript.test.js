import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { installAdapters } from "../src/adapters.js";
import { installBoardState } from "../src/board-state.js";
import { installReadSync } from "../src/read-sync.js";
import { installSettings } from "../src/settings.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptPath = path.join(dirname, "..", "bokoun.user.js");
const sourceDir = path.join(dirname, "..", "src");
const generatedSource = fs.readFileSync(scriptPath, "utf8");
const source = [
  generatedSource,
  ...fs.readdirSync(sourceDir)
    .filter((name) => name.endsWith(".js"))
    .sort()
    .map((name) => fs.readFileSync(path.join(sourceDir, name), "utf8")),
].join("\n");
const structured = {};
installAdapters(structured);

function fixture(name) {
  return fs.readFileSync(path.join(dirname, "fixtures", name), "utf8");
}

test("is an installable document-start Kapybara userscript", () => {
  assert.match(source, /@match\s+https:\/\/kapybara\.okoun\.cz\/\*/);
  assert.match(source, /@run-at\s+document-start/);
  assert.match(source, /@version\s+0\.6\.6/);
  assert.match(
    source,
    /@icon\s+https:\/\/github\.com\/hanenashi\/bokoun\/raw\/refs\/heads\/main\/assets\/bokoun\.ico/,
  );
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
  assert.match(source, /postAvatar: "\.avatar img"/);
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
  assert.match(source, /searchParams\.get\("rootId"\)/);
  assert.doesNotMatch(source, /searchParams\.get\("t"\)/);
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
  assert.doesNotMatch(source, /mutation CreatePost/);
  assert.doesNotMatch(source, /variables:\s*\{[^}]*body:/);
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

test("board UI exposes new-post and avatar-triggered post actions", () => {
  assert.match(source, /data-action="compose"/);
  assert.match(source, /data-action="post-menu"/);
  assert.match(source, /data-action="reply"/);
  assert.match(source, /class="post-menu"/);
  assert.match(source, /class="composer-textarea"/);
  assert.match(source, /Markdown/);
});

test("post display settings persist avatar layout and safe font controls", () => {
  const stored = new Map();
  const settings = {
    DISPLAY_SETTINGS_KEY: "display",
    FAVORITES_ORDER_KEY: "favorite-order",
    FAVORITES_SETTINGS_KEY: "favorites",
    FONT_SETTINGS_KEY: "fonts",
    gmGet: (key, fallback) => stored.get(key) ?? fallback,
    gmSet: (key, value) => stored.set(key, value),
    state: {
      currentSignature: "",
      displaySettings: null,
      editingFavoriteOrder: false,
      favoriteManualOrder: null,
      favoriteSourceClubs: [],
      favoritesSettings: null,
      fontSettings: null,
      scroller: null,
    },
    scheduleRender() {},
  };
  installSettings(settings);

  assert.deepEqual(settings.currentDisplaySettings(), {
    showAvatars: true,
    avatarPosition: "inline",
    replyMeta: "full",
  });
  settings.updateDisplaySettings({ avatarPosition: "left" });
  assert.equal(stored.get("display").avatarPosition, "left");
  settings.updateDisplaySettings({ replyMeta: "compact" });
  assert.equal(stored.get("display").replyMeta, "compact");
  assert.equal(settings.normalizeFontSize("18.26"), 18.5);
  assert.equal(settings.normalizeFontSize(100), 72);
  assert.equal(
    settings.fontStack("classic-okoun"),
    'Verdana, "Bitstream Vera Sans", Arial, sans-serif',
  );
  assert.equal(
    settings.normalizeCustomFamily('  "Atkinson   Hyperlegible", Arial,sans-serif  '),
    '"Atkinson Hyperlegible", Arial, sans-serif',
  );
  assert.equal(settings.normalizeCustomFamily("url(evil), serif"), "");
});

test("Favorites preferences sort, persist manual order, and map unread heat", () => {
  const stored = new Map();
  const settings = {
    DISPLAY_SETTINGS_KEY: "display",
    FAVORITES_ORDER_KEY: "favorite-order",
    FAVORITES_SETTINGS_KEY: "favorites",
    FONT_SETTINGS_KEY: "fonts",
    gmGet: (key, fallback) => stored.get(key) ?? fallback,
    gmSet: (key, value) => stored.set(key, value),
    state: {
      currentSignature: "",
      displaySettings: null,
      editingFavoriteOrder: false,
      favoriteManualOrder: null,
      favoriteSourceClubs: [],
      favoritesSettings: null,
      fontSettings: null,
      scroller: null,
    },
    scheduleRender() {},
  };
  installSettings(settings);
  const clubs = [
    { href: "/boards/zaba", name: "Žába", unread: 2 },
    { href: "/boards/abel", name: "Ábel", unread: 15 },
    { href: "/boards/borek", name: "Borek", unread: 5 },
  ];
  settings.state.favoriteSourceClubs = clubs;

  assert.deepEqual(settings.currentFavoritesSettings(), {
    sort: "activity",
    unreadMode: "count",
    fontFamily: "default",
    customFontFamily: "",
    fontSize: 17,
    showAvatars: false,
    avatarSize: 34,
    avatarShape: "circle",
    avatarPosition: "left",
    spacing: 0,
  });

  settings.updateFavoritesSettings({ sort: "alphabetical" });
  assert.deepEqual(
    settings.sortFavorites(clubs).map((club) => club.name),
    ["Ábel", "Borek", "Žába"],
  );
  settings.updateFavoritesSettings({ sort: "unread", unreadMode: "both" });
  assert.deepEqual(
    settings.sortFavorites(clubs).map((club) => club.unread),
    [15, 5, 2],
  );
  assert.equal(stored.get("favorites").unreadMode, "both");

  settings.saveFavoriteOrder(["/boards/borek", "/boards/abel"]);
  settings.updateFavoritesSettings({ sort: "manual" });
  assert.deepEqual(
    settings.sortFavorites(clubs).map((club) => club.href),
    ["/boards/borek", "/boards/abel", "/boards/zaba"],
  );
  assert.deepEqual(
    stored.get("favorite-order"),
    ["/boards/borek", "/boards/abel", "/boards/zaba"],
  );
  assert.equal(settings.unreadHeat(0), "");
  assert.equal(settings.unreadHeat(1), "few");
  assert.equal(settings.unreadHeat(4), "few");
  assert.equal(settings.unreadHeat(5), "more");
  assert.equal(settings.unreadHeat(14), "more");
  assert.equal(settings.unreadHeat(15), "most");

  settings.updateFavoritesSettings({
    fontFamily: "classic-okoun",
    fontSize: 20.4,
    showAvatars: true,
    avatarSize: 200,
    avatarShape: "rounded",
    avatarPosition: "right",
    spacing: 11.6,
  });
  assert.deepEqual(
    {
      fontFamily: stored.get("favorites").fontFamily,
      fontSize: stored.get("favorites").fontSize,
      showAvatars: stored.get("favorites").showAvatars,
      avatarSize: stored.get("favorites").avatarSize,
      avatarShape: stored.get("favorites").avatarShape,
      avatarPosition: stored.get("favorites").avatarPosition,
      spacing: stored.get("favorites").spacing,
    },
    {
      fontFamily: "classic-okoun",
      fontSize: 20.5,
      showAvatars: true,
      avatarSize: 72,
      avatarShape: "rounded",
      avatarPosition: "right",
      spacing: 12,
    },
  );
});

test("Favorites UI exposes sorting, unread modes, and touch-safe manual ordering", () => {
  assert.match(source, /data-action="favorites-panel"/);
  assert.match(source, /data-setting="favorites-sort"/);
  assert.match(source, /data-setting="unread-mode"/);
  assert.match(source, /data-action="toggle-favorite-edit"/);
  assert.match(source, /class="favorite-drag-handle"/);
  assert.match(source, /touch-action: none/);
  assert.match(source, /favorite-row--heat-few/);
  assert.match(source, /favorite-row--heat-more/);
  assert.match(source, /favorite-row--heat-most/);
  assert.match(source, /data-unread-count=/);
  assert.match(source, /data-setting="favorite-font-family"/);
  assert.match(source, /data-setting="favorite-show-avatars"/);
  assert.match(source, /data-setting="favorite-avatar-position"/);
  assert.match(source, /data-setting="favorite-avatar-shape"/);
  assert.match(source, /Rozestup oblíbených posuvníkem/);
  assert.match(source, /class="favorite-avatar"/);
  assert.match(source, /--favorite-row-gap/);
  assert.match(source, /aria-label="\$\{escapeHtml\(`\$\{club\.name\}, \$\{unreadLabel\}/);
  assert.doesNotMatch(source, /<nav class="tabs"/);
  assert.match(source, /location\.pathname !== "\/fav\/activity"/);
});

test("reply metadata follows the body and reply moved into the popout menu", () => {
  const bodyIndex = source.indexOf('<div class="post-body">${post.bodyHtml}</div>');
  const referenceIndex = source.indexOf("replyMetaMarkup(post, display)", bodyIndex);
  const menuIndex = source.indexOf('class="post-menu"');
  const replyIndex = source.indexOf('data-action="reply"', menuIndex);
  assert.ok(bodyIndex > -1);
  assert.ok(referenceIndex > bodyIndex);
  assert.ok(menuIndex > -1);
  assert.ok(replyIndex > menuIndex);
  assert.doesNotMatch(source, /<div class="post-actions">\s*<button class="reply-button"/);
  assert.match(source, /data-setting="reply-meta"/);
  assert.match(source, /data-action="thread"/);
  assert.match(source, /threadMode \? "thread-back" : "back"/);
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
  assert.equal(model.id, "42");
  assert.equal(model.lastPosted, "2026-07-25T10:00:00.000Z");
  assert.equal(model.lastRead, "2026-07-25T09:30:00.000Z");
  assert.equal(model.newPostsCount, 1);
  assert.equal(model.posts.length, 1);
  assert.deepEqual(model.posts[0], {
    id: "1001",
    author: "fixture-user",
    avatarUrl: "/avatars/fixture-user.png",
    date: "25.7.2026 12:00:00",
    datetime: "2026-07-25T10:00:00.000Z",
    parentId: "999",
    parentAuthor: "parent-user",
    parentDate: "25.7.2026 11:00:00",
    rootId: "999",
    depth: 1,
    sequence: 1001,
    replyReference: "Reakce na parent-user, 25.7.2026 11:00:00",
    bodyHtml: "<p>Fixture <strong>body</strong></p>",
    pageHref: "/boards/fixture-board",
  });
  assert.equal(
    model.nextOlderHref,
    "/boards/fixture-board?f=20260724-120000",
  );
});

test("thread view keeps the root first and orders its replies chronologically", () => {
  const board = { state: {} };
  installBoardState(board);
  const posts = [
    { id: "103", rootId: "100", datetime: "2026-07-25T11:00:00.000Z", sequence: 3 },
    { id: "900", rootId: "800", datetime: "2026-07-25T08:00:00.000Z", sequence: 1 },
    { id: "100", rootId: "", datetime: "2026-07-25T09:00:00.000Z", sequence: 1 },
    { id: "102", rootId: "100", datetime: "2026-07-25T10:30:00.000Z", sequence: 2 },
  ];
  assert.deepEqual(
    board.threadPosts(posts, "100").map((post) => post.id),
    ["100", "102", "103"],
  );
});

test("classic new-post state uses a visit boundary and has no timeout", () => {
  const board = { state: {} };
  installBoardState(board);
  const posts = [
    { id: "103", datetime: "2026-07-25T10:00:00.000Z" },
    { id: "102", datetime: "2026-07-25T09:45:00.000Z" },
    { id: "101", datetime: "2026-07-25T09:00:00.000Z" },
  ];

  assert.deepEqual(
    board.newPostIdsForVisit(posts, {
      boardPath: "/boards/test",
      lastRead: "2026-07-25T09:30:00.000Z",
      unreadCount: 0,
    }),
    ["103", "102"],
  );
  assert.deepEqual(
    board.newPostIdsForVisit(posts, {
      boardPath: "/boards/test",
      lastRead: "",
      unreadCount: 2,
    }),
    ["103", "102"],
  );
  assert.equal(
    board.laterReadBoundary(
      "2026-07-25T09:30:00.000Z",
      "2026-07-25T10:00:00.000Z",
    ),
    "2026-07-25T10:00:00.000Z",
  );
  assert.match(source, /const BOARD_VISIT_KEY = "bokoun\.board-visit\.v1"/);
  assert.match(
    source,
    /const BOARD_READ_BOUNDARIES_KEY = "bokoun\.board-read-boundaries\.v1"/,
  );
  assert.match(source, /class="favorite-row/);
  assert.match(source, /prepareBoardVisitFromFavorite/);
  assert.match(source, /post--visit-new/);
  assert.match(source, /\.slice\(0, 100\)/);
  assert.doesNotMatch(source, /NEW_POST_TIMEOUT|newPostTimeout/);
});

test("decodes a sanitized streamed SvelteKit Favorites contract", () => {
  const roots = structured.decodeSvelteDataText(fixture("favorites.svelte-data.ndjson"));
  const model = structured.favoritesModelFromSvelteRoots(roots);

  assert.equal(model.length, 1);
  assert.equal(model[0].href, "/boards/fixture-club");
  assert.equal(model[0].name, "Fixture Club");
  assert.equal(model[0].unread, 3);
  assert.equal(model[0].lastPosted, "2020-01-02T10:00:00.000Z");
  assert.match(model[0].activity, /^před \d+ dny$/);
});

test("hardware Back finalizes a board visit before Favorites render", () => {
  const renderIndex = source.indexOf("function render({ force = false } = {})");
  const transitionIndex = source.indexOf(
    "finalizeBoardVisitTransition(previousKey, key)",
    renderIndex,
  );
  const favoritesIndex = source.indexOf('if (type === "favorites")', renderIndex);
  assert.ok(transitionIndex > renderIndex);
  assert.ok(transitionIndex < favoritesIndex);
  assert.match(source, /model = reconcileFavoriteReadState\(model\)/);
  assert.match(source, /boundary >= lastPosted/);
});

test("club header back arrow always targets Bokoun Favorites", () => {
  const goBack = source.match(/function goBack\(\) \{([\s\S]*?)\n  \}/)?.[1] || "";
  assert.match(goBack, /navigateNative\("\/fav\/activity"\)/);
  assert.doesNotMatch(goBack, /history\.back/);
  assert.match(source, /threadMode \? "thread-back" : "back"/);
  assert.match(source, /\[data-action='thread-back'\][^\n]*closeThread/);
});

test("native read sync is stable-page first, deduplicated, and unload-safe", () => {
  assert.match(source, /mutation MarkBoardAsRead/);
  assert.match(source, /markBoardAsRead\(boardId: \$boardId, timestamp: \$timestamp\)/);
  assert.match(source, /credentials: "include"/);
  assert.match(source, /keepalive: true/);
  assert.match(source, /timeZone: "Europe\/Prague"/);
  assert.match(source, /\$\{parts\.year\}\$\{parts\.month\}\$\{parts\.day\}-/);
  assert.match(source, /void syncNativeBoardRead\(state\.boardId, boardReadTimestamp\(\)\)/);
  assert.match(source, /if \(successful\.has\(syncKey\)\) return true/);
  assert.match(source, /if \(pending\.has\(syncKey\)\) return pending\.get\(syncKey\)/);
  assert.match(source, /function finalizeStoredBoardVisit/);
  assert.match(source, /if \(next\.pathname !== visit\.boardPath\) leaveBoardVisit\(visit\.boardPath\)/);
  assert.match(source, /mountShell\(\);\s*finalizeStoredBoardVisit\(\);/);
  assert.match(source, /localStorage, "auth_token"/);
  assert.doesNotMatch(source, /gmSet\([^\n]*auth_token/);
});

test("native read sync coalesces repeated stable-page acknowledgements", async () => {
  const originals = new Map();
  const replaceGlobal = (key, value) => {
    originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  };
  const storage = (entries = {}) => ({
    getItem: (key) => Object.hasOwn(entries, key) ? entries[key] : null,
  });
  const requests = [];

  replaceGlobal("document", {
    cookie: "auth_token=test-token",
    querySelector: () => ({ content: "https://okapi.okoun.cz/graphql" }),
  });
  replaceGlobal("location", { origin: "https://kapybara.okoun.cz" });
  replaceGlobal("localStorage", storage({ "okoun-api-access-code": "test-code" }));
  replaceGlobal("sessionStorage", storage());
  replaceGlobal("fetch", async (endpoint, options) => {
    requests.push({ endpoint, options });
    return { ok: true, json: async () => ({ data: { markBoardAsRead: { id: 42 } } }) };
  });

  try {
    const readSync = {};
    installReadSync(readSync);
    const first = readSync.syncNativeBoardRead(42, "2026-07-25T10:00:00.000Z");
    const second = readSync.syncNativeBoardRead(42, "2026-07-25T10:00:00.000Z");
    assert.deepEqual(await Promise.all([first, second]), [true, true]);
    assert.equal(await readSync.syncNativeBoardRead(42, "2026-07-25T10:00:00.000Z"), true);
    assert.equal(requests.length, 1);
    assert.equal(requests[0].endpoint, "https://okapi.okoun.cz/graphql");
    assert.equal(requests[0].options.credentials, "include");
    assert.match(JSON.parse(requests[0].options.body).variables.timestamp, /^\d{8}-\d{6}$/);
  } finally {
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
});

test("consecutive board visits retain separate local read boundaries", () => {
  const originalLocation = Object.getOwnPropertyDescriptor(globalThis, "location");
  const originalSession = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
  const session = new Map();
  Object.defineProperty(globalThis, "location", {
    configurable: true,
    value: { origin: "https://kapybara.okoun.cz" },
  });
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: {
      getItem: (key) => session.get(key) ?? null,
      setItem: (key, value) => session.set(key, value),
      removeItem: (key) => session.delete(key),
    },
  });
  const stored = new Map();
  const synced = [];
  const state = {
    boardLoadAbort: null,
    boardVisit: null,
    boardPosts: [],
    boardPostIndex: new Map(),
    boardPostPages: new Map(),
    boardLoadedPages: new Set(),
  };
  const ctx = {
    BOARD_VISIT_KEY: "visit",
    BOARD_READ_BOUNDARIES_KEY: "boundaries",
    gmGet: (key, fallback) => stored.get(key) ?? fallback,
    gmSet: (key, value) => stored.set(key, value),
    state,
    routeKey: () => "",
    normalizeHref: (value) => value,
    structuredCacheKey: (type, href) => `${type}:${href}`,
    syncNativeBoardRead: (id, timestamp) => synced.push([id, timestamp]),
  };
  installBoardState(ctx);
  const model = (id, timestamp) => ({
    id,
    title: `Club ${id}`,
    posts: [{ id: `${id}1`, datetime: timestamp }],
    nextOlderHref: "",
    lastPosted: timestamp,
    lastRead: "",
    newPostsCount: 1,
  });

  try {
    ctx.resetBoardAccumulator(model("1", "2026-07-25T10:00:00.000Z"), "/boards/one");
    ctx.leaveBoardVisit("/boards/one");
    ctx.resetBoardAccumulator(model("2", "2026-07-25T11:00:00.000Z"), "/boards/two");
    ctx.leaveBoardVisit("/boards/two");

    assert.deepEqual(synced.map(([id]) => id), ["1", "2"]);
    assert.deepEqual(Object.keys(stored.get("boundaries")).sort(), ["/boards/one", "/boards/two"]);
    assert.equal(session.has("visit"), false);
  } finally {
    if (originalLocation) Object.defineProperty(globalThis, "location", originalLocation);
    else delete globalThis.location;
    if (originalSession) Object.defineProperty(globalThis, "sessionStorage", originalSession);
    else delete globalThis.sessionStorage;
  }
});

test("structured reads are primary and retain an explicit DOM fallback", () => {
  assert.match(source, /headers: \{ Accept: "text\/sveltekit-data" \}/);
  assert.match(source, /cache: "no-store"/);
  assert.match(source, /cachedStructuredModel\(type, key\)/);
  assert.match(source, /if \(!structuredRouteModel && !nativeReady\(type\)\) return/);
  assert.match(source, /!nativeReady\(type\) && !cachedStructuredModel\(type, routeKey\(\)\)/);
  assert.match(source, /else model = readFavoritesFromDom\(\)/);
  assert.match(source, /structuredModel \|\| readBoardFromDom\(document, key\)/);
  assert.match(source, /Structured \$\{type\} data unavailable; using DOM fallback/);
});
