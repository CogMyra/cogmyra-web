// functions/api/ingest_cmg_docs.js
//
// One-off/occasional endpoint to ingest all CMG config docs into the
// Vectorize index bound as env.VECTORIZE.
//
// Flow:
//   1. List all keys in the CMG_DOCS KV namespace
//   2. For each key, load the full text
//   3. Chunk the text
//   4. Embed each chunk with Workers AI
//   5. Upsert into the Vectorize index with metadata

import { embedText, chunkText, logServer } from "../_cmg";

/**
 * POST /api/ingest_cmg_docs
 *
 * WARNING: This is a maintenance endpoint intended for you, not the public UI.
 * Right now it has no auth. Later we can gate it behind a secret token.
 */
export const onRequestPost = async (context) => {
  const { env } = context;
  const { CMG_DOCS, VECTORIZE } = env;

  if (!CMG_DOCS) {
    return jsonError("CMG_DOCS KV binding is missing from env", 500);
  }
  if (!VECTORIZE) {
    return jsonError("VECTORIZE index binding is missing from env", 500);
  }
  if (!env.AI) {
    return jsonError("Workers AI (env.AI) binding is missing from env", 500);
  }

  try {
    // 1) List all CMG docs in KV
    const listResult = await CMG_DOCS.list();
    const keys = listResult.keys?.map((k) => k.name) ?? [];

    if (keys.length === 0) {
      return jsonOk({
        message: "No CMG docs found in CMG_DOCS KV namespace.",
        ingestedDocuments: 0,
        ingestedChunks: 0,
      });
    }

    logServer("Starting CMG ingestion", { documentCount: keys.length });

    let totalChunks = 0;
    const perDocStats = [];

    // 2) Loop through each KV key
    for (const key of keys) {
      const text = await CMG_DOCS.get(key, "text");
      if (!text) {
        logServer("Skipping empty CMG_DOCS key", { key });
        continue;
      }

      // 3) Chunk the document text
      const chunks = chunkText(text, 2000, 300);
      if (!chunks.length) {
        logServer("No chunks produced for key", { key });
        continue;
      }

      logServer("Ingesting document", { key, chunkCount: chunks.length });

      // 4) Embed and upsert each chunk
      let chunkIndex = 0;
      for (const chunk of chunks) {
        const vector = await embedText(env, chunk);

        const id = `${key}::${chunkIndex}`;

        await VECTORIZE.upsert([
          {
            id,
            values: vector,
            metadata: {
              cmg_key: key,
              chunk_index: chunkIndex,
              text_preview: chunk.slice(0, 160),
            },
          },
        ]);

        chunkIndex += 1;
        totalChunks += 1;
      }

      perDocStats.push({
        key,
        chunkCount: chunks.length,
      });
    }

    logServer("Finished CMG ingestion", {
      documentCount: perDocStats.length,
      totalChunks,
    });

    return jsonOk({
      message: "CMG docs ingested into Vectorize.",
      ingestedDocuments: perDocStats.length,
      ingestedChunks: totalChunks,
      documents: perDocStats,
    });
  } catch (err) {
    logServer("Error during CMG ingestion", { error: String(err) });
    return jsonError("Error during CMG ingestion: " + String(err), 500);
  }
};

// Small helpers to keep responses consistent

function jsonOk(body) {
  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function jsonError(message, status = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
