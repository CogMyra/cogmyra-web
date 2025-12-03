// functions/_cmg.js
// Shared helpers for CogMyra Guide:
// - Embedding text with Cloudflare Workers AI
// - Chunking long documents for Vectorize
// - Simple logging

const EMBEDDING_MODEL = "@cf/baai/bge-base-en-v1.5";

/**
 * Create a 1536-dimensional embedding for the given text
 * using Cloudflare Workers AI and the BGE-base model.
 *
 * @param {Env} env - Cloudflare environment (must have env.AI bound)
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} - Embedding vector
 */
export async function embedText(env, text) {
  if (!text || !text.trim()) {
    throw new Error("embedText called with empty text");
  }

  const result = await env.AI.run(EMBEDDING_MODEL, { text });

  // Cloudflare returns { data: [ [..vector..] ] } for BGE models
  const vector = Array.isArray(result?.data?.[0]) ? result.data[0] : null;

  if (!vector) {
    throw new Error("Failed to get embedding vector from Workers AI response");
  }

  return vector;
}

/**
 * Chunk a long string into overlapping pieces suitable for embeddings.
 *
 * @param {string} text - Full document text
 * @param {number} maxChars - Target max characters per chunk
 * @param {number} overlapChars - Overlap between chunks
 * @returns {string[]} chunks
 */
export function chunkText(text, maxChars = 2000, overlapChars = 300) {
  if (!text || text.length <= maxChars) {
    return text ? [text] : [];
  }

  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + maxChars, text.length);
    let chunk = text.slice(start, end);

    // Try not to split in the middle of a sentence
    if (end < text.length) {
      const lastPeriod = chunk.lastIndexOf(".");
      if (lastPeriod > 0 && lastPeriod > maxChars * 0.6) {
        chunk = chunk.slice(0, lastPeriod + 1);
      }
    }

    chunks.push(chunk.trim());

    if (end === text.length) break;

    start = start + maxChars - overlapChars;
  }

  return chunks.filter(Boolean);
}

/**
 * Simple helper for consistent server-side logging.
 * (Safe to remove later; useful while we’re wiring everything.)
 */
export function logServer(message, data) {
  const prefix = "[CMG]";
  if (data !== undefined) {
    console.log(prefix, message, data);
  } else {
    console.log(prefix, message);
  }
}
