---
paths:
  - "canisters/backend/**"
---

# Backend canister

- `src/main.mo` is the composition root: it declares state (no initializers) and
  `include`s the mixins. Public methods live in `src/mixins/<Area>.mo`; types in
  `src/types.mo`; stateless logic in `src/lib/` (`Helpers`, `Builders`, `Auth`, `Limits`).
- Scalar state shared by mixins lives in the `counters` and `config` records
  (`T.Counters`, `T.Config`); never add a bare actor `var` for a mixin to mutate.
- Migration chain: `src/migrations/`, `check-limit = 1`, baseline `deployed/backend.most`
  (the mainnet signature). After every mainnet deploy run `mops deployed backend`.
- Content fields are bilingual pairs: `<field>_fa` and `<field>_sv`. Add both.
- Public API returns `*Return` types (types.mo), not the stored records.
- Admin auth: client sends a SHA-256 password hash to `adminLogin`, gets a session
  token; admin methods take `token` first. `sessions` is `transient`, so upgrades log
  everyone out (intended).
- Changing a stable type needs the pending migration in `src/migrations/` (fold into it if
  one is pending). The older side-table pattern (`sessionJoinedAt`) predates the chain.
- Methods in `realOnlyMethods` (frontend `app/actor.ts`) bypass mock mode; keep that
  list in sync when adding auth/upload methods.
