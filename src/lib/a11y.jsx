// src/lib/a11y.js
import React from "react";

/** Ensure a polite aria-live region exists (created if missing). */
function ensureLiveRegion() {
  let node = document.getElementById("a11y-live");
  if (!node && typeof document !== "undefined") {
    node = document.createElement("div");
    node.id = "a11y-live";
    node.setAttribute("aria-live", "polite");
    node.setAttribute("aria-atomic", "true");
    node.style.position = "absolute";
    node.style.width = "1px";
    node.style.height = "1px";
    node.style.margin = "-1px";
    node.style.padding = "0";
    node.style.overflow = "hidden";
    node.style.clip = "rect(0 0 0 0)";
    node.style.whiteSpace = "nowrap";
    node.style.border = "0";
    document.body.appendChild(node);
  }
  return node;
}

/** Announce a short message to screen readers (polite). */
export function announce(message) {
  const node = ensureLiveRegion();
  if (!node) return;
  // small delay helps some SRs read repeated messages
  setTimeout(() => {
    node.textContent = String(message ?? "");
  }, 30);
}

/** Inline error, associated to a control via aria-describedby. */
export function FieldError({ id, children }) {
  return (
    <p id={id} role="alert" className="mt-1 text-sm text-red-700">
      {children}
    </p>
  );
}

/**
 * Field wrapper with label + hint + error.
 * - `id` base is used to wire up aria-labelledby/aria-describedby.
 * - `error` may be a string; if present we render FieldError and add a red ring.
 * - `render` is a render-prop that receives `fieldProps` to spread on your input.
 */
export function Field({
  id,
  label,
  hint,
  error,
  render,
}) {
  const describedBy = [];
  if (hint) describedBy.push(`${id}-hint`);
  if (error) describedBy.push(`${id}-err`);

  const fieldProps = {
    id,
    "aria-invalid": !!error || undefined,
    "aria-describedby": describedBy.join(" ") || undefined,
    className:
      "input " + (error ? "ring-2 ring-red-500 focus:ring-red-500 border-red-500" : ""),
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="label">{label}</label>
      <div>{render(fieldProps)}</div>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-gray-600">
          {hint}
        </p>
      ) : null}
      {error ? <FieldError id={`${id}-err`}>{error}</FieldError> : null}
    </div>
  );
}
