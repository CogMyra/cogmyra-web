// src/lib/api.ts

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

// During local dev, we want the web app to talk to the local FastAPI server.
// You can still override via VITE_API_BASE if you need.
const API_BASE =
  (import.meta as any).env?.VITE_API_BASE ?? "http://127.0.0.1:8000";

function url(path: string) {
  return `${API_BASE}${path}`;
}

export async function chat(messages: ChatMessage[], sessionId = "local-dev") {
  const body = { messages, sessionId };

  console.log(
    ">>> Fetching",
    url("/api/chat"),
    "with body",
    JSON.parse(JSON.stringify(body))
  );

  const res = await fetch(url("/api/chat"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  console.log("<<< Response raw:", text);

  if (!res.ok) {
    throw new Error(`Chat failed (${res.status}): ${text}`);
  }

  let data: any = {};
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Chat response was not JSON");
  }

  return (data.reply as string) ?? "";
}

export async function getAdminLogs(limit = 50) {
  const res = await fetch(url(`/api/admin/logs?limit=${limit}`));
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Logs failed (${res.status}): ${t}`);
  }
  return res.json();
}

export async function health() {
  const res = await fetch(url("/api/health"));
  return res.ok;
}
