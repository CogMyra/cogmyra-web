import { v4 as uuidv4 } from "uuid";

export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    const data = await request.json();
    const { cmg_uid, type, payload } = data;

    // === Always log the event itself ===
    await env.CMG_DB.prepare(
      `INSERT INTO events (id, user_id, type, payload, created_at)
       VALUES (uuid(), ?1, ?2, ?3, datetime('now'))`
    ).bind(cmg_uid, type, JSON.stringify(payload)).run();

    // === If this is a completed mode output, save to artifacts ===
    if (type === "mode.completed" && payload && payload.output) {
      const artifactId = uuidv4();
      const title = payload.output.title || `Artifact ${new Date().toISOString()}`;
      const tags = Array.isArray(payload.output.tags)
        ? payload.output.tags.join(",")
        : null;
      const content = JSON.stringify(payload.output);

      await env.CMG_DB.prepare(
        `INSERT INTO artifacts (id, user_id, title, tags, content, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, datetime('now'))`
      ).bind(artifactId, cmg_uid, title, tags, content).run();

      console.log("Artifact saved:", artifactId);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
