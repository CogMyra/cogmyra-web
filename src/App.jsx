import { useState } from "react";
import { Link } from "react-router-dom";

const previewSlides = [
  {
    label: "KIDS",
    question: "Why do we need fractions?",
    answer:
      "Think of fractions like sharing something fairly. If you and a friend split a pizza, each slice is a fraction of the whole. Fractions help with reading recipes, measuring things, and even understanding time. Want to try a quick example together?",
  },
  {
    label: "COLLEGE STUDENTS",
    question: "Can you help me understand what a thesis statement actually does?",
    answer:
      "A thesis statement makes a clear claim about your topic and shows the reader where your argument is headed. Think of it as the backbone of your paper: everything you write should support or develop that central idea. Want me to help you draft one from your prompt?",
  },
  {
    label: "PROFESSIONALS",
    question: "How can I give better feedback to my team?",
    answer:
      "Effective feedback connects three things: a clear observation, the impact it had, and a concrete next step. People respond best when feedback is specific, actionable, and tied to shared goals—not personality. Would you like to walk through a real scenario?",
  },
];

export default function App() {
  const year = new Date().getFullYear();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = previewSlides[currentSlide];

  return (
    <div className="min-h-screen flex flex-col bg-[#03120E] text-slate-50">
      {/* Top nav */}
      <header className="border-b border-white/5 bg-[#03120E]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo – no extra spacing */}
<div className="text-lg sm:text-xl font-semibold text-slate-50">
  CogMyra_
</div>
          <Link
            to="/guide"
            className="rounded-full bg-[#8AB0AB] px-5 py-2 text-sm font-medium text-[#03120E] shadow-lg hover:opacity-90 transition"
          >
            Try the Guide
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 bg-gradient-to-br from-[#26413C] via-[#03120E] to-black">
        <section className="hero-bg">
          <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12 lg:flex-row lg:items-center lg:py-20">
            {/* Left column: copy */}
            <div className="max-w-xl">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-medium tracking-wide text-slate-100 mb-6">
                LEARNING, FASTER
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight">
                <span className="block text-slate-50">Your Personalized</span>
                <span className="block text-[#8AB0AB]">Learning Coach</span>
              </h1>

              <p className="mt-6 text-base md:text-lg text-slate-200/85 max-w-xl">
                From kids to college students to seasoned professionals, CogMyra
                adapts to how you learn. Powered by the collective insight of
                teachers, psychologists, and learning experts, it delivers clear
                explanations, targeted practice, and adaptive feedback shaped by
                the way great educators teach, support, and guide growth.
              </p>

              {/* Hero CTAs removed per request – top-right button remains */}
            </div>

            {/* Right column: preview card */}
            <div className="flex-1">
              <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-[#020817] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.65)]">
                <div className="mb-3 flex items-center justify-between text-[11px] font-medium tracking-[0.2em] text-slate-300/70">
                  <span>PREVIEW</span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] tracking-[0.2em]">
                    {slide.label}
                  </span>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-slate-900 to-slate-950 px-4 py-3">
                    <div className="mb-1 text-[11px] font-medium tracking-[0.18em] text-slate-400">
                      YOU
                    </div>
                    <p className="text-slate-100">{slide.question}</p>
                  </div>

                  <div className="rounded-2xl border border-emerald-900/40 bg-[#26413C] px-4 py-3 text-sm leading-relaxed text-slate-50">
                    <div className="mb-1 text-[11px] font-medium tracking-[0.18em] text-slate-200/80">
                      COGMYRA
                    </div>
                    <p>{slide.answer}</p>
                  </div>
                </div>

                <div className="mt-5 flex justify-center gap-1">
                  {previewSlides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-1.5 w-1.5 rounded-full transition ${
                        idx === currentSlide
                          ? "bg-slate-200"
                          : "bg-slate-600/60 hover:bg-slate-400"
                      }`}
                      aria-label={`Show ${previewSlides[idx].label.toLowerCase()} preview`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom section */}
        <section
          id="about"
          className="bg-[#E2E7E5] text-slate-900 border-t border-slate-200"
        >
          <div className="mx-auto max-w-6xl px-6 py-14">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1A1D1A]">
              How CogMyra helps you learn
            </h2>
            <p className="mt-4 max-w-3xl text-sm md:text-base text-slate-700">
              CogMyra draws on the experience, expertise, and wisdom of
              teachers, professors, learning scientists, and academic leaders to
              deliver genuine understanding, not just answers.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {/* Kids */}
              <div className="pillar-card">
                <div className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  FOR KIDS
                </div>
                <p className="mt-3 text-sm text-slate-800 leading-relaxed">
                  Get help that makes school easier. CogMyra explains things in
                  a way that actually makes sense, gives you practice you can
                  handle, and remembers what you’ve already learned so you can
                  keep getting better.
                </p>
              </div>

              {/* College students */}
              <div className="pillar-card">
                <div className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  FOR COLLEGE STUDENTS
                </div>
                <p className="mt-3 text-sm text-slate-800 leading-relaxed">
                  From breaking down complex concepts to organizing your study
                  flow, CogMyra helps you keep up, catch up, or get ahead—while
                  giving you feedback that actually improves your work.
                </p>
              </div>

              {/* Professionals */}
              <div className="pillar-card">
                <div className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                  FOR PROFESSIONALS
                </div>
                <p className="mt-3 text-sm text-slate-800 leading-relaxed">
                  Learn new tools, frameworks, and skills through examples,
                  role-plays, and practice that match the real work you do.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/20 bg-[#02050A] py-4 text-xs text-slate-400">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <span>© {year} CogMyra. All rights reserved.</span>
          <div className="flex gap-4">
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
