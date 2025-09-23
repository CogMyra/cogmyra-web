import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "https://cogmyra-api.onrender.com";

export default function DebugPage() {
  const [health, setHealth] = useState({ ok: null, raw: null });

  useEffect(() => {
    fetch(`${API_BASE}/api/health`)
      .then(r => r.json())
      .then(data => setHealth({ ok: true, raw: data }))
      .catch(() => setHealth({ ok: false, raw: null }));
  }, []);

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <h1>CogMyra — Debug Page</h1>
      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, maxWidth: 720 }}>
        <p><strong>API Base:</strong> {API_BASE}</p>
        <p>
          <strong>Health:</strong>{" "}
          {health.ok === null ? "…" : health.ok ? "✅ OK" : "❌ Unavailable"}
        </p>
        <details>
          <summary>Raw health response</summary>
          <pre>{JSON.stringify(health.raw, null, 2)}</pre>
        </details>
      </div>
    </div>
  );
}
