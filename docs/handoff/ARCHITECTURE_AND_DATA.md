# Architecture and Data Contracts

## System Overview

```text
React 19 + TypeScript + Vite + Tailwind
                 │
                 ├── Firebase Authentication
                 ├── Cloud Firestore
                 ├── Firebase Storage
                 ├── Firebase Hosting
                 └── Cloud Functions for Firebase (Gen 2, Node 20)
                         ├── Stripe integration
                         ├── SendGrid integration
                         └── verification review / trust-score operations
```

The app is a Vite single-page application. Firebase Hosting rewrites all paths to `dist/index.html`; routing is client-side. Functions are maintained as a separate TypeScript project under `functions/`.

## Repository Map

| Location | Purpose | Agent guidance |
|---|---|---|
| `src/` | React application source | Main frontend surface; do not treat mock data as production truth |
| `src/components/` | Reusable UI, storefront, admin, and page components | Reuse existing verification, report, and endorsement components rather than recreating them |
| `src/pages/` | Route-level pages | Confirm the route and data source before changing a page |
| `src/services/` | Firebase, data, payment, email-log, and domain service functions | Check here before adding new Firestore access directly inside UI components |
| `src/types/` | TypeScript domain types | Update types alongside data-contract changes |
| `src/data/` | Mock data and mock types | Useful for tests/development; must not silently override production data |
| `src/__tests__/` | Vitest suite | Add regression tests near the feature/service being changed |
| `functions/src/index.ts` | Cloud Functions entry point | Contains verification, Stripe, and SendGrid callable/HTTP behavior |
| `functions/` | Separate Functions TypeScript project | Install/build separately from root dependencies |
| `firestore.rules` | Firestore security policy | Deploy separately whenever changed |
| `firestore.indexes.json` | Composite and collection-group index configuration | Deploy separately whenever changed; check Firebase Console for build completion |
| `storage.rules` | Firebase Storage security policy | Deploy separately whenever changed |
| `firebase.json` | Firebase project deploy configuration | Defines Hosting, rules, indexes, Storage, and Functions predeploy behavior |
| `scripts/set-admin-claim.cjs` | One-time admin custom-claim script | Requires a local service-account JSON outside Git; use only with an approved UID |
| `docs/handoff/` | Current agent-ready handoff package | Update in the same PR when operational truth changes |

## Frontend Conventions

| Concern | Current standard |
|---|---|
| Language | TypeScript and React functional components |
| Bundler | Vite |
| Styling | Tailwind CSS with dark Pan-African palette |
| Navigation | React Router |
| Data source switching | `VITE_USE_MOCK_DATA` controls mock versus Firebase behavior |
| Testing | Vitest + React Testing Library |
| Package manager | pnpm 10.4.1 at repository root |

Use the existing project style. Avoid broad formatting changes, framework migrations, or redesigns unrelated to the requested goal.

## Integration Map

| Service | Purpose | Configuration boundary |
|---|---|---|
| Firebase Auth | User identity and session | Public Firebase app values use Vite env variables; server admin access uses a service account outside Git |
| Firestore | Business, onboarding, products, orders, reports, endorsements, verification, and logs | Rules and indexes are code-managed files in the repository |
| Firebase Storage | Logos, product imagery, avatars, and verification documents | Storage path and rules must agree with client upload logic |
| Firebase Functions | Payment, email, verification review, trust updates | `functions/` project, deployed separately from Hosting |
| Stripe | Payment intent/session infrastructure | Public key is a Vite value; secret material is server-side only |
| SendGrid | Transactional email sending | API key is a Firebase secret; actual delivery remains an active follow-up |
| GitHub | Source, branches, pull requests | Never commit or document personal access tokens |

## Core Firestore Collections

The list below describes the current operational model. Inspect current service code before changing a schema.

| Path | Primary purpose | Key ownership/access expectation |
|---|---|---|
| `users/{uid}` | User profile and admin marker | `isAdmin: true` is the established admin profile marker; legacy `role: 'admin'` is also supported in review paths |
| `onboarding/{uid}` | Vendor onboarding and public business profile information | Public directory/storefront content source; vendor/admin writes |
| `businesses/{uid}` | Vendor business overrides and authoritative verification data | Publicly readable business data; Tier promotion writes occur here |
| `businesses/{uid}/verificationSubmissions/{submissionId}` | Tier 3 certification document submissions | Vendor owns their path; admin reviews across collection group |
| `products/{productId}` | Marketplace product records | Vendor-scoped production data; verify ownership rule before adding fields |
| `orders/{orderId}` | Buyer/vendor orders | Existing indexes include user and vendor order-history access patterns |
| `endorsements/{endorsementId}` | Community endorsement records | Used for Tier 2 progression and admin moderation |
| `reports/{reportId}` | Business report records | Authenticated report submission and admin moderation |
| `businessVerifications/{uid}` | Supplemental trust/verification data | Used by verification service where applicable; inspect current code before repurposing |
| `emailLogs/{logId}` | Email send attempt/audit records | Exists even though delivery validation is deferred |
| `messageThreads/{threadId}` | Private-message thread metadata | Reads are participant-filtered; do not query all threads |
| `messages/{messageId}` | Private message data | Access must remain participant-scoped |

## Authoritative Data Contracts

### Verification Tier

```text
businesses/{vendorUid}.verificationTier
```

is the authoritative 3-tier value once a vendor reaches Tier 2 or Tier 3. A business profile may also have an older onboarding `verificationTier`; it is a fallback only. Any public directory, detail page, storefront, settings page, or dashboard that merges onboarding and business data must prefer the business record.

```ts
const displayTier = businessOverride.verificationTier ?? onboarding.verificationTier ?? 1;
```

The approval path sets Tier 3 on `businesses/{uid}`. Do **not** write duplicate synchronization code to `onboarding` unless the owner explicitly asks for a schema migration and all consumers are updated together.

### Admin Authorization

Admin checks must remain aligned across UI, Firestore rules, and Functions:

```text
users/{uid}.isAdmin === true
OR users/{uid}.role === 'admin'        // legacy compatibility where implemented
OR request.auth.token.admin === true   // custom claim
```

The `isAdmin` profile field is the most directly observable operational marker. A custom claim is still useful for Storage and server-side access, but a claim change requires a token refresh/sign-in. Do not rely on a Firestore `get()` call inside a collection-group rule as the only way to authorize an admin query.

### Tier 3 Submission Location

```text
businesses/{vendorUid}/verificationSubmissions/{submissionId}
```

The Admin Verifications queue uses a Firestore `collectionGroup('verificationSubmissions')` query. This requires:

1. A recursive collection-group rule in `firestore.rules` permitting authorized admin reads.
2. The configured `verificationSubmissions.status` collection-group single-field index.
3. Appropriate query constraints matching the rules.

### Public Privacy Boundary

Public storefronts and directory cards may expose business information only: name, category, description, public location, logo, products, public website, verification tier, and business-level engagement. Do **not** display personal name, email, phone, account UID, personal profile photo, private notes, or uploaded certification document URLs publicly.

## Route and Feature Notes

| Surface | Primary route or component | Data caution |
|---|---|---|
| Public directory | `src/pages/BusinessDirectoryPage.tsx` | Uses `businessService`; preserve authoritative tier merge |
| Directory detail | `src/components/BusinessDetail.tsx` | Uses raw UID string as identifier, not numeric parsing |
| Vendor storefront | `src/components/VendorStorefront.tsx` | Uses onboarding plus business override/verification data |
| Vendor settings | `src/pages/VendorSettingsPage.tsx` | Must load existing Tier 3 submission and current business tier |
| Vendor dashboard | `src/pages/MemberDashboard.tsx` | Must display authoritative business tier |
| Admin panel | `src/components/admin/AdminPanel.tsx` | Verification, moderation, and data queries should surface—not swallow—operational errors |
| Verification service | `src/services/verificationService.ts` | Holds submission, endorsements, reports, and verification data behavior |

## Change Checklist for Data Work

Before changing Firestore-related code:

1. Identify the authoritative collection and document path.
2. Update TypeScript type(s) and mock data if they represent the changed schema.
3. Confirm client reads/writes match Firestore rules.
4. Decide whether a collection-group/composite index is required; update `firestore.indexes.json` when needed.
5. Update Functions if server logic owns the write.
6. Add a regression test covering the contract or user-visible outcome.
7. Update relevant handoff and feature documentation.

## References

- [`CURRENT_STATE.md`](CURRENT_STATE.md)
- [`FIREBASE_OPERATIONS.md`](FIREBASE_OPERATIONS.md)
- [`VERIFICATION_OPERATIONS.md`](VERIFICATION_OPERATIONS.md)
- [`../features/verification-session2.md`](../features/verification-session2.md)
- [`../../firebase.json`](../../firebase.json)
- [`../../firestore.rules`](../../firestore.rules)
- [`../../firestore.indexes.json`](../../firestore.indexes.json)
