const API = "https://cogmyra-api.onrender.com"; // hosted API

const el = (id) => document.getElementById(id);
el("apiBase").textContent = API;

async function getJSON(url, opts) {
  const res = await fetch(url, opts);
  const text = await res.text();
  try { return { ok: res.ok, json: JSON.parse(text) }; }
  catch { return { ok: res.ok, json: { raw: text } }; }
}

// Health check
(async () => {
  const { ok } = await getJSON(`${API}/api/health`);
  el("health").textContent = ok ? "OK" : "ERROR";
  el("health").className = ok ? "ok" : "err";
})();

// Send chat
el("chatForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = el("userInput").value.trim();
  if (!input) return;

  el("sendBtn").disabled = true;
  el("replyBox").textContent = "…";

  const { ok, json } = await getJSON(`${API}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "guide",
      messages: [
        { role: "system", content: "You are CogMyra Guide (CMG)." },
        { role: "user", content: input }
      ]
    })
  });

  el("replyBox").textContent = ok ? (json.reply ?? "(no reply)") : JSON.stringify(json, null, 2);
  el("sendBtn").disabled = false;

  // Try to show model from logs
  setTimeout(fetchLogs, 200);
});

async function fetchLogs() {
  const { ok, json } = await getJSON(`${API}/api/admin/logs?limit=10`);
  el("logsBox").textContent = ok ? JSON.stringify(json, null, 2) : "error";
  // Try to surface model in the header if present
  try {
    const entries = json.entries || [];
    const last = entries.find(e => e.kind === "chat_res" && e.model) || entries.find(e => e.model);
    el("model").textContent = last?.model || "—";
  } catch {
    el("model").textContent = "—";
  }
}

el("logsBtn").addEventListener("click", fetchLogs);
