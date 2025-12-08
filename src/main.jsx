import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import GuidePage from "./pages/GuidePage.jsx";
import "./index.css";
import { sendErrorLog } from "./utils/logging.js";
import TelemetryPage from "./pages/TelemetryPage.jsx";

// Global client-side error logging
if (typeof window !== "undefined") {
  window.onerror = function (message, source, lineno, colno, error) {
    try {
      sendErrorLog({
        event_type: "client_error",
        message: message?.toString(),
        stack: error?.stack || "",
        url: window.location.href,
        user_agent: navigator.userAgent,
        source,
        lineno,
        colno,
      });
    } catch (e) {
      console.warn("CMG: failed window.onerror logging", e);
    }
  };

  window.onunhandledrejection = function (event) {
    try {
      const reason = event?.reason;
      sendErrorLog({
        event_type: "unhandled_promise",
        message:
          (reason && reason.toString()) || "Unhandled promise rejection",
        stack: reason?.stack || "",
        url: window.location.href,
        user_agent: navigator.userAgent,
      });
    } catch (e) {
      console.warn("CMG: failed onunhandledrejection logging", e);
    }
  };
}

function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/telemetry" element={<TelemetryPage />} />   {/* NEW ROUTE */}
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
