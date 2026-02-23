type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

export function hitRateLimit(key: string, maxHits: number, windowMs: number) {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    const next = { count: 1, resetAt: now + windowMs };
    store.set(key, next);
    return { limited: false, remaining: maxHits - 1, resetAt: next.resetAt };
  }

  current.count += 1;
  store.set(key, current);

  if (current.count > maxHits) {
    return { limited: true, remaining: 0, resetAt: current.resetAt };
  }

  return { limited: false, remaining: Math.max(0, maxHits - current.count), resetAt: current.resetAt };
}

// Opportunistic cleanup keeps memory bounded in long-lived processes.
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, bucket] of store.entries()) {
    if (bucket.resetAt <= now) store.delete(key);
  }
}
