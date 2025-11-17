// src/pages/GuidePage.jsx
import { useEffect, useRef, useState } from "react";

export default function GuidePage() {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi, I’m CogMyra Guide. Tell me who you are (student, educator, or professional) and what you’re working on. I’ll tailor support just for you.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [typingText, setTypingText] = useState("");
  const typingIntervalRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, typingText]);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    setTypingText("");

    const history = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    let replyText =
      "I’m having trouble reaching the CogMyra engine right now. But I’m here—tell me more about your goals and context, and we’ll structure a path together.";

    try {
      const res = await fetch("/api/guide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: trimmed,
          history,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.reply === "string" && data.reply.trim().length > 0) {
          replyText = data.reply;
        }
      } else {
        console.error("Guide API error:", res.status, await res.text());
      }
    } catch (err) {
      console.error("Guide API fetch error:", err);
    }

    startTypingAnimation(replyText);
  }

  function startTypingAnimation(fullText) {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

    setTypingText("");
    setIsSending(false);

    let index = 0;
    typingIntervalRef.current = setInterval(() => {
      index += 1;
      setTypingText(fullText.slice(0, index));

      if (index >= fullText.length) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;

        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: fullText,
          },
        ]);
        setTypingText("");
      }
    }, 18);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#03120E] text-slate-50">
      {/* Top nav */}
      <header className="border-b border-white/5 bg-[#03120E]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-lg sm:text-xl tracking-[0.35em] font-semibold text-slate-50">
            COGMYRA_
          </div>
<div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200/80">
  <a
    href="/"
    className="rounded-full border border-white/15 px-4 py-1.5 text-[11px] sm:text-xs font-medium text-slate-50/90 hover:bg-white/5 transition"
  >
    Back to Home
  </a>
</div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r border-white/10 bg-[#020B08]">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xs font-semibold tracking-[0.18em] text-slate-300 uppercase">
              HISTORY
            </h2>
            <span className="rounded-full bg-[#3E505B]/30 text-[10px] px-2 py-0.5 text-slate-100">
              Live
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 text-xs text-slate-300/80 space-y-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                TODAY
              </div>
              <div className="mt-2 space-y-1.5">
                <div className="rounded-lg bg-white/5 px-3 py-2 text-[11px] leading-snug border border-white/10">
                  Current CogMyra Guide session
                </div>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                COMING SOON
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Multiple saved sessions, pinned threads, and structured learning paths.
              </p>
            </div>
          </div>
        </aside>

        {/* Right side */}
        <main className="flex-1 bg-[#F5F5F2] text-slate-900 flex flex-col">
          {/* Top info bar (minimal, with color accents) */}
          <div className="border-b border-slate-200 bg-[#F5F5F2]/95">
            <div className="mx-auto max-w-4xl px-4 sm:px-8 py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h1 className="text-sm font-semibold text-[#3E505B]">
                  CogMyra Guide
                </h1>
                <span className="hidden sm:inline rounded-full bg-[#8AB0AB]/25 px-3 py-1 text-[11px] font-medium text-[#3E505B]">
                  Students • Educators • Professionals
                </span>
              </div>

              <span className="rounded-full border border-[#8AB0AB]/60 bg-[#8AB0AB]/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.18em] text-[#3E505B] uppercase">
                Beta
              </span>
            </div>
          </div>

          {/* Conversation area */}
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-4xl px-4 sm:px-8 py-6 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.role === "user" ? "flex justify-end" : "flex justify-start"
                  }
                >
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[80%] rounded-2xl bg-[#3E505B] px-4 py-3 text-sm text-slate-50 shadow-sm"
                        : "max-w-[80%] rounded-2xl bg-white px-4 py-3 text-sm text-slate-900 shadow-sm border border-slate-200/80"
                    }
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                  </div>
                </div>
              ))}

              {typingText && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl bg-white px-4 py-3 text-sm text-slate-900 shadow-sm border border-slate-200/80">
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {typingText}
                      <span className="inline-block animate-pulse">▌</span>
                    </p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <div className="border-t border-slate-200 bg-[#F5F5F2]/98">
            <form
              onSubmit={handleSubmit}
              className="mx-auto max-w-4xl px-4 sm:px-8 py-4 flex flex-col gap-3 sm:flex-row sm:items-end"
            >

<div className="flex-1">
  <textarea
    rows={2}
    className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#8AB0AB] focus:border-[#8AB0AB]"
    placeholder="Describe who you are, what you’re working on, and what you need help with…"
    value={input}
    onChange={(e) => setInput(e.target.value)}
  />
</div>
              <div className="flex flex-row sm:flex-col gap-2 sm:w-32">
                <button
                  type="submit"
                  disabled={!input.trim() || isSending}
                  className="inline-flex justify-center items-center rounded-2xl bg-[#3E505B] px-4 py-2 text-sm font-semibold text-slate-50 shadow-md transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? "Thinking…" : "Send"}
                </button>
                <div className="text-[10px] text-slate-500 text-left sm:text-right">
                  Powered by CogMyra Guide (beta)
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
