// functions/api/metrics/summary.js
import { logRequest } from "../../_lib/logger.js";

export async function onRequestGet(context) {
  const { env, request } = context;
  const started = Date.now();
  let status = 200;
  let errorMsg = null;

  try {
    // daily_summary view: date, dau, total_events
    const { results: daily = [] } =
      await env.cmg_db.prepare("SELECT date, dau, total_events FROM daily_summary ORDER BY date DESC LIMIT 14").all();

    // top_modes view: mode, count
    const { results: modes = [] } =
      await env.cmg_db.prepare("SELECT mode, count FROM top_modes ORDER BY count DESC LIMIT 10").all();

    const out = {
      daily_summary: daily,
      top_modes: modes,
      generated_at: new Date().toISOString()
    };

    return new Response(JSON.stringify(out), {
      status,
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
    });
  } catch (e) {
    status = 500;
    errorMsg = e?.message || String(e);
    return new Response(JSON.stringify({ error: errorMsg }), {
      status,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  } finally {
    await logRequest(env, request, {
      status,
      durationMs: Date.now() - started,
      error: errorMsg,
      meta: { route: "/api/metrics/summary" }
    });
  }
}
