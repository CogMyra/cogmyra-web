// src/pages/Chat.jsx
import React, { useId, useRef, useState } from "react";
import { Field, FieldError, announce } from "../lib/a11y";

export default function Chat() {
  const baseId = useId();                 // unique id seed for this render
  const inputRef = useRef(null);

  const [prompt, setPrompt] = useState("");
  const [error, setError]   = useState(null);
  const [status, setStatus] = useState("idle"); // idle | sending | done

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    // Simple validation example
    if (!prompt.trim()) {
      const msg = "Please enter a prompt before submitting.";
      setError(msg);
      announce(msg);
      // Send focus back to the field for quick correction
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }

    setStatus("sending");
    announce("Submitting…");

    try {
      // TODO: Call your existing API here
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
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Chat</h1>

      <form onSubmit={onSubmit} noValidate className="space-y-6">
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
