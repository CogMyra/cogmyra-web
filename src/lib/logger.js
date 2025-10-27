// src/lib/logger.js
// Queue + dedupe + batching + offline-safe client logger to /api/events

const STORE_KEY = "cmg_evt_q";
const SEEN_KEY  = "cmg_evt_seen";
const BATCH_MAX = 10;           // send when queue hits this size
const BATCH_MS  = 5000;         // or this age
let   ENDPOINT  = "/api/events";

let tick = null;
let sending = false;

// ---------- storage helpers ----------
function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}
function saveJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
function loadQueue() { return loadJSON(STORE_KEY, []); }
function saveQueue(q) { saveJSON(STORE_KEY, q); }

function loadSeen() {
  try { return JSON.parse(sessionStorage.getItem(SEEN_KEY) || "{}"); }
  catch { return {}; }
}
function saveSeen(seen) {
  try { sessionStorage.setItem(SEEN_KEY, JSON.stringify(seen)); } catch {}
}

// ---------- dedupe (5 min window) ----------
function shouldLog(name, fp) {
  if (!fp) return true;
  const now = Date.now();
  const key = `${name}:${fp}`;
  const seen = loadSeen();
  const last = seen[key] || 0;
  if (now - last < 5 * 60 * 1000) return false;
  seen[key] = now;
  saveSeen(seen);
  return true;
}

// ---------- queue / schedule ----------
function enqueue(evt) {
  const q = loadQueue();
  q.push(evt);
  saveQueue(q);
  schedule();
}

function schedule() {
  const q = loadQueue();
  if (q.length >= BATCH_MAX) {
    void flush();
    return;
  }
  if (!tick) {
    tick = setTimeout(() => { tick = null; void flush(); }, BATCH_MS);
  }
}

// ---------- send ----------
async function flush() {
  if (sending) return;
  const q = loadQueue();
  if (q.length === 0) return;

  sending = true;
  saveQueue([]); // optimistic clear; restore on failure

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ events: q })
    });
    if (!res.ok) throw new Error(`POST ${ENDPOINT} -> ${res.status}`);
  } catch (err) {
    // put back if failed
    const cur = loadQueue();
    saveQueue([...q, ...cur]);
  } finally {
    sending = false;
  }
}

function flushBeacon() {
  const q = loadQueue();
  if (q.length === 0) return;
  try {
    const blob = new Blob([JSON.stringify({ events: q })], { type: "application/json" });
    if (navigator.sendBeacon) navigator.sendBeacon(ENDPOINT, blob);
    saveQueue([]);
  } catch {}
}

// ---------- public API ----------
export function initLogger(opts = {}) {
  if (opts.endpoint) ENDPOINT = opts.endpoint;

  // initial pageview
  logEvent("pageview", { path: location.pathname + location.search });

  // JS error hooks (deduped by message/file/line)
  window.addEventListener("error", (e) => {
    const msg = e?.error?.message || e.message || "Error";
    const fp  = `${msg}|${e?.filename || ""}|${e?.lineno || 0}`;
    if (!shouldLog("js.error", fp)) return;
    logEvent("js.error", { message: msg, file: e.filename, line: e.lineno, col: e.colno });
  });

  window.addEventListener("unhandledrejection", (e) => {
    const msg = (e?.reason && (e.reason.message || String(e.reason))) || "Unhandled rejection";
    if (!shouldLog("js.unhandledrejection", msg)) return;
    logEvent("js.unhandledrejection", { message: msg });
  });

  // drain when tab hides
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushBeacon();
  });
  window.addEventListener("pagehide", flushBeacon);
}

export function logEvent(name, data = {}) {
  // Optional caller-supplied dedupe fingerprint
  if (data.dedupe && !shouldLog(name, data.dedupe)) return;

  enqueue({
    name,
    data,
    ts: new Date().toISOString(),
    path: location.pathname + location.search,
    ua: navigator.userAgent
  });
}
