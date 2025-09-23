import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Find the root div created in index.html
const rootElement = document.getElementById("root");

// Create a React root and render the App component
createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
