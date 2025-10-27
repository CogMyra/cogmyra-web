// src/components/EmptyState.jsx
import React from "react";

export default function EmptyState({
  title = "Nothing here yet",
  description = "Get started by creating your first item.",
  action = null, // e.g., <button className="btn-primary">Create</button>
  icon = null,   // optional React node (SVG)
}) {
  return (
    <section
      role="region"
      aria-labelledby="empty-title"
      className="card"
    >
      <div className="card-body flex items-start gap-4">
        {icon ? (
          <div
            aria-hidden="true"
            className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-blue-50 text-blue-700"
          >
            {icon}
          </div>
        ) : null}

        <div className="min-w-0 flex-auto">
          <h2 id="empty-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <p className="mt-1 text-gray-600">{description}</p>

          {action ? <div className="mt-4">{action}</div> : null}
        </div>
      </div>
    </section>
  );
}
