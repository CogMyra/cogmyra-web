export async function onRequestGet({ env }) {
  const out = {
    ok: true,
    hasDbBinding: !!env.cmg_db,              // must be true
    dbBindingType: typeof env.cmg_db,        // should be "object"
    envKeysSample: Object.keys(env).sort().slice(0, 20),
    tables: null,
    error: null
  };

  try {
    if (!env.cmg_db) throw new Error("env.cmg_db is undefined (check the binding name in Cloudflare Pages → Settings → Bindings).");

    // List tables so we know we can talk to the DB
    const { results } = await env.cmg_db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY 1")
      .all();

    out.tables = results.map(r => r.name);
  } catch (e) {
    out.error = String(e && e.message || e);
  }

  return new Response(JSON.stringify(out, null, 2), {
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
