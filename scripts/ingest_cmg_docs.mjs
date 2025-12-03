// scripts/ingest_cmg_docs.mjs
// CMG Ingestion Pipeline (Vectorize v2): chunk → embed → upsert into Cloudflare Vectorize (NDJSON)

import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";
import { OpenAI } from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIG
const DOCS_DIR = path.join(__dirname, "..", "cmg_docs"); // uses your cmg_docs folder
const VECTOR_INDEX = "cmg_index"; // must match the index name in Cloudflare Vectorize
const CHUNK_SIZE = 1200;
const CHUNK_OVERLAP = 200;

// INIT OPENAI CLIENT
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ------ CHUNKING FUNCTION ------
function chunkText(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = start + chunkSize;
    const chunk = text.slice(start, end);
    chunks.push(chunk);
    start = end - overlap;
  }

  return chunks;
}

// ------ BUILD NDJSON PAYLOAD FOR VECTORIZE v2 ------
function buildNdjsonPayload(vectors) {
  // vectors: [{ id, values, metadata }, ...]
  return vectors.map((v) => JSON.stringify(v)).join("\n") + "\n";
}

// ------ MAIN INGEST FUNCTION ------
async function ingest() {
  console.log("Starting CMG ingestion...");

  const { OPENAI_API_KEY, CF_ACCOUNT_ID, CF_API_TOKEN } = process.env;

  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  if (!CF_ACCOUNT_ID) {
    throw new Error("CF_ACCOUNT_ID is not set");
  }
  if (!CF_API_TOKEN) {
    throw new Error("CF_API_TOKEN is not set");
  }

  if (!fs.existsSync(DOCS_DIR)) {
    throw new Error(`Docs directory not found: ${DOCS_DIR}`);
  }

  const files = fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".txt"));

  if (files.length === 0) {
    console.log("No .md or .txt files found in cmg_docs. Nothing to ingest.");
    return;
  }

  console.log(`Found ${files.length} files to ingest:`);
  files.forEach((f) => console.log(" -", f));

  for (const file of files) {
    const filePath = path.join(DOCS_DIR, file);
    const content = fs.readFileSync(filePath, "utf8");

    console.log(`\nProcessing file: ${file}`);
    const chunks = chunkText(content);

    console.log(` → Created ${chunks.length} chunks`);

    const vectors = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      // 1. Embed with OpenAI (1536 dims for text-embedding-3-small)
      const embed = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
      });

      const vector = embed.data[0].embedding;
      const id = `${file}-chunk-${i}`;

      vectors.push({
        id,
        values: vector,
        metadata: {
          file,
          chunk_index: i,
          timestamp: Date.now(),
        },
      });

      console.log(`Prepared vector: ${id} (dim=${vector.length})`);
    }

    // 2. Upsert all vectors for this file via Vectorize v2 NDJSON API
    console.log(`\nUpserting ${vectors.length} vectors to Vectorize index "${VECTOR_INDEX}"...`);

    const ndjsonBody = buildNdjsonPayload(vectors);

    const url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/vectorize/v2/indexes/${VECTOR_INDEX}/upsert`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CF_API_TOKEN}`,
        "Content-Type": "application/x-ndjson",
      },
      body: ndjsonBody,
    });

    const text = await res.text();

    if (!res.ok) {
      console.error(`Failed to upsert vectors for file ${file}:`, res.status, text);
      throw new Error(`Vectorize v2 upsert failed for file ${file}`);
    }

    console.log(`Upsert response for ${file}:`, text);
  }

  console.log("\nCMG ingestion complete.");
}

ingest().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});

