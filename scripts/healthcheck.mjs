#!/usr/bin/env node
/**
 * Healthcheck with retry: polls a URL until it responds or the budget runs out.
 * Tolerates the small startup window where Vite is binding the port.
 *
 * Usage: node scripts/healthcheck.mjs [url] [timeoutMs]
 * Defaults: http://localhost:8080  / 30000ms
 */
const DEFAULT_URL = "http://localhost:8080";
const url = process.argv[2] || process.env.HEALTHCHECK_URL || DEFAULT_URL;
const timeoutMs = Number(process.argv[3] || process.env.HEALTHCHECK_TIMEOUT_MS || 30000);
const intervalMs = 1000;
const deadline = Date.now() + timeoutMs;

let attempt = 0;
let lastError = null;

while (Date.now() < deadline) {
  attempt++;
  try {
    const res = await fetch(url, { method: "GET" });
    if (res.ok || (res.status >= 200 && res.status < 500)) {
      console.log(`\u001b[32m✓ Healthcheck OK\u001b[0m (status ${res.status}, attempt ${attempt})`);
      process.exit(0);
    }
    lastError = `status ${res.status}`;
  } catch (err) {
    lastError = err?.code || err?.message || String(err);
  }
  await new Promise((r) => setTimeout(r, intervalMs));
}

console.error(`\u001b[31m✖ Healthcheck failed\u001b[0m after ${attempt} attempts (${timeoutMs}ms). Last error: ${lastError}`);
process.exit(1);
