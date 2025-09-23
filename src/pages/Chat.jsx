// src/pages/Chat.jsx
import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

function makeId() {
  return "web-" + Math.random().toString(36).slice(2, 10);
}
function getSessionId() {
  let sid = localStorage.getItem("cmg_session");
  if (!sid) {
    sid = makeId();
    localStorage.setItem("cmg_session", sid);
  }
  return sid;
}

export default function Chat() {
  const api = useMemo(() => (API_BASE || "").replace(/\/+$/, ""), []);
  const [sessionId, setSessionId] = useState(getSessionId);
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [logs, setLogs] = useState([]);
  const [health, setHealth] = useState("checking"); // "ok" | "down" | "checking"
  const [model, setModel] = useState(
    localStorage.getItem("cmg_model") || (import.meta.env.VITE_DEFAULT_MODEL || "gpt-4.1")
  );

  useEffect(() => {
    localStorage.setItem("cmg_model", model);
  }, [model]);

  async function checkHealth() {
    try {
      const r = await fetch(`${api}/api/health`);
      setHealth(r.ok ? "ok" : "down");
    } catch {
      setHealth("down");
    }
  }

  async function sendChat(e) {
    e?.preventDefault?.();
    if (!input.trim()) return;

    setBusy(true);
    setReply("");
    try {
      const res = await fetch(`${api}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          model, // server may ignore if not supported; Step 2 adds support
          messages: [
            { role: "system", content: "You are CogMyra Guide (CMG)." },
            { role: "user", content: input.trim() },
          ],
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setReply(`Error ${res.status}: ${data.error || data.detail || "(no details)"}`);
      } else {
        setReply(data.reply ?? "(no reply)");
      }
    } catch (err) {
      setReply(`Network error: ${String(err)}`);
    } finally {
      setBusy(false);
      refreshLogs();
    }
  }

  async function refreshLogs() {
    try {
      const r = await fetch(`${api}/api/admin/logs?limit=50`);
      const data = await r.json();
      setLogs(data.entries ?? []);
    } catch (err) {
      setLogs([{ ts: new Date().toISOString(), kind: "error", msg: String(err) }]);
    }
  }

  useEffect(() => {
    checkHealth();
    refreshLogs();
  }, []);

  return (
    <div style={{ maxWidth: 980, margin: "32px auto", padding: 16, fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1 style={{ marginBottom: 8 }}>CogMyra — Chat</h1>
        <div style={{ fontSize: 13, color: "#555" }}>
          API Base: <code>{api}</code>{" "}
          <span
            title={health === "ok" ? "API healthy" : health === "down" ? "API down" : "Checking…"}
            style={{
              marginLeft: 8,
              display: "inline-block",
              width: 9,
              height: 9,
              borderRadius: 999,
              background: health === "ok" ? "#16a34a" : health === "down" ? "#dc2626" : "#f59e0b",
              verticalAlign: "middle",
            }}
          />
        </div>
      </div>

      <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
        Session: <code>{sessionId}</code>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <select
          aria-label="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd" }}
        >
          <option value="gpt-4.1">gpt-4.1</option>
          <option value="gpt-4o-mini">gpt-4o-mini</option>
        </select>
        <form onSubmit={sendChat} style={{ display: "flex", gap: 8, flex: 1 }}>
          <input
            type="text"
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd" }}
          />
          <button disabled={busy} type="submit" style={{ padding: "10px 16px", borderRadius: 8 }}>
            {busy ? "Sending…" : "Send"}
          </button>
        </form>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Assistant reply:</div>
        <pre style={{ background: "#f7f7f8", padding: 12, borderRadius: 8, whiteSpace: "pre-wrap" }}>
{reply || "—"}
        </pre>
      </div>

      <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 8 }}>
        <h2 style={{ margin: 0 }}>Logs</h2>
        <button onClick={refreshLogs} style={{ padding: "6px 10px", borderRadius: 8 }}>Refresh</button>
      </div>
      <pre style={{ background: "#f7f7f8", padding: 12, borderRadius: 8, maxHeight: 360, overflow: "auto" }}>
{JSON.stringify(logs, null, 2)}
      </pre>
    </div>
  );
}
