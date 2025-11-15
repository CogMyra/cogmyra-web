// functions/api/uptime.js
// Works two ways:
// 1) Scheduled by Pages Cron (*/5 in _routes.json)
// 2) Manual GET at /api/uptime?test=1 for quick verification

async function runPing(env) {
  const url = "https://cogmyra-web.pages.dev/api/ping";
  const ts = new Date().toISOString();
  let ok = false, status = 0, errMsg = null;

  try {
    const res = await fetch(url, { cf: { cacheTtl: 0 } });
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

  const msg = `[uptime] ${ts} -> ${url} : ${ok ? "OK" : "FAIL"} ${status}`;
  console.log(msg);

  return { ok, status, ts, msg };
}

export default {
  // Cron trigger handler (required for schedules in _routes.json)
  async scheduled(event, env, ctx) {
    await runPing(env);
  },

  // Manual GET so you can test in a browser (returns JSON)
  async onRequestGet({ env }) {
    const result = await runPing(env);
    return new Response(JSON.stringify(result), {
      status: result.ok ? 200 : 500,
      headers: { "content-type": "application/json" }
    });
  },
};
