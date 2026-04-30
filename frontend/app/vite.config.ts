import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { icpBindgen } from "@icp-sdk/bindgen/plugins/vite";
import { execSync } from "child_process";
import type httpProxy from "http-proxy";
import type { ClientRequest } from "http";

const environment = process.env.ICP_ENVIRONMENT || "local";
const CANISTER_NAMES = ["backend"];

function getCanisterId(name: string): string | null {
  try {
    return execSync(`icp canister status ${name} -e ${environment} -i`, {
      encoding: "utf-8",
      stdio: "pipe",
    }).trim();
  } catch {
    console.warn(`⚠ Could not resolve canister ID for '${name}' in '${environment}'. Is the local replica running?`);
    return null;
  }
}

function getDevServerConfig() {
  let networkStatus: { root_key?: string; api_url?: string };
  try {
    networkStatus = JSON.parse(
      execSync(`icp network status -e ${environment} --json`, {
        encoding: "utf-8",
        stdio: "pipe",
      })
    );
  } catch {
    console.warn(`⚠ Could not reach '${environment}' network. Dev server will start without canister proxy.`);
    return {};
  }

  const canisterParams = CANISTER_NAMES
    .map((name) => {
      const id = getCanisterId(name);
      return id ? `PUBLIC_CANISTER_ID:${name}=${id}` : null;
    })
    .filter(Boolean)
    .join("&");

  const config: Record<string, unknown> = {};

  if (canisterParams || networkStatus.root_key) {
    config.headers = {
      "Set-Cookie": `ic_env=${encodeURIComponent(
        `${canisterParams}&ic_root_key=${networkStatus.root_key ?? ""}`
      )}; SameSite=Lax;`,
    };
  }
  if (networkStatus.api_url) {
    config.proxy = {
      "/api": {
        target: networkStatus.api_url,
        changeOrigin: true,
        configure: (proxy: httpProxy) => {
          proxy.on("proxyReq", (proxyReq: ClientRequest) => {
            proxyReq.removeHeader("x-forwarded-host");
            proxyReq.removeHeader("x-forwarded-proto");
            proxyReq.removeHeader("x-forwarded-for");
          });
        },
      },
    };
  }

  return config;
}

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
    icpBindgen({
      didFile: "../../backend/backend.did",
      outDir: "./src/backend/api",
    }),
  ],
  ...(command === "serve" ? { server: getDevServerConfig() } : {}),
}));
