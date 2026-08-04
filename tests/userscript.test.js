import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { installAdapters } from "../src/adapters.js";
import { installBoardState } from "../src/board-state.js";
import { installPagination } from "../src/pagination.js";
import { installReadSync } from "../src/read-sync.js";
import { installSettings } from "../src/settings.js";
import { canonicalScrollRoute, installShell } from "../src/shell.js";
import { installWriting } from "../src/writing.js";
import { installFirstUnread } from "../src/first-unread.js";
import {
  inferNavigationDirection,
  installNavigation,
  preserveForcedBokounMode,
  sameFavoriteRoute,
  transitionRouteKey,
} from "../src/navigation.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptPath = path.join(dirname, "..", "bokoun.user.js");
const sourceDir = path.join(dirname, "..", "src");
const generatedSource = fs.readFileSync(scriptPath, "utf8");
const controllerSource = fs.readFileSync(path.join(sourceDir, "controller.js"), "utf8");
const shellSource = fs.readFileSync(path.join(sourceDir, "shell.js"), "utf8");
const uiSource = fs.readFileSync(path.join(sourceDir, "ui.js"), "utf8");
const navigationSource = fs.readFileSync(path.join(sourceDir, "navigation.js"), "utf8");
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
  assert.match(source, /@version\s+0\.9\.2/);
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

test("document-start cover owns startup until an opaque first route is paint-ready", () => {
  const paintGuard = shellSource.slice(
    shellSource.indexOf("function installGlobalStyle"),
    shellSource.indexOf("function waitForDocumentElement"),
  );
  const handoff = shellSource.slice(
    shellSource.indexOf("async function completeBootHandoff"),
    shellSource.indexOf("function revealNative"),
  );
  const nativeReveal = shellSource.slice(
    shellSource.indexOf("function revealNative"),
    shellSource.indexOf("async function openFullKapybara"),
  );

  assert.match(paintGuard, /html\[data-bokoun-booting="true"\]::before/);
  assert.match(paintGuard, /position: fixed;[\s\S]*inset: 0;[\s\S]*background: #f4f2ee/);
  assert.match(paintGuard, /prefers-color-scheme: dark[\s\S]*background: #17191b/);
  assert.match(paintGuard, /installGlobalStyle\(\);\s*document\.documentElement\.dataset\.bokounBooting = "true"/);
  assert.doesNotMatch(paintGuard, /body::before/);
  assert.doesNotMatch(
    shellSource.slice(
      shellSource.indexOf("function commitLayerState"),
      shellSource.indexOf("function setLayered"),
    ),
    /delete root\.dataset\.bokounBooting/,
  );
  assert.match(handoff, /querySelector\("\.route-content"\)/);
  assert.match(handoff, /data-initial-reveal-complete/);
  assert.match(handoff, /requestAnimationFrame\(resolve\)[\s\S]*requestAnimationFrame\(resolve\)/);
  assert.match(handoff, /getComputedStyle\(host\)\.backgroundColor/);
  assert.match(handoff, /delete root\.dataset\.bokounBooting/);
  assert.match(nativeReveal, /delete document\.documentElement\.dataset\.bokounBooting/);
  assert.match(controllerSource, /revealBokoun\(\{ initial: true, instant: true \}\)/);
  assert.doesNotMatch(controllerSource, /revealBokoun\(\{ initial: true \}\)/);
});

test("internal navigation retains the blurred outgoing route until target swap", () => {
  const routeChange = controllerSource.slice(
    controllerSource.indexOf("function handleRouteChange"),
    controllerSource.indexOf("function handleVisibilityChange"),
  );
  assert.match(routeChange, /querySelector\("\.route-content"\)/);
  assert.match(routeChange, /dataset\.routePending = "true"/);
  assert.match(routeChange, /outgoingRoute\.inert = true/);
  assert.doesNotMatch(routeChange, /innerHTML\s*=\s*['"`][\s\S]*class=["']loading/);
  assert.doesNotMatch(routeChange, /startPaintGuard|bokounBooting/);
  assert.match(navigationSource, /filter: "blur\(0\)"[\s\S]*filter: "blur\(10px\)"[\s\S]*fill: "forwards"/);
  assert.match(navigationSource, /filter: "blur\(12px\)"[\s\S]*filter: "blur\(0\)"/);
});

test("temporary full mode always provides a visible route back to Bokoun", () => {
  assert.match(source, /const RETURN_HOST_ID = "bokoun-return"/);
  assert.match(source, /function showReturnControl/);
  assert.match(source, /function returnToBokoun/);
  assert.match(source, /aria-label="Přepnout do Bokouna"/);
  assert.match(source, />◐<\/button>/);
  assert.match(source, /state\.nativeMode = false/);
  assert.match(shellSource, /if \(!document\.body \|\| document\.getElementById\(RETURN_HOST_ID\)\) return/);
  assert.match(shellSource, /document\.getElementById\(RETURN_HOST_ID\)\?\.remove\(\)/);
});

test("visual generations prevent stale and cancelled host reveals from reopening a hole", async () => {
  const originals = new Map();
  const replaceGlobal = (key, value) => {
    originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  };
  const deferred = () => {
    let resolve;
    let reject;
    const promise = new Promise((yes, no) => {
      resolve = yes;
      reject = no;
    });
    return { promise, resolve, reject };
  };
  const pending = [];
  const animations = [];
  const host = {
    isConnected: true,
    style: {},
    animate() {
      const completion = deferred();
      pending.push(completion);
      const animation = {
        finished: completion.promise,
        cancel() {
          completion.reject(new Error("cancelled"));
        },
      };
      animations.push(animation);
      return animation;
    },
  };
  const state = {
    active: true,
    nativeMode: false,
    layerReasons: new Set(["transition"]),
    comparePercent: 100,
    host,
    scroller: null,
    compareHost: null,
    visualGeneration: 0,
    visualIntent: "bokoun",
    hostRevealAnimation: null,
    visualWatching: false,
    visualWatchFrame: 0,
    visualLogEntries: [],
    visualLastWarning: "",
  };
  const shell = {
    VERSION: "test",
    state,
  };
  replaceGlobal("document", { documentElement: { dataset: {} } });
  replaceGlobal("matchMedia", () => ({ matches: false }));
  replaceGlobal("getComputedStyle", () => ({
    display: "block",
    visibility: "visible",
    opacity: "1",
    clipPath: host.style.clipPath || "none",
  }));
  try {
    installShell(shell);
    const staleGeneration = shell.beginVisualTransition("native-transition");
    const stale = shell.animateHostReveal(100, 0, staleGeneration);
    const currentGeneration = shell.beginVisualTransition("bokoun");
    const current = shell.animateHostReveal(0, 100, currentGeneration);
    pending[1].resolve();
    assert.equal(await current, true);
    assert.equal(await stale, false);
    assert.equal(host.style.clipPath, "inset(0 0% 0 0)");

    const cancelledGeneration = shell.beginVisualTransition("bokoun");
    const cancelled = shell.animateHostReveal(0, 100, cancelledGeneration);
    animations[2].cancel();
    assert.equal(await cancelled, true);
    assert.equal(host.style.clipPath, "inset(0 0% 0 0)");

    state.layerReasons.clear();
    state.comparePercent = 0;
    shell.commitLayerState("ordinary-route");
    assert.equal(host.style.clipPath, "inset(0 0% 0 0)");
    assert.equal(document.documentElement.dataset.bokounActive, "true");
  } finally {
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
});

test("visual state ownership is centralized, dormant, and bounded", () => {
  assert.match(shellSource, /function commitLayerState/);
  assert.match(shellSource, /const reveal = state\.active && !visualExposureAllowed\(\)\s*\? 100/);
  assert.match(shellSource, /generation === state\.visualGeneration/);
  assert.match(shellSource, /if \(!ownsVisualTransition\(generation\) \|\| state\.host !== host\) return false/);
  assert.match(shellSource, /if \(state\.nativeMode \|\| state\.visualIntent === "native-transition"\) return false/);
  assert.match(shellSource, /if \(!state\.visualWatching && !force\) return null/);
  assert.match(shellSource, /state\.visualLogEntries\.length > 250/);
  assert.match(controllerSource, /visualLog: \(\) => visualLog\(\)/);
  assert.match(controllerSource, /clearVisualLog: \(\) => clearVisualLog\(\)/);
  assert.match(controllerSource, /watchVisualState: \(enabled\) => watchVisualState\(enabled\)/);
  assert.match(shellSource, /active-host-disconnected/);
  assert.match(shellSource, /unexpected-native-exposure/);
});

test("ordinary route commits preserve the mounted opaque Bokoun shell", () => {
  const ordinaryRender = controllerSource.slice(
    controllerSource.indexOf("if (!state.host?.isConnected) mountShell();"),
    controllerSource.indexOf("const transitionDirection = consumeNavigationTransition"),
  );
  assert.match(ordinaryRender, /inner\.innerHTML = type === "favorites"/);
  assert.match(ordinaryRender, /commitLayerState\("render-committed"\)/);
  assert.doesNotMatch(ordinaryRender, /revealNative|\.remove\(\)|bokounActive/);
  assert.doesNotMatch(controllerSource, /state\.host\?\.remove|state\.host\.remove/);
  assert.match(shellSource, /#\$\{HOST_ID\} \{[\s\S]*background: #fff;[\s\S]*isolation: isolate;[\s\S]*contain: layout paint style;/);
  assert.match(shellSource, /state\.host\.style\.opacity = "1"/);
  assert.match(shellSource, /state\.host\.style\.clipPath = `inset\(0 \$\{100 - reveal\}% 0 0\)`/);
});

test("native exposure remains explicit and unsupported routes retain fail-open behavior", () => {
  const exposureSource = shellSource.slice(
    shellSource.indexOf("function visualExposureAllowed"),
    shellSource.indexOf("function visualSnapshot"),
  );
  assert.match(exposureSource, /state\.nativeMode/);
  assert.match(exposureSource, /state\.layerReasons\.has\("transition"\)/);
  assert.match(exposureSource, /state\.layerReasons\.has\("compare"\)/);
  assert.doesNotMatch(exposureSource, /route|render|loading|refresh/);
  assert.match(controllerSource, /type === "unsupported" \|\| !isMobileEligible\(\)[\s\S]*revealNative\(\)/);
  assert.match(controllerSource, /Native page was not ready; restored full Kapybara\.[\s\S]*revealNative\(\{ stop: true \}\)/);
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

test("pagination merges unique batches and recovers after structured and HTML failure", async () => {
  const originals = new Map();
  const replaceGlobal = (key, value) => {
    originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, {
      configurable: true,
      writable: true,
      value,
    });
  };
  const state = {
    nativeMode: false,
    boardLoading: false,
    boardEnd: false,
    boardNextHref: "/boards/test?f=one",
    boardLoadedPages: new Set(["/boards/test"]),
    boardPosts: [{ id: "1" }],
    boardPostIndex: new Map([["1", 0]]),
    boardPostPages: new Map([["1", "/boards/test"]]),
    boardTitle: "Test",
    boardId: "1",
    boardLastPosted: "",
    boardRetentionLimited: false,
    boardLoadAbort: null,
    boardAutoCooldownUntil: 0,
    boardError: "",
  };
  let structuredAttempt = 0;
  const models = [
    {
      id: "1",
      title: "Test",
      posts: [{ id: "1" }, { id: "2" }],
      nextOlderHref: "/boards/test?f=two",
    },
    {
      id: "1",
      title: "Test",
      posts: [{ id: "2" }, { id: "3" }],
      nextOlderHref: "",
    },
  ];
  const ctx = {
    PAGE_LOAD_TIMEOUT_MS: 1_000,
    OLDER_TRIGGER_PX: 900,
    BOARD_POST_LIMIT: 1_000,
    state,
    routeType: () => "board",
    routeKey: () => "/boards/test",
    normalizeHref: (value) => value,
    syncNativeBoardRead: async () => true,
    fetchStructuredModel: async () => {
      structuredAttempt += 1;
      if (structuredAttempt === 2) throw new Error("Synthetic structured failure");
      return { model: structuredAttempt === 1 ? models[0] : models[1] };
    },
    structuredCacheKey: (type, href) => `${type}:${href}`,
    storeStructuredEntry() {},
    readBoardFromDom() {
      throw new Error("HTML parser must not run for an HTTP failure");
    },
    scheduleRender() {},
    recordTraffic() {},
  };

  replaceGlobal("document", { visibilityState: "visible" });
  replaceGlobal("location", {
    origin: "https://kapybara.okoun.cz",
    pathname: "/boards/test",
  });
  replaceGlobal("window", {
    setTimeout,
    clearTimeout,
  });
  replaceGlobal("fetch", async () => ({ ok: false, status: 503 }));

  try {
    installBoardState(ctx);
    installPagination(ctx);

    await ctx.loadOlderPosts();
    assert.deepEqual(state.boardPosts.map(({ id }) => id), ["1", "2"]);
    assert.equal(state.boardNextHref, "/boards/test?f=two");

    await ctx.loadOlderPosts();
    assert.equal(state.boardError, "Starší příspěvky se nepodařilo načíst.");
    assert.deepEqual(state.boardPosts.map(({ id }) => id), ["1", "2"]);

    await ctx.loadOlderPosts();
    assert.deepEqual(state.boardPosts.map(({ id }) => id), ["1", "2", "3"]);
    assert.equal(state.boardPostIndex.size, 3);
    assert.equal(state.boardError, "");
    assert.equal(state.boardEnd, true);
  } finally {
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
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

test("route motion waits until restored scroll is settled", () => {
  const readyIndex = controllerSource.indexOf("const scrollReady = restoreScroll(");
  const settledIndex = controllerSource.indexOf("scrollReady.then(", readyIndex);
  const animationIndex = controllerSource.indexOf(
    "animateRouteEntry(transitionDirection)",
    settledIndex,
  );
  assert.ok(readyIndex > -1);
  assert.ok(settledIndex > readyIndex);
  assert.ok(animationIndex > settledIndex);
  assert.match(source, /resolve\(y\)/);
  assert.match(controllerSource, /if \(state\.currentRouteKey !== key\) return/);
});

test("stale native-navigation fallbacks cannot reload an older destination", () => {
  const navigateSource = navigationSource.slice(
    navigationSource.indexOf("function navigateNative(href"),
    navigationSource.indexOf("function goBack()"),
  );
  const fallbackIndex = navigateSource.indexOf("window.setTimeout(() => {");
  const ownershipIndex = navigateSource.indexOf(
    "commitSequence !== state.navigationCommitSequence",
    fallbackIndex,
  );
  const assignIndex = navigateSource.indexOf("location.assign(target.href)", fallbackIndex);
  assert.ok(fallbackIndex > -1);
  assert.ok(ownershipIndex > fallbackIndex);
  assert.ok(ownershipIndex < assignIndex);
});

test("scroll positions ignore the temporary Bokoun mode query", () => {
  assert.equal(
    canonicalScrollRoute("/fav/activity?bokoun=on"),
    "/fav/activity",
  );
  assert.equal(
    canonicalScrollRoute("/boards/test?rootId=42&bokoun=off"),
    "/boards/test?rootId=42",
  );
  assert.equal(
    canonicalScrollRoute("/boards/test?f=older&bokoun=on"),
    "/boards/test?f=older",
  );
});

test("forced desktop mode follows Bokoun-owned supported navigation", () => {
  const origin = "https://kapybara.okoun.cz";
  assert.equal(
    preserveForcedBokounMode(
      "/boards/test",
      `${origin}/fav/activity?bokoun=on`,
      origin,
    ).href,
    `${origin}/boards/test?bokoun=on`,
  );
  assert.equal(
    preserveForcedBokounMode(
      "/fav/activity",
      `${origin}/boards/test?bokoun=on`,
      origin,
    ).href,
    `${origin}/fav/activity?bokoun=on`,
  );
  assert.equal(
    preserveForcedBokounMode(
      "/boards/test?rootId=42",
      `${origin}/boards/test?bokoun=on`,
      origin,
    ).href,
    `${origin}/boards/test?rootId=42&bokoun=on`,
  );
  assert.equal(
    preserveForcedBokounMode(
      "/messages",
      `${origin}/boards/test?bokoun=on`,
      origin,
    ).href,
    `${origin}/messages`,
  );
  assert.equal(
    preserveForcedBokounMode(
      "/boards/test?bokoun=off",
      `${origin}/fav/activity?bokoun=on`,
      origin,
    ).href,
    `${origin}/boards/test?bokoun=off`,
  );
});

test("favorite anchors ignore temporary Bokoun mode queries", () => {
  assert.equal(
    sameFavoriteRoute(
      "/boards/test?bokoun=on",
      "/boards/test",
      "https://kapybara.okoun.cz",
    ),
    true,
  );
  assert.equal(
    sameFavoriteRoute(
      "/boards/other?bokoun=on",
      "/boards/test",
      "https://kapybara.okoun.cz",
    ),
    false,
  );
});

test("simple writing uses hidden native Kapybara composers only", () => {
  assert.match(source, /newPostLauncher: "button\.entry-placeholder, button\.new-post"/);
  assert.match(source, /newPostComposer: "section\.new-post-composer/);
  assert.match(source, /replyComposer: "section\.reply-composer/);
  assert.match(source, /postReplyAction: "\.reply-action"/);
  assert.match(source, /document\.execCommand\("insertText", false, body\)/);
  assert.doesNotMatch(source, /range\.collapse\(false\)/);
  assert.match(source, /editable\?\.__lexicalEditor/);
  assert.match(source, /editor\.setEditorState\(editor\.parseEditorState\(json\)\)/);
  assert.match(source, /replaceLexicalMarkdown\(editable, body\)\s*\|\|\s*replaceBrowserText/);
  assert.match(source, /composerMarkdownNode: "code\[data-language='markdown'\]"/);
  assert.match(
    source,
    /await waitForNative\(\s*\(\) => !visibleNativeComposer\(\)[\s\S]*Native composer did not close/,
  );
  assert.match(
    source,
    /const launcher = await waitForNative\(\s*\(\) => visibleNativeElement\(SELECTORS\.newPostLauncher\)[\s\S]*Native new-post action is unavailable/,
  );
  assert.match(
    source,
    /\(\) => visibleNativeComposer\(SELECTORS\.newPostComposer\)[\s\S]*Native new-post composer did not open/,
  );
  assert.doesNotMatch(source, /mutation CreatePost/);
  assert.doesNotMatch(source, /variables:\s*\{[^}]*body:/);
});

test("composer preserves drafts and prevents ambiguous retries", () => {
  assert.match(source, /const DRAFTS_KEY = "bokoun\.drafts\.v1"/);
  assert.match(source, /const ACTIVE_COMPOSER_KEY = "bokoun\.active-composer\.v1"/);
  assert.match(source, /state\.draftSaveTimer = window\.setTimeout\(\s*persistComposerDraft,\s*DRAFT_SAVE_DELAY_MS/);
  assert.match(source, /function rememberActiveComposer/);
  assert.match(source, /function restoreActiveComposer/);
  assert.match(source, /function persistComposerDraft/);
  assert.match(source, /state\.composer\.ambiguous = Boolean\(error\?\.bokounSubmitted\)/);
  assert.match(source, /Neodesílejte znovu/);
});

test("an ambiguous native submission keeps its draft and cannot submit twice", async () => {
  const originalLocation = Object.getOwnPropertyDescriptor(globalThis, "location");
  Object.defineProperty(globalThis, "location", {
    configurable: true,
    value: {
      pathname: "/boards/nepotrebny_pokus",
      origin: "https://kapybara.okoun.cz",
    },
  });
  const values = new Map();
  const state = {
    composer: {
      boardId: "nepotrebny_pokus",
      kind: "new",
      replyTo: "",
      replyAuthor: "",
      body: "Bokoun QA ambiguous draft",
      status: "editing",
      error: "",
      ambiguous: false,
    },
    writeBusy: false,
    draftSaveTimer: 0,
  };
  const ctx = {
    VERSION: "test",
    DRAFT_SAVE_DELAY_MS: 1,
    DRAFT_LIMIT: 50,
    DRAFTS_KEY: "drafts",
    ACTIVE_COMPOSER_KEY: "active",
    SELECTORS: {},
    state,
    gmGet: (key, fallback) => values.get(key) ?? fallback,
    gmSet: (key, value) => values.set(key, value),
    routeType: () => "board",
    routeKey: () => "/boards/nepotrebny_pokus",
    scheduleRender() {},
  };
  const originalWarn = console.warn;
  let attempts = 0;

  try {
    installWriting(ctx);
    ctx.submitThroughNative = async () => {
      attempts += 1;
      const error = new Error("Synthetic lost confirmation");
      error.bokounSubmitted = true;
      error.bokounStage = "confirm";
      throw error;
    };
    console.warn = () => undefined;

    await ctx.submitComposer({ preventDefault() {} });
    assert.equal(attempts, 1);
    assert.equal(state.composer.ambiguous, true);
    assert.match(state.composer.error, /Neodesílejte znovu/);
    assert.equal(values.get("drafts")["nepotrebny_pokus:new:"], state.composer.body);

    await ctx.submitComposer({ preventDefault() {} });
    assert.equal(attempts, 1, "an ambiguous submission must not be attempted again");
  } finally {
    console.warn = originalWarn;
    if (originalLocation) Object.defineProperty(globalThis, "location", originalLocation);
    else delete globalThis.location;
  }
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
    RECENT_CLUBS_KEY: "recent-clubs",
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
      recentClubs: null,
      scroller: null,
    },
    scheduleRender() {},
  };
  installSettings(settings);

  assert.deepEqual(settings.currentDisplaySettings(), {
    interfacePreset: "default",
    colorScheme: "system",
    showClubStrip: true,
    pageTransitions: true,
    fullscreenMode: true,
    showAvatars: true,
    avatarPosition: "inline",
    avatarSize: 40,
    avatarShape: "circle",
    replyMeta: "full",
    postSpacing: 9,
    postSeparators: true,
    compareHandle: false,
    firstUnread: false,
  });
  settings.updateDisplaySettings({ avatarPosition: "left" });
  assert.equal(stored.get("display").avatarPosition, "left");
  settings.updateDisplaySettings({ replyMeta: "compact" });
  assert.equal(stored.get("display").replyMeta, "compact");
  settings.updateDisplaySettings({ avatarSize: 250, avatarShape: "rounded" });
  assert.equal(stored.get("display").avatarSize, 96);
  assert.equal(stored.get("display").avatarShape, "rounded");
  settings.updateDisplaySettings({ compareHandle: true });
  assert.equal(stored.get("display").compareHandle, true);
  settings.updateDisplaySettings({ postSpacing: 200, postSeparators: false });
  assert.equal(stored.get("display").postSpacing, 24);
  assert.equal(stored.get("display").postSeparators, false);
  settings.updateDisplaySettings({
    interfacePreset: "compact-reader",
    colorScheme: "dark",
  });
  assert.equal(stored.get("display").interfacePreset, "compact-reader");
  assert.equal(stored.get("display").colorScheme, "dark");
  settings.updateDisplaySettings({ showClubStrip: false });
  assert.equal(stored.get("display").showClubStrip, false);
  settings.updateDisplaySettings({ pageTransitions: false });
  assert.equal(stored.get("display").pageTransitions, false);
  settings.updateDisplaySettings({ fullscreenMode: false });
  assert.equal(stored.get("display").fullscreenMode, false);
  settings.updateDisplaySettings({
    interfacePreset: "unknown",
    colorScheme: "sepia",
  });
  assert.equal(stored.get("display").interfacePreset, "default");
  assert.equal(stored.get("display").colorScheme, "system");
  for (let index = 0; index < 10; index += 1) {
    settings.rememberRecentClub(`/boards/club-${index}`, `Club ${index}`);
  }
  assert.equal(settings.currentRecentClubs().length, 8);
  assert.deepEqual(settings.currentRecentClubs()[0], {
    href: "/boards/club-9",
    name: "Club 9",
  });
  settings.rememberRecentClub("/boards/club-4", "Club four");
  assert.deepEqual(settings.currentRecentClubs()[0], {
    href: "/boards/club-4",
    name: "Club four",
  });
  assert.equal(stored.get("recent-clubs").length, 8);
  settings.rememberRecentClub("https://example.com/boards/nope", "Nope");
  assert.equal(settings.currentRecentClubs().length, 8);
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

test("first unread navigation is one-shot, paint-safe, and route scoped", async () => {
  const originalLocation = globalThis.location;
  const originalRaf = globalThis.requestAnimationFrame;
  globalThis.location = { origin: "https://kapybara.okoun.cz" };
  globalThis.requestAnimationFrame = (callback) => callback();
  const listeners = new Map();
  const target = {
    dataset: { bokounPostId: "unread-2" },
    getBoundingClientRect: () => ({ top: 420 }),
  };
  const oldestTarget = {
    dataset: { bokounPostId: "unread-1" },
    getBoundingClientRect: () => ({ top: 220 }),
  };
  const scroller = {
    scrollTop: 100,
    addEventListener(type, callback) { listeners.set(type, callback); },
    querySelectorAll: () => [target, oldestTarget],
    getBoundingClientRect: () => ({ top: 0 }),
    scrollTo({ top }) { this.scrollTop = top; },
  };
  const state = {
    scroller,
    shadow: { querySelector: () => ({ getBoundingClientRect: () => ({ bottom: 50 }) }) },
    currentRouteKey: "/boards/test",
    disabled: false,
    nativeMode: false,
  };
  const ctx = {
    state,
    routeType: () => "board",
    currentDisplaySettings: () => ({ firstUnread: true }),
  };
  installFirstUnread(ctx);
  ctx.maybeScrollFirstUnread({
    model: {
      newPostIds: ["unread-2", "unread-1"],
      posts: [
        { id: "unread-2", datetime: "2026-08-04T12:00:00Z", sequence: 2 },
        { id: "unread-1", datetime: "2026-08-04T11:00:00Z", sequence: 1 },
      ],
    },
    key: "/boards/test",
    restorePromise: Promise.resolve(),
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(scroller.scrollTop, 262);
  scroller.scrollTop = 900;
  ctx.maybeScrollFirstUnread({
    model: {
      newPostIds: ["unread-2", "unread-1"],
      posts: [
        { id: "unread-2", datetime: "2026-08-04T12:00:00Z", sequence: 2 },
        { id: "unread-1", datetime: "2026-08-04T11:00:00Z", sequence: 1 },
      ],
    },
    key: "/boards/test",
    restorePromise: Promise.resolve(),
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(scroller.scrollTop, 900);
  assert.ok(listeners.has("wheel"));
  globalThis.location = originalLocation;
  globalThis.requestAnimationFrame = originalRaf;
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
      recentClubs: null,
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
    spacing: 12,
    unreadOnly: false,
  });
  assert.deepEqual(
    settings.sortFavorites(clubs).map((club) => club.unread),
    [15, 5, 2],
  );

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
  settings.updateFavoritesSettings({ unreadOnly: true });
  assert.equal(stored.get("favorites").unreadOnly, true);

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
    spacing: 11.6,
  });
  assert.deepEqual(
    {
      fontFamily: stored.get("favorites").fontFamily,
      fontSize: stored.get("favorites").fontSize,
      spacing: stored.get("favorites").spacing,
    },
    {
      fontFamily: "classic-okoun",
      fontSize: 20.5,
      spacing: 12,
    },
  );
});

test("Favorites UI exposes sorting, unread modes, and touch-safe manual ordering", () => {
  assert.match(source, /data-panel="favorite-sort"/);
  assert.match(source, /data-action="toggle-unread-only"/);
  assert.match(source, /data-action="edit-favorite-order"/);
  assert.match(source, /data-setting="favorites-sort"/);
  assert.match(source, /data-setting="unread-mode"/);
  assert.match(source, /class="favorite-drag-handle"/);
  assert.match(source, /touch-action: none/);
  assert.match(source, /favorite-row--heat-few/);
  assert.match(source, /favorite-row--heat-more/);
  assert.match(source, /favorite-row--heat-most/);
  assert.match(source, /favorite-row--unread/);
  assert.match(source, /Aktivita \+ nové/);
  assert.match(source, /data-unread-count=/);
  assert.match(source, /data-setting="favorite-font-family"/);
  assert.match(source, /Svislé odsazení oblíbených posuvníkem/);
  assert.match(source, /--favorite-row-padding/);
  assert.doesNotMatch(source, /class="favorite-avatar"/);
  assert.match(source, /data-setting="avatar-shape"/);
  assert.match(source, /Velikost avataru příspěvku posuvníkem/);
  assert.match(source, /aria-label="\$\{escapeHtml\(`\$\{club\.name\}, \$\{unreadLabel\}/);
  assert.doesNotMatch(source, /<nav class="tabs"/);
  assert.match(source, /location\.pathname !== "\/fav\/activity"/);
});

test("live comparison uses an opt-in accessible drag handle and layered native view", () => {
  assert.match(source, /data-setting="compare-handle"/);
  assert.match(source, /role="slider"/);
  assert.match(source, /aria-label="Porovnání Bokouna a Kapybary"/);
  assert.match(source, /touch-action: none/);
  assert.match(source, /function animateHostReveal/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /data-bokoun-layered/);
  assert.match(source, /data-bokoun-aligning/);
  assert.match(source, /restoreNativeAnchor\(state\.compareAnchor\)/);
  const handoffSource = shellSource.slice(
    shellSource.indexOf("function animateHostReveal"),
    shellSource.indexOf("function removeCompareHandle"),
  );
  assert.match(handoffSource, /clipPath/);
  assert.doesNotMatch(handoffSource, /filter: "blur/);
});

test("compact reader preset is reversible and has light, dark, and system palettes", () => {
  assert.match(source, /data-setting="interface-preset"/);
  assert.match(source, /value="compact-reader"/);
  assert.match(source, /data-setting="color-scheme"/);
  assert.match(source, /value="system"/);
  assert.match(source, /value="light"/);
  assert.match(source, /value="dark"/);
  assert.match(source, /data-interface-preset="compact-reader"/);
  assert.match(source, /data-color-scheme="dark"/);
  assert.match(source, /prefers-color-scheme: dark/);
  assert.match(source, /Kompaktní čtečka mění pouze vzhled/);
});

test("compact reader club strip is optional, bounded, and request-free", () => {
  assert.match(source, /class="club-strip"/);
  assert.match(source, /aria-label="Rychlé přepínání klubů"/);
  assert.match(source, /data-setting="show-club-strip"/);
  assert.match(uiSource, /favoritesActive\s+\?\s+\[\{\s*href: "\/fav\/activity",\s*name: "Oblíbené"/);
  assert.match(uiSource, /:\s+\[\{\s*href: activeClub,\s*name: currentTitle/);
  assert.match(uiSource, /\.slice\(0, favoritesActive \? 7 : 6\)/);
  assert.match(source, /const MAX_RECENT_CLUBS = 8/);
  assert.match(source, /data-club-strip="visible"/);
  const clubStripSource = uiSource.slice(
    uiSource.indexOf("function clubStripMarkup("),
    uiSource.indexOf("function favoritesMarkup"),
  );
  assert.doesNotMatch(clubStripSource, /\bfetch\(/);
});

test("compact headers keep the mode switch visible and use contextual overflow menus", () => {
  assert.match(uiSource, /class="topbar topbar--favorites"[\s\S]*\$\{overflowControlMarkup\("favorites"\)\}[\s\S]*\$\{modeSwitchButton\(\)\}/);
  assert.match(uiSource, /class="topbar topbar--board"[\s\S]*data-action="compose"[\s\S]*\$\{overflowControlMarkup\("board"\)\}[\s\S]*\$\{modeSwitchButton\(\)\}/);
  assert.match(uiSource, /data-action="mode-switch"/);
  assert.match(uiSource, /aria-label="Přepnout do plné Kapybary"/);
  assert.doesNotMatch(uiSource, /class="font-toggle"/);
  assert.doesNotMatch(uiSource, /Plná verze/);

  const menuSource = uiSource.slice(
    uiSource.indexOf("function overflowMenuMarkup"),
    uiSource.indexOf("function favoriteSortPanelMarkup"),
  );
  for (const item of [
    "Řazení…",
    "Pouze nepřečtené",
    "Upravit pořadí",
    "Obnovit",
    "Přejít na nejnovější",
    "Písmo a vzhled…",
    "Zobrazení příspěvků…",
    "Plná Kapybara",
    "Nastavení Bokouna…",
    "Vypnout Bokouna",
  ]) assert.match(menuSource, new RegExp(item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(menuSource, /\bfetch\(|requestStructuredRefresh/);
  assert.match(uiSource, /state\.openHeaderPanel = ""/);
  assert.match(uiSource, /event\.key === "Escape"/);
  assert.match(uiSource, /\["ArrowDown", "ArrowUp", "Home", "End"\]/);
  assert.match(uiSource, /history\.pushState\(\{ \.\.\.historyState, bokounHeaderPanel: true \}/);
  assert.match(controllerSource, /state\.openHeaderPanel && routeKey\(\) === state\.currentRouteKey/);
});

test("mode switching and disabling remain distinct and preserve the handoff anchor", () => {
  assert.match(uiSource, /\[data-action='mode-switch'\][\s\S]*openFullKapybara/);
  assert.match(uiSource, /\[data-action='full'\][\s\S]*openFullKapybara/);
  assert.match(uiSource, /\[data-action='disable-bokoun'\][\s\S]*disableBokoun/);
  assert.match(shellSource, /function openFullKapybara\(\)[\s\S]*captureBokounAnchor/);
  assert.match(source, /function returnToBokoun\(\)[\s\S]*captureNativeAnchor/);
  assert.match(shellSource, /function disableBokoun\(\)[\s\S]*gmSet\(PREF_ENABLED_KEY, false\)/);
  assert.match(shellSource, /function disableBokoun\(\)[\s\S]*revealNative\(\{ stop: true \}\)/);
});

test("compact reader route transitions classify routes and use bounded blur motion", () => {
  assert.equal(
    transitionRouteKey("https://kapybara.okoun.cz/boards/test?bokoun=on"),
    "/boards/test",
  );
  assert.equal(
    transitionRouteKey("https://kapybara.okoun.cz/boards/test?rootId=42&f=older"),
    "/boards/test?rootId=42",
  );
  assert.equal(inferNavigationDirection("/fav/activity", "/boards/test"), "forward");
  assert.equal(inferNavigationDirection("/boards/test", "/fav/activity"), "back");
  assert.equal(
    inferNavigationDirection("/boards/test", "/boards/test?rootId=42"),
    "forward",
  );
  assert.equal(
    inferNavigationDirection("/boards/test?rootId=42", "/boards/test"),
    "back",
  );
  assert.equal(
    inferNavigationDirection("/boards/a", "/boards/b", { historyTraversal: true }),
    "back",
  );
  assert.equal(inferNavigationDirection("/boards/a", "/boards/b"), "lateral");
  assert.match(source, /data-setting="page-transitions"/);
  assert.match(source, /duration: 190/);
  assert.match(source, /duration: 130/);
  assert.match(source, /filter: "blur\(12px\)"/);
  assert.match(source, /filter: "blur\(10px\)"/);
  assert.match(source, /function routeAnimationTarget/);
  assert.match(source, /querySelector\("\.route-content"\) \|\| state\.scroller/);
  assert.match(source, /class="route-content">\s*<ul class="favorites"/);
  assert.match(source, /class="route-content">[\s\S]*class="posts/);
  assert.match(source, /function animateRouteExit/);
  assert.match(source, /function pinRouteBackground/);
  assert.match(source, /state\.host\.style\.backgroundColor = background/);
  assert.match(source, /animateRouteExit\(\)\.then\(performNavigation\)/);
  assert.match(source, /commitSequence !== state\.navigationCommitSequence/);
  assert.match(source, /prefersReducedMotion\(\)/);
  assert.match(source, /routeTransitionAnimation\?\.cancel\(\)/);
  assert.match(source, /intentAge >= 0/);
  assert.match(source, /intentAge < 5_000/);
  assert.match(source, /if \(state\.navigationEntryTransitionConsumed\) return ""/);
});

test("fullscreen mode defaults on, requires a safe gesture, and remains escapable", () => {
  assert.match(source, /data-setting="fullscreen-mode"/);
  assert.match(source, /Celá obrazovka/);
  assert.match(source, /request\.call\(document\.documentElement\)/);
  assert.match(source, /await document\.exitFullscreen\(\)/);
  assert.match(source, /event\?\.isTrusted/);
  assert.match(source, /node\.matches\("\[data-native-href\]"\)/);
  assert.match(source, /requestBokounFullscreen\(\{ force: true \}\)/);
  assert.match(source, /void exitBokounFullscreen\(\);\s*state\.active = false/);
  assert.doesNotMatch(source, /requestFullscreen\(\)[\s\S]*console\.warn/);
});

test("route transition intent is consumed once and disabling cancels active motion", () => {
  const originalLocation = Object.getOwnPropertyDescriptor(globalThis, "location");
  const originalSessionStorage = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
  const stored = new Map();
  Object.defineProperty(globalThis, "location", {
    configurable: true,
    value: {
      href: "https://kapybara.okoun.cz/fav/activity",
      origin: "https://kapybara.okoun.cz",
    },
  });
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: {
      getItem: (key) => stored.get(key) ?? null,
      setItem: (key, value) => stored.set(key, value),
      removeItem: (key) => stored.delete(key),
    },
  });
  try {
    let enabled = true;
    let cancelled = 0;
    const ctx = {
      NAVIGATION_INTENT_KEY: "transition",
      state: {
        pendingNavigationIntent: {
          source: "/boards/test",
          target: "/fav/activity",
          direction: "back",
          createdAt: Date.now(),
        },
        navigationEntryTransitionConsumed: false,
        routeTransitionAnimation: null,
      },
      currentDisplaySettings: () => ({
        interfacePreset: "compact-reader",
        pageTransitions: enabled,
      }),
      prefersReducedMotion: () => false,
    };
    installNavigation(ctx);
    assert.equal(ctx.consumeNavigationTransition("/fav/activity"), "back");
    assert.equal(ctx.consumeNavigationTransition("/fav/activity"), "");

    ctx.state.routeTransitionAnimation = {
      cancel: () => {
        cancelled += 1;
      },
    };
    enabled = false;
    assert.equal(ctx.consumeNavigationTransition("/fav/activity"), "");
    assert.equal(cancelled, 1);
    assert.equal(ctx.state.routeTransitionAnimation, null);
  } finally {
    if (originalLocation) Object.defineProperty(globalThis, "location", originalLocation);
    else delete globalThis.location;
    if (originalSessionStorage) {
      Object.defineProperty(globalThis, "sessionStorage", originalSessionStorage);
    } else {
      delete globalThis.sessionStorage;
    }
  }
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
  assert.match(source, /const threadRootId = post\.rootId \|\| post\.id/);
  assert.match(source, /data-root-id="\$\{escapeHtml\(threadRootId\)\}"/);
  assert.match(source, /threadMode \? "thread-back" : "back"/);
});

test("Phase 2 navigation and persistence are event-driven and bounded", () => {
  assert.match(controllerSource, /history\.pushState = state\.patchedPushState/);
  assert.match(controllerSource, /history\.replaceState = state\.patchedReplaceState/);
  assert.match(controllerSource, /window\.addEventListener\("popstate", state\.popStateHandler\)/);
  assert.match(controllerSource, /ROUTE_FALLBACK_POLL_MS/);
  assert.doesNotMatch(controllerSource, /ROUTE_POLL_MS|150/);
  assert.match(controllerSource, /state\.observer\.observe\(document\.body, \{ childList: true \}\)/);
  assert.doesNotMatch(
    controllerSource,
    /state\.observer\.observe\(document\.body, \{ childList: true, subtree: true \}\)/,
  );
  assert.match(controllerSource, /suspendNativeObservation\(\)/);
  assert.match(source, /SCROLL_SAVE_DELAY_MS/);
  assert.match(source, /scrollEntryKey\(route\)/);
  assert.match(source, /SCROLL_ROUTE_LIMIT/);
  assert.match(source, /STRUCTURED_CACHE_LIMIT/);
  assert.match(source, /BOARD_POST_LIMIT/);
  assert.match(source, /for \(const count of \[100, 500, 1_000\]\)/);
});

test("structured models use a bounded least-recently-used cache", () => {
  let clock = 10_000;
  const adapters = {
    STRUCTURED_CACHE_LIMIT: 2,
    now: () => clock,
    state: {
      structuredCache: new Map(),
      structuredFailures: new Map(),
    },
  };
  installAdapters(adapters);
  adapters.storeStructuredEntry("board:a", { model: { title: "A" }, fetchedAt: clock });
  adapters.storeStructuredEntry("board:b", { model: { title: "B" }, fetchedAt: clock });
  adapters.storeStructuredEntry("board:c", { model: { title: "C" }, fetchedAt: clock });
  assert.deepEqual([...adapters.state.structuredCache.keys()], ["board:b", "board:c"]);
  adapters.storeStructuredEntry("board:", { model: { title: "Age" }, fetchedAt: clock });
  clock += 12_000;
  assert.equal(adapters.structuredModelAge("board", "fixture"), 12_000);
  adapters.state.structuredCache.delete("board:");
  assert.equal(adapters.structuredModelAge("board", "fixture"), Number.POSITIVE_INFINITY);
  assert.match(source, /state\.structuredCache\.delete\(cacheKey\);\s*state\.structuredCache\.set\(cacheKey, entry\)/);
});

test("accumulated board models stop at the retained-post limit", () => {
  const state = {
    boardId: "",
    boardTitle: "",
    boardLastPosted: "",
    boardPosts: [],
    boardPostIndex: new Map(),
    boardPostPages: new Map(),
    boardLoadedPages: new Set(),
    boardNextHref: "",
    boardEnd: false,
    boardRetentionLimited: false,
  };
  const boards = {
    BOARD_POST_LIMIT: 3,
    state,
    routeKey: () => "/boards/test",
    normalizeHref: (value) => value,
  };
  installBoardState(boards);
  const added = boards.mergeBoardPage({
    id: "1",
    title: "Test",
    posts: [1, 2, 3, 4].map((id) => ({ id: String(id) })),
    nextOlderHref: "/boards/test?f=older",
  }, "/boards/test", { setNext: true });
  assert.equal(added, 3);
  assert.equal(state.boardPosts.length, 3);
  assert.equal(state.boardPostIndex.size, 3);
  assert.equal(state.boardRetentionLimited, true);
  assert.equal(state.boardEnd, true);
  assert.equal(state.boardNextHref, "");
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
  assert.match(source, /grid-template-columns: 40px minmax\(0, 1fr\) 40px 40px 40px/);
  assert.match(source, /\.mode-switch span/);
  assert.match(source, /font-size: 22px/);
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
  assert.match(source, /data-board-id=/);
  assert.match(source, /startBoardVisitFromFavorite/);
  assert.doesNotMatch(source, /prepareBoardVisitFromFavorite/);
  assert.match(source, /post--visit-new/);
  assert.match(source, /\.slice\(0, 100\)/);
  assert.doesNotMatch(source, /NEW_POST_TIMEOUT|newPostTimeout/);
});

test("decodes a sanitized streamed SvelteKit Favorites contract", () => {
  const roots = structured.decodeSvelteDataText(fixture("favorites.svelte-data.ndjson"));
  const model = structured.favoritesModelFromSvelteRoots(roots);

  assert.equal(model.length, 1);
  assert.equal(model[0].id, "42");
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
  assert.match(goBack, /navigateNative\("\/fav\/activity", \{ direction: "back" \}\)/);
  assert.doesNotMatch(goBack, /history\.back/);
  assert.match(source, /threadMode \? "thread-back" : "back"/);
  assert.match(source, /\[data-action='thread-back'\][\s\S]*else closeThread\(\)/);
});

test("native read sync is visit-boundary only, deduplicated, and unload-safe", () => {
  assert.match(source, /mutation MarkBoardAsRead/);
  assert.match(source, /markBoardAsRead\(boardId: \$boardId, timestamp: \$timestamp\)/);
  assert.match(source, /credentials: "include"/);
  assert.match(source, /keepalive: true/);
  assert.match(source, /timeZone: "Europe\/Prague"/);
  assert.match(source, /\$\{parts\.year\}\$\{parts\.month\}\$\{parts\.day\}-/);
  assert.match(source, /return syncNativeBoardRead\(state\.boardId, boardReadTimestamp\(\)\)/);
  assert.match(source, /successful\.get\(normalizedBoardId\)/);
  assert.match(source, /pending\.get\(normalizedBoardId\)/);
  assert.match(source, /X-Client-App": "bokoun"/);
  assert.match(source, /READ_SYNC_BACKOFF_BASE_MS/);
  assert.match(source, /const READ_SYNC_STATE_KEY = "bokoun\.read-sync-state\.v1"/);
  assert.match(source, /function finalizeStoredBoardVisit/);
  assert.match(source, /if \(next\.pathname !== visit\.boardPath\) leaveBoardVisit\(visit\.boardPath\)/);
  assert.match(
    source,
    /mountShell\(\);\s*setHostReveal\(0\);\s*finalizeStoredBoardVisit\(\);/,
  );
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
    setItem: (key, value) => {
      entries[key] = value;
    },
  });
  const sessionEntries = {};
  const requests = [];

  replaceGlobal("document", {
    cookie: "auth_token=test-token",
    querySelector: () => ({ content: "https://okapi.okoun.cz/graphql" }),
  });
  replaceGlobal("location", { origin: "https://kapybara.okoun.cz" });
  replaceGlobal("localStorage", storage({ "okoun-api-access-code": "test-code" }));
  replaceGlobal("sessionStorage", storage(sessionEntries));
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

    const restoredReadSync = {};
    installReadSync(restoredReadSync);
    assert.equal(
      await restoredReadSync.syncNativeBoardRead(42, "2026-07-25T10:00:00.000Z"),
      true,
    );
    assert.equal(requests.length, 1, "successful boundary must survive a same-tab reload");
  } finally {
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
});

test("failed native read sync observes per-board backoff", async () => {
  const originals = new Map();
  const replaceGlobal = (key, value) => {
    originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  };
  const storage = (entries = {}) => ({
    getItem: (key) => Object.hasOwn(entries, key) ? entries[key] : null,
    setItem: (key, value) => {
      entries[key] = value;
    },
  });
  let clock = 100_000;
  let requests = 0;

  replaceGlobal("document", {
    cookie: "auth_token=test-token",
    querySelector: () => ({ content: "https://okapi.okoun.cz/graphql" }),
  });
  replaceGlobal("location", { origin: "https://kapybara.okoun.cz" });
  replaceGlobal("localStorage", storage());
  replaceGlobal("sessionStorage", storage());
  replaceGlobal("fetch", async () => {
    requests += 1;
    return { ok: false, json: async () => null };
  });

  try {
    const readSync = {
      READ_SYNC_MIN_INTERVAL_MS: 5,
      READ_SYNC_BACKOFF_BASE_MS: 10,
      READ_SYNC_BACKOFF_MAX_MS: 100,
      now: () => clock,
    };
    installReadSync(readSync);
    assert.equal(await readSync.syncNativeBoardRead(42, "2026-07-25T10:00:00.000Z"), false);
    assert.equal(await readSync.syncNativeBoardRead(42, "2026-07-25T10:00:00.000Z"), false);
    assert.equal(requests, 1);
    clock += 11;
    assert.equal(await readSync.syncNativeBoardRead(42, "2026-07-25T10:00:00.000Z"), false);
    assert.equal(requests, 2);
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

test("structured refresh is explicit, visibility-aware, and instrumented", async () => {
  const originals = new Map();
  const replaceGlobal = (key, value) => {
    originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  };
  let visibilityState = "visible";
  let clock = 1_000_000;
  let requests = 0;
  let renders = 0;

  replaceGlobal("document", {
    get visibilityState() {
      return visibilityState;
    },
  });
  replaceGlobal("location", { origin: "https://kapybara.okoun.cz" });
  replaceGlobal("fetch", async () => {
    requests += 1;
    return {
      ok: true,
      headers: { get: () => "text/sveltekit-data" },
      text: async () => fixture("favorites.svelte-data.ndjson"),
    };
  });

  try {
    const adapters = {
      VERSION: "test",
      STRUCTURED_REFRESH_MS: 30_000,
      STRUCTURED_RESUME_MS: 120_000,
      SELECTORS: {},
      now: () => clock,
      scheduleRender() {
        renders += 1;
      },
      state: {
        structuredCache: new Map(),
        structuredPending: new Map(),
        structuredFailures: new Map(),
        trafficCounters: {
          structuredGets: 0,
          htmlFallbacks: 0,
          readMutations: 0,
          byReason: {},
        },
      },
    };
    installAdapters(adapters);

    await adapters.ensureStructuredModel("favorites", "/fav/activity", {
      reason: "initial-route",
    });
    assert.equal(requests, 1);
    assert.deepEqual(adapters.trafficSnapshot(), {
      structuredGets: 1,
      htmlFallbacks: 0,
      readMutations: 0,
      byReason: { "initial-route": 1 },
    });

    clock += 60_000;
    await Promise.resolve();
    assert.equal(requests, 1, "idle time alone must not trigger another request");

    await adapters.ensureStructuredModel("favorites", "/fav/activity", {
      reason: "favorites-poll",
      minimumAge: 60_000,
      render: false,
    });
    assert.equal(requests, 2);
    assert.equal(renders, 1, "a club-side Favorites poll must update cache without rerendering");
    assert.equal(adapters.trafficSnapshot().byReason["favorites-poll"], 1);

    visibilityState = "hidden";
    await adapters.ensureStructuredModel("favorites", "/fav/activity", {
      reason: "manual-refresh",
      force: true,
    });
    assert.equal(requests, 2, "hidden documents must not refresh");

    visibilityState = "visible";
    clock += 120_000;
    await adapters.ensureStructuredModel("favorites", "/fav/activity", {
      reason: "visibility-resume",
    });
    assert.equal(requests, 3);
    assert.equal(adapters.trafficSnapshot().byReason["visibility-resume"], 1);
  } finally {
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
});

test("ordinary rerenders are network-quiet and board entry has no preflight", () => {
  const render = controllerSource.match(
    /function render\(\{ force = false \} = \{\}\) \{([\s\S]*?)\n  \}\n\n  function scheduleRender/,
  )?.[1] || "";
  const sameRoute = controllerSource.match(
    /function handleRouteChange\(\) \{([\s\S]*?)finalizeBoardVisitTransition/,
  )?.[1] || "";
  const favoriteStart = source.match(
    /function startBoardVisitFromFavorite\([^)]*\) \{([\s\S]*?)\n  \}/,
  )?.[1] || "";

  assert.doesNotMatch(render, /ensureStructuredModel|syncNativeBoardRead|syncBoardVisitRead/);
  assert.match(sameRoute, /if \(key === state\.currentRouteKey\) return/);
  assert.doesNotMatch(favoriteStart, /fetch|ensureStructuredModel/);
  assert.match(source, /!nativeReady\(type\)[\s\S]*requestStructuredRefresh\("route-transition"\)/);
  assert.match(source, /ROUTE_DATA_FALLBACK_MS/);
  assert.match(source, /reason: "successful-post"/);
  assert.match(source, /document\.visibilityState === "hidden"/);
  assert.match(source, /state\.boardLoadAbort\?\.abort\(\)/);
});

test("Favorites polling is visible-route only, one-minute, and self-rescheduling", () => {
  const polling = controllerSource.slice(
    controllerSource.indexOf("function stopFavoritesRefresh"),
    controllerSource.indexOf("function exposeDebugTools"),
  );
  assert.match(source, /FAVORITES_REFRESH_MS = 60_000/);
  assert.match(polling, /\["favorites", "board"\]\.includes\(routeType\(\)\)/);
  assert.match(polling, /document\.visibilityState === "hidden"/);
  assert.match(polling, /ensureStructuredModel\("favorites", favoritesRefreshHref\(\)/);
  assert.match(polling, /render: routeType\(\) === "favorites"/);
  assert.match(polling, /finally \{\s*scheduleFavoritesRefresh\(\)/);
  assert.match(source, /stopFavoritesRefresh\(\);\s*state\.observer\?\.disconnect/);
  assert.match(source, /structuredModelAge\(type, key\) < FAVORITES_REFRESH_MS/);
  assert.match(source, /if \(!reusePolledFavorites\) invalidateStructuredModel\(type, key\)/);
});
