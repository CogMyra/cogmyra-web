// GET /api/metrics/export/artifacts.csv

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
  if (!env?.cmg_db) {
    return new Response(
      'error,"cmg_db binding is missing. Check Pages → Settings → Bindings → D1 database name is cmg_db."',
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  const days  = Math.max(1, Math.min(90,  Number(url.searchParams.get("days"))  || 30));
  const limit = Math.max(1, Math.min(5000, Number(url.searchParams.get("limit")) || 2000));

  // Columns that actually exist in your DB: id, user_id, type, content, created_at
  const header = ["id", "user_id", "type", "content", "created_at"];

  const sql = `
    SELECT
      id,
      user_id,
      type,
      substr(content, 1, 2000) AS content,
      created_at
    FROM artifacts
    WHERE created_at >= DATE('now', ?1)
    ORDER BY created_at DESC
    LIMIT ?2;
  `;
  const params = [`-${days} days`, limit];

  try {
    const { results = [] } = await env.cmg_db.prepare(sql).bind(...params).all();

    const rows = [toCSVRow(header)];
    for (const r of results) {
      rows.push(toCSVRow([r.id, r.user_id, r.type, r.content, r.created_at]));
    }

    return new Response(rows.join("\n"), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="artifacts_last_${days}d.csv"`,
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    return new Response(`error,${JSON.stringify(String(err?.message || err))}`, { status: 500 });
  }
}
