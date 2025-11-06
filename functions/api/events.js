// functions/api/events.js
// Accepts JSON object OR array of events and stores into D1 `events` table.
// Each event: { type, path?, payload? (object), user_id? (string), ts? (ISO) }

export async function onRequestPost({ request, env }) {
  const json = (body, status = 200, extra = {}) => new Response(
    JSON.stringify(body),
    { status, headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*", ...extra } }
  );

  if (!env.cmg_db) return json({ error: "Missing D1 binding 'cmg_db'" }, 500);

  // CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type",
        "access-control-max-age": "86400",
      },
    });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const events = Array.isArray(payload) ? payload : [payload];
  if (!events.length) return json({ error: "Empty payload" }, 400);

  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "";
  const userAgent = request.headers.get("user-agent") || "";

  // Validate + normalize
  const rows = [];
  for (const ev of events) {
    const type = String(ev?.type || "").trim();
    if (!type) continue;

    const row = {
      id: crypto.randomUUID(),
      user_id: String(ev?.user_id || "").slice(0, 128) || null,
      type,
      path: String(ev?.path || "").slice(0, 512) || null,
      ip,
      user_agent: userAgent.slice(0, 1024),
      payload: ev?.payload ? JSON.stringify(ev.payload).slice(0, 8000) : null,
      ts: String(ev?.ts || new Date().toISOString()),
      created_at: new Date().toISOString(),
    };
    rows.push(row);
  }

  if (!rows.length) return json({ error: "No valid events" }, 400);

  // Insert (in a transaction)
  const db = env.cmg_db;
  const sql = `
    INSERT INTO events (id, user_id, type, path, ip, user_agent, payload, ts, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const tx = db.transaction(async (d1) => {
      for (const r of rows) {
        await d1.prepare(sql).bind(
          r.id, r.user_id, r.type, r.path, r.ip, r.user_agent, r.payload, r.ts, r.created_at
        ).run();
      }
    });
    await tx();
    return json({ ok: true, inserted: rows.length });
  } catch (err) {
    return json({ error: "db_insert_failed", message: err?.message || String(err) }, 500);
  }
}
