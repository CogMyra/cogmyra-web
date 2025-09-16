import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

function BetaGate() {
  const [entered, setEntered] = useState(false);
  const [input, setInput] = useState("");
  const correct = import.meta.env.VITE_BETA_PASSWORD;

  if (!entered) {
    return (
      <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center", fontFamily: "ui-sans-serif, system-ui" }}>
        <div style={{ width: "min(420px, 92vw)", padding: "24px", borderRadius: "16px", boxShadow: "0 6px 30px rgba(0,0,0,0.12)", border: "1px solid rgba(0,0,0,0.08)" }}>
          <h2 style={{ margin: 0, marginBottom: "12px" }}>CogMyra Private Beta</h2>
          <p style={{ marginTop: 0, marginBottom: "16px", opacity: 0.8 }}>This site is password-protected.</p>
          <input
            type="password"
            placeholder="Enter password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.15)", outline: "none" }}
          />
          <button
            onClick={() => input === correct && setEntered(true)}
            style={{ marginTop: "12px", width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.15)", background: "black", color: "white", cursor: "pointer" }}
          >
            Enter
          </button>
          {input && input !== correct && (
            <p style={{ color: "crimson", marginTop: "10px" }}>Wrong password</p>
          )}
        </div>
      </div>
    );
  }

  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BetaGate />
  </React.StrictMode>
);
