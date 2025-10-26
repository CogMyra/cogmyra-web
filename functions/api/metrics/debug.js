export async function onRequestGet({ env }) {
  try {
    const summary = {
      ok: true,
      hasEnv: !!env,
      hasCmgDb: !!env?.cmg_db,
      typeOfCmgDb: typeof env?.cmg_db,
      // show a few binding names so we know we're reading env
      envKeysSample: env ? Object.keys(env).sort().slice(0, 10) : []
    };

    return new Response(JSON.stringify(summary, null, 2), {
      headers: { "content-type": "application/json" }
    });
  } catch (err) {
    // If anything goes wrong, we still return visible text
    return new Response(`debug error:\n${err?.stack || err}`, {
      status: 500,
      headers: { "content-type": "text/plain" }
    });
  }
}
