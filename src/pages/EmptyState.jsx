// src/pages/EmptyState.jsx
import React from "react";

/**
 * Reusable empty-state with accessible, AA-compliant templates.
 * Pass onUseTemplate(str) to drop text into a prompt field.
 */
export default function EmptyState({ onUseTemplate }) {
  const items = [
    {
      mode: "learn",
      title: "Explain & Quiz",
      body:
        "Explain photosynthesis for a 7th grader in 3 short paragraphs, " +
        "then give a 3-question multiple-choice quiz with answers.",
    },
    {
      mode: "practice",
      title: "Step-by-Step Coaching",
      body:
        "Coach me through factoring this quadratic: x^2 + 7x + 10. " +
        "Ask me questions first, then reveal each step.",
    },
    {
      mode: "write",
      title: "Outline → Draft",
      body:
        "Create a clear outline for a 500-word persuasive essay arguing that schools " +
        "should start later. Then write the first two paragraphs.",
    },
    {
      mode: "plan",
      title: "Study Plan",
      body:
        "Build a 2-week study plan to master fractions for a 5th grader. " +
        "Include daily tasks and quick checks.",
    },
  ];

  return (
    <div className="card mt-4" aria-labelledby="ex-samples-h">
      <div className="card-header">
        <h2 id="ex-samples-h" className="text-lg">
          Try a ready-made example
        </h2>
      </div>
      <div className="card-body">
        <ul className="grid gap-3 sm:grid-cols-2" role="list">
          {items.map((it, idx) => (
            <li key={idx} className="rounded-lg border border-gray-200 p-3">
              <p className="text-sm font-semibold text-gray-900">{it.title}</p>
              <p className="mt-1 text-sm text-gray-700">{it.body}</p>
              <div className="mt-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  aria-label={`Use template: ${it.title}`}
                  onClick={() => onUseTemplate?.(it.body)}
                >
                  Use this template
                </button>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-sm muted">
          Tip: Be specific about level, goal, and constraints to get the best results.
        </p>
      </div>
    </div>
  );
}
