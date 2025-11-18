export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const messages = body.messages || [];

    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // NEW LINE — system prompt injected from Cloudflare Secret
    const systemPrompt = env.COGMYRA_SYSTEM_PROMPT || "You are CogMyra Guide.";

    // Insert system prompt at the top of the message array
    const finalMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const model = env.MODEL || "gpt-4o";

    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: finalMessages
      })
    });

    const result = await completion.json();

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
