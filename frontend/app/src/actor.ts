import { createActor } from "./backend/api/backend";
import type { backendInterface } from "./backend/api/backend";
import { safeGetCanisterEnv } from "@icp-sdk/core/agent/canister-env";
import { mockBackend } from "./mock/mockBackend";

const canisterEnv = safeGetCanisterEnv();

const agentOptions = {
  host: window.location.origin,
  rootKey: canisterEnv?.IC_ROOT_KEY,
};

const realBackend = createActor(
  canisterEnv?.["PUBLIC_CANISTER_ID:backend"] ?? "",
  { agentOptions }
);

// Methods that always go to the real backend
const realOnlyMethods = new Set<string>([
  "adminLogin",
  "adminLogout",
  "checkSession",
  "changePassword",
  "setMockMode",
  "uploadAsset",
]);

let mockModeEnabled = false;
let mockModeChecked = false;

/**
 * Re-fetch the mockMode flag from the real backend.
 * Called after toggling mock mode or on first getSettings call.
 */
export async function refreshMockMode(): Promise<boolean> {
  const settings = await realBackend.getSettings();
  mockModeEnabled = settings.mockMode;
  mockModeChecked = true;
  return mockModeEnabled;
}

export function isMockMode(): boolean {
  return mockModeEnabled;
}

export const backend: backendInterface = new Proxy(realBackend, {
  get(target, prop: string) {
    // getSettings: always call real backend to read the mockMode flag,
    // then overlay mock settings if mock mode is on
    if (prop === "getSettings") {
      return async () => {
        const realSettings = await target.getSettings();
        mockModeEnabled = realSettings.mockMode;
        mockModeChecked = true;
        if (mockModeEnabled) {
          const mockSettings = (await import("./mock/mockData")).mockSettings;
          return { ...mockSettings, mockMode: true };
        }
        return realSettings;
      };
    }

    // Auth & setMockMode always go to the real backend
    if (realOnlyMethods.has(prop)) {
      const val = (target as unknown as Record<string, unknown>)[prop];
      return typeof val === "function" ? (val as Function).bind(target) : val;
    }

    // All other methods: route based on mock mode
    return (...args: unknown[]) => {
      if (!mockModeChecked) {
        // First call before getSettings was invoked — check mock mode first
        return refreshMockMode().then(() => {
          const src = mockModeEnabled ? mockBackend : target;
          const impl = (src as unknown as Record<string, unknown>)[prop];
          return typeof impl === "function"
            ? (impl as (...a: unknown[]) => unknown).call(src, ...args)
            : impl;
        });
      }
      const src = mockModeEnabled ? mockBackend : target;
      const impl = (src as unknown as Record<string, unknown>)[prop];
      return typeof impl === "function"
        ? (impl as (...a: unknown[]) => unknown).call(src, ...args)
        : impl;
    };
  },
});
