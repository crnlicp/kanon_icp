---
paths:
  - "canisters/frontend/**"
---

# Frontend canister

- Talk to the backend only through `backend` from `app/actor.ts`. It is a Proxy that
  routes calls to `app/mock/mockBackend` when the backend's `mockMode` setting is on.
  New backend methods need a mock implementation in `app/mock/`, unless they are
  listed in `realOnlyMethods`.
- All user-facing text goes through `app/i18n/translations.ts` (fa + sv). Layout must
  work in both RTL (fa) and LTR (sv).
- Per-page SEO uses `react-helmet-async`; routes to prerender are listed in
  `scripts/prerender-routes.ts` (see `docs/prerender.md`).
- SPA routing and headers: `public/_redirects`, `public/_headers` (static-site recipe;
  `.ic-assets.json5` is not read). No default security headers: keep the CSP in `_headers`.
- `scripts/seed.ts` wipes and reseeds the local backend; seed data in `scripts/seed-data.ts`.
