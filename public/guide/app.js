// ~/cogmyra-web/public/guide/app.js

// ---- Config
const DEFAULT_API = "https://cogmyra-api.onrender.com/api";
let API_BASE = DEFAULT_API;

// ---- Simple DOM helpers
const $ = (sel) => document.querySelector(sel);

function getPromptBox() {
  return $("#prompt");
}
function getTempSlider() {
  return $("#temp");
}
function getReplyBox() {
  return $("#assistantReply");
}
function getLogsBox() {
  return $("#logs");
}
function setReply(txt) {
  const box = getReplyBox();
  if (box) box.textContent = txt;
  else console.log("Assistant reply:", txt);
}
function setLogs(obj) {
  const box = getLogsBox();
  try {
    box.textContent = JSON.stringify(obj, null, 2);
  } catch {
    box.textContent = String(obj);
  }
}

// ---- API base dot (green/red) indicator
function setApiStatus(ok) {
  const dot = $("#api-dot");
  if (!dot) return;
  dot.style.background = ok ? "#21c55d" : "#ef4444"; // green / red
}

// ---- Send handler
async function handleSend() {
  const prompt = (getPromptBox()?.value || "").trim();
  const tStr = getTempSlider()?.value;
  const temperature =
    tStr != null && tStr !== "" ? Number(tStr) : undefined;

  if (!prompt) {
    setReply("—");
    setLogs({ error: "Empty prompt" });
    return;
  }

  // Build request
  const body = {
    sessionId: "guide",
    model: "gpt-4.1",
    messages: [{ role: "user", content: prompt }],
  };
  if (!Number.isNaN(temperature)) body.temperature = temperature;

  setReply("…");
  setLogs({ sending: true, body });

  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    // Build a small suffix with latency/tokens if present
    const extra = [];
    if (typeof data.latency_ms === "number") {
      extra.push(`⏱ ${data.latency_ms} ms`);
    }
    if (data.usage && data.usage.total_tokens != null) {
      extra.push(`🔢 ${data.usage.total_tokens} tokens`);
    }
    const suffix = extra.length ? `\n\n(${extra.join(" · ")})` : "";

    setReply((data.reply || "(no reply)") + suffix);
    setLogs(data);

    setApiStatus(res.ok);
    if (!res.ok) {
      console.warn("API error", res.status, data);
    }
  } catch (err) {
    setReply("—");
    setLogs({ error: String(err && err.message || err) });
    setApiStatus(false);
  }
}

// ---- Temperature label update
function wireTempLabel() {
  const slider = getTempSlider();
  const label = $("#temp-value");
  if (!slider || !label) return;
  const update = () => {
    label.textContent = String(Number(slider.value));
  };
  slider.addEventListener("input", update);
  update();
}

// ---- API base picker
function wireApiPicker() {
  const input = $("#api-base");
  if (!input) return;
  const apply = () => {
    const val = (input.value || "").trim();
    API_BASE = val || DEFAULT_API;
    $("#api-base-current").textContent = API_BASE.replace(/\/+$/, "");
  };
  input.addEventListener("change", apply);
  apply();
}

// ---- Wire buttons
function wireButtons() {
  $("#send")?.addEventListener("click", handleSend);
  $("#refreshLogs")?.addEventListener("click", async () => {
    // Small health ping just to update the status dot
    try {
      const r = await fetch(`${API_BASE}/health`, { credentials: "include" });
      setApiStatus(r.ok);
      setLogs({ health: r.status, ...(await r.json().catch(() => ({}))) });
    } catch (e) {
      setApiStatus(false);
      setLogs({ error: String(e && e.message || e) });
    }
  });
}

// ---- Init
function init() {
  wireButtons();
  wireTempLabel();
  wireApiPicker();
  // start with a green/red check
  $("#refreshLogs")?.click();
}

document.addEventListener("DOMContentLoaded", init);
