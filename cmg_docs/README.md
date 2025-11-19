# CogMyra Guide – CMG_DOCS Knowledge Assets

This README documents the CogMyra Guide (CMG) configuration and framework files
that are stored in the Cloudflare Workers KV namespace **`CMG_DOCS`**.

These documents define CMG's tone, scaffolding, personas, instructional
frameworks, and prompt assets. They are loaded at runtime by the CogMyra engine
to reproduce the full GPT-based CogMyra Guide behavior.

---

## 1. KV Namespace

- **Namespace binding name (in code):** `CMG_DOCS`
- **Cloudflare product:** Workers KV
- **Purpose:** Private storage for CMG configuration & framework documents.

In the Worker / Pages Function code you can access this namespace via:

```js
const text = await env.CMG_DOCS.get("<KEY>", "text");
