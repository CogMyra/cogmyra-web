// src/lib/retry.js
// Small, dependency-free exponential backoff with jitter for fetch calls.

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export async function fetchWithRetry(
  url,
  options = {},
  {
    retries = 3,              // total attempts (first try + 2 retries = 3)
    baseDelayMs = 400,        // starting backoff
    maxDelayMs = 4000,        // cap for backoff
    onRetry = () => {},       // (attempt, err) => void
    retryOn = (res) => {      // which responses should trigger retry
      // Retry on network errors (handled by catch) and 429/5xx
      return res && (res.status === 429 || (res.status >= 500 && res.status <= 599));
    },
  } = {}
) {
  let attempt = 0;
  let lastErr = null;

  while (attempt < retries) {
    try {
      const res = await fetch(url, options);

      if (!retryOn(res)) return res; // success or non-retryable error

      attempt += 1;
      if (attempt >= retries) return res; // give up and return last response

      const delay = Math.min(
        maxDelayMs,
        Math.round(baseDelayMs * Math.pow(2, attempt - 1) * (0.7 + Math.random() * 0.6)) // jitter
      );

      onRetry(attempt, new Error(`HTTP ${res.status}`), delay);
      await sleep(delay);
      continue;
    } catch (err) {
      // Network or CORS error
      lastErr = err;
      attempt += 1;
      if (attempt >= retries) throw err;

      const delay = Math.min(
        maxDelayMs,
        Math.round(baseDelayMs * Math.pow(2, attempt - 1) * (0.7 + Math.random() * 0.6))
      );

      onRetry(attempt, err, delay);
      await sleep(delay);
    }
  }

  // Should not reach here, but just in case:
  if (lastErr) throw lastErr;
  throw new Error("fetchWithRetry: exhausted without response");
}
