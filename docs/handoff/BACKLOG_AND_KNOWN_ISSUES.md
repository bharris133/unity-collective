# Backlog and Known Issues

## How to Use This Backlog

This is a decision-oriented backlog, not an automatic implementation queue. Before beginning an item, confirm priority with the project owner, read [`../Guidelines.md`](../Guidelines.md), and trace the relevant architecture. Some entries are intentionally deferred because they need a product-design decision before code.

## Current Priority Queue

| Priority | Workstream | Status | Entry condition / next decision |
|---:|---|---|---|
| 1 | Transactional email redesign | Deferred | Hold a design discussion to select the simplest durable architecture before implementation |
| 2 | Final product name and rebrand | Awaiting owner decision | Confirm final name and clearance direction before changing product identity |
| 3 | Launch/community content refinement | Active strategic work | Define target communities, recruiting language, partners, and initial campaign content |
| 4 | Moderation display refinement | Ready when prioritized | Improve reporter/endorser context, readable names where safe, business context, and audit trail |
| 5 | Community offers/collaboration | Product expansion | Define posting, moderation, safety, and ownership workflow before implementation |
| 6 | Partner organization onboarding | Product expansion | Define organization roles, verification authority, permissions, and review workflow |
| 7 | Stripe Connect and tier-gated commercial features | Product expansion | Confirm business model, payment/payout responsibilities, compliance, and user experience |
| 8 | Load testing/performance hardening | Pre-broader-launch milestone | Run measured tests once functional scope is stable |
| 9 | Documentation consolidation | Ongoing | Keep current handoff docs accurate; archive/mark historical docs as needed |

## 1. Transactional Email Redesign

### Current State

The application contains SendGrid-oriented Functions, a callable `sendOrderEmailsCallable` path, and Firestore `emailLogs` infrastructure. Prior implementation attempts did not establish reliable end-to-end delivery. Do not describe order email as production-ready.

### Why It Is Deferred

The previous flow accumulated unnecessary complexity across client checkout, Functions, SendGrid configuration, secrets, logging, and unclear Stripe/webhook ownership. The next implementation must begin with an agreed event model rather than another incremental patch.

### Required Design Decisions

| Decision | Questions to answer |
|---|---|
| Trigger source | Is an email triggered at client-side order creation, verified payment confirmation, a Stripe event, or a Firestore event? |
| Event authority | What constitutes a completed order for buyer/vendor communication? |
| Delivery provider | Retain direct SendGrid Functions or move to a Firebase-compatible mail extension/queue pattern? |
| Templates | What buyer, vendor, admin, cancellation, and failure messages are required? |
| Idempotency | How are duplicate emails prevented on retries or multiple UI actions? |
| Observability | What exact status, provider response, recipient type, and retry state should be written to `emailLogs`? |
| Sender identity | Is the sending domain/mailbox authenticated and monitored? |

### Acceptance Criteria

A future email implementation is complete only after a controlled test order verifies buyer and vendor delivery, SendGrid/provider status, `emailLogs`, duplicate prevention, and failure visibility.

## 2. Final Brand and Rebrand

### Current State

The source and production identity are **Unity Collective**. **Black Jubilee** and `blkjubilee.com` are potential future branding, not final implementation instructions.

### Rebrand Scope When Approved

| Surface | Must be considered |
|---|---|
| Product UI | Navigation, homepage, About, footers, headings, onboarding, settings, admin labels |
| Web identity | Browser title, meta description, Open Graph data, favicon, structured data, canonical domain |
| Visual assets | Logo, mark, hero treatments, social assets, design tokens if needed |
| Operations | Firebase Hosting custom domain, redirect strategy, `FRONTEND_URL` secret/config, sender identity, domain registrar, analytics, search console |
| Communications | Email templates, support address, documentation, release notes, recruitment materials |
| Legal/business | Owner-led trademark/clearance decision and domain/handle ownership |

Do this as one deliberate project, with redirect and rollback planning—not a piecemeal find-and-replace.

## 3. Moderation Display Refinement — Completed

The Admin Moderation tab now presents business name, category, report reason, details, submission date, and privacy-safe member references. Endorsements include the available relationship and comment context. Dismiss and resolve actions record the acting administrator and decision timestamp, then appear in a visible Decision History view.

The implementation uses status-only Firestore filters and client-side sorting, avoiding untracked composite-index requirements. It does not perform broad client-side reads of private user profiles or expose personal profile data in the queue.

Future moderation changes should preserve this minimum-necessary identity model and extend the existing decision record rather than create a separate audit path without an approved data-contract change.

## 4. Community Offers / Collaboration

A community-offers feature exists in historical documentation, but its intended launch scope should be reconfirmed. Before expanding it, define:

- allowed post categories and visibility;
- moderation/reporting process;
- contact/privacy model;
- expiration and deletion behavior;
- anti-spam controls; and
- whether it is a marketplace, request board, or collaboration network.

## 5. Partner Organization Onboarding

This is a future verification and community-trust expansion. It may allow approved organizations—such as certifiers, chambers, or trusted business networks—to help onboard, endorse, or certify businesses.

Required pre-implementation decisions:

1. Organization data model and relationship to individual users.
2. Role and permission matrix.
3. Whether partner endorsements affect Tier 2 or Tier 3.
4. Evidence/audit requirements.
5. Revocation and dispute process.
6. Public disclosure of certifying organization.

## 6. Stripe Connect / Commercial Features

Stripe Connect is not currently part of the validated order flow. Consider it only after the owner decides:

- marketplace versus platform payment model;
- vendor payout responsibility;
- refunds/disputes and support process;
- connected-account onboarding;
- fee model;
- tax and compliance ownership; and
- relationship to verification tier.

This is an architectural and business-model decision, not a small checkout enhancement.

## 7. Performance and Load Testing

### Current State

The application is suitable for functional testing and early recruitment, but it has not received a formal multi-user load test.

### Planned Scenarios

| Scenario | Purpose | Possible hardening response |
|---|---|---|
| Directory browsing and search | Assess read rates, responsiveness, and card rendering | Pagination, cached filters, virtualized list |
| Verification uploads | Assess Storage authorization and concurrent submission behavior | Retry policy, upload limits, queue monitoring |
| Admin review queue | Assess collection-group query and review function response | Pagination, aggregate counts, audit/log monitoring |
| Marketplace/order actions | Assess order consistency and downstream logs | Idempotency, event queue, payment/email redesign |

Start with 25–50 concurrent users, collect evidence, and scale gradually. Do not add caching, databases, or infrastructure purely because they are common patterns.

## Known Operational Concerns

| Concern | Severity | Current response |
|---|---|---|
| Firestore indexes can block live queries | High if a new query is deployed without index configuration | Treat indexes as code, deploy explicitly, wait for Enabled, and test live |
| Firestore/Storage authorization can differ from mock behavior | High for Firebase-backed features | Run role-based live smoke tests after rules changes |
| Current email delivery is unvalidated | Medium/High depending on launch expectation | Design before implementation; do not overstate readiness |
| Historical documentation contains stale procedures | Medium | Use `docs/handoff/` as current operational truth; refresh/archive legacy guides over time |
| Firebase `BloomFilterError` was previously observed | Low, currently non-reproducible after Firebase SDK update | Monitor browser console; capture exact recurrence before changing cache behavior |
| Global credentials used during development | Security hygiene concern | Rotate aged/exposed tokens and keep all secrets out of docs/repo |

## Out-of-Scope Unless Explicitly Requested

- Broad refactoring of working UI merely for stylistic preference.
- Migration to another hosting/database framework.
- Replacing Firebase without a business/technical decision.
- Rewriting all historical documentation before a current handoff package exists.
- Production payment/payout changes without agreed financial/compliance model.

## References

- [`CURRENT_STATE.md`](CURRENT_STATE.md)
- [`TESTING_AND_QUALITY.md`](TESTING_AND_QUALITY.md)
- [`../ROADMAP.md`](../ROADMAP.md)
- [`../features/verification-session2.md`](../features/verification-session2.md)
