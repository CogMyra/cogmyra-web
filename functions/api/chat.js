export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    // Safely parse incoming JSON body
    let body;
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    // Normalize messages from a few possible shapes
    let userMessages =
      body.messages ||
      body?.data?.messages ||
      body?.input?.messages ||
      [];

    // If no messages array but a single "prompt" is provided, wrap it
    if (
      (!Array.isArray(userMessages) || userMessages.length === 0) &&
      body?.prompt
    ) {
      userMessages = [
        {
          role: "user",
          content: String(body.prompt),
        },
      ];
    }

    if (!Array.isArray(userMessages) || userMessages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No messages provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // --- Validate OpenAI API key -----------------------------------------
    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing OPENAI_API_KEY" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    // ---------------------------------------------------------------------

    // --- SYSTEM PROMPT: Uses secret (fallback is a safe placeholder) -----
    const systemPrompt =
      (env.COGMYRA_SYSTEM_PROMPT && env.COGMYRA_SYSTEM_PROMPT.trim()) ||
      `
You are CogMyra Guide (CMG), a transformational learning coach.
Guide, teach, and coach learners with clarity, care, and rigor, while
staying emotionally grounded and attuned to each person. Follow the
CogMyra Guide configuration for tone, scaffolding, and instructional flow.
      `.trim();
    // ---------------------------------------------------------------------

    // Construct messages for OpenAI API
    const messages = [
      { role: "system", content: systemPrompt },
      ...userMessages,
    ];

    // Choose model from Cloudflare variable; default to gpt-5.1
    const model = env.MODEL || "gpt-5.1";

    // Call OpenAI chat completions endpoint
    const completion = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
        }),
      }
    );

    const result = await completion.json();

    // Handle OpenAI upstream error
    if (!completion.ok) {
      return new Response(
        JSON.stringify({
          error: result?.error || "Upstream OpenAI error",
          upstreamStatus: completion.status,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return final chat completion result (OpenAI-style JSON)
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    // Catch-all server error
    return new Response(
      JSON.stringify({ error: err?.message || "Unknown server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
