#!/usr/bin/env node
/**
 * Startup smoke test: boots `vite preview` against a built bundle and verifies
 * the app responds on the configured port. Designed for CI — fails loudly if
 * the app cannot start.
 */
import { spawn } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const PORT = process.env.SMOKE_PORT || "4173";
const URL = `http://localhost:${PORT}`;
const STARTUP_BUDGET_MS = 45000;

const viteBin = resolve(root, "node_modules/.bin/vite");
if (!existsSync(viteBin)) {
  console.error("✖ vite binary missing — run `bun install` before smoke test.");
  process.exit(1);
}

console.log(`→ Starting vite preview on port ${PORT}…`);
const server = spawn(viteBin, ["preview", "--port", PORT, "--host", "127.0.0.1"], {
  cwd: root,
  stdio: ["ignore", "inherit", "inherit"],
  env: { ...process.env },
});

let cleanedUp = false;
const cleanup = (code) => {
  if (cleanedUp) return;
  cleanedUp = true;
  try { server.kill("SIGTERM"); } catch {}
  setTimeout(() => process.exit(code), 250).unref();
};

server.on("exit", (code) => {
  if (!cleanedUp) {
    console.error(`✖ vite preview exited unexpectedly (code ${code})`);
    process.exit(1);
  }
});

const deadline = Date.now() + STARTUP_BUDGET_MS;
let attempt = 0;
let ok = false;
let lastError = null;

while (Date.now() < deadline) {
  attempt++;
  try {
    const res = await fetch(URL);
    if (res.ok) {
      const body = await res.text();
      if (body.includes("<div id=\"root\"") || body.includes("<!DOCTYPE html>")) {
        console.log(`✓ Smoke OK — app responded on ${URL} (attempt ${attempt})`);
        ok = true;
        break;
      }
      lastError = "unexpected response body";
    } else {
      lastError = `status ${res.status}`;
    }
  } catch (err) {
    lastError = err?.code || err?.message || String(err);
  }
  await new Promise((r) => setTimeout(r, 1000));
}

if (!ok) {
  console.error(`✖ Smoke test failed after ${attempt} attempts. Last error: ${lastError}`);
  cleanup(1);
} else {
  cleanup(0);
}
