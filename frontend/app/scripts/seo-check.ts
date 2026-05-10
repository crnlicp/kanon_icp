/**
 * SEO verification script — Phase 5a
 *
 * Fetches each public route without JavaScript execution and validates SEO requirements.
 * Also checks /robots.txt and /sitemap.xml.
 *
 * Usage:
 *   npx tsx scripts/seo-check.ts [BASE_URL]
 *   BASE_URL defaults to http://localhost:4173 (Vite preview)
 *
 * Exit code 1 if any check fails.
 *
 * For best results, run AFTER `npm run prerender` so prerendered HTML is served.
 */

const BASE_URL = process.argv[2] ?? "http://localhost:4173";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CheckResult {
  route: string;
  check: string;
  pass: boolean;
  detail?: string;
}

// ── HTML parsing helpers (no DOM dependency) ──────────────────────────────────

function extractMeta(html: string, name: string): string | null {
  const patterns = [
    new RegExp(`<meta\\s[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta\\s[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return m[1];
  }
  return null;
}

function extractProperty(html: string, property: string): string | null {
  const patterns = [
    new RegExp(`<meta\\s[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta\\s[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return m[1];
  }
  return null;
}

function extractTitle(html: string): string | null {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].trim() : null;
}

function extractCanonical(html: string): string | null {
  const m = html.match(/<link\s[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)
    || html.match(/<link\s[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i);
  return m ? m[1] : null;
}

function extractHtmlLang(html: string): string | null {
  const m = html.match(/<html\s[^>]*lang=["']([^"']*)["']/i);
  return m ? m[1] : null;
}

function extractHtmlDir(html: string): string | null {
  const m = html.match(/<html\s[^>]*dir=["']([^"']*)["']/i);
  return m ? m[1] : null;
}

// ── Fetcher ───────────────────────────────────────────────────────────────────

async function fetchHtml(url: string): Promise<{ html: string; status: number }> {
  const res = await fetch(url, {
    headers: { "User-Agent": "KanonSeoChecker/1.0 (seo-check.ts)" },
  });
  const html = await res.text();
  return { html, status: res.status };
}

// ── Route checks ─────────────────────────────────────────────────────────────

interface RouteSpec {
  path: string;
  expectedLang: "sv" | "fa";
  expectedDir?: "ltr" | "rtl";
  titleShouldContain?: string;
  titleShouldNotEqual?: string;
}

const ROUTES: RouteSpec[] = [
  { path: "/", expectedLang: "sv", expectedDir: "ltr" },
  { path: "/sv/topics", expectedLang: "sv", expectedDir: "ltr" },
  { path: "/fa/topics", expectedLang: "fa", expectedDir: "rtl" },
  { path: "/sv/about", expectedLang: "sv", expectedDir: "ltr" },
  { path: "/fa/about", expectedLang: "fa", expectedDir: "rtl" },
  { path: "/sv/contact", expectedLang: "sv", expectedDir: "ltr" },
  { path: "/fa/contact", expectedLang: "fa", expectedDir: "rtl" },
];

const SHARED_TITLE = "Kanon - Kultur, utbildning och sport";

async function checkRoute(spec: RouteSpec): Promise<CheckResult[]> {
  const url = BASE_URL + spec.path;
  const results: CheckResult[] = [];

  let html: string;
  try {
    const res = await fetchHtml(url);
    html = res.html;
  } catch (err) {
    return [{
      route: spec.path,
      check: "fetch",
      pass: false,
      detail: `Failed to fetch: ${(err as Error).message}`,
    }];
  }

  const add = (check: string, pass: boolean, detail?: string) =>
    results.push({ route: spec.path, check, pass, detail });

  // Title: present and non-empty
  const title = extractTitle(html);
  add("title:present", !!title && title.length > 0, title ?? "(missing)");

  // Title: unique (not the same as the old static shared title on dynamic pages)
  if (spec.path !== "/" && spec.path !== "/sv/topics" && spec.path !== "/fa/topics") {
    add(
      "title:unique",
      title !== SHARED_TITLE,
      title === SHARED_TITLE ? "Still shows default static title" : title ?? "(missing)"
    );
  }

  // Meta description: present and non-empty
  const desc = extractMeta(html, "description");
  add("meta:description", !!desc && desc.length > 0, desc ?? "(missing)");

  // OG tags
  const ogTitle = extractProperty(html, "og:title");
  const ogDesc = extractProperty(html, "og:description");
  const ogImage = extractProperty(html, "og:image");
  add("og:title", !!ogTitle && ogTitle.length > 0, ogTitle ?? "(missing)");
  add("og:description", !!ogDesc && ogDesc.length > 0, ogDesc ?? "(missing)");
  // og:image is optional on pages with no image; warn but don't fail on / route
  if (spec.path !== "/") {
    add("og:image", ogImage !== null, ogImage ?? "(missing)");
  }

  // Canonical
  const canonical = extractCanonical(html);
  add("canonical:present", !!canonical && canonical.length > 0, canonical ?? "(missing)");
  if (canonical) {
    const expectedCanonicalSuffix = spec.path;
    add(
      "canonical:matches-route",
      canonical.endsWith(expectedCanonicalSuffix) || canonical === BASE_URL + expectedCanonicalSuffix,
      `canonical="${canonical}" expected to end with "${expectedCanonicalSuffix}"`
    );
  }

  // lang attribute
  const lang = extractHtmlLang(html);
  add(
    "html:lang",
    lang === spec.expectedLang || lang?.startsWith(spec.expectedLang) || false,
    `lang="${lang ?? "(missing)"}" expected "${spec.expectedLang}"`
  );

  // dir attribute
  if (spec.expectedDir) {
    const dir = extractHtmlDir(html);
    add(
      "html:dir",
      dir === spec.expectedDir || (spec.expectedDir === "ltr" && (dir === null || dir === "ltr")),
      `dir="${dir ?? "(absent)"}" expected "${spec.expectedDir}"`
    );
  }

  return results;
}

// ── robots.txt check ──────────────────────────────────────────────────────────

async function checkRobots(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const add = (check: string, pass: boolean, detail?: string) =>
    results.push({ route: "/robots.txt", check, pass, detail });

  let text: string;
  try {
    const res = await fetchHtml(BASE_URL + "/robots.txt");
    if (res.status !== 200) {
      add("status:200", false, `HTTP ${res.status}`);
      return results;
    }
    text = res.html;
  } catch (err) {
    add("fetch", false, (err as Error).message);
    return results;
  }

  add("status:200", true);
  add(
    "disallow:/admin",
    /Disallow:\s*\/admin/i.test(text),
    text.includes("admin") ? "found" : "(not found)"
  );
  add(
    "sitemap:declared",
    /Sitemap:/i.test(text),
    text.match(/Sitemap:\s*(\S+)/i)?.[1] ?? "(not found)"
  );
  add(
    "no-empty-disallow",
    !/Disallow:\s*\n/.test(text) && !/Disallow:\s*$/.test(text),
    "no blank Disallow line"
  );

  return results;
}

// ── sitemap.xml check ─────────────────────────────────────────────────────────

async function checkSitemap(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const add = (check: string, pass: boolean, detail?: string) =>
    results.push({ route: "/sitemap.xml", check, pass, detail });

  let xml: string;
  try {
    const res = await fetchHtml(BASE_URL + "/sitemap.xml");
    if (res.status !== 200) {
      add("status:200", false, `HTTP ${res.status}`);
      return results;
    }
    xml = res.html;
  } catch (err) {
    add("fetch", false, (err as Error).message);
    return results;
  }

  add("status:200", true);

  // Valid XML (has urlset element)
  add("xml:urlset", /<urlset/i.test(xml), "<urlset> present");

  // Count <url> entries
  const urlCount = (xml.match(/<url>/gi) ?? []).length;
  add("xml:has-urls", urlCount > 0, `${urlCount} <url> entries`);

  // Has at least one /sv/ and one /fa/ URL
  add("xml:has-sv-urls", /\/sv\//i.test(xml), "/sv/ routes present");
  add("xml:has-fa-urls", /\/fa\//i.test(xml), "/fa/ routes present");

  // No /admin URLs
  add("xml:no-admin", !/\/admin/i.test(xml), xml.includes("/admin") ? "admin URL found!" : "clean");

  return results;
}

// ── Reporter ─────────────────────────────────────────────────────────────────

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";

function printTable(results: CheckResult[]) {
  const grouped: Record<string, CheckResult[]> = {};
  for (const r of results) {
    grouped[r.route] ??= [];
    grouped[r.route].push(r);
  }

  let totalPass = 0;
  let totalFail = 0;

  for (const [route, checks] of Object.entries(grouped)) {
    const allPass = checks.every((c) => c.pass);
    const icon = allPass ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
    console.log(`\n${icon} ${BOLD}${route}${RESET}`);
    for (const c of checks) {
      const status = c.pass ? `${GREEN}PASS${RESET}` : `${RED}FAIL${RESET}`;
      const detail = c.detail ? ` — ${c.pass ? "" : YELLOW}${c.detail}${c.pass ? "" : RESET}` : "";
      console.log(`     ${status}  ${c.check}${detail}`);
      c.pass ? totalPass++ : totalFail++;
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log(`${BOLD}Results:${RESET} ${GREEN}${totalPass} passed${RESET}, ${totalFail > 0 ? RED : GREEN}${totalFail} failed${RESET}`);

  return totalFail;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`${BOLD}Kanon SEO Check${RESET} — ${BASE_URL}\n${"═".repeat(60)}`);

  const allResults: CheckResult[] = [];

  for (const spec of ROUTES) {
    allResults.push(...(await checkRoute(spec)));
  }

  allResults.push(...(await checkRobots()));
  allResults.push(...(await checkSitemap()));

  const failures = printTable(allResults);

  if (failures > 0) {
    console.log(`\n${RED}${BOLD}✗ ${failures} check(s) failed.${RESET}`);
    process.exit(1);
  } else {
    console.log(`\n${GREEN}${BOLD}✓ All checks passed.${RESET}`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
