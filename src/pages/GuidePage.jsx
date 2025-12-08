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
 * Typewriter wrapper that works *with* rich formatting.
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

// --- Persona configs -------------------------------------------------------

const INITIAL_PROMPT_COLLEGE =
  "Hello, I’m the CogMyra Guide. Tell me what you’re working on, and I’ll help you one step at a time.";

const PERSONAS = {
  kid: {
    key: "kid",
    label: "Kid in School",
    uiLabel: "I’m a Kid in School",
    intro:
      "Hi! I’m the CogMyra Guide. How old are you, what grade are you in, and how are you feeling today? Tell me what you’re working on or what you’d like to learn about, and I’ll help you one step at a time.",
    inputPlaceholder:
      "Tell me your age, grade, and what you’re working on (homework, project, or something you’re curious about).",
  },
  college: {
    key: "college",
    label: "College Student",
    uiLabel: "I’m a College Student",
    intro: INITIAL_PROMPT_COLLEGE,
    inputPlaceholder:
      "Hello! Are you an undergraduate or graduate student, and what are you studying? Tell me what you’re working on right now, and I’ll help you one step at a time.",
  },
  professional: {
    key: "professional",
    label: "Professional",
    uiLabel: "I’m a Professional",
    intro:
      "Hi, I’m the CogMyra Guide. Tell me about your role, your goals, and what you’re working on, and I’ll help you one step at a time.",
    inputPlaceholder:
      "Tell me your role, your field, and what you’re working on (project, skill, or decision).",
  },
};

// --- Main page -------------------------------------------------------------

export default function GuidePage() {
  const [personaKey, setPersonaKey] = useState("college");
  const [messages, setMessages] = useState(() => [
    {
      id: "initial-assistant",
      role: "assistant",
      content: INITIAL_PROMPT_COLLEGE,
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const persona = PERSONAS[personaKey];

  // Reset conversation when persona changes
  useEffect(() => {
    setMessages([
      {
        id: `intro-${persona.key}`,
        role: "assistant",
        content: persona.intro,
      },
    ]);
    setInput("");
    setError(null);
  }, [persona.key, persona.intro]);

  const handlePersonaChange = (key) => {
    if (key === personaKey) return;
    setPersonaKey(key);
  };

  async function handleSend(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          persona: persona.label,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Chat error response:", data);
        setError(
          data?.error ||
            "Something went wrong sending your message. Please try again."
        );
        return;
      }

      const data = await res.json();

      // Robust parsing of the new API shape.
      let assistantRole = "assistant";
      let assistantContent = "";

      if (data.message) {
        if (typeof data.message === "string") {
          assistantContent = data.message;
        } else if (typeof data.message === "object") {
          assistantContent =
            typeof data.message.content === "string"
              ? data.message.content
              : "";
          if (data.message.role) assistantRole = data.message.role;
        }
      } else if (Array.isArray(data.choices) && data.choices[0]?.message) {
        // Fallback for older-style responses
        const msg = data.choices[0].message;
        assistantContent = msg.content || "";
        assistantRole = msg.role || "assistant";
      } else if (typeof data.content === "string") {
        assistantContent = data.content;
      }

      if (!assistantContent) {
        assistantContent = "[No response content received.]";
      }

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: assistantRole,
        content: assistantContent,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Network / fetch error:", err);
      setError(
        "Something went wrong sending your message. Please try again in a moment."
      );
    } finally {
      setIsSending(false);
    }
  }

  // Determine which assistant message (if any) should type out.
  const lastAssistantIndex = (() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].role === "assistant") return i;
    }
    return -1;
  })();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Simple header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-slate-900">
              CogMyra Guide
            </span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              Beta
            </span>
          </div>
          <Link
            to="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Home
          </Link>
        </div>
      </header>

      {/* Main layout */}
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Persona picker */}
        <section className="mb-4 rounded-xl bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Who are you today?
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            This helps the Guide adapt tone, pacing, and examples.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.values(PERSONAS).map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => handlePersonaChange(p.key)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                  personaKey === p.key
                    ? "bg-sky-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {p.uiLabel}
              </button>
            ))}
          </div>
        </section>

        {/* Chat section */}
        <section className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Chat with the CogMyra Guide
              </h2>
              <p className="text-xs text-slate-500">
                Persona:{" "}
                <span className="font-medium text-slate-700">
                  {persona.label}
                </span>
              </p>
            </div>
          </div>

          {/* Message list */}
          <div className="mb-4 max-h-[480px] overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 sm:px-4 sm:py-4">
            {messages.map((m, index) => {
              const isAssistant = m.role !== "user";
              const isActiveAssistant = isAssistant && index === lastAssistantIndex;

              return (
                <div
                  key={m.id ?? index}
                  className={`mb-3 flex ${
                    isAssistant ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      isAssistant
                        ? "bg-white text-slate-900"
                        : "bg-sky-600 text-white"
                    }`}
                  >
                    {isAssistant ? (
                      <TypewriterFormatted
                        text={m.content}
                        active={isActiveAssistant}
                      />
                    ) : (
                      <span className="whitespace-pre-wrap">{m.content}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Input form */}
          <form onSubmit={handleSend} className="space-y-2">
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={persona.inputPlaceholder}
              disabled={isSending}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Press Enter to send, Shift+Enter for a new line.
              </p>
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium ${
                  isSending || !input.trim()
                    ? "cursor-not-allowed bg-slate-200 text-slate-500"
                    : "bg-sky-600 text-white hover:bg-sky-700"
                }`}
              >
                {isSending ? "Thinking…" : "Send"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
