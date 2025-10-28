// functions/api/metrics.js
// Route: GET /api/metrics
// Requires a D1 binding named `cmg_db` in Cloudflare Pages → Settings → Bindings

export async function onRequestGet({ env }) {
  // Surface binding misconfig quickly
  if (!env.cmg_db) {
    return json({ error: "Missing D1 binding 'cmg_db'" }, 500);
  }

  // Helper to run a query and return array results safely
  async function q(sql, ...params) {
    const stmt = env.cmg_db.prepare(sql);
    const bound = params.length ? stmt.bind(...params) : stmt;
    const { results } = await bound.all();
    return results ?? [];
  }

  try {
    // 1) Daily summary (dau + total events), last 14 days
    const daily = await q(`
      SELECT
        date(created_at) AS date,
        COUNT(DISTINCT user_id) AS dau,
        COUNT(*) AS total_events
      FROM events
      GROUP BY date
      ORDER BY date DESC
      LIMIT 14
    `);

    // 2) Top modes from JSON payload (where present)
    const topModes = await q(`
      SELECT
        json_extract(payload, '$.mode') AS mode,
        COUNT(*) AS count
      FROM events
      WHERE json_extract(payload, '$.mode') IS NOT NULL
      GROUP BY mode
      ORDER BY count DESC
      LIMIT 10
    `);

    // 3) Most visited paths
    const topPaths = await q(`
      SELECT
        path,
        COUNT(*) AS count
      FROM events
      WHERE path IS NOT NULL
      GROUP BY path
      ORDER BY count DESC
      LIMIT 10
    `);

    // Shape stable API
    const body = {
      daily_summary: daily.map(r => ({
        date: r.date,
        dau: Number(r.dau ?? 0),
        total_events: Number(r.total_events ?? 0),
      })),
      top_modes: topModes.map(r => ({
        mode: r.mode ?? null,
        count: Number(r.count ?? 0),
      })),
      top_paths: topPaths.map(r => ({
        path: r.path ?? null,
        count: Number(r.count ?? 0),
      })),
      generated_at: new Date().toISOString(),
    };

    return json(body, 200, {
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
    });
  } catch (err) {
    return json(
      { error: "metrics_failed", message: err?.message || String(err) },
      500
    );
  }
}

/* ---------- tiny helper ---------- */
function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...extra,
    },
  });
}
