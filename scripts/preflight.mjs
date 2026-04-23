#!/usr/bin/env node
/**
 * Preflight: validates that local dependencies are installed before
 * starting the dev server. Prevents the "vite: command not found" failure
 * caused by a missing or partial node_modules.
 *
 * Exits with code 0 when ready, 1 with a clear remediation message otherwise.
 */
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const REQUIRED_BINS = ["vite", "vitest", "tsc"];

const problems = [];

const nodeModules = resolve(root, "node_modules");
if (!existsSync(nodeModules)) {
  problems.push("node_modules is missing");
} else {
  const binDir = resolve(nodeModules, ".bin");
  if (!existsSync(binDir)) {
    problems.push("node_modules/.bin is missing");
  } else {
    for (const bin of REQUIRED_BINS) {
      if (!existsSync(resolve(binDir, bin))) {
        problems.push(`node_modules/.bin/${bin} is missing`);
      }
    }
  }
}

if (problems.length > 0) {
  console.error("\n\u001b[31m✖ Preflight failed:\u001b[0m");
  for (const p of problems) console.error(`  - ${p}`);
  console.error("\n\u001b[33mFix:\u001b[0m run \u001b[1mbun install\u001b[0m (or \u001b[1mnpm install\u001b[0m) at the project root and try again.\n");
  process.exit(1);
}

console.log("\u001b[32m✓ Preflight OK — dependencies present.\u001b[0m");
