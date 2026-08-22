# Current State

**Repository:** `bharris133/unity-collective`  
**Primary branch:** `main`  
**Deployment platform:** Firebase Hosting, Firestore, Storage, and Cloud Functions (Gen 2)  
**Current automated baseline:** **181 passing tests across 20 test files**  
**Current frontend dependency baseline:** Firebase Web SDK `^12.17.1`, Node.js 20 for Functions, pnpm `10.4.1` for the root project.

## Product Position

Unity Collective is a Black-owned business directory and marketplace with a dark Pan-African visual identity. It helps shoppers discover businesses and products, enables vendors to onboard and manage storefronts, and differentiates the directory through a three-tier verification model.

The public product language emphasizes group economics, conscious consumerism, community accountability, verified trust, and generational impact. The platform must never expose a vendor’s personal profile data on a public storefront.

## Brand Decision Status

| Item | Status | Instruction |
|---|---|---|
| **Unity Collective** | Current implemented product name | Preserve in source and production unless the owner authorizes a coordinated rebrand |
| **Black Jubilee / `blkjubilee.com`** | Proposed future brand candidate | Record as a candidate only; do not use in code, metadata, email identity, DNS, or public assets until final owner approval and appropriate clearance |
| Pan-African dark theme | Active visual standard | Preserve `#111111` background, `#1E1E1E` surfaces, and gold `#D4AF37` as the core palette unless a user-approved design change says otherwise |

## Completed Core Functionality

| Area | Current behavior | Operational notes |
|---|---|---|
| Authentication and profiles | Firebase-backed login plus editable `/profile` fields and avatar upload | Admin access also depends on Firebase user profile fields and/or a custom claim; see [`FIREBASE_OPERATIONS.md`](FIREBASE_OPERATIONS.md) |
| Vendor onboarding | Multi-step onboarding records vendor business information | `onboarding/{uid}` remains the primary source for public business profile content |
| Store settings | Vendors can manage logo, business overrides, products, CSV upload, and Tier 3 document submission | Public profile data must remain business-only |
| Public storefront | `/vendors/:uid` presents business details, products, verification, endorsement, and reporting controls | High-contrast verification display now reflects the authoritative business tier |
| Business Directory | `/directory` lists live Firestore business data and routes to business detail | `businesses/{uid}.verificationTier` overrides onboarding tier for accurate public status |
| Marketplace and orders | Marketplace checkout creates orders and exposes vendor/user order flows | The checkout is custom; `stripeSessionId` has historically been blank, so webhook order creation is not the active order-creation path |
| CSV products | Vendor product upload with a downloadable template | Validate product display after schema changes |
| Email observability | `emailLogs` collection and UI activity sections exist | End-to-end delivery is deferred; do not represent email as launch-validated |
| Education | Homepage, About, and Education content are seeded | Content expansion and partnership curation remain active product work |
| Reporting and endorsements | Authenticated users can report or endorse public businesses; admin moderation reads both queues | Queries avoid Firestore composite-index dependence by sorting client-side where appropriate |
| Tier 1–3 verification | Full vendor submission and admin review flow is working end-to-end | See [`VERIFICATION_OPERATIONS.md`](VERIFICATION_OPERATIONS.md) |

## Tier Verification Status

| Tier | Label | Entry condition | Public meaning |
|---:|---|---|---|
| 1 | **Self-Declared** | Vendor selects the Black-owned affirmation during onboarding | The business has self-identified as Black-owned |
| 2 | **Community Verified** | Trust/endorsement threshold reaches three qualifying endorsements | The business has received community support under the platform’s rules |
| 3 | **Document Certified** | Vendor uploads documentation and an authorized admin approves it | The business has passed document review |

> **Authoritative contract:** `businesses/{uid}.verificationTier` is the authoritative tier after Tier 2 or Tier 3 promotion. Any user-facing display combining onboarding and business data must prioritize the `businesses` value over `onboarding/{uid}.verificationTier`.

## Recently Validated Production Flow

The following flow has been exercised manually in production:

```text
Vendor uploads Tier 3 document
→ submission is stored under businesses/{uid}/verificationSubmissions
→ vendor sees Under Review
→ admin sees pending submission, opens document, and approves
→ business verification tier becomes 3
→ vendor sees Approved / Tier 3
→ directory and storefront show Certified
```

The Firebase Web SDK was upgraded to `12.17.1` after a non-blocking Firestore `BloomFilterError` was observed during testing. The error did not recur during subsequent verification testing. Continue monitoring browser console output, but do not treat this as an open functional blocker without a reproducible recurrence.

## Active Product Priorities

| Priority | Workstream | Current decision |
|---:|---|---|
| 1 | Email notifications | Hold a design discussion first; simplify the buyer/vendor notification architecture before implementation |
| 2 | Final product name and rebrand | Await owner decision; plan a single coordinated rebrand rather than piecemeal copy changes |
| 3 | Community launch content | Refine recruitment and partnership content around the identified Black-owned business communities |
| 4 | Moderation refinement | Improve readable reporter/endorser identity, business context, and audit history |
| 5 | Community collaboration / offers | Evaluate and refine as a distinct engagement workflow |
| 6 | Partner organization onboarding | Future work for certifiers, chambers, and trusted organizations |
| 7 | Stripe Connect / tier-gated commercial features | Future expansion after core marketplace validation |
| 8 | Performance hardening | Conduct load tests and add pagination, aggregation, alerting, or caching based on measurements |

## Non-Blocking Known Follow-Ups

| Topic | Current state | Do not do without a plan |
|---|---|---|
| Email delivery | Code and logging infrastructure exist, but delivery has not been validated end-to-end | Do not add more SendGrid/Function complexity without agreeing on the target design |
| Historical docs | Many older docs describe mock-only or earlier architecture | Do not blindly follow old setup, deployment, or test counts; use this package first |
| Firestore query design | The project has repeatedly encountered missing-index failures | Before using `where` plus `orderBy`, explicitly decide whether to add/deploy the required index or fetch/filter then sort client-side |
| Admin authority | Admin checks support the `users/{uid}.isAdmin` profile field, legacy `role: 'admin'`, and custom `admin` claim in the relevant paths | Do not change one layer only; rules, functions, and client behavior must remain aligned |
| Credentials | Existing GitHub and Firebase credentials have been used during development | Rotate exposed/aged tokens; never place actual credentials in repository docs |

## Success Standard for Future Changes

A future change is not complete merely because the UI renders. It is complete when:

1. The relevant owner data source has been identified.
2. Firestore/Storage rules and required indexes support the new query or write.
3. Frontend and Functions behavior are aligned when both are involved.
4. New or updated automated tests pass.
5. The project builds, and Functions type-check if Functions changed.
6. The correct Firebase deployment surface is selected and a live smoke test is documented.

## References

- [`../Guidelines.md`](../Guidelines.md)
- [`ARCHITECTURE_AND_DATA.md`](ARCHITECTURE_AND_DATA.md)
- [`VERIFICATION_OPERATIONS.md`](VERIFICATION_OPERATIONS.md)
- [`BACKLOG_AND_KNOWN_ISSUES.md`](BACKLOG_AND_KNOWN_ISSUES.md)
