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

    // --- SYSTEM PROMPT (put your full CogMyra Guide prompt here) ---
    const systemPrompt = `
You are CogMyra Guide, the user's personalized AI learning coach.
Use the CogMyra Guide configuration, instructional flow, tone, modeling,
and learner-specific personalization rules as defined in the CMG spec.
(We will replace this block with the full prompt shortly.)
    `.trim();
    // ---------------------------------------------------------------

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

    if (completion.status !== 200) {
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
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Unknown server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
