// src/pages/Chat.jsx
import { useEffect, useMemo, useRef, useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") || "http://127.0.0.1:8000";

function sessionId() {
  const k = "cmg_session_id";
  let s = localStorage.getItem(k);
  if (!s) {
    s = "web-" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(k, s);
  }
  return s;
}

export default function Chat() {
  const [model, setModel] = useState("gpt-4.1");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState(() => {
    // keep a tiny history (up to 10)
    const raw = localStorage.getItem("cmg_history");
    return raw ? JSON.parse(raw) : [];
  });
  const [online, setOnline] = useState(true);
  const inputRef = useRef(null);

  const sid = useMemo(() => sessionId(), []);

  useEffect(() => {
    localStorage.setItem("cmg_history", JSON.stringify(items.slice(-10)));
  }, [items]);

  async function checkHealth() {
    try {
      const r = await fetch(`${API_BASE}/api/health`, { credentials: "include" });
      setOnline(r.ok);
    } catch {
      setOnline(false);
    }
  }

  useEffect(() => {
    checkHealth();
    const t = setInterval(checkHealth, 15000);
    return () => clearInterval(t);
  }, []);

  async function handleSend() {
    setError("");
    const prompt = input.trim();
    if (!prompt) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          sessionId: sid,
          model,
          messages: [
            { role: "system", content: "You are CogMyra Guide (CMG)." },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!res.ok) {
        const detail = (await res.json().catch(() => null))?.detail || res.statusText;
        throw new Error(String(detail || "Request failed"));
      }

      const data = await res.json();
      const reply = String(data.reply ?? "");

      setItems((prev) => [...prev, { ts: Date.now(), prompt, reply, model }].slice(-10));
      setInput("");
      inputRef.current?.focus();
    } catch (e) {
      setError(e.message || "Network error");
    } finally {
      setLoading(false);
      checkHealth();
    }
  }

  function onEnter(e) {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="min-h-screen p-6 text-gray-900">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-2xl font-semibold">CogMyra — Chat</h1>
        <div className="ml-auto text-sm flex items-center gap-2">
          <span>API Base:</span>
          <code className="bg-gray-100 px-2 py-0.5 rounded">{API_BASE}</code>
          <span
            title={online ? "API reachable" : "API unreachable"}
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: online ? "#22c55e" : "#ef4444",
            }}
          />
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option>gpt-4.1</option>
          <option>gpt-4o-mini</option>
        </select>

        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onEnter}
          placeholder="Type a message…"
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          disabled={loading}
          onClick={handleSend}
          className="px-4 py-2 rounded text-white"
          style={{ background: loading ? "#9ca3af" : "#111827" }}
        >
          {loading ? "Sending…" : "Send"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-3 py-2 mb-3">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {items.slice().reverse().map((it) => (
          <div key={it.ts} className="bg-gray-50 border rounded p-3">
            <div className="text-xs text-gray-500 mb-1">
              {new Date(it.ts).toLocaleString()} • model: {it.model}
            </div>
            <div className="mb-2">
              <span className="font-semibold">You:</span> {it.prompt}
            </div>
            <div>
              <span className="font-semibold">Assistant:</span>{" "}
              <span style={{ whiteSpace: "pre-wrap" }}>{it.reply}</span>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-gray-500">No messages yet — try a question!</div>
        )}
      </div>

      <div className="mt-8 text-sm text-gray-500">
        We log prompts/replies to improve the beta. Please don’t paste secrets.
      </div>
    </div>
  );
}
