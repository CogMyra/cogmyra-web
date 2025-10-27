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
  const url = new URL(request.url);

  const days  = Math.max(1, Math.min(90,  Number(url.searchParams.get("days"))  || 30));
  const limit = Math.max(1, Math.min(5000, Number(url.searchParams.get("limit")) || 2000));

  try {
    // 1) Discover actual columns
    const { results: cols } = await env.cmg_db
      .prepare(`PRAGMA table_info('artifacts')`)
      .all();

    const columnNames = new Set(cols.map(c => c.name));

    // Always include these if present (most schemas have them)
    const required = ["id", "user_id", "created_at"].filter(c => columnNames.has(c));

    // Optional columns we’ll include only if they exist
    const optional = [];
    if (columnNames.has("type"))   optional.push("type");
    if (columnNames.has("title"))  optional.push("title");
    if (columnNames.has("tags"))   optional.push("tags");
    if (columnNames.has("content")) optional.push("content");

    // If content exists, shorten it for CSV
    const selectPieces = [];
    for (const c of required) selectPieces.push(c);
    for (const c of optional) {
      if (c === "content") {
        selectPieces.push(`substr(content, 1, 2000) AS content`);
      } else {
        selectPieces.push(c);
      }
    }

    // If somehow id/user_id/created_at don’t exist, still build something usable
    if (selectPieces.length === 0) {
      // Fallback to selecting whatever exists
      selectPieces.push(cols.map(c => c.name).join(", "));
    }

    const selectList = selectPieces.join(", ");

    const sql = `
      SELECT ${selectList}
      FROM artifacts
      WHERE created_at >= DATE('now', ?1)
      ORDER BY created_at DESC
      LIMIT ?2;
    `;
    const params = [`-${days} days`, limit];

    const { results = [] } = await env.cmg_db.prepare(sql).bind(...params).all();

    // CSV header = selected columns (preserve order)
    const header = [];
    for (const c of required) header.push(c);
    for (const c of optional) header.push(c);
    if (header.length === 0) {
      // fallback: whatever came back from DB row
      if (results[0]) Object.keys(results[0]).forEach(k => header.push(k));
    }

    const rows = [toCSVRow(header)];
    for (const r of results) {
      rows.push(toCSVRow(header.map(h => r[h])));
    }

    return new Response(rows.join("\n"), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="artifacts_last_${days}d.csv"`,
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    return new Response(`error,${JSON.stringify(String(err))}`, { status: 500 });
  }
}
