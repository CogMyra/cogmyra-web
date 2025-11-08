// /public/eventLogger.js
// Lightweight event logger (no build needed). Exposes window.cmg.logEvent()

const ENDPOINT = "/api/events";
const USER_ID = "anon"; // temp default; you can wire real IDs later

// simple in-memory queue + dedupe by (type+payload JSON)
const queue = [];
const seen = new Set();
let flushTimer = null;

function nowIso() {
  try { return new Date().toISOString(); } catch { return null; }
}

function enqueue(evt) {
  const key = JSON.stringify([evt.type, evt.path || "", evt.payload || {}]);
  if (seen.has(key)) return;
  seen.add(key);
  queue.push(evt);
  scheduleFlush();
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(flush, 1000); // batch every 1s
}

async function flush() {
  flushTimer = null;
  if (!queue.length) return;

  // grab and clear (so new events can keep queuing)
  const batch = queue.splice(0, queue.length);

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(
        batch.map(e => ({
          type: e.type,
          path: e.path ?? (location && location.pathname) || null,
          user_id: e.user_id ?? USER_ID,
          payload: e.payload ?? null,
          ts: e.ts ?? nowIso()
        }))
      ),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
    // success: allow these to be sent again in the future
    seen.clear();
    console.log("[cmg] flushed", batch.length, json);
  } catch (err) {
    console.warn("[cmg] flush failed; keeping", batch.length, "events in memory", err);
    // put back so we can retry on next tick
    queue.unshift(...batch);
    // backoff retry
    setTimeout(scheduleFlush, 3000);
  }
}

// Public API
const cmg = {
  logEvent(type, payload = {}, opts = {}) {
    if (!type || typeof type !== "string") return;
    enqueue({
      type,
      payload,
      path: opts.path ?? null,
      user_id: opts.user_id ?? null,
      ts: opts.ts ?? null,
    });
    console.log("[cmg] queued", type);
  },
};

// expose globally
window.cmg = cmg;

// optional: page-view
try { cmg.logEvent("page.view", { path: location.pathname }); } catch {}
