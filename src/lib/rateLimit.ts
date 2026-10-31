import "server-only";

type Bucket = { count: number; resetAt: number };

export function createRateLimiter({ requests, windowMs }: { requests: number; windowMs: number }) {
  const buckets = new Map<string, Bucket>();

  return (key: string) => {
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }

    bucket.count += 1;
    return bucket.count <= requests;
  };
}
