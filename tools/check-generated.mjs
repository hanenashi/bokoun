import fs from "node:fs";
import path from "node:path";
import { build } from "esbuild";
import { userscriptBuildOptions } from "./build-userscript.mjs";

const root = path.resolve(import.meta.dirname, "..");
const outputPath = path.join(root, "bokoun.user.js");
const expected = fs.readFileSync(outputPath);
const result = await build(userscriptBuildOptions({
  write: false,
}));
const actual = result.outputFiles[0].contents;

if (!expected.equals(actual)) {
  console.error("bokoun.user.js is stale. Run npm run build and commit the result.");
  process.exitCode = 1;
}
