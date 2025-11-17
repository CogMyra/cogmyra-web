// src/pages/Home.jsx

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-[#03120E] text-slate-50">

      {/* Top Nav */}
      <header className="border-b border-white/5 bg-[#26413C]/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

          {/* Logo — corrected */}
          <div className="text-3xl font-semibold tracking-normal normal-case text-slate-50">
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
            <span className="text-slate-200">Your Personalized</span>
            <br />
            <span className="text-[#8AB0AB]">AI Learning Coach</span>
          </h1>

          <p className="mt-6 text-slate-300 text-lg max-w-xl">
            Whether you’re a student building confidence, a teacher amplifying your
            classroom, or a professional leveling up—CogMyra understands how you learn
            and delivers clear explanations, targeted practice, and adaptive feedback
            designed for real learning.
          </p>

          {/* Buttons */}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a
              href="/guide"
              className="inline-flex items-center rounded-full bg-[#8AB0AB] px-6 py-2.5 text-[#0A0F14] font-medium shadow-xl transition hover:opacity-90"
            >
              Try the Guide
            </a>

            <a
              href="#about"
              className="text-slate-200 font-medium hover:underline"
            >
              About CogMyra →
            </a>
          </div>
        </div>

        {/* Chat Preview Box */}
        <div className="flex-1 w-full">
          <div className="rounded-3xl bg-[#0A0F14]/40 border border-white/10 p-6 shadow-xl backdrop-blur-md">
            <div className="flex justify-between text-xs tracking-widest text-slate-400 pb-3">
              <span>PREVIEW</span>
              <span>STUDENT</span>
            </div>

            <div className="rounded-xl border border-white/10 p-4 mb-4">
              <p className="text-slate-400 text-xs mb-1">YOU</p>
              <p className="text-slate-200">Can you explain photosynthesis?</p>
            </div>

            <div className="rounded-xl bg-[#26413C] p-4">
              <p className="text-[#8AB0AB] text-xs tracking-widest mb-1">COGMYRA</p>
              <p className="text-slate-200">
                Think of leaves as tiny solar panels. They use sunlight, water, and carbon
                dioxide to make sugar for the plant and release oxygen for us to breathe.
                What part of that process would you like to zoom in on?
              </p>
            </div>

            <div className="flex justify-center gap-2 mt-4">
              <div className="w-2 h-2 rounded-full bg-slate-500"></div>
              <div className="w-2 h-2 rounded-full bg-slate-700"></div>
              <div className="w-2 h-2 rounded-full bg-slate-700"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Helps Section */}
      <section id="about" className="bg-slate-100 text-[#0A0F14] py-20 px-6">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-3xl font-bold mb-4">How CogMyra helps you learn</h2>

          <p className="text-lg text-slate-700 max-w-3xl mb-12">
            One simple interface, three powerful pillars of support—for students, teachers,
            and professionals. CogMyra is a collection of world-class educators, not a search engine.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            <div className="pillar-card p-6 rounded-2xl bg-white/80 shadow-xl">
              <h3 className="font-bold mb-2">FOR STUDENTS</h3>
              <p className="text-slate-700">
                Build confidence, close gaps, and prepare for exams with a coach that
                remembers what you’ve already mastered and adapts to your pace.
              </p>
            </div>

            <div className="pillar-card p-6 rounded-2xl bg-white/80 shadow-xl">
              <h3 className="font-bold mb-2">FOR TEACHERS</h3>
              <p className="text-slate-700">
                Design lessons, scaffolds, and checks for understanding in minutes—
                without losing your identity or expertise as an educator.
              </p>
            </div>

            <div className="pillar-card p-6 rounded-2xl bg-white/80 shadow-xl">
              <h3 className="font-bold mb-2">FOR PROFESSIONALS</h3>
              <p className="text-slate-700">
                Learn new tools, frameworks, and skills through examples, role-plays,
                and practice that matches the real work you do.
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
            <a href="/guide" className="hover:text-slate-200">Guide</a>
            <a href="/privacy" className="hover:text-slate-200">Privacy</a>
            <a href="/contact" className="hover:text-slate-200">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
