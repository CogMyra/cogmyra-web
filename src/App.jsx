// src/App.jsx
import React from "react";
import "./index.css";

export default function App() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#03120E] text-slate-100 flex flex-col">
      {/* Top bar */}
      <header className="border-b border-slate-800/60 bg-[#3E505B] text-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="text-2xl font-semibold tracking-[0.16em] text-[#8AB0AB]">
            CogMyra_
          </div>

          {/* Right CTA */}
          <a
            href="#guide"
            className="inline-flex items-center rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-200 transition"
          >
            Try the Guide
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#03120E] via-[#031B17] to-[#020B09]">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:py-16 lg:px-8">
            {/* Left column */}
            <div className="flex-1 space-y-6">
              <div className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Learning, faster
              </div>

              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                Your Personalized
                <br />
                <span className="text-emerald-300">AI Learning Coach</span>
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-slate-300">
                Whether you’re a student building confidence, a teacher
                amplifying your classroom, or a professional leveling up—CogMyra
                understands how you learn and delivers clear explanations,
                targeted practice, and adaptive feedback designed for real
                learning.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#guide"
                  className="inline-flex items-center rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/30 hover:bg-emerald-300 transition"
                >
                  Try the Guide
                </a>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-200 hover:text-emerald-300 transition"
                >
                  How it works
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>

            {/* Right column – preview card */}
            <div className="flex-1">
              <div className="mx-auto max-w-xl rounded-3xl bg-gradient-to-b from-slate-900/80 to-slate-950/95 p-6 shadow-2xl shadow-emerald-500/20 ring-1 ring-slate-700/80">
                <div className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  <span>Preview</span>
                  <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[0.6rem]">
                    Student
                  </span>
                </div>

                {/* Chat bubble – user */}
                <div className="mb-4 rounded-2xl border border-slate-700/80 bg-slate-900/80 px-4 py-3 text-sm">
                  <div className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    You
                  </div>
                  <p className="text-slate-100">
                    Can you explain photosynthesis?
                  </p>
                </div>

                {/* Chat bubble – CogMyra */}
                <div className="rounded-2xl border border-emerald-700/60 bg-emerald-950/60 px-4 py-3 text-sm">
                  <div className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    CogMyra
                  </div>
                  <p className="text-emerald-50">
                    Think of leaves as tiny solar panels. They use sunlight,
                    water, and carbon dioxide to make sugar for the plant and
                    release oxygen for us to breathe. What part of that process
                    would you like to zoom in on?
                  </p>
                </div>

                {/* Little dots */}
                <div className="mt-5 flex justify-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* “How CogMyra helps you learn” */}
        <section className="bg-[#E1E9E4] text-slate-900" id="guide">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8 space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">
                How CogMyra helps you learn
              </h2>
              <p className="max-w-3xl text-sm text-slate-700">
                One simple interface, three powerful pillars of support—for
                students, teachers, and professionals. CogMyra is a world-class
                collection of educators, not a search engine.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Students */}
              <div className="rounded-3xl bg-white px-6 py-6 shadow-sm shadow-slate-300/70">
                <div className="mb-3 text-xs font-semibold tracking-[0.22em] text-slate-500">
                  FOR STUDENTS
                </div>
                <p className="text-sm text-slate-800">
                  Build confidence, close gaps, and prepare for exams with a
                  coach that remembers what you&apos;ve already mastered and
                  adapts to your pace.
                </p>
              </div>

              {/* Teachers */}
              <div className="rounded-3xl bg-white px-6 py-6 shadow-sm shadow-slate-300/70">
                <div className="mb-3 text-xs font-semibold tracking-[0.22em] text-slate-500">
                  FOR TEACHERS
                </div>
                <p className="text-sm text-slate-800">
                  Design lessons, scaffolds, and checks for understanding in
                  minutes—without losing your identity or expertise as an
                  educator.
                </p>
              </div>

              {/* Professionals */}
              <div className="rounded-3xl bg-white px-6 py-6 shadow-sm shadow-slate-300/70">
                <div className="mb-3 text-xs font-semibold tracking-[0.22em] text-slate-500">
                  FOR PROFESSIONALS
                </div>
                <p className="text-sm text-slate-800">
                  Learn new tools, frameworks, and skills through examples,
                  role-plays, and practice that matches the real work you do.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#020B09] py-4 text-xs text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div>© {year} CogMyra. All rights reserved.</div>
          <nav className="flex gap-4">
            <a href="#guide" className="hover:text-emerald-300">
              Guide
            </a>
            <a
              href="mailto:hello@cogmyra.com"
              className="hover:text-emerald-300"
            >
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
