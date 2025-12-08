const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX = 5; // max submissions per window
type Entry = { count: number; expires: number };
const bucket = new Map<string, Entry>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const hit = bucket.get(key);
  if (!hit || now > hit.expires) {
    bucket.set(key, { count: 1, expires: now + WINDOW_MS });
    return false;
  }
  hit.count += 1;
  bucket.set(key, hit);
  return hit.count > MAX;
}
