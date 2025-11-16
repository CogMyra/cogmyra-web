// functions/api/uptime.js
// Simple Cloudflare Pages Function for GET /api/uptime

const PING_URL = "https://cogmyra-web.pages.dev/api/ping";

// GET /api/uptime?test=1  (or just /api/uptime)
export async function onRequestGet(context) {
  const ts = new Date().toISOString();
  let ok = false;
  let status = 0;
  let errMsg = null;

  try {
    const res = await fetch(PING_URL, { cf: { cacheTtl: 0 } });
    status = res.status;
    ok = res.ok;
  } catch (err) {
    errMsg = String(err);
  }

  // Best-effort log into D1 (ignore if binding missing)
  try {
    const env = context.env;
    await env.cmg_db?.prepare(
      `INSERT INTO server_logs (id, type, path, payload, ts)
       VALUES (?, ?, ?, ?, ?)`
    )
      .bind(
        crypto.randomUUID(),
        ok ? "uptime.ok" : "uptime.fail",
        "/api/ping",
        JSON.stringify({ status, ok, err: errMsg }),
        ts
      )
      .run();
  } catch (_) {
    // ignore logging errors
  }

  const body = {
    ok,
    status,
    ts,
    err: errMsg,
    msg: `[uptime] ${ts} -> ${PING_URL} : ${ok ? "OK" : "FAIL"} ${status}`,
  };

  return new Response(JSON.stringify(body), {
    status: ok ? 200 : 500,
    headers: { "content-type": "application/json" },
  });
}
