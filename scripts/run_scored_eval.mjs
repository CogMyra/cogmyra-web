#!/usr/bin/env node

import fs from "fs/promises";
import OpenAI from "openai";

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node run_scored_eval.mjs <input-file>");
  process.exit(1);
}

if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY is not set in the environment.");
  process.exit(1);
}

const MODEL = process.env.MODEL || "gpt-5.1";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ------------------------------
// Helper: extract prompts
// ------------------------------
function extractPromptSections(content) {
  const sections = [];
  const regex = /## Prompt (\d+)[\s\S]*?### \*\*Prompt\*\*\s*(.*?)\n\n### \*\*A\./g;

  let match;
  while ((match = regex.exec(content)) !== null) {
    const promptNumber = match[1];
    const promptText = match[2].trim();
    sections.push({ promptNumber, promptText });
  }

  return sections;
}

// ------------------------------
// Helper: create scoring block
// ------------------------------
function buildScoreBlock(promptNumber, scores) {
  return `
---

### **Summary of Drift for Prompt ${promptNumber}:**

**Tone Score:** ${scores.tone}
**Scaffolding Score:** ${scores.scaffolding}
**Alignment Score:** ${scores.alignment}
**Overall Effectiveness Score:** ${scores.overall}

**Evaluator Notes:**
${scores.notes.trim()}

`;
}

// ------------------------------
// Ask GPT to score a prompt pair
// ------------------------------
async function scorePrompt(promptText, localResponse, guideResponse) {
  const system = `
You are an expert evaluator of AI tutoring systems.  
Score the LOCAL answer versus the GUIDE answer using lens 1–10 in four categories:
Tone, Scaffolding, Alignment with CogMyra Guide, Overall Effectiveness.

Return JSON ONLY:
{
  "tone": <number>,
  "scaffolding": <number>,
  "alignment": <number>,
  "overall": <number>,
  "notes": "<evaluator notes>"
}
  `.trim();

  const user = `
Prompt:
${promptText}

LOCAL response:
${localResponse}

GUIDE response:
${guideResponse}

Evaluate LOCAL ONLY against GUIDE.  
Produce JSON ONLY.
`.trim();

  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ]
  });

  const raw = completion.choices[0].message.content;

  try {
    return JSON.parse(raw);
  } catch (err) {
    return {
      tone: 0,
      scaffolding: 0,
      alignment: 0,
      overall: 0,
      notes: `Failed to parse JSON: ${raw}`
    };
  }
}

// ------------------------------
// MAIN
// ------------------------------
(async () => {
  console.log(`Input file: ${inputPath}`);
  let content = await fs.readFile(inputPath, "utf8");

  const prompts = extractPromptSections(content);
  console.log(`Found ${prompts.length} prompts to score.`);

  for (const { promptNumber } of prompts) {
    console.log(`\nScoring prompt ${promptNumber}…`);

    // Extract local + guide responses
    const localRegex = new RegExp(
      `## Prompt ${promptNumber}[\\s\\S]*?### \\*\\*A\\. Local Engine Response\\*\\*[\\s\\S]*?### \\*\\*B\\. CogMyra Guide GPT Response\\*\\*[\\s\\S]*?(?=## Prompt|# End of Test Set)`
    );

    const blockMatch = content.match(localRegex);
    if (!blockMatch) {
      console.log(`Could not locate responses for prompt ${promptNumber}. Skipping.`);
      continue;
    }

    const block = blockMatch[0];

    const localMatch = block.match(/### \*\*A\. Local Engine Response\*\*([\s\S]*?)### \*\*B\./);
    const guideMatch = block.match(/### \*\*B\. CogMyra Guide GPT Response\*\*([\s\S]*?)$/);

    const localResponse = localMatch ? localMatch[1].trim() : "";
    const guideResponse = guideMatch ? guideMatch[1].trim() : "";

    const promptText = prompts.find(p => p.promptNumber === promptNumber).promptText;

    const score = await scorePrompt(promptText, localResponse, guideResponse);

    const scoreBlock = buildScoreBlock(promptNumber, score);

    // Insert score block immediately after this prompt section
    const insertPos = content.indexOf(block) + block.length;
    content =
      content.slice(0, insertPos) +
      scoreBlock +
      content.slice(insertPos);
  }

  const outputPath = inputPath.replace(".md", "_scored.md");
  await fs.writeFile(outputPath, content);

  console.log(`\nScored evaluation written to:\n${outputPath}\n`);
})();
