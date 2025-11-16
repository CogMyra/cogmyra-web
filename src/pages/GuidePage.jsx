import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Placeholder assistant text (same wording you see now)
const PLACEHOLDER_RESPONSE =
  "This is a placeholder response from CogMyra. Once you connect the Guide API here, this text will come directly from your GPT-powered coach using all of your uploaded resources.";

function formatTimestamp(date = new Date()) {
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function GuidePage() {
  // Very simple “logged in” flag (still a placeholder)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  // Conversation state
  const [sessions, setSessions] = useState([
    {
      id: "session-1",
      title: "Welcome to CogMyra Guide",
      createdAt: formatTimestamp(),
    },
  ]);
  const [activeSessionId, setActiveSessionId] = useState("session-1");

  const [messages, setMessages] = useState([
    {
      id: "m1",
      role: "user",
      content:
        "I have a test on the countries of europe next week. Please help me study.",
    },
    {
      id: "m2",
      role: "assistant",
      content: PLACEHOLDER_RESPONSE,
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // For the “typing” animation
  const typingIntervalRef = useRef(null);

  // When component unmounts, clear any running interval
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  function handleNewSession() {
    const id = `session-${Date.now()}`;
    const newSession = {
      id,
      title: "New conversation",
      createdAt: formatTimestamp(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(id);
    setMessages([]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    // Stop any previous typing interval just in case
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

    const now = Date.now();
    const userMessage = {
      id: `u-${now}`,
      role: "user",
      content: trimmed,
    };

    // Add user message first
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Add an empty assistant message that we'll “fill in” character by character
    const assistantId = `a-${now + 1}`;
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        content: "",
      },
    ]);

    // Typing animation
    let index = 0;
    const chars = PLACEHOLDER_RESPONSE.split("");

    typingIntervalRef.current = setInterval(() => {
      index += 1;
      setMessages((prev) => {
        const updated = [...prev];
        const targetIndex = updated.findIndex((m) => m.id === assistantId);
        if (targetIndex === -1) return prev;

        const current = updated[targetIndex];
        updated[targetIndex] = {
          ...current,
          content: chars.slice(0, index).join(""),
        };
        return updated;
      });

      if (index >= chars.length) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        setIsTyping(false);
      }
    }, 20); // Adjust speed (ms) if you want slower/faster typing
  }

  function handleFakeMagicLinkSubmit(e) {
    e.preventDefault();
    // For now, this is still a placeholder login.
    // It simply unlocks the Guide UI without sending an email.
    setIsAuthenticated(true);
    setShowLogin(false);
  }

  // ----------------- RENDER -----------------

  // If not “logged in”, show the magic link card
  if (!isAuthenticated && showLogin) {
    return (
      <div className="min-h-screen bg-[#E3ECE8] text-slate-900">
        <header className="border-b border-slate-800/60 bg-[#3E505B] text-slate-100">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <div className="text-xl font-semibold tracking-[0.16em]">
              CogMyra_
            </div>
            <Link
              to="/"
              className="rounded-full bg-slate-950 px-4 py-1.5 text-sm font-medium text-slate-100 shadow hover:bg-black"
            >
              Back to homepage
            </Link>
          </div>
        </header>

        <main className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-xl rounded-3xl border border-slate-300 bg-slate-50 px-6 py-8 shadow-sm sm:px-8">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Sign in to CogMyra Guide
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Enter your email and we&apos;ll send you a magic link. Once your
              backend is wired, this will become your real passwordless login.
            </p>

            <form onSubmit={handleFakeMagicLinkSubmit} className="mt-6 space-y-4">
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 focus:border-[#26413C] focus:ring-2 focus:ring-[#8AB0AB]"
              />
              <button
                type="submit"
                className="w-full rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-slate-50 shadow hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8AB0AB]"
              >
                Send magic link
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // Main Guide UI
  return (
    <div className="min-h-screen bg-[#E3ECE8] text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800/60 bg-[#3E505B] text-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="text-xl font-semibold tracking-[0.16em]">
            CogMyra_
          </div>
          <Link
            to="/"
            className="rounded-full bg-slate-950 px-4 py-1.5 text-sm font-medium text-slate-100 shadow hover:bg-black"
          >
            Back to homepage
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto flex max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Left: history */}
        <aside className="w-64 flex-shrink-0">
          <button className="mb-4 flex w-full items-center justify-center rounded-2xl bg-slate-950 px-3 py-2 text-sm font-medium text-slate-50 shadow hover:bg-black">
            + New
          </button>

          <div className="space-y-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                type="button"
                onClick={() => setActiveSessionId(session.id)}
                className={`w-full rounded-2xl border px-3 py-2 text-left text-sm ${
                  session.id === activeSessionId
                    ? "border-[#3E505B] bg-white text-slate-900 shadow-sm"
                    : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-white"
                }`}
              >
                <div className="font-medium">{session.title}</div>
                <div className="text-xs text-slate-500">{session.createdAt}</div>
              </button>
            ))}
          </div>
        </aside>

        {/* Right: chat */}
        <section className="flex flex-1 flex-col">
          <div className="flex items-baseline justify-between">
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">
              CogMyra Guide
            </h1>
            <p className="text-xs text-slate-500">
              Patient, adaptive learning—one conversation at a time.
            </p>
          </div>

          <div className="mt-4 flex-1 rounded-3xl border border-slate-300 bg-slate-50 p-4 shadow-sm">
            {/* Conversation */}
            <div className="mb-4 flex flex-col gap-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "self-start bg-[#E3ECE8] text-slate-900"
                      : "self-start bg-white text-slate-900 border border-[#D1DEE0]"
                  }`}
                >
                  {m.content}
                </div>
              ))}

              {isTyping && (
                <div className="max-w-xs rounded-2xl bg-white px-4 py-2 text-xs text-slate-500 border border-[#D1DEE0]">
                  CogMyra is thinking…
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="mt-auto flex items-center gap-3 border-t border-slate-200 pt-4"
            >
              <input
                type="text"
                placeholder="What would you like to learn today?"
                className="flex-1 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 focus:border-[#26413C] focus:ring-2 focus:ring-[#8AB0AB]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="rounded-2xl bg-slate-950 px-5 py-2 text-sm font-medium text-slate-50 shadow hover:bg-black disabled:cursor-not-allowed disabled:bg-slate-700"
              >
                Send
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
