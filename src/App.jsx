import MacroCalculator from './components/MacroCalculator.jsx';
import OneRepMaxCalculator from './components/OneRepMaxCalculator.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navigation / Header */}
      <header className="border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center text-zinc-950 font-black text-base shadow-md">
              LL
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-zinc-100">
                LiftLedger
              </h1>
              <p className="text-xs text-zinc-400">
                Gym Performance &amp; Nutritional Macro Analytics
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="rounded-full border border-[#27272a] bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-400">
              v1.0.0
            </span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              CI/CD Verified
            </span>
          </div>
        </div>
      </header>

      {/* Main Bento Grid Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Top Metrics Banner (Bento Header Card) */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#27272a] bg-zinc-900/40 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Metabolic Precision
            </span>
            <p className="mt-1 text-sm text-zinc-300">
              Mifflin-St Jeor BMR equation paired with activity-adjusted TDEE and goal splits.
            </p>
          </div>
          <div className="rounded-2xl border border-[#27272a] bg-zinc-900/40 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Strength Telemetry
            </span>
            <p className="mt-1 text-sm text-zinc-300">
              Epley 1RM estimation with automatic working set load breakdown (70%–95%).
            </p>
          </div>
          <div className="rounded-2xl border border-[#27272a] bg-zinc-900/40 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Strict Guardrails
            </span>
            <p className="mt-1 text-sm text-zinc-300">
              Real-time physiological boundary validation prevents invalid or unsafe inputs.
            </p>
          </div>
        </div>

        {/* Two Main Calculator Sections */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <MacroCalculator />
          <OneRepMaxCalculator />
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="mt-12 border-t border-[#27272a] py-6 text-center text-xs text-zinc-500">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>LiftLedger — Built with React 18, Vite, Tailwind CSS &amp; Vitest</span>
          <span>Pure ES6 Business Logic • Automated CI/CD Pipeline</span>
        </div>
      </footer>
    </div>
  );
}
