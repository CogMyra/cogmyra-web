// --- Configuration -----------------------------------------------------------
const API_BASE =
  new URLSearchParams(location.search).get("api") ||
  localStorage.getItem("apiBase") ||
  "https://cogmyra-api.onrender.com"; // <- change if you want local

// Reflect API base in UI
document.getElementById("apiBase").textContent = API_BASE;

// Small helpers
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");
function setStatus(ok) {
  statusDot.className = "dot " + (ok ? "green" : "red");
  statusText.textContent = ok ? "Online" : "Offline";
}

// --- Health ping (every 8s) --------------------------------------------------
async function ping() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { cache: "no-store" });
    setStatus(res.ok);
  } catch {
    setStatus(false);
  } finally {
    setTimeout(ping, 8000);
  }
}
ping();

// --- Chat submit -------------------------------------------------------------
const form = document.getElementById("chatForm");
const promptEl = document.getElementById("prompt");
const sendBtn = document.getElementById("sendBtn");
const replyEl = document.getElementById("reply");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = (promptEl.value || "").trim();
  if (!text) return;

  sendBtn.disabled = true;
  replyEl.textContent = "…";
  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // You can pass `model` here to override server default if desired.
      body: JSON.stringify({
        sessionId: "web-beta",
        messages: [
          { role: "system", content: "You are CogMyra Guide (CMG)." },
          { role: "user", content: text },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      replyEl.textContent = `HTTP ${res.status}: ${err}`;
      return;
    }

    const data = await res.json();
    replyEl.textContent = data.reply ?? "(no reply)";
  } catch (err) {
    replyEl.textContent = `Network error: ${String(err)}`;
  } finally {
    sendBtn.disabled = false;
  }
});

// --- Logs --------------------------------------------------------------------
const logsBtn = document.getElementById("refreshLogs");
const logsPre = document.getElementById("logs");

logsBtn.addEventListener("click", refreshLogs);
async function refreshLogs() {
  logsPre.textContent = "loading…";
  try {
    const res = await fetch(`${API_BASE}/api/admin/logs?limit=25`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    logsPre.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    logsPre.textContent = `Failed to load logs: ${e}`;
  }
}
