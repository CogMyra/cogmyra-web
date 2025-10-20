export async function onRequestGet(context) {
  const { env } = context;

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

  const modesSql = `
    SELECT
      COALESCE(payload->>'mode', type) AS mode,
      COUNT(*) AS count
    FROM events
    WHERE created_at >= DATE('now', '-30 days')
      AND (type = 'mode.selected' OR payload->>'mode' IS NOT NULL)
    GROUP BY mode
    ORDER BY count DESC
    LIMIT 10;
  `;

  try {
    const { results: daily } = await env.CMG_DB.prepare(dailySql).all();
    const { results: modes } = await env.CMG_DB.prepare(modesSql).all();

    return new Response(
      JSON.stringify({
        daily_summary: daily ?? [],
        top_modes: modes ?? [],
        generated_at: new Date().toISOString(),
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
