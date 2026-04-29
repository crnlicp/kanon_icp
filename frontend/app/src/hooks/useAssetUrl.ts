import { useState, useEffect } from "react";

/**
 * Global cache: maps "/uploads/..." keys → blob URLs.
 * Shared across all hook instances so each asset is fetched only once.
 */
const cache = new Map<string, string>();
const pending = new Map<string, Promise<string>>();

function mimeFromKey(key: string): string {
  const ext = key.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "webp": return "image/webp";
    case "png": return "image/png";
    case "jpg": case "jpeg": return "image/jpeg";
    case "gif": return "image/gif";
    case "svg": return "image/svg+xml";
    case "mp4": return "video/mp4";
    case "webm": return "video/webm";
    case "ogg": return "video/ogg";
    default: return "application/octet-stream";
  }
}

async function resolve(key: string): Promise<string> {
  const cached = cache.get(key);
  if (cached) return cached;

  const inflight = pending.get(key);
  if (inflight) return inflight;

  const promise = (async () => {
    try {
      const { backend } = await import("../actor");
      const data = await backend.getAsset(key);
      if (data) {
        const url = URL.createObjectURL(
          new Blob([new Uint8Array(data)], { type: mimeFromKey(key) })
        );
        cache.set(key, url);
        return url;
      }
    } catch {
      // fall through
    }
    return key; // fallback to original path
  })();

  pending.set(key, promise);
  const result = await promise;
  pending.delete(key);
  return result;
}

/**
 * Resolves an asset URL. If the URL starts with "/uploads/", fetches the
 * blob from the backend canister and returns an object URL. External URLs
 * and empty strings are returned as-is.
 */
export function useAssetUrl(src: string | undefined): string {
  const isUpload = src?.startsWith("/uploads/");
  const [url, setUrl] = useState(isUpload ? "" : (src ?? ""));

  useEffect(() => {
    if (!src) { setUrl(""); return; }
    if (!src.startsWith("/uploads/")) { setUrl(src); return; }
    let cancelled = false;
    resolve(src).then((resolved) => {
      if (!cancelled) setUrl(resolved);
    });
    return () => { cancelled = true; };
  }, [src]);

  return url;
}
