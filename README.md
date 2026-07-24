# Bokoun

A deliberately minimal mobile interface for Kapybara/Okoun.

> Status: Markdown writing pre-alpha with endless loading (`0.3.0`).

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

The `0.3.0` prototype adds explicit Markdown-only new posts and replies through
Kapybara's hidden native Lexical composer. It never calls GraphQL directly and
never stores credentials or mirrors read posts. Only explicit unsent drafts are
kept locally on the device. Unsupported routes and initialization failures
restore normal Kapybara automatically.

Current prototype boundaries:

- it shows Favorites and the first board page rendered by native Kapybara;
- approaching the bottom loads older 50-post pages through Kapybara's
  authenticated same-origin HTML route;
- loaded pages and sanitized post models live in memory only and disappear on
  a real page reload;
- duplicate boundary posts are removed by `data-post-id`;
- the pencil in the board header opens a plain Markdown new-post sheet;
- every displayed post has a small **Odpovědět** action with its target shown;
- unsent drafts survive Cancel and failures locally on that device;
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
- Activity and topic ordering if both remain useful.
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

This means Bokoun does not need to scrape the visual post DOM forever. A DOM
adapter can bootstrap the first version, while a structured-data adapter can
replace it later.

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

The UI and the data source must be separated from the beginning. A `BoardView`
should consume normalized Bokoun post objects, not raw Kapybara elements. That
allows the backing adapter to change later:

```text
native DOM -> normalized Bokoun model -> lite UI
```

then:

```text
SvelteKit data/GraphQL -> normalized Bokoun model -> same lite UI
```

## How the first version works

### Boot

1. The userscript starts on `kapybara.okoun.cz`.
2. It immediately hides page paint to prevent a flash of the full interface.
3. Kapybara is allowed to complete authentication and route rendering.
4. Bokoun recognizes supported routes.
5. The lite shell mounts in an isolated Shadow DOM.
6. Native Kapybara remains hidden but available to the adapter.

The script must have a clear timeout. If Bokoun cannot initialize, it restores
normal Kapybara automatically.

### Reading a board

1. The adapter observes Kapybara's completed board render.
2. Semantic post fields are normalized into Bokoun objects.
3. Bokoun renders its own list.
4. Route changes or pagination update the normalized model.
5. Kapybara continues owning server synchronization and read-state behavior.

Post bodies must be treated as untrusted even when supplied as server-rendered
HTML. Bokoun should apply a small explicit sanitization policy before inserting
HTML into its Shadow DOM.

### Opening Favorites

1. Native Kapybara loads the authenticated Favorites route.
2. The adapter extracts normalized club rows.
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

Implemented in `0.2.0`: visible page controls are replaced by native-backed
endless loading:

1. When Bokoun approaches the bottom of its post list, it asks hidden
   Kapybara to load the next older batch.
2. Only one batch may be in flight at a time.
3. Newly rendered posts are normalized and deduplicated by `data-post-id`.
4. The list exposes small loading, end-of-history and retry states.
5. No direct GraphQL pagination is introduced at this stage.

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
- unsent local drafts.

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

## Proposed repository shape

```text
bokoun/
├── README.md
├── bokoun.user.js              # installable seed/build artifact
├── src/
│   ├── boot.js
│   ├── controller.js
│   ├── router.js
│   ├── model.js
│   ├── storage.js
│   ├── sanitize.js
│   ├── adapters/
│   │   ├── kapybara-dom.js
│   │   ├── kapybara-data.js
│   │   └── kapybara-composer.js
│   └── ui/
│       ├── shell.js
│       ├── favorites.js
│       ├── board.js
│       ├── post.js
│       ├── composer.js
│       └── styles.js
├── tests/
│   ├── fixtures/
│   ├── adapters/
│   └── model/
└── tools/
    └── build-userscript.js
```

The actual structure should stay smaller until repetition justifies each file.

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

Implemented in `0.3.0`. The bridge temporarily renders native Kapybara under
Bokoun's opaque full-screen shell so its Lexical editor can accept real browser
editing commands without flashing the rich composer. New posts and replies
share one Markdown sheet, draft storage, single-flight send state and
post-ID-based confirmation. Live reply `1074671043` verified the complete path
in `nepotrebny_pokus` on 2026-07-25.

### Phase 3 — structured-data adapter

- Decode the necessary SvelteKit board/Favorites data.
- Stop cloning native post DOM.
- Keep native authentication and posting transport.
- Add contract-version diagnostics and fixture tests.

Exit condition: native post and Favorites DOM can change without affecting the
visible Bokoun UI.

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
| Cancel reply | No state or draft lost |
| Send reply | One post created, clear success/error |
| Auth expires | Full native login restored |
| Unknown route | Full Kapybara opens |
| Disable Bokoun | Native page returns without reload loop |

Initial development and any write testing belong in `nepotrebny_pokus`.

## How to begin — TL;DR

The first coding milestone should not touch GraphQL.

1. Create a document-start userscript with an emergency disable switch.
2. Let Kapybara boot normally but hide its paint.
3. Normalize Favorites and board DOM through one adapter.
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
