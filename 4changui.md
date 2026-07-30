# Read Chan / 4chan-reader style exploration for Bokoun

This document captures a side-direction for Codex: experiment with a Bokoun interface inspired by the interaction model and visual density of the Android app Read Chan, without turning Bokoun into a 4chan clone.

The reference screenshots show:

- a dense dark interface;
- a persistent horizontal board strip;
- plain list rows for boards;
- continuous edge-to-edge post sections rather than floating cards;
- a single in-app navigation stack;
- swipe/wipe transitions;
- gesture-driven Back and media navigation;
- a full-screen image viewer with a thumbnail filmstrip;
- one large context-sensitive floating action button;
- no opening into browser tabs or separate windows.

The useful lesson is not the 4chan-specific content model. It is the feeling of one continuous, thumb-friendly reading appliance.

## Product goal

Add an optional Bokoun presentation/navigation mode that feels like a compact native reader:

- everything stays inside one full-screen stack;
- Favorites, clubs, threads and media feel spatially connected;
- navigation has short directional transitions;
- gestures mirror visible Back/forward actions;
- posts form one continuous document;
- controls stay dense and reachable;
- external browser-style tab behavior is avoided for internal Bokoun routes.

This should be a mode or preset, not a replacement for the existing Bokoun interface.

Suggested working name:

- `Kompaktní čtečka`
- or internally `readerCompact` / `readChanStyle`

Do not use Read Chan branding in the shipped UI.

## Core principles to borrow

### 1. One navigation stack

The app should behave as:

```text
Favorites → Club → Thread → Media viewer
```

Each level replaces or layers over the previous one. Back returns to the exact prior state and position.

Internal Bokoun navigation should not open new tabs or windows. Existing external links may continue to use safe external navigation rules, but club/thread/media navigation should remain in the Bokoun stack.

Preserve:

- route identity;
- scroll position;
- post anchor and viewport offset;
- thread origin;
- media origin post;
- active composer/draft state.

### 2. Spatial transitions

Use a simple consistent rule:

- deeper navigation enters from the right;
- Back exits toward the right;
- switching between pinned/recent clubs may slide horizontally;
- native Kapybara handoff may keep the existing wipe behavior;
- media viewer may fade or rise over the thread.

Target duration: roughly 180–240 ms.

Requirements:

- animate transforms/opacity, not large layout properties;
- honor `prefers-reduced-motion`;
- do not block interaction longer than necessary;
- do not reintroduce duplicate network requests merely to animate a route;
- restore anchors after content readiness, not before.

### 3. Persistent horizontal club strip

Read Chan uses a horizontally scrollable board strip such as:

```text
Selected   /b/   /pol/   /adv/   /diy/
```

Bokoun equivalent:

```text
Oblíbené   Okoun   Fotky   Technika   …
```

Use a small set of clubs, not all Favorites. Candidate sources:

1. manually pinned clubs;
2. recently opened clubs;
3. current club plus a few neighbors from manual Favorites order.

Behavior:

- horizontally scrollable;
- active item shown by accent text and thin underline;
- compact text labels, no pills or cards;
- selecting a club uses normal Bokoun route handling;
- switching clubs preserves each route's saved position;
- exact unread counts may appear subtly but are not required in the first prototype.

The strip should be optional and independently disableable.

### 4. Continuous post document

Avoid card-heavy layout.

Posts should appear as sections in one document:

```text
author · time                         ⋮
re: parent
post body
──────────────────────────────────────
```

Visual direction:

- square edges;
- no shadows;
- minimal horizontal padding;
- low vertical padding;
- thin separators;
- muted metadata;
- post body remains dominant;
- read/new distinction continues to use Bokoun's visit-scoped semantics;
- no 4chan-specific OP/country/file metadata unless Bokoun actually has equivalent data.

Do not sacrifice readability merely to maximize density.

### 5. Distinct density by route

Do not force one universal component shape everywhere.

#### Favorites

- one compact row per club;
- no avatars by default;
- name, unread count and last activity;
- optional horizontal club strip above;
- strong row separators;
- very little decorative chrome.

#### Club

- continuous chronological post stream;
- compact author/time/reply metadata;
- context menu on avatar/author or overflow;
- obvious new-post action;
- visit-new styling remains deterministic.

#### Thread

- same continuous post language;
- focused title/header;
- root post and replies clearly distinguished but not boxed into cards;
- Back returns to the club and exact anchor.

#### Media viewer

- black full-screen background;
- small metadata header;
- current image fitted without browser tab handoff;
- horizontal thumbnail filmstrip when multiple images are available;
- swipe between media;
- Back or dismiss gesture returns to exact originating post.

### 6. Context-sensitive floating action button

Read Chan uses one large lower-left action button.

Possible Bokoun mapping:

- Favorites: edit/manual order or no FAB;
- Club: new post;
- Thread: reply;
- failed load: retry;
- media viewer: usually no FAB.

Rules:

- one primary action only;
- lower-left placement should be tested on both left- and right-handed use;
- visible label or accessible name required;
- do not overload tap with multiple meanings;
- long-press secondary actions are optional, not required for core use.

### 7. Gestures that mirror structure

Candidate gestures:

- edge swipe right: Back;
- horizontal swipe between adjacent pinned/recent clubs;
- swipe post slightly to expose Reply/Thread actions;
- media swipe left/right: previous/next image;
- media swipe down or edge-right: dismiss;
- optional pull/gesture refresh only if it does not cause accidental traffic.

Requirements:

- every gesture has a visible button/menu equivalent;
- begin only after a directional threshold;
- avoid stealing vertical scrolling;
- ignore gestures originating on text selection, form fields, sliders and media controls;
- support pointer cancellation;
- use velocity and distance thresholds;
- do not trigger route changes from minor diagonal movement;
- reduced-motion may keep gestures but skip animation.

## Visual language

Reference dark palette characteristics:

- near-black application background;
- dark-grey route surfaces;
- lighter grey primary text;
- muted grey metadata;
- warm orange/coral active accent;
- restrained blue-grey links;
- optional green/violet/coral state colors.

Do not copy 4chan semantic colors blindly. Bokoun's colors should preserve its own meanings:

- active navigation/action;
- links;
- visit-new/read states;
- errors/destructive actions.

Suggested characteristics:

- flat, square and dense;
- no gradient-heavy Material cards;
- no oversized titles;
- 1 px separators;
- typography controls continue to work;
- system dark/light support may be added later, but first prototype may target dark mode if scoped clearly as experimental.

## Header model

A compact header may contain:

```text
←   Club title                 Search   Post   ⋮
```

Below it, optionally:

```text
Oblíbené   Okoun   Fotky   Technika
```

Guidelines:

- keep route title truncated rather than wrapping into a huge bar;
- use icon buttons with accessible labels;
- current Bokoun controls must remain available somewhere;
- avoid adding a second permanent toolbar at the bottom unless testing proves it useful;
- the compact club strip should not consume excessive height.

## Media viewer concept

The screenshots show one of the strongest transferable pieces.

Prototype requirements:

1. Clicking a post image opens an internal full-screen viewer.
2. The viewer remembers the origin route, post ID and viewport offset.
3. Images belonging to currently loaded posts form a navigable media collection.
4. Header shows compact filename/dimensions/index when available.
5. Bottom filmstrip appears when more than one media item exists.
6. Swipe left/right changes media.
7. Back closes the viewer and restores the originating post exactly.
8. External original-file opening remains available from an overflow menu.
9. Lazy-load neighboring media only; do not preload an entire long club.
10. Hidden tabs must not continue media loading.

Possible later additions:

- pinch zoom;
- double-tap zoom;
- pan while zoomed;
- share/download actions;
- video handling.

Keep first implementation image-only if necessary.

## Internal-link policy

For this mode, internal navigation must remain inside Bokoun:

- Favorites links;
- club links;
- thread links;
- post anchors;
- Bokoun media viewer.

Do not use `target="_blank"` for internal routes.

External URLs should keep safe behavior. Depending on existing Bokoun policy, they may open through normal browser handling, but that is separate from internal route navigation.

## What not to copy

Do not import imageboard-specific noise that Okoun does not need:

- anonymous IDs;
- country flags;
- OP markers everywhere;
- file type and byte size on every post;
- image and reply counts without a real Bokoun use;
- catalog masonry as the default club view;
- green quote semantics copied from 4chan;
- excessive overflow menus;
- tiny text that harms ordinary reading.

Okoun is conversational and text-heavy. Borrow the mechanics, density and spatial continuity, not the full imageboard information model.

## Architecture constraints

This experiment must not undo the Koles traffic-discipline work.

Specifically:

- no time-based server polling added for tabs, gestures or transitions;
- no duplicate route prefetch merely to make sliding feel instant;
- no automatic cursor walking;
- no media prefetch beyond a small neighboring window;
- hidden documents do not paginate, refresh or preload;
- read-state synchronization remains visit-boundary based;
- native Kapybara fallback remains fail-open;
- compare mode remains compatible or is explicitly disabled while this experimental mode is active.

Reuse existing:

- route and anchor restoration;
- History API observation;
- thread mode;
- visit-scoped read state;
- display settings persistence;
- reduced-motion handling;
- Android/Kiwi smoke tooling.

## Suggested implementation phases

### Phase 0: design-only toggle

Add a display preset value without changing navigation yet:

```text
Výchozí Bokoun
Kompaktní čtečka (experimentální)
```

The preset may control:

- dark palette;
- dense Favorites rows;
- continuous post separators;
- compact metadata;
- square geometry;
- optional FAB styling.

Do not delete existing individual appearance settings. Define precedence clearly:

- preset supplies defaults;
- explicit user overrides remain possible where sensible;
- switching back restores normal Bokoun defaults or previous explicit values.

### Phase 1: horizontal club strip

Implement a pinned/recent-club strip:

- current club plus bounded recent/pinned entries;
- active underline;
- horizontal scrolling;
- route-safe switching;
- per-route scroll restoration;
- no extra background fetching.

Add tests for route normalization and active state.

### Phase 2: page-stack transitions

Add directional transitions for:

- Favorites → club;
- club → thread;
- Back transitions;
- optional adjacent-club switching.

Implementation should animate a lightweight route container. Avoid capturing screenshot bitmaps of the page.

Test:

- rapid repeated navigation;
- Back during animation;
- interrupted pointer gestures;
- reduced motion;
- route failure/native fallback;
- composer state preservation.

### Phase 3: gesture navigation

Add edge-swipe Back first. It is the most natural and lowest-risk gesture.

Only later consider:

- adjacent-club swipe;
- post action swipe.

Provide thresholds as constants and tests for vertical-scroll rejection.

### Phase 4: internal media viewer

Add image viewer with:

- origin anchor restoration;
- bounded media list;
- filmstrip;
- swipe navigation;
- no new tabs for internal viewing;
- explicit external-original action.

Measure memory use with image-heavy clubs.

### Phase 5: polish and device tests

Use Android/Kiwi tooling plus real-device testing for:

- 60 Hz and high-refresh displays;
- touch slop and accidental gesture rate;
- browser Back integration;
- keyboard accessibility on desktop forced mode;
- screen readers;
- reduced motion;
- dark contrast;
- long clubs and deep history;
- image viewer return positioning.

## Suggested data/settings additions

Potential display settings:

```js
interface ReaderStyleSettings {
  interfacePreset: "default" | "compact-reader";
  showClubStrip: boolean;
  navigationGestures: boolean;
  transitionStyle: "none" | "slide" | "wipe";
  internalImageViewer: boolean;
  fabPosition: "left" | "right";
}
```

Do not commit to this exact schema without checking current settings organization and migrations.

Potential bounded runtime state:

- recent club routes: 6–10;
- media items retained for viewer: current loaded board only, with a safe limit;
- transition history: current and previous route only;
- no duplicate post-model copies solely for animation.

## Acceptance criteria for the first useful prototype

The compact-reader experiment is successful when:

1. It can be enabled and disabled without damaging existing settings.
2. Favorites and clubs visibly adopt a dense, flat continuous-document style.
3. Internal navigation stays in one Bokoun stack.
4. Back restores the exact route and reading anchor.
5. At least Favorites → club → thread uses coherent directional transitions.
6. Reduced-motion mode has no unnecessary animation.
7. Idle and hidden request counts remain unchanged from disciplined Bokoun behavior.
8. Existing posting, drafts, thread mode and native fallback still work.
9. Android vertical scrolling is not frequently mistaken for a horizontal gesture.
10. The mode feels like Bokoun wearing a compact reader skin, not a transplanted 4chan client.

## Codex instruction

Treat this document as an exploration brief, not an order to implement every feature in one pass.

Start with the lowest-risk visual preset and club strip. Keep each phase separately testable and commit in small increments. Before adding gestures or the media viewer, verify that existing route, read-state and traffic tests still pass.
