<p align="center">
  <img src="assets/bokoun.png" alt="Bokoun icon" width="400">
</p>

# Bokoun

A deliberately minimal mobile interface for Kapybara/Okoun.

> Status: structured-data reading, compact threaded clubs, visit-scoped new-post highlighting, configurable Favorites and posts, and inline Markdown writing pre-alpha (`0.6.3`).

## Install the first prototype

Install [bokoun.user.js](./bokoun.user.js) in Tampermonkey, Violentmonkey or
another userscript manager, then open Kapybara on a phone:

- [install Bokoun directly](https://github.com/hanenashi/bokoun/raw/refs/heads/main/bokoun.user.js)
  while signed into GitHub;
- after the first installation, reload any Kapybara tab that was already open;
- supported routes: `/fav/activity`, `/fav/topics` and `/boards/{club}`;
- Bokoun activates automatically at viewport widths up to 760 px;
- append `?bokoun=on` to a supported URL to try it on desktop;
- tap **Plná verze** to show normal Kapybara, then tap the floating **B** to
  return to Bokoun;
- use the userscript-manager menu to turn Bokoun off or on persistently.

The `0.6.3` prototype reads Favorites, boards and older post pages from
Kapybara's authenticated SvelteKit data transport, then normalizes them into
Bokoun's own small view model. It still sends explicit Markdown-only posts and
replies through Kapybara's hidden native Lexical composer. Bokoun does not call
GraphQL for post reads or writing, and does not store credentials or mirror read
post content. On leaving a structured board, it uses Kapybara's native read-state
mutation once to mark the latest displayed post as read. It keeps
preferences, explicit unsent drafts and one compact last-seen timestamp per
recent club locally on the device. Unsupported routes and initialization
failures restore normal Kapybara automatically.

Current prototype boundaries:

- it reads Favorites and boards from authenticated same-origin
  `text/sveltekit-data` routes;
- approaching the bottom loads older post batches through the same structured
  transport;
- if the structured contract or request fails, semantic DOM readers take over
  automatically instead of leaving a blank interface;
- loaded pages and sanitized post models live in memory only and disappear on
  a real page reload;
- duplicate boundary posts are removed by normalized post ID;
- Favorites can keep Kapybara's order, sort alphabetically or by unread count,
  or use a persistent touch-friendly manual order;
- unread counts can appear as numbers, a pale green/violet/coral heat scale,
  both, or neither; exact counts remain available to assistive technology;
- posts that were new when a club was entered stay white for that whole visit;
  read posts use a pale classic-blue tint, with no timer changing either state;
- refreshing or opening a thread keeps the active visit boundary, while leaving
  the club records its newest seen timestamp and returning combines it with
  Kapybara's latest read marker;
- Favorites always use Kapybara's Activity feed; the redundant Activity/Topics
  tab row is removed to recover mobile height;
- the pencil in the board header opens a plain Markdown editor above the posts;
- every displayed post has a small **Odpovědět** action; its editor opens inside
  that post while surrounding posts dim, but the board remains scrollable;
- half-written posts and replies reopen in the same place after navigation or a
  reload; Cancel closes the editor but keeps its draft locally;
- the editor reports when a draft is saved and offers a separate
  **Zahodit koncept** action for intentional deletion;
- successful sends show a temporary confirmation and briefly highlight the new
  post plus its reply target;
- posts show a compact avatar beside the author by default; display settings
  can move it to a left column or hide avatars entirely;
- tapping an avatar or author opens the post action menu, where **Odpovědět**
  now lives instead of occupying a permanent row below every post;
- replies use a compact lower-right `re: author` footer; settings can include
  the parent timestamp, show only the author, or hide the footer;
- tapping `re: author` opens a root-first chronological thread view backed by
  Kapybara's authenticated `rootId` route; Back returns to the normal club and
  its saved reading position;
- the italic **f** in the board header opens persistent font family, custom
  stack and font-size controls adapted from Cudloun; **Zobrazení…** opens the
  avatar settings, while long-press/right-click goes there directly;
- native Kapybara validates and submits; Bokoun never handles auth headers;
- an ambiguous submission is never retried automatically;
- automatic userscript updates are intentionally disabled while this repository
  remains private; install a newer file manually when the version changes.

The first practical test loop is:

1. open Favorites and scroll down;
2. open a club;
3. read;
4. use Bokoun's Back arrow;
5. confirm Favorites returns to the same position.

## Executive TL;DR

Bokoun will let the official Kapybara application remain the authenticated
connection to Okoun while replacing its visible mobile interface with something
much smaller:

- compact Favorites;
- clean chronological posts;
- reliable Back navigation and scroll restoration;
- a plain new-post/reply textarea;
- one escape hatch to the full Kapybara interface.

It will not use an external database, cloud mirror, scraper, harvester, proxy,
or separate account system. Posts remain on Okoun, reads come from Kapybara's
existing data path, and writes go through Okoun's existing authenticated
backend.

The safest first implementation is a standalone userscript with a full-screen
lite shell. Native Kapybara continues running invisibly as the initial
authentication, data, navigation, and posting bridge. Once that version is
proven, individual bridges can be replaced with direct structured-data/API
adapters without changing the visible UI.

## Why

Kapybara is a capable modern frontend, but a capable general frontend is not
always the best personal mobile reader.

For a phone used mainly to:

1. open Favorites;
2. choose a club;
3. read posts;
4. write a short reply;
5. go back to the same place;

the current interface carries significantly more navigation, presentation and
editing machinery than necessary. Bokoun is not intended to declare those
features bad. It is a focused alternate surface for a narrower workflow.

### Why not merely restyle Kapybara?

CSS can remove a lot of chrome, and a lite skin is a useful fallback. It cannot
fully simplify navigation, replace the interaction model, provide deterministic
scroll restoration, or turn the rich composer into a genuinely simple workflow.

### Why not MurkyPond?

MurkyPond solves a different problem: preserving access during an outage through
an archive, emergency chat, and external synchronization. Bokoun is an
alternative interface while Kapybara and Okoun are healthy.

Bokoun therefore does not need:

- Firestore or another external database;
- a Playwright harvester;
- duplicated post storage;
- a posting outbox;
- recovery synchronization;
- a continuously running computer or server.

### Why not a separate website or PWA?

A separate origin would make Kapybara authentication, authorization headers,
cookies, CORS and token refresh substantially harder. A userscript runs inside
the already authenticated Kapybara page and can reuse the official frontend's
session without exporting credentials anywhere.

## Product contract

Bokoun should feel like a quiet reader, not a miniature social network.

### Favorites

- One compact row per club.
- Club name, unread count and last activity only.
- Activity ordering only; Bokoun omits the extra tab row.
- Optional "only with unread posts" filter.
- Exact scroll position restored after returning from a club.
- No decorative cards or secondary metadata walls.

### Board

- Sticky bar with Back, club name and Favorites.
- Chronological post list.
- Clear visual separators.
- Author, date, body and a small reply reference.
- Reply action.
- Optional avatars, disabled by default if they cost useful reading width.
- Simple pagination/load-more controls.
- Stable position when posts or reply contexts expand.

### Composer

- Plain multiline textarea.
- Small reply context showing the target author/post.
- Send and Cancel.
- Markdown may be supported, but no visible formatting toolbar is required.
- Draft can be kept locally on the device.
- Native/full composer remains available through the escape hatch.

### Explicitly outside the first scope

- Messages.
- Gallery view.
- Reactions.
- Rich-text toolbar.
- Image library and uploads.
- Search.
- Topics management.
- Moderation tools.
- Account management.
- Theme marketplace.
- Offline archive.
- Cross-device state outside what Okoun already provides.

Unsupported routes must open normal Kapybara rather than fail mysteriously.

## Feasibility findings

Live Kapybara was inspected on 2026-07-24 using an authenticated test profile
and the private `nepotrebny_pokus` club.

### Reads

Board navigation obtains structured SvelteKit data from routes such as:

```text
/boards/{club}/__data.json
```

The data already contains the useful model Bokoun would need:

- board identity and permissions;
- posts and sanitized HTML bodies;
- author and timestamps;
- parent and root IDs;
- unread/read information;
- pagination boundaries;
- image metadata;
- content type;
- current-user state.

The SvelteKit data is backed by Okoun's existing GraphQL service:

```text
https://okapi.okoun.cz/graphql
```

Since `0.4.0`, this structured transport is Bokoun's primary read adapter. The
older semantic DOM adapter remains as a fail-open compatibility path.

### Writes

Native Kapybara creates a post with a GraphQL operation named:

```text
mutation CreatePost
```

The request uses Kapybara's existing runtime credentials:

```text
Authorization
X-API-Access-Code
X-Client-App
```

The feasibility probe blocked the diagnostic request inside the browser; no
post was sent.

The presence of runtime authorization is the main reason not to terminate
Kapybara before its authentication layer is ready. Bokoun must never log,
export or persist these credential values.

## Architecture options

| Approach | Advantages | Costs | Verdict |
| --- | --- | --- | --- |
| Lite CSS skin | Small, robust, reuses native events | Cannot fully remake behavior | Useful fallback |
| Full-screen userscript shell over native Kapybara | Complete visual freedom, existing auth and writes continue working | Native application still exists underneath | Recommended first version |
| Direct SvelteKit/GraphQL client | Cleanest runtime and smallest visible surface | Undocumented contracts and token lifecycle | Intended later evolution |
| Browser extension | Strong interception controls | Harder distribution and browser-specific behavior | Not initially justified |
| External PWA/proxy | Total independence | Reintroduces auth, hosting and infrastructure | Rejected |

## Recommended architecture

The first working Bokoun should be a standalone userscript rather than a
Cudloun module. Full takeover needs an early, predictable boot sequence and
should not make the general Cudloun loader responsible for replacing its host
application.

```text
Kapybara page
├── native application (authenticated, visually hidden)
│   ├── session and token refresh
│   ├── native data loading
│   └── native posting bridge
└── Bokoun userscript
    ├── boot/controller
    ├── route and history manager
    ├── Kapybara adapter
    ├── Favorites adapter
    ├── board/post adapter
    ├── composer bridge
    ├── local preferences/drafts
    └── full-screen lite UI
```

The UI and the data source are separated. A `BoardView` consumes normalized
Bokoun post objects, not raw Kapybara elements. The primary path is now:

```text
SvelteKit data -> normalized Bokoun model -> lite UI
```

with a compatibility fallback:

```text
semantic native DOM -> normalized Bokoun model -> same lite UI
```

## How the first version works

### Boot

1. The userscript starts on `kapybara.okoun.cz`.
2. It immediately hides page paint to prevent a flash of the full interface.
3. Kapybara is allowed to initialize its authenticated runtime.
4. Bokoun recognizes supported routes and starts the structured request without
   waiting for native post/Favorites selectors.
5. The lite shell mounts in an isolated Shadow DOM.
6. Native Kapybara remains hidden for read-state behavior, posting and fallback.

The script must have a clear timeout. If Bokoun cannot initialize, it restores
normal Kapybara automatically.

### Reading a board

1. The adapter fetches Kapybara's authenticated `__data.json` stream.
2. SvelteKit chunks are defensively decoded and normalized into Bokoun objects.
3. Bokoun renders its own list.
4. Route changes, periodic refreshes and pagination update the normalized model.
5. Kapybara continues owning server synchronization and read-state behavior.
6. A decode/request failure transparently selects the semantic DOM adapter.

Post bodies must be treated as untrusted even when supplied as server-rendered
HTML. Bokoun should apply a small explicit sanitization policy before inserting
HTML into its Shadow DOM.

### Opening Favorites

1. Native Kapybara loads the authenticated Favorites route.
2. Bokoun decodes the route's SvelteKit board list.
3. Bokoun renders a compact list.
4. Bokoun stores its own scroll position per history entry.
5. Back restoration waits until the list is rendered and tall enough before
   applying the saved position.

This explicitly avoids Kapybara's currently observed restoration race, where
the correct saved Y coordinate is applied while the Favorites list is still
empty and the browser clamps it to zero.

### New post and reply

The first safe transport is a hidden native-composer bridge:

1. Bokoun opens the corresponding native new-post or reply composer.
2. It supplies the plain/Markdown text.
3. The native application performs its normal validation and authenticated
   `CreatePost` operation.
4. Bokoun reports progress and the resulting post/error.
5. The native composer is closed and removed from the visible workflow.

This is less elegant than calling GraphQL directly, but it avoids handling
credentials in the first release.

Later, a direct transport may call `CreatePost` using authorization maintained
by the live Kapybara runtime. Credentials would remain in memory only and would
never enter Bokoun storage or logs.

## Navigation rules

Bokoun owns visible navigation even while Kapybara owns the underlying route.

- Every visible route gets a Bokoun history record.
- Favorites records include ordering/filter state and scroll Y.
- Board records include pagination cursor, focused post and scroll Y.
- Popstate restoration waits for content readiness.
- Unsupported routes exit to full Kapybara.
- A persistent emergency gesture or menu action disables Bokoun for the
  current tab.

Back must mean "return to where I was," not merely "load the previous URL."

### Endless reading and native handoff

Implemented in `0.2.0` and moved to structured reads in `0.4.0`: visible page
controls are replaced by endless loading:

1. When Bokoun approaches the bottom of its post list, it requests Kapybara's
   next authenticated structured-data page.
2. Only one batch may be in flight at a time.
3. Newly decoded posts are normalized and deduplicated by post ID.
4. The list exposes small loading, end-of-history and retry states.
5. No direct GraphQL pagination or credential handling is introduced.

Switching interfaces must not discard the accumulated post window. Bokoun
records the first fully visible post ID and its pixel offset, reveals the
already-loaded native DOM without reloading, finds the matching native
`article.post[data-post-id]`, and restores the same visual position. Returning
through **B** performs the reverse handoff without a page reload.

If the exact anchor is unavailable, recovery order is:

1. nearest loaded post;
2. oldest loaded post;
3. newest post as an explicit final reset.

Going to the newest post is therefore a deliberate action, not the automatic
cost of switching between Bokoun and Kapybara.

## Storage and privacy

Allowed local state:

- Bokoun enabled/disabled preference;
- typography and density;
- avatar visibility;
- Favorites filter preference;
- per-route scroll positions;
- unsent local drafts and the currently open composer identity.

Not allowed:

- copied Okoun password;
- persisted authorization headers;
- persisted API access code;
- mirrored post database;
- exported private-club content;
- analytics or telemetry by default.

Debug logging must record shapes, counts and state transitions—not post bodies,
messages, tokens or private user content.

## Failure and escape behavior

Bokoun must fail open:

- initialization failure restores full Kapybara;
- an unknown DOM/data contract shows "Open full Kapybara";
- posting failure leaves the draft intact;
- authentication expiry hands control back to native login;
- unsupported permissions/moderation flows use native UI;
- an update mismatch never leaves a blank page.

The normal Kapybara interface is the recovery console, not an enemy to remove.

## Compatibility boundary

Kapybara's generated scoped CSS classes are not an API. Adapters should prefer:

- routes;
- semantic elements and classes;
- roles and accessible names;
- stable data attributes;
- normalized SvelteKit data fields;
- named GraphQL operations.

All fragile knowledge belongs in one compatibility layer inspired by
Kapyguts. UI components must not contain Kapybara selectors or GraphQL field
assumptions directly.

## Source and build

The raw install URL still serves one self-contained userscript. That root
`bokoun.user.js` is now a generated artifact: edit the modules in `src/`, then
rebuild it. This keeps installation simple without keeping the implementation
in one long hand-maintained file.

```text
bokoun/
├── README.md
├── bokoun.user.js              # generated, directly installable artifact
├── package.json
├── assets/
│   ├── bokoun.ico              # userscript icon
│   └── bokoun.png              # README artwork
├── src/
│   ├── main.js                 # module assembly and guarded startup
│   ├── runtime.js              # constants and shared runtime state
│   ├── styles.js               # isolated Shadow DOM styles
│   ├── shell.js                # boot shell, preferences and scroll state
│   ├── adapters.js             # structured-data and semantic-DOM readers
│   ├── board-state.js          # normalized post window and deduplication
│   ├── writing.js              # drafts and native composer bridge
│   ├── pagination.js           # endless older-page loading
│   ├── settings.js             # persistent Favorites, display and font preferences
│   ├── ui.js                   # markup and UI event binding
│   ├── navigation.js           # native/Bokoun handoff and anchors
│   ├── controller.js
├── tests/
│   ├── fixtures/
│   └── userscript.test.js
└── tools/
    ├── build-userscript.mjs
    └── check-generated.mjs
```

Development commands:

```sh
npm install
npm run build
npm run check
npm test
```

`npm run check` compares a fresh in-memory build with the committed
`bokoun.user.js`, so a forgotten or manually edited artifact fails
deterministically. esbuild bundles the modules into an IIFE; Bokoun does not
load code or dependencies from the network at runtime.

## Roadmap

### Phase 0 — contract recorder

- Record sanitized structural fixtures for Favorites and a board.
- Define normalized `Club`, `Post`, `Page` and `ReplyTarget` shapes.
- Detect authenticated/native-ready states.
- Add a guaranteed escape/fallback mechanism.

Exit condition: current Kapybara pages can be inspected without copying private
content or depending on generated classes.

### Phase 1 — read-only shell

- Full-screen mobile shell.
- Compact Favorites.
- Chronological board.
- Native-backed endless loading of older post batches.
- One in-flight load, post-ID deduplication and loading/end/retry states.
- Native route synchronization.
- Reliable Back and scroll restoration.
- Post-ID anchor handoff to full Kapybara and back without reloading.
- Explicit **Nejnovější** reset; never reset position merely because the
  interface changed.

Exit condition: Favorites -> club -> load several older batches -> switch to
full Kapybara and back -> continue at the same post; Back then returns to the
exact Favorites row and position on Android.

### Phase 2 — simple writing

- Plain new-post textarea.
- Reply target.
- Draft preservation.
- Native composer bridge.
- Success, failure and retry states.

Exit condition: a post and a reply can be safely created in
`nepotrebny_pokus`, with no rich editor visible.

Implemented in `0.3.0`, with inline, reload-restoring composers added in
`0.3.1` and draft/send feedback polished in `0.3.2`. The bridge temporarily
renders native Kapybara under
Bokoun's opaque full-screen shell so its Lexical editor can accept real browser
editing commands without flashing the rich composer. New posts appear above the
board and replies inside their target post, with local draft and active-composer
storage, single-flight send state and
post-ID-based confirmation. Live reply `1074671043` verified the complete path
in `nepotrebny_pokus` on 2026-07-25.

### Phase 3 — structured-data adapter

- Decode the necessary SvelteKit board/Favorites data.
- Stop cloning native post DOM.
- Keep native authentication and posting transport.
- Add contract-version diagnostics and fixture tests.

Exit condition: native post and Favorites DOM can change without affecting the
visible Bokoun UI.

Implemented in `0.4.0`. Bokoun decodes newline-delimited SvelteKit data chunks,
uses structured board/Favorites/pagination models by default, refreshes them
periodically, reports the active adapter through `data-read-source`, and falls
back to semantic DOM reads after a request or contract failure. Structured boot
does not depend on the old native post/Favorites selectors. Synthetic fixtures
exercise the transport without retaining private club content.

The behavior-neutral `0.4.1` hardening release split the implementation into
cohesive source modules and added a reproducible single-file build. The raw
install path and runtime behavior remain unchanged.

Version `0.5.0` adds Bokoun-owned display preferences. Avatars can be compact
and inline, placed in a left column or hidden; author/avatar clicks open a
small post action menu, reply metadata sits below the body, and the board
header exposes Cudloun-inspired persistent font controls.

Version `0.5.1` adds Bokoun-owned Favorites preferences. Clubs can retain
Kapybara's activity order, sort Czech-aware alphabetically or by unread count,
or use a persistent manual order with touch drag handles. Unread activity can
be shown as an exact number, a restrained color heat scale, both, or hidden
visually while remaining in each row's accessible label.

Version `0.6.0` moves clubs toward the supplied classic-Okoun mobile reading
shape: larger inline avatars and authors, edge-to-edge separated posts, and
compact configurable reply footers. Structured posts retain parent and root
IDs. Opening a reply footer navigates through Kapybara's authenticated
`rootId` anchor route, filters the returned window to that root and its replies,
and presents them root-first in chronological order. The board Back button
returns to the unfiltered club. Favorites now always use Activity and no longer
spend a second sticky row on Activity/Topics tabs.

Version `0.6.1` restores classic Okoun's visit-scoped new-post treatment.
Bokoun snapshots Kapybara's `lastRead` marker before entering a club, keeps
newer posts white through scrolling, thread views and reloads, and uses a pale
blue background for already-read posts. The snapshot has no timeout and is
retired only after navigation leaves the club, so returning starts cleanly from
the later of Kapybara's read boundary and Bokoun's local last-seen timestamp.
Only the timestamp is stored; post bodies are not copied.

Version `0.6.2` closes a mobile navigation race found with Android's hardware
Back action. Board visits are now finalized before either the route observer or
an early Favorites render can win, and cached Favorites rows reconcile their
unread count against the same local last-seen boundary. The experimental
advertising `Permissions-Policy` warnings printed by Chromium remain harmless
server-header diagnostics and are unrelated to Bokoun's read state.

Version `0.6.3` synchronizes a completed Bokoun club visit back to Kapybara
and classic Okoun. On leaving a structured board, Bokoun sends Kapybara's own
`MarkBoardAsRead` mutation with the latest displayed board timestamp. It uses
the already-authenticated page session only for that request: credentials and
the access code are neither logged nor written to Bokoun storage. If the native
contract is unavailable, Bokoun keeps its local visit marker and fails quietly.

### Phase 4 — direct transport experiment

- Document `CreatePost` input shape.
- Reuse runtime authorization without persisting it.
- Handle refresh/expiry.
- Retain native transport as fallback.

Exit condition: direct posting is at least as safe and observable as the native
bridge.

### Phase 5 — hardening

- Kiwi/Tampermonkey Android.
- Firefox Android.
- Desktop recovery testing.
- Private clubs and permission failures.
- Large posts, images, deleted posts and ignored users.
- Accessibility and reduced motion.
- Update/fallback tests.

## Validation matrix

Every functional milestone should cover:

| Flow | Required result |
| --- | --- |
| Launch on Favorites | Lite shell appears without a full-UI flash |
| Open club | Correct board and post order |
| Back | Exact Favorites position restored |
| Endless loading | One batch at a time; no duplicated or missing posts |
| Switch to full UI | Same visible post and offset in native Kapybara |
| Return through B | Same loaded window and reading anchor without reload |
| Reset to newest | Happens only after an explicit user action |
| Open reply | Correct target shown |
| Open `re: author` | Root and replies appear as one chronological thread |
| Back from thread | Normal club and saved reading position return |
| Compose while reading | Board stays scrollable; other posts dim for a reply |
| Reload or leave while composing | Editor and text reopen in the same place |
| Cancel reply | Editor closes; draft remains available when reopened |
| Discard draft | Draft is deleted and does not return |
| Send reply | One post created, clear success and reply-context highlight |
| Auth expires | Full native login restored |
| Unknown route | Full Kapybara opens |
| Disable Bokoun | Native page returns without reload loop |

Initial development and any write testing belong in `nepotrebny_pokus`.

## How to begin — TL;DR

The first coding milestone should not touch GraphQL.

1. Create a document-start userscript with an emergency disable switch.
2. Let Kapybara boot normally but hide its paint.
3. Normalize Favorites and boards through one adapter.
4. Render a plain Shadow DOM shell.
5. Implement Bokoun-owned history and delayed scroll restoration.
6. Test the complete read-only loop on Android.
7. Only then add the hidden native composer bridge.

That path proves the product idea quickly while keeping authentication,
permissions, posts and server behavior entirely inside Kapybara/Okoun.

## Definition of success

Bokoun succeeds when using Okoun on a phone feels like reading a clean,
continuous conversation:

- little interface to learn;
- no irrelevant destinations;
- no rich editor unless explicitly requested;
- no lost place after Back;
- no external infrastructure;
- no duplicated identity or post store;
- full Kapybara always one action away.
