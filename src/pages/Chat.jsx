import React from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function Chat() {
  const [model, setModel] = React.useState("gpt-4.1");
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // Stable session id for API calls
  const [session] = React.useState(() => {
    const KEY = "cmg_session";
    let s = localStorage.getItem(KEY);
    if (!s) {
      s = "web-" + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(KEY, s);
    }
    return s;
  });

  async function sendMessage() {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({
          sessionId: session,
          model,
          messages: [
            { role: "system", content: "You are CogMyra Guide (CMG)." },
            { role: "user", content: input.trim() },
          ],
        }),
      });

      if (!res.ok) {
        const detail =
          (await res.json().catch(() => null))?.detail || res.statusText;
        throw new Error(String(detail || "Request failed"));
      }

      const data = await res.json();
      const reply = String(data.reply ?? "");
      setMessages((m) => [...m, { role: "user", content: input }, { role: "assistant", content: reply }]);
      setInput("");
    } catch (err) {
      console.error("Chat error:", err);
      alert("Failed to send message: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>CogMyra — Chat</h1>
      <p>
        API Base: <code>{API_BASE}</code>
      </p>

      <div style={{ marginBottom: "1rem" }}>
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="gpt-4.1">gpt-4.1</option>
          <option value="gpt-4o-mini">gpt-4o-mini</option>
        </select>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ marginLeft: "0.5rem" }}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      <div>
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.role}:</strong> {m.content}
          </div>
        ))}
      </div>
    </div>
  );
}
