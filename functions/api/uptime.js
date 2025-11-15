// functions/api/uptime.js

const PING_URL = "https://cogmyra-web.pages.dev/api/ping";

async function runPing(env) {
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
  } catch (_) {}

  return { ok, status, ts };
}

// Manual GET so you can hit /api/uptime?test=1
export async function onRequestGet({ env }) {
  const result = await runPing(env);
  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 500,
    headers: { "content-type": "application/json" }
  });
}

// Cron handler used by _routes.json
export async function scheduled(event, env, ctx) {
  await runPing(env);
}
