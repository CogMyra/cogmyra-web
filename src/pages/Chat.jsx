// src/pages/Chat.jsx
import React, { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi, I’m CogMyra Guide. Tell me who you are (student, educator, or professional) and what you’re working on. I’ll tailor support just for you.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];

    // update UI immediately
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok) {
        throw new Error(`Chat API error: ${res.status}`);
      }

      const data = await res.json();

      const reply =
        data?.choices?.[0]?.message?.content ??
        "Sorry, I couldn’t generate a response just now.";

      const assistantMessage = { role: "assistant", content: reply };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error", err);
      setError(
        err?.message || "Something went wrong while contacting CogMyra Guide."
      );

      // Optional: put a generic error in the stream
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I hit a connection problem on my side. Let’s try that again in a moment.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#050608",
        color: "#f5f5f5",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Left rail */}
      <aside
        style={{
          width: 260,
          borderRight: "1px solid #15171c",
          padding: "20px",
          boxSizing: "border-box",
          backgroundColor: "#050608",
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          CogMyra_
        </div>

        <div
          style={{
            marginBottom: 16,
            fontSize: 14,
            fontWeight: 600,
            color: "#a0a6b5",
          }}
        >
          History
        </div>
        <div
          style={{
            fontSize: 13,
            padding: "10px 12px",
            borderRadius: 999,
            backgroundColor: "#181b22",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#18c08f",
            }}
          />
          Live
        </div>
      </aside>

      {/* Main chat area */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0a0c11",
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: "16px 32px",
            borderBottom: "1px solid #15171c",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 16 }}>CogMyra Guide</span>
          <span
            style={{
              fontSize: 12,
              padding: "4px 10px",
              borderRadius: 999,
              backgroundColor: "#181b22",
              color: "#b4bac8",
            }}
          >
            Students · Educators · Professionals
          </span>
        </header>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 32px",
            boxSizing: "border-box",
          }}
        >
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "12px 16px",
                  borderRadius: 16,
                  backgroundColor:
                    m.role === "user" ? "#273043" : "#151924",
                  color: "#f5f5f5",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {m.content}
              </div>
            </div>
          ))}
          {error && (
            <div style={{ color: "#ff6b6b", fontSize: 13, marginTop: 8 }}>
              {error}
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          style={{
            padding: "16px 32px 24px",
            borderTop: "1px solid #15171c",
            display: "flex",
            gap: 12,
            boxSizing: "border-box",
          }}
        >
          <input
            type="text"
            placeholder="Describe who you are, what you’re working on, and what you need help with…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              borderRadius: 999,
              border: "1px solid #252938",
              padding: "10px 16px",
              fontSize: 14,
              backgroundColor: "#0f1118",
              color: "#f5f5f5",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            style={{
              borderRadius: 999,
              border: "none",
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: 600,
              backgroundColor: isSending || !input.trim() ? "#273043" : "#f5f5f5",
              color: isSending || !input.trim() ? "#80879a" : "#050608",
              cursor:
                isSending || !input.trim() ? "not-allowed" : "pointer",
            }}
          >
            {isSending ? "Thinking…" : "Send"}
          </button>
        </form>
      </main>
    </div>
  );
}
