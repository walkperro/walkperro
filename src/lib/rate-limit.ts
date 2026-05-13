import { admin } from "@/lib/supabase/admin";

/**
 * Supabase-backed rate limiter via the walkperro.bump_rate_limit() RPC.
 * Returns { limited, count } — `limited=true` if the request should be rejected.
 *
 * Best practice: pass a stable composite key like `subscribe:${ip}` or
 * `admin-login:${email}` so different action types don't collide.
 */
export async function rateLimit(
  key: string,
  options: { windowSeconds: number; max: number }
): Promise<{ limited: boolean; count: number }> {
  try {
    const { data, error } = await admin().rpc("bump_rate_limit", {
      p_key: key,
      p_window_seconds: options.windowSeconds,
      p_max: options.max,
    });
    if (error) {
      // Fail-open: never block legit users on DB hiccup
      console.warn("rateLimit RPC error:", error.message);
      return { limited: false, count: 0 };
    }
    const row = Array.isArray(data) ? data[0] : data;
    return {
      limited: !!row?.limited,
      count: row?.current_count ?? 0,
    };
  } catch (e) {
    console.warn("rateLimit threw:", e);
    return { limited: false, count: 0 };
  }
}

/** Convenience: derive a stable IP key from request headers. */
export function ipKey(headers: Headers, prefix: string): string {
  const xff = headers.get("x-forwarded-for") || "";
  const real = headers.get("x-real-ip") || "";
  const ip = xff.split(",")[0]?.trim() || real || "unknown";
  return `${prefix}:${ip}`;
}
