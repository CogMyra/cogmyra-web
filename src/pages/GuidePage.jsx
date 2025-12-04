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
      "CogMyra_ Hello! How old are you, what would you like to learn about, and how are you feeling today?",
    system:
      "The learner is a child or teen (roughly ages 6–17) using CogMyra for school. Use warm, clear, age-appropriate language, lots of concrete examples, and step-by-step scaffolding.",
  },
  college: {
    label: "I’m a College Student",
    badge: "College Student",
    intro:
      "CogMyra_ Hello! Are you an undergraduate or graduate student, and what are you studying? Tell me which class or assignment you’re working on and how you’re feeling about it, and I’ll help you work through it one step at a time.",
    system:
      "The learner is a college or graduate student (roughly ages 18–25). Support with reading, writing, studying, exams, research, and complex concepts using rigorous but accessible explanations.",
  },
  professional: {
    label: "I’m a Professional",
    badge: "Professional",
    intro:
      "CogMyra_ Hello! What kind of work do you do, and what are you working on right now? Tell me your role, your field, and what you’d like to make progress on, and I’ll help you one step at a time.",
    system:
      "The learner is a working professional (25+) using CogMyra for projects, communication, leadership, and skill-building in a real-world context. Be concise, applied, and outcome-focused.",
  },
};

// Very simple Markdown → HTML helper for assistant replies
function basicMarkdownToHtml(text) {
  if (!text) return "";

  let html = text;

  // Escape HTML first
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headings
  html = html.replace(/^### (.*)$/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*)$/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*)$/gim, "<h1>$1</h1>");

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Basic line breaks between paragraphs
  html = html.replace(/\n{2,}/g, "<br/><br/>");

  return html;
}

function buildPersonaSystemMessage(personaKey) {
  const persona = PERSONAS[personaKey] ?? PERSONAS.college;
  return {
    role: "system",
    content: `Learner persona:\n${persona.system}`,
  };
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

  // Initialize basic speech recognition if available
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript || "";
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      rec.onend = () => {
        recognitionActiveRef.current = false;
      };

      speechRecognitionRef.current = rec;
    }
  }, []);

  // Change persona + reset opening prompt (assistant only)
  const handlePersonaChange = (key) => {
    setPersona(key);
    const intro = PERSONAS[key].intro;
    setMessages([{ role: "assistant", content: intro }]);
    setError("");
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    setError("");

    const userMessage = { role: "user", content: trimmed };
    const baseMessages = [...messages, userMessage];

    setMessages(baseMessages);
    setInput("");

    try {
      const apiMessages = [
        buildPersonaSystemMessage(persona),
        ...baseMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ];

      const res = await fetch("https://cogmyra.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(APP_KEY ? { "x-app-key": APP_KEY } : {}),
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) {
        console.error("Chat API error status:", res.status);
        const text = await res.text().catch(() => "");
        console.error("Response body:", text);
        setError("Something went wrong talking to the Guide. Please try again.");
        setIsSending(false);
        return;
      }

      const data = await res.json();
      const fullReply = data.reply || "";

      // Typing effect
      setIsTyping(true);
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let index = 0;
      const speedMs = 12;

      const intervalId = setInterval(() => {
        index++;
        const current = fullReply.slice(0, index);

        setMessages((prev) => {
          const cloned = [...prev];
          const lastIdx = cloned.length - 1;
          if (lastIdx >= 0 && cloned[lastIdx].role === "assistant") {
            cloned[lastIdx] = { ...cloned[lastIdx], content: current };
          }
          return cloned;
        });

        if (index >= fullReply.length) {
          clearInterval(intervalId);
          setIsTyping(false);
        }
      }, speedMs);

      setIsSending(false);
    } catch (err) {
      console.error("Chat request failed:", err);
      setError("Something went wrong talking to the Guide. Please try again.");
      setIsSending(false);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePlayReply = () => {
    const lastAssistant = [...messages]
      .reverse()
      .find((m) => m.role === "assistant" && m.content.trim().length > 0);

    if (!lastAssistant) return;

    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech isn’t available in this browser.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(lastAssistant.content);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = () => {
    const rec = speechRecognitionRef.current;
    if (!rec) {
      alert("Voice input isn’t available in this browser.");
      return;
    }

    if (!recognitionActiveRef.current) {
      recognitionActiveRef.current = true;
      rec.start();
    } else {
      recognitionActiveRef.current = false;
      rec.stop();
    }
  };

  return (
    <div className="min-h-screen bg-[#E2E7E5] text-slate-900 flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-slate-300 bg-[#E2E7E5]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="text-lg sm:text-xl font-semibold text-slate-900"
          >
            CogMyra_
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-800">
            <span className="h-1.5 w-6 rounded-full bg-emerald-500" />
            <span className="font-medium tracking-wide">CMG Engine v1</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-10">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              CogMyra Guide
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Personalized Learning Coach
            </p>
          </div>

          {/* Persona buttons */}
          <div className="mb-4 flex flex-wrap gap-3">
            {Object.entries(PERSONAS).map(([key, value]) => {
              const isActive = key === persona;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handlePersonaChange(key)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition ${
                    isActive
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                      : "border-slate-300 bg-white text-slate-800 hover:border-emerald-500 hover:text-emerald-800"
                  }`}
                >
                  {value.label}
                </button>
              );
            })}
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-4 rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-800">
              {error}
            </div>
          )}

          {/* Chat card */}
          <div className="rounded-3xl bg-white shadow-lg border border-slate-200 p-4 sm:p-6 flex flex-col min-h-[420px]">
            {/* Messages area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto space-y-4 pr-1"
            >
              {messages.map((m, idx) => (
                <div key={idx} className="flex">
                  {m.role === "assistant" ? (
                    <div className="max-w-[85%] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed">
                      <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        COGMYRA
                      </div>
                      <div
                        className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: basicMarkdownToHtml(m.content),
                        }}
                      />
                    </div>
                  ) : (
                    <div className="ml-auto max-w-[85%] rounded-2xl bg-emerald-700 px-4 py-3 text-sm leading-relaxed text-white">
                      <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100">
                        YOU
                      </div>
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="mt-1 flex">
                  <div className="rounded-2xl bg-slate-100 border border-slate-200 px-3 py-2 text-xs text-slate-500">
                    CogMyra_ is thinking…
                  </div>
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="flex items-end gap-3">
                <textarea
                  rows={2}
                  className="flex-1 resize-none rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  placeholder="Ask a question, paste an assignment, or tell CogMyra what you’re working on…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isSending || !input.trim()}
                  className={`rounded-full px-5 py-2 text-sm font-semibold shadow-sm ${
                    isSending || !input.trim()
                      ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {isSending ? "Sending…" : "Send"}
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handlePlayReply}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 hover:border-emerald-500 hover:text-emerald-700 transition"
                  >
                    <span role="img" aria-hidden="true">
                      🔊
                    </span>
                    <span>Play reply</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 hover:border-emerald-500 hover:text-emerald-700 transition"
                  >
                    <span role="img" aria-hidden="true">
                      🎙️
                    </span>
                    <span>Voice input</span>
                  </button>
                </div>
                <div className="hidden sm:block">
                  CogMyra remembers this conversation while your tab is open.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
