import { Link } from "react-router-dom";

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex flex-col">
      <header className="border-b border-white/10 bg-[#020617]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="text-lg sm:text-xl tracking-[0.35em] font-semibold text-slate-50"
          >
            COGMYRA_
          </Link>
          <Link
            to="/"
            className="text-xs font-medium text-slate-200 hover:text-slate-50"
          >
            ← Back to homepage
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-6 py-16">
          <h1 className="text-3xl md:text-4xl font-semibold">
            CogMyra Guide (alpha)
          </h1>
          <p className="text-slate-200/85 max-w-2xl">
            This will be the interactive interface for your full CogMyra Guide
            model—the same configuration you’ve been designing. For now, it’s a
            placeholder so routing works while we wire it to the model.
          </p>
          <p className="text-sm text-slate-400">
            When you’re ready, we’ll connect this page to your CogMyra Guide GPT
            and begin designing the learner, educator, and professional
            workflows.
          </p>
        </div>
      </main>
    </div>
  );
}
