export async function onRequestGet(context) {
  try {
    const ts = new Date().toISOString();
    return new Response(JSON.stringify({ ok: true, ts }), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
