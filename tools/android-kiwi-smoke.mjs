import { execFileSync } from "node:child_process";
import { chromium } from "playwright-core";

const cdpEndpoint = process.env.BOKOUN_KIWI_CDP || "http://127.0.0.1:9222";
const boardSlug = process.env.BOKOUN_QA_BOARD || "nepotrebny_pokus";
const baseUrl = "https://kapybara.okoun.cz";

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
const requests = {
  structuredGets: 0,
  documentGets: 0,
  postOperations: {},
};
page.on("console", (message) => {
  if (message.type() === "error") consoleCounts.error += 1;
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

await page.goto(`${baseUrl}/fav/activity?bokoun=on`, {
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
  url.pathname === `/boards/${boardSlug}` && !url.searchParams.has("rootId")
);
androidBack(serial);
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
    && Math.abs(scrollAfter - scrollBefore) <= 4
    && consoleCounts.error === 0
    && consoleCounts.pageerror === 0
    && Object.values(idleRequests).every((count) => count === 0)
  ),
  viewport,
  rootThreadAvailable,
  rootThreadUsesOwnId,
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
