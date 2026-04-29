import { createActor } from "./backend/api/backend";
import { safeGetCanisterEnv } from "@icp-sdk/core/agent/canister-env";

const canisterEnv = safeGetCanisterEnv();

const agentOptions = {
  host: window.location.origin,
  rootKey: canisterEnv?.IC_ROOT_KEY,
};

export const backend = createActor(
  canisterEnv?.["PUBLIC_CANISTER_ID:backend"] ?? "",
  { agentOptions }
);
