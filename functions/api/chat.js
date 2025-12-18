// functions/api/chat.js
// Simple CogMyra Guide API with CORS support for local dev (Vite 5173 ↔ Worker 8789)
// Hardening 7.2: request_id + D1 error_logs observability (non-breaking)

function makeId() {
  // Workers/Pages runtime supports crypto.randomUUID()
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  // fallback (not perfect, but fine for correlation IDs)
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function onRequest({ request, env }) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-request-id",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const requestId = request.headers.get("x-request-id") || makeId();
  const startTime = Date.now();

  const withHeaders = (extra = {}) => ({
    ...corsHeaders,
    "Content-Type": "application/json",
    "x-request-id": requestId,
    ...extra,
  });

  const log = async ({
    level = "info",
    message = "log",
    stack = null,
    metadata = null,
    route = "/api/chat",
    source = "backend",
  }) => {
    try {
      await env.CMG_DB.prepare(`
        INSERT INTO error_logs (
          id,
          timestamp,
          level,
          source,
          request_id,
          route,
          message,
          stack,
          metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        makeId(),
        Date.now(),
        level,
        source,
        requestId,
        route,
        message,
        stack,
        metadata ? JSON.stringify(metadata) : null
      ).run();
    } catch {
      // never break user flow due to logging
    }
  };

  if (request.method !== "POST") {
    await log({
      level: "warn",
      message: "method_not_allowed",
      metadata: { method: request.method },
    });

    return new Response(
      JSON.stringify({ error: "Method not allowed", request_id: requestId }),
      { status: 405, headers: withHeaders() }
    );
  }

  try {
    const body = await request.json().catch(() => null);
    const messages = body?.messages;
    const persona = body?.persona;

    if (!Array.isArray(messages)) {
      await log({
        level: "warn",
        message: "invalid_request_messages_not_array",
        metadata: { hasBody: Boolean(body), messagesType: typeof messages },
      });

      return new Response(
        JSON.stringify({ error: "Invalid request: messages must be an array", request_id: requestId }),
        { status: 400, headers: withHeaders() }
      );
    }

    const systemParts = [
      env.COGMYRA_SYSTEM_PROMPT || "",
      env.TONE || "",
      env.SCAFFOLDING || "",
    ].filter(Boolean);

    let systemText = systemParts.join("\n\n");
    if (persona) systemText += `\n\nCurrent learner persona: ${persona}.`;

    const openaiMessages = [
      { role: "system", content: systemText },
      ...messages,
    ];

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: env.MODEL || "gpt-5.1",
        messages: openaiMessages,
        temperature: 0.4,
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI error:", openaiRes.status, errText);

      await log({
        level: "error",
        message: "upstream_model_error",
        metadata: {
          upstream_status: openaiRes.status,
          upstream_body: (errText || "").slice(0, 4000),
          model: env.MODEL || "gpt-5.1",
        },
      });

      return new Response(
        JSON.stringify({ error: "Upstream model error", status: openaiRes.status, request_id: requestId }),
        { status: 502, headers: withHeaders() }
      );
    }

    const data = await openaiRes.json();
    const choice = data.choices?.[0]?.message;

    const responseBody = {
      message: choice || { role: "assistant", content: "Sorry, I had trouble replying just now." },
      usage: data.usage || null,
      meta: { model: data.model || env.MODEL || "gpt-5.1", promptVersion: "v1.0" },
      request_id: requestId,
    };

    const duration = Date.now() - startTime;

    await log({
      level: "info",
      message: "request_completed",
      metadata: {
        duration_ms: duration,
        upstream_status: 200,
        model: data.model || env.MODEL || "gpt-5.1",
        persona: persona || null,
      },
    });

    return new Response(JSON.stringify(responseBody), { status: 200, headers: withHeaders() });

  } catch (err) {
    console.error("CogMyra /api/chat error:", err);

    const duration = Date.now() - startTime;
    await log({
      level: "error",
      message: "internal_server_error",
      stack: err?.stack || null,
      metadata: { duration_ms: duration, error_message: err?.message || "unknown_error" },
    });

    return new Response(
      JSON.stringify({ error: "Internal server error", request_id: requestId }),
      { status: 500, headers: withHeaders() }
    );
  }
}
