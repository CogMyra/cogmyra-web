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

async function getTableColumns(db, table) {
  const { results = [] } = await db.prepare(`PRAGMA table_info('${table}')`).all();
  return results.map(r => r.name);
}

function buildSelectPieces(existing, wantedInOrder) {
  const have = new Set(existing);
  const pieces = [];
  const header = [];

  for (const col of wantedInOrder) {
    if (!have.has(col)) continue;
    if (col === "content" || col === "payload") {
      pieces.push(`substr(${col}, 1, 2000) AS ${col}`);
    } else {
      pieces.push(col);
    }
    header.push(col);
  }

  // if nothing matched, fall back to selecting whatever exists
  if (pieces.length === 0) {
    pieces.push(existing.join(", "));
    header.push(...existing);
  }

  return { selectSQL: pieces.join(", "), header };
}

export async function onRequestGet({ env, request }) {
  const db = env.cmg_db;                 // <-- bound name in Cloudflare Pages
  const url = new URL(request.url);
  const days  = Math.max(1, Math.min(90,  Number(url.searchParams.get("days"))  || 30));
  const limit = Math.max(1, Math.min(5000, Number(url.searchParams.get("limit")) || 2000));

  try {
    // ensure table exists & discover columns
    const cols = await getTableColumns(db, "artifacts");
    if (!cols.length) {
      return new Response(`error,"Table 'artifacts' not found"`, { status: 404 });
    }

    // include only columns that actually exist (order is our preference)
    const preferredOrder = ["id","user_id","type","title","content","created_at","tags"];
    const { selectSQL, header } = buildSelectPieces(cols, preferredOrder);

    const hasCreatedAt = cols.includes("created_at");
    const whereSQL = hasCreatedAt ? `WHERE created_at >= DATE('now', ?1)` : ``;
    const params = hasCreatedAt ? [`-${days} days`, limit] : [limit];

    const sql = `
      SELECT ${selectSQL}
      FROM artifacts
      ${whereSQL}
      ORDER BY rowid DESC
      LIMIT ?${hasCreatedAt ? 2 : 1};
    `;

    const { results = [] } = await db.prepare(sql).bind(...params).all();

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
    return new Response(`error,${JSON.stringify(String(err && err.message || err))}`, { status: 500 });
  }
}
