import "./eventLogger";
// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Initialize event logger (queue + batching + offline)
import { initLogger } from "./lib/logger.js";
initLogger({ endpoint: "/api/events" });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
