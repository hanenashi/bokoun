import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";

const root = path.resolve(import.meta.dirname, "..");
const packageJson = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8"),
);

export const userscriptBanner = `// ==UserScript==
// @name         Bokoun
// @namespace    https://github.com/hanenashi/bokoun
// @version      ${packageJson.version}
// @description  Minimal mobile reading and Markdown writing interface for Kapybara/Okoun
// @author       BeeChan
// @match        https://kapybara.okoun.cz/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==`;

export function userscriptBuildOptions(overrides = {}) {
  return {
    absWorkingDir: root,
    entryPoints: ["src/main.js"],
    bundle: true,
    charset: "utf8",
    format: "iife",
    legalComments: "none",
    target: ["chrome100", "firefox100"],
    banner: { js: userscriptBanner },
    ...overrides,
  };
}

async function main() {
  await build(userscriptBuildOptions({
    outfile: "bokoun.user.js",
  }));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
