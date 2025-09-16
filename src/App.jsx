import { useState } from "react";
import Admin from "./Admin.jsx";

export default function App() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  async function send() {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: "local-" + Date.now(),
          messages: [{ role: "user", content: input }],
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || ("HTTP " + res.status));
      }
      const data = await res.json();
      setReply(data.reply || "(no reply)");
    } catch (e) {
      setReply("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: "0 auto", fontFamily: "ui-sans-serif, system-ui" }}>
      <h1 style={{ marginTop: 0 }}>CogMyra — Private Beta</h1>
      <p style={{ opacity: 0.8 }}>Type a prompt to test the server-side proxy + logging.</p>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something…"
          style={{ flex: 1, padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.15)" }}
        />
        <button
          onClick={send}
          disabled={loading}
          style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.15)", background: "black", color: "white", cursor: "pointer" }}
        >
          {loading ? "Sending…" : "Send"}
        </button>
      </div>

      {reply && (
        <div style={{ marginTop: 16, padding: 16, borderRadius: 12, background: "#f6f6f6" }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Reply</div>
          <div>{reply}</div>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <button onClick={() => setShowAdmin(v => !v)} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)" }}>
          {showAdmin ? "Hide admin" : "Show admin"}
        </button>
      </div>

      {showAdmin && <Admin />}
    </div>
  );
}
