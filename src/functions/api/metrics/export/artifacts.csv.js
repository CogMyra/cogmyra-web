function toCSVRow(values) {
  return values
    .map((v) => {
      if (v === null || v === undefined) return "";
      const s = String(v);
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    })
    .join(",");
}

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);

  const days  = Math.max(1, Math.min(90,  Number(url.searchParams.get("days"))  || 30));
  const limit = Math.max(1, Math.min(5000, Number(url.searchParams.get("limit")) || 2000));

  const sql = `
    SELECT
      id,
      user_id,
      title AS type,
      substr(content, 1, 2000) AS payload,
      created_at
    FROM artifacts
    WHERE created_at >= DATE('now', ?1)
    ORDER BY created_at DESC
    LIMIT ?2;
  `;
  const params = [`-${days} days`, limit];

  try {
    const { results = [] } = await env.CMG_DB.prepare(sql).bind(...params).all();

    const header = ["id","user_id","type","payload","created_at"];
    const rows = [toCSVRow(header)];
    for (const r of results) {
      rows.push(toCSVRow([r.id, r.user_id, r.type, r.payload, r.created_at]));
    }

    return new Response(rows.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="artifacts_last_${days}d.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return new Response(`error,${JSON.stringify(err.message)}`, { status: 500 });
  }
}
