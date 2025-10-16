// src/App.jsx
import React, { useState } from "react";
import { fetchWithRetry } from "./lib/retry";
import Chat from "./pages/Chat";
import DebugPage from "./pages/DebugPage";

export default function App() {
  const [tab, setTab] = useState("chat"); // "chat" | "debug"
  const [statusMsg, setStatusMsg] = useState(null);
  const [isBusy, setIsBusy] = useState(false);

  async function postEvent(eventPayload) {
    setIsBusy(true);
    setStatusMsg(null);

    try {
      const res = await fetchWithRetry(
        "/api/events",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventPayload),
        },
        {
          retries: 3,
          baseDelayMs: 500,
          maxDelayMs: 5000,
          onRetry: (attempt, err, delay) => {
            setStatusMsg(
              `Connection hiccup. Retrying (${attempt}/3) in ~${Math.round(delay / 100) / 10}s…`
            );
          },
        }
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Server error (${res.status}). ${text || ""}`.trim());
      }

      setStatusMsg(null);
      return await res.json();
    } catch (err) {
      setStatusMsg("We hit a temporary error. Please try again.");
      throw err;
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div>
      {/* Top nav */}
      <div
        style={{
          display: "flex",
          gap: 12,
          padding: "12px 16px",
          borderBottom: "1px solid #eee",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <button
          onClick={() => setTab("chat")}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            background: tab === "chat" ? "#000" : "#f3f4f6",
            color: tab === "chat" ? "#fff" : "#111",
          }}
        >
          Chat
        </button>

        <button
          onClick={() => setTab("debug")}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            background: tab === "debug" ? "#000" : "#f3f4f6",
            color: tab === "debug" ? "#fff" : "#111",
          }}
        >
          Debug
        </button>

        <button
          disabled={isBusy}
          onClick={async () => {
            await postEvent({
              cmg_uid: localStorage.getItem("cmg_uid"),
              type: "mode.completed",
              payload: {
                output: { title: "Test Output", tags: ["demo"], body: "Hello" },
              },
            });
          }}
          style={{
            marginLeft: 12,
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #ccc",
            background: isBusy ? "#ddd" : "#fff",
          }}
        >
          {isBusy ? "Working..." : "Simulate Mode Complete"}
        </button>
      </div>

      {/* Transient status banner */}
      {statusMsg && (
        <div
          style={{
            margin: "8px 16px",
            padding: "6px 10px",
            border: "1px solid #ccc",
            borderRadius: 6,
            fontSize: "0.85rem",
          }}
        >
          {statusMsg}
        </div>
      )}

      {/* Page content */}
      {tab === "chat" ? <Chat /> : <DebugPage />}
    </div>
  );
}
