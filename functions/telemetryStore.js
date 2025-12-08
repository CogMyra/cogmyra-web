// functions/telemetryStore.js
// Dev-only in-memory telemetry buffer for CogMyra.
//
// This lives only in the current worker instance and is NOT persistent.
// It is good enough for local dev and the Phase 8 telemetry dashboard.

export const TELEMETRY_EVENTS = [];

/**
 * Push a telemetry event into the in-memory buffer.
 * We keep only the most recent 500 events.
 */
export function pushTelemetry(event) {
  try {
    TELEMETRY_EVENTS.push({
      ts: new Date().toISOString(),
      ...event,
    });

    if (TELEMETRY_EVENTS.length > 500) {
      TELEMETRY_EVENTS.shift();
    }
  } catch (err) {
    // Fail-open: telemetry must never break the app.
    console.error("Telemetry push failed:", err);
  }
}
