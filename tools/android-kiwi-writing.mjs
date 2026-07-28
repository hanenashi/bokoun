import { execFileSync } from "node:child_process";
import { chromium } from "playwright-core";

const baseUrl = "https://kapybara.okoun.cz";
const boardSlug = "nepotrebny_pokus";
const boardPath = `/boards/${boardSlug}`;
const cdpEndpoint = process.env.BOKOUN_KIWI_CDP || "http://127.0.0.1:9222";
const draftOnly = process.env.BOKOUN_QA_DRAFT_ONLY === "1";

if (!draftOnly && process.env.BOKOUN_QA_ALLOW_WRITE !== "1") {
  throw new Error(
    "Writing QA is disabled; set BOKOUN_QA_ALLOW_WRITE=1 for one labelled test post",
  );
}

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

function assertQa(condition, message) {
  if (!condition) throw new Error(message);
}

const serial = adbSerial();
execFileSync("adb", [
  "-s",
  serial,
  "shell",
  "monkey",
  "-p",
  "com.kiwibrowser.browser",
  "-c",
  "android.intent.category.LAUNCHER",
  "1",
], { stdio: "ignore" });

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
if (!page) throw new Error("No foreground Kapybara tab in Kiwi");

const consoleCounts = { error: 0, warning: 0, pageerror: 0 };
const postOperations = {};
page.on("console", (message) => {
  if (message.type() === "error") consoleCounts.error += 1;
  if (message.type() === "warning") consoleCounts.warning += 1;
});
page.on("pageerror", () => {
  consoleCounts.pageerror += 1;
});
page.on("request", (request) => {
  if (request.method() !== "POST") return;
  const url = new URL(request.url());
  const operation = operationName(request, url.pathname);
  postOperations[operation] = (postOperations[operation] || 0) + 1;
});

const runId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const draftText = `Bokoun QA koncept ${runId}`;
const postText = [
  `Bokoun QA zápis ${runId}`,
  "",
  "Automatický test konceptu a jednoho odeslání z mobilního Bokouna.",
].join("\n");

await page.goto(`${baseUrl}${boardPath}?bokoun=on`, {
  waitUntil: "domcontentloaded",
});
await page.locator("#bokoun-host article.post").first()
  .waitFor({ state: "visible", timeout: 15_000 });

const viewport = await page.evaluate(() => ({
  innerWidth,
  outerWidth,
  mobileUserAgent: /Mobile/.test(navigator.userAgent),
}));
assertQa(viewport.mobileUserAgent && viewport.innerWidth <= 760, "Kiwi is not in mobile mode");

const openNewComposer = async () => {
  await page.locator("#bokoun-host [data-action='compose']").click();
  const textarea = page.locator("#bokoun-host .composer-textarea");
  await textarea.waitFor({ state: "visible", timeout: 10_000 });
  return textarea;
};

let textarea = await openNewComposer();
await textarea.fill(draftText);
await page.locator("#bokoun-host [data-draft-status]")
  .getByText("Koncept uložen v zařízení", { exact: true })
  .waitFor({ state: "visible", timeout: 5_000 });

await page.reload({ waitUntil: "domcontentloaded" });
textarea = page.locator("#bokoun-host .composer-textarea");
await textarea.waitFor({ state: "visible", timeout: 15_000 });
const restoredAfterReload = await textarea.inputValue() === draftText;

await page.locator("#bokoun-host [data-action='cancel-compose']").click();
await textarea.waitFor({ state: "detached", timeout: 5_000 });
textarea = await openNewComposer();
const restoredAfterCancel = await textarea.inputValue() === draftText;

await page.locator("#bokoun-host [data-action='discard-draft']").click();
await textarea.waitFor({ state: "detached", timeout: 5_000 });
textarea = await openNewComposer();
const clearedAfterDiscard = await textarea.inputValue() === "";
await page.locator("#bokoun-host [data-action='cancel-compose']").click();

if (draftOnly) {
  const result = {
    passed: (
      restoredAfterReload
      && restoredAfterCancel
      && clearedAfterDiscard
      && consoleCounts.error === 0
      && consoleCounts.pageerror === 0
    ),
    board: boardSlug,
    viewport,
    draftOnly: true,
    draft: {
      restoredAfterReload,
      restoredAfterCancel,
      clearedAfterDiscard,
    },
    consoleCounts,
    postOperations,
  };
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
  if (!result.passed) process.exitCode = 1;
  process.exit();
}

const beforeIds = new Set(
  await page.locator("#bokoun-host article.post").evaluateAll((items) =>
    items.map((item) => item.getAttribute("data-bokoun-post-id")).filter(Boolean)
  ),
);
textarea = await openNewComposer();
await textarea.fill(postText);
await page.locator("#bokoun-host [data-draft-status]")
  .getByText("Koncept uložen v zařízení", { exact: true })
  .waitFor({ state: "visible", timeout: 5_000 });
await page.locator("#bokoun-host .composer-form button[type='submit']").click();
await page.locator("#bokoun-host .write-feedback")
  .getByText("Příspěvek odeslán.", { exact: true })
  .waitFor({ state: "visible", timeout: 30_000 });

const sentPosts = page.locator("#bokoun-host article.post.post--just-sent");
await sentPosts.waitFor({ state: "visible", timeout: 15_000 });
const sentCount = await sentPosts.count();
const sentId = await sentPosts.first().getAttribute("data-bokoun-post-id");
const oneNewPost = sentCount === 1 && sentId && !beforeIds.has(sentId);

textarea = await openNewComposer();
const draftClearedAfterSend = await textarea.inputValue() === "";
await page.locator("#bokoun-host [data-action='cancel-compose']").click();

await page.reload({ waitUntil: "domcontentloaded" });
await page.locator("#bokoun-host article.post").first()
  .waitFor({ state: "visible", timeout: 15_000 });
const postConfirmedAfterReload = await page.locator(
  "#bokoun-host article.post",
  { hasText: `Bokoun QA zápis ${runId}` },
).count() === 1;

const result = {
  passed: (
    restoredAfterReload
    && restoredAfterCancel
    && clearedAfterDiscard
    && oneNewPost
    && draftClearedAfterSend
    && postConfirmedAfterReload
    && consoleCounts.error === 0
    && consoleCounts.pageerror === 0
  ),
  board: boardSlug,
  viewport,
  draft: {
    restoredAfterReload,
    restoredAfterCancel,
    clearedAfterDiscard,
    clearedAfterSend: draftClearedAfterSend,
  },
  posting: {
    oneNewPost,
    confirmedAfterReload: postConfirmedAfterReload,
  },
  consoleCounts,
  postOperations,
};
console.log(JSON.stringify(result, null, 2));
await browser.close();
if (!result.passed) process.exitCode = 1;
