# Kanon

A bilingual (Persian / Swedish) cultural, educational, and sports institution website built on the **Internet Computer** (ICP).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Motoko (persistent actor, mo:core 2.3.1) |
| Frontend | React 19 · TypeScript · Vite 7 |
| Styling | Tailwind CSS v4 · Glassmorphism |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| Routing | React Router v6 |
| Tooling | icp-cli v0.2 |

## Features

- **Bilingual** — Persian (RTL) and Swedish (LTR) with runtime switching
- **Glassmorphism UI** — frosted glass cards, gradients, smooth animations
- **Mobile-first** — bottom-sheet nav on mobile, full sidebar on desktop
- **Admin panel** — CRUD for topics, hero slides, activities, social links, site settings
- **SHA-256 auth** — simple password-based admin login with session tokens
- **On-chain storage** — all data persisted in Motoko stable variables

## Project Structure

```
kanon/
├── icp.yaml                 # networks, environments, canisters/*
├── package.json             # root commands (delegate into canisters/)
├── scripts/reinstall.sh     # local wipe + redeploy + seed
├── docs/prerender.md
└── canisters/
    ├── backend/             # Motoko canister
    │   ├── mops.toml
    │   └── src/             # main.mo, Types.mo, Helpers.mo, backend.did
    └── frontend/            # React SPA (asset canister)
        ├── app/             # components/, pages/, pages/admin/, i18n/, auth/, actor.ts
        │   └── bindings/    # generated from backend.did (not committed)
        ├── public/          # _redirects, _headers, .well-known/, favicons
        └── scripts/         # seed, prerender, seo-check
```

## Prerequisites

- [icp-cli](https://cli.internetcomputer.org) v0.2+
- Node.js 22+

## Local Development

```bash
# Start the local ICP network
icp network start -d

# Deploy backend + frontend canisters (anonymous identity unless ICP_IDENTITY is set)
npm run deploy:local

# Start Vite dev server (with hot-reload)
npm run dev

# Wipe local state and reseed
npm run reinstall
```

The dev server reads canister IDs from `icp canister status` and proxies `/api` calls to the local replica.

## Deploy to Mainnet

```bash
icp deploy -e ic
```

## Admin Access

Navigate to `/admin` in your browser.
- Default password: `password`
- Change it by calling `adminChangePassword` on the backend canister after first login.

## Color Palette

| Name | Hex |
|------|-----|
| Primary (teal) | `#00D4C8` |
| Accent (coral) | `#FF6B6B` |
| Navy | `#0F172A` |
| Off-white | `#F8FAFC` |
