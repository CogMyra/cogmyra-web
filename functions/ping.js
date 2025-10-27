// GET /ping  (no DB, no env needed — always returns plain text)
export async function onRequest() {
  return new Response("pong", { headers: { "content-type": "text/plain" } });
}
