export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const data = await request.json();

    // Basic example: log event to D1
    await env.CMG_DB.prepare(
      `INSERT INTO events (id, user_id, type, payload, created_at)
       VALUES (uuid(), ?1, ?2, ?3, datetime('now'))`
    ).bind(data.cmg_uid, data.type, JSON.stringify(data.payload)).run();

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
