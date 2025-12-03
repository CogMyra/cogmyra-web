// src/pages/GuidePage.jsx
// Simple CogMyra Guide page wired to the deployed /api/chat

import { useState } from "react";

// During local dev, call the production Pages API so we don't need
// Wrangler running. You can override this with VITE_COGMYRA_API_BASE.
const API_BASE =
  import.meta.env.VITE_COGMYRA_API_BASE || "https://cogmyra-web.pages.dev";

export default function GuidePage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello, I’m the CogMyra Guide. Tell me what you're working on, and I’ll help you one step at a time.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { role: "user", content: trimmed };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-key": "supersecuretempkey123",
        },
        body: JSON.stringify({
          messages: newMessages,
          debug: false,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error ${res.status}: ${text}`);
      }

      const data = await res.json();

      const replyText =
        typeof data.reply === "string"
          ? data.reply
          : JSON.stringify(data.reply);

      const assistantMessage = {
        role: "assistant",
        content: replyText,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setError("Something went wrong talking to the Guide. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 px-4 py-3">
        <h1 className="text-xl font-semibold tracking-tight">
          CogMyra Guide
        </h1>
        <p className="text-sm text-slate-400">
          Personalized AI learning coach (local prototype).
        </p>
      </header>

      <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 py-4 gap-3">
        <div className="flex-1 border border-slate-800 rounded-xl bg-slate-900/60 p-3 space-y-3 overflow-y-auto">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`rounded-lg px-3 py-2 text-sm ${
                m.role === "assistant"
                  ? "bg-slate-800 text-slate-50"
                  : "bg-sky-900/60 text-sky-50"
              }`}
            >
              <div className="text-xs uppercase tracking-wide mb-1 opacity-70">
                {m.role === "assistant" ? "Guide" : "You"}
              </div>
              <div className="whitespace-pre-wrap leading-relaxed">
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="text-xs text-red-400 bg-red-950/40 border border-red-800 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 border border-slate-800 rounded-xl bg-slate-900/70 px-3 py-2"
        >
          <textarea
            className="flex-1 bg-transparent border-none outline-none text-sm resize-none min-h-[2.5rem] max-h-32"
            placeholder="Ask the CogMyra Guide a question, describe a learner, or paste an assignment..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="shrink-0 px-3 py-1.5 text-sm rounded-lg border border-sky-500 bg-sky-600 hover:bg-sky-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </form>
      </main>
    </div>
  );
}
