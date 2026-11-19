@~/.claude/icp/RULES.md

# Kanon

Bilingual (Persian RTL / Swedish LTR) website and CMS for a cultural, educational
and sports institution: topics, hero slides, activities with event registration,
form templates, social links, site settings, admin panel.

## Layout

Flat layout: one backend, one frontend.

| Canister | Folder | Stack | Mainnet ID |
|---|---|---|---|
| `backend` | `canisters/backend` | Motoko (mo:core, persistent actor) | `iooqr-rqaaa-aaaae-qkfia-cai` |
| `frontend` | `canisters/frontend` | React 19 + Vite 7 SPA, legacy `@dfinity/asset-canister` recipe | `ktt6z-cyaaa-aaaae-qkfhq-cai` |

- Candid: `canisters/backend/src/backend.did` (single source; frontend generates
  `app/bindings/` from it via `npm run generate` / the vite plugin).
- Frontend uses npm (not pnpm), source in `app/`.

## Root commands

- `npm run deploy:local`: local deploy (anonymous identity unless `ICP_IDENTITY`)
- `npm run dev`: Vite dev server (proxies `/api` to the local network)
- `npm run reinstall`: local wipe + redeploy + seed (destroys local state)
- `npm run seed`, `npm run build`, `npm run prerender`
- `npm run check`: `mops check` + frontend lint + typecheck

## Boundaries

- Mainnet deploys (`-e ic`) only with explicit approval.
- Backend has no migration chain yet; stable-type changes currently use side
  tables (see `.claude/rules/backend.md`).
- Docs: `docs/prerender.md` (SEO prerendering).
