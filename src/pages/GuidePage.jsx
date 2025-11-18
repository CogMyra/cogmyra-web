import React, { useState } from "react";

export default function GuidePage() {
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "Hi, I’m CogMyra Guide. Tell me a little about who you are and what you’re working on, and we’ll build a learning path together.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setError(null);

    // Add user message to local state
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      // Build messages payload for backend
      const payloadMessages = [
        // We only send the conversational history; backend injects system prompt
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        {
          role: "user",
          content: trimmed,
        },
      ];

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      if (!res.ok) {
        throw new Error(`Chat API error: ${res.status}`);
      }

      const data = await res.json();

      // Extract assistant reply from OpenAI-style payload
      const replyContent =
        data?.choices?.[0]?.message?.content ??
        "I’m here with you, but I couldn’t generate a full response just now.";

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: replyContent,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setError(
        "I’m having trouble completing that request right now. Please try again in a moment."
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="guide-page" style={{ minHeight: "100vh", background: "#050510", color: "#f5f5f5" }}>
      <header
        style={{
          padding: "1.5rem 2rem",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>CogMyra Guide</h1>
          <p style={{ margin: "0.25rem 0 0", opacity: 0.8, fontSize: "0.9rem" }}>
            Your personalized AI learning coach.
          </p>
        </div>
      </header>

      <main
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "900px",
          margin: "0 auto",
          padding: "1.5rem 1rem 2rem",
          gap: "1rem",
        }}
      >
        <section
          style={{
            flex: 1,
            borderRadius: "0.75rem",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "1rem",
            background: "radial-gradient(circle at top, #181834, #050510)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            maxHeight: "60vh",
            overflowY: "auto",
          }}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "80%",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                background:
                  m.role === "user"
                    ? "rgba(99, 102, 241, 0.9)"
                    : "rgba(15, 23, 42, 0.9)",
                color: "#f9fafb",
                fontSize: "0.9rem",
                whiteSpace: "pre-wrap",
              }}
            >
              {m.content}
            </div>
          ))}
        </section>

        {error && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              background: "rgba(220, 38, 38, 0.1)",
              border: "1px solid rgba(248, 113, 113, 0.4)",
              fontSize: "0.85rem",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "0.75rem",
            marginTop: "0.5rem",
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell CogMyra Guide who you are and what you’re working on..."
            rows={2}
            style={{
              flex: 1,
              resize: "vertical",
              borderRadius: "0.75rem",
              border: "1px solid rgba(148, 163, 184, 0.5)",
              padding: "0.75rem 0.9rem",
              background: "rgba(15, 23, 42, 0.9)",
              color: "#f9fafb",
              fontSize: "0.9rem",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            style={{
              padding: "0.75rem 1.25rem",
              borderRadius: "0.75rem",
              border: "none",
              background: isSending || !input.trim() ? "#4b5563" : "#6366f1",
              color: "#f9fafb",
              fontWeight: 500,
              fontSize: "0.9rem",
              cursor: isSending || !input.trim() ? "not-allowed" : "pointer",
              minWidth: "90px",
            }}
          >
            {isSending ? "Thinking…" : "Send"}
          </button>
        </form>
      </main>
    </div>
  );
}
