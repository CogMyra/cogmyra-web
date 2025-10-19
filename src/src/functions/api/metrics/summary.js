// src/functions/api/metrics/summary.js
// GET /api/metrics/summary
// Response:
// {
//   daily_summary: [{ date: 'YYYY-MM-DD', dau: number, total_events: number }],
//   top_modes: [{ mode: string, count: number }],
//   generated_at: ISOString
// }

export async function onRequestGet(context) {
  const { env } = context;

  // ---- Daily summary (last 14 days): DAU + total events
  const dailySql = `
    WITH daily AS (
      SELECT
        DATE(created_at) AS d,
        COUNT(*) AS total_events,
        COUNT(DISTINCT user_id) AS dau
      FROM events
      WHERE created_at >= DATE('now', '-14 days')
      GROUP BY DATE(created_at)
    )
    SELECT d AS date, dau, total_events
    FROM daily
    ORDER BY date DESC;
  `;

  // ---- Top modes (last 30 days) from 'mode.selected'
  const modesSql = `
    SELECT
      COALESCE(
        json_extract(payload, '$.mode'),
        json_extract(payload, '$.mode_id')
      ) AS mode,
      COUNT(*) AS count
    FROM events
    WHERE type = 'mode.selected'
      AND created_at >= DATE('now', '-30 days')
      AND mode IS NOT NULL
    GROUP BY mode
    ORDER BY count DESC
    LIMIT 15;
  `;

  try {
    const daily = await env.CMG_DB.prepare(dailySql).all();
    const modes = await env.CMG_DB.prepare(modesSql).all();

    return new Response(
      JSON.stringify({
        daily_summary: daily.results || [],
        top_modes: modes.results || [],
        generated_at: new Date().toISOString(),
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
