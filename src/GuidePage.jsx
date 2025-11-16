// src/GuidePage.jsx
import { useEffect, useMemo, useState } from "react";

/**
 * NOTE ABOUT THE BACKEND WIRING
 *
 * Right now, `callGuideAPI` is a placeholder that simply returns a canned
 * response so the UI works.
 *
 * To connect this to your *real* CogMyra Guide GPT (with all uploaded docs),
 * you should:
 *   1. Open your existing working Guide front-end code.
 *   2. Copy the exact fetch/axios call you already use to hit your
 *      API (likely on https://cogmyra-api.onrender.com).
 *   3. Paste that logic into `callGuideAPI` below, and make it
 *      `return` a string with the assistant's reply text.
 *
 * As long as `callGuideAPI` talks to the same backend endpoint you use today,
 * this page will be using the *same GPT + same documents* as before.
 */

async function callGuideAPI(prompt, sessionId) {
  // TODO: Replace this with your REAL API call.
  // Example skeleton (adjust to match your current implementation):
  //
  // const res = await fetch(`${import.meta.env.VITE_API_BASE}/chat`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ message: prompt, sessionId }),
  // });
  // const data = await res.json();
  // return data.reply;
  //
  // TEMPORARY FAKE REPLY so the UI works:
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        "This is a placeholder response from CogMyra. Once you connect the Guide API here, this text will come directly from your GPT-powered coach using all of your uploaded resources."
      );
    }, 800);
  });
}

function GuideGate({ children }) {
  const [status, setStatus] = useState("login"); // "checking" | "login" | "ready"
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  // You can extend this later to actually verify tokens from magic links.
  useEffect(() => {
    // Simple “auto-ready” placeholder so we’re not blocked during design.
    // Change this logic once your magic link backend is wired up.
    const stored = localStorage.getItem("cm_session_fake");
    if (stored) {
      setStatus("ready");
    } else {
      setStatus("login");
    }
  }, []);

  async function handleSendMagicLink(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setMessage("");

    // TODO: replace with real magic-link API call.
    // For now we just simulate success:
    setTimeout(() => {
      setSending(false);
      setMessage(
        "Magic link sent (placeholder). In your real implementation this will send an email and redirect back here with a token."
      );
      // For now, also “log you in” immediately so you can use the UI.
      localStorage.setItem("cm_session_fake", "1");
      setStatus("ready");
    }, 800);
  }

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#E3ECE8] text-slate-600">
        Checking your session…
      </div>
    );
  }

  if (status === "login") {
    return (
      <div className="min-h-screen bg-[#E3ECE8] text-slate-900">
        {/* Header */}
        <header className="border-b border-slate-300 bg-[#3E505B] text-slate-100">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <div className="text-2xl font-semibold tracking-[0.16em] text-[#8AB0AB]">
              CogMyra_
            </div>
            <a
              href="/"
              className="inline-flex items-center rounded-full bg-slate-900/80 px-4 py-1.5 text-sm font-medium text-slate-50 shadow-sm hover:bg-slate-900"
            >
              Back to homepage
            </a>
          </div>
        </header>

        <main className="flex min-h-[70vh] items-center justify-center px-4 py-10">
          <div className="w-full max-w-md rounded-3xl border border-slate-300 bg-white p-6 shadow-sm">
            <h1 className="text-xl font-semibold text-slate-900">
              Sign in to CogMyra Guide
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Enter your email and we&apos;ll send you a magic link. Once your
              backend is wired, this will become your real passwordless login.
            </p>

            <form onSubmit={handleSendMagicLink} className="mt-4 space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8AB0AB]"
                placeholder="you@example.com"
              />
              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-slate-50 hover:bg-black disabled:opacity-60"
              >
                {sending ? "Sending…" : "Send magic link"}
              </button>
            </form>

            {message && (
              <p className="mt-3 text-xs text-slate-600">{message}</p>
            )}
          </div>
        </main>
      </div>
    );
  }

  // status === "ready"
  return children;
}

function GuidePage() {
  // Chat state
  const [sessions, setSessions] = useState(() => {
    // Single starter session for now
    return [
      {
        id: "default",
        title: "Welcome to CogMyra Guide",
        createdAt: new Date().toISOString(),
      },
    ];
  });
  const [activeSessionId, setActiveSessionId] = useState("default");

  const [messagesBySession, setMessagesBySession] = useState(() => ({
    default: [],
  }));

  const [input, setInput] = useState("");

  // Fake streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");

  const activeMessages = useMemo(
    () => messagesBySession[activeSessionId] || [],
    [messagesBySession, activeSessionId]
  );

  function ensureSession(sessionId) {
    setMessagesBySession((prev) => {
      if (prev[sessionId]) return prev;
      return { ...prev, [sessionId]: [] };
    });
  }

  function handleNewSession() {
    const id = `s_${Date.now()}`;
    const newSession = {
      id,
      title: "New conversation",
      createdAt: new Date().toISOString(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(id);
    setMessagesBySession((prev) => ({ ...prev, [id]: [] }));
  }

  function updateSessionTitleIfNeeded(sessionId, firstUserMessage) {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId && s.title === "New conversation"
          ? {
              ...s,
              title:
                firstUserMessage.length > 40
                  ? firstUserMessage.slice(0, 37) + "…"
                  : firstUserMessage,
            }
          : s
      )
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const sessionId = activeSessionId;
    ensureSession(sessionId);

    // Add user message
    setMessagesBySession((prev) => ({
      ...prev,
      [sessionId]: [
        ...(prev[sessionId] || []),
        { id: `u_${Date.now()}`, role: "user", content: trimmed },
      ],
    }));
    setInput("");

    updateSessionTitleIfNeeded(sessionId, trimmed);

    // Call backend + fake typing
    setIsStreaming(true);
    setStreamedText("");

    try {
      const replyText = await callGuideAPI(trimmed, sessionId);

      // Fake typing animation
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setStreamedText(replyText.slice(0, i));
        if (i >= replyText.length) {
          clearInterval(interval);
          setIsStreaming(false);
          setStreamedText("");

          // Commit final assistant message
          setMessagesBySession((prev) => ({
            ...prev,
            [sessionId]: [
              ...(prev[sessionId] || []),
              {
                id: `a_${Date.now()}`,
                role: "assistant",
                content: replyText,
              },
            ],
          }));
        }
      }, 20);
    } catch (err) {
      console.error(err);
      setIsStreaming(false);
      setStreamedText("");

      const fallback = "Sorry, something went wrong. Please try again.";
      setMessagesBySession((prev) => ({
        ...prev,
        [sessionId]: [
          ...(prev[sessionId] || []),
          {
            id: `a_err_${Date.now()}`,
            role: "assistant",
            content: fallback,
          },
        ],
      }));
    }
  }

  return (
    <GuideGate>
      <div className="min-h-screen bg-[#E3ECE8] text-slate-900">
        {/* Header */}
        <header className="border-b border-slate-300 bg-[#3E505B] text-slate-100">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            {/* Logo – not a link here, never changes color */}
            <div className="text-2xl font-semibold tracking-[0.16em] text-[#8AB0AB]">
              CogMyra_
            </div>

            <a
              href="/"
              className="inline-flex items-center rounded-full bg-slate-900/80 px-4 py-1.5 text-sm font-medium text-slate-50 shadow-sm hover:bg-slate-900"
            >
              Back to homepage
            </a>
          </div>
        </header>

        {/* Main layout */}
        <main className="mx-auto flex max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
          {/* Left: history list */}
          <section className="w-64 shrink-0">
            <button
              type="button"
              onClick={handleNewSession}
              className="mb-4 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-slate-50 hover:bg-black"
            >
              + New
            </button>

            <div className="space-y-2 text-sm">
              {sessions.map((s) => {
                const isActive = s.id === activeSessionId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveSessionId(s.id)}
                    className={`flex w-full flex-col items-start rounded-lg border px-3 py-2 text-left ${
                      isActive
                        ? "border-slate-900 bg-white"
                        : "border-slate-300 bg-slate-50/60 hover:bg-white"
                    }`}
                  >
                    <span className="font-medium line-clamp-1">{s.title}</span>
                    <span className="mt-0.5 text-xs text-slate-500">
                      {new Date(s.createdAt).toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Right: chat */}
          <section className="flex-1">
            <div className="flex h-[70vh] flex-col rounded-3xl border border-slate-300 bg-white shadow-sm">
              {/* Top bar */}
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div className="text-sm font-semibold text-slate-700">
                  CogMyra Guide
                </div>
                <div className="text-xs text-slate-500">
                  Patient, adaptive learning—one conversation at a time.
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                {activeMessages.map((m) =>
                  m.role === "user" ? (
                    <div key={m.id} className="flex justify-end">
                      <div className="max-w-xl rounded-2xl bg-[#D9E3E0] px-4 py-2 text-sm text-slate-900">
                        {m.content}
                      </div>
                    </div>
                  ) : (
                    <div key={m.id} className="flex justify-start">
                      <div className="max-w-xl rounded-2xl border border-[#C0D5CC] bg-[#F6FAF8] px-4 py-2 text-sm text-slate-900">
                        {m.content}
                      </div>
                    </div>
                  )
                )}

                {isStreaming && (
                  <div className="flex justify-start">
                    <div className="max-w-xl rounded-2xl border border-[#C0D5CC] bg-[#F6FAF8] px-4 py-2 text-sm text-slate-900">
                      {streamedText}
                      <span className="inline-block w-2 animate-pulse">▌</span>
                    </div>
                  </div>
                )}

                {activeMessages.length === 0 && !isStreaming && (
                  <div className="mt-8 text-sm text-slate-500">
                    Hi! What would you like to learn today? Ask a question, plan
                    a lesson, or explore a new topic—CogMyra will adapt to you.
                  </div>
                )}
              </div>

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="border-t border-slate-200 px-4 py-3"
              >
                <div className="flex gap-3">
                  <textarea
                    className="min-h-[44px] flex-1 resize-none rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8AB0AB]"
                    placeholder="What would you like to learn today?"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isStreaming}
                    className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-slate-50 hover:bg-black disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </section>
        </main>
      </div>
    </GuideGate>
  );
}

export default GuidePage;
