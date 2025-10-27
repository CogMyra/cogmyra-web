// src/lib/a11y.js
import React from "react";

/**
 * Announce a short message to the global polite live region.
 * Use for validation errors, success notices, etc.
 */
export function announce(message) {
  const node = document.getElementById("a11y-live");
  if (node) {
    // Clear first so repeated messages are read
    node.textContent = "";
    // Slight delay helps some SRs pick up repeats
    setTimeout(() => { node.textContent = String(message || ""); }, 30);
  }
}

/**
 * Inline error text bound to a field.
 * Usage:
 *  <FieldError id="name-err">Please enter your name.</FieldError>
 *  <input aria-describedby="name-err" ... />
 */
export function FieldError({ id, children }) {
  return (
    <p id={id} role="alert" className="mt-1 text-sm text-red-700">
      {children}
    </p>
  );
}

/**
 * Helper label + input structure with hint & error slots.
 * Example:
 *  <Field
 *    id="prompt"
 *    label="Your prompt"
 *    hint="Be specific so CogMyra can help better."
 *    error={errorText} // pass a string when invalid
 *    render={(fieldProps) => (
 *      <textarea {...fieldProps} rows={4} />
 *    )}
 *  />
 */
export function Field({ id, label, hint, error, render }) {
  const describedBy = [
    hint ? `${id}-hint` : null,
    error ? `${id}-err` : null,
  ].filter(Boolean).join(" ") || undefined;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="label">{label}</label>
      {render({
        id,
        "aria-invalid": Boolean(error) || undefined,
        "aria-describedby": describedBy,
        className: "input",
      })}
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-gray-600">
          {hint}
        </p>
      ) : null}
      {error ? (
        <FieldError id={`${id}-err`}>{error}</FieldError>
      ) : null}
    </div>
  );
}
