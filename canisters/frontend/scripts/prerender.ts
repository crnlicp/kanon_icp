/**
 * Prerender script — visits each route with Puppeteer, captures fully rendered HTML,
 * and writes per-route index.html files to dist/.
 *
 * Prerequisites:
 *   npm install --save-dev puppeteer tsx
 *
 * Usage:
 *   npm run build
 *   npm run prerender
 *
 * Environment variables:
 *   BACKEND_CANISTER_ID  — canister ID for fetching dynamic routes (optional)
 *   CANONICAL_BASE       — base URL, default https://kanon.app
 *   PRERENDER_BASE_URL   — URL where Vite preview is running, default http://localhost:4173
 */

import puppeteer from "puppeteer";
import * as fs from "node:fs";
import * as path from "node:path";
import { buildRouteList } from "./prerender-routes";

const PRERENDER_BASE_URL = process.env.PRERENDER_BASE_URL ?? "http://localhost:4173";
const DIST_DIR = path.resolve(import.meta.dirname, "../dist");
const SETTLE_WAIT_MS = 3000;

async function prerender() {
  const routes = await buildRouteList();
  console.log(`Prerendering ${routes.length} routes from ${PRERENDER_BASE_URL}…`);

  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });

  let passed = 0;
  let failed = 0;

  for (const route of routes) {
    const url = PRERENDER_BASE_URL + route;
    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
      await new Promise((resolve) => setTimeout(resolve, SETTLE_WAIT_MS));

      const html = await page.content();
      await page.close();

      const outDir = path.join(DIST_DIR, route === "/" ? "" : route);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "index.html"), html, "utf-8");
      console.log(`  ✓ ${route}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ ${route} — ${(err as Error).message}`);
      failed++;
    }
  }

  await browser.close();
  console.log(`\nDone: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

prerender();
