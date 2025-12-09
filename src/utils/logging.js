// src/utils/logging.js
// Lightweight, safe client-side error logger.
// Right now this just logs to the console so it cannot break the app.
// You can wire this into /api/log later if you want.

export function sendErrorLog(...args) {
  try {
    // Basic console logging for now
    if (typeof console !== "undefined") {
      console.error("[CogMyra ErrorLog]", ...args);
    }
  } catch {
    // Swallow any logging errors completely
  }
}
