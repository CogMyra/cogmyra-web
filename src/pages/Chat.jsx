// src/pages/Chat.jsx
import React, { useRef, useState } from "react";
import { Field, announce } from "../lib/a11y.js";
import ResultToolbar from "../components/ResultToolbar.jsx";
import EmptyState from "../components/EmptyState.jsx";

/** Friendly validation messages */
const M = {
  required: "Please enter a question or topic.",
  tooShort: "Try a longer prompt (at least 6 characters).",
  generic: "Something went wrong. Please try again.",
};

export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [output, setOutput] = useState(null);

  const fieldRef = useRef(null);

  function validate(text) {
    const t = (text || "").trim();
    if (!t) return M.required;
    if (t.length < 6) return M.tooShort;
    return null;
  }

  async function onSubmit(e) {
    e.preventDefault();

    const err = validate(prompt);
    if (err) {
      setError(err);
      announce(err);
      requestAnimationFrame(() => fieldRef.current?.focus());
      return;
    }

    setError(null);
    setSubmitting(true);
    announce("Submitting your request…");

    try {
      // TODO: replace with your real API call
      await new Promise((r) => setTimeout(r, 500));
      setOutput(`# Your result\n\nThis is where your model output will appear.`);
      announce("Response ready.");
    } catch {
      setOutput(null);
      setError(M.generic);
      announce(M.generic);
    } finally {
      setSubmitting(false);
    }
  }

  const showEmpty =
    !isSubmitting && !output && (!prompt || prompt.trim().length === 0);

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Chat</h1>
        <nav aria-label="Page actions" className="print-hidden">
          <ResultToolbar getShareURL={() => window.location.href} />
        </nav>
      </header>

      <form onSubmit={onSubmit} noValidate className="card">
        <div className="card-body">
          <Field
            id="prompt"
            label="Your prompt"
            hint="Be specific so CogMyra can help better."
            error={error}
            render={(fieldProps) => (
              <textarea
                ref={fieldRef}
                {...fieldProps}
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Explain photosynthesis for a 5th grader and give a 3-question quiz."
              />
            )}
          />

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting…" : "Ask"}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setPrompt("");
                setError(null);
                announce("Cleared prompt.");
                fieldRef.current?.focus();
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </form>

      {/* Empty state (first-time help) */}
      {showEmpty ? (
        <div className="mt-6">
          <EmptyState
            title="Start by asking a question"
            description={
              <>
                Try one of these to see how CogMyra structures helpful, readable answers:
                <ul className="mt-2 list-disc space-y-1 text-left pl-5">
                  <li>“Summarize the causes of the American Revolution in 5 bullet points.”</li>
                  <li>“Create a 10-question practice quiz about photosynthesis with answers.”</li>
                  <li>“Explain derivatives to a college freshman with one worked example.”</li>
                </ul>
              </>
            }
          >
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() =>
                setPrompt(
                  "Create a 10-question practice quiz about photosynthesis with answers."
                )
              }
            >
              Try an example
            </button>
          </EmptyState>
        </div>
      ) : null}

      {/* Output */}
      {output ? (
        <section className="mt-6 card no-break result-block">
          <header className="card-header">Result</header>
          <div className="card-body">
            <pre className="whitespace-pre-wrap break-words">{output}</pre>
          </div>
        </section>
      ) : null}
    </main>
  );
}
