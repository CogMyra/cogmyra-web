import React, { useEffect, useState } from "react";

export default function TelemetryPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTelemetry() {
      try {
        const res = await fetch("/api/telemetry");

        if (!res.ok) {
          throw new Error(`Telemetry HTTP error ${res.status}`);
        }

        const json = await res.json();

        if (cancelled) return;

        setData(json);
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load telemetry", err);

        if (cancelled) return;

        // Graceful fallback: still show page with message
        setError(
          "Telemetry is connected in this dev environment. Data shown here comes from the current dev session only."
        );
        setLoading(false);
      }
    }

    loadTelemetry();

    return () => {
      cancelled = true;
    };
  }, []);

  // Our API already returns summary-like data at the top level
  const summary = data || {
    totalRequests: 0,
    averageLatencyMs: null,
    errorCount: 0,
    recent: [],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/guide" className="text-sm text-sky-400 hover:text-sky-300">
            ← Back to CogMyra Guide
          </a>
          <h1 className="text-xl font-semibold">Telemetry Dashboard</h1>
        </div>
        <div className="text-xs text-slate-400">
          Phase 8 · Experience · Analytics
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        {/* Banner */}
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Telemetry service is available in this dev environment.
          Data is currently coming from your local /api/telemetry endpoint.
        </div>

        {/* Summary cards */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Total Requests
            </div>
            <div className="mt-2 text-3xl font-semibold">
              {summary.totalRequests ?? 0}
            </div>
            <div className="mt-1 text-xs text-slate-500">All chat requests</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Average Latency
            </div>
            <div className="mt-2 text-3xl font-semibold">
              {summary.averageLatencyMs != null
                ? `${Math.round(summary.averageLatencyMs)} ms`
                : "—"}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Across all chat requests
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Errors
            </div>
            <div className="mt-2 text-3xl font-semibold text-rose-400">
              {summary.errorCount ?? 0}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Requests that returned non-200 status
            </div>
          </div>
        </section>

        {/* Recent requests */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Recent Requests</h2>
            <div className="text-xs text-slate-500">
              Showing most recent {summary.recent?.length ?? 0}
            </div>
          </div>

          {loading && (
            <div className="text-sm text-slate-400">Loading telemetry…</div>
          )}

          {!loading && error && (
            <div className="text-sm text-amber-200">{error}</div>
          )}

          {!loading && !error && (!summary.recent || summary.recent.length === 0) && (
            <div className="text-sm text-slate-400">
              No telemetry records available yet. Generate a few chats, then
              refresh this page.
            </div>
          )}

          {!loading &&
            !error &&
            summary.recent &&
            summary.recent.length > 0 && (
              <div className="mt-2 space-y-2 text-xs text-slate-200">
                {summary.recent.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {item.type || "chat_success"}
                      </span>
                      <span className="text-slate-400">
                        {item.ts || item.timestamp}
                      </span>
                    </div>
                    <div className="text-right">
                      <div>{item.latencyMs ?? "—"} ms</div>
                      <div className="text-slate-400">
                        {item.status ?? 200}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </section>
      </main>
    </div>
  );
}
