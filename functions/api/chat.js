// functions/api/chat.js
// CogMyra Engine v1: Chat endpoint with CMG prompt + basic telemetry.

import { OpenAI } from "openai";
import { CMG_SYSTEM_PROMPT, CMG_PROMPT_VERSION } from "../cmgPrompt.js";
import { pushTelemetry } from "../telemetryStore.js";

// --- CORS headers (for browser + local dev) ---
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-app-key",
};

// Small helper: JSON response with CORS
function jsonResponse(body, init = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...CORS_HEADERS,
    ...(init.headers || {}),
  };

  return new Response(JSON.stringify(body), {
    ...init,
    headers,
  });
}

// --- Auth gate helper ---
function checkAuth(request, env) {
  const gateKey = env.APP_GATE_KEY;
  // If no gate key configured, allow all (dev-friendly)
  if (!gateKey) return true;

  const headerKey = request.headers.get("x-app-key");
  if (!headerKey || headerKey !== gateKey) return false;
  return true;
}

// --- Client IP helper (for telemetry only) ---
function getClientIp(request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// --- Main handler ---
export async function onRequest({ request, env }) {
  const start = Date.now();
  const ip = getClientIp(request);
  let telemetryStatus = "ok";
  let telemetryError = null;

  try {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return jsonResponse(
        { error: "Method not allowed. Use POST." },
        { status: 405 }
      );
    }

    // Basic auth gate
    if (!checkAuth(request, env)) {
      telemetryStatus = "unauthorized";
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (err) {
      telemetryStatus = "bad_request";
      telemetryError = "invalid_json";
      return jsonResponse(
        { error: "Invalid JSON body in request." },
        { status: 400 }
      );
    }

    const { messages, persona } = body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      telemetryStatus = "bad_request";
      telemetryError = "missing_messages";
      return jsonResponse(
        { error: "Request must include a non-empty 'messages' array." },
        { status: 400 }
      );
    }

    // OpenAI client
    const client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });

    const model = env.MODEL || "gpt-5.1-mini";

    // Build full message list with CMG system prompt at the front
    const systemPrefix = `
You are the CogMyra Guide (CMG).

Runtime config:
- Prompt version: ${CMG_PROMPT_VERSION}
- Persona (if provided by UI): ${persona || "none"}

Follow the system prompt below exactly.
---
${CMG_SYSTEM_PROMPT}
`.trim();

    const finalMessages = [
      { role: "system", content: systemPrefix },
      ...messages,
    ];

    // Call OpenAI (non-streaming)
    const completion = await client.chat.completions.create({
      model,
      messages: finalMessages,
      // New API uses max_completion_tokens instead of max_tokens
      max_completion_tokens: 512,
      temperature: 0.4,
    });

    const choice = completion.choices?.[0];
    const assistantMessage = choice?.message;
    const latencyMs = Date.now() - start;

    // Push telemetry (best-effort; don't block response on errors)
    try {
      await pushTelemetry(env, {
        kind: "chat_request",
        createdAt: new Date().toISOString(),
        ip,
        persona: persona || null,
        status: telemetryStatus,
        error: telemetryError,
        latencyMs,
        model,
        totalTokens: completion.usage?.total_tokens ?? null,
      });
    } catch (err) {
      console.error("Telemetry push failed:", err);
    }

    return jsonResponse(
      {
        message: assistantMessage,
        usage: completion.usage || null,
        meta: {
          model,
          promptVersion: CMG_PROMPT_VERSION,
          latencyMs,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chat handler error:", error);
    const latencyMs = Date.now() - start;
    telemetryStatus = "error";
    telemetryError =
      error && typeof error === "object" && "code" in error
        ? error.code || "unknown"
        : "unknown";

    try {
      await pushTelemetry(env, {
        kind: "chat_request",
        createdAt: new Date().toISOString(),
        ip,
        persona: null,
        status: telemetryStatus,
        error: telemetryError,
        latencyMs,
        model: env.MODEL || "gpt-5.1-mini",
        totalTokens: null,
      });
    } catch (err) {
      console.error("Telemetry push failed (error path):", err);
    }

    return jsonResponse(
      {
        error: "Unexpected error while processing chat request.",
      },
      { status: 500 }
    );
  }
}
