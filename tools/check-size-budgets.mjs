import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const sourceDir = path.join(root, "src");
const limits = {
  generatedBytes: 320 * 1024,
  sourceLines: 9_000,
  files: {
    "styles.js": 1_400,
    "styles-compact.js": 700,
    "shell.js": 700,
    "fullscreen.js": 160,
    "comparison.js": 180,
    "adapters.js": 500,
    "structured-models.js": 260,
    "ui.js": 1_100,
  },
};

function lineCount(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  return text ? text.split(/\r?\n/).length - 1 : 0;
}

const generatedBytes = fs.statSync(path.join(root, "bokoun.user.js")).size;
const sourceFiles = fs.readdirSync(sourceDir)
  .filter((name) => name.endsWith(".js"))
  .sort();
const sourceCounts = Object.fromEntries(
  sourceFiles.map((name) => [name, lineCount(path.join(sourceDir, name))]),
);
const sourceLines = Object.values(sourceCounts).reduce((sum, count) => sum + count, 0);
const failures = [];

if (generatedBytes > limits.generatedBytes) {
  failures.push(`generated userscript ${generatedBytes} B > ${limits.generatedBytes} B`);
}
if (sourceLines > limits.sourceLines) {
  failures.push(`source total ${sourceLines} lines > ${limits.sourceLines} lines`);
}
for (const [name, maximum] of Object.entries(limits.files)) {
  if ((sourceCounts[name] || 0) > maximum) {
    failures.push(`${name} ${sourceCounts[name]} lines > ${maximum} lines`);
  }
}

if (failures.length) {
  console.error(`Bokoun size budget exceeded:\n- ${failures.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log(
    `Size budget OK: ${generatedBytes} B generated; ${sourceLines} source lines; ui.js ${sourceCounts["ui.js"]} lines; shell.js ${sourceCounts["shell.js"]} lines.`,
  );
}
