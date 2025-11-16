import { useEffect, useState } from "react";

const slides = [
  {
    id: "student",
    label: "STUDENT",
    user: "Can you explain photosynthesis?",
    coach:
      "Think of leaves as tiny solar panels. They use sunlight, water, and carbon dioxide to make sugar for the plant and release oxygen for us to breathe. What part of that process would you like to zoom in on?",
  },
  {
    id: "teacher",
    label: "TEACHER",
    user: "Help me design a 45-minute lesson on the Harlem Renaissance.",
    coach:
      "Let’s structure it in three parts: a quick warm-up, a short reading or clip, then a creative activity where students respond with their own poem, monologue, or scene. Which part would you like help drafting first?",
  },
  {
    id: "professional",
    label: "PROFESSIONAL",
    user: "Explain LLMs and embeddings in plain English for my team.",
    coach:
      "Imagine a huge library where every idea is stored as a point in space. Embeddings are the coordinates. Large language models learn to navigate that space to find and generate the text you need. Where do you want to apply this in your work this week?",
  },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const activeSlide = slides[activeIndex];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#03120E] via-[#03120E] to-black">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:pb-24 lg:pt-16">
        
        {/* LEFT SIDE */}
        <div className="flex-1">
          <div className="inline-flex rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-200">
            Learning, faster
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-100 sm:text-5xl lg:text-6xl">
            <span className="block">Your Personalized</span>
            <span className="block text-[#8AB0AB]">AI Learning Coach</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300">
            Whether you’re a student building confidence, a teacher amplifying
            your classroom, or a professional leveling up—CogMyra understands
            how you learn and delivers clear explanations, targeted practice,
            and adaptive feedback designed for real learning.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="/guide"
              className="inline-flex items-center rounded-full bg-[#3E505B] px-5 py-2 text-sm font-medium text-slate-50 shadow-sm transition hover:bg-[#26413C] visited:text-slate-50"
            >
              Try the Guide
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-200 hover:text-slate-50"
            >
              How it works →
            </a>
          </div>
        </div>

        {/* RIGHT SIDE – PREVIEW CARD */}
        <div className="flex-1">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-5 shadow-[0_0_120px_-40px_rgba(15,23,42,1)] sm:p-6">
            <div className="mb-4 flex items-center justify-between text-xs font-semibold tracking-wide text-slate-400">
              <span>PREVIEW</span>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-[0.65rem] text-slate-200">
                {activeSlide.label}
              </span>
            </div>

            {/* USER MESSAGE */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 sm:px-5 sm:py-4">
              <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
                YOU
              </div>
              <p className="mt-2 text-sm text-slate-100">{activeSlide.user}</p>
            </div>

            {/* COGMYRA MESSAGE */}
            <div className="mt-4 rounded-2xl border border-[#26413C] bg-[#26413C] px-4 py-3 sm:px-5 sm:py-4">
              <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-slate-200">
                COGMYRA
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-50">
                {activeSlide.coach}
              </p>
            </div>

            {/* DOTS */}
            <div className="mt-5 flex justify-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 w-2 rounded-full transition ${
                    index === activeIndex
                      ? "bg-sky-400"
                      : "bg-slate-600 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
