export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    // Parse body safely
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // --- NORMALIZE USER MESSAGES ------------------------------------
    // Accept either:
    //  1) { messages: [{ role, content }, ...] }
    //  2) { message: "..." } or { content: "..." }  (old/simple shape)
    let userMessages = [];

    if (Array.isArray(body.messages) && body.messages.length > 0) {
      userMessages = body.messages;
    } else if (typeof body.message === "string" && body.message.trim()) {
      userMessages = [{ role: "user", content: body.message.trim() }];
    } else if (typeof body.content === "string" && body.content.trim()) {
      userMessages = [{ role: "user", content: body.content.trim() }];
    } else {
      // No usable content at all
      return new Response(
        JSON.stringify({ error: "No message content provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    // ----------------------------------------------------------------

    // --- OPENAI KEY CHECK -------------------------------------------
    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing OPENAI_API_KEY" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    // ----------------------------------------------------------------

    // --- SYSTEM PROMPT (from Cloudflare secret, with safe fallback) --
    const systemPrompt =
      (env.COGMYRA_SYSTEM_PROMPT && env.COGMYRA_SYSTEM_PROMPT.trim()) ||
      `
You are CogMyra Guide (CMG), a transformational learning coach.
Guide, teach, and coach learners with clarity, care, and rigor, while
staying emotionally grounded and attuned to each person. Follow the
CogMyra Guide configuration for tone, scaffolding, and instructional flow.
      `.trim();
    // ----------------------------------------------------------------

    // Build messages with system prompt first
    const messages = [
      { role: "system", content: systemPrompt },
      ...userMessages,
    ];

    const model = env.MODEL || "gpt-4o-2024-08-06";

    const completion = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model, messages }),
      }
    );

    const result = await completion.json();

    if (!completion.ok) {
      return new Response(
        JSON.stringify({
          error: result.error || "Upstream OpenAI error",
          upstreamStatus: completion.status,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return the **raw OpenAI response**; the front-end already works with this.
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Unknown server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
