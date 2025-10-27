// src/pages/Chat.jsx
import React, { useState, useRef } from "react";
import { Field, FieldError, announce } from "../lib/a11y";
import ResultToolbar from "../components/ResultToolbar.jsx"; // optional: shows Copy / Print

export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fieldRef = useRef(null);

  function validate(text) {
    const t = text.trim();
    if (!t) return "Please enter a question or topic.";
    if (t.length < 6) return "Try a longer prompt (at least 6 characters).";
    return null;
  }

  async function onSubmit(e) {
    e.preventDefault();

    const err = validate(prompt);
    if (err) {
      setError(err);
      announce(err);
      // move focus to the field for quick correction
      requestAnimationFrame(() => fieldRef.current?.focus());
      return;
    }

    setError(null);
    setIsSubmitting(true);
    announce("Submitting your request…");

    try {
      // TODO: replace with your existing submit logic (call model, log event, etc.)
      await new Promise((r) => setTimeout(r, 400)); // simulate
      announce("Response ready.");
    } catch (e) {
      const msg = "Something went wrong. Please try again.";
      setError(msg);
      announce(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Reusable hint text to guide novices
  const hint = (
    <>
      Be specific: include grade/level, goal, and constraints.<br />
      <span className="muted">
        Example: “Explain photosynthesis for a 7th grader and give a 3-question quiz.”
      </span>
    </>
  );

  return (
    <main id="main-content" className="container mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Chat</h1>
        <p className="muted mt-1">Ask a question or describe what you want to learn.</p>
      </header>

      <section className="card">
        <div className="card-body">
          <form onSubmit={onSubmit} noValidate>
            <Field
              id="prompt"
              label="What do you want to learn or create?"
              hint={hint}
              error={error}
              render={(fieldProps) => (
                <textarea
                  {...fieldProps}
                  ref={fieldRef}
                  className="input h-36 resize-y"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              )}
            />
            {error && (
              <FieldError id="prompt-err">
                {error}
              </FieldError>
            )}

            <div className="mt-4 flex items-center gap-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
              >
                {isSubmitting ? "Working…" : "Ask CogMyra"}
              </button>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setPrompt("");
                  setError(null);
                  announce("Cleared.");
                  fieldRef.current?.focus();
                }}
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Optional: share/print tools for results area */}
      <div className="mt-6">
        <ResultToolbar getShareURL={() => window.location.href} />
      </div>
    </main>
  );
}
