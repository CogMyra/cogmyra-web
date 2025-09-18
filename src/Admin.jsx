import { useState } from "react";

/**
 * Admin panel
 * - Reads API base from VITE_API_BASE (e.g. https://cogmyra-api.onrender.com/api)
 * - Sends x-admin-key header
 * - Refresh stats (GET /admin/stats)
 * - Export CSV (GET /admin/export.csv)
 */
const API = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/, ""); // strip trailing /

export default function Admin() {
  const [adminKey, setAdminKey] = useState(
    import.meta.env.VITE_ADMIN_PASSWORD || ""
  );
  const [stats, setStats] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function refreshStats() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${API}/admin/stats`, {
        headers: { "x-admin-key": adminKey },
      });
      if (!res.ok) throw new Error(`Stats failed: ${res.status}`);
      const json = await res.json();
      setStats(json);
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setBusy(false);
    }
  }

  async function exportCsv() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${API}/admin/export.csv`, {
        headers: { "x-admin-key": adminKey },
      });
      if (!res.ok) throw new Error(`Export failed: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "interactions.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ marginTop: 32 }}>
      <h2>Admin</h2>
      <label style={{ display: "block", marginBottom: 8 }}>
        Admin key (sent as <code>x-admin-key</code>)
      </label>
      <input
        value={adminKey}
        onChange={(e) => setAdminKey(e.target.value)}
        type="password"
        style={{ width: "100%", padding: 10, fontSize: 16 }}
      />
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <button onClick={refreshStats} disabled={busy}>
          Refresh Stats
        </button>
        <button onClick={exportCsv} disabled={busy}>
          Export CSV
        </button>
      </div>

      {error && (
        <div style={{ marginTop: 12, color: "white", background: "#c0392b", padding: 12, borderRadius: 6 }}>
          {error}
        </div>
      )}

      <pre style={{ marginTop: 14, padding: 12, background: "#f6f8fa", borderRadius: 6, overflowX: "auto" }}>
{JSON.stringify(stats ?? {}, null, 2)}
      </pre>

      <p style={{ marginTop: 12, color: "#666" }}>
        API Base: <code>{API || "(unset)"}</code>
      </p>
    </div>
  );
}
