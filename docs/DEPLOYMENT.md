# LiftLedger — Operational Deployment Runbook

This document defines the standardized **5-Phase Deployment Procedure** for **LiftLedger**. It is written so that any software engineer or team member can safely prepare, deploy, verify, roll back, and record a production release on **Vercel**.

---

## Phase 1: Before (Pre-Deployment Checklist)

Before triggering a production deployment or merging a release Pull Request into `main`, the release engineer **must** verify every item below:

- [ ] **1. Clean Working Tree & Up-to-Date Branch:**
  ```bash
  git checkout main
  git pull origin main
  git status
  ```
  Ensure there are no untracked temporary files or uncommitted local changes.

- [ ] **2. All Unit Tests Pass Locally (`Vitest`):**
  ```bash
  npm ci
  npm test -- --run
  ```
  Confirm that all **10 unit tests** (Normal, Edge, and Invalid suites) pass with `0` failures.

- [ ] **3. Production Build Succeeds Locally (`Vite`):**
  ```bash
  npm run build
  ```
  Verify that Vite compiles the production bundle into `dist/` with zero warnings or bundling errors.

- [ ] **4. Environment Variables & Secrets Audit:**
  - Verify that `.env.example` contains all required `VITE_*` public metadata keys (`VITE_APP_NAME`, `VITE_APP_VERSION`, `VITE_APP_ENV`).
  - Confirm that **zero** `.env` files, private API keys, tokens, or credentials exist in the Git commit history (`git log -p` audit).

- [ ] **5. GitHub Actions CI & Pull Request Approval:**
  - Confirm that the GitHub Actions workflow (`LiftLedger CI Pipeline` / `Build and Test (Node 20)`) shows a **green passing check** on the Pull Request.
  - Confirm at least **1 peer review approval** has been granted before merging to `main`.

---

## Phase 2: Deploy (Production Release to Vercel)

LiftLedger is deployed on **Vercel** with continuous deployment linked to the `main` branch on GitHub.

### Option A: Automated Continuous Deployment via GitHub (Standard Flow)

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..." → "Project"** (first-time setup only).
2. Import the **`lift-ledger`** GitHub repository.
3. Verify the auto-detected build settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm ci`
   - **Node.js Version:** `20.x`
4. Under **Environment Variables**, add the non-sensitive public metadata from `.env.example`:
   - `VITE_APP_NAME` = `LiftLedger`
   - `VITE_APP_VERSION` = `1.0.0`
   - `VITE_APP_ENV` = `production`
5. Click **Deploy** (for initial setup) or merge the approved Pull Request into `main` (for subsequent releases). Vercel automatically builds and promotes the new `main` commit to the production domain.

### Option B: Manual Deployment via Vercel CLI (Alternative Flow)

If you need to trigger a deployment directly from a terminal:

```bash
# 1. Authenticate with Vercel (one-time setup)
npx vercel login

# 2. Link local repository to the Vercel project
npx vercel link

# 3. Build and deploy directly to production
npx vercel --prod
```

---

## Phase 3: Verify (Post-Deployment Smoke Tests)

Immediately after Vercel marks the deployment as **Ready**, open the production URL in an incognito browser window and execute the following **4 manual smoke tests**:

1. **Availability & Assets Check:**
   - Open `https://<your-vercel-domain>.vercel.app`.
   - Open Chrome DevTools (`F12` → **Console** & **Network** tabs).
   - **Expected:** HTTP `200 OK` on `index.html`, CSS, and JS bundles; Dark Mode Bento Grid renders properly; **zero** red runtime errors in the console.

2. **Normal Calculation Smoke Test (Calorie & Macro Calculator):**
   - Enter `Weight = 80`, `Height = 180`, `Age = 25`, `Biological Sex = male`, `Activity = Moderately Active`, `Goal = Bulk (+15% Surplus)`.
   - Click **"Calculate Daily Macros"**.
   - **Expected:** `Basal (BMR) = 1805 kcal`, `Maintenance (TDEE) = 2798 kcal`, `Target Intake = 3218 kcal`, `Protein = 241g`, `Carbs = 362g`, `Fats = 89g`.

3. **Normal & Edge Calculation Smoke Test (1RM Calculator):**
   - Enter `Lifted Weight = 100`, `Repetitions = 8` and click **"Estimate One-Rep Max"**.
   - **Expected:** `Estimated 1RM Max Load = 126.7 kg` and the Working Set Load Matrix updates (`95% = 120.4 kg`, `80% = 101.4 kg`).
   - Change `Repetitions = 1` with `Lifted Weight = 140`.
   - **Expected:** Returns exact weight `140 kg`.

4. **Guardrail & Error Handling Smoke Test:**
   - Enter `Weight = -50` in the Macro Calculator or `Repetitions = 35` in the 1RM Calculator and submit.
   - **Expected:** A red **Validation Error** banner (`role="alert"`) appears with the descriptive message (`"Weight must be greater than zero."` / `"Repetitions cannot exceed 30 for reliable 1RM estimation."`) without crashing the page.

---

## Phase 4: Roll back (Emergency Recovery Procedure)

If any Phase 3 smoke test fails or a regression is discovered in production, execute an immediate rollback using one of the two methods below.

### Method 1: Instant Rollback via Vercel Dashboard (Fastest — < 30 seconds)

1. Open the [Vercel Dashboard](https://vercel.com/dashboard) and select the **`lift-ledger`** project.
2. Navigate to the **Deployments** tab.
3. Locate the last known healthy production deployment (prior to the broken commit).
4. Click the three-dot menu (`⋯`) next to that deployment and select **"Instant Rollback"** (or **"Promote to Production"**).
5. Confirm the prompt. Traffic is immediately re-routed to the previous immutable build artifact without waiting for a rebuild.

### Method 2: Git Revert Rollback (Source Control Recovery)

To revert the faulty commit in Git history and trigger a clean CI + Vercel deployment:

```bash
# 1. Switch to main and pull latest changes
git checkout main
git pull origin main

# 2. Create a new commit that cleanly undoes the faulty merge/commit
git revert HEAD --no-edit

# 3. Push the revert commit (or open an emergency hotfix PR if branch protection requires it)
git push origin main
```

After rolling back, re-run **Phase 3 (Verify)** to confirm production stability is restored.

---

## Phase 5: Record (Release Tagging & Audit Log)

Once Phase 3 verification succeeds, permanently record the release in Git and the project's deployment ledger:

### 1. Create and Push an Annotated Git Tag

```bash
git checkout main
git pull origin main

# Tag the verified release commit using Semantic Versioning
git tag -a v1.0.0 -m "Release v1.0.0: Initial production release of LiftLedger with CI/CD pipeline"

# Push the tag to GitHub
git push origin v1.0.0
```

### 2. Log Entry in the Release Registry

Append an entry to the table below for every production deployment or rollback:

| Release Tag | Date (UTC) | Commit SHA | Environment | Deployed By | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `v1.0.0` | `2026-11-24` | `<commit-sha>` | Production (Vercel) | Engineering Team | Verified | Initial release: BMR/Macros, 1RM calculator, 10 Vitest unit tests, Node 20 CI workflow |
