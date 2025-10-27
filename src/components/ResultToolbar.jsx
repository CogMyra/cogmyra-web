// src/components/ResultToolbar.jsx
import React from "react";

/**
 * ResultToolbar
 *
 * Props:
 *  - getShareURL: () => string
 *  - getContent:  () => ({ text: string, filenameBase?: string })
 *
 * Notes:
 *  - Wrapped in .print-hidden (hide on PDF/print).
 *  - Uses your global .btn, .btn-primary, .btn-secondary styles.
 */
export default function ResultToolbar({ getShareURL = () => window.location.href, getContent }) {
  async function copyLink() {
    const url = getShareURL();
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard.");
    } catch {
      prompt("Copy this link:", url);
    }
  }

  async function copyAll() {
    if (!getContent) return;
    const { text = "" } = getContent() || {};
    try {
      await navigator.clipboard.writeText(text);
      alert("Result copied to clipboard.");
    } catch {
      // Fallback prompt if clipboard blocked
      prompt("Copy the result:", text);
    }
  }

  function download(type) {
    if (!getContent) return;
    const { text = "", filenameBase } = getContent() || {};
    const base = (filenameBase || "cogmyra-output").replace(/[^\w\-]+/g, "").slice(0, 60);
    const stamp = new Date().toISOString().slice(0, 10);
    const filename =
      type === "md" ? `${base || "output"}_${stamp}.md`
                    : `${base || "output"}_${stamp}.txt`;

    const mime = type === "md" ? "text/markdown" : "text/plain";
    const blob = new Blob([text], { type: `${mime};charset=utf-8` });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  }

  function triggerPrint() {
    setTimeout(() => window.print(), 50);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 print-hidden">
      <button type="button"
              onClick={copyLink}
              className="btn btn-secondary"
              aria-label="Copy shareable link">
        Copy link
      </button>

      <button type="button"
              onClick={copyAll}
              className="btn btn-secondary"
              aria-label="Copy full result text">
        Copy result
      </button>

      <button type="button"
              onClick={() => download("md")}
              className="btn btn-ghost"
              aria-label="Download as Markdown">
        Download .md
      </button>

      <button type="button"
              onClick={() => download("txt")}
              className="btn btn-ghost"
              aria-label="Download as plain text">
        Download .txt
      </button>

      <button type="button"
              onClick={triggerPrint}
              className="btn btn-primary"
              aria-label="Print or save as PDF">
        Print / Save PDF
      </button>
    </div>
  );
}
