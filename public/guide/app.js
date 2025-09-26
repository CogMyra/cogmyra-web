/**
 * Guide page client — sends message + temperature to your API.
 */
const API_BASE = "https://cogmyra-api.onrender.com/api";

// ---- element getters (by ID; we control guide.html)
const $ = (id) => document.getElementById(id);
const input = $("userInput");
const sendBtn = $("sendBtn");
const tempSlider = $("temp");
const tempValue = $("tempValue");
const replyBox = $("assistantReply");
const logsBox = $("logs");

// ---- small helpers
function setReply(txt) {
  if (replyBox) replyBox.textContent = txt;
  else console.log("Assistant reply:", txt);
}
function setLogs(obj) {
  try {
    if (logsBox) logsBox.textContent = JSON.stringify(obj ?? {}, null, 2);
  } catch {}
}

// reflect slider value in the little <code> badge
function reflectTemp() {
  if (tempValue && tempSlider) tempValue.textContent = String(tempSlider.value);
}

// ---- ping API on load (for a quick health indicator in logs)
(async () => {
  try {
    const r = await fetch(`${API_BASE}/health`, { credentials: "include" });
    const j = await r.json().catch(() => ({}));
    setLogs({ health: { ok: r.ok, ...j } });
  } catch (e) {
    setLogs({ healthError: String(e) });
  }
  reflectTemp();
})();

// ---- main send handler
async function send() {
  const text = (input?.value || "").trim();
  const temperature = parseFloat(tempSlider?.value || "1.0");

  if (!text) return;

  sendBtn?.setAttribute("disabled", "true");
  setReply("…");
  setLogs({ sending: true, model: "gpt-4.1", temperature });

  const body = {
    sessionId: "guide",
    model: "gpt-4.1",
    temperature,
    messages: [{ role: "user", content: text }],
  };

  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

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
    setLogs({ error: String(e) });
    alert("Network error; see console.");
  } finally {
    sendBtn?.removeAttribute("disabled");
  }
}

// ---- wire events
sendBtn?.addEventListener("click", send);
input?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});
tempSlider?.addEventListener("input", reflectTemp);
