// GET /api/metrics/export/events.csv

function toCSVRow(values) {
  return values
    .map((v) => {
      if (v === null || v === undefined) return "";
      const s = String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    })
    .join(",");
}

export async function onRequestGet({ env, request }) {
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

  try {
    const { results = [] } = await env.cmg_db.prepare(sql).bind(...params).all();
    const header = ["id","user_id","type","payload","created_at"];
    const rows = [header.join(",")];
    for (const r of results) rows.push(toCSVRow([r.id, r.user_id, r.type, r.payload, r.created_at]));

    return new Response(rows.join("\n"), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="events_last_${days}d.csv"`,
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    return new Response(`error,${JSON.stringify(err.message)}`, { status: 500 });
  }
}
