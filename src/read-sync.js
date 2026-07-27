export function installReadSync(ctx) {
  const successful = new Set();
  const pending = new Map();

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

  async function syncNativeBoardRead(boardId, timestamp) {
    const normalizedBoardId = Number.parseInt(String(boardId || ""), 10);
    const nativeTimestamp = nativeReadTimestamp(timestamp);
    if (!Number.isSafeInteger(normalizedBoardId) || normalizedBoardId < 1) return false;
    if (!nativeTimestamp) return false;

    const token = currentAuthToken();
    const endpoint = nativeGraphqlEndpoint();
    if (!token || !endpoint) return false;

    const syncKey = `${normalizedBoardId}:${nativeTimestamp}`;
    if (successful.has(syncKey)) return true;
    if (pending.has(syncKey)) return pending.get(syncKey);

    const headers = {
      "Content-Type": "application/json",
      "X-Client-App": "www",
      Authorization: `Bearer ${token}`,
    };
    const accessCode = storageValue(localStorage, "okoun-api-access-code");
    if (accessCode) headers["X-API-Access-Code"] = accessCode;

    const request = (async () => {
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
        if (!response.ok) return false;
        const payload = await response.json().catch(() => null);
        const synced = Boolean(payload?.data?.markBoardAsRead?.id);
        if (synced) successful.add(syncKey);
        return synced;
      } catch {
        return false;
      } finally {
        pending.delete(syncKey);
      }
    })();
    pending.set(syncKey, request);
    return request;
  }

  Object.assign(ctx, { syncNativeBoardRead });
}
