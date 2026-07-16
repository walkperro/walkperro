import type { Platform, PlatformAdapter } from "./types";
import { tiktokAdapter } from "./tiktok";
import { youtubeAdapter } from "./youtube";
import { instagramAdapter } from "./instagram";

export * from "./types";

export const adapters: Record<Platform, PlatformAdapter> = {
  tiktok: tiktokAdapter,
  instagram: instagramAdapter,
  youtube: youtubeAdapter,
};

export function getAdapter(platform: Platform): PlatformAdapter {
  return adapters[platform];
}

/**
 * Detect which platform a profile URL belongs to and return the adapter plus
 * the parsed handle. Returns null if no adapter recognizes the URL.
 */
export function resolveProfileUrl(
  url: string
): { adapter: PlatformAdapter; handle: string } | null {
  for (const adapter of Object.values(adapters)) {
    const parsed = adapter.parseProfileUrl(url);
    if (parsed) return { adapter, handle: parsed.handle };
  }
  return null;
}
