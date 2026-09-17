# Controlled QA Fixtures

## Purpose

`scripts/qa-fixtures.cjs` is a **local operator utility** for creating and removing a small, deterministic test-data set in the live Firebase project. It exists to support role-based smoke testing of real Firebase Auth, Firestore rules, the public directory, vendor workflows, reports, endorsements, moderation history, and buyer/vendor order views.

> The tool is deliberately not part of the hosted application. It requires a local Firebase service-account credential, an explicit `--confirm-live` flag, and a local manifest before it can make or remove live records.

## Safety Model

| Guardrail | Behavior |
|---|---|
| Project allowlist | Firebase commands refuse every project except `unity-collective`. |
| Explicit confirmation | `seed`, `inspect`, and `reset` require `--confirm-live`. |
| Fixture naming | Every Auth UID, Firestore ID, email, and document carries a `qa_` or `qaFixture` marker. |
| Local manifest | Seeding writes `.qa-fixtures-manifest.json`, ignored by Git and restricted to the local operator account. |
| Narrow reset | Reset deletes manifest paths plus records owned by the fixed `qa_` users; it never scans or bulk-deletes a collection. |
| Storage cleanup | Reset removes only the Storage prefixes for the fixed `qa_` users, including their avatars, business assets, and legacy onboarding documents. It never deletes a bucket or a non-QA prefix. |
| Auth protection | Reset refuses to delete an Auth account whose email is not in the fixture-only `@fixture.unitycollective.test` domain. |
| Stripe boundary | `stripe-check` accepts only a Stripe **test-mode** secret key beginning with `sk_test_`; it does not create a Stripe object or charge a card. |

The service-account JSON and fixture password remain local environment inputs. Never add either to Git, documentation screenshots, commits, or chat logs.

## Fixture Inventory

| Fixture type | Quantity | Purpose |
|---|---:|---|
| Admin account | 1 | Moderation and verification review access; the fixture admin receives the `admin: true` custom claim. |
| Vendor accounts and stores | 2 | Directory, storefront, store-settings, endorsement, and vendor-order testing. |
| Buyer accounts | 2 | Report, endorsement, checkout, and buyer-order-history testing. |
| Products | 3 | Marketplace search, cart, multi-item order, and storefront catalog testing. |
| Order records | 2 | Buyer and vendor order history, including one paid-style and one delivered-style order. |
| Reports | 2 | One open report and one resolved report for the Admin Moderation queue and Decision History. |
| Endorsements | 2 | Endorsement list and community-verification context. |
| Tier 3 submission | 1 | One pending review record, deliberately without a file URL. Use a real vendor upload when testing Storage document review. |

All fixture orders use explicit placeholder Stripe IDs (`qa_seed_no_stripe_*`). They test the project’s current Firestore order views without claiming that a payment occurred.

## Prerequisites

1. Pull the current `main` branch and install root dependencies with `pnpm install`.
2. Obtain an approved Firebase service-account JSON through the existing access procedure. Keep it outside Git; `serviceAccountKey.json` in the repository root is already ignored.
3. Choose a local-only fixture password of at least 12 characters. It will be assigned to all QA accounts so they can be used in browser smoke tests. Do not reuse a personal or production password.
4. Ensure the Firebase project has the current deployed rules, indexes, and Functions before treating a test result as a release signal.

> **Node 20 compatibility:** The root `firebase-admin` development dependency is intentionally pinned to `13.10.0`. The fixture utility is verified with Node `20.13.1`, matching the project’s documented local/Functions runtime. Do not upgrade this root dependency to Firebase Admin `14.x` as routine maintenance: that major version requires Node 22 or later and makes the CommonJS fixture utility fail before it can reach its safety gates.

## Commands

### Seed

On macOS/Linux:

```bash
export QA_FIXTURE_PASSWORD='choose-a-local-only-password'
export GOOGLE_APPLICATION_CREDENTIALS='./serviceAccountKey.json'
node scripts/qa-fixtures.cjs seed --project unity-collective --confirm-live
```

On Windows PowerShell:

```powershell
$env:QA_FIXTURE_PASSWORD='choose-a-local-only-password'
$env:GOOGLE_APPLICATION_CREDENTIALS='.\serviceAccountKey.json'
node scripts/qa-fixtures.cjs seed --project unity-collective --confirm-live
```

The command is idempotent for its stable `qa_` IDs. It refreshes the fixture records and writes `.qa-fixtures-manifest.json` in the current working directory.

### Inspect

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS='.\serviceAccountKey.json'
node scripts/qa-fixtures.cjs inspect --project unity-collective --confirm-live
```

This prints the manifest path, tracked document count, and the number of tracked Firestore documents currently present. It makes no changes.

### Reset

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS='.\serviceAccountKey.json'
node scripts/qa-fixtures.cjs reset --project unity-collective --confirm-live
```

Reset requires the manifest created by `seed`. If the manifest is missing, malformed, pointed at another project, or not marked as a Unity Collective QA fixture manifest, the command refuses to delete anything. With a valid manifest, reset also removes normal-flow records attached to the fixed QA users—such as newly created products, orders, reports, endorsements, verification submissions, and order-linked email logs—so browser testing does not leave orphaned QA data behind.

It also removes files only below the QA accounts’ fixed Storage prefixes before deleting Firestore records or Auth users. This makes a harmless QA avatar, logo, or Tier 3 document upload reversible without putting production business assets at risk. If Storage cleanup cannot complete, the command stops before it removes Firestore or Auth records.

### Validate Stripe Test-Mode Credentials

```powershell
$env:STRIPE_SECRET_KEY='sk_test_...'
node scripts/qa-fixtures.cjs stripe-check
```

This performs a read-only Stripe account check. It refuses keys that are not test-mode keys and does not create customers, products, PaymentIntents, sessions, or charges.

## Suggested Smoke Sequence

1. Run `seed`, then `inspect`; confirm the expected QA users and document count are present.
2. Sign in with the QA admin account and confirm the Moderation tab shows both the open report and decision-history record.
3. Sign in with a QA buyer account and submit a new report or endorsement against a QA vendor; confirm the admin queue updates.
4. Sign in with a QA vendor account and verify Store Settings, product display, vendor orders, and public directory/storefront visibility.
5. Sign in with a QA buyer account and confirm the seeded orders appear in buyer history; confirm the same orders appear in the linked vendor history.
6. Use the application’s real checkout workflow only with Stripe test mode and a Stripe-provided test payment method. Do not treat seeded Firestore orders as payment confirmation.
7. Run `reset` after the testing session and verify `inspect` refuses because the manifest has been removed.

## Scope Notes

The fixture tool intentionally does **not** upload a fake certification file to Firebase Storage or manufacture Stripe payment objects. Those paths should be tested through their real vendor-upload and Stripe test-checkout workflows so the live rules, Function logic, and provider behavior are actually exercised.

## References

- [`../../scripts/qa-fixtures.cjs`](../../scripts/qa-fixtures.cjs)
- [`FIREBASE_OPERATIONS.md`](FIREBASE_OPERATIONS.md)
- [`TESTING_AND_QUALITY.md`](TESTING_AND_QUALITY.md)
- [`VERIFICATION_OPERATIONS.md`](VERIFICATION_OPERATIONS.md)
- [`ARCHITECTURE_AND_DATA.md`](ARCHITECTURE_AND_DATA.md)
