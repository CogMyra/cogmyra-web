// src/pages/DebugPage.jsx
import { useEffect, useMemo, useState } from "react";

export default function DebugPage() {
  const api = useMemo(
    () => (import.meta.env.VITE_API_BASE || "https://cogmyra-api.onrender.com").replace(/\/+$/, ""),
    []
  );

  const [health, setHealth] = useState({ ok: false, error: "" });

  async function checkHealth() {
    try {
      const r = await fetch(`${api}/api/health`, {
        method: "GET",
        // no cookies; keep it simple for CORS
        credentials: "omit",
        cache: "no-store",
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      if (j?.status === "ok") {
        setHealth({ ok: true, error: "" });
      } else {
        setHealth({ ok: false, error: `Unexpected body: ${JSON.stringify(j)}` });
      }
    } catch (e) {
      setHealth({ ok: false, error: String(e) });
    }
  }

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div style={{ maxWidth: 880, margin: "32px auto", padding: 16, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1 style={{ marginBottom: 8 }}>CogMyra — Debug</h1>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 10, height: 10,
          borderRadius: 10,
          background: health.ok ? "#22c55e" : "#ef4444",
          boxShadow: "0 0 0 2px rgba(0,0,0,0.05)"
        }} />
        <div>
          <div>API Base: <code>{api}</code></div>
          <div style={{ color: health.ok ? "#16a34a" : "#ef4444", fontSize: 12 }}>
            {health.ok ? "Health: OK" : `Health: Network error ${health.error ? `(${health.error})` : ""}`}
          </div>
        </div>
        <button onClick={checkHealth} style={{ marginLeft: "auto", padding: "6px 10px", borderRadius: 8 }}>
          Recheck
        </button>
      </div>
    </div>
  );
}
