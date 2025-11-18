// functions/api/chat.js
// Backend for the CogMyra Guide chat endpoint.
// Expects JSON: { messages: [{ role, content }, ...] }
// Adds the CogMyra Guide system prompt on the server side,
// calls OpenAI, and returns a single assistant message + raw payload.

export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    // --- 1. Basic validation / parsing ---
    let body;
    try {
      body = await request.json();
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body", detail: String(err) }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const userMessages = Array.isArray(body?.messages) ? body.messages : [];

    // --- 2. API key + model from Cloudflare env ---
    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing OPENAI_API_KEY in environment" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const model = env.MODEL || "gpt-4o";

    // --- 3. CogMyra Guide system prompt ---
    const systemMessage = {
      role: "system",
      content: [
        {
          type: "text",
          text: `
You are CogMyra Guide, a patient, rigorous, and adaptive learning coach.

Your job:
- Understand who the learner is (age, role, goals, emotions).
- Diagnose what they’re working on and where they’re stuck.
- Teach clearly, step by step, without dumbing things down.
- Design practice, not just explanations (examples, checks, small challenges).
- Help them reflect on what they’ve learned and what comes next.

Behaviour and tone:
- Warm but not saccharine. Calm, grounded, respectful.
- Never shame confusion—normalize it and turn it into a path forward.
- Ask short, targeted questions when you need more context.
- Keep paragraphs reasonably tight and scannable.
- Prefer concrete examples and worked steps over vague advice.

Interaction pattern (internal guidance):
1) First, quickly restate your understanding of who they are and what they want.
2) Then give a focused explanation or plan tailored to their level.
3) Offer 1–3 small practice prompts or checkpoints (not huge problem sets).
4) Invite them to respond, react, or try something specific next.

You are *not* a generic assistant. Stay focused on teaching, coaching, and learning.
If the user asks for something outside that scope, briefly address it and then
steer back to learning and growth.

When you reply, speak directly to the learner in the second person ("you").
            `.trim(),
        },
      ],
    };

    const messages = [systemMessage, ...userMessages];

    // --- 4. Call OpenAI Chat Completions API ---
    const response = await fetch(
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
          temperature: 0.65,
          max_tokens: 1200,
        }),
      },
    );

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("OpenAI error:", response.status, text);

      return new Response(
        JSON.stringify({
          error: "Upstream OpenAI error",
          status: response.status,
        }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const data = await response.json();

    const assistantMessage =
      data?.choices?.[0]?.message ??
      ({
        role: "assistant",
        content:
          "I’m here, but I had trouble generating a reply. Could you try again or rephrase your request?",
      });

    // --- 5. Return a clean payload to the frontend ---
    return new Response(
      JSON.stringify({
        message: assistantMessage,
        raw: data,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("Unexpected /api/chat error:", err);
    return new Response(
      JSON.stringify({
        error: "Unexpected server error in /api/chat",
        detail: String(err),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
