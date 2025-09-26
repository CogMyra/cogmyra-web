/**
 * Minimal client JS for /guide page.
 * Wires the input + Send button to your API: https://cogmyra-api.onrender.com/api
 */
const API_BASE = "https://cogmyra-api.onrender.com/api";

// --- helpers
const $ = (sel) => document.querySelector(sel);
const byId = (id) => document.getElementById(id);

// --- DOM elements (using the structure in your screenshot)
const input = $('input[placeholder="Ask something…"], input[placeholder="Ask something..."], textarea[placeholder]');
const sendBtn = Array.from(document.querySelectorAll("button"))
  .find((b) => /send/i.test(b.textContent || ""));
const replyBox = Array.from(document.querySelectorAll("*"))
  .find((el) => /Assistant reply:/i.test(el.textContent || ""))?.parentElement?.querySelector(":scope *:not(:first-child)");
const logsBox = Array.from(document.querySelectorAll("code, pre, div"))
  .find((el) => /^\s*\{\s*\}\s*$/.test((el.textContent || "").trim())) || document.body;

// indicator dot (if present)
const dot = Array.from(document.querySelectorAll("button, span, div"))
  .find((el) => el.title?.includes("API Base") || el.ariaLabel?.includes("API Base")) ||
  document.querySelector("button[title], span[title], i[title]");

// --- small UI helpers
const setDot = (ok) => {
  try {
    if (!dot) return;
    dot.style.background = ok ? "var(--ok, #22c55e)" : "var(--err, #ef4444)";
    dot.style.boxShadow = "0 0 0 2px rgba(255,255,255,0.2) inset";
  } catch {}
};
const setReply = (txt) => {
  if (replyBox) {
    replyBox.textContent = txt;
  } else {
    console.log("Assistant reply:", txt);
  }
};
const setLogs = (obj) => {
  try {
    if (logsBox) logsBox.textContent = JSON.stringify(obj ?? {}, null, 2);
  } catch {}
};

// --- ping API on load to color the dot
(async () => {
  try {
    const r = await fetch(`${API_BASE}/health`, { credentials: "include" });
    setDot(r.ok);
  } catch {
    setDot(false);
  }
})();

// --- send handler
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

    const data = await res.json().catch(() => ({}));
    setDot(res.ok);
    if (!res.ok) {
      setReply("—");
      setLogs({ error: true, status: res.status, data });
      alert(`API error ${res.status}`);
      return;
    }

    setReply(data.reply || "(no reply)");
    setLogs(data);
  } catch (e) {
    setDot(false);
    setReply("—");
    setLogs({ error: String(e) });
    alert("Network error; see console.");
  } finally {
    sendBtn?.removeAttribute("disabled");
  }
}

// --- wire events
sendBtn?.addEventListener("click", send);
input?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});
