import { execFileSync } from "node:child_process";
import { chromium } from "playwright-core";

const cdpEndpoint = process.env.BOKOUN_KIWI_CDP || "http://127.0.0.1:9222";
const boardSlug = process.env.BOKOUN_QA_BOARD || "nepotrebny_pokus";
const baseUrl = "https://kapybara.okoun.cz";
const boardPath = `/boards/${boardSlug}`;

function adbSerial() {
  if (process.env.ADB_SERIAL) return process.env.ADB_SERIAL;
  const devices = execFileSync("adb", ["devices", "-l"], { encoding: "utf8" });
  const line = devices.split(/\r?\n/)
    .find((entry) => /\bdevice\b/.test(entry) && /\bmodel:Pixel_10a\b/.test(entry));
  const serial = line?.trim().split(/\s+/)[0];
  if (!serial) {
    throw new Error("No paired Pixel 10a found; enable Wireless debugging");
  }
  return serial;
}

function androidBack(serial) {
  execFileSync("adb", [
    "-s",
    serial,
    "shell",
    "input",
    "keyevent",
    "KEYCODE_BACK",
  ]);
}

function assertQa(condition, message) {
  if (!condition) throw new Error(message);
}

function operationName(request, fallback) {
  try {
    const body = request.postDataJSON();
    const item = Array.isArray(body) ? body[0] : body;
    return item?.operationName
      || item?.query?.match(/(?:query|mutation)\s+(\w+)/)?.[1]
      || fallback;
  } catch {
    return fallback;
  }
}

const serial = adbSerial();
const browser = await chromium.connectOverCDP(cdpEndpoint);
const pages = browser.contexts().flatMap((context) => context.pages())
  .filter((candidate) => candidate.url().startsWith(`${baseUrl}/`));
let page = null;
for (const candidate of pages) {
  if (await candidate.evaluate(() => document.visibilityState) === "visible") {
    page = candidate;
    break;
  }
}
if (!page) {
  throw new Error("No foreground Kapybara tab in Kiwi");
}

const consoleCounts = { error: 0, warning: 0, pageerror: 0 };
let expectedFailureWindow = false;
const requests = {
  structuredGets: 0,
  documentGets: 0,
  postOperations: {},
};
page.on("console", (message) => {
  if (message.type() === "error") {
    if (expectedFailureWindow) consoleCounts.expectedNetworkError = (
      consoleCounts.expectedNetworkError || 0
    ) + 1;
    else consoleCounts.error += 1;
  }
  if (message.type() === "warning") consoleCounts.warning += 1;
});
page.on("pageerror", () => {
  consoleCounts.pageerror += 1;
});
page.on("request", (request) => {
  const url = new URL(request.url());
  if (request.method() === "GET" && url.pathname.endsWith("/__data.json")) {
    requests.structuredGets += 1;
    return;
  }
  if (request.method() === "GET" && request.resourceType() === "document") {
    requests.documentGets += 1;
    return;
  }
  if (request.method() !== "POST") return;
  const operation = operationName(request, url.pathname);
  requests.postOperations[operation] = (requests.postOperations[operation] || 0) + 1;
});

await page.goto(`${baseUrl}/fav/activity`, {
  waitUntil: "domcontentloaded",
});
await page.locator("#bokoun-host .favorites").waitFor({ timeout: 15_000 });

const viewport = await page.evaluate(() => ({
  innerWidth,
  outerWidth,
  visualWidth: Math.round(visualViewport?.width || 0),
  mobileUserAgent: /Mobile/.test(navigator.userAgent),
}));
const scroller = page.locator("#bokoun-host .app");
await scroller.evaluate((node) => {
  node.scrollTop = Math.min(900, node.scrollHeight - node.clientHeight);
  node.dispatchEvent(new Event("scroll"));
});

const testFavorite = page.locator(
  `#bokoun-host a.favorite-row[href^="/boards/${boardSlug}"]`,
).first();
await testFavorite.waitFor({ state: "visible", timeout: 15_000 });
await testFavorite.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
const scrollBefore = await scroller.evaluate((node) => node.scrollTop);
await testFavorite.click();
await page.waitForURL((url) => url.pathname === `/boards/${boardSlug}`);
await page.locator("#bokoun-host article.post").first()
  .waitFor({ state: "visible", timeout: 15_000 });

const posts = page.locator("#bokoun-host article.post");
let rootPost = null;
for (let index = 0; index < await posts.count(); index += 1) {
  const candidate = posts.nth(index);
  if (await candidate.locator(".reply-reference").count() === 0) {
    rootPost = candidate;
    break;
  }
}
if (!rootPost) throw new Error("No root post is available for the thread smoke");

await rootPost.locator(".post-author").click();
const postId = await rootPost.getAttribute("data-bokoun-post-id");
const threadAction = rootPost.locator("[data-action='thread']");
const rootThreadAvailable = await threadAction.count() === 1;
const rootThreadUsesOwnId = rootThreadAvailable
  && await threadAction.getAttribute("data-root-id") === postId;
if (!rootThreadUsesOwnId) {
  throw new Error("Root-post thread action is missing or targets the wrong post");
}

await threadAction.click();
await page.waitForURL((url) => url.searchParams.has("rootId"));
await page.locator("#bokoun-host .thread-banner")
  .waitFor({ state: "visible", timeout: 15_000 });
androidBack(serial);
await page.waitForURL((url) =>
  url.pathname === boardPath && !url.searchParams.has("rootId")
);

const boardPosts = page.locator("#bokoun-host article.post");
const boardScroller = page.locator("#bokoun-host .app");
const postIds = () => boardPosts.evaluateAll((items) =>
  items.map((item) => item.getAttribute("data-bokoun-post-id")).filter(Boolean)
);
const triggerOlderLoad = async () => {
  const beforeIds = await postIds();
  const loadButton = page.locator("#bokoun-host [data-action='load-older']");
  await loadButton.waitFor({ state: "attached", timeout: 10_000 });
  await boardScroller.evaluate((node) => {
    node.scrollTop = node.scrollHeight;
    node.dispatchEvent(new Event("scroll"));
  });
  await page.waitForFunction((beforeCount) => {
    const host = document.querySelector("#bokoun-host");
    if (!host?.shadowRoot) return false;
    const root = host.shadowRoot;
    if (root.querySelector(".tail-loading")) return false;
    const count = root.querySelectorAll("article.post").length;
    return count > beforeCount
      || Boolean(root.querySelector(".tail-error, .tail-end"));
  }, beforeIds.length, { timeout: 20_000 });
  const afterIds = await postIds();
  assertQa(
    afterIds.length > beforeIds.length,
    "Older-post batch did not add any posts",
  );
  assertQa(
    new Set(afterIds).size === afterIds.length,
    "Older-post batch introduced duplicate post IDs",
  );
  await page.waitForTimeout(800);
  return {
    beforeCount: beforeIds.length,
    afterCount: afterIds.length,
    addedIds: afterIds.filter((id) => !beforeIds.includes(id)),
  };
};

const paginationAvailable = await page.locator(
  "#bokoun-host [data-action='load-older']",
).count() === 1;
const endStateVerified = !paginationAvailable
  && await page.locator("#bokoun-host .tail-end").count() === 1;
const initialIds = await postIds();
let firstBatch = null;
let secondBatch = null;
let allLoadedIds = initialIds;
let countBeforeFailure = initialIds.length;
let countAfterRetry = initialIds.length;
let retryIds = initialIds;
let failedPaginationRequests = 0;
let retryRecovered = false;

if (paginationAvailable) {
  firstBatch = await triggerOlderLoad();
  secondBatch = await triggerOlderLoad();
  allLoadedIds = await postIds();
}

const anchorId = secondBatch?.addedIds.at(0)
  || firstBatch?.addedIds.at(-1)
  || initialIds.at(Math.floor(initialIds.length / 2));
assertQa(anchorId, "No older post is available for the native handoff");
const bokounAnchor = page.locator(
  `#bokoun-host article.post[data-bokoun-post-id="${anchorId}"]`,
);
await bokounAnchor.evaluate((node) => {
  const scroller = node.closest(".app");
  const topbar = scroller?.querySelector(".topbar--board");
  if (!scroller) return;
  scroller.scrollTop += node.getBoundingClientRect().top
    - scroller.getBoundingClientRect().top
    - (topbar?.getBoundingClientRect().height || 0)
    - 12;
  scroller.dispatchEvent(new Event("scroll"));
});
await page.waitForTimeout(300);
const anchorOffsetBefore = await bokounAnchor.evaluate((node) =>
  Math.round(node.getBoundingClientRect().top)
);

await page.locator("#bokoun-host [data-action='full']").click();
await page.locator("#bokoun-return").waitFor({ state: "attached", timeout: 15_000 });
await page.locator("#bokoun-host").waitFor({ state: "detached", timeout: 15_000 });
const nativeAnchor = page.locator(`article.post[data-post-id="${anchorId}"]`);
await nativeAnchor.waitFor({ state: "attached", timeout: 15_000 });
const nativeAnchorPresent = await nativeAnchor.count() === 1;
await page.locator("#bokoun-return button").click();
await page.locator("#bokoun-host article.post").first()
  .waitFor({ state: "visible", timeout: 15_000 });
const returnedAnchor = page.locator(
  `#bokoun-host article.post[data-bokoun-post-id="${anchorId}"]`,
);
await returnedAnchor.waitFor({ state: "attached", timeout: 15_000 });
await page.waitForTimeout(500);
const anchorOffsetAfter = await returnedAnchor.evaluate((node) =>
  Math.round(node.getBoundingClientRect().top)
);
const handoffOffsetDelta = Math.abs(anchorOffsetAfter - anchorOffsetBefore);
const handoffAnchorRestored = handoffOffsetDelta <= 8;

if (paginationAvailable) {
  const failPagination = async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const paginationPath = url.pathname === boardPath
      || url.pathname === `${boardPath}/__data.json`;
    if (
      request.method() === "GET"
      && url.origin === baseUrl
      && paginationPath
      && url.searchParams.has("f")
    ) {
      failedPaginationRequests += 1;
      await route.fulfill({
        status: 503,
        contentType: "text/plain",
        body: "Bokoun QA pagination failure",
      });
      return;
    }
    await route.continue();
  };
  await page.route("**/*", failPagination);
  expectedFailureWindow = true;
  countBeforeFailure = await boardPosts.count();
  await boardScroller.evaluate((node) => {
    node.scrollTop = node.scrollHeight;
    node.dispatchEvent(new Event("scroll"));
  });
  await page.locator("#bokoun-host .tail-error")
    .waitFor({ state: "visible", timeout: 20_000 });
  await page.waitForTimeout(300);
  expectedFailureWindow = false;
  await page.unroute("**/*", failPagination);
  assertQa(
    failedPaginationRequests >= 2,
    "Pagination failure did not exercise structured and HTML fallback requests",
  );
  assertQa(
    await boardPosts.count() === countBeforeFailure,
    "Failed pagination changed the post list",
  );

  const retryButton = page.locator("#bokoun-host [data-action='load-older']");
  await retryButton.click();
  await page.waitForFunction((beforeCount) => {
    const host = document.querySelector("#bokoun-host");
    if (!host?.shadowRoot) return false;
    const root = host.shadowRoot;
    if (root.querySelector(".tail-loading")) return false;
    return root.querySelectorAll("article.post").length > beforeCount
      || Boolean(root.querySelector(".tail-end"));
  }, countBeforeFailure, { timeout: 20_000 });
  countAfterRetry = await boardPosts.count();
  retryIds = await postIds();
  retryRecovered = countAfterRetry > countBeforeFailure
    && new Set(retryIds).size === retryIds.length
    && !await page.locator("#bokoun-host .tail-error").count();
}

await page.locator("#bokoun-host [data-action='back']").click();
await page.waitForURL((url) => url.pathname === "/fav/activity");
await page.locator("#bokoun-host .favorites").waitFor({ timeout: 15_000 });
await page.waitForTimeout(800);
const scrollAfter = await page.locator("#bokoun-host .app")
  .evaluate((node) => node.scrollTop);

const settledRequests = {
  structuredGets: requests.structuredGets,
  documentGets: requests.documentGets,
  posts: Object.values(requests.postOperations).reduce((sum, count) => sum + count, 0),
};
await page.waitForTimeout(10_500);
const idleRequests = {
  structuredGets: requests.structuredGets - settledRequests.structuredGets,
  documentGets: requests.documentGets - settledRequests.documentGets,
  posts: Object.values(requests.postOperations).reduce((sum, count) => sum + count, 0)
    - settledRequests.posts,
};

const result = {
  passed: (
    viewport.mobileUserAgent
    && viewport.innerWidth <= 760
    && rootThreadUsesOwnId
    && (
      paginationAvailable
        ? firstBatch.afterCount > firstBatch.beforeCount
          && secondBatch.afterCount > secondBatch.beforeCount
          && retryRecovered
        : endStateVerified
    )
    && new Set(allLoadedIds).size === allLoadedIds.length
    && nativeAnchorPresent
    && handoffAnchorRestored
    && Math.abs(scrollAfter - scrollBefore) <= 4
    && consoleCounts.error === 0
    && consoleCounts.pageerror === 0
    && Object.keys(requests.postOperations).every((name) => name === "Me")
    && Object.values(idleRequests).every((count) => count === 0)
  ),
  viewport,
  rootThreadAvailable,
  rootThreadUsesOwnId,
  pagination: {
    available: paginationAvailable,
    endStateVerified,
    initialPosts: initialIds.length,
    successfulBatches: paginationAvailable ? 3 : 0,
    postCounts: paginationAvailable
      ? [firstBatch.afterCount, secondBatch.afterCount, countAfterRetry]
      : [initialIds.length],
    uniquePostIds: new Set(
      paginationAvailable ? retryIds : initialIds,
    ).size === (paginationAvailable ? retryIds : initialIds).length,
    failedRequests: failedPaginationRequests,
    retryRecovered,
  },
  nativeHandoff: {
    nativeAnchorPresent,
    anchorOffsetBefore,
    anchorOffsetAfter,
    offsetDelta: handoffOffsetDelta,
    anchorRestored: handoffAnchorRestored,
  },
  scrollBefore: Math.round(scrollBefore),
  scrollAfter: Math.round(scrollAfter),
  scrollRestored: Math.abs(scrollAfter - scrollBefore) <= 4,
  consoleCounts,
  requests,
  idleRequests,
  finalPath: new URL(page.url()).pathname,
};
console.log(JSON.stringify(result, null, 2));
await browser.close();
if (!result.passed) process.exitCode = 1;
