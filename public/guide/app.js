/**
 * Minimal client JS for /guide page.
 * Talks to: https://cogmyra-api.onrender.com/api
 */
const API_BASE = "https://cogmyra-api.onrender.com/api";

// ---- DOM by fixed IDs from guide.html
const input     = document.getElementById("userInput");
const sendBtn   = document.getElementById("sendBtn");
const replyBox  = document.getElementById("assistantReply");
const logsBox   = document.getElementById("logs");

// ---- UI helpers
function setReply(txt) {
  if (replyBox) replyBox.textContent = txt;
  else console.log("Assistant reply:", txt);
}
function setLogs(obj) {
  if (logsBox) {
    try { logsBox.textContent = JSON.stringify(obj ?? {}, null, 2); }
    catch { logsBox.textContent = String(obj); }
  } else {
    console.log(obj);
  }
}

// ---- ping API on load so the page shows something useful
(async () => {
  try {
    const r = await fetch(`${API_BASE}/health`, { credentials: "include" });
    const data = await r.json();
    setLogs({ health: r.status, ...data });
  } catch (e) {
    setLogs({ healthError: String(e) });
  }
})();

// ---- main send handler
async function send() {
  const text = (input?.value || "").trim();
  if (!text) return;

  sendBtn?.setAttribute("disabled", "true");
  setReply("…");
  setLogs({ sending: true, model: "gpt-4.1" });

  const body = {
    sessionId: "guide",
    model: "gpt-4.1",
    messages: [{ role: "user", content: text }],
  };

  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    // try to read JSON even on non-200
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setReply("—");
      setLogs({ error: true, status: res.status, data });
      alert(`API error ${res.status}`);
      return;
    }

    setReply(data.reply || "(no reply)");
    setLogs(data);
  } catch (e) {
    setReply("—");
    setLogs({ networkError: String(e) });
    alert("Network error; see console.");
  } finally {
    sendBtn?.removeAttribute("disabled");
  }
}

// ---- events
sendBtn?.addEventListener("click", send);
input?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});
