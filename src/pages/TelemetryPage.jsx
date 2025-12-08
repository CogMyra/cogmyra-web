// src/pages/TelemetryPage.jsx
// Telemetry Dashboard v1 (front-end shell)
// - Calls /api/telemetry
// - Falls back gracefully if API isn't ready yet

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function formatMs(ms) {
  if (ms == null) return "—";
  if (ms < 1000) return `${ms} ms`;
  const seconds = (ms / 1000).toFixed(1);
  return `${seconds}s`;
}

export default function TelemetryPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchTelemetry() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/telemetry");
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();
        if (!isMounted) return;

        setData(json);
        setLoading(false);
      } catch (err) {
        console.error("Telemetry fetch error:", err);
        if (!isMounted) return;

        // Graceful fallback: still show page with message
        setError("Telemetry service not available yet.");
        setLoading(false);
      }
    }

    fetchTelemetry();

    return () => {
      isMounted = false;
    };
  }, []);

  const summary = data?.summary || {
    totalRequests: 0,
    totalErrors: 0,
    avgLatencyMs: null,
    timeWindowLabel: "No data yet",
  };

  const recent = data?.recent || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top nav / header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <Link to="/" className="text-sm text-slate-400 hover:text-slate-100">
              ← Back to CogMyra Guide
            </Link>
            <h1 className="text-lg font-semibold tracking-tight text-slate-100">
              Telemetry Dashboard
            </h1>
          </div>
          <div className="text-xs text-slate-400">
            Phase 8 · Experience · Analytics
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        {/* Status / error / loading */}
        {loading && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300">
            Loading telemetry…
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl border border-amber-600/50 bg-amber-900/20 px-4 py-3 text-sm text-amber-200">
            {error} This UI is live, but the backend endpoint{" "}
            <code className="font-mono text-xs bg-slate-900/80 px-1 py-0.5 rounded">
              /api/telemetry
            </code>{" "}
            still needs to be wired to real data.
          </div>
        )}

        {/* Summary cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Total Requests
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-50">
              {summary.totalRequests ?? 0}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {summary.timeWindowLabel}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Average Latency
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-50">
              {formatMs(summary.avgLatencyMs)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Across all chat requests in window
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Errors
            </div>
            <div className="mt-2 text-2xl font-semibold text-rose-400">
              {summary.totalErrors ?? 0}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Requests that returned non-200 status
            </div>
          </div>
        </section>

        {/* Recent sessions / requests */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">
              Recent Requests
            </h2>
            <div className="text-xs text-slate-500">
              Showing most recent {recent.length || 0}
            </div>
          </div>

          {recent.length === 0 ? (
            <div className="px-4 py-6 text-sm text-slate-400">
              No telemetry records available yet. Generate a few chats, then
              refresh this page once the backend is wired.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-950/40">
                  <tr className="text-xs text-slate-400 uppercase tracking-wide">
                    <th className="px-4 py-2 text-left">Time (UTC)</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Latency</th>
                    <th className="px-4 py-2 text-left">Model</th>
                    <th className="px-4 py-2 text-left hidden sm:table-cell">
                      IP (hash / truncated)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((row) => (
                    <tr
                      key={row.id || row.ts}
                      className="border-t border-slate-800/80"
                    >
                      <td className="px-4 py-2 text-slate-200">
                        {row.ts || "—"}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={
                            row.status === "ok"
                              ? "inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300"
                              : "inline-flex items-center rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-300"
                          }
                        >
                          {row.status || "unknown"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-slate-200">
                        {formatMs(row.latencyMs)}
                      </td>
                      <td className="px-4 py-2 text-slate-300">
                        {row.model || "—"}
                      </td>
                      <td className="px-4 py-2 text-slate-500 hidden sm:table-cell">
                        {row.ip || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
