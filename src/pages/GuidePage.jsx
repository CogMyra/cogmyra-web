// src/pages/GuidePage.jsx

import CogMyraLogo from "../components/CogMyraLogo";
import { useEffect, useRef, useState } from "react";

function formatTimestamp(date = new Date()) {
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function GuidePage() {
  const [threads, setThreads] = useState(() => [
    {
      id: "welcome",
      title: "Welcome to CogMyra Guide",
      createdAt: formatTimestamp(),
      messages: [
        {
          role: "user",
          content: "I have a test on the countries of europe next week. Please help me study.",
        },
        {
          role: "assistant",
          content:
            "This is a placeholder response from CogMyra. Once you connect the Guide API here, this text will come directly from your GPT-powered coach using all of your uploaded resources.",
        },
      ],
    },
  ]);

  const [activeId, setActiveId] = useState("welcome");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [displayedAssistantText, setDisplayedAssistantText] = useState("");
  const typingTimeoutRef = useRef(null);

  const activeThread = threads.find((t) => t.id === activeId);

  function handleNewThread() {
    const id = `thread-${Date.now()}`;
    const createdAt = formatTimestamp();
    const newThread = {
      id,
      title: "New conversation",
      createdAt,
      messages: [],
    };
    setThreads((prev) => [newThread, ...prev]);
    setActiveId(id);
    setInput("");
    setDisplayedAssistantText("");
    setIsTyping(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !activeThread) return;

    const userMessage = { role: "user", content: trimmed };
    const assistantMessage = {
      role: "assistant",
      content:
        "This is a placeholder response from CogMyra. Once you connect the Guide API here, this text will come directly from your GPT-powered coach using all of your uploaded resources.",
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? { ...t, messages: [...t.messages, userMessage, assistantMessage] }
          : t
      )
    );

    setInput("");
    setIsTyping(true);
    setDisplayedAssistantText("");

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const fullText = assistantMessage.content;
    let i = 0;

    const step = () => {
      i += 3;
      setDisplayedAssistantText(fullText.slice(0, i));
      if (i < fullText.length) {
        typingTimeoutRef.current = setTimeout(step, 30);
      } else {
        setIsTyping(false);
      }
    };

    step();
  }

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#03120E] text-slate-900">
      {/* Top bar matches homepage */}
      <header className="border-b border-slate-800/60 bg-[#3E505B] text-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <CogMyraLogo />
          <a
            href="/"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 shadow-sm hover:bg-slate-800 transition"
          >
            Back to homepage
          </a>
        </div>
      </header>

      <main className="bg-[#E2ECE8] min-h-[calc(100vh-64px)]">
        <div className="mx-auto flex max-w-6xl gap-6 px-4 py-10 lg:px-6">
          {/* Left: history */}
          <aside className="hidden w-64 flex-shrink-0 flex-col gap-3 rounded-3xl bg-[#0E1720] p-4 text-slate-100 shadow-lg md:flex">
            <button
              onClick={handleNewThread}
              className="mb-2 w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-200 transition"
            >
              + New
            </button>

            <div className="flex-1 space-y-1 overflow-y-auto">
              {threads.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveId(t.id);
                    setDisplayedAssistantText("");
                    setIsTyping(false);
                  }}
                  className={`w-full rounded-2xl px-3 py-2 text-left text-xs leading-tight transition ${
                    t.id === activeId
                      ? "bg-slate-700 text-slate-50"
                      : "bg-slate-900/40 text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <div className="font-semibold truncate">{t.title}</div>
                  <div className="mt-1 text-[10px] text-slate-400">
                    {t.createdAt}
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* Right: conversation */}
          <section className="flex flex-1 flex-col rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
              <h1 className="text-base font-semibold text-slate-800">
                CogMyra Guide
              </h1>
              <span>Patient, adaptive learning—one conversation at a time.</span>
            </div>

            <div className="flex-1 overflow-y-auto rounded-2xl bg-slate-50 p-4">
              {activeThread && activeThread.messages.length > 0 ? (
                <div className="space-y-4">
                  {activeThread.messages.map((m, i) => (
                    <div
                      key={i}
                      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "ml-auto bg-slate-900 text-slate-50"
                          : "mr-auto bg-slate-200 text-slate-900"
                      }`}
                    >
                      {m.content}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="mr-auto max-w-[80%] rounded-2xl bg-slate-200 px-4 py-2 text-sm leading-relaxed text-slate-900">
                      {displayedAssistantText || "CogMyra is thinking…"}
                      {displayedAssistantText && displayedAssistantText.length < activeThread.messages[activeThread.messages.length - 1].content.length && (
                        <span className="animate-pulse">▌</span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center text-sm text-slate-500">
                  <p>What would you like to learn today?</p>
                  <p className="mt-1 text-xs text-slate-400">
                    CogMyra will use your uploaded resources once the API is
                    connected.
                  </p>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What would you like to learn today?"
                className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-2xl bg-slate-900 px-5 py-2 text-sm font-semibold text-slate-50 hover:bg-slate-800 transition disabled:opacity-40"
                disabled={!input.trim()}
              >
                Send
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
