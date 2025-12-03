#!/usr/bin/env node

// run_eval_set.mjs
//
// Usage:
//   node scripts/run_eval_set.mjs cogmyra-evals/test_set_v1.md
//
// This script:
// 1. Reads the markdown test set file.
// 2. Extracts each prompt under "### **Prompt**".
// 3. Sends each prompt to the local CogMyra engine (/api/chat).
// 4. Inserts each reply into the corresponding
//    "A. Local Engine Response" section by replacing
//    "[paste your local engine response here]".
// 5. Writes the updated content to a new file with suffix "_with_local.md".

import fs from "node:fs/promises";
import path from "node:path";

const API_URL = "http://127.0.0.1:8788/api/chat";

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error("Usage: node scripts/run_eval_set.mjs <markdown-file>");
    process.exit(1);
  }

  const inputPath = path.resolve(process.cwd(), args[0]);

  console.log(`🔍 Reading test set from: ${inputPath}`);

  let content;
  try {
    content = await fs.readFile(inputPath, "utf8");
  } catch (err) {
    console.error(`❌ Failed to read file: ${err.message}`);
    process.exit(1);
  }

  // Regex to capture each prompt:
  // "### **Prompt**" followed by the prompt text,
  // ending before "### **A. Local Engine Response**"
  const promptRegex =
    /### \*\*Prompt\*\*\s*\n([\s\S]*?)\n\s*### \*\*A\. Local Engine Response\*\*/g;

  const prompts = [];
  let match;
  while ((match = promptRegex.exec(content)) !== null) {
    const rawPrompt = match[1].trim();
    prompts.push(rawPrompt);
  }

  if (prompts.length === 0) {
    console.error("❌ No prompts found in file. Check the markdown structure.");
    process.exit(1);
  }

  console.log(`✅ Found ${prompts.length} prompts in the test set.`);

  let updatedContent = content;
  let placeholder = "[paste your local engine response here]";

  for (let i = 0; i < prompts.length; i++) {
    const promptText = prompts[i];
    console.log(`\n🧪 Running prompt ${i + 1}/${prompts.length}:`);
    console.log(`   "${promptText.slice(0, 80)}${promptText.length > 80 ? "..." : ""}"`);

    let reply;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptText,
          debug: false,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      if (!data || typeof data.reply !== "string") {
        throw new Error("Unexpected response format (missing 'reply' field).");
      }

      reply = data.reply.trim();
    } catch (err) {
      console.error(`   ❌ Error calling local engine: ${err.message}`);
      reply = `<<ERROR calling local engine: ${err.message}>>`;
    }

    // Insert the reply into the next placeholder occurrence
    if (!updatedContent.includes(placeholder)) {
      console.error(
        "❌ Not enough '[paste your local engine response here]' placeholders in the file."
      );
      break;
    }

    // Replace only the first occurrence per prompt
    updatedContent = updatedContent.replace(
      placeholder,
      reply.replace(/\r\n/g, "\n")
    );

    console.log("   ✅ Inserted response into markdown.");
  }

  const ext = path.extname(inputPath);
  const base = inputPath.slice(0, -ext.length);
  const outputPath = `${base}_with_local${ext}`;

  try {
    await fs.writeFile(outputPath, updatedContent, "utf8");
    console.log(`\n🎉 A/B test set with local responses saved to:\n   ${outputPath}`);
  } catch (err) {
    console.error(`❌ Failed to write updated file: ${err.message}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`❌ Unexpected error: ${err.message}`);
  process.exit(1);
});
