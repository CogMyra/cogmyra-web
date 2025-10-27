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
    // Discover the schema of `artifacts`
    const { results: cols = [] } = await env.cmg_db
      .prepare(`PRAGMA table_info('artifacts')`)
      .all();

    if (!cols.length) {
      return new Response(`error,${JSON.stringify("Table 'artifacts' not found")}`, { status: 500 });
    }

    const columnNames = new Set(cols.map(c => c.name));

    // Columns we prefer to include, if present
    const required = ["id", "user_id", "created_at"].filter(c => columnNames.has(c));
    const optionalOrder = ["type", "title", "tags", "payload", "content"]; // include only if present
    const optionals = optionalOrder.filter(c => columnNames.has(c));

    // Build SELECT list, shortening large text columns if they exist
    const selectPieces = [];
    const header = [];

    for (const c of required) {
      selectPieces.push(c);
      header.push(c);
    }
    for (const c of optionals) {
      if (c === "payload" || c === "content") {
        selectPieces.push(`substr(${c}, 1, 2000) AS ${c}`);
      } else {
        selectPieces.push(c);
      }
      header.push(c);
    }

    // If nothing from the preferred list exists, fall back to all columns
    if (!selectPieces.length) {
      const allCols = cols.map(c => c.name);
      selectPieces.push(allCols.join(", "));
      header.push(...allCols);
    }

    const hasCreatedAt = columnNames.has("created_at");
    const where  = hasCreatedAt ? `WHERE created_at >= DATE('now', ?1)` : "";
    const order  = hasCreatedAt ? `created_at` : `rowid`; // fall back to rowid if created_at not present

    const sql = `
      SELECT ${selectPieces.join(", ")}
      FROM artifacts
      ${where}
      ORDER BY ${order} DESC
      LIMIT ?${hasCreatedAt ? "2" : "1"};
    `.trim();

    const params = hasCreatedAt ? [`-${days} days`, limit] : [limit];

    const { results = [] } = await env.cmg_db.prepare(sql).bind(...params).all();

    // If header is empty (extreme fallback), derive from first row
    if (!header.length && results[0]) {
      header.push(...Object.keys(results[0]));
    }

    const rows = [toCSVRow(header)];
    for (const r of results) rows.push(toCSVRow(header.map(h => r[h])));

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
