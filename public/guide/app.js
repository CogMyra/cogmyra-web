const API = "https://cogmyra-api.onrender.com";
const $apiBase = document.getElementById("apiBase");
const $apiDot  = document.getElementById("apiDot");
const $prompt  = document.getElementById("prompt");
const $send    = document.getElementById("send");
const $reply   = document.getElementById("reply");
const $refresh = document.getElementById("refresh");
const $logs    = document.getElementById("logs");

$apiBase.textContent = API;

function setDot(ok) {
  $apiDot.textContent = "●";
  $apiDot.style.color = ok ? "#6cff9f" : "#ff7d7d";
}

async function health() {
  try {
    const r = await fetch(`${API}/api/health`, { method: "GET", cache: "no-store" });
    setDot(r.ok);
  } catch {
    setDot(false);
  }
}

async function send() {
  const text = ($prompt.value || "").trim();
  if (!text) return;
  $send.disabled = true;
  $reply.textContent = "…";
  try {
    const r = await fetch(`${API}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "guide",
        messages: [
          { role: "system", content: "You are CogMyra Guide (CMG)." },
          { role: "user", content: text }
        ]
      })
    });
    setDot(r.ok);
    const data = await r.json();
    $reply.textContent = data.reply ?? "(no reply)";
  } catch (e) {
    setDot(false);
    $reply.textContent = `Network error: ${e}`;
  } finally {
    $send.disabled = false;
  }
}

async function refreshLogs() {
  try {
    const r = await fetch(`${API}/api/admin/logs?limit=20`, { cache: "no-store" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    $logs.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    $logs.textContent = JSON.stringify({ error: String(e) }, null, 2);
  }
}

$send.addEventListener("click", send);
$refresh.addEventListener("click", refreshLogs);
$prompt.addEventListener("keydown", (e) => e.key === "Enter" && send());

health();
