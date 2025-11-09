// functions/uptime.js
// Scheduled function to ping your API and log status

export default {
  async scheduled(event, env, ctx) {
    const url = "https://cogmyra-web.pages.dev/api/ping";
    const ts = new Date().toISOString();

    try {
      const res = await fetch(url);
      const ok = res.ok;
      const status = res.status;
      console.log(`[Uptime] ${ts} - ${url} -> ${status} ${ok ? "✅ OK" : "❌ FAIL"}`);

      await env.cmg_db
        ?.prepare(
          `INSERT INTO server_logs (id, type, path, payload, ts)
           VALUES (?, ?, ?, ?, ?)`
        )
        .bind(
          crypto.randomUUID(),
          ok ? "uptime.ok" : "uptime.fail",
          "/api/ping",
          JSON.stringify({ status, ok }),
          ts
        )
        .run();
    } catch (err) {
      console.log(`[Uptime] ${ts} - ERROR: ${err}`);
    }
  },
};
