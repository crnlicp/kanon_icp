@~/.claude/icp/RULES.md

# Kanon

Bilingual (Persian RTL / Swedish LTR) website and CMS for a cultural, educational
and sports institution: topics, hero slides, activities with event registration,
form templates, social links, site settings, admin panel.

## Layout

Flat layout: one backend, one frontend.

| Canister | Folder | Stack | Mainnet ID |
|---|---|---|---|
| `backend` | `canisters/backend` | Motoko (moc 1.16, mo:core 2.7, mixins) | `iooqr-rqaaa-aaaae-qkfia-cai` |
| `frontend` | `canisters/frontend` | React 19 + Vite 7 SPA, `@dfinity/static-site` (certified assets) | `ktt6z-cyaaa-aaaae-qkfhq-cai` |

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
- Backend uses the mops migration chain (`canisters/backend/src/migrations/`).
  Pending: `20261119_120000.mo` converts the pre-chain mainnet canister. Until it is
  deployed to mainnet, local **fresh installs trap** (`npm run reinstall`); upgrades work.
  After that deploy: `mops deployed backend`, then add an earlier-dated `{}` → initial-state
  migration so fresh installs work again (verified approach).
- Frontend moved from the legacy asset canister to static-site: the **first** mainnet
  deploy must be `icp deploy frontend -e ic --mode reinstall` (different canister, plain
  deploy fails the Candid check). The ID stays the same; assets re-upload from `dist/`.
- Docs: `docs/prerender.md` (SEO prerendering).
