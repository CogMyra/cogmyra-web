// functions/api/chat.js
// CogMyra Engine v1: Chat endpoint with CMG retrieval + prompt assembly + structured logging

import { OpenAI } from "openai";

// --- CORS headers (for browser + local dev) ---
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-app-key",
};

// --- tiny logging helper (structured JSON) ---
function logEvent(type, data = {}) {
  try {
    const payload = {
      type,
      ts: new Date().toISOString(),
      ...data,
    };
    // Cloudflare Workers log viewer will show these JSON lines
    console.log(JSON.stringify(payload));
  } catch (err) {
    console.error("logEvent failed:", err);
  }
}

// Helper: retrieve top CMG chunks from Cloudflare Vectorize
async function retrieveCmgContext(env, openai, userText) {
  if (!userText || !userText.trim()) {
    return { context: "", matches: [] };
  }

  // 1. Embed the user query with the SAME model used in ingestion
  const embed = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: userText,
  });

  const vector = embed.data[0].embedding;

  // 2. Query Cloudflare Vectorize (v2 API)
  const body = {
    vector,
    topK: 8,
    returnValues: false,
    returnMetadata: "all",
  };

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/vectorize/v2/indexes/cmg_index/query`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.CF_API_TOKEN}`,
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Vectorize query failed:", res.status, res.statusText, text);
    logEvent("vectorize_error", {
      status: res.status,
      statusText: res.statusText,
      text: text.slice(0, 500),
    });
    // Fail soft: return no context instead of killing chat
    return { context: "", matches: [] };
  }

  const json = await res.json();
  const matches = json.result?.matches ?? [];

  // Build a readable context block for the system prompt
  const context = matches
    .map((m) => {
      const meta = m.metadata || {};
      const source = `${meta.file ?? "unknown"}#${meta.chunk_index ?? "?"}`;
      const text = meta.text ?? "";
      return `Source: ${source}\n${text}`;
    })
    .join("\n\n---\n\n");

  return { context, matches };
}

export async function onRequest({ request, env }) {
  const start = Date.now();

  try {
    const method = request.method || "GET";

    // Handle OPTIONS for CORS
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    if (method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: CORS_HEADERS,
      });
    }

    // Auth gate: require correct x-app-key header
    const appKey = request.headers.get("x-app-key");
    if (!env.APP_GATE_KEY || appKey !== env.APP_GATE_KEY) {
      logEvent("auth_denied", {
        ip: request.headers.get("cf-connecting-ip") || "unknown",
      });
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            ...CORS_HEADERS,
          },
        },
      );
    }

    // Parse incoming body
    const body = await request.json().catch(() => ({}));

    // Expecting either:
    //  - { messages: [...], debug?: boolean }
    // or
    //  - { message: "single user text", debug?: boolean }
    const debug = !!body.debug;
    let messages = body.messages;
    let userText = body.message;

    if (!messages && userText) {
      // Wrap a single message into Chat Completions format
      messages = [{ role: "user", content: userText }];
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No messages provided" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...CORS_HEADERS,
          },
        },
      );
    }

    // Last user message text for retrieval
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const lastUserText =
      typeof lastUser?.content === "string"
        ? lastUser.content
        : Array.isArray(lastUser?.content)
          ? lastUser.content.map((c) => c.text || "").join(" ")
          : "";

    // Init OpenAI client for Workers environment
    const openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });

    // 1) Retrieve CMG context from Vectorize
    const { context: cmgContext, matches } = await retrieveCmgContext(
      env,
      openai,
      lastUserText,
    );

    // 2) Build the combined system prompt
    const baseSystem = env.COGMYRA_SYSTEM_PROMPT || "";

    const cmgKnowledgeBlock = cmgContext
      ? `
# CogMyra Internal Configuration (Retrieved)
You are the CogMyra Guide. The following excerpts are internal configuration and behavior rules. You must treat them as authoritative when deciding how to respond.

${cmgContext}

# End of Retrieved Configuration
`
      : "";

    const systemPrompt = `${baseSystem}\n\n${cmgKnowledgeBlock}`.trim();

    // 3) Call Chat Completions with system + user messages
    const model = env.MODEL || "gpt-5.1";

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    const latencyMs = Date.now() - start;

    const assistantMessage = completion.choices[0]?.message ?? {
      role: "assistant",
      content: "",
    };

    // 4) Build response payload
    const payload = {
      reply: assistantMessage.content,
    };

    if (debug) {
      payload.debug = {
        model,
        retrieved_context: cmgContext,
        vector_matches: matches,
      };
    }

    // --- structured success log ---
    logEvent("chat_success", {
      model,
      latencyMs,
      messageCount: messages.length,
      lastUserChars: (lastUserText || "").length,
      ip: request.headers.get("cf-connecting-ip") || "unknown",
    });

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...CORS_HEADERS,
      },
    });
  } catch (err) {
    const latencyMs = Date.now() - start;
    console.error("Chat handler error:", err);

    // --- structured error log ---
    logEvent("chat_error", {
      latencyMs,
      errorMessage: err?.message || String(err),
      stack: err?.stack ? String(err.stack).slice(0, 1000) : undefined,
    });

    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...CORS_HEADERS,
        },
      },
    );
  }
}
