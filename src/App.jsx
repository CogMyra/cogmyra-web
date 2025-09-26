// src/App.jsx
import { useState } from "react";
import Chat from "./pages/Chat";
import DebugPage from "./pages/DebugPage";

export default function App() {
  const [tab, setTab] = useState("chat"); // "chat" | "debug"

  return (
    <div>
      <div style={{
        display: "flex", gap: 12, padding: "12px 16px",
        borderBottom: "1px solid #eee", fontFamily: "Inter, system-ui, sans-serif"
      }}>
        <button
          onClick={() => setTab("chat")}
          style={{
            padding: "6px 10px", borderRadius: 8,
            background: tab === "chat" ? "#000" : "#f3f4f6",
            color: tab === "chat" ? "#fff" : "#111"
          }}
        >
          Chat
        </button>
        <button
          onClick={() => setTab("debug")}
          style={{
            padding: "6px 10px", borderRadius: 8,
            background: tab === "debug" ? "#000" : "#f3f4f6",
            color: tab === "debug" ? "#fff" : "#111"
          }}
        >
          Debug
        </button>
      </div>

      {tab === "chat" ? <Chat /> : <DebugPage />}
    </div>
  );
}
