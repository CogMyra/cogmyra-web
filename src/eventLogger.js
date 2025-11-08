// src/eventLogger.js
// Front-end event logger with:
// - de-dupe (same type+path+payload within WINDOW_MS)
// - offline queue (localStorage) + auto flush on reconnect
// - batch POST to /api/events
//
// Globally exposes: window.cmg.logEvent(type, payload?, opts?)

(() => {
  const ENDPOINT = "/api/events";
  const STORAGE_KEY = "cmg_event_queue_v1";
  const WINDOW_MS = 10_000; // de-dupe window
  const FLUSH_INTERVAL_MS = 15_000; // periodic flush
  const MAX_BATCH = 25; // send at most N at a time
  const DEFAULT_USER_ID = null; // let API fill 'anon'

  // ---- queue helpers ----
  function loadQueue() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  function saveQueue(q) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(q));
    } catch {
      // storage may be full; drop oldest
      if (q.length > 0) {
        q.shift();
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(q)); } catch {}
      }
    }
  }
  function enqueue(evt) {
    const q = loadQueue();
    q.push(evt);
    saveQueue(q);
    console.debug("[cmg] queued", evt.type);
  }
  function dequeueBatch(n = MAX_BATCH) {
    const q = loadQueue();
    const batch = q.slice(0, n);
    const rest = q.slice(n);
    saveQueue(rest);
    return batch;
  }
  function putBackFront(batch) {
    // Prepend back if send failed
    const q = loadQueue();
    saveQueue([...batch, ...q]);
  }

  // ---- de-dupe (within WINDOW_MS) ----
  const lastSeen = new Map(); // sig -> ts
  function signature({ type, path, payload }) {
    // Small stable signature
    const p = payload ? JSON.stringify(payload).slice(0, 256) : "";
    return `${type}|${path || ""}|${p}`;
  }
  function isDuplicate(evt) {
    const sig = signature(evt);
    const now = Date.now();
    const last = lastSeen.get(sig) || 0;
    if (now - last < WINDOW_MS) return true;
    lastSeen.set(sig, now);
    return false;
  }

  // ---- send / flush ----
  let backoffMs = 2_000; // start 2s, cap 60s
  let flushing = false;

  async function flushOnce() {
    if (flushing) return;
    if (!navigator.onLine) return;

    const batch = dequeueBatch(MAX_BATCH);
    if (batch.length === 0) return;

    flushing = true;
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(
          batch.map(e => ({
            type: e.type,
            path: e.path,
            payload: e.payload ?? null,
            user_id: e.user_id ?? DEFAULT_USER_ID,
            ts: e.ts,
          }))
        ),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json().catch(() => ({}));
      console.debug("[cmg] flushed", batch.length, data);
      backoffMs = 2_000; // reset on success

      // If more remain, try again right away
      if (loadQueue().length > 0) {
        flushing = false;
        return flushOnce();
      }
    } catch (err) {
      console.warn("[cmg] flush failed, backing off", err?.message || err);
      // put back
      putBackFront(batch);
      // exponential backoff (max 60s)
      const delay = Math.min(backoffMs, 60_000);
      backoffMs = Math.min(backoffMs * 2, 60_000);
      setTimeout(flushOnce, delay);
    } finally {
      flushing = false;
    }
  }

  function schedulePeriodicFlush() {
    setInterval(flushOnce, FLUSH_INTERVAL_MS);
    window.addEventListener("online", flushOnce);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flushOnce();
    });
  }

  // ---- public API ----
  function logEvent(type, payload = null, opts = {}) {
    const evt = {
      type: String(type),
      path: String(opts.path ?? location.pathname),
      payload: payload ?? null,
      user_id: opts.userId ?? DEFAULT_USER_ID,
      ts: new Date().toISOString(),
    };
    if (!evt.type) return;

    if (isDuplicate(evt)) {
      console.debug("[cmg] de-duped", evt.type);
      return;
    }
    enqueue(evt);
    // opportunistic flush
    flushOnce();
  }

  // expose on window
  window.cmg = window.cmg || {};
  window.cmg.logEvent = logEvent;

  // kick off background flush
  schedulePeriodicFlush();

  console.debug("[cmg] eventLogger ready");
})();
