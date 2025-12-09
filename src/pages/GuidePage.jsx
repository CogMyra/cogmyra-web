// src/pages/GuidePage.jsx

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/**
 * Render basic rich text:
 * - Splits on double newlines into blocks.
 * - Turns lines starting with "- " into <ul><li>.
 * - Everything else becomes a <p>.
 */
function renderFormattedText(text) {
  if (!text) return null;

  const blocks = text.split(/\n\n+/);

  return blocks.map((block, index) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Bullet list block: one or more lines starting with "- "
    if (/^- /.test(trimmed) || /\n- /.test(trimmed)) {
      const items = trimmed
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("- "))
        .map((line) => line.replace(/^- /, "").trim());

      if (!items.length) {
        return (
          <p
            key={index}
            className="mb-2 whitespace-pre-wrap text-slate-800 leading-relaxed"
          >
            {trimmed}
          </p>
        );
      }

      return (
        <ul
          key={index}
          className="mb-2 list-disc list-inside space-y-1 text-slate-800 leading-relaxed"
        >
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    }

    // Default: paragraph block
    return (
      <p
        key={index}
        className="mb-2 whitespace-pre-wrap text-slate-800 leading-relaxed"
      >
        {trimmed}
      </p>
    );
  });
}

/**
 * Typewriter wrapper that works with rich formatting.
 * It gradually reveals the text, and at each step we run the same
 * formatter that we use for full messages.
 */
function TypewriterFormatted({ text, speed = 12, active }) {
  const [displayed, setDisplayed] = useState("");
  const lastTextRef = useRef(text);

  useEffect(() => {
    // If this instance is not active (older assistant messages),
    // just show full text immediately.
    if (!active) {
      setDisplayed(text || "");
      lastTextRef.current = text;
      return;
    }

    if (!text) {
      setDisplayed("");
      lastTextRef.current = "";
      return;
    }

    // Reset when a *different* assistant message arrives.
    if (lastTextRef.current !== text) {
      lastTextRef.current = text;
      setDisplayed("");
    }

    let i = 0;
    let cancelled = false;

    function tick() {
      if (cancelled) return;

      i += 2; // a couple of characters at a time feels smooth
      if (i >= text.length) {
        setDisplayed(text);
        return;
      }
      setDisplayed(text.slice(0, i));
      window.setTimeout(tick, speed);
    }

    tick();

    return () => {
      cancelled = true;
    };
  }, [text, speed, active]);

  return <>{renderFormattedText(displayed)}</>;
}

// --- Persona configs -------------------------------------------------

const PERSONA_CONFIG = {
  kid: {
    label: "Kid in School",
    headerLabel: "Kid in School",
    initialAssistant:
      "Hi! I’m the CogMyra Guide. How old are you, what grade are you in, and how are you feeling today? Tell me what you’re working on or what you’d like to learn about, and I’ll help one step at a time.",
    placeholder:
      "Tell me your age, grade, and what you’d like help with today.",
  },
  college: {
    label: "College Student",
    headerLabel: "College Student",
    initialAssistant:
      "Hello, I’m the CogMyra Guide. Tell me what you’re working on, and I’ll help you one step at a time.",
    placeholder:
      "Tell me your program, whether you’re undergrad or grad, and what you’re working on.",
  },
  professional: {
    label: "Professional",
    headerLabel: "Professional",
    initialAssistant:
      "Hi, I’m the CogMyra Guide. Tell me your role, what you’re working on, and what you’d like to make progress on today. I’ll help you one step at a time.",
    placeholder:
      "Tell me your role and the project or task you’d like help with today.",
  },
};

const API_BASE = import.meta.env.DEV ? "http://localhost:8789" : "";

// --- Main page -------------------------------------------------------

export default function GuidePage() {
  const [persona, setPersona] = useState("college");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState(""); // always user-typed only
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const messagesEndRef = useRef(null);

  const personaConfig = PERSONA_CONFIG[persona];

  // Seed initial assistant message whenever persona changes
  useEffect(() => {
    setMessages([
      {
        id: "assistant-initial",
        role: "assistant",
        from: "assistant",
        text: personaConfig.initialAssistant,
      },
    ]);
    setInputValue("");
    setError(null);
  }, [persona, personaConfig.initialAssistant]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  async function sendMessage(userText) {
    if (!userText.trim()) return;

    setIsSending(true);
    setError(null);

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      from: "user",
      text: userText.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");

    try {
      const payload = {
        messages: newMessages.map((m) => ({
          role: m.role,
          content: m.text,
        })),
        persona: personaConfig.label,
      };

      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      const assistantContent =
        data?.message?.content || "Sorry, I had trouble replying just now.";

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        from: "assistant",
        text: assistantContent,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Something went wrong sending your message. Please try again.");
    } finally {
      setIsSending(false);
      setIsTesting(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (isSending) return;
    sendMessage(inputValue);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  // Simple “Test” shortcut
  function handleTestClick() {
    if (isSending) return;
    setIsTesting(true);
    const sample =
      persona === "kid"
        ? "Tell me about how trees grow."
        : persona === "professional"
        ? "Help me plan my work for the next two hours."
        : "I have an exam coming up and I’m not sure how to study.";
    sendMessage(sample);
  }

  const isLastAssistant = (index) => {
    // last assistant message index
    const lastIndex = [...messages]
      .reverse()
      .findIndex((m) => m.role === "assistant");
    if (lastIndex === -1) return false;
    const lastAssistantGlobalIndex = messages.length - 1 - lastIndex;
    return index === lastAssistantGlobalIndex;
  };

  const currentPlaceholder = personaConfig.placeholder;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight text-slate-900">
              CogMyra Guide
            </span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-100">
              Beta
            </span>
          </div>
          <nav className="text-sm">
            <Link
              to="/"
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6">
        {/* Persona selector */}
        <section className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
            Who are you today?
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            This helps the Guide adapt tone, pacing, and examples.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {[
              { id: "kid", label: "I’m a Kid in School" },
              { id: "college", label: "I’m a College Student" },
              { id: "professional", label: "I’m a Professional" },
            ].map((opt) => {
              const selected = persona === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPersona(opt.id)}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-medium border transition-colors",
                    selected
                      ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
                  ].join(" ")}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Chat card */}
        <section className="flex-1 rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Chat with the CogMyra Guide
              </h2>
              <p className="text-xs text-slate-500">
                Persona: {personaConfig.headerLabel}
              </p>
            </div>
            <button
              type="button"
              onClick={handleTestClick}
              disabled={isSending}
              className="rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isTesting ? "Testing…" : "test"}
            </button>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl bg-slate-50/80 p-4 max-h-[480px] overflow-y-auto border border-slate-100">
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              const bubbleBase =
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm";
              const bubbleClasses = isUser
                ? `${bubbleBase} ml-auto bg-sky-600 text-white`
                : `${bubbleBase} bg-white text-slate-900`;

              return (
                <div
                  key={msg.id}
                  className={`flex w-full ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className={bubbleClasses}>
                    {isUser ? (
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {msg.text}
                      </p>
                    ) : (
                      <TypewriterFormatted
                        text={msg.text}
                        active={isLastAssistant(index)}
                        speed={12}
                      />
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-2">
            <textarea
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-400"
              rows={3}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={currentPlaceholder}
              disabled={isSending}
            />

            <div className="flex items-center justify-between text-xs text-slate-500">
              <p>Press Enter to send, Shift+Enter for a new line.</p>
              <button
                type="submit"
                disabled={isSending}
                className="inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSending ? "Sending…" : "Send"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
