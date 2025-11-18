export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    // Safely parse incoming JSON body
    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }

    // Normalize possible body shapes into a single messages array
    const userMessages =
      body.messages ||
      body?.data?.messages ||
      body?.input?.messages ||
      [];

    // 1) Validate OpenAI API key
    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing OPENAI_API_KEY" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2) SYSTEM PROMPT — primary source is the Cloudflare secret
    const systemPrompt =
      (env.COGMYRA_SYSTEM_PROMPT && env.COGMYRA_SYSTEM_PROMPT.trim()) ||
      `
You are CogMyra Guide (CMG), a transformational learning coach.
Guide, teach, and coach learners with clarity, care, and rigor, while
staying emotionally grounded and attuned to each person. Follow the
CogMyra Guide configuration for tone, scaffolding, and instructional flow.
      `.trim();

    // 3) Build messages array (system prompt FIRST)
    const messages = [
      { role: "system", content: systemPrompt },
      ...userMessages,
    ];

    // 4) Select model: from Cloudflare variable MODEL, or fallback
    //    (in Dashboard you've set MODEL = gpt-5.1)
    const model = env.MODEL || "gpt-4o";

    // 5) Call OpenAI chat completions API
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

    // 6) Handle upstream OpenAI error
    if (!completion.ok) {
      return new Response(
        JSON.stringify({
          error: result?.error || "Upstream OpenAI error",
          upstreamStatus: completion.status,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 7) Return the full OpenAI response to the frontend
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    // 8) Catch-all server error
    return new Response(
      JSON.stringify({ error: err.message || "Unknown server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
