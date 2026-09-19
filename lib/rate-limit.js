const buckets = new Map();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

export function rateLimit(identifier) {
  const now = Date.now();
  const bucket = buckets.get(identifier) ?? { count: 0, resetAt: now + WINDOW_MS };
  if (now >= bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + WINDOW_MS;
  }
  bucket.count += 1;
  buckets.set(identifier, bucket);

  return {
    allowed: bucket.count <= MAX_REQUESTS,
    retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}
