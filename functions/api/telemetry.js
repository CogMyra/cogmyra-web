// functions/api/telemetry.js
// Telemetry API stub for CogMyra – returns basic shape for the dashboard.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-app-key",
};

export async function onRequest({ request }) {
  const method = request.method || "GET";

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (method !== "GET") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  // TEMP: static stub data – just enough to light up the UI.
  const now = new Date().toISOString();

  const payload = {
    totalRequests: 0,
    averageLatencyMs: null,
    errorCount: 0,
    recent: [],
    generatedAt: now,
  };

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
    },
  });
}
