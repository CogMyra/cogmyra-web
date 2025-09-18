import { useState } from "react";
import Admin from "./Admin";

const API = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/, "");

export default function App() {
  const [inp, setInp] = useState("");
  const [reply, setReply] = useState("");
  const [err, setErr] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);

  async function send() {
    setErr("");
    setReply("");
    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: "web",
          messages: [{ role: "user", content: inp || "Ping" }],
        }),
      });
      if (!res.ok) throw new Error(`Chat failed: ${res.status}`);
      const json = await res.json();
      setReply(json.reply ?? JSON.stringify(json));
    } catch (e) {
      setErr(String(e.message || e));
    }
  }

  return (
    <div style={{ maxWidth: 960, margin: "40px auto", padding: "0 16px" }}>
      <h1>CogMyra — Private Beta</h1>

      <p>Type a prompt to test the server-side proxy + logging.</p>
      <div style={{ display: "flex", gap: 12 }}>
        <input
          placeholder="Ask something…"
          value={inp}
          onChange={(e) => setInp(e.target.value)}
          style={{ flex: 1, padding: 12, fontSize: 16 }}
        />
        <button onClick={send}>Send</button>
      </div>

      <div style={{ marginTop: 16, background: "#f6f8fa", padding: 12, borderRadius: 6 }}>
        <strong>Reply</strong>
        <div style={{ marginTop: 8 }}>
          {err ? <span style={{ color: "#c0392b" }}>Error: {err}</span> : reply || "—"}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={() => setShowAdmin((s) => !s)}>
          {showAdmin ? "Hide admin" : "Show admin"}
        </button>
      </div>

      {showAdmin && <Admin />}
    </div>
  );
}
