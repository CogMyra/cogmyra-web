// src/pages/Home.jsx
import { useState } from "react";

export default function Home() {
  const year = new Date().getFullYear();

  const slides = [
    {
      audienceLabel: "KIDS",
      question: "Why do we need fractions?",
      answer:
        "Think of fractions like sharing something fairly. If you and a friend split a pizza, each slice is a fraction of the whole. Fractions help with reading recipes, measuring things, and even understanding time. Want to try a quick example together?",
    },
    {
      audienceLabel: "COLLEGE STUDENTS",
      question: "Can you help me understand what a thesis statement actually does?",
      answer:
        "A thesis statement makes a clear claim about your topic and shows the reader where your argument is headed. Think of it as the backbone of your paper: everything you write should support or develop that central idea. Want me to help you draft one from your prompt?",
    },
    {
      audienceLabel: "PROFESSIONALS",
      question: "How can I give better feedback to my team?",
      answer:
        "Effective feedback connects three things: a clear observation, the impact it had, and a concrete next step. People respond best when feedback is specific, actionable, and tied to shared goals—not personality. Would you like to walk through a real scenario?",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const activeSlide = slides[currentSlide];

  return (
    <div className="min-h-screen flex flex-col bg-[#03120E] text-slate-50">
      {/* Top Nav */}
      <header className="border-b border-white/5 bg-[#26413C]/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo — no extra spacing */}
          <div
            className="
              text-3xl
              font-semibold
              tracking-normal
              text-slate-50
              normal-case
              !normal-case
              !capitalize
              !lowercase
            "
            style={{ textTransform: "none" }}
          >
            CogMyra_
          </div>

          {/* Top Right Button */}
          <a
            href="/guide"
            className="rounded-full bg-[#8AB0AB] px-5 py-2 text-sm font-semibold text-[#0A0F14] shadow-lg transition hover:opacity-90"
          >
            Try the Guide
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row max-w-6xl mx-auto items-center gap-12 px-6 py-24">
        {/* Left Text Section */}
        <div className="flex-1">
          <span className="text-xs tracking-widest font-semibold bg-[#26413C] px-4 py-1 rounded-full">
            LEARNING, FASTER
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl font-bold leading-tight">
            <span className="text-slate-200">your personalized</span>
            <br />
            <span className="text-[#8AB0AB]">learning coach</span>
          </h1>

          <p className="mt-6 text-slate-300 text-lg max-w-xl">
            From kids to college students to seasoned professionals, CogMyra adapts to how
            you learn. Powered by the collective insight of teachers, psychologists, and
            learning experts, it delivers clear explanations, targeted practice, and adaptive
            feedback shaped by the way great educators teach, support, and guide growth.
          </p>
        </div>

        {/* Chat Preview Box */}
        <div className="flex-1 w-full">
          <div className="rounded-3xl bg-[#0A0F14]/40 border border-white/10 p-6 shadow-xl backdrop-blur-md">
            <div className="flex justify-between text-xs tracking-widest text-slate-400 pb-3">
              <span>PREVIEW</span>
              <span>{activeSlide.audienceLabel}</span>
            </div>

            {/* User Question */}
            <div className="rounded-xl border border-white/10 p-4 mb-4">
              <p className="text-slate-400 text-xs mb-1">YOU</p>
              <p className="text-slate-200">{activeSlide.question}</p>
            </div>

            {/* CogMyra Answer */}
            <div className="rounded-xl bg-[#26413C] p-4">
              <p className="text-[#8AB0AB] text-xs tracking-widest mb-1">COGMYRA_</p>
              <p className="text-slate-200">{activeSlide.answer}</p>
            </div>

            {/* Carousel Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full transition ${
                    idx === currentSlide ? "bg-slate-200" : "bg-slate-600"
                  }`}
                  aria-label={`Show ${slides[idx].audienceLabel.toLowerCase()} preview`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Helps Section */}
      <section id="about" className="bg-slate-100 text-[#0A0F14] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">How CogMyra helps you learn</h2>

          <p className="text-lg text-slate-700 max-w-3xl mb-12">
            CogMyra draws on the experience, expertise, and wisdom of teachers, professors,
            learning scientists, and academic leaders to deliver genuine understanding, not
            just answers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Kids */}
            <div className="pillar-card p-6 rounded-2xl bg-white/80 shadow-xl">
              <h3 className="font-bold mb-2">FOR KIDS</h3>
              <p className="text-slate-700">
                Get help that makes school easier. CogMyra explains things in a way that
                actually makes sense, gives you practice you can handle, and remembers what
                you’ve already learned so you can keep getting better.
              </p>
            </div>

            {/* College Students */}
            <div className="pillar-card p-6 rounded-2xl bg-white/80 shadow-xl">
              <h3 className="font-bold mb-2">FOR COLLEGE STUDENTS</h3>
              <p className="text-slate-700">
                From breaking down complex concepts to organizing your study flow, CogMyra
                helps you keep up, catch up, or get ahead—while giving you feedback that
                actually improves your work.
              </p>
            </div>

            {/* Professionals */}
            <div className="pillar-card p-6 rounded-2xl bg-white/80 shadow-xl">
              <h3 className="font-bold mb-2">FOR PROFESSIONALS</h3>
              <p className="text-slate-700">
                Learn new tools, frameworks, and skills through examples, role-plays, and
                practice that matches the real work you do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-white/10 text-slate-400 text-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>© {year} CogMyra. All rights reserved.</div>
          <div className="flex gap-6">
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
