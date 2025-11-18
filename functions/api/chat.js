export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const userMessages = body.messages || [];

    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing OPENAI_API_KEY" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // --- SYSTEM PROMPT: read from Cloudflare secret -------------------------
    // Uses COGMYRA_SYSTEM_PROMPT if present, otherwise falls back to a short,
    // safe default prompt so the app still works.
    const systemPrompt =
      (env.COGMYRA_SYSTEM_PROMPT && env.COGMYRA_SYSTEM_PROMPT.trim()) ||
      `
You are CogMyra Guide (CMG), a transformational learning coach.
Guide, teach, and coach learners with clarity, care, and rigor, while
staying emotionally grounded and attuned to each person. Follow the
CogMyra Guide configuration for tone, scaffolding, and instructional flow.
      `.trim();
    // ------------------------------------------------------------------------

    // Build messages array with system prompt FIRST
    const messages = [
      { role: "system", content: systemPrompt },
      ...userMessages,
    ];

    const model = env.MODEL || "gpt-4o";

    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    });

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
