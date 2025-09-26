// src/lib/api.ts

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

// Base URL: prod API server, override with VITE_API_BASE if needed
const API_BASE =
  (import.meta as any).env?.VITE_API_BASE ?? "https://cogmyra-api.onrender.com";

// Always prefix paths with /api
function url(path: string) {
  return `${API_BASE}/api${path}`;
}

export async function chat(messages: ChatMessage[], sessionId = "local-dev") {
  const body = { messages, sessionId };

  const res = await fetch(url("/chat"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Chat API error: ${res.status}`);
  }

  return res.json();
}

export async function health() {
  const res = await fetch(url("/health"));
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}
