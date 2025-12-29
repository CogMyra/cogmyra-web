import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

/**
 * Persona configurations
 */

// =======================================
// Typewriter hook (safe, UI-only)
// =======================================
function useTypewriter(text, speed = 18) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!text) {
      setDisplayed("");
      return;
    }

    let i = 0;
    setDisplayed("");

    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayed;
}

const MARKDOWN_COMPONENTS = {
  p: (props) => (
    <p className="whitespace-pre-wrap leading-relaxed" {...props} />
  ),
  ul: (props) => <ul className="list-disc pl-5 space-y-1" {...props} />,
  ol: (props) => <ol className="list-decimal pl-5 space-y-1" {...props} />,
  li: (props) => <li className="my-0" {...props} />,
  strong: (props) => <strong className="font-semibold" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  a: (props) => (
    <a
      className="underline text-emerald-700 hover:text-emerald-800"
      target="_blank"
      rel="noreferrer"
      {...props}
    />
  ),
  code: ({ inline, children, ...props }) =>
    inline ? (
      <code
        className="rounded bg-slate-100 px-1 py-0.5 text-[0.9em]"
        {...props}
      >
        {children}
      </code>
    ) : (
      <pre className="overflow-x-auto rounded bg-slate-900 p-3 text-slate-100">
        <code {...props}>{children}</code>
      </pre>
    ),
};

function TypewriterMarkdown({ text }) {
  const typed = useTypewriter(text);
  return (
    <ReactMarkdown components={MARKDOWN_COMPONENTS}>
      {typed}
    </ReactMarkdown>
  );
}

const PERSONA_CONFIG = {
  kid: {
    id: "kid",
    personaLabel: "Kid in School",
    intro:
      "Hi! I’m the CogMyra Guide. Tell me your age, grade, and what you’re working on, and we’ll take tiny steps together.",
  },
  college: {
    id: "college",
    personaLabel: "College Student",
    intro:
      "Hi, I’m the CogMyra Guide. Tell me what you’re working on or stuck on, and I’ll help you one step at a time.",
  },
  pro: {
    id: "pro",
    personaLabel: "Professional",
    intro:
      "Hi, I’m the CogMyra Guide. Tell me your role, context, and what you’re trying to accomplish, and we’ll take it step by step together.",
  },
};

/**
 * TYPEWRITER HOOK (safe + minimal)
 */

function useTypewriterIntro(fullText, speed = 18) {
  const safeText = typeof fullText === "string" ? fullText : "";
  const [text, setText] = useState("");

  useEffect(() => {
    setText("");
    if (!safeText) return;

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setText(safeText.slice(0, i));
      if (i >= safeText.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [safeText, speed]);

  return text;
}

function GuidePage() {
  const [personaId, setPersonaId] = useState("college");
  const personaConfig = PERSONA_CONFIG[personaId];
  const typedIntro = useTypewriterIntro(personaConfig.intro);

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Onboarding micro-flow (8.4)
  // Step 1 -> Step 2 -> 0 (done)
  const [onboardingStep, setOnboardingStep] = useState(1);

  // What we learn during onboarding
  const [onboarding, setOnboarding] = useState({
    ageOrLevel: "", // kid: age/grade | college: undergrad/grad | pro: role/industry
    feeling: "",
    topic: "",
    goal: "", // Step 2 follow-up (varies)
    style: "", // Step 2 follow-up (varies)
  });

  // Vary Step 2 prompts to avoid repetition
  const [onboardingVariant] = useState(() => Math.floor(Math.random() * 4));
  // -------------------------------
  // Onboarding prompt helpers
  // -------------------------------

  const getStep1Prompt = () => {
    switch (personaId) {
      case "kid":
        return "Before we start — how old are you or what grade are you in?";
      case "pro":
        return "Before we dive in — what’s your role or line of work?";
      case "college":
      default:
        return "Before we dive in — are you an undergrad or graduate student?";
    }
  };

  const getStep2Prompt = () => {
    const variants = {
      kid: [
        "How are you feeling about this right now?",
        "What part feels tricky or confusing?",
        "Got it. Let’s take this one step at a time.",
        "Is this for homework, a test, or something else?"
      ],
      college: [
        "What’s the main thing you want to get out of this?",
        "Where are you getting stuck?",
        "Is this for a class, a project, or something else?",
        "Do you want help understanding, practicing, or planning?"
      ],
      pro: [
        "What does success look like here?",
        "Is this time-sensitive or exploratory?",
        "What’s the biggest constraint you’re dealing with?",
        "Do you want strategy, execution help, or feedback?"
      ]
    };

    const set = variants[personaId] || variants.college;
    return set[onboardingVariant % set.length];
  };
  // Stable session ID
  const [sessionId] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );

// Reset + start onboarding when persona changes
useEffect(() => {
  setMessages([
    {
      id: "onboarding-step-1",
      role: "assistant",
      from: "assistant",
      text: getStep1Prompt(),
    },
  ]);
  setOnboardingStep(1);
  setOnboarding({
    ageOrLevel: "",
    feeling: "",
    topic: "",
    goal: "",
    style: "",
  });
  setInputValue("");
  setErrorMessage("");
}, [personaId]);

  const chatScrollRef = useRef(null);
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop =
        chatScrollRef.current.scrollHeight;
    }
  }, [messages, typedIntro, isSending]);

  /**
   * SEND MESSAGE
   */
  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return;

    const userText = inputValue.trim();
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      from: "user",
      text: userText,
    };

    // ----------------------------------------
    // Onboarding intercept (8.4)
    // Step 1: capture level/role
    // Step 2: capture one more persona-fit detail, then start real chat
    // ----------------------------------------

    // STEP 1 → STEP 2 (no API call yet)
    if (onboardingStep === 1) {
      setMessages((prev) => [
        ...prev,
        userMessage,
        {
          id: "onboarding-step-2",
          role: "assistant",
          from: "assistant",
          text: getStep2Prompt(),
        },
      ]);

      setOnboarding((o) => ({ ...o, ageOrLevel: userText }));
      setOnboardingStep(2);
      setInputValue("");
      setErrorMessage("");
      return;
    }

    // STEP 2 → start real chat (API call happens after this)
    let onboardingContextForThisRequest = null;

    if (onboardingStep === 2) {
      let patch = {};

      if (personaId === "kid") {
        if (onboardingVariant % 4 === 0) patch = { feeling: userText };
        else if (onboardingVariant % 4 === 3) patch = { style: userText };
        else patch = { topic: userText };
      } else if (personaId === "pro") {
        if (onboardingVariant % 4 === 0) patch = { goal: userText };
        else patch = { style: userText };
      } else {
        // college (default)
        if (onboardingVariant % 4 === 0) patch = { goal: userText };
        else if (onboardingVariant % 4 === 2) patch = { style: userText };
        else patch = { topic: userText };
      }

      const merged = { ...onboarding, ...patch };

      onboardingContextForThisRequest =
        `Onboarding context (keep it brief):\n` +
        `Persona: ${personaConfig.personaLabel}\n` +
        `Level/Role: ${merged.ageOrLevel || "n/a"}\n` +
        (merged.feeling ? `Feeling: ${merged.feeling}\n` : "") +
        (merged.topic ? `Topic/Need: ${merged.topic}\n` : "") +
        (merged.goal ? `Goal: ${merged.goal}\n` : "") +
        (merged.style ? `Preference: ${merged.style}\n` : "");

      setOnboarding((o) => ({ ...o, ...patch }));
      setOnboardingStep(0);
    }

    // Normal message append (used for step 2 and all future messages)
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsSending(true);
    setErrorMessage("");

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsSending(true);
    setErrorMessage("");

    try {
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text,
      }));

const payload = {
  messages: onboardingContextForThisRequest
    ? [
        { role: "system", content: onboardingContextForThisRequest },
        ...apiMessages,
      ]
    : apiMessages,
  persona: personaConfig.personaLabel,
  session_id: sessionId,
};

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Upstream error");
      }

      const data = await res.json();

      const assistantContent =
        (data.message?.content ?? null) ||
        (data.choices?.[0]?.message?.content ?? null) ||
        data.content ||
        data.output_text;

      if (!assistantContent) {
        throw new Error("Invalid assistant reply format");
      }

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        from: "assistant",
        text: assistantContent,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setTimeout(() => setIsSending(false), 300);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6">

        {/* Persona Selector */}
        <section className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPersonaId("kid")}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                personaId === "kid"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              I’m a Kid in School
            </button>

            <button
              onClick={() => setPersonaId("college")}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                personaId === "college"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              I’m a College Student
            </button>

            <button
              onClick={() => setPersonaId("pro")}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                personaId === "pro"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              I’m a Professional
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            Persona: {personaConfig.personaLabel}
          </p>
        </section>

        {/* Guide Header */}
        <h1 className="text-3xl font-semibold tracking-tight">
          CogMyra Guide{" "}
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-sm font-medium text-emerald-700">
            Beta
          </span>
        </h1>

        {/* Chat Section */}
        <section className="flex flex-1 flex-col gap-4 rounded-xl bg-white p-4 shadow-sm">
          <div
            ref={chatScrollRef}
            className="flex-1 space-y-4 overflow-y-auto rounded-lg bg-slate-50 p-3 text-sm"
          >
            {/* Typewriter Intro */}
            {typedIntro && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900">
                  {typedIntro}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 ${
                    m.from === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-slate-900 border border-slate-200"
                  }`}
                >

{m.from === "assistant" ? (
  <TypewriterMarkdown text={m.text} />
) : (
  m.text
)}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isSending && (
              <div className="flex justify-start">
                <div className="max-w-[75%] rounded-2xl bg-slate-200 px-4 py-3 text-sm text-slate-700 shadow">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-slate-500 animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-slate-500 animate-bounce [animation-delay:0.12s]" />
                    <span className="h-2 w-2 rounded-full bg-slate-500 animate-bounce [animation-delay:0.24s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Tell me what you're working on..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              type="submit"
              disabled={isSending}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {isSending ? "Sending…" : "Send"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default GuidePage;
