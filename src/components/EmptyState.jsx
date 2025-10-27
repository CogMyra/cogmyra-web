// src/components/EmptyState.jsx
import React from "react";

/**
 * Accessible empty-state panel.
 * Props:
 *  - title       (string)
 *  - description (string|node)
 *  - children    (optional actions: buttons/links)
 */
export default function EmptyState({ title, description, children }) {
  return (
    <section
      aria-labelledby="empty-title"
      className="card text-center no-break"
    >
      <div className="card-body">
        <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
          <span aria-hidden>⭐️</span>
        </div>
        <h2 id="empty-title" className="text-lg font-semibold text-gray-900">
          {title}
        </h2>
        <p className="mt-2 text-sm text-gray-600">{description}</p>

        {children ? <div className="mt-4 flex flex-wrap justify-center gap-2">{children}</div> : null}
      </div>
    </section>
  );
}
