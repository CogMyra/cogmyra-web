export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    // Parse incoming JSON body
    const body = await request.json();
    const userMessages =
      body.messages ||
      body?.data?.messages ||
      body?.input?.messages ||
      [];

    // Validate OpenAI API key
    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing OPENAI_API_KEY" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // --- SYSTEM PROMPT: Uses secret (fallback is safe placeholder) ---------
    const systemPrompt =
      (env.COGMYRA_SYSTEM_PROMPT && env.COGMYRA_SYSTEM_PROMPT.trim()) ||
      `
You are CogMyra Guide (CMG), a transformational learning coach.
Guide, teach, and coach learners with clarity, care, and rigor, while
staying emotionally grounded and attuned to each person. Follow the
CogMyra Guide configuration for tone, scaffolding, and instructional flow.
      `.trim();
    // -----------------------------------------------------------------------

    // Construct messages for OpenAI API
    const messages = [
      { role: "system", content: systemPrompt },
      ...userMessages,
    ];

    // Choose model from Cloudflare variable (you set MODEL = gpt-5.1)
    const model = env.MODEL || "gpt-4o";

    // Call OpenAI chat completions endpoint
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

    // Handle OpenAI upstream error
    if (completion.status !== 200) {
      return new Response(
        JSON.stringify({
          error: result?.error || "Upstream OpenAI error",
          upstreamStatus: completion.status,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return final chat completion result
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    // Catch-all server error
    return new Response(
      JSON.stringify({ error: err.message || "Unknown server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
