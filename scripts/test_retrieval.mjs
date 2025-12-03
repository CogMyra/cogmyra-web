// scripts/test_retrieval.mjs
// Manual retrieval test for CMG Vectorize index

import process from "process";
import { OpenAI } from "openai";

const VECTOR_INDEX = "cmg_index"; // same as ingestion

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testRetrieval() {
  console.log("Starting CMG retrieval test...");

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  if (!process.env.CF_ACCOUNT_ID) {
    throw new Error("CF_ACCOUNT_ID is not set");
  }
  if (!process.env.CF_API_TOKEN) {
    throw new Error("CF_API_TOKEN is not set");
  }

  // 1. Build a query embedding with the SAME model as ingestion
  const queryText = "CogMyra Guide system prompt and configuration overview";
  console.log("Embedding query text:", queryText);

  const embed = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: queryText,
  });

  const vector = embed.data[0].embedding;

  console.log("Embedding length:", vector.length);

  // 2. Query Cloudflare Vectorize (v2 API)
  const body = {
    vector,
    topK: 5,
    returnValues: false,
    returnMetadata: "all",
  };

  console.log("Sending query to Cloudflare Vectorize...");

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/vectorize/v2/indexes/${VECTOR_INDEX}/query`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Vectorize query failed:", res.status, res.statusText, text);
    throw new Error("Vectorize query failed");
  }

  const json = await res.json();

  console.log("\nQuery result raw JSON:\n");
  console.log(JSON.stringify(json, null, 2));

  if (json.result && json.result.matches && json.result.matches.length > 0) {
    console.log("\nTop matches:");
    json.result.matches.forEach((m, idx) => {
      console.log(
        `#${idx + 1}: id=${m.id}, score=${m.score}, metadata=${JSON.stringify(
          m.metadata
        )}`
      );
    });
  } else {
    console.log("\nNo matches returned from Vectorize.");
  }

  console.log("\nCMG retrieval test complete.");
}

testRetrieval().catch((err) => {
  console.error("Retrieval test failed:", err);
  process.exit(1);
});
