// src/pages/GuidePage.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Simple helper: convert a small subset of Markdown to HTML
function basicMarkdownToHtml(text) {
  if (!text) return "";

  let html = text;

  // Escape basic HTML characters first
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold: **text**
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Headings: lines starting with ##
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Bullet lists: lines starting with "- " or "* "
  // Group consecutive bullets into <ul> blocks
  const lines = html.split("\n");
  let inList = false;
  const out = [];

  for (const line of lines) {
    const bulletMatch = /^[-*]\s+(.*)/.exec(line.trim());
    if (bulletMatch) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${bulletMatch[1]}</li>`);
    } else {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      if (line.trim().length > 0) {
        out.push(`<p>${line}</p>`);
      } else {
        out.push("");
      }
    }
  }
  if (inList) out.push("</ul>");

  html = out.join("\n");

  return html;
}

const API_URL = "/api/chat";
const appKey = import.meta.env.VITE_APP_GATE_KEY;

const PERSONA_CONFIG = {
  kid: {
    label: "I’m a Kid in School",
    description: "Ages 6–17 • School support",
    intro:
      "CogMyra_ Hello! How old are you, what would you like to learn about, and how are you feeling today?",
  },
  college: {
    label: "I’m a College Student",
    description: "Undergrad or grad • Classes, papers, exams",
    intro:
      "CogMyra_ Hello! Are you an undergraduate or graduate student, and what are you studying? Tell me which class or assignment you’re working on and how you’re feeling about it, and I’ll help you work through it one step at a time.",
  },
  professional: {
    label: "I’m a Professional",
    description: "Work projects • Skills • Leadership",
    intro:
      "CogMyra_ Hello! What kind of work do you do, and what are you working on right now? Tell me your role, your field, and what you’d like to make progress on, and I’ll help you one step at a time.",
  },
};

export default function GuidePage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState("college");

  // Typing effect state
  const [pendingAssistantText, setPendingAssistantText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);

  const scrollRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, typingIndex]);

  // Typing effect: reveal assistant text gradually
  useEffect(() => {
    if (!isTyping || !pendingAssistantText) return;

    const interval = setInterval(() => {
      setTypingIndex((prev) => {
        const next = prev + 3; // characters per tick
        if (next >= pendingAssistantText.length) {
          // Finish typing
          setIsTyping(false);
          setMessages((prevMessages) => {
            const updated = [...prevMessages];
            const lastIndex = updated.length - 1;
            if (lastIndex >= 0 && updated[lastIndex].role === "assistant") {
              updated[lastIndex] = {
                ...updated[lastIndex],
                content: pendingAssistantText,
              };
            }
            return updated;
          });
          return pendingAssistantText.length;
        }

        // Update last assistant message with partial text
        setMessages((prevMessages) => {
          const updated = [...prevMessages];
          const lastIndex = updated.length - 1;
          if (lastIndex >= 0 && updated[lastIndex].role === "assistant") {
            updated[lastIndex] = {
              ...updated[lastIndex],
              content: pendingAssistantText.slice(0, next),
            };
          }
          return updated;
        });

        return next;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [isTyping, pendingAssistantText]);

  // Initialize with the default persona intro (once)
  useEffect(() => {
    const persona = PERSONA_CONFIG[selectedPersona];
    setMessages([
      {
        role: "assistant",
        content: persona.intro,
      },
    ]);
  }, []); // only on first mount

  function handlePersonaChange(key) {
    setSelectedPersona(key);

    const persona = PERSONA_CONFIG[key];

    // If there is no conversation yet or only the initial intro, reset to this intro
    setMessages([
      {
        role: "assistant",
        content: persona.intro,
      },
    ]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userContent = input.trim();

    // Add user message locally
    const newMessages = [
      ...messages,
      { role: "user", content: userContent },
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try
    {
      // Build a persona hint to send on the very first turn
      let personaPrefix = "";
      if (messages.length === 1 && messages[0].role === "assistant") {
        // First real user turn in this session
        if (selectedPersona === "kid") {
          personaPrefix =
            "[Persona: Kid in school, ages 6–17. Use encouraging, concrete language and short steps.] ";
        } else if (selectedPersona === "college") {
          personaPrefix =
            "[Persona: College student (undergrad or graduate). Use academically rigorous but approachable language with clear structure.] ";
        } else if (selectedPersona === "professional") {
          personaPrefix =
            "[Persona: Working professional. Use concise, outcome-oriented, applied language with clear steps.] ";
        }
      }

      const apiMessages =
        personaPrefix && newMessages.length > 0
          ? [
              // First user message includes persona prefix
              ...newMessages.slice(0, newMessages.length - 1),
              {
                role: "user",
                content: `${personaPrefix}${userContent}`,
              },
            ]
          : newMessages;

const res = await fetch("https://cogmyra.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-key": appKey || "",
        },
        body: JSON.stringify({
          messages: apiMessages,
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      const assistantText = data.reply || "";

      // Add an empty assistant message which will be filled by the typing effect
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "" },
      ]);
      setPendingAssistantText(assistantText);
      setTypingIndex(0);
      setIsTyping(true);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I ran into a problem reaching the CogMyra engine. Please try again in a moment.",
        },
      ]);
      setIsTyping(false);
      setPendingAssistantText("");
      setTypingIndex(0);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F5F2] text-slate-900 flex flex-col">
      {/* Top bar */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="text-lg sm:text-xl font-semibold text-slate-900 tracking-[0.18em]"
          >
            CogMyra_
          </Link>

          <div className="text-[11px] sm:text-xs font-medium text-slate-500">
            Personalized Learning Coach
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10 lg:flex-row lg:items-start">
          {/* Left column: intro + persona buttons */}
          <div className="w-full lg:w-1/3 space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
                CogMyra Guide
              </h1>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                A focused space to work through concepts, assignments, and skills
                with a guide that adapts to who you are and what you’re trying
                to learn.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                WHO’S USING COGMYRA?
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(PERSONA_CONFIG).map(([key, config]) => {
                  const isActive = selectedPersona === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handlePersonaChange(key)}
                      className={`rounded-full border px-3 py-1.5 text-xs text-left transition ${
                        isActive
                          ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-emerald-500 hover:text-emerald-900"
                      }`}
                    >
                      <div className="font-semibold">{config.label}</div>
                      <div className="text-[10px] text-slate-500">
                        {config.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white/80 p-3 text-[11px] text-slate-600 leading-relaxed">
              CogMyra remembers context within this session and tailors
              explanations, practice, and feedback to your path. Use plain
              language—this space is for genuine thinking, not performance.
            </div>
          </div>

          {/* Right column: chat card */}
          <div className="w-full lg:flex-1 flex justify-center">
            <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white/90 shadow-sm flex flex-col overflow-hidden">
              {/* Chat header */}
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-slate-700">
                    Session active
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Persona:{" "}
                  <span className="font-medium text-slate-700">
                    {PERSONA_CONFIG[selectedPersona].label}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50/60"
              >
                {messages.map((msg, idx) => {
                  const isUser = msg.role === "user";
                  const isAssistant = msg.role === "assistant";

                  return (
                    <div
                      key={idx}
                      className={`flex ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                          isUser
                            ? "bg-slate-900 text-slate-50"
                            : "bg-white border border-slate-200 text-slate-800 chat-response"
                        }`}
                      >
                        <div className="mb-1 text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-500">
                          {isUser ? "YOU" : "COGMYRA"}
                        </div>

                        {isAssistant ? (
                          <div
                            className="text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: basicMarkdownToHtml(msg.content),
                            }}
                          />
                        ) : (
                          <div className="text-sm leading-relaxed whitespace-pre-wrap">
                            {msg.content}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isLoading && !isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[90%] rounded-2xl bg-white border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 flex items-center gap-2">
                      <span className="text-[10px] font-semibold tracking-[0.18em] text-slate-500">
                        COGMYRA
                      </span>
                      <span className="inline-flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce delay-75" />
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce delay-150" />
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input area */}
              <form
                onSubmit={handleSubmit}
                className="border-t border-slate-200 bg-white px-4 py-3 space-y-2"
              >
                <div className="flex items-end gap-2">
                  <textarea
                    rows={2}
                    className="flex-1 resize-none rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="Tell CogMyra what you’re working on or what you’d like to understand better…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>

                {/* Controls row: speaker + mic (UI only / future wiring) */}
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600 hover:border-emerald-500 hover:text-emerald-800"
                      title="Voice output (coming soon)"
                    >
                      <span aria-hidden="true">🔊</span>
                      <span>Read aloud</span>
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600 hover:border-emerald-500 hover:text-emerald-800"
                      title="Voice input (coming soon)"
                    >
                      <span aria-hidden="true">🎤</span>
                      <span>Speak instead</span>
                    </button>
                  </div>

                  <div className="text-[10px] text-slate-400">
                    CogMyra sessions are private to you in this prototype.
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
