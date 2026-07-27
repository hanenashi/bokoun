# Koles review: TL;DR and next steps

This note summarizes the AI review Koles ran over Bokoun and turns it into a concrete implementation plan for Codex.

## TL;DR

The review was positive about Bokoun's UX ideas, especially:

- visit-scoped "new since last visit" state;
- single-flight cursor pagination with deduplication and explicit retry/end states;
- focused thread mode that preserves the surrounding board and scroll position;
- anchor-based reading-position restoration;
- draft-safe posting with no automatic retry after an ambiguous submission;
- compact Favorites sorting and unread visualization;
- fail-open behavior that restores native Kapybara when Bokoun cannot initialize.

The main concern is not the UI. It is unnecessary background traffic and repeated read-state writes if Bokoun is used by many people.

Before public release, Bokoun should stop behaving like an always-polling client and become event-driven: load on entry, refresh on explicit user actions or foreground return, and perform read synchronization only at deliberate visit boundaries.

## Confirmed high-priority risks

### 1. Idle structured-data refresh

Current behavior can refresh personalized `__data.json` after the structured cache expires, even when the user is not actively doing anything. The route poll and broad native-app observer can keep triggering the path that calls `primeStructuredModel()`.

Because the request uses `cache: "no-store"`, an idle tab may generate repeated origin/backend work. This is the most important release blocker.

Desired behavior:

- no network requests from a hidden or idle tab;
- fetch on initial route entry;
- refresh when the document becomes visible after a meaningful absence;
- refresh after posting or an explicit user request;
- optional long visible-only staleness refresh, measured in minutes rather than seconds;
- keep single-flight and failure cooldown behavior.

### 2. `markBoardAsRead` write amplification

Current board rendering can call `syncNativeBoardRead()` repeatedly. Deduplication is only for the exact `(boardId, timestamp)` pair, so a changing timestamp allows additional mutations. Failed writes have no real backoff after the pending request finishes.

Desired behavior:

- remove read synchronization from the generic render loop;
- sync once when leaving a board or returning to Favorites;
- also flush on `pagehide` / visibility loss when appropriate;
- only send if the read boundary advanced;
- add per-board minimum interval and exponential failure backoff;
- keep single-flight deduplication;
- discuss a distinct `X-Client-App` value with Koles instead of claiming `www`.

### 3. Duplicate board preflight

`prepareBoardVisitFromFavorite` may fetch a board before native navigation then causes Kapybara to load the same board again.

Desired behavior:

- avoid the preflight unless it is necessary for a proven UX requirement;
- prefer navigating first and consuming the native/structured route result;
- add a test that one Favorites-to-board transition does not produce two equivalent board fetches.

## Pagination assessment

The infinite-history design itself is good and should remain:

- one batch in flight;
- cursor-based requests;
- deduplication by post ID;
- explicit loading, end and retry states;
- cooldown between batches;
- deliberate "Nejnovější" reset.

Hardening for public use:

- do not load while the document is hidden;
- require additional user scroll before each further automatic batch;
- never recursively walk cursors without user movement;
- do not automatically double network cost by fetching full HTML after every structured decode failure;
- consider a soft per-session retained-page limit and discard very old in-memory pages while preserving an anchor.

Calling this "history scraping" is overstated as long as each page is fetched because the user actually scrolls to it.

## Client-side follow-up work

These are real but lower priority than server traffic:

1. Replace the permanent 150 ms route poll with history/popstate/navigation hooks and a slow fallback only if needed.
2. Narrow or remove the whole-body `MutationObserver`.
3. Stop replacing the entire `.app-inner` for every small update; preserve DOM where practical.
4. Add bounded eviction for `structuredCache`, board pages, post indexes and route scroll maps.
5. Debounce draft persistence instead of writing storage on every keystroke.
6. Save only the changed scroll entry rather than serializing the entire map every ~100 ms.
7. Suspend timers, observers and pagination while the page is hidden.

## Implementation plan for Codex

### Phase 1: traffic discipline — required before public release

1. Instrument network-trigger points in development mode.
   - Count structured-data GETs, HTML fallbacks and read-state mutations.
   - Expose counters through a small debug object or console summary.
   - Do not add production telemetry or send data anywhere.

2. Refactor structured refresh policy.
   - Remove time-based refresh from generic `render()` and unchanged-route polling.
   - Introduce an explicit `ensureStructuredModel({ reason, force })` API.
   - Allowed reasons: initial route, route transition, visibility resume, successful post, manual refresh and pagination.
   - Ignore visibility-resume refresh unless the cached model is meaningfully stale.
   - Abort or reuse stale in-flight requests when routes change.

3. Refactor native read synchronization.
   - Track the last successfully synced boundary per board.
   - Sync only when the boundary advances and a visit is being finalized.
   - Add backoff after failures.
   - Do not retry from DOM mutations or ordinary rerenders.
   - Preserve ambiguous/failure-safe behavior.

4. Remove the Favorites-to-board duplicate preflight.
   - Verify scroll restoration and visit-state initialization still work.
   - If some pre-entry metadata is needed, derive it from the Favorites model rather than fetching the board.

5. Add regression tests.
   - An idle visible route does not refetch within a short test interval.
   - A hidden route performs no refresh or pagination.
   - Multiple renders produce no extra read mutation.
   - Leaving one board produces at most one mutation for the final advanced boundary.
   - Failed read sync observes backoff.
   - One board navigation causes one initial board data fetch.

### Phase 2: client efficiency

1. Replace fast route polling with patched `history.pushState` / `replaceState`, `popstate`, and a conservative fallback timer.
2. Narrow native observation to the smallest useful root or disconnect it after structured mode is established.
3. Debounce draft writes and scroll persistence.
4. Add LRU or simple bounded eviction for route and post caches.
5. Measure rendering with 100, 500 and 1,000 accumulated posts.

### Phase 3: release checks

1. Run `npm test`, `npm run check`, and a userscript rebuild consistency check.
2. Test on Android Chrome with:
   - foreground/background transitions;
   - long-open tabs;
   - Favorites → board → thread → Back;
   - deep history scrolling;
   - offline/failing requests;
   - posting with ambiguous response.
3. Record a simple request budget:
   - idle background tab: 0 requests/hour;
   - idle visible tab: ideally 0, except an intentionally documented long-stale refresh;
   - one board visit: one initial read request plus user-driven pagination;
   - read mutation: at most one final successful write per advanced visit boundary.
4. Send Koles the resulting behavior and request counts before broad announcement.

## Non-goals

Do not solve this by:

- adding a Bokoun backend or proxy;
- mirroring posts;
- introducing analytics;
- polling a different endpoint;
- disabling native fallback;
- removing visit-scoped new-post behavior;
- removing safe infinite scrolling.

The goal is to keep Bokoun's good UX while making its network behavior quiet, deliberate and easy for Koles to identify and reason about.

## Release gate

Bokoun is ready for public release when all three conditions hold:

- an untouched tab does not continually hit personalized endpoints;
- ordinary rerenders cannot multiply `markBoardAsRead` writes;
- opening a board does not fetch the same initial content twice.
