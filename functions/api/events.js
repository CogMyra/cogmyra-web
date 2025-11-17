// functions/api/events.js

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    // TEMP: respond successfully
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }),
    });
  }
}
