# Local Setup

## Purpose

This guide describes a clean, repeatable setup for a new coding agent or developer. It supports two modes:

- **Mock mode:** safe default for UI development and most automated tests.
- **Live Firebase mode:** required for real authentication, Firestore, Storage, verification uploads, and production-like smoke tests.

> Read [`../Guidelines.md`](../Guidelines.md) and [`README.md`](README.md) before modifying the repository.

## Required Tools

| Tool | Required version / expectation | Reason |
|---|---|---|
| Git | Current supported version | Clone, branch, and PR workflow |
| Node.js | Node 20 recommended; Functions explicitly require Node 20 | Build, tests, and Functions tooling |
| pnpm | `10.4.1` as pinned by root `package.json` | Root dependency install and scripts |
| Firebase CLI | Current compatible CLI authenticated to the approved Firebase project | Rules, indexes, Storage, Functions, and Hosting deploys |
| Browser | Chromium/Chrome or equivalent with DevTools | Manual production and permission smoke tests |

Do not update the global pnpm version during routine project setup. The root project explicitly pins pnpm `10.4.1`; treat a package-manager upgrade as a separate maintenance task.

## Clean Clone

```bash
git clone https://github.com/bharris133/unity-collective.git
cd unity-collective
git checkout main
git pull --ff-only origin main
```

A contributor should create a focused branch before edits:

```bash
git checkout -b fix/descriptive-task-name
```

## Install Dependencies

The root app and Firebase Functions are separate pnpm projects.

```bash
# Root React/Vite application
pnpm install

# Firebase Functions project
pnpm --dir functions install
```

If the lockfile or dependency manifest changes, run `pnpm install` again before building. Do not use `npm install` in the root project as a substitute for pnpm; it can create conflicting lockfiles or local dependency state.

## Environment Modes

### Mock Mode — Default for New Agents

The repository’s development configuration uses mock data by default. This is the safest starting point for UI work and automated tests.

```bash
pnpm run dev
```

Open the Vite URL printed by the command, commonly `http://localhost:5173`.

Use mock mode when the task does not need real Firestore, Storage, Auth, Functions, Stripe, or SendGrid behavior. Mock mode is intentionally not proof of production permission behavior.

### Live Firebase Mode — Required for Real Workflows

Create a local, ignored file from the safe template:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Update `.env.local` with approved public Firebase configuration values and the Stripe publishable key. For live Firebase data, set:

```env
VITE_USE_MOCK_DATA=false
VITE_FIREBASE_API_KEY=<approved-public-web-api-key>
VITE_FIREBASE_AUTH_DOMAIN=unity-collective.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=unity-collective
VITE_FIREBASE_STORAGE_BUCKET=unity-collective.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=845870294872
VITE_FIREBASE_APP_ID=<approved-web-app-id>
VITE_STRIPE_PUBLISHABLE_KEY=<approved-stripe-publishable-key>
```

Use the project’s actual Firebase Web app configuration. `unity-collective.firebasestorage.app` is the current Storage bucket format; do not replace it with a generic `.appspot.com` example.

> `.env.local` and `.env.production.local` are local-only configuration files. Never commit them, paste their values into an issue, or include them in the handoff package.

For a production build on an operator workstation, create `.env.production.local` with the same approved public Vite variables and `VITE_USE_MOCK_DATA=false`. Vite loads production-local values at build time.

## Run Commands

| Goal | Command |
|---|---|
| Start local app | `pnpm run dev` |
| Build production frontend | `pnpm run build` |
| Preview the built frontend | `pnpm run preview` |
| Run all tests once | `pnpm test --run` |
| Run a single test file | `pnpm test --run src/__tests__/verification/VerificationAdminAuthorization.test.ts` |
| Start Vitest UI | `pnpm test:ui` |
| Run lint | `pnpm run lint` |
| Build Functions | `pnpm --dir functions run build` |
| Start Functions emulator | `pnpm --dir functions run serve` |

## Minimum Pre-Change Baseline

Before work begins, record the current baseline:

```bash
pnpm test --run
pnpm run build
pnpm --dir functions run build
```

At the time this handoff package was created, the expected frontend baseline is **181 passing tests across 20 test files**. If the count changes after a legitimate merge, update this guide and the relevant task documentation in the same PR.

## Local Visual Test Procedure

1. Run `pnpm run dev`.
2. Test default mock mode for layout, navigation, and component behavior.
3. If a change affects Firebase access, run live Firebase mode with an approved test account.
4. Check desktop and narrow responsive widths.
5. Check browser DevTools Console and Network tabs for errors, failed permission requests, and unexpected mock-data fallbacks.
6. For verification work, follow the end-to-end procedure in [`VERIFICATION_OPERATIONS.md`](VERIFICATION_OPERATIONS.md).

## Common Local Problems

| Symptom | Likely cause | First response |
|---|---|---|
| Public directory displays mock businesses | Production/local build loaded `VITE_USE_MOCK_DATA=true` or missing live config | Verify `.env.production.local`, rebuild, then deploy Hosting |
| Firebase calls fail with permission denied | Rules are stale, query does not match rules, account is not authorized, or mock/live mode is confused | Confirm active mode, inspect rules/query contract, and deploy only the required rule surface |
| Function callable waits/fails | Functions not deployed, function compile failed, or live config is missing | Build Functions, inspect logs, and use only documented fallback behavior |
| Admin review cannot see submissions | Missing collection-group rule/index or mismatched admin authorization | Read [`VERIFICATION_OPERATIONS.md`](VERIFICATION_OPERATIONS.md) before changing code |
| Git pull refuses due to local package changes | Local installer or temporary edits modified `package.json` / `pnpm-lock.yaml` | Stash the specific files before pulling; do not overwrite incoming lockfile changes casually |

## Files a New Agent Should Not Modify Casually

| File or area | Why |
|---|---|
| `.env*` local files | They contain workstation-only configuration |
| `serviceAccountKey.json` | Private administrative credential; must remain outside Git |
| `firestore.rules`, `storage.rules`, `firestore.indexes.json` | Production security and query behavior; require explicit deployment and smoke tests |
| `functions/src/index.ts` | Deployment affects live server behavior and secret-bound integrations |
| `package.json`, `pnpm-lock.yaml` | Dependency changes must be intentional and validated |

## References

- [`../../package.json`](../../package.json)
- [`../../functions/package.json`](../../functions/package.json)
- [`../../.env.example`](../../.env.example)
- [`FIREBASE_OPERATIONS.md`](FIREBASE_OPERATIONS.md)
- [`TESTING_AND_QUALITY.md`](TESTING_AND_QUALITY.md)
