// functions/api/metrics.js
// Cloudflare Pages Function: GET /api/metrics/summary
// Requires a D1 binding named `cmg_db` in Pages settings

export async function onRequestGet(context) {
  const { env } = context;

  async function q(sql, ...params) {
    const stmt = env.cmg_db.prepare(sql);
    const bound = params.length ? stmt.bind(...params) : stmt;
    const { results } = await bound.all();
    return results ?? [];
  }

  try {
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

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
        "access-control-allow-origin": "*",
      },
    });
  } catch (err) {
    const problem = {
      error: "metrics_failed",
      message: err?.message || String(err),
    };
    return new Response(JSON.stringify(problem), {
      status: 500,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }
}
