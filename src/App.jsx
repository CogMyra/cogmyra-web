import Hero from "./components/Hero";

function App() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#03120E] text-slate-100">
      <div className="relative isolate bg-gradient-to-b from-[#8AB0AB] via-[#03120E] to-[#8AB0AB]">
        {/* Top nav */}
        <header className="border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            
            {/* UPDATED LOGO — ONLY CHANGE */}
            <span className="text-3xl font-semibold tracking-tight text-[#8AB0AB] leading-none">
              CogMyra_
            </span>

            {/* Try the Guide button */}
            <a
              href="/guide"
              className="inline-flex items-center rounded-full bg-[#3E505B] px-4 py-1.5 text-sm font-medium text-slate-50 shadow-sm transition hover:bg-[#26413C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 visited:text-slate-50"
            >
              Try the Guide
            </a>
          </div>
        </header>

        <main>
          {/* Hero section */}
          <Hero />

          {/* How CogMyra helps */}
          <section
            id="how-it-works"
            className="border-t border-slate-800/60 bg-[#E8EFED]"
          >
            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                How CogMyra helps you learn
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-700">
                One simple interface, three powerful pillars of support—for students, teachers, and professionals.
                CogMyra is a world class collection of educators, not a search engine.
              </p>

              {/* Bottom feature columns */}
              <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                
                <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold tracking-wide text-[#26413C] uppercase">
                    For Students
                  </h3>
                  <p className="mt-3 text-slate-700 text-sm leading-relaxed">
                    Build confidence, close gaps, and prepare for exams with a coach 
                    that remembers what you’ve already mastered and adapts to your pace.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold tracking-wide text-[#26413C] uppercase">
                    For Teachers
                  </h3>
                  <p className="mt-3 text-slate-700 text-sm leading-relaxed">
                    Design lessons, scaffolds, and checks for understanding in minutes—
                    without losing your identity or expertise as an educator.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold tracking-wide text-[#26413C] uppercase">
                    For Professionals
                  </h3>
                  <p className="mt-3 text-slate-700 text-sm leading-relaxed">
                    Learn new tools, frameworks, and skills through examples, role-plays, 
                    and practice that matches the real work you do.
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-slate-800/60 bg-[#03120E]">
            <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 px-4 py-6 text-sm text-slate-300 sm:flex-row sm:items-center sm:px-6 lg:px-8">
              <p>© {year} CogMyra. All rights reserved.</p>
              <div className="flex gap-4">
                <a href="/guide" className="hover:text-white">Guide</a>
                <a href="/privacy.html" className="hover:text-white">Privacy</a>
                <a href="mailto:info@cogmyra.com" className="hover:text-white">Contact</a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
