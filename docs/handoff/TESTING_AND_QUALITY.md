# Testing and Quality

## Quality Standard

Every meaningful change must prove more than compilation. The minimum standard is:

1. A clear user-visible or data-contract success criterion.
2. Automated regression coverage for new logic or a documented reason it cannot be automated.
3. Passing root tests and production build.
4. Passing Functions build when Functions changed.
5. Focused manual/live testing when the change touches Firebase permissions, Storage, callable Functions, deployment, or visual behavior.

Read [`../Guidelines.md`](../Guidelines.md) before implementation. It requires success criteria and discourages speculative or unrelated changes.

## Current Automated Baseline

Current baseline after the moderation refinement and controlled QA fixture utility: **188 passing tests across 21 test files**.

| Layer | Tooling | Command |
|---|---|---|
| Frontend/service/component tests | Vitest + React Testing Library | `pnpm test --run` |
| Watch/UI mode | Vitest | `pnpm test` or `pnpm test:ui` |
| Production frontend build | Vite | `pnpm run build` |
| Lint | ESLint | `pnpm run lint` |
| Cloud Functions TypeScript build | TypeScript in `functions/` | `pnpm --dir functions run build` |

## Required Commands by Change Type

| Change | Minimum automated gate |
|---|---|
| Component/page/styling | Related test file(s), `pnpm test --run`, `pnpm run build` |
| Service/type/data contract | Related unit tests, `pnpm test --run`, `pnpm run build` |
| Firestore rules/indexes | Related static/contract test where possible, `pnpm test --run`, then live permission/query smoke test |
| Storage rules | `pnpm test --run`, then live authorized/denied upload and read test |
| Function logic | Functions build, frontend test suite if client contract changes, live callable smoke test after deploy |
| Dependency update | `pnpm install`, full tests, production build; Functions build if shared/Functions dependencies change |
| Verification module | Full verification test files plus end-to-end vendor/admin smoke test |

## Recommended Development Loop

```bash
# Establish baseline
pnpm test --run
pnpm run build

# Work on a focused branch
# Add or update tests with the code change

# Validate the feature-specific test first
pnpm test --run src/__tests__/verification/VerificationAdminAuthorization.test.ts

# Validate the complete client suite
pnpm test --run
pnpm run build

# If Functions changed
pnpm --dir functions run build
```

## Test Organization

| Directory | Coverage focus |
|---|---|
| `src/__tests__/components/` | Reusable UI components, checkout, CSV upload, and verification presentation |
| `src/__tests__/pages/` | Route/page behavior such as Vendor Settings |
| `src/__tests__/services/` | Domain services including Stripe/Storage/data behavior |
| `src/__tests__/contexts/` | Context and session/state behavior |
| `src/__tests__/verification/` | Tier 1–3 verification UI, data contracts, rules/index requirements, and authorization regressions |
| `src/__tests__/types/` | Type-level/domain shape expectations |

Use the nearest existing test style. Do not add a second testing framework for a one-off task.

## Manual Visual Checklist

Automated tests cannot confirm every visual and responsive issue. For a user-facing change:

| Check | What good looks like |
|---|---|
| Desktop layout | No clipped content, accidental horizontal overflow, or unreadable contrast |
| Narrow layout | Navigation, cards, dialogs, forms, and action buttons remain usable |
| Theme consistency | Dark background, gold accent, and green/red/blue verification states are legible and consistent |
| Loading/error state | The UI explains a failure rather than silently returning an empty result |
| Public privacy | No user email, UID, personal phone, or private document URL is exposed on directory/storefront surfaces |
| Browser console | No unexpected errors, repeated permission denials, or failed network requests |

## Live Firebase Permission Test Pattern

Client tests do not execute Firebase’s production security rules. Use role-based smoke tests after rules/index/Storage changes.

| Persona | Verify |
|---|---|
| Unauthenticated visitor | Can see only public business data; cannot access private profile, messages, or documents |
| Regular authenticated shopper | Can report/endorse as permitted; cannot administer verification or read others’ private data |
| Vendor | Can edit their own business and upload their own certification document; cannot access another vendor’s business/documents |
| Administrator | Can view review queue and document, approve/reject submission, and moderate reports/endorsements |

Capture exact permission errors; do not replace security rules with broad `allow read, write: if request.auth != null` shortcuts to unblock testing.

## Tier 3 Verification Regression Script

Run after verification-related frontend, rules, indexes, Storage, or Functions changes:

1. **Vendor:** Sign in as a Tier 1 vendor and open Store Settings.
2. **Upload:** Select a permitted PDF/JPG/PNG below the size limit and submit it.
3. **Persistence:** Refresh; confirm **Under Review** remains visible and duplicate pending submission is blocked.
4. **Admin queue:** Sign in as an authorized admin; confirm the pending count/list appears.
5. **Document:** Open the document link; confirm only the intended reviewer can access it.
6. **Approve:** Approve the submission.
7. **Vendor state:** Refresh Store Settings and dashboard; confirm **Tier 3 — Document Certified**.
8. **Public state:** Check directory card, detail page, and storefront for a readable **Certified** badge.
9. **Negative case:** Verify a vendor cannot submit a document under another business path and a non-admin cannot review.
10. **Observability:** Inspect browser console and Firebase Functions logs for errors.

## Email Testing Status

Email code and logs exist, but delivery is not yet a launch-validated workflow. Do not mark email “tested” merely because an `emailLogs` record exists. When email work resumes, create a controlled plan that validates:

1. Function invocation.
2. SendGrid response and failure logging.
3. Sender-domain authentication.
4. Buyer delivery.
5. Vendor delivery.
6. Spam/junk-folder outcomes.
7. Duplicate-send/idempotency behavior.

## Future Load-Test Plan

Load testing is intentionally deferred until the remaining functional scope stabilizes. Do not optimize based on speculation. When scheduled, create a measured plan around these scenarios:

| Scenario | Initial target | Metrics |
|---|---:|---|
| Public directory browsing/search | 25–50 concurrent users | Page response, Firestore reads, error rate, browser errors |
| Vendor document upload | Controlled concurrent uploads | Upload success, Storage authorization, Function latency, duplicate submissions |
| Admin review queue | Concurrent review/list activity | Collection-group query latency, index health, approval idempotency |
| Marketplace browsing/order creation | Controlled test accounts | Cart/order consistency, payment-function response, email-log behavior |

Increase load gradually. Add pagination, aggregate counters, caching, virtualized lists, or alerts only when observed measurements justify them.

## Bug-Fix Protocol

1. Reproduce the issue using the same user role and data mode.
2. Capture the exact browser, Firebase, Function, or network error.
3. Identify the owning layer: UI, service, Firestore rule, index, Storage rule, Function, or deployment state.
4. Add a test that protects the failure mode when practical.
5. Implement the smallest correct fix.
6. Run the full required validation set.
7. Document any new operation or data contract.

## References

- [`LOCAL_SETUP.md`](LOCAL_SETUP.md)
- [`FIREBASE_OPERATIONS.md`](FIREBASE_OPERATIONS.md)
- [`VERIFICATION_OPERATIONS.md`](VERIFICATION_OPERATIONS.md)
- [`../../vitest.config.ts`](../../vitest.config.ts)
- [`../../package.json`](../../package.json)
