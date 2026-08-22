# Deployment and Rollback Runbook

## Purpose

This runbook prevents avoidable production incidents by matching each code change to the correct Firebase deployment surface. Deploy the **smallest required surface**, verify it, and retain enough information to roll back safely.

Read [`FIREBASE_OPERATIONS.md`](FIREBASE_OPERATIONS.md) before running any command against production.

## Pre-Deployment Gate

Before deployment, confirm all applicable statements are true:

| Check | Required when |
|---|---|
| Working tree is clean or intentionally committed | Always |
| Branch has been pushed and merged to `main` | Production change |
| Root tests pass | Any frontend/service/rules-facing change |
| `pnpm run build` passes | Hosting change |
| `pnpm --dir functions run build` passes | Functions change |
| Required Firestore rules/indexes/Storage rules have been reviewed | Firebase access/query/upload change |
| Environment values are set locally but not committed | Hosting build using live Firebase |
| Release owner understands the expected live smoke test | Always |

Recommended preflight commands:

```bash
git checkout main
git pull --ff-only origin main
pnpm install
pnpm test --run
pnpm run build
```

For Functions changes:

```bash
pnpm --dir functions install
pnpm --dir functions run build
```

## Deployment Decision Matrix

| Change type | Build required | Deploy command | Required smoke test |
|---|---|---|---|
| Frontend route, component, service, styling, or static asset | Root Vite build | `firebase deploy --only hosting --project unity-collective` | Route loads, expected data source appears, browser console is clean |
| Firestore rules only | No frontend build | `firebase deploy --only firestore:rules --project unity-collective` | Test allowed and denied access with the correct user roles |
| Firestore indexes only | No frontend build | `firebase deploy --only firestore:indexes --project unity-collective` | Wait for index **Enabled**, then run the affected query |
| Storage rules only | No frontend build | `firebase deploy --only storage --project unity-collective` | Test authorized upload/read and unauthorized access denial |
| Functions only | Functions build is automatic through `firebase.json`, but pre-build explicitly | `firebase deploy --only functions --project unity-collective` | Execute callable/HTTP path and review Functions logs |
| Hosting + rules | Root Vite build | `firebase deploy --only hosting,firestore:rules --project unity-collective` | UI flow plus permission behavior |
| Rules + Functions | Functions build | `firebase deploy --only firestore:rules,functions --project unity-collective` | Authorized Function behavior and direct rules validation |
| Several targeted surfaces | Build each changed project | Explicit comma-separated list | Run all related smoke tests |

Avoid a bare `firebase deploy` unless the release owner has consciously reviewed every deployable resource.

## Standard Hosting Release

Use this after a merged frontend change:

```powershell
cd C:\Users\<operator>\Source\Unity-Collective\unity-collective
git pull origin main
pnpm install
pnpm test --run
pnpm run build
firebase deploy --only hosting --project unity-collective
```

After release, hard-refresh the browser. Vite asset filenames are content-hashed, but a browser session can still hold application state from a prior run.

## Firestore Rules Release

```powershell
cd C:\Users\<operator>\Source\Unity-Collective\unity-collective
git pull origin main
firebase deploy --only firestore:rules --project unity-collective
```

Then test both sides of the permission boundary. For example, for a vendor submission rule, verify that the owner can list their own submissions and another ordinary user cannot list them.

## Firestore Index Release

```powershell
cd C:\Users\<operator>\Source\Unity-Collective\unity-collective
git pull origin main
firebase deploy --only firestore:indexes --project unity-collective
```

### Index Completion Requirement

A successful CLI upload does not mean an index is ready. Open Firebase Console → Firestore → Indexes and confirm the relevant entry is **Enabled** before declaring the feature fixed.

For the Admin Verifications query, confirm the `verificationSubmissions` collection-group `status` index is enabled.

## Storage Rules Release

```powershell
cd C:\Users\<operator>\Source\Unity-Collective\unity-collective
git pull origin main
firebase deploy --only storage --project unity-collective
```

Minimum live test:

1. Vendor uploads an allowed logo/product/document to their own path.
2. Owner sees the uploaded asset.
3. Admin can open a review document where authorized.
4. Unauthenticated or unrelated account access is denied.

## Functions Release

```powershell
cd C:\Users\<operator>\Source\Unity-Collective\unity-collective
git pull origin main
pnpm --dir functions install
pnpm --dir functions run build
firebase deploy --only functions --project unity-collective
```

After deployment, check Firebase Functions logs and execute the smallest live workflow that proves the change. For verification review, approve/reject a deliberately controlled test submission; for email, use a controlled test order only after the email design is finalized.

## Verification Release Smoke Test

When changes affect Tier 1–3 verification, run this complete path after the relevant deployments:

1. Sign in as a Tier 1 vendor.
2. Upload one permitted test document.
3. Confirm the vendor sees **Under Review** after page refresh.
4. Sign in as an authorized admin.
5. Confirm the Admin Verifications queue lists the submission and the document link opens.
6. Approve the submission.
7. Confirm the vendor sees **Tier 3 — Document Certified**.
8. Confirm Directory card, detail page, storefront, settings, and dashboard show **Certified**.
9. Check DevTools/Functions logs for unexpected errors.

See [`VERIFICATION_OPERATIONS.md`](VERIFICATION_OPERATIONS.md) for the ownership and authorization model.

## Rollback Principles

### Hosting Rollback

Firebase Hosting releases are versioned. Use Firebase Console → Hosting → Release history to roll back to the most recent known-good release if a frontend deployment causes a critical user-visible regression.

Before rollback, capture:

- deployed commit SHA;
- affected route and user role;
- browser console error;
- whether the problem is mock/live data specific; and
- any impacted Firebase surface.

A Hosting rollback does **not** revert Firestore rules, indexes, Storage rules, or Functions.

### Rules or Storage Rollback

Rules are code. Revert the relevant commit or restore the known-good rule file in a new reviewed commit, then deploy only that rule surface. Never hot-edit production rules without recording the change in Git.

### Index Rollback

Do not delete an index merely because it appears unused. First identify every query that depends on it. Index deletion can silently break production queries later.

### Functions Rollback

Revert the Function source in Git, build it, deploy only Functions, and verify logs. If a secret/configuration change is involved, document the exact non-secret corrective action in the incident record.

## Deployment Record Template

For meaningful releases, record the following in the PR, release note, or project log:

| Field | Record |
|---|---|
| Commit / PR | `#<number>` and SHA |
| Operator | Responsible person |
| Surfaces deployed | Hosting, Rules, Indexes, Storage, Functions |
| Environment | Production Firebase project |
| Smoke test | Exact user flow and observed outcome |
| Browser/Function errors | None or exact error text |
| Rollback reference | Previous known-good Hosting release or commit |

## Emergency Stop Rule

Stop and ask the owner before proceeding if deployment output asks to delete live Firestore indexes, destroy secrets, replace a production project, or make an unexpected resource change. A successful command is not sufficient justification for irreversible infrastructure actions.

## References

- [`FIREBASE_OPERATIONS.md`](FIREBASE_OPERATIONS.md)
- [`TESTING_AND_QUALITY.md`](TESTING_AND_QUALITY.md)
- [`../../firebase.json`](../../firebase.json)
