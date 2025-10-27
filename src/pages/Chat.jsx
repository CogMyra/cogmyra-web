// src/pages/Chat.jsx
import React, { useId, useRef, useState } from "react";
import { Field, FieldError, announce } from "../lib/a11y";
import EmptyState from "../components/EmptyState";

export default function Chat() {
  const baseId = useId();
  const inputRef = useRef(null);

  const [prompt, setPrompt] = useState("");
  const [error, setError]   = useState(null);
  const [status, setStatus] = useState("idle"); // idle | sending | done

  const hasStarted = prompt.trim().length > 0;

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!prompt.trim()) {
      const msg = "Please enter a prompt before submitting.";
      setError(msg);
      announce(msg);
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }

    setStatus("sending");
    announce("Submitting…");

    try {
      // TODO: call your API
      // await fetch(...)
      setStatus("done");
      announce("Submitted successfully.");
    } catch (err) {
      const msg = "Something went wrong. Please try again.";
      setError(msg);
      setStatus("idle");
      announce(msg);
    }
  }

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Chat</h1>

      {!hasStarted && (
        <EmptyState
          title="Start a conversation"
          description="Type a clear question or task. Be specific about your goal, audience, and any constraints."
          action={
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setPrompt("Explain photosynthesis for a 7th grader in 3 short bullet points.");
                requestAnimationFrame(() => inputRef.current?.focus());
              }}
            >
              Try an example
            </button>
          }
        />
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field
          id={`${baseId}-prompt`}
          label="Your prompt"
          hint="Be specific so CogMyra can help better."
          error={error}
          render={(fieldProps) => (
            <textarea
              ref={inputRef}
              {...fieldProps}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              className="input"
              placeholder="Ask a question or describe what you need…"
            />
          )}
        />

        {error && (
          <FieldError id={`${baseId}-prompt-err`}>{error}</FieldError>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="btn-primary"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Submitting…" : "Submit"}
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setPrompt("");
              setError(null);
              setStatus("idle");
              announce("Cleared.");
              inputRef.current?.focus();
            }}
          >
            Clear
          </button>
        </div>
      </form>
    </main>
  );
}
