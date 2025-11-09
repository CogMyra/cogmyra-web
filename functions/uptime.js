// functions/uptime.js
// GET handler (manual) + scheduled handler (cron)

const TARGET = "https://cogmyra-web.pages.dev/api/ping";

async function runCheck(env) {
  const ts = new Date().toISOString();
  let status = 0, ok = false, errMsg = null;

  try {
    const res = await fetch(TARGET, { cf: { cacheTtl: 0, cacheEverything: false } });
    status = res.status;
    ok = res.ok;
  } catch (err) {
    errMsg = String(err && err.message ? err.message : err);
  }

  // log to console (shows in Observability logs)
  console.log(`[Uptime] ${ts} -> ${TARGET} : ${status} ${ok ? "OK" : "FAIL"} ${errMsg ? `(${errMsg})` : ""}`);

  // optional: persist to D1 if bound
  try {
    if (env.cmg_db) {
      await env.cmg_db
        .prepare(
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
    }
  } catch (d1Err) {
    console.log(`[Uptime] D1 insert error: ${d1Err}`);
  }

  return { ok, status, ts, err: errMsg };
}

// ---- HTTP GET: /uptime (manual test) ----
export async function onRequestGet({ env }) {
  const result = await runCheck(env);
  return new Response(JSON.stringify(result), {
    headers: { "content-type": "application/json" },
    status: result.ok ? 200 : 502,
  });
}

// ---- Cron trigger (scheduled) ----
export default {
  async scheduled(_event, env, _ctx) {
    await runCheck(env);
  },
};
