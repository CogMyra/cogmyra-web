export default function Home() {
  return (
    <div className="hero-bg min-h-screen w-full">
      {/* ---------- HERO SECTION ---------- */}
      <section className="max-w-5xl mx-auto px-6 pt-28 pb-32">
        <h1 className="text-5xl md:text-6xl font-semibold leading-tight text-white">
          Your Personalized{" "}
          <span className="text-[#8AB0AB]">AI Learning Coach</span>
        </h1>

        <p className="mt-6 text-lg text-slate-300 max-w-2xl">
          CogMyra is a collection of world-class educators — not a search engine.
          Every interaction is tailored, human-centered learning designed for
          students, educators, and professionals.
        </p>

        {/* ---------- FIRST BUTTON (solid color, no gradient) ---------- */}
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <a
            href="/guide"
            className="inline-flex items-center rounded-full bg-[#8AB0AB] px-6 py-2.5 text-[#0A0F14] font-medium shadow-xl transition hover:opacity-90"
          >
            Try the Guide
          </a>
        </div>
      </section>

      {/* ---------- THREE PILLARS / AUDIENCE SECTION ---------- */}
      <section className="bg-white/7 backdrop-blur-sm py-24">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="pillar-card">
            <h3 className="text-xl font-semibold text-white">For Students</h3>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">
              Clear explanations, guided steps, and flexible support across
              subjects and grade levels.
            </p>
          </div>

          <div className="pillar-card">
            <h3 className="text-xl font-semibold text-white">For Educators</h3>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">
              A professional-grade assistant that supports lesson planning,
              feedback systems, content scaffolding, and learner-specific
              accommodations.
            </p>
          </div>

          <div className="pillar-card">
            <h3 className="text-xl font-semibold text-white">For Professionals</h3>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">
              High-clarity coaching for writing, analysis, communication, and
              workplace skills.
            </p>
          </div>
        </div>

        {/* ---------- SECOND BUTTON (solid color, no gradient) ---------- */}
        <div className="text-center mt-16">
          <a
            href="/guide"
            className="inline-flex items-center rounded-full bg-[#8AB0AB] px-8 py-3 text-[#0A0F14] font-medium shadow-xl transition hover:opacity-90"
          >
            Try the Guide
          </a>
        </div>
      </section>
    </div>
  );
}
