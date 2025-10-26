export async function onRequestGet({ env }) {
  return new Response(
    JSON.stringify({
      hasEnv: !!env,
      hasCmgDb: !!env?.cmg_db,
      typeOfCmgDb: typeof env?.cmg_db
    }, null, 2),
    { headers: { "content-type": "application/json" } }
  );
}
