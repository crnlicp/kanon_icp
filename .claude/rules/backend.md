---
paths:
  - "canisters/backend/**"
---

# Backend canister

- All public methods live in `src/main.mo`; types in `src/Types.mo`, pure helpers in `src/Helpers.mo`.
- Content fields are bilingual pairs: `<field>_fa` and `<field>_sv`. Add both.
- Public API returns `*Return` types (Types.mo), not the stored records.
- Admin auth: client sends a SHA-256 password hash to `adminLogin`, gets a session
  token; admin methods take `token` first. `sessions` is `transient`, so upgrades log
  everyone out (intended).
- Stable record types are never modified in place: new per-record data goes in a
  side-table map (e.g. `sessionJoinedAt`) with a legacy fallback for missing entries.
- Methods in `realOnlyMethods` (frontend `app/actor.ts`) bypass mock mode; keep that
  list in sync when adding auth/upload methods.
