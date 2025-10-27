// src/components/ErrorBanner.jsx
import React from "react";

export default function ErrorBanner({ title = "There was a problem", children, onClose }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-red-600" aria-hidden>⚠️</div>
        <div className="flex-1">
          <p className="font-semibold">{title}</p>
          {children ? <div className="mt-1 text-sm">{children}</div> : null}
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost rounded-md px-2 py-1 text-sm"
            aria-label="Dismiss error"
          >
            Close
          </button>
        ) : null}
      </div>
    </div>
  );
}
