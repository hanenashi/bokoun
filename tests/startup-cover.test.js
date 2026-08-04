import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dirname, "..");
const userscript = fs.readFileSync(path.join(root, "bokoun.user.js"), "utf8");
const favoritesData = fs.readFileSync(
  path.join(dirname, "fixtures", "favorites.svelte-data.ndjson"),
  "utf8",
);

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server.address()));
  });
}

function close(server) {
  return new Promise((resolve) => server.close(resolve));
}

test("slow first render stays behind the Bokoun-owned cover in light and dark modes", {
  timeout: 30_000,
}, async (t) => {
  let structuredRequests = 0;
  const server = http.createServer((request, response) => {
    if (request.url?.startsWith("/fav/activity/__data.json")) {
      structuredRequests += 1;
      setTimeout(() => {
        response.writeHead(200, { "content-type": "text/sveltekit-data" });
        response.end(favoritesData);
      }, 650);
      return;
    }
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    response.end(`<!doctype html>
      <html><head><title>Native loading fixture</title></head><body>
        <div id="native-spinner" style="position:fixed;inset:0;display:grid;place-items:center;background:#eef1f5">
          <span style="width:48px;height:48px;border:6px solid #789;border-radius:50%"></span>
        </div>
        <a id="native-board-link" href="/boards/fixture-club">Fixture Club</a>
        <script>
          document.addEventListener("click", (event) => {
            const link = event.target.closest("#native-board-link");
            if (!link) return;
            event.preventDefault();
            history.pushState({}, "", link.href);
            setTimeout(() => {
              document.body.insertAdjacentHTML("beforeend", \`
                <header class="board-header">
                  <a class="title-link" href="/boards/fixture-club"><h1>Fixture Club</h1></a>
                </header>
                <div class="posts">
                  <article class="post" data-post-id="101">
                    <header class="post-header"><span class="author">tester</span>
                      <time datetime="2026-08-01T00:00:00.000Z">1.8.2026</time>
                    </header>
                    <div class="body"><p>Target route ready</p></div>
                  </article>
                </div>
              \`);
            }, 650);
          });
        </script>
      </body></html>`);
  });
  const address = await listen(server);
  let browser;
  try {
    try {
      browser = await chromium.launch({ headless: true });
    } catch (error) {
      t.skip(`Playwright Chromium unavailable: ${error?.message || error}`);
      return;
    }

    for (const colorScheme of ["light", "dark"]) {
      const context = await browser.newContext({
        colorScheme,
        viewport: { width: 390, height: 844 },
      });
      const page = await context.newPage();
      const runtimeErrors = [];
      page.on("pageerror", (error) => runtimeErrors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") runtimeErrors.push(message.text());
      });
      await page.addInitScript({
        content: `localStorage.setItem(
          "bokoun.gm.bokoun.display.v1",
          JSON.stringify({ interfacePreset: "compact-reader", pageTransitions: true })
        );\n${userscript}`,
      });
      await page.goto(`http://127.0.0.1:${address.port}/fav/activity`, {
        waitUntil: "domcontentloaded",
      });

      const startup = await page.evaluate(() => {
        const root = document.documentElement;
        const cover = getComputedStyle(root, "::before");
        const spinner = document.getElementById("native-spinner");
        return {
          booting: root.dataset.bokounBooting,
          coverPosition: cover.position,
          coverInset: [cover.top, cover.right, cover.bottom, cover.left],
          coverBackground: cover.backgroundColor,
          spinnerVisibility: getComputedStyle(spinner).visibility,
          hostConnected: document.getElementById("bokoun-host")?.isConnected || false,
        };
      });
      assert.equal(startup.booting, "true");
      assert.equal(startup.coverPosition, "fixed");
      assert.deepEqual(startup.coverInset, ["0px", "0px", "0px", "0px"]);
      assert.equal(
        startup.coverBackground,
        colorScheme === "dark" ? "rgb(23, 25, 27)" : "rgb(244, 242, 238)",
      );
      assert.equal(startup.spinnerVisibility, "hidden");
      assert.equal(startup.hostConnected, true);

      await page.waitForFunction(() => {
        const host = document.getElementById("bokoun-host");
        return document.documentElement.dataset.bokounBooting !== "true"
          && host?.shadowRoot?.querySelector(".route-content");
      });
      const ready = await page.evaluate(() => {
        const host = document.getElementById("bokoun-host");
        const style = getComputedStyle(host);
        return {
          active: document.documentElement.dataset.bokounActive,
          connected: host?.isConnected || false,
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
          background: style.backgroundColor,
          clipPath: style.clipPath,
          nativeSpinnerDisplay: getComputedStyle(
            document.getElementById("native-spinner"),
          ).display,
        };
      });
      assert.equal(ready.active, "true");
      assert.equal(ready.connected, true);
      assert.equal(ready.display, "block");
      assert.equal(ready.visibility, "visible");
      assert.equal(ready.opacity, "1");
      assert.notEqual(ready.background, "rgba(0, 0, 0, 0)");
      assert.equal(ready.clipPath, "inset(0px 0% 0px 0px)");
      assert.equal(ready.nativeSpinnerDisplay, "none");

      if (colorScheme === "light") {
        await page.locator("#bokoun-host [data-action='overflow']").click();
        await page.waitForFunction(() => (
          document.getElementById("bokoun-host")?.shadowRoot
            ?.querySelector(".overflow-menu")
        ));
        const menuItems = await page.locator("#bokoun-host .overflow-menu button")
          .allTextContents();
        assert.deepEqual(menuItems, [
          "Řazení…",
          "Pouze nepřečtené",
          "Upravit pořadí",
          "Písmo a vzhled…",
          "Plná Kapybara",
          "Nastavení Bokouna…",
          "Vypnout Bokouna",
        ]);
        if (process.env.BOKOUN_QA_SCREENSHOT) {
          await page.screenshot({
            path: process.env.BOKOUN_QA_SCREENSHOT,
            fullPage: false,
          });
        }
        await page.locator("#bokoun-host .title").click();
        await page.waitForFunction(() => !(
          document.getElementById("bokoun-host")?.shadowRoot
            ?.querySelector(".overflow-menu")
        ));

        await page.evaluate(() => {
          const host = document.getElementById("bokoun-host");
          host.dataset.testStableHost = "startup-host";
          host.shadowRoot.querySelector("a[href='/boards/fixture-club']").click();
        });
        await page.waitForFunction(() => (
          location.pathname === "/boards/fixture-club"
          && document.getElementById("bokoun-host")?.shadowRoot
            ?.querySelector(".route-content[data-route-pending='true']")
        ));
        const waitingRoute = await page.evaluate(() => {
          const host = document.getElementById("bokoun-host");
          const route = host.shadowRoot.querySelector(".route-content");
          return {
            stableHost: host.dataset.testStableHost,
            oldFavoritesPresent: Boolean(route.querySelector(".favorites")),
            loadingPresent: Boolean(host.shadowRoot.querySelector(".loading")),
            pending: route.dataset.routePending,
            inert: route.inert,
            filter: getComputedStyle(route).filter,
          };
        });
        assert.equal(waitingRoute.stableHost, "startup-host");
        assert.equal(waitingRoute.oldFavoritesPresent, true);
        assert.equal(waitingRoute.loadingPresent, false);
        assert.equal(waitingRoute.pending, "true");
        assert.equal(waitingRoute.inert, true);
        assert.match(waitingRoute.filter, /blur\(/);

        await page.waitForFunction(() => (
          document.getElementById("bokoun-host")?.shadowRoot
            ?.querySelector(".posts")?.textContent.includes("Target route ready")
        ));
        await page.waitForTimeout(250);
        const targetRoute = await page.evaluate(() => {
          const host = document.getElementById("bokoun-host");
          const route = host.shadowRoot.querySelector(".route-content");
          return {
            stableHost: host.dataset.testStableHost,
            pending: route.dataset.routePending || "",
            filter: getComputedStyle(route).filter,
          };
        });
        assert.equal(targetRoute.stableHost, "startup-host");
        assert.equal(targetRoute.pending, "");
        assert.ok(["none", "blur(0px)"].includes(targetRoute.filter));
      }
      assert.deepEqual(runtimeErrors, []);
      await context.close();
    }
    assert.equal(structuredRequests, 2, "startup adds no request beyond the existing structured read");
  } finally {
    await browser?.close();
    await close(server);
  }
});
