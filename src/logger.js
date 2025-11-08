// src/lib/logger.js
// Minimal front-end event logger: queue, dedupe, offline retry, batch POST to /api/events

(function () {
  const ENDPOINT = "/api/events";
  const STORAGE_KEY = "cmg_evt_q";
  const DEDUPE_KEY = "cmg_evt_seen";
  const BATCH_SIZE = 20;
  const DEDUPE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  const nowIso = () => new Date().toISOString();

  function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }

  // simple hash for dedupe (type|path|payloadJson)
  function sig(ev) {
    const p = ev.payload ? JSON.stringify(ev.payload) : "";
    return `${ev.type}|${ev.path || location.pathname}|${p}`.slice(0, 512);
  }

  // queue ops
  function getQueue() { return load(STORAGE_KEY, []); }
  function setQueue(q) { save(STORAGE_KEY, q); }

  // dedupe cache { signature: lastSeenMs }
  function getSeen() { return load(DEDUPE_KEY, {}); }
  function setSeen(m) { save(DEDUPE_KEY, m); }
  function gcSeen() {
    const m = getSeen();
    const t = Date.now();
    let dirty = false;
    for (const k of Object.keys(m)) {
      if (t - m[k] > DEDUPE_TTL_MS) { delete m[k]; dirty = true; }
    }
    if (dirty) setSeen(m);
  }

  async function flush() {
    gcSeen();
    let q = getQueue();
    if (!q.length) return;

    const batch = q.slice(0, BATCH_SIZE);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(batch),
        keepalive: true
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json().catch(() => ({}));
      // success → drop sent items
      q = getQueue().slice(batch.length);
      setQueue(q);
    } catch (err) {
      // keep queue; back off naturally (we also flush on next triggers)
    }
  }

  function enqueue(ev) {
    // normalize + default user
    const e = {
      type: String(ev.type || "").trim(),
      path: ev.path || location.pathname,
      payload: ev.payload || null,
      user_id: ev.user_id || "anon",
      ts: ev.ts || nowIso()
    };
    if (!e.type) return;

    // dedupe
    const seen = getSeen();
    const k = sig(e);
    const t = Date.now();
    if (seen[k] && (t - seen[k] <= DEDUPE_TTL_MS)) return; // skip duplicate
    seen[k] = t; setSeen(seen);

    const q = getQueue();
    q.push(e);
    setQueue(q);
  }

  // public API
  const cmg = (window.cmg = window.cmg || {});
  cmg.logEvent = (type, payload = null, opts = {}) => {
    enqueue({ type, payload, path: opts.path, user_id: opts.user_id, ts: opts.ts });
    // fire-and-forget flush; not awaited to keep UI snappy
    flush();
  };
  cmg.flushEvents = flush;

  // auto behaviors
  window.addEventListener("online", flush);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });

  // send a pageview on first load of the page (deduped by signature)
  cmg.logEvent("pageview", { href: location.href, ref: document.referrer || null });
})();
