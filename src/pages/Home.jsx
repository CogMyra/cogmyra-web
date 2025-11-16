// src/pages/Home.jsx

import Hero from "../components/Hero";

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#03120E] text-slate-100">
      {/* Dark gradient background framing the hero */}
      <div className="relative isolate bg-gradient-to-b from-slate-950 via-[#03120E] to-[#8AB0AB]/10">
        {/* Main hero section (logo + headline + preview) */}
        <Hero />
      </div>

      {/* Light framing section – same vibe as the bottom of the landing page */}
      <section className="bg-[#E2ECE7] text-slate-900 border-t border-slate-200/70">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <header className="max-w-3xl mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              How CogMyra helps you learn
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-700">
              One simple interface, three powerful pillars of support—for
              students, teachers, and professionals. CogMyra is a world-class
              collection of educators, not a search engine.
            </p>
          </header>

          {/* Three-column feature cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Students */}
            <article className="rounded-3xl bg-white shadow-sm shadow-slate-300/40 border border-slate-200">
              <div className="h-1.5 rounded-t-3xl bg-gradient-to-r from-[#26413C] via-[#3E505B] to-[#8AB0AB]" />
              <div className="p-6 sm:p-7">
                <h3 className="text-xs font-semibold tracking-[0.2em] text-[#26413C] uppercase">
                  For students
                </h3>
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-700">
                  Build confidence, close gaps, and prepare for exams with a
                  coach that remembers what you&apos;ve already mastered and
                  adapts to your pace.
                </p>
              </div>
            </article>

            {/* Teachers */}
            <article className="rounded-3xl bg-white shadow-sm shadow-slate-300/40 border border-slate-200">
              <div className="h-1.5 rounded-t-3xl bg-gradient-to-r from-[#26413C] via-[#3E505B] to-[#8AB0AB]" />
              <div className="p-6 sm:p-7">
                <h3 className="text-xs font-semibold tracking-[0.2em] text-[#26413C] uppercase">
                  For teachers
                </h3>
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-700">
                  Design lessons, scaffolds, and checks for understanding in
                  minutes—without losing your identity or expertise as an
                  educator.
                </p>
              </div>
            </article>

            {/* Professionals */}
            <article className="rounded-3xl bg-white shadow-sm shadow-slate-300/40 border border-slate-200">
              <div className="h-1.5 rounded-t-3xl bg-gradient-to-r from-[#26413C] via-[#3E505B] to-[#8AB0AB]" />
              <div className="p-6 sm:p-7">
                <h3 className="text-xs font-semibold tracking-[0.2em] text-[#26413C] uppercase">
                  For professionals
                </h3>
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-700">
                  Learn new tools, frameworks, and skills through examples,
                  role-plays, and practice that matches the real work you do.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Footer – same colors as your landing page */}
      <footer className="bg-[#1A1D1A] text-slate-400 text-xs sm:text-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="tracking-tight">
            © {year} CogMyra. All rights reserved.
          </p>
          <nav className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a
              href="/guide"
              className="font-medium text-slate-100 hover:text-[#8AB0AB] transition"
            >
              Guide
            </a>
            <a
              href="/privacy.html"
              className="hover:text-slate-200 transition"
            >
              Privacy
            </a>
            <a
              href="mailto:hello@cogmyra.com"
              className="hover:text-slate-200 transition"
            >
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
