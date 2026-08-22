# Verification Operations

## Purpose

This guide covers the active three-tier verification system from vendor onboarding through public display and administrator review. It is the first document to read before changing verification UI, rules, indexes, Storage, Functions, or public badge behavior.

> Read [`../Guidelines.md`](../Guidelines.md) first. Verification work crosses client UI, Firestore, Storage, rules, indexes, Functions, and public privacy boundaries; do not make a one-layer change without tracing the full path.

## Tier Model

| Tier | Label | Color | How reached | Public interpretation |
|---:|---|---|---|---|
| 1 | **Self-Declared** | Gold/yellow | Vendor affirms Black-owned status during onboarding | A self-declaration, not third-party review |
| 2 | **Community Verified** | Blue | Endorsement/trust threshold reaches three qualifying endorsements | Community-supported status |
| 3 | **Document Certified** | Green | Vendor uploads eligible supporting documentation; authorized admin approves | Human-reviewed document certification |

Tier 1 is set automatically by the onboarding `isBlackOwned` affirmation. Vendors must not select or self-assign Tier 2 or Tier 3 directly.

## Data Ownership Model

| Data | Location | Owner / reader model |
|---|---|---|
| Onboarding business profile | `onboarding/{vendorUid}` | Vendor and admin write; public business profile fields are used by directory/storefront |
| Business override and authoritative tier | `businesses/{vendorUid}` | Tier 2/3 promotion writes occur here; public display must prefer this tier |
| Tier 3 submission | `businesses/{vendorUid}/verificationSubmissions/{submissionId}` | Vendor creates/reads their own; authorized admins review across collection group |
| Document asset | Vendor-owned verification Storage path | Vendor upload; authorized admin document read only |
| Endorsement | `endorsements/{id}` | Authenticated community action; admin moderation visibility |
| Report | `reports/{id}` | Authenticated community action; admin moderation visibility |

> **Single source of truth:** `businesses/{vendorUid}.verificationTier` is authoritative after promotion. It overrides an older `onboarding/{vendorUid}.verificationTier` wherever the values differ.

## Vendor Tier 3 Flow

```text
Tier 1 or Tier 2 vendor
→ Store Settings
→ selects permitted document and optional notes
→ file uploads to Firebase Storage
→ submitVerificationDocument callable is attempted
→ when function unavailable, client fallback stores the same submission contract
→ verification submission document is created
→ vendor sees Under Review
→ duplicate pending submission is blocked
```

### Vendor UI Expectations

| State | Expected UI |
|---|---|
| Tier 1 / no submission | “Apply for Tier 3 Certification” upload widget appears |
| Pending submission | “Under Review” state appears after page refresh; new submission is blocked |
| Approved submission | Approved message appears; Verification Progress shows Tier 3 current; upload widget is not presented |
| Rejected submission | Rejection status/reason should be visible and vendor can submit a new corrected document as permitted by product policy |

### Permitted Files

The upload UI accepts PDF, JPG, and PNG certification material and enforces the configured size limit. Do not silently expand accepted types without confirming Storage rules, client validation, document-review operations, and privacy consequences.

## Admin Review Flow

```text
Authorized admin
→ Admin Panel → Verifications
→ collection-group query loads submissions
→ reviewer selects a submission
→ reviewer opens private document link
→ reviewer chooses Approve or Reject
→ reviewSubmission Cloud Function updates status and authoritative business tier
→ public and vendor displays read the new tier
```

### Admin Queue Preconditions

The queue depends on all of the following:

| Requirement | Why it is required |
|---|---|
| User is authorized as an admin | UI/Function/rules must agree on the permission model |
| Recursive `verificationSubmissions` Firestore rule exists | `collectionGroup()` queries need a recursive match |
| `verificationSubmissions.status` collection-group index is **Enabled** | The filtered pending queue requires it |
| Submission document has valid `status`, `businessId`, and timestamps | Queue and vendor status behavior rely on the contract |
| Admin has authorization to read the Storage document | Reviewer must open the private document, but public users must not |

### Approval Effects

A successful approval should:

1. Mark the submission approved.
2. Set `businesses/{vendorUid}.verificationTier = 3`.
3. Record certification metadata such as `documentVerifiedAt` according to current Function implementation.
4. Clear applicable review flags.
5. Cause vendor settings/dashboard and public directory/storefront/detail surfaces to show **Certified** after refresh.

A successful rejection should mark the submission rejected and retain enough review context for operational follow-up without exposing the document publicly.

## Authorization Contract

The active project supports this aligned admin contract:

```text
users/{uid}.isAdmin === true
OR users/{uid}.role === 'admin'        // legacy compatibility
OR Firebase Auth custom claim admin === true
```

| Layer | Expected authorization behavior |
|---|---|
| Admin UI | Uses the application’s admin profile model |
| Firestore rules | Supports authorized admin reads including collection-group submissions query |
| Storage rules | Uses the custom-claim model for admin access to protected documents |
| `reviewSubmission` Function | Supports the aligned user-profile and custom-claim contract |

### Custom Claim Procedure

The script `scripts/set-admin-claim.cjs` is a one-time support tool. It requires a service-account JSON available locally but never committed. Set the claim only for the real admin UID, then have that user sign out and in to refresh the token.

The visible Firestore `users/{uid}.isAdmin = true` profile field remains an important operational check. Do not grant claims or profile admin status to a vendor test account.

## Firestore Query and Index Rules

### Collection Group Query

The Admin Verifications tab calls a `collectionGroup('verificationSubmissions')` query. This is not equivalent to querying a single vendor subcollection. It requires a recursive match in `firestore.rules`, for example:

```rules
match /{path=**}/verificationSubmissions/{submissionId} {
  allow read: if isSubmissionOwner() || isAdmin();
}
```

Use the project’s exact current rule implementation; do not copy broad example rules into production.

### Index Requirement

The filtered queue needs the collection-group single-field `status` index. Deployment alone is insufficient—confirm the Firebase Console state is **Enabled** before testing.

If Firestore reports an index requirement, read the exact error. A composite index and a single-field collection-group index solve different query shapes.

## Public Display Contract

| Surface | Required tier source | Expected display |
|---|---|---|
| Business Directory card | `businesses/{uid}.verificationTier` override, onboarding fallback | Tier-aware badge |
| Business Directory detail | Same as directory card | Tier-aware badge plus public actions as allowed |
| Vendor storefront | Business verification record/authoritative tier | High-contrast Verification panel showing Self-Declared, Community Verified, or Certified |
| Vendor Settings | Authoritative business tier | Verification Progress tracks approved promotion state |
| Member Dashboard | Authoritative business tier | Vendor sees current tier accurately |

No public surface may reveal document URLs, admin notes, reporter identity, user UID, email, or other private personal data.

## Troubleshooting Matrix

| Symptom | Likely owner | First checks |
|---|---|---|
| Upload blocked with `storage/unauthorized` | Storage rule/path/auth | Check actual upload path, active Storage rules, vendor UID, and claim requirement |
| Upload reaches 100% but submission waits | Callable Function availability/fallback | Check browser error, Function deployment/logs, and fallback Firestore write contract |
| Vendor cannot see Under Review after refresh | Firestore subcollection list rule/query | Confirm owner path access and submission status query |
| Admin queue is blank with permission denied | Firestore collection-group rule/admin authorization | Confirm recursive rule, admin profile/claim, deployed rules, and fresh session |
| Admin queue demands an index | `firestore.indexes.json` | Add exact index, deploy indexes, wait for **Enabled** |
| Admin queue shows no records but no browser error | Data/query/deployment mismatch | Inspect actual Firestore path/status, active data mode, and console logging |
| Admin can see item but review fails | Function authorization/deploy | Confirm `reviewSubmission` deployment and aligned `isAdmin`/role/claim behavior |
| Approval succeeds but public badge remains Tier 1 | Stale consumer data mapping | Confirm UI prefers `businesses/{uid}.verificationTier`; refresh/read current business record |
| Storefront badge appears unreadable | UI contrast/data state | Confirm tier value and use high-contrast `VerificationBadge`/storefront wrapper |

## Safe Change Procedure

1. Identify the affected tier and user role.
2. Map client read/write, Firestore path, Storage path, rule, index, and Function involvement.
3. Add a targeted regression test for the gap.
4. Change the smallest required layer(s).
5. Run full tests, production build, and Functions build if applicable.
6. Deploy only the changed Firebase surfaces.
7. Execute the vendor/admin/public end-to-end smoke test.
8. Update [`../features/verification-session2.md`](../features/verification-session2.md) and this document if operations changed.

## References

- [`ARCHITECTURE_AND_DATA.md`](ARCHITECTURE_AND_DATA.md)
- [`FIREBASE_OPERATIONS.md`](FIREBASE_OPERATIONS.md)
- [`TESTING_AND_QUALITY.md`](TESTING_AND_QUALITY.md)
- [`../features/verification-session2.md`](../features/verification-session2.md)
- [`../../src/services/verificationService.ts`](../../src/services/verificationService.ts)
- [`../../functions/src/index.ts`](../../functions/src/index.ts)
