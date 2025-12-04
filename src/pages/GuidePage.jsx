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

export default function GuidePage() {
  const [userType, setUserType] = useState(null); // "kid" | "college" | "pro" | null
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to the CogMyra Guide.\n\nI'm here to act as your personal learning coach—helping you think clearly, build skills, and move step by step through whatever you’re working on.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingReply, setPendingReply] = useState("");
  const [displayedReply, setDisplayedReply] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages or streaming text change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, displayedReply]);

  // Typing effect for assistant replies
  useEffect(() => {
    if (!pendingReply) return;

    setDisplayedReply("");
    let index = 0;

    const interval = setInterval(() => {
      index += 3; // characters per tick
      setDisplayedReply(pendingReply.slice(0, index));

      if (index >= pendingReply.length) {
        clearInterval(interval);

        // When typing finishes, push the full reply into messages
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: pendingReply },
        ]);
        setPendingReply("");
        setDisplayedReply("");
      }
    }, 20); // ms per tick

    return () => clearInterval(interval);
  }, [pendingReply]);

  // Starter text based on selected user type
  const getStarterPrompt = () => {
    if (userType === "kid") {
      return (
        "Hi! I’m the CogMyra Guide.\n\n" +
        "How old are you, what grade are you in, and how are you feeling today? " +
        "Tell me something you’re curious about or working on, and I’ll help you one step at a time."
      );
    }
    if (userType === "college") {
      return (
        "Hi! I’m the CogMyra Guide.\n\n" +
        "Are you in undergraduate or graduate school, and what are you working on or worried about right now? " +
        "Tell me the class, assignment, or goal, and I’ll help you break it into clear, doable steps."
      );
    }
    if (userType === "pro") {
      return (
        "Hi! I’m the CogMyra Guide.\n\n" +
        "Tell me a bit about your role, what you’re trying to learn or accomplish, and what feels most challenging right now. " +
        "I’ll help you think clearly, plan strategically, and move toward the outcome you care about."
      );
    }
    // default / no selection
    return (
      "Hi! I’m the CogMyra Guide.\n\n" +
      "Tell me what you’re working on, how you’re feeling about it, and what you’d like help with. " +
      "I’ll walk with you step by step."
    );
  };

  const starterPrompt = getStarterPrompt();

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // Add persona hint into the first user message of this turn
    let personaPrefix = "";
    if (userType === "kid") {
      personaPrefix =
        "[Learner profile: child / K–12 student. Use warm, playful, concrete language and short steps.]\n\n";
    } else if (userType === "college") {
      personaPrefix =
        "[Learner profile: college / university student. Use academically rigorous but accessible tone, with clear structure and scaffolding.]\n\n";
    } else if (userType === "pro") {
      personaPrefix =
        "[Learner profile: working professional. Use clear, efficient, applied language with strategic framing.]\n\n";
    }

    const userMessage = {
      role: "user",
      content: personaPrefix + trimmed,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setPendingReply("");
    setDisplayedReply("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-key": import.meta.env.VITE_APP_GATE_KEY || "",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Chat error:", errorText);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I ran into a problem trying to respond. If this keeps happening, please try again in a moment or refresh the page.",
          },
        ]);
      } else {
        const data = await res.json();
        const reply = data.reply || "";

        // Trigger the typing effect
        setPendingReply(reply);
      }
    } catch (err) {
      console.error("Network error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I wasn’t able to reach the CogMyra engine just now. Please check your connection and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Render messages, including streaming reply if present
  const renderedMessages =
    pendingReply && displayedReply
      ? [
          ...messages,
          { role: "assistant", content: displayedReply, _streaming: true },
        ]
      : messages;

  return (
    <div className="guide-page">
      <header className="guide-header">
        <div className="guide-logo">CogMyra</div>
        <nav className="guide-nav">
          <Link to="/" className="guide-nav-link">
            Home
          </Link>
          <span className="guide-nav-current">Guide</span>
        </nav>
      </header>

      <main className="guide-main">
        <section className="guide-intro">
          <h1 className="guide-title">CogMyra Guide</h1>
          <p className="guide-tagline">
            A personalized learning coach that adapts to who you are, how
            you&apos;re feeling, and what you&apos;re trying to accomplish.
          </p>

          <div className="user-type-section">
            <h2 className="user-type-title">Who are you today?</h2>
            <div className="user-type-buttons">
              <button
                type="button"
                className={
                  userType === "kid"
                    ? "user-type-button active"
                    : "user-type-button"
                }
                onClick={() => setUserType("kid")}
              >
                I&apos;m a Kid in School
              </button>
              <button
                type="button"
                className={
                  userType === "college"
                    ? "user-type-button active"
                    : "user-type-button"
                }
                onClick={() => setUserType("college")}
              >
                I&apos;m a College Student
              </button>
              <button
                type="button"
                className={
                  userType === "pro"
                    ? "user-type-button active"
                    : "user-type-button"
                }
                onClick={() => setUserType("pro")}
              >
                I&apos;m a Professional
              </button>
            </div>
            <p className="user-type-help">
              Selecting one helps the Guide tune its tone and questions to your
              context. If you’re not sure, you can just start typing below.
            </p>
          </div>
        </section>

        <section className="guide-chat-section">
          <div className="chat-container">
            <div className="chat-messages">
              {renderedMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={
                    msg.role === "assistant"
                      ? "chat-message assistant"
                      : "chat-message user"
                  }
                >
                  <div className="chat-message-role">
                    {msg.role === "assistant" ? "Guide" : "You"}
                  </div>
                  <div
                    className="chat-message-content"
                    dangerouslySetInnerHTML={{
                      __html: basicMarkdownToHtml(msg.content),
                    }}
                  />
                </div>
              ))}

              {isLoading && !pendingReply && (
                <div className="chat-message assistant">
                  <div className="chat-message-role">Guide</div>
                  <div className="chat-message-content typing-indicator">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <div className="starter-prompt">
                {starterPrompt.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>

              <textarea
                className="chat-input"
                placeholder="Tell me what you’re working on or what you’d like help with..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
              />

              <div className="chat-input-footer">
                <span className="chat-tip">
                  Tip: You can pick “Kid,” “College,” or “Professional” above so
                  the Guide can tune its tone and questions more precisely to
                  you.
                </span>
                <button
                  type="button"
                  className="chat-send-button"
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? "Thinking…" : "Send"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
