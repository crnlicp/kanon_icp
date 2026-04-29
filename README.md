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
├── backend/           # Motoko canister
│   ├── src/main.mo    # Persistent actor with all endpoints
│   └── backend.did    # Candid interface
├── frontend/
│   └── app/           # React SPA
│       ├── src/
│       │   ├── components/   # Header, Footer, GlassCard, HeroSlider, etc.
│       │   ├── pages/        # Landing, Topics, TopicHome, ActivityDetail
│       │   ├── pages/admin/  # AdminLogin, AdminDashboard, CRUD sections
│       │   ├── i18n/         # Translations & context provider
│       │   ├── auth/         # Auth context
│       │   └── actor.ts      # Backend canister connection
│       └── public/.ic-assets.json5  # SPA routing config
└── icp.yaml           # ICP project config
```

## Prerequisites

- [icp-cli](https://cli.internetcomputer.org) v0.2+
- Node.js 22+

## Local Development

```bash
# Start the local ICP network
icp network start -d

# Deploy backend + frontend canisters
icp deploy

# Start Vite dev server (with hot-reload)
cd frontend/app
npm run dev
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
