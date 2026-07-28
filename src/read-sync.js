export function installReadSync(ctx) {
  const {
    READ_SYNC_MIN_INTERVAL_MS = 5_000,
    READ_SYNC_BACKOFF_BASE_MS = 15_000,
    READ_SYNC_BACKOFF_MAX_MS = 15 * 60_000,
    READ_SYNC_STATE_KEY = "bokoun.read-sync-state.v1",
  } = ctx;
  const now = () => typeof ctx.now === "function" ? ctx.now() : Date.now();
  const recordTraffic = (...args) => ctx.recordTraffic?.(...args);
  const successful = new Map();
  const submitted = new Map();
  const pending = new Map();
  const lastAttempt = new Map();
  const failures = new Map();

  function restoreSyncState() {
    if (typeof sessionStorage === "undefined") return;
    let stored;
    try {
      stored = JSON.parse(sessionStorage?.getItem(READ_SYNC_STATE_KEY) || "{}");
    } catch {
      stored = {};
    }
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return;
    for (const [rawBoardId, value] of Object.entries(stored)) {
      const boardId = Number.parseInt(rawBoardId, 10);
      if (!Number.isSafeInteger(boardId) || !value || typeof value !== "object") continue;
      const success = Number(value.success) || 0;
      const submittedBoundary = Number(value.submitted) || 0;
      const attemptedAt = Number(value.attemptedAt) || 0;
      const attempts = Math.max(0, Number(value.attempts) || 0);
      const retryAt = Number(value.retryAt) || 0;
      if (success > 0) successful.set(boardId, success);
      if (submittedBoundary > 0) submitted.set(boardId, submittedBoundary);
      if (attemptedAt > 0) lastAttempt.set(boardId, attemptedAt);
      if (attempts > 0 && retryAt > 0) failures.set(boardId, { attempts, retryAt });
    }
  }

  function persistSyncState() {
    if (typeof sessionStorage === "undefined") return;
    const boardIds = new Set([
      ...successful.keys(),
      ...submitted.keys(),
      ...lastAttempt.keys(),
      ...failures.keys(),
    ]);
    const entries = [...boardIds]
      .map((boardId) => {
        const failure = failures.get(boardId);
        return [boardId, {
          success: successful.get(boardId) || 0,
          submitted: submitted.get(boardId) || 0,
          attemptedAt: lastAttempt.get(boardId) || 0,
          attempts: failure?.attempts || 0,
          retryAt: failure?.retryAt || 0,
        }];
      })
      .sort((left, right) => (
        Math.max(right[1].success, right[1].submitted, right[1].attemptedAt, right[1].retryAt)
        - Math.max(left[1].success, left[1].submitted, left[1].attemptedAt, left[1].retryAt)
      ))
      .slice(0, 100);
    try {
      sessionStorage?.setItem(READ_SYNC_STATE_KEY, JSON.stringify(Object.fromEntries(entries)));
    } catch {
      // Session persistence is only a deduplication enhancement.
    }
  }

  restoreSyncState();

  function storageValue(store, key) {
    try {
      return store?.getItem(key) || "";
    } catch {
      return "";
    }
  }

  function cookieValue(name) {
    try {
      const prefix = `${name}=`;
      const entry = document.cookie
        .split(";")
        .map((value) => value.trim())
        .find((value) => value.startsWith(prefix));
      return entry ? decodeURIComponent(entry.slice(prefix.length)) : "";
    } catch {
      return "";
    }
  }

  function currentAuthToken() {
    const fromCookie = cookieValue("auth_token");
    if (fromCookie) return fromCookie;
    const fromSession = storageValue(sessionStorage, "auth_token");
    if (fromSession) return fromSession;
    return storageValue(localStorage, "auth_remembered") === "true"
      ? storageValue(localStorage, "auth_token")
      : "";
  }

  function nativeGraphqlEndpoint() {
    const declared = document.querySelector('meta[name="okoun-graphql-endpoint"]')?.content;
    try {
      const url = new URL(declared || "/graphql", location.origin);
      return ["https:", "http:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }

  function nativeReadTimestamp(timestamp) {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "";
    const parts = Object.create(null);
    for (const part of new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Prague",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date)) {
      if (part.type !== "literal") parts[part.type] = part.value;
    }
    if (!parts.year || !parts.month || !parts.day || !parts.hour || !parts.minute || !parts.second) {
      return "";
    }
    return `${parts.year}${parts.month}${parts.day}-${parts.hour}${parts.minute}${parts.second}`;
  }

  function noteFailure(boardId) {
    const attempts = (failures.get(boardId)?.attempts || 0) + 1;
    const delay = Math.min(
      READ_SYNC_BACKOFF_MAX_MS,
      READ_SYNC_BACKOFF_BASE_MS * (2 ** (attempts - 1)),
    );
    failures.set(boardId, { attempts, retryAt: now() + delay });
    persistSyncState();
  }

  async function syncNativeBoardRead(boardId, timestamp) {
    const normalizedBoardId = Number.parseInt(String(boardId || ""), 10);
    const boundary = new Date(timestamp).getTime();
    const nativeTimestamp = nativeReadTimestamp(timestamp);
    if (!Number.isSafeInteger(normalizedBoardId) || normalizedBoardId < 1) return false;
    if (!nativeTimestamp || !Number.isFinite(boundary)) return false;

    if ((successful.get(normalizedBoardId) || 0) >= boundary) return true;
    const currentPending = pending.get(normalizedBoardId);
    if (currentPending) {
      if (currentPending.boundary >= boundary) return currentPending.promise;
      return currentPending.promise.then(() => syncNativeBoardRead(normalizedBoardId, timestamp));
    }
    if ((submitted.get(normalizedBoardId) || 0) >= boundary) return true;

    const failure = failures.get(normalizedBoardId);
    if (failure && now() < failure.retryAt) return false;
    const previousAttempt = lastAttempt.get(normalizedBoardId);
    if (
      previousAttempt !== undefined
      && now() - previousAttempt < READ_SYNC_MIN_INTERVAL_MS
    ) {
      return false;
    }

    const token = currentAuthToken();
    const endpoint = nativeGraphqlEndpoint();
    if (!token || !endpoint) return false;

    const headers = {
      "Content-Type": "application/json",
      "X-Client-App": "bokoun",
      Authorization: `Bearer ${token}`,
    };
    const accessCode = storageValue(localStorage, "okoun-api-access-code");
    if (accessCode) headers["X-API-Access-Code"] = accessCode;

    lastAttempt.set(normalizedBoardId, now());
    submitted.set(
      normalizedBoardId,
      Math.max(submitted.get(normalizedBoardId) || 0, boundary),
    );
    persistSyncState();
    recordTraffic("readMutations", "visit-boundary");
    const entry = {
      boundary,
      promise: null,
    };
    entry.promise = (async () => {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          credentials: "include",
          keepalive: true,
          headers,
          body: JSON.stringify({
            query: `mutation MarkBoardAsRead($boardId: Int!, $timestamp: String!) {
              markBoardAsRead(boardId: $boardId, timestamp: $timestamp) { id }
            }`,
            variables: {
              boardId: normalizedBoardId,
              timestamp: nativeTimestamp,
            },
          }),
        });
        if (!response.ok) {
          if (submitted.get(normalizedBoardId) === boundary) {
            submitted.delete(normalizedBoardId);
          }
          noteFailure(normalizedBoardId);
          return false;
        }
        const payload = await response.json().catch(() => null);
        const synced = Boolean(payload?.data?.markBoardAsRead?.id);
        if (synced) {
          successful.set(
            normalizedBoardId,
            Math.max(successful.get(normalizedBoardId) || 0, boundary),
          );
          submitted.delete(normalizedBoardId);
          failures.delete(normalizedBoardId);
          persistSyncState();
        } else {
          if (submitted.get(normalizedBoardId) === boundary) {
            submitted.delete(normalizedBoardId);
          }
          noteFailure(normalizedBoardId);
        }
        return synced;
      } catch {
        if (submitted.get(normalizedBoardId) === boundary) {
          submitted.delete(normalizedBoardId);
        }
        noteFailure(normalizedBoardId);
        return false;
      } finally {
        if (pending.get(normalizedBoardId) === entry) pending.delete(normalizedBoardId);
      }
    })();
    pending.set(normalizedBoardId, entry);
    return entry.promise;
  }

  Object.assign(ctx, { syncNativeBoardRead });
}
