#!/usr/bin/env bash
# Local only: wipes canister state, then reseeds. Never point this at mainnet.
set -euo pipefail
cd "$(dirname "$0")/.."
IDENTITY="${ICP_IDENTITY:-anonymous}"
icp build
icp deploy --mode reinstall --identity "$IDENTITY"
npm --prefix canisters/frontend run seed
