import React from "react";

export default function Hero() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-[#03120E] text-slate-50">
      {/* Top hero section */}
      <section className="flex-1 bg-gradient-to-br from-[#03120E] via-[#03120E] to-[#26413C]">
        <div className="mx-auto max-w-6xl px-6 pt-8 pb-20">
          {/* Top nav */}
          <header className="flex items-center justify-between">
            <div className="text-lg tracking-[0.35em] font-semibold uppercase text-slate-100">
              CogMyra_
            </div>
            <a
              href="/guide"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-[#8AB0AB] to-[#3E505B] px-6 py-2 text-sm font-medium text-slate-900 shadow-[0_12px_45px_rgba(0,0,0,0.55)]"
            >
              Try the Guide
            </a>
          </header>

          {/* Hero body */}
          <div className="mt-16 grid gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center">
            {/* Left copy */}
            <div>
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs tracking-[0.2em] uppercase text-slate-200">
                Learning, Faster
              </div>

              <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
                <span className="block text-slate-50">Your Personalized</span>
                <span className="block text-[#8AB0AB]">AI Learning Coach</span>
              </h1>

              <p className="mt-6 max-w-xl text-sm md:text-base text-slate-200/85 leading-relaxed">
                Whether you’re a student building confidence, a teacher
                amplifying your classroom, or a professional leveling up—CogMyra
                understands how you learn and delivers clear explanations,
                targeted practice, and adaptive feedback designed for real
                learning.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a
                  href="/guide"
                  className="inline-flex items-center rounded-full bg-gradient-to-r from-[#8AB0AB] to-[#3E505B] px-6 py-2.5 text-sm font-medium text-slate-900 shadow-[0_18px_55px_rgba(0,0,0,0.7)]"
                >
                  Try the Guide
                </a>
                <button
                  type="button"
                  className="text-sm font-medium text-slate-100 hover:text-slate-50/80"
                >
                  How it works →
                </button>
              </div>
            </div>

            {/* Right preview card */}
            <div className="rounded-3xl bg-[#020817]/95 p-6 md:p-8 shadow-[0_40px_120px_rgba(0,0,0,0.85)] border border-white/5">
              <div className="flex items-center justify-between text-[11px] font-medium tracking-[0.25em] text-slate-400 uppercase">
                <span>Preview</span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] tracking-[0.25em] text-slate-200">
                  Student
                </span>
              </div>

              {/* Chat bubbles */}
              <div className="mt-6 space-y-4 text-sm">
                <div className="rounded-2xl bg-[#020817] border border-white/8 px-4 py-4">
                  <div className="text-[11px] tracking-[0.25em] uppercase text-slate-500 mb-1">
                    You
                  </div>
                  <p className="text-slate-100">
                    Can you explain photosynthesis?
                  </p>
                </div>

                <div className="rounded-2xl bg-[#26413C] border border-white/10 px-4 py-4">
                  <div className="text-[11px] tracking-[0.25em] uppercase text-slate-200/80 mb-1">
                    CogMyra
                  </div>
                  <p className="text-slate-50/95 text-[13px] leading-relaxed">
                    Think of leaves as tiny solar panels. They use sunlight,
                    water, and carbon dioxide to make sugar for the plant and
                    release oxygen for us to breathe. What part of that process
                    would you like to zoom in on?
                  </p>
                </div>
              </div>

              {/* Dots */}
              <div className="mt-6 flex justify-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500/70" />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500/70" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom info section */}
      <section className="bg-[#E4EBEE] text-slate-900 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
            How CogMyra helps you learn
          </h2>

          <p className="mt-4 max-w-3xl text-sm md:text-base text-slate-700 leading-relaxed">
            One simple interface, three powerful pillars of support—for
            students, teachers, and professionals. CogMyra is a world-class
            collection of educators, not a search engine.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {/* Students */}
            <div className="rounded-2xl bg-white px-6 py-6 shadow-[0_18px_60px_rgba(0,0,0,0.10)] border border-slate-100">
              <div className="text-[11px] tracking-[0.25em] uppercase text-slate-500">
                For Students
              </div>
              <p className="mt-3 text-sm text-slate-800 leading-relaxed">
                Build confidence, close gaps, and prepare for exams with a coach
                that remembers what you’ve already mastered and adapts to your
                pace.
              </p>
            </div>

            {/* Teachers */}
            <div className="rounded-2xl bg-white px-6 py-6 shadow-[0_18px_60px_rgba(0,0,0,0.10)] border border-slate-100">
              <div className="text-[11px] tracking-[0.25em] uppercase text-slate-500">
                For Teachers
              </div>
              <p className="mt-3 text-sm text-slate-800 leading-relaxed">
                Design lessons, scaffolds, and checks for understanding in
                minutes—without losing your identity or expertise as an
                educator.
              </p>
            </div>

            {/* Professionals */}
            <div className="rounded-2xl bg-white px-6 py-6 shadow-[0_18px_60px_rgba(0,0,0,0.10)] border border-slate-100">
              <div className="text-[11px] tracking-[0.25em] uppercase text-slate-500">
                For Professionals
              </div>
              <p className="mt-3 text-sm text-slate-800 leading-relaxed">
                Learn new tools, frameworks, and skills through examples,
                role-plays, and practice that matches the real work you do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#020712] py-4 text-[11px] text-slate-400">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <span>© {year} CogMyra. All rights reserved.</span>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="/guide" className="hover:text-slate-200">
              Guide
            </a>
            <a href="/privacy" className="hover:text-slate-200">
              Privacy
            </a>
            <a href="/contact" className="hover:text-slate-200">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
