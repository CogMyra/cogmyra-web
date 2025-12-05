// src/pages/GuidePage.jsx

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const APP_KEY = import.meta.env.VITE_APP_GATE_KEY || "";
console.log("APP_KEY (frontend) =", APP_KEY);

const PERSONAS = {
  kid: {
    label: "I’m a Kid in School",
    badge: "Kid in School",
    intro:
      "Hello! How old are you, what would you like to learn about, and how are you feeling today?",
    system:
      "The learner is a child or teen (roughly ages 6–17) using CogMyra for school. Use warm, clear, age-appropriate language, lots of concrete examples, and step-by-step scaffolding.",
  },
  college: {
    label: "I’m a College Student",
    badge: "College Student",
    intro:
      "Hello! Are you an undergraduate or graduate student, and what are you studying? Tell me which class or assignment you’re working on and how you’re feeling about it, and I’ll help you work through it one step at a time.",
    system:
      "The learner is a college or graduate student (roughly ages 18–25). Default to short, diagnostic replies. The first reply to any new request must be no more than 3–4 sentences and must not include long outlines, multi-section essays, or large information dumps unless the learner explicitly asks. The first reply must briefly reflect the student’s request and then ask one clarifying question or offer two or three options for how to proceed. Subsequent replies should stay short (1–3 paragraphs or up to 8 bullets) and focus on a single next step at a time, always checking understanding and co-building the answer with the student instead of assuming the whole assignment.",
  },
  professional: {
    label: "I’m a Professional",
    badge: "Professional",
    intro:
      "Hello! What kind of work do you do, and what are you working on right now? Tell me your role, your field, and what you’d like to make progress on, and I’ll help you one step at a time.",
    system:
      "The learner is a working professional (25+) using CogMyra for projects, communication, leadership, and skill-building in a real-world context. Be concise, applied, and outcome-focused.",
  },
};

function buildPersonaSystemMessage(personaKey) {
  const persona = PERSONAS[personaKey] ?? PERSONAS.college;
  return {
    role: "system",
    content: `Learner persona:\n${persona.system}`,
  };
}

// Very small Markdown → HTML helper for assistant messages
function basicMarkdownToHtml(text) {
  if (!text) return "";

  // Escape HTML
  let safe = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold: **text**
  safe = safe.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  const lines = safe.split("\n");
  const html = [];
  let inList = false;

  for (let raw of lines) {
    const line = raw.trimEnd();

    // Horizontal rule
    if (line.trim() === "---") {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push("<hr />");
      continue;
    }

    // Headings
    if (/^###\s+/.test(line)) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push("<h3>" + line.replace(/^###\s+/, "") + "</h3>");
      continue;
    }
    if (/^##\s+/.test(line)) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push("<h2>" + line.replace(/^##\s+/, "") + "</h2>");
      continue;
    }
    if (/^#\s+/.test(line)) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push("<h1>" + line.replace(/^#\s+/, "") + "</h1>");
      continue;
    }

    // Bulleted list
    if (/^[-*]\s+/.test(line)) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push("<li>" + line.replace(/^[-*]\s+/, "") + "</li>");
      continue;
    }

    // Blank line
    if (line.trim() === "") {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push("<br />");
      continue;
    }

    // Normal paragraph
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
    html.push("<p>" + line + "</p>");
  }

  if (inList) html.push("</ul>");

  return html.join("");
}

export default function GuidePage() {
  const [persona, setPersona] = useState("college");
  const [messages, setMessages] = useState(() => [
    { role: "assistant", content: PERSONAS.college.intro },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const recognitionActiveRef = useRef(false);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  function handlePersonaChange(nextPersona) {
    setPersona(nextPersona);
    setMessages([{ role: "assistant", content: PERSONAS[nextPersona].intro }]);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError("");
    setIsSending(true);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-key": APP_KEY,
        },
        body: JSON.stringify({
          messages: [
            buildPersonaSystemMessage(persona),
            ...messages,
            userMessage,
          ],
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Network error");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let assistantContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        assistantContent += chunk;

        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last && last.role === "assistant") {
            copy[copy.length - 1] = {
              ...last,
              content: assistantContent,
            };
          }
          return copy;
        });
      }
    } catch (err) {
      console.error(err);
      setError(
        "Something went wrong while talking to CogMyra_. Please try again."
      );
    } finally {
      setIsSending(false);
      setIsTyping(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-slate-50/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link
            to="/"
            className="text-lg font-semibold tracking-tight text-slate-900"
          >
            CogMyra_
          </Link>
          <span className="text-xs font-medium text-emerald-700">
            CMG Engine v1
          </span>
        </div>
      </header>

      <section className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            CogMyra Guide
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Personalized Learning Coach
          </p>
        </div>

        {/* Persona buttons */}
        <div className="mt-4 flex flex-wrap gap-3">
          {Object.entries(PERSONAS).map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => handlePersonaChange(key)}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                persona === key
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
              }`}
            >
              {value.label}
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div className="mt-6 flex h-[560px] flex-col rounded-3xl border border-slate-200 bg-slate-50/80 shadow-sm">
          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
          >
            {messages.map((message, index) => {
              const isAssistant = message.role === "assistant";
              const label = isAssistant ? "CogMyra_" : "You";

              return (
                <div
                  key={index}
                  className={`flex ${
                    isAssistant ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-3xl px-4 py-3 text-sm shadow-sm ${
                      isAssistant
                        ? "border border-slate-200 bg-white text-slate-900"
                        : "bg-emerald-800 text-white"
                    }`}
                  >
                    <div className="mb-1 text-xs font-semibold tracking-[0.15em] text-slate-500">
                      {label.toUpperCase()}
                    </div>
                    <div
                      className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-strong:font-semibold"
                      dangerouslySetInnerHTML={
                        isAssistant
                          ? { __html: basicMarkdownToHtml(message.content) }
                          : { __html: message.content }
                      }
                    />
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-sm">
                  CogMyra_ is thinking…
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-slate-200 bg-white/80 px-4 py-3"
          >
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                placeholder="Tell CogMyra_ what you’re working on…"
                className="min-h-[44px] flex-1 resize-none rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium text-white shadow-sm ${
                  isSending || !input.trim()
                    ? "bg-emerald-300"
                    : "bg-emerald-700 hover:bg-emerald-800"
                }`}
              >
                {isSending ? "Sending…" : "Send"}
              </button>
            </div>
            {error && (
              <p className="mt-1 text-xs text-red-600">
                {error}
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
