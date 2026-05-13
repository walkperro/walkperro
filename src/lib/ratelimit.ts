// Back-compat shim: legacy stub replaced by real Supabase-backed rate limiter.
// /api/contact still imports `isRateLimited` from this path.
import { rateLimit } from "./rate-limit";

/**
 * @deprecated use rateLimit() from '@/lib/rate-limit' directly.
 * Kept so app/api/contact/route.ts keeps working with no changes.
 */
export async function isRateLimited(key: string): Promise<boolean> {
  // Default policy for legacy callers: 10/min (more permissive than subscribe).
  const { limited } = await rateLimit(key, { windowSeconds: 60, max: 10 });
  return limited;
}

export { rateLimit } from "./rate-limit";
