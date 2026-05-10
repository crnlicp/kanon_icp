# Kanon Prerendering

This document describes the build-time prerendering approach for SEO on the Kanon ICP CMS.

## Why prerendering?

Kanon is a React SPA. Search engine crawlers can execute JavaScript, but prerendering
guarantees fully populated `<head>` meta tags (title, description, OG, JSON-LD) are
present in the raw HTML without relying on JS execution. This is especially important
for social sharing crawlers (Facebook, LinkedIn, Twitter) which do not run JS.

## How it works

1. `npm run build` produces a fully bundled SPA in `dist/`.
2. `scripts/prerender.ts` starts a headless Puppeteer browser and visits every route.
3. It waits for the React tree to settle (canister calls complete, Helmet updates `<head>`).
4. The fully rendered HTML is written to `dist/{route}/index.html`.
5. The ICP asset canister's `enable_aliasing: true` config ensures these per-route files
   are served at their exact paths before falling back to `dist/index.html`.

## Prerequisites

Install Puppeteer (not included by default — large binary):

```bash
npm install --save-dev puppeteer tsx
```

## Running locally

```bash
# Build first (also done automatically by npm run prerender)
npm run build

# Start preview server in background, then prerender all routes
npm run prerender
```

The script will log each route with ✓ or ✗. Exit code is 1 if any route fails.

## Environment variables

| Variable              | Default                  | Description |
|-----------------------|--------------------------|-------------|
| `BACKEND_CANISTER_ID` | (empty)                  | Backend canister ID for fetching topic/activity slugs |
| `CANONICAL_BASE`      | `https://kanon.app`      | Canonical base URL (must match SeoSettings.canonicalBaseUrl) |
| `PRERENDER_BASE_URL`  | `http://localhost:4173`  | URL where Vite preview is running |

## Deploy pipeline

```bash
# Example deploy script
npm run build

# Fetch all dynamic routes from the live canister
BACKEND_CANISTER_ID=xxxxx-xxxxx-xxxxx-xxxxx-cai \
CANONICAL_BASE=https://kanon.app \
npm run prerender

# Deploy dist/ to the ICP asset canister
dfx deploy frontend --network ic
```

## Known limitations

- **Content must be live on the canister** before running prerender. If a new topic is
  added to the canister but prerender hasn't run since, crawlers will see the shell HTML
  for that route.
- **Canister call latency**: Puppeteer waits 3 seconds after `networkidle2` for canister
  calls to settle. If the canister is under load, increase `SETTLE_WAIT_MS` in the script.
- **Credentials**: The prerender script uses the public (unauthenticated) backend API.
  Admin pages are not prerendered and should not be.
- **Static routes only** when `BACKEND_CANISTER_ID` is not set: only the routes hardcoded
  in `scripts/prerender-routes.ts` are prerendered.

## Per-route HTML files

After prerendering, `dist/` will contain:

```
dist/
  index.html                                    ← SPA shell (fallback)
  _not_found.html                               ← 404 page shell
  sv/topics/index.html                          ← prerendered
  fa/topics/index.html                          ← prerendered
  sv/topics/{slug}/index.html                   ← prerendered per topic
  sv/topics/{topicSlug}/{activitySlug}/index.html  ← prerendered per activity
  ...
```

The ICP asset canister serves the most specific matching file first.
