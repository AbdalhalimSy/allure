export async function fetchWithRetry<T>(fn: () => Promise<T>, options: { retries?: number; baseDelayMs?: number } = {}): Promise<T> {
  const { retries = 3, baseDelayMs = 300 } = options;
  let attempt = 0;
  // Jittered exponential backoff
  const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
  while (true) {
    try {
      return await fn();
    } catch (err: any) {
      const status = err?.response?.status || err?.status;
      attempt++;
      if (attempt > retries || (status && status !== 429)) {
        throw err;
      }
      const delay = baseDelayMs * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 100);
      await sleep(delay);
    }
  }
}

// Simple in-memory cache for GET lookups to reduce rate-limit risk
const cache = new Map<string, any>();
export async function cachedGet<T>(key: string, fn: () => Promise<T>, ttlMs = 5 * 60 * 1000): Promise<T> {
  const now = Date.now();
  const entry = cache.get(key);
  if (entry && entry.expires > now) {
    return entry.value as T;
  }
  const value = await fn();
  cache.set(key, { value, expires: now + ttlMs });
  return value as T;
}