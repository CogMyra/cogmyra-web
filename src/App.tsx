import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import DebugPage from "./pages/DebugPage";
import Admin from "./Admin";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Skip link target */}
        <header className="sr-only">
          <h1>CogMyra Application</h1>
        </header>

        {/* Main content area with landmark */}
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/debug" element={<DebugPage />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <footer className="p-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} CogMyra — All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;
