// functions/api/telemetry.js
// Dev telemetry API for Phase 8 dashboard.
// Reads from in-memory TELEMETRY_EVENTS (current dev session only).

import { TELEMETRY_EVENTS } from "../telemetryStore.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, x-app-key",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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

  // Use a simple 1-hour window for the summary.
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const cutoff = now - windowMs;

  const events = TELEMETRY_EVENTS.filter((e) => {
    const ts = Date.parse(e.ts);
    return !Number.isNaN(ts) && ts >= cutoff;
  });

  const chatEvents = events.filter((e) => e.type === "chat");
  const errorEvents = events.filter(
    (e) => e.type === "chat_error" || (e.status && e.status >= 400)
  );

  const averageLatencyMs =
    chatEvents.length > 0
      ? Math.round(
          chatEvents.reduce((sum, e) => sum + (e.latencyMs || 0), 0) /
            chatEvents.length
        )
      : null;

  const recent = events
    .slice(-20)
    .reverse()
    .map((e) => ({
      ts: e.ts,
      type: e.type,
      status: e.status,
      latencyMs: e.latencyMs ?? null,
      persona: e.persona ?? null,
      promptVersion: e.promptVersion ?? null,
      error: e.error ?? null,
    }));

  const payload = {
    totalRequests: chatEvents.length,
    averageLatencyMs,
    errorCount: errorEvents.length,
    recent,
    generatedAt: new Date().toISOString(),
  };

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
    },
  });
}
