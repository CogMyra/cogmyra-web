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

  // Italic: *text*
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Line breaks
  html = html.replace(/\n/g, "<br />");

  return html;
}

const DEFAULT_STARTER_PROMPT =
  "Hi! I’m the CogMyra Guide. Tell me a little about yourself and what you’re working on, and I’ll help you one step at a time.";

const PERSONA_PROMPTS = {
  kid: "Hi! I’m the CogMyra Guide. How old are you, what grade are you in, and what would you like help with today?",
  college:
    "Hi! I’m the CogMyra Guide. Are you an undergraduate or graduate student, and what class or project are you working on right now?",
  pro: "Hi! I’m the CogMyra Guide. What kind of work do you do, and what are you trying to learn, plan, or solve today?",
};

export default function GuidePage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to the CogMyra Guide.\n\nI’m here to act as your personal learning coach—helping you think clearly, build skills, and move step by step through whatever you’re working on.",
    },
  ]);
  const [inputValue, setInputValue] = useState(DEFAULT_STARTER_PROMPT);
  const [isLoading, setIsLoading] = useState(false);
  const [persona, setPersona] = useState(null); // "kid" | "college" | "pro" | null
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Helper: get the current starter text based on persona (or default)
  function getStarterPromptForPersona(nextPersona) {
    if (!nextPersona) return DEFAULT_STARTER_PROMPT;
    return PERSONA_PROMPTS[nextPersona] || DEFAULT_STARTER_PROMPT;
  }

  function handlePersonaClick(nextPersona) {
    // If the user clicks the same button again, keep it selected (no toggle off)
    setPersona(nextPersona);

    // Only override the input if the user hasn't started typing something custom
    if (!inputValue || inputValue === DEFAULT_STARTER_PROMPT || PERSONA_PROMPTS[persona]) {
      const starter = getStarterPromptForPersona(nextPersona);
      setInputValue(starter);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: "user", content: trimmed };

    // If no persona has been explicitly chosen, we rely on the text itself
    // (DEFAULT_STARTER_PROMPT already invites basic onboarding context).
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      if (!res.ok) {
        console.error("Chat API error", res.status, res.statusText);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I ran into an issue reaching the CogMyra engine. Please try again in a moment.",
          },
        ]);
      } else {
        const data = await res.json();
        const replyText = data.reply || "";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: replyText },
        ]);
      }
    } catch (err) {
      console.error("Chat request failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong reaching the CogMyra engine. If this keeps happening, please try refreshing the page.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="guide-page">
      {/* Top nav / header */}
      <header className="guide-header">
        <div className="guide-header-inner">
          <Link to="/" className="logo-link">
            <span className="logo-text">CogMyra</span>
          </Link>
          <nav className="guide-nav">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/guide" className="nav-link nav-link-active">
              Guide
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content layout */}
      <main className="guide-main">
        <section className="guide-intro">
          <h1 className="guide-title">CogMyra Guide</h1>
          <p className="guide-subtitle">
            A personalized learning coach that adapts to who you are, how
            you&apos;re feeling, and what you&apos;re trying to accomplish.
          </p>

          {/* User type selector row */}
          <div className="user-type-section">
            <p className="user-type-label">Who are you today?</p>
            <div className="user-type-buttons">
              <button
                type="button"
                className={
                  "user-type-button" +
                  (persona === "kid" ? " user-type-button-active" : "")
                }
                onClick={() => handlePersonaClick("kid")}
              >
                I’m a Kid in School
              </button>
              <button
                type="button"
                className={
                  "user-type-button" +
                  (persona === "college" ? " user-type-button-active" : "")
                }
                onClick={() => handlePersonaClick("college")}
              >
                I’m a College Student
              </button>
              <button
                type="button"
                className={
                  "user-type-button" +
                  (persona === "pro" ? " user-type-button-active" : "")
                }
                onClick={() => handlePersonaClick("pro")}
              >
                I’m a Professional
              </button>
            </div>
            <p className="user-type-helper">
              Selecting one helps the Guide tune its tone and questions to your
              context. If you’re not sure, you can just start typing below.
            </p>
          </div>
        </section>

        {/* Chat panel */}
        <section className="guide-chat-panel">
          <div className="chat-window">
            <div className="chat-messages">
              {messages.map((m, idx) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={idx}
                    className={
                      "chat-message " + (isUser ? "chat-message-user" : "chat-message-assistant")
                    }
                  >
                    <div className="chat-message-inner">
                      {isUser ? (
                        <p className="chat-text-user">{m.content}</p>
                      ) : (
                        <div
                          className="chat-text-assistant"
                          dangerouslySetInnerHTML={{
                            __html: basicMarkdownToHtml(m.content),
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
              {isLoading && (
                <div className="chat-message chat-message-assistant">
                  <div className="chat-message-inner">
                    <p className="chat-text-assistant">
                      Thinking through the best way to help you…
                    </p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <form className="chat-input-bar" onSubmit={handleSubmit}>
              <textarea
                className="chat-input"
                rows={2}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={getStarterPromptForPersona(persona)}
              />
              <button
                type="submit"
                className="chat-send-button"
                disabled={isLoading || !inputValue.trim()}
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
            </form>

            {/* Soft onboarding hint if no persona selected */}
            {!persona && (
              <p className="chat-onboarding-hint">
                Tip: You can pick “Kid,” “College,” or “Professional” above so
                the Guide can tune its tone and questions more precisely to you.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
