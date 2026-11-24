import { useState } from 'react';
import { calculateBMR, calculateMacros } from '../utils/fitnessCalculator.js';

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary (Office job, little exercise)' },
  { value: 'light', label: 'Lightly Active (1–3 days/week)' },
  { value: 'moderate', label: 'Moderately Active (3–5 days/week)' },
  { value: 'active', label: 'Very Active (6–7 days/week)' },
  { value: 'very_active', label: 'Athlete / 2x Daily Training' },
];

const GOAL_OPTIONS = [
  { value: 'cut', label: 'Cut (-20% Deficit)', badge: 'Fat Loss' },
  { value: 'maintain', label: 'Maintain (100% TDEE)', badge: 'Recomp' },
  { value: 'bulk', label: 'Bulk (+15% Surplus)', badge: 'Hypertrophy' },
];

export default function MacroCalculator() {
  const [weight, setWeight] = useState('80');
  const [height, setHeight] = useState('180');
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState('moderate');
  const [goal, setGoal] = useState('bulk');

  const [error, setError] = useState(null);
  const [result, setResult] = useState(() => {
    const initialBmr = calculateBMR(80, 180, 25, 'male');
    return {
      bmr: initialBmr,
      ...calculateMacros(initialBmr, 'moderate', 'bulk'),
    };
  });

  const handleCalculate = (e) => {
    e.preventDefault();
    setError(null);

    try {
      const parsedWeight = weight.trim() === '' ? NaN : Number(weight);
      const parsedHeight = height.trim() === '' ? NaN : Number(height);
      const parsedAge = age.trim() === '' ? NaN : Number(age);

      const bmr = calculateBMR(parsedWeight, parsedHeight, parsedAge, gender);
      const macros = calculateMacros(bmr, activity, goal);

      setResult({ bmr, ...macros });
    } catch (err) {
      setError(err.message || 'Invalid input values provided.');
    }
  };

  return (
    <section
      aria-labelledby="macro-heading"
      className="rounded-2xl border border-[#27272a] bg-zinc-900/50 p-6 shadow-xl backdrop-blur-sm flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
              Mifflin-St Jeor Engine
            </span>
            <h2 id="macro-heading" className="mt-2 text-xl font-bold tracking-tight text-zinc-100">
              Calorie &amp; Macro Calculator
            </h2>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-sm font-bold">
            KCAL
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="bmr-weight" className="block text-xs font-medium text-zinc-400">
                Weight (kg)
              </label>
              <input
                id="bmr-weight"
                type="number"
                step="0.5"
                placeholder="30 - 300"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#27272a] bg-[#09090b] px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="bmr-height" className="block text-xs font-medium text-zinc-400">
                Height (cm)
              </label>
              <input
                id="bmr-height"
                type="number"
                step="1"
                placeholder="100 - 250"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#27272a] bg-[#09090b] px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="bmr-age" className="block text-xs font-medium text-zinc-400">
                Age (years)
              </label>
              <input
                id="bmr-age"
                type="number"
                step="1"
                placeholder="14 - 100"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#27272a] bg-[#09090b] px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="block text-xs font-medium text-zinc-400">Biological Sex</span>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {['male', 'female'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setGender(option)}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold capitalize transition-colors ${
                      gender === option
                        ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300'
                        : 'border-[#27272a] bg-[#09090b] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="bmr-activity" className="block text-xs font-medium text-zinc-400">
                Activity Level
              </label>
              <select
                id="bmr-activity"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#27272a] bg-[#09090b] px-3 py-2 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {ACTIVITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <span className="block text-xs font-medium text-zinc-400">Training Goal</span>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {GOAL_OPTIONS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setGoal(item.value)}
                  className={`rounded-xl border p-2.5 text-left transition-all ${
                    goal === item.value
                      ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300'
                      : 'border-[#27272a] bg-[#09090b] text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                    {item.badge}
                  </div>
                  <div className="mt-0.5 text-xs font-bold text-zinc-200">{item.label}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 active:scale-[0.99]"
          >
            Calculate Daily Macros
          </button>
        </form>
      </div>

      {result && (
        <div className="mt-6 space-y-3 border-t border-[#27272a] pt-5">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-[#27272a] bg-[#09090b] p-3">
              <span className="text-[11px] font-medium text-zinc-400">Basal (BMR)</span>
              <p className="mt-1 text-lg font-bold text-zinc-100">
                {result.bmr} <span className="text-xs font-normal text-zinc-500">kcal</span>
              </p>
            </div>
            <div className="rounded-xl border border-[#27272a] bg-[#09090b] p-3">
              <span className="text-[11px] font-medium text-zinc-400">Maintenance (TDEE)</span>
              <p className="mt-1 text-lg font-bold text-zinc-100">
                {result.tdee} <span className="text-xs font-normal text-zinc-500">kcal</span>
              </p>
            </div>
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3">
              <span className="text-[11px] font-medium text-emerald-300">Target Intake</span>
              <p className="mt-1 text-lg font-extrabold text-emerald-400">
                {result.calories} <span className="text-xs font-normal text-emerald-300/80">kcal</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-[#27272a] bg-[#09090b] p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400">Protein</span>
                <span className="text-[10px] text-zinc-500">4 kcal/g</span>
              </div>
              <p className="mt-1 text-2xl font-extrabold text-zinc-100">{result.protein}g</p>
            </div>

            <div className="rounded-xl border border-[#27272a] bg-[#09090b] p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-sky-400">Carbs</span>
                <span className="text-[10px] text-zinc-500">4 kcal/g</span>
              </div>
              <p className="mt-1 text-2xl font-extrabold text-zinc-100">{result.carbs}g</p>
            </div>

            <div className="rounded-xl border border-[#27272a] bg-[#09090b] p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-400">Fats</span>
                <span className="text-[10px] text-zinc-500">9 kcal/g</span>
              </div>
              <p className="mt-1 text-2xl font-extrabold text-zinc-100">{result.fats}g</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
