import { CMG_SYSTEM_PROMPT, CMG_PROMPT_VERSION } from "../cmgPrompt";

function enforceNoMenus(text) {
  if (!text) return text;

  let out = text;

  // Hard-ban common menu patterns
  out = out.replace(/\n\s*[A-C]\)\s.*(\n\s*[A-C]\)\s.*)*/g, ""); // strips A) B) C) blocks
  out = out.replace(/\n\s*-\s*[A-C]\)\s.*(\n\s*-\s*[A-C]\)\s.*)*/g, ""); // strips dashed A)/B)/C)
  out = out.replace(/\n\s*What would you like next\??.*$/gim, ""); // strips "What would you like next"
  out = out.replace(/\n\s*If you tell me.*I can:\s*$/gim, ""); // strips "If you tell me... I can:"

  // Also remove “pick a topic” style prompts (soft menu)
  out = out.replace(
    /What would you like to work on today\s*—.*\?/gi,
    "What are you working on right now?"
  );

  return out.trim();
}

// functions/api/chat.js
// CogMyra Guide API with CORS + request_id + optional D1 logging (CMG_DB)

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    // IMPORTANT: allow client/server to send/receive x-request-id
    "Access-Control-Allow-Headers": "Content-Type, X-Request-Id",
  };
}

function withRequestIdHeaders(headersObj, requestId) {
  return {
    ...headersObj,
    "Content-Type": "application/json",
    "X-Request-Id": requestId,
  };
}

function getRequestId(request) {
  // Cloudflare normalizes header lookups; still handle both casings safely
  return (
    request.headers.get("x-request-id") ||
    request.headers.get("X-Request-Id") ||
    (globalThis.crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()))
  );
}

async function logToD1(env, row) {
  // Never break the API if DB binding is missing
  if (!env || !env.CMG_DB) return;

  try {
    await env.CMG_DB.prepare(
      `INSERT INTO error_logs (
        id, timestamp, level, source, request_id, route, message, stack, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        crypto.randomUUID(),
        Date.now(),
        row.level,
        row.source,
        row.request_id || null,
        row.route || null,
        row.message,
        row.stack || null,
        row.metadata || null
      )
      .run();
  } catch (e) {
    // Swallow logging errors; do not affect user traffic
    console.error("D1 log insert failed:", e);
  }
}

export async function onRequest({ request, env }) {
  const baseCors = corsHeaders();
  const requestId = getRequestId(request);
  const startTime = Date.now();

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        ...baseCors,
        "X-Request-Id": requestId,
      },
    });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: withRequestIdHeaders(baseCors, requestId),
    });
  }

  try {
    const body = await request.json().catch(() => null);
    const messages = body?.messages;
    const persona = body?.persona;

    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request: messages must be an array" }),
        {
          status: 400,
          headers: withRequestIdHeaders(baseCors, requestId),
        }
      );
    }

// Build system prompt from source-controlled CMG prompt (canonical)
const systemParts = [
  CMG_SYSTEM_PROMPT,
  env.TONE || "",
  env.SCAFFOLDING || "",
].filter(Boolean);

let systemText = systemParts.join("\n\n");
if (persona) {
  systemText += `\n\nCurrent learner persona: ${persona}.`;
}

const openaiMessages = [
  { role: "system", content: systemText },
  ...messages,
];

// ------------------------------
// CRITICAL BEHAVIOR OVERRIDES
// ------------------------------
systemText += `

EMOTIONAL FRAMING — DO NOT ASSUME STRUGGLE
- Never assume the learner is struggling, anxious, confused, behind, or afraid unless they explicitly say so.
- Do NOT preemptively reassure with phrases like:
  “It’s okay if this feels hard”
  “Lots of people struggle with this”
  “Don’t worry”
  “This might feel scary”
- If the learner expresses neutral or positive intent (e.g., “I want to learn…”, “Can you show me…”, “I’d like help with…”),
  respond with confident, forward-moving instruction.
- Only provide reassurance or normalization when the learner explicitly signals difficulty.
- Default stance: curiosity, momentum, capability — not remediation.

CRITICAL RESPONSE VARIATION RULE (HIGH PRIORITY)

This rule OVERRIDES all default teaching patterns.

- You MUST NOT reuse a fixed instructional template across turns.
- You MUST NOT default to:
  explain → example → practice → “did that make sense?” → menu

Explicitly prohibited patterns when repeated:
- Ending every response with “Did that make sense?”
- Ending every response with a multi-option A/B/C menu
- Always including an example + practice in the same turn

Required behavior:
- Vary response shape deliberately across turns.
- Choose the response form that best fits the moment, not a template.

Allowed response shapes (rotate them):
- Direct explanation only
- Example-first explanation
- Practice-first without re-explaining
- Analogy or story only
- Short confirmation + forward momentum
- One targeted question (not a menu)
- One next-step instruction

If options were offered recently:
- DO NOT offer options again for several turns.
- Continue the interaction directly instead.

Goal:
Sound like a skilled human educator responding naturally,
not a lesson generator running a loop.

MATH PRECISION (KIDS)
- Use correct, consistent language:
  - “3 × 2” means “3 groups of 2” and equals “2 + 2 + 2”
  - Avoid confusing phrasing like “3 two times” or mismatched addition examples.
- Keep examples concrete and correct before adding any emotional framing.
`;

// Persona context (lightweight, non-intrusive)
if (persona) {
  systemText += `\n\nCurrent learner persona: ${persona}.`;
}

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

      await logToD1(env, {
        level: "error",
        source: "backend",
        request_id: requestId,
        route: "/api/chat",
        message: "upstream_model_error",
        stack: null,
        metadata: JSON.stringify({ status: openaiRes.status, body: errText }),
      });

      return new Response(
        JSON.stringify({
          error: "Upstream model error",
          status: openaiRes.status,
          request_id: requestId,
        }),
        {
          status: 502,
          headers: withRequestIdHeaders(baseCors, requestId),
        }
      );
    }

    const data = await openaiRes.json();
    const choice = data.choices?.[0]?.message;
    const safeContent = enforceNoMenus(choice?.content || "");
  
    const responseBody = {
      message:
        choice || {
          role: "assistant",
          content: "Sorry, I had trouble replying just now.",
        },
      usage: data.usage || null,
      meta: {
        model: data.model || env.MODEL || "gpt-5.1",
        promptVersion: "v1.0",
        request_id: requestId,
      },
    };

    const duration = Date.now() - startTime;

    await logToD1(env, {
      level: "info",
      source: "backend",
      request_id: requestId,
      route: "/api/chat",
      message: "request_completed",
      stack: null,
      metadata: JSON.stringify({ duration_ms: duration }),
    });

    // HARD OUTPUT ENFORCEMENT: strip A/B/C menus + “what next” menu phrasing
    if (responseBody?.message?.content) {
      responseBody = {
        ...responseBody,
        message: {
          ...responseBody.message,
          content: enforceNoMenus(responseBody.message.content),
        },
      };
    }

    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: withRequestIdHeaders(baseCors, requestId),
    });
  } catch (err) {
    console.error("CogMyra /api/chat error:", err);

    await logToD1(env, {
      level: "error",
      source: "backend",
      request_id: requestId,
      route: "/api/chat",
      message: err?.message || "internal_server_error",
      stack: err?.stack || null,
      metadata: null,
    });

    return new Response(
      JSON.stringify({ error: "Internal server error", request_id: requestId }),
      {
        status: 500,
        headers: withRequestIdHeaders(baseCors, requestId),
      }
    );
  }
}
