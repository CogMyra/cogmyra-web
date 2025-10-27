// functions/api/metrics/export/events.csv.js
import { logRequest } from "../../../_lib/logger.js";

function toCSVRow(values) {
  return values
    .map((v) => {
      if (v === null || v === undefined) return "";
      const s = String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    })
    .join(",");
}

export async function onRequestGet(context) {
  const { env, request } = context;
  const started = Date.now();
  let status = 200;
  let errorMsg = null;

  try {
    const url = new URL(request.url);
    const days  = Math.max(1, Math.min(90,  Number(url.searchParams.get("days"))  || 30));
    const limit = Math.max(1, Math.min(5000, Number(url.searchParams.get("limit")) || 2000));

    const sql = `
      SELECT
        id,
        user_id,
        type,
        substr(payload, 1, 2000) AS payload,
        created_at
      FROM events
      WHERE created_at >= DATE('now', ?1)
      ORDER BY created_at DESC
      LIMIT ?2;
    `;
    const params = [`-${days} days`, limit];

    const { results = [] } = await env.cmg_db.prepare(sql).bind(...params).all();

    const header = ["id", "user_id", "type", "payload", "created_at"];
    const rows = [toCSVRow(header)];
    for (const r of results) rows.push(toCSVRow([r.id, r.user_id, r.type, r.payload, r.created_at]));

    return new Response(rows.join("\n"), {
      status,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="events_last_${days}d.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    status = 500;
    errorMsg = e?.message || String(e);
    return new Response(`error,${JSON.stringify(errorMsg)}`, { status });
  } finally {
    await logRequest(env, request, {
      status,
      durationMs: Date.now() - started,
      error: errorMsg,
      meta: { route: "/api/metrics/export/events.csv" }
    });
  }
}
