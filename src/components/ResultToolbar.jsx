// src/components/ResultToolbar.jsx
import React from "react";

export default function ResultToolbar({ getShareURL = () => window.location.href }) {
  async function copyLink() {
    const url = getShareURL();
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard.");
    } catch {
      prompt("Copy this link:", url);
    }
  }

  function triggerPrint() {
    setTimeout(() => window.print(), 50);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 print-hidden">
      <button type="button" onClick={copyLink} className="btn-secondary" aria-label="Copy shareable link">
        Copy link
      </button>
      <button type="button" onClick={triggerPrint} className="btn-primary" aria-label="Print or save as PDF">
        Print / Save PDF
      </button>
    </div>
  );
}
