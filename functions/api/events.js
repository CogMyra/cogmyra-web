// functions/api/events.js
// Temporary stub endpoint so the build succeeds.
// You can wire this up to real logging later.

export async function onRequestPost(context) {
  try {
    // Try to read JSON, but we don't actually use it yet
    try {
      await context.request.json();
    } catch {
      // If there is no JSON body, that's fine for now
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Invalid JSON", details: String(err) }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
