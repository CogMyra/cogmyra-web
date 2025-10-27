// functions/_lib/logger.js
// Lightweight server logging helper for Cloudflare Pages Functions + D1.
//
// Usage:
//   const start = Date.now();
//   let status = 200, errorMsg = null;
//   try { ... } catch (e) { status = 500; errorMsg = e?.message; throw e; }
//   finally {
//     await logRequest(env, request, { status, durationMs: Date.now() - start, error: errorMsg, meta: { key: "value" } });
//   }

function getClientIP(request) {
  // CF-Connecting-IP is usually present; fall back to empty string
  return request.headers.get("CF-Connecting-IP") || "";
}

function getUA(request) {
  return request.headers.get("User-Agent") || "";
}

export async function logRequest(env, request, { status, durationMs, error = null, meta = null } = {}) {
  try {
    const url = new URL(request.url);
    const method = request.method || "";
    const path = url.pathname || "";
    const ip = getClientIP(request);
    const ua = getUA(request);
    const metaJson = meta ? JSON.stringify(meta).slice(0, 4000) : null;
    const errShort = error ? String(error).slice(0, 500) : null;

    // D1 binding name must be `cmg_db` (as set in Pages → Settings → Bindings)
    await env.cmg_db
      .prepare(
        `INSERT INTO server_logs (method, path, status, duration_ms, ip, user_agent, error, meta)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`
      )
      .bind(method, path, status ?? null, durationMs ?? null, ip, ua, errShort, metaJson)
      .run();
  } catch (e) {
    // Never let logging failures break the request
    // Optionally: console.error("logRequest failed:", e);
  }
}
