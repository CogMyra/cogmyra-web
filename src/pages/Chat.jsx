// src/pages/Chat.jsx
import React, { useRef, useState } from "react";
import { Field, FieldError, announce } from "../lib/a11y";
import EmptyState from "./EmptyState.jsx";
import ResultToolbar from "../components/ResultToolbar.jsx";

/**
 * Chat page
 * - Keyboard & screen-reader friendly
 * - Validates input with inline error
 * - Shows EmptyState templates when prompt is blank
 * - Includes Copy/Print toolbar for results
 */
export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const fieldRef = useRef(null);

  function validate(text) {
    const t = String(text || "").trim();
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
      // Focus back to the field so users can correct quickly
      requestAnimationFrame(() => fieldRef.current?.focus());
      return;
    }

    setError(null);
    setIsSubmitting(true);
    announce("Submitting your request…");

    try {
      // TODO: replace with your real API call
      // Simulate latency and produce a dummy response:
      const fake = await new Promise((resolve) =>
        setTimeout(() => {
          resolve({
            content:
              `Here’s a clear, friendly response to:\n\n“${prompt}”\n\n` +
              `1) A short explanation.\n2) A quick list of steps.\n3) A suggestion for what to try next.`,
          });
        }, 700)
      );

      setResult(fake.content);
      announce("Response ready.");
      // Move focus to the result heading for screen-reader users
      requestAnimationFrame(() => {
        document.getElementById("result-heading")?.focus();
      });
    } catch (err) {
      const msg = "Something went wrong. Please try again.";
      setResult(null);
      setError(msg);
      announce(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Provide a share URL for the toolbar (very basic demo)
  function getShareURL() {
    const url = new URL(window.location.href);
    if (prompt) url.searchParams.set("q", prompt);
    return url.toString();
  }

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-6" tabIndex={-1}>
      <h1 className="text-2xl font-semibold">Ask CogMyra</h1>
      <p className="muted mt-1">
        Get clear explanations, step-by-step help, and quick practice.
      </p>

      {/* Empty state only when field is blank */}
      {!prompt && (
        <EmptyState
          onUseTemplate={(t) => {
            setPrompt(t);
            requestAnimationFrame(() => fieldRef.current?.focus());
          }}
        />
      )}

      {/* Prompt form */}
      <section className="card mt-4">
        <div className="card-header">Your question</div>
        <div className="card-body">
          <form onSubmit={onSubmit} noValidate>
            <Field
              id="prompt"
              label="Type your prompt"
              hint="Be specific about level, goal, and constraints."
              error={error}
              render={(fieldProps) => (
                <textarea
                  {...fieldProps}
                  ref={fieldRef}
                  className="input"
                  rows={5}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  aria-describedby={error ? "prompt-err" : "prompt-hint"}
                />
              )}
            />
            <FieldError id="prompt-err">{error}</FieldError>

            <div className="mt-3 flex items-center gap-2">
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Submitting…" : "Submit"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setPrompt("");
                  setError(null);
                  setResult(null);
                  requestAnimationFrame(() => fieldRef.current?.focus());
                }}
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Result panel */}
      {result && (
        <section className="card mt-6" aria-labelledby="result-heading">
          <div className="card-header flex items-center justify-between">
            <h2
              id="result-heading"
              tabIndex={-1}
              className="text-lg font-semibold focus:outline-none"
            >
              Result
            </h2>
            {/* Save / Share / Print toolbar */}
            <ResultToolbar getShareURL={getShareURL} />
          </div>
          <div className="card-body">
            <pre className="whitespace-pre-wrap text-gray-900">{result}</pre>
          </div>
        </section>
      )}

      {/* Polite live region for announce(...) messages */}
      <div id="ally-live" role="status" aria-live="polite" className="sr-only" />
    </main>
  );
}
