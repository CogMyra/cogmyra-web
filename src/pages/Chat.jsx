// src/pages/Chat.jsx
import React, { useRef, useState } from "react";
import { FieldError } from "../lib/a11y.jsx";
import ResultToolbar from "../components/ResultToolbar.jsx";

/* Utility to make safe filenames from the prompt */
function slugify(s = "") {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\- ]+/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fieldRef = useRef(null);

  function validate(text) {
    const v = (text || "").trim();
    if (!v) return "Please enter a question or topic.";
    if (v.length < 6) return "Try a longer prompt (at least 6 characters).";
    return null;
  }

  async function onSubmit(e) {
    e.preventDefault();

    const err = validate(prompt);
    if (err) {
      setError(err);
      announce(err);
      // move focus to field for quick correction
      requestAnimationFrame(() => fieldRef.current?.focus());
      return;
    }

    setError(null);
    setIsSubmitting(true);
    announce("Submitting your request…");

    try {
      // TODO: swap this mock with your real API call.
      // Example: const r = await fetch("/api/chat", { method:"POST", body: JSON.stringify({ prompt }) })
      // const data = await r.json(); setOutput(data.text)
      const mock = await new Promise((res) =>
        setTimeout(
          () =>
            res(
              [
                `You asked: ${prompt}`,
                "",
                "Here is a short, formatted demo response.",
                "",
                "- Clear explanations",
                "- Practice prompts",
                "- Next steps you can take",
              ].join("\n")
            ),
          500
        )
      );

      setOutput(mock);
      announce("Response ready.");
    } catch (e2) {
      const msg = "Something went wrong. Please try again.";
      setError(msg);
      announce(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main id="main-content" className="mx-auto max-w-3xl p-4 sm:p-6">
      {/* Page header + actions (toolbar hidden in print) */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Chat</h1>
        <nav aria-label="Page actions" className="print-hidden">
          <ResultToolbar
            getShareURL={() => window.location.href}
            getContent={() => ({
              text: output || "",
              filenameBase: slugify(prompt || "cogmyra-output"),
            })}
          />
        </nav>
      </header>

      {/* Prompt form */}
      <form onSubmit={onSubmit} noValidate className="mb-6">
        <Field
          id="prompt"
          label="Your prompt"
          hint="Be specific so CogMyra can help better."
          render={(inputProps) => (
            <textarea
              {...inputProps}
              ref={fieldRef}
              className="input min-h-[7rem]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />
          )}
          error={error}
        />

        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            aria-busy={isSubmitting ? "true" : "false"}
          >
            {isSubmitting ? "Submitting…" : "Submit"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setPrompt("");
              setError(null);
              fieldRef.current?.focus();
            }}
          >
            Clear
          </button>
        </div>
      </form>

      {/* Result area */}
      <section aria-live="polite" className="space-y-3">
        <div className="card">
          <div className="card-header">Result</div>
          <div className="card-body">
            {output ? (
              <pre className="result-block whitespace-pre-wrap break-words text-[0.95rem] leading-relaxed">
                {output}
              </pre>
            ) : (
              <p className="muted">
                Your response will appear here after you submit a prompt.
              </p>
            )}
          </div>
        </div>

        {/* Inline error summary (in addition to FieldError near the field) */}
        {error ? (
          <div
            role="alert"
            className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </div>
        ) : null}
      </section>
    </main>
  );
}
