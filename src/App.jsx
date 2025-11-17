import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import GuidePage from "./pages/GuidePage.jsx";
import Chat from "./pages/Chat.jsx";
import DebugPage from "./pages/DebugPage.jsx";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        {/* ----- Top Navigation ----- */}
        <header className="px-6 py-4 flex justify-between items-center bg-transparent">
          <Link to="/" className="text-2xl font-semibold tracking-tight">
            CogMyra_
          </Link>

          <nav className="flex items-center gap-8 text-sm">
            <Link to="/guide" className="hover:opacity-80 transition">
              Try the Guide
            </Link>

            <Link to="/about" className="hover:opacity-80 transition">
              About CogMyra
            </Link>
          </nav>
        </header>

        {/* ----- Routing Outlets ----- */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/debug" element={<DebugPage />} />
        </Routes>
      </div>
    </Router>
  );
}
