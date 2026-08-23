#!/usr/bin/env node
/**
 * Mobile Lighthouse budget enforcement for key pages.
 *
 * Usage:
 *   node scripts/lighthouse-mobile.mjs [baseUrl]
 *
 * Runs Lighthouse (mobile emulation) against the key pages below and fails
 * with a non-zero exit code when a Core Web Vitals budget is exceeded.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, mkdirSync, rmSync } from "node:fs";

const BASE = process.argv[2] ?? "https://www.theorientedhub.com";

const PAGES = ["/", "/shop", "/medical-equipment", "/nuc-textbooks", "/product/ross-wilson-anatomy-physiology-14e", "/order", "/checkout"];

// Field budgets (mobile). Keep in sync with MOBILE_BUDGETS in src/lib/vitals.ts.
const BUDGETS = {
  "largest-contentful-paint": 2500,
  "cumulative-layout-shift": 0.05,
  "total-blocking-time": 200,
  "first-contentful-paint": 1800,
  "speed-index": 3400,
};

mkdirSync("/tmp/lh-reports", { recursive: true });
let failures = 0;
const violations = [];

for (const page of PAGES) {
  const url = `${BASE}${page}`;
  const out = `/tmp/lh-reports/${page.replace(/\W+/g, "_") || "root"}.json`;
  rmSync(out, { force: true });
  try {
    execFileSync(
      "npx",
      [
        "--yes",
        "lighthouse@12",
        url,
        "--only-categories=performance",
        "--form-factor=mobile",
        "--screenEmulation.mobile",
        "--budget-path=lighthouse-budgets.json",
        '--chrome-flags=--headless=new --no-sandbox',
        "--output=json",
        `--output-path=${out}`,
        "--quiet",
      ],
      { stdio: "inherit" },
    );
  } catch {
    console.error(`x  lighthouse run failed for ${url}`);
    failures++;
    continue;
  }

  const report = JSON.parse(readFileSync(out, "utf8"));
  const score = Math.round((report.categories.performance.score ?? 0) * 100);
  const rows = [];
  for (const [id, budget] of Object.entries(BUDGETS)) {
    const value = report.audits[id]?.numericValue ?? 0;
    const over = value > budget;
    if (over) {
      failures++;
      violations.push({ path: page, metric: id, value: Math.round(value * 1000) / 1000, threshold: budget, device: "mobile", build_version: process.env.BUILD_VERSION ?? null });
    }
    rows.push(`${over ? "FAIL" : "ok  "} ${id}: ${Math.round(value * 1000) / 1000} (budget ${budget})`);
  }
  console.log(`\n=== ${url} — performance ${score} ===\n${rows.join("\n")}`);
}

// Push CI budget violations into the alerting pipeline (emails + admin Speed dashboard).
const alertUrl = process.env.VITALS_ALERT_URL ?? `${BASE}/api/public/vitals-alerts`;
const alertToken = process.env.VITALS_ALERT_TOKEN;
if (violations.length && alertToken) {
  try {
    const res = await fetch(alertUrl, {
      method: "POST",
      headers: { "content-type": "application/json", "x-vitals-token": alertToken },
      body: JSON.stringify({ mode: "lighthouse", violations }),
    });
    console.log(res.ok ? `\nAlerts posted (${violations.length} violation(s)).` : `\nAlert post failed: ${res.status}`);
  } catch (err) {
    console.error(`\nAlert post failed: ${err?.message ?? err}`);
  }
} else if (violations.length) {
  console.log("\nVITALS_ALERT_TOKEN not set — skipping alert notification.");
}

if (failures > 0) {
  console.error(`\n${failures} budget violation(s).`);
  process.exit(1);
}
console.log("\nAll pages within mobile Core Web Vitals budgets.");
