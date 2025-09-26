import React, { useEffect, useMemo, useRef, useState } from "react";

/** Base API URL is provided by build-time env (VITE_API_BASE). */
const API_BASE = import.meta.env.VITE_API_BASE; // e.g. https://cogmyra-api.onrender.com
const SHOW_DEBUG = import.meta.env.MODE !== "production";

function newSessionId() {
  return "web-" + Math.random().toString(36).slice(2, 10);
}

export default function Chat() {
  const [session, setSession] = useState(() => {
    const prev = localStorage.getItem("cmg_session");
    return prev || newSessionId();
  });
  useEffect(() => {
    localStorage.setItem("cmg_session", session);
  }, [session]);

  const [model, setModel] = useState("gpt-4.1");
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  const listRef = useRef(null);

  // auto-scroll to last message
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [msgs, sending]);

  const canSend = useMemo(() => {
    return !sending && input.trim().length > 0;
  }, [sending, input]);

  async function onSend(e) {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text) return;
    setErr("");

    const userMsg = { role: "user", content: text };
    setMsgs((m) => [...m, userMsg]);
    setInput("");

    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // No cookies or auth; avoids credentialed CORS issues
        credentials: "omit",
        body: JSON.stringify({
          sessionId: session,
          model,
          messages: [
            { role: "system", content: "You are CogMyra Guide (CMG)." },
            ...msgs,
            userMsg,
          ],
        }),
      });

      if (!res.ok) {
        // Try to parse JSON error; otherwise fall back to status text
        let detail = "";
        try {
          detail = (await res.json())?.detail || "";
        } catch {}
        throw new Error(detail || `${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const reply = String(data.reply ?? "");
      setMsgs((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      // Show a friendly error inline instead of a popup
      const msg =
        e instanceof Error ? e.message : (typeof e === "string" ? e : "Request failed");
      setErr(`Sorry, I couldn’t send that: ${msg}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-serif mb-4">CogMyra — Chat</h1>

      <p className="text-sm mb-3">
        API Base: <code>{API_BASE}</code>
      </p>

      <form onSubmit={onSend} className="flex gap-2 mb-3">
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="border rounded p-2 text-sm"
        >
          <option value="gpt-4.1">gpt-4.1</option>
        </select>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 border rounded p-2 text-sm"
          disabled={sending}
        />

        <button
          type="submit"
          disabled={!canSend}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </form>

      {err && (
        <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
          {err}
        </div>
      )}

      <div
        ref={listRef}
        className="border rounded p-3 h-64 overflow-auto bg-white"
      >
        {msgs.length === 0 ? (
          <div className="text-sm text-gray-500">
            No messages yet — try a question!
          </div>
        ) : (
          <ul className="space-y-2">
            {msgs.map((m, i) => (
              <li key={i}>
                <span className="font-semibold">{m.role}:</span>{" "}
                <span>{m.content}</span>
              </li>
            ))}
            {sending && (
              <li className="text-gray-500 text-sm">assistant is typing…</li>
            )}
          </ul>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-3">
        CogMyra Beta — prompts are logged for quality. Don’t paste secrets.
      </p>

      {SHOW_DEBUG && (
        <details className="mt-4">
          <summary className="cursor-pointer">Debug</summary>
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify({ session, model, msgsCount: msgs.length }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
