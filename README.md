# LiftLedger — Gym Performance & Macro Calculator

![CI Status](https://img.shields.io/badge/CI-GitHub_Actions-10b981?style=flat-square)
![Node Version](https://img.shields.io/badge/Node.js-20.x-38bdf8?style=flat-square)
![Testing](https://img.shields.io/badge/Tests-Vitest_10_Passing-10b981?style=flat-square)
![Deployment](https://img.shields.io/badge/Deploy-Vercel-fafafa?style=flat-square)

**LiftLedger** is a modern, high-contrast Dark Mode web application engineered for strength athletes and gym practitioners. It provides deterministic metabolic calculations (**Basal Metabolic Rate**, **Total Daily Energy Expenditure**, and **Goal-Specific Macronutrient Splits**) alongside an **Epley One-Rep Max (1RM)** strength estimator with automated working-set load matrices.

---

## Live Deployment

- **Production URL (Vercel):** `https://lift-ledger.vercel.app` *(Update with your team's live Vercel domain once deployed)*
- **Operational Deployment Guide:** See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for the complete 5-phase runbook (**Before, Deploy, Verify, Roll back, Record**).

---

## Architecture & Project Structure

LiftLedger follows a strict **separation of concerns** architecture to guarantee 100% unit testability and zero UI-coupled side effects:

1. **Pure Domain Layer (`src/utils/fitnessCalculator.js`):**
   - Pure ES6 functions with zero React or DOM dependencies.
   - Implements the **Mifflin-St Jeor equation** (`calculateBMR`), activity-adjusted **TDEE & Macronutrient splits** (`calculateMacros`), and the **Epley 1RM formula** (`calculateOneRepMax`).
   - Enforces strict input guardrails, throwing descriptive `Error` exceptions on negative values, zeros, out-of-range physiological parameters, or invalid types (`null`, `undefined`, `NaN`, strings).
2. **Presentation Layer (`src/App.jsx`, `src/components/`):**
   - Built with **React 18** and **Tailwind CSS** using a minimalist **Bento Grid Dark Mode** aesthetic (`#09090b` surface, `#27272a` borders, emerald and sky accents).
   - Wraps domain calls in `try / catch` blocks to surface user-friendly validation alerts without crashing the application.
3. **Automated Quality Gate (`tests/` & `.github/workflows/ci.yml`):**
   - **Vitest** unit test suite covering **Normal**, **Edge**, and **Invalid** cases.
   - **GitHub Actions CI Pipeline** running on Node 20 on every `push` and `pull_request` targeting `main`.

```text
lift-ledger/
├── .github/
│   └── workflows/
│       └── ci.yml                  # Automated CI pipeline (Node 20: npm ci, test, build)
├── docs/
│   └── DEPLOYMENT.md               # 5-Phase operational deployment & rollback runbook
├── src/
│   ├── components/
│   │   ├── MacroCalculator.jsx     # BMR, TDEE & Macronutrient Bento Grid module
│   │   └── OneRepMaxCalculator.jsx # Epley 1RM & Working Set Load Matrix module
│   ├── utils/
│   │   └── fitnessCalculator.js    # Pure mathematical engines & strict validations
│   ├── App.jsx                     # Main application layout
│   ├── index.css                   # Tailwind CSS directives & base dark theme
│   └── main.jsx                    # React DOM entry point
├── tests/
│   └── fitnessCalculator.test.js   # Vitest unit test suite (10 unit tests)
├── .env.example                    # Safe environment variables template (no secrets)
├── .gitignore                      # Git ignored files and folders
├── index.html                      # HTML entry point
├── package.json                    # Scripts and dependencies
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── vite.config.js                  # Vite build configuration
└── README.md                       # Project documentation
```

---

## Prerequisites

Before cloning and running this project locally, ensure your development machine has:

- **Node.js:** `v20.x` LTS (or `>= 20.0.0`)
- **npm:** `v10.x` (bundled with Node 20)
- **Git:** `v2.30+`

Verify your local versions:

```bash
node --version
npm --version
git --version
```

---

## Installation from a Clean Clone

Follow these steps to set up LiftLedger from scratch on any machine:

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/lift-ledger.git
cd lift-ledger

# 2. Create your local environment configuration from the safe template
cp .env.example .env

# 3. Install exact locked dependencies
npm ci
```

> **Security Note:** Never commit `.env` files or real credentials to the repository. Only `.env.example` with non-sensitive placeholders is tracked in Git.

---

## Running in Development & Production Build

### Start Local Development Server
Launches the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Create & Preview Production Build
Compiles and minifies the static bundle into the `dist/` directory:

```bash
npm run build
npm run preview
```

---

## Running Automated Unit Tests

The test suite is powered by **Vitest** and configured to run in non-interactive single-run mode (`vitest run`) for both local verification and CI environments:

```bash
# Standard single-run execution (used by CI)
npm test

# Explicit CI flag execution
npm test -- --run

# Interactive watch mode during local development
npm run test:watch
```

### Test Coverage Breakdown (`tests/fitnessCalculator.test.js`)
- **Normal Cases (4 tests):** Standard male/female BMR, bulking macros (+15% surplus), cutting macros (-20% deficit), and 8-rep Epley 1RM calculation.
- **Edge Cases (3 tests):** Single repetition (`reps === 1`) returning exact weight, minimum/maximum age boundaries (`14` and `100` years), and minimum weight boundaries (`30 kg` BMR / `0.5 kg` at `30 reps` 1RM).
- **Invalid Cases (3 tests):** Negative/zero weights, invalid repetition counts (`0`, negative, non-integer, `> 30`), and invalid data types (`null`, `undefined`, `NaN`, non-numeric strings) verified via `.toThrow()`.
