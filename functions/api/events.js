// functions/api/events.js
// POST /api/events  → writes rows into D1 `events`
// Each event: { type, path?, payload?, user_id?, ts? }

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      ...extra,
    },
  });
}

// CORS preflight
export async function onRequestOptions() {
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

export async function onRequestPost({ request, env }) {
  if (!env.cmg_db) return json({ error: "Missing D1 binding 'cmg_db'" }, 500);

  // Parse body
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const list = Array.isArray(payload) ? payload : [payload];
  if (!list.length) return json({ error: "Empty payload" }, 400);

  // Request context
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for") ||
    "";
  const ua = request.headers.get("user-agent") || "";

  // Normalize -> rows
  const rows = [];
  for (const ev of list) {
    const type = String(ev?.type || "").trim();
    if (!type) continue;

    rows.push({
      id: crypto.randomUUID(),
      // Default user_id to "anon" to satisfy NOT NULL schema
      user_id: String(ev?.user_id ?? "anon").slice(0, 128),
      type,
      path: ev?.path ? String(ev.path).slice(0, 512) : null,
      ip,
      user_agent: ua.slice(0, 1024),
      payload:
        ev?.payload != null
          ? JSON.stringify(ev.payload).slice(0, 8000)
          : null,
      ts: String(ev?.ts || new Date().toISOString()),
      created_at: new Date().toISOString(),
    });
  }

  if (!rows.length) return json({ error: "No valid events" }, 400);

  // Insert with batch
  const sql = `
    INSERT INTO events (id, user_id, type, path, ip, user_agent, payload, ts, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const stmt = env.cmg_db.prepare(sql);
    const batch = rows.map((r) =>
      stmt.bind(
        r.id,
        r.user_id,
        r.type,
        r.path,
        r.ip,
        r.user_agent,
        r.payload,
        r.ts,
        r.created_at
      )
    );
    await env.cmg_db.batch(batch);
    return json({ ok: true, inserted: rows.length });
  } catch (err) {
    return json(
      { error: "db_insert_failed", message: err?.message || String(err) },
      500
    );
  }
}
