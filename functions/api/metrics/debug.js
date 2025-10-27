// functions/api/metrics/debug.js
import { logRequest } from "../../_lib/logger.js";

export async function onRequestGet(context) {
  const { env, request } = context;
  const started = Date.now();
  let status = 200;
  let errorMsg = null;

  const out = {
    ok: true,
    hasDbBinding: !!env.cmg_db,
    dbBindingType: typeof env.cmg_db,
    tables: null,
    error: null
  };

  try {
    if (!env.cmg_db) throw new Error("env.cmg_db is undefined (check Pages → Settings → Bindings).");

    const { results } = await env.cmg_db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY 1")
      .all();

    out.tables = results.map(r => r.name);
  } catch (e) {
    status = 500;
    errorMsg = e?.message || String(e);
    out.ok = false;
    out.error = errorMsg;
  } finally {
    await logRequest(env, request, {
      status,
      durationMs: Date.now() - started,
      error: errorMsg,
      meta: { route: "/api/metrics/debug" }
    });
  }

  return new Response(JSON.stringify(out, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}
