import { useState } from 'react';
import { calculateOneRepMax } from '../utils/fitnessCalculator.js';

const TRAINING_ZONES = [
  { pct: 0.95, label: '95%', reps: '2 reps', focus: 'Peak Strength' },
  { pct: 0.9, label: '90%', reps: '3–4 reps', focus: 'Heavy Strength' },
  { pct: 0.85, label: '85%', reps: '5–6 reps', focus: 'Strength / Power' },
  { pct: 0.8, label: '80%', reps: '7–8 reps', focus: 'Hypertrophy / Strength' },
  { pct: 0.75, label: '75%', reps: '10 reps', focus: 'Hypertrophy' },
  { pct: 0.7, label: '70%', reps: '12 reps', focus: 'Muscular Endurance' },
];

export default function OneRepMaxCalculator() {
  const [weight, setWeight] = useState('100');
  const [reps, setReps] = useState('8');
  const [error, setError] = useState(null);
  const [oneRepMax, setOneRepMax] = useState(() => calculateOneRepMax(100, 8));

  const handleCalculate = (e) => {
    e.preventDefault();
    setError(null);

    try {
      const parsedWeight = weight.trim() === '' ? NaN : Number(weight);
      const parsedReps = reps.trim() === '' ? NaN : Number(reps);

      const estimated = calculateOneRepMax(parsedWeight, parsedReps);
      setOneRepMax(estimated);
    } catch (err) {
      setError(err.message || 'Invalid lift parameters provided.');
    }
  };

  return (
    <section
      aria-labelledby="orm-heading"
      className="rounded-2xl border border-[#27272a] bg-zinc-900/50 p-6 shadow-xl backdrop-blur-sm flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs font-medium text-sky-400 border border-sky-500/20">
              Epley Formula Engine
            </span>
            <h2 id="orm-heading" className="mt-2 text-xl font-bold tracking-tight text-zinc-100">
              One-Rep Max (1RM) Calculator
            </h2>
          </div>
          <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-mono text-sm font-bold">
            1RM
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-500/40 bg-red-950/40 p-3.5 text-sm text-red-300 flex items-start gap-2.5"
          >
            <span className="font-bold text-red-400">!</span>
            <div>
              <p className="font-semibold text-red-200">Validation Error</p>
              <p className="mt-0.5 text-xs text-red-300/90">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleCalculate} className="mt-5 space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="orm-weight" className="block text-xs font-medium text-zinc-400">
                Lifted Weight (kg)
              </label>
              <input
                id="orm-weight"
                type="number"
                step="0.5"
                placeholder="0.5 - 600"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#27272a] bg-[#09090b] px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label htmlFor="orm-reps" className="block text-xs font-medium text-zinc-400">
                Repetitions Completed (1–30)
              </label>
              <input
                id="orm-reps"
                type="number"
                step="1"
                placeholder="1 - 30"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#27272a] bg-[#09090b] px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-bold text-zinc-950 shadow-lg shadow-sky-500/10 transition hover:bg-sky-400 active:scale-[0.99]"
          >
            Estimate One-Rep Max
          </button>
        </form>
      </div>

      {oneRepMax !== null && (
        <div className="mt-6 space-y-4 border-t border-[#27272a] pt-5">
          <div className="rounded-xl border border-sky-500/40 bg-sky-500/10 p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-300">
                Estimated 1RM Max Load
              </span>
              <p className="text-xs text-zinc-400 mt-0.5">
                Formula: Weight × (1 + Reps / 30)
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-sky-400">{oneRepMax}</span>
              <span className="ml-1 text-sm font-medium text-sky-300/80">kg</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2.5">
              Working Set Load Matrix
            </h3>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {TRAINING_ZONES.map((zone) => {
                const loadKg = Math.round(oneRepMax * zone.pct * 10) / 10;
                return (
                  <div
                    key={zone.label}
                    className="rounded-xl border border-[#27272a] bg-[#09090b] p-3 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-400">{zone.label}</span>
                      <span className="text-[10px] font-medium text-zinc-500">{zone.reps}</span>
                    </div>
                    <p className="mt-1 text-lg font-bold text-zinc-100">
                      {loadKg} <span className="text-xs font-normal text-zinc-500">kg</span>
                    </p>
                    <span className="mt-0.5 text-[10px] text-zinc-500 truncate">{zone.focus}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
