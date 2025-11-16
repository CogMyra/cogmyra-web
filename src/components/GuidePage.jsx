// src/components/GuidePage.jsx

export default function GuidePage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:gap-10 lg:px-8 lg:py-10">
      {/* Left column – session setup / context */}
      <aside className="w-full max-w-xl rounded-3xl border border-slate-800/70 bg-slate-950/70 p-5 shadow-[0_0_80px_-40px_rgba(15,23,42,1)] lg:w-80 lg:flex-none">
        <h1 className="text-lg font-semibold tracking-tight text-slate-50">
          Your CogMyra Guide
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          Set your focus, tell CogMyra how you learn best, and then work
          through concepts step by step—with explanations, practice, and
          feedback that adapts to you.
        </p>

        {/* Focus presets */}
        <div className="mt-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            QUICK START
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <button className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-100 hover:border-sky-500 hover:text-sky-100">
              Prepare for an exam
            </button>
            <button className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-100 hover:border-sky-500 hover:text-sky-100">
              Learn a new concept
            </button>
            <button className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-100 hover:border-sky-500 hover:text-sky-100">
              Build a skill routine
            </button>
          </div>
        </div>

        {/* Learning profile */}
        <div className="mt-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            HOW I LEARN BEST
          </h2>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
            <li>• I prefer concrete examples before theory.</li>
            <li>• I learn well when I explain ideas back in my own words.</li>
            <li>• Break things into small steps and check my understanding.</li>
          </ul>
          <p className="mt-3 text-xs text-slate-400">
            You’ll eventually be able to save and edit this profile so each
            session starts exactly where you need it.
          </p>
        </div>
      </aside>

      {/* Right column – chat interface */}
      <section className="flex min-h-[420px] flex-1 flex-col rounded-3xl border border-slate-800/80 bg-slate-950/80 p-5 shadow-[0_0_120px_-40px_rgba(15,23,42,1)]">
        {/* Session header */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-slate-50">
              Current session
            </h2>
            <p className="text-xs text-slate-400">
              Example flow only — we’ll wire this to the live API next.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-slate-200">
              Guide is ready
            </span>
          </div>
        </div>

        {/* Chat transcript */}
        <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4">
          {/* User message */}
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-2xl bg-sky-600 px-4 py-3 text-sm text-slate-50 shadow">
              I’m struggling with understanding derivatives in calculus. Can you
              walk me through what they really mean?
            </div>
          </div>

          {/* CogMyra message 1 */}
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl border border-[#26413C] bg-[#26413C] px-4 py-3 text-sm leading-relaxed text-slate-50 shadow">
              Great question. Think of a derivative as a{" "}
              <span className="font-semibold">
                “speedometer for change.”
              </span>{" "}
              It tells you how fast something is changing at a particular
              moment—like how your car’s speedometer tells you how fast you’re
              moving right now.
              <p className="mt-2">
                If a function describes position over time, the derivative
                describes the instantaneous velocity. If a function describes
                the amount of something, the derivative describes how quickly
                that amount is increasing or decreasing.
              </p>
              <p className="mt-2">
                Does that “speed for change” idea click, or should we ground it
                in a concrete graph or story problem first?
              </p>
            </div>
          </div>

          {/* User follow-up */}
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-2xl bg-sky-600 px-4 py-3 text-sm text-slate-50 shadow">
              A concrete graph would help a lot.
            </div>
          </div>

          {/* CogMyra message 2 */}
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl border border-[#26413C] bg-[#26413C] px-4 py-3 text-sm leading-relaxed text-slate-50 shadow">
              Perfect. Imagine a smooth hill on a graph—your height on the hill
              is the function, and the steepness at each point is the
              derivative.
              <p className="mt-2">
                Where the hill is flat, the derivative is zero. Where the hill
                is steep and going up, the derivative is positive. Where it’s
                steep and going down, the derivative is negative.
              </p>
              <p className="mt-2">
                Would you like to try sketching a simple hill and labeling where
                the derivative is positive, negative, and zero? I can check your
                reasoning step by step.
              </p>
            </div>
          </div>
        </div>

        {/* Input area */}
        <div className="mt-4 flex items-end gap-3">
          <div className="flex-1">
            <label
              htmlFor="guide-input"
              className="sr-only"
            >
              Ask CogMyra
            </label>
            <textarea
              id="guide-input"
              rows={2}
              className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500"
              placeholder="Describe what you’re working on, how you learn best, or paste a problem you want to unpack together..."
            />
            <p className="mt-1 text-[0.7rem] text-slate-500">
              This is a static preview. In the live version, your messages will
              be routed through the CogMyra Guide engine and saved to your
              learning history.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-full bg-slate-600 px-4 text-sm font-semibold text-slate-50 opacity-60"
            disabled
          >
            Send
          </button>
        </div>
      </section>
    </div>
  );
}
