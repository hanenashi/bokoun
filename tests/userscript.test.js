const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const scriptPath = path.join(__dirname, "..", "bokoun.user.js");
const source = fs.readFileSync(scriptPath, "utf8");

test("is an installable document-start Kapybara userscript", () => {
  assert.match(source, /@match\s+https:\/\/kapybara\.okoun\.cz\/\*/);
  assert.match(source, /@run-at\s+document-start/);
  assert.match(source, /@version\s+0\.1\.1/);
});

test("first prototype is read-only and has no direct network transport", () => {
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(source, /\bXMLHttpRequest\b/);
  assert.doesNotMatch(source, /\bCreatePost\b/);
  assert.doesNotMatch(source, /okapi\.okoun\.cz/);
});

test("compatibility layer uses semantic selectors, not generated Svelte classes", () => {
  assert.match(source, /favoriteRows: ".favorites-page a\[href\^='\/boards\/'\]"/);
  assert.match(source, /posts: "article.post\[data-post-id\]"/);
  assert.doesNotMatch(source, /🇸-/);
});

test("failure and full-version paths reveal native Kapybara", () => {
  assert.match(source, /function revealNative/);
  assert.match(source, /function openFullKapybara/);
  assert.match(source, /Native page was not ready; restored full Kapybara/);
});

test("temporary full mode always provides a visible route back to Bokoun", () => {
  assert.match(source, /const RETURN_HOST_ID = "bokoun-return"/);
  assert.match(source, /function showReturnControl/);
  assert.match(source, /aria-label="Zpět do Bokouna"/);
  assert.match(source, /sessionStorage\.removeItem\(SESSION_DISABLED_KEY\);\s*location\.reload\(\)/);
});

test("scroll restoration happens after the lite content is rendered", () => {
  const renderIndex = source.indexOf("inner.innerHTML =");
  const restoreIndex = source.indexOf("restoreScroll(key", renderIndex);
  assert.ok(renderIndex > -1);
  assert.ok(restoreIndex > renderIndex);
  assert.match(source, /requestAnimationFrame\(\(\) => \{\s*requestAnimationFrame/);
});
