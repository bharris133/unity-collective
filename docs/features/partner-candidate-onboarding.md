# Partner Candidate Onboarding & Owner Claim

**Status:** **Private partner-candidate foundation implemented.** Candidate intake is live in source but requires a targeted Firebase deployment and controlled live QA before operational use. Invitations, owner claim, profile drafts, membership labels, analytics, badges, and AI assistance remain explicitly deferred.

**Last decision update:** October 15, 2026

> Read [`../Guidelines.md`](../Guidelines.md), [`../handoff/ARCHITECTURE_AND_DATA.md`](../handoff/ARCHITECTURE_AND_DATA.md), [`../handoff/FIREBASE_OPERATIONS.md`](../handoff/FIREBASE_OPERATIONS.md), and [`../handoff/TESTING_AND_QUALITY.md`](../handoff/TESTING_AND_QUALITY.md) before changing this feature. This feature is Firebase/Auth/Firestore/Cloud-Functions/email work—not a portal UI change alone.

---

## 1. Purpose and User Outcome

An approved local chamber or business association may create individual **candidate business records** or submit a controlled batch through a partner portal. The actual business owner remains in control:

1. The partner’s candidate record remains private.
2. Unity Collective sends a secure claim invitation only when the partner has authority to provide the contact and invite the candidate.
3. The recipient authenticates, accepts the invitation, reviews the partner-provided information, and chooses whether to participate.
4. The system creates a **private profile draft** prefilled from approved partner data.
5. The owner completes the normal public-profile requirements, makes their own Black-owned self-attestation, and explicitly publishes.
6. The public profile may then show **Self-Declared** Tier 1 and, separately, **Member of [Partner]** if the owner opts in to display that relationship.
7. The owner completes their profile and adds products through the established onboarding/dashboard/Store Settings experience.

This feature must never publish an unclaimed candidate, treat a partner roster as a verification decision, or set Tier 1 merely because a partner uploaded data.

---

## 2. Confirmed Product Decisions

| Decision | Contract |
|---|---|
| Initial partner type | A local chamber or association pilot, beginning in Chicago after Unity Collective confirms the organization’s official identity, approved representative, and agreement. “Sunshine Enterprise” is a discussion example only—not an approved production name, badge, or logo. |
| Partner portal access | Unity Collective provisions access only after a partner agreement, staff authorization, candidate-template training, and recorded training acknowledgement. There is no self-service partner signup. |
| Candidate entry | Authorized partner staff may create one candidate or upload multiple candidate rows using the approved template. |
| Candidate privacy | Every imported/created candidate is private until the actual business owner claims and publishes it. A candidate must not appear in the directory, storefront routes, search, public analytics, or public APIs. |
| Invitation | The system sends an opt-in/claim invitation from a server-owned, auditable workflow. A link by itself does not publish a profile or make a Tier decision. |
| Owner claim | The recipient must authenticate, accept the invitation, review/edit the profile data, and separately choose publication. Existing Unity Collective users sign in; new users create an account. |
| Tier 1 | Tier 1 means **Self-Declared**. It is set only after the owner personally affirms Black ownership in the existing/publicly understandable self-attestation step. Partner-uploaded data and email-link clicks do not establish this status. |
| Partner relationship label | Begin with the owner-opted-in text label **Member of [Partner]**. It has no tier effect and must disappear/reconcile when the relationship is inactive or revoked. |
| Partner certification | Out of scope for this release. Tier 3 remains Unity Collective human-admin review unless and until a later, separately approved partner-evidence/authority workflow exists. |
| AI reviewer assistance | Out of scope for this release. It follows the partner foundation and remains human-decision support only. |
| Products | Do not build a second product-entry system. After public-profile completion, direct owners to the existing dashboard/Store Settings product workflow and CSV uploader. |

---

## 3. Implemented Foundation (October 2026)

This repository now implements the intentionally narrow first slice: **private candidate intake only**. It is not a recruitment or invitation release.

| Implemented surface | Contract |
|---|---|
| Admin provisioning | An authenticated Unity Collective administrator can create one active partner organization and assign one existing Unity Collective account as organization-scoped staff only after recording the portal/template-training confirmation. A staff member cannot be silently reassigned while already active. |
| Partner Portal | `/partner-portal` displays organization-scoped operations to an active partner staff member. Administrators use its provisioning section from the account menu; an active staff member receives the Partner Portal menu link after signed-in access is confirmed. |
| Individual entry | Staff can create one candidate only after completing the required data fields and affirming that their organization is authorized to share the contact for the program. |
| CSV intake | Staff can download the approved eight-column template, preview row-level errors, and import only when every submitted row is valid and the same authorization acknowledgement is checked. |
| Server authority | The client uses callable Functions only. Direct Firestore access to partner organizations, staff assignments, and candidates is denied for every client, including administrators. |
| Privacy and tier boundary | Import creates only a private `partnerCandidates` record with status `private_ready`. It does not send an email, create an account, create a profile/onboarding/business record, publish a listing, change verification, endorse a business, or create products/orders. |

### 3.1 Current source map

| File | Responsibility |
|---|---|
| `src/pages/PartnerPortalPage.tsx` | Administrator provisioning UI and staff portal for individual/CSV candidate intake. |
| `src/services/partnerService.ts` | CSV parsing/validation and callable client contract. |
| `src/types/Partner.ts` | Shared candidate, organization, staff, template, and status types. |
| `functions/src/index.ts` | `provisionPartnerOrganization`, `getMyPartnerPortalAccess`, `listMyPartnerCandidates`, and `createPartnerCandidates`. |
| `firestore.rules` | No direct client access to partner collections. |
| `firestore.indexes.json` | `partnerCandidates` organization/email duplicate-check index. |
| `src/__tests__/pages/PartnerPortalPage.test.tsx` | Portal authorization-acknowledgement and private-entry behavior. |
| `src/__tests__/services/PartnerService.test.ts` | Template and row validation behavior. |
| `src/__tests__/partner/PartnerFoundationAuthorization.test.ts` | Private-rule, scoped-function, and no-public-write contract. |

### 3.2 Current operational limitation

The portal deliberately tells staff that **invitation delivery is not enabled**. Do not use a `private_ready` record as proof that an owner has been contacted, accepted participation, joined Unity Collective, self-attested, or become public. Proceed to invitation/claim work only after the deferred transactional-email architecture is approved.

---

## 4. Required Terminology

Use the following terms consistently in UI, email, support material, code, and logs.

| Term | Meaning | Do not call it |
|---|---|---|
| **Partner organization** | An approved chamber/association with a recorded agreement and authorized staff. | An admin, certifier, or platform owner. |
| **Candidate** | A private business record supplied by an authorized partner. | A live listing, vendor, verified business, or member of Unity Collective. |
| **Invitation** | A time-limited, one-use claim request sent to the candidate contact. | Account approval, public listing, or verification. |
| **Owner claim** | An authenticated owner accepts the invitation and associates it with their account. | Automatic enrollment. |
| **Profile draft** | Private prefilled information available only to the claimed owner and authorized operational roles. | A public storefront or directory listing. |
| **Publish** | The owner explicitly makes a completed business profile available to the public. | Accept invitation. |
| **Self-Declared** | Tier 1 after the owner personally attests to Black ownership. | Partner verified, certified, or guaranteed. |
| **Member of [Partner]** | Optional, owner-approved public relationship label; no tier effect. | Verified by [Partner]. |

---

## 5. Lifecycle and State Machine

### 5.1 Candidate lifecycle

```text
partner entry / CSV row
→ validated private candidate (`private_ready` — implemented foundation endpoint)
→ invitation queued (future)
→ invitation sent
→ claim page opened
→ claimed by authenticated owner
→ private profile draft created
→ owner reviews/edits and completes public-profile requirements
→ owner self-attests (Tier 1 eligibility)
→ owner chooses Publish
→ published business profile

Alternative outcomes:
- import rejected / needs partner correction
- duplicate needs manual resolution
- invitation delivery failed
- invitation expired
- invitation revoked
- candidate declined
- candidate claim abandoned
```

### 5.2 Publication rule

> **No candidate record, invitation, draft profile, or partner relationship is public until the owner explicitly publishes a completed profile.**

The current directory reads from `onboarding/{uid}`. Since every onboarding record can currently be surfaced by the directory service, this feature must not write a candidate’s incomplete/pre-consent data into the public `onboarding` collection as a shortcut.

**Design rule:** Store partner-candidate and pre-claim data in private partner/claim records. Create the public-facing onboarding/business records only after the owner completes the publish path—or first change the directory’s publication filter/rules as part of a specifically reviewed data-contract migration.

### 5.3 Tier rule

```text
Partner creates/loads candidate
→ no public tier
Owner claims candidate
→ no public tier
Owner accepts public participation and personally checks Black-owned self-attestation
→ Tier 1 / Self-Declared is eligible
Owner publishes complete profile
→ public profile may display Self-Declared and optional Member of [Partner]
```

Do not write `businesses/{uid}.verificationTier`, invoke `updateTrustScore`, or create a Tier 3 verification submission during candidate import or invitation acceptance.

---

## 6. Roles and Permissions

| Role | May do | Must not do |
|---|---|---|
| Unity Collective administrator | Approve/suspend partner organization, authorize staff, view all partner/audit records, resolve duplicate/claim disputes, revoke portal access, and retain current Tier 3 authority. | Publish a candidate without owner action; expose private candidate/contact data publicly. |
| Authorized partner staff | Create candidates, upload approved CSVs, correct import errors, view only their organization’s private operational statuses, and initiate invitations. | Browse other partners, change owner-approved public profiles, read unrelated private documents, set a verification tier, or access orders/reports/endorsements. |
| Candidate / business owner | Claim invitation, review/edit prefilled data, accept/decline participation, self-attest, publish, manage public profile and products, and opt into/out of public partner membership display. | See other candidates or partner operations; bypass required owner confirmation/self-attestation. |
| Public visitor | View only published business information, public tier, and owner-approved partner membership label. | View candidate, invitation, contact, audit, document, or private partner data. |

Partner permissions must be organization-scoped and least-privilege. Do not reuse the broad admin role/claim for partner staff.

---

## 7. Partner Setup, Training, and Candidate Template

### 7.1 Partner setup prerequisites

Before enabling a partner portal account, Unity Collective must record:

1. official organization name and authorized representative;
2. active agreement/version and scope of permitted candidate data;
3. approved staff identities and organization-scoped roles;
4. confirmation that staff completed portal/template training;
5. current candidate-template version; and
6. public-label wording/brand permission, if the partner relationship will ever be displayed.

Portal access must be revocable immediately when the agreement, staff authorization, or training status becomes invalid.

### 7.2 Candidate upload template: minimum data

The first CSV template should collect only what is necessary to invite and prefill a draft.

| Column | Required? | Purpose / constraint |
|---|---:|---|
| `business_name` | Yes | Candidate business name; owner can correct it after claim. |
| `primary_contact_name` | Yes | Used only for a respectful invitation; never public. |
| `contact_email` | Yes | Invitation destination; partner must be authorized to provide it for this program purpose. Never public. |
| `city` | Yes | Prefill public business location after owner review. Do not require a street address. |
| `state` | Yes | Prefill public business location after owner review. |
| `category` | Optional | Must map to a current Unity Collective category or be corrected before import. |
| `website` | Optional | Owner must confirm before public display. |
| `partner_member_id` | Optional | Partner-private reference; never public. |
| `partner_notes` | No in MVP | Do not accept free-form internal notes in the initial template; they create privacy/moderation risk. |
| `Black-owned status`, certificates, documents, race/ethnicity fields | **No** | Not appropriate candidate-import evidence and never a substitute for owner self-attestation or later certification. |

### 7.3 Import validation

The portal must validate and report row-level errors before invitations are created:

- required business/contact/email/location fields;
- normalized email format;
- allowed category mapping;
- duplicate candidate email + business-name checks within the file;
- existing claimed owner/business match checks;
- existing active invitation checks;
- partner organization authorization;
- template version;
- explicit partner acknowledgement that it has authority to provide each contact and send the program invitation.

**Duplicate rule:** do not automatically merge records based on fuzzy name/location matching. Flag potential matches for an authorized Unity Collective administrator to resolve.

---

## 8. Invitation, Claim, and Email Workflow

### 8.1 Email is a prerequisite, not a UI afterthought

This feature requires at least two transactional email types:

1. `partner_candidate_invitation`
2. `partner_candidate_claimed_welcome`

The current SendGrid order-email path and `emailLogs` observability are not end-to-end validated. Do **not** reuse the client-callable order-email function as a shortcut for partner invitations. Before feature implementation, the project needs a focused transactional-email design that specifies:

- server-side trigger authority;
- provider/sender-domain readiness;
- durable delivery status and error logging;
- idempotency/deduplication keys;
- retry/resend policy;
- template versioning;
- recipient data-minimization;
- provider failure handling; and
- controlled inbox delivery testing.

A partner must never see an invitation as “sent” merely because a client clicked a button. The portal should distinguish **queued**, **accepted by provider**, **delivery failed**, **expired**, **revoked**, and **claimed** states.

### 8.2 Secure invitation contract

The invitation flow must use a server-generated, opaque, random, one-time token:

- store only a hash of the token in Firestore;
- place the token only in the HTTPS claim URL sent to the intended recipient;
- expire it after a product-approved lifetime (recommended initial value: 14 days);
- invalidate it after successful claim, revocation, or replacement/resend;
- rate-limit creation/resend attempts;
- never expose a token in logs, analytics, UI screenshots, or public data;
- require sign-in/account creation before the owner accepts the invitation; and
- record invitation/claim timestamps and acting user identifiers in private audit data.

A click can display the claim information but cannot by itself create a public profile, link arbitrary accounts, or grant Tier 1.

### 8.3 Claim workflow

```text
Candidate receives invitation email
→ opens secure claim URL
→ sees partner name, candidate business name, participation explanation, and privacy notice
→ signs in or creates a Unity Collective account
→ account is checked for a valid invitation claim
→ owner explicitly accepts or declines
→ server atomically marks invitation claimed and creates private profile draft/prefill
→ system queues one welcome/next-steps email idempotently
→ owner completes profile, self-attests, and chooses publish
```

For an existing Unity Collective user, the flow must protect against claiming a candidate intended for a different person. Show only the minimum candidate information before authenticated claim confirmation and provide an escalation path for a mistaken invitation.

### 8.4 Proposed candidate invitation copy

**Subject:** `Sunshine Enterprise invited [Business Name] to the Unity Collective Business Accelerator`

> Sunshine Enterprise has recommended **[Business Name]** for the Unity Collective Business Accelerator.
>
> Participation is your choice. No business profile will be public until you sign in, review the information, make your own choices, and choose to publish.
>
> To review the invitation and decide whether to participate, use the secure link below.
>
> **[Review invitation]**
>
> This invitation expires on [date]. If you were not expecting it or do not want to participate, you may decline it. For support, contact [approved support path].

The actual sender name, partner name, support destination, privacy/terms links, and wording require review before launch. Use the partner’s approved legal/public name; do not use “Sunshine Enterprise” in production until confirmed.

### 8.5 Proposed post-claim welcome copy

**Subject:** `Your Unity Collective business profile draft is ready`

> Your private business profile draft has been created from the information shared by **[Partner]**.
>
> Next, review and complete your business profile, make your own Black-owned self-attestation if applicable, and choose when to publish your listing. Once published, you can manage products through your dashboard and Store Settings.
>
> **[Complete your profile]**
>
> A public profile is not created merely by accepting this invitation. If you choose to display your relationship with [Partner], the public label will read **Member of [Partner]**. This label does not change your verification tier.

Avoid the misleading statement “your business profile has been added” without the word **private draft**. It could imply a public listing before the owner has approved it.

---

## 9. Data-Ownership and Security Direction

The exact schema must be approved before coding. The conceptual separation below prevents private candidate data from entering the public directory prematurely.

| Conceptual path | Privacy / owner model | Notes |
|---|---|---|
| `partnerOrganizations/{partnerId}` | Server-managed; no direct client reads/writes | Active agreement/version and organization configuration. Public display fields must be deliberately separated. |
| `partnerStaff/{uid}` | Server-managed; UID maps to exactly one active organization in this first slice | Scoped staff role/status; do not grant global admin. |
| `partnerCandidates/{candidateId}` | Server-managed; callable Functions filter by staff organization | Private candidate lifecycle. Must never be publicly readable. |
| `partnerInvitations/{inviteId}` | Backend/owner-claim handling only | Token hash, delivery/expiry/revocation/claim status. Never public or directly editable by partner/client. |
| `partnerClaims/{claimId}` or owner-scoped claim record | Claimed owner plus authorized operations | Associates candidate with Firebase Auth UID and preserves audit history. |
| `partnerMemberships/{membershipId}` | Owner-controlled relationship record; constrained partner/admin access | Supports optional **Member of [Partner]** display. |
| `onboarding/{uid}` | Current public-business profile source after completed owner publish | Do not create this solely from a partner upload unless directory publication behavior is safely redesigned. |
| `businesses/{uid}` | Current public override/authoritative tier source | Preserve existing Tier 2/Tier 3 authority. Do not set tier from partner import. |
| email delivery/audit collection | Server-written/private operational data | Must use a generalized, restricted email-event contract—not order-only log semantics. |

### Privacy boundary

Never expose on public storefronts/directory:

- partner-provided contact email/name;
- candidate/invite/claim status;
- private partner IDs or internal status;
- invitation tokens or claim URLs;
- staff identities/training records;
- email-provider responses or delivery logs;
- audit notes; or
- documents or later AI-assistance data.

---

## 10. Required Application Layers

Implementation will likely affect all of the following. Confirm the exact files/paths before editing; this list is a design map, not permission to make broad changes.

| Layer | Anticipated responsibility |
|---|---|
| Partner portal pages/components | Candidate list, individual entry, CSV validation/import review, invitation status, restricted operational reporting. |
| Candidate claim page | Token-safe invitation display, authentication handoff, accept/decline confirmation, owner prefill handoff. |
| Auth/context and signup UI | Existing-user/new-user claim path, preserving invitation intent across authentication without trusting client-only state. |
| Onboarding / vendor settings | Apply private prefill after claim; retain owner editing, self-attestation, publication, and current product workflow. |
| Domain services/types | Partner organization/staff/candidate/invitation/claim/membership contracts; no direct scattered Firestore access in UI. |
| Cloud Functions | Partner authorization, candidate create/import, token generation/validation, claim atomicity, email outbox/triggering, audit writes, and safe error handling. |
| Firestore rules/indexes | Organization-scoped partner queries, owner claim visibility, admin oversight, private collections, and exact required indexes. |
| Storage rules | Not part of initial candidate import. Review separately before adding partner evidence/documents. |
| Email provider/secret operations | Transactional template/provider/idempotency implementation after the email architecture is approved. |
| Public directory/storefront/badges | Published-profile filtering and owner-approved membership label only; preserve `businesses/{uid}.verificationTier` precedence. |
| QA fixtures / acceptance guide | Add deterministic partner/staff/candidate roles and bounded cleanup only after the final schema is stable. |

---

## 11. What Is Explicitly Out of Scope

Do not quietly include the following in the initial partner candidate release:

- partner-issued Tier 3 certification;
- partner evidence document uploads;
- partner access to Tier 3 documents or admin verification queue;
- AI reviewer assistance or external AI/public-web scans;
- automatic verification tiers, trust-score changes, endorsements, or public ranking changes;
- co-branded logo badge or “Verified by [Partner]” language;
- website-traffic/click analytics beyond defined operational invitation/claim counts;
- Stripe Connect, marketplace payment/payout changes, or discounts;
- public partner candidate search/directory pages;
- bulk products or product publishing by partners; and
- sending any email from client code or treating an email provider API acceptance as confirmed inbox delivery.

These are separate feature decisions and must not be merged into the candidate onboarding PR.

---

## 12. Success Criteria

### Automated / contract checks

- Unauthorized users cannot access a partner portal, candidate, invitation, claim, or organization-scoped query.
- Authorized partner staff can access only their own organization’s records.
- Invalid CSV data is rejected before candidate creation, with precise row-level errors.
- Duplicate policy prevents another private candidate with the same contact within the same partner organization.
- A candidate record remains unavailable to public business directory/storefront queries.
- No partner/candidate email, internal ID, or operational data renders publicly.
- Future invitation, claim, membership, and email criteria remain required before those capabilities are enabled.

### Manual / controlled live QA checks

Use only fixture-owned, synthetic partner/candidate data after the stable schema is implemented.

1. Unity admin provisions one synthetic QA partner and a pre-created synthetic QA staff account.
2. The QA staff member signs in at `/partner-portal`, creates one candidate after acknowledging contact authority, and sees it in only their private list.
3. The QA staff member uploads a harmless valid CSV and sees a successful private import.
4. Invalid/duplicate CSV rows fail safely without creating a candidate or public listing.
5. A regular user and unauthenticated visitor cannot access partner data. A public directory search cannot find the candidate.
6. Verify no `onboarding`, `businesses`, products, orders, endorsements, reports, or email records were created by intake.
7. Reset only fixture-owned records through a future manifest-gated extension; no real candidate, partner, user, or email data is touched.

---

## 13. Deployment and Operational Requirements

Expected Firebase deployment surfaces depend on the final implementation:

| Changed surface | Expected targeted deployment |
|---|---|
| Current private candidate foundation | `firebase deploy --only firestore:rules,firestore:indexes,functions,hosting --project unity-collective` |
| Firestore rules | `firebase deploy --only firestore:rules --project unity-collective` |
| New Firestore indexes | `firebase deploy --only firestore:indexes --project unity-collective`, then wait for **Enabled** |
| Cloud Functions / transactional email | `firebase deploy --only functions --project unity-collective` |
| Storage (only if later evidence uploads require it) | `firebase deploy --only storage --project unity-collective` |

Do not run a blind full deploy. Do not approve index/resource deletion prompts without reconciling configuration to every dependent query.

Minimum pre-deploy validation:

```bash
pnpm test --run
pnpm run build
pnpm --dir functions run build  # when Functions change
```

Then run role-based controlled live QA with synthetic records, recipient mailboxes, and a verified reset result.

---

## 14. Open Decisions Required Before the Next Slice

The following questions materially affect user experience, permissions, data contracts, and email behavior. Do not silently assume answers.

1. **Invitation authority and contact consent:** Does the partner contract require an affirmative certification that each submitted email may receive this program invitation from Unity Collective/its partner? **Recommendation: yes, recorded per import.**
2. **Initial email architecture:** Approve a focused transactional-email design for partner invitations/welcome emails before coding, rather than extending the unvalidated order-email path. **Recommendation: yes.**
3. **Publication timing:** Should a claimed owner need to click a distinct **Publish profile** action after completing required fields and self-attestation? **Recommendation: yes.** This is the clearest protection against an accidental public profile.
4. **Owner account flow:** Should an existing Unity Collective account be able to claim if its verified email differs from the candidate email, with manual escalation? **Recommendation: require an admin-assisted exception in v1.**
5. **Invite lifecycle:** Confirm token lifetime and resend policy. **Recommendation: 14-day expiry; one active invite; resend invalidates the prior link; partner/admin can revoke.**
6. **Membership label consent:** Confirm that showing **Member of [Partner]** is a separate owner-controlled choice from accepting the overall accelerator invitation. **Recommendation: yes.**
7. **Candidate fields:** Confirm the minimal initial CSV columns and whether the partner sends its own invitation first, Unity Collective sends directly, or both under a documented consent rule.
8. **Support path:** Confirm the production support inbox/form and accountable reviewer for wrong recipient, duplicate, and claim-dispute cases before live email is enabled.
9. **Partner scope:** Confirm the exact formal name, staff roles, agreement scope, and permission to use any organization branding before configuring the first partner.

---

## 15. Safe Change Procedure and Debugging Guide

### Before changing code

1. Read this guide and the current handoff documents listed at the top.
2. Map the entire action path: portal UI → client service → callable/backend → Firestore paths → rules/indexes → email provider/outbox → claim page → owner profile/public directory.
3. Identify the authoritative privacy/publication source. Do not assume `onboarding/{uid}` can safely hold incomplete partner data.
4. Confirm whether the change affects Tier 1 wording, partner membership display, email dispatch, or publication state.
5. Add a focused automated test first where practical.

### When debugging

| Symptom | First checks |
|---|---|
| Partner sees no candidates | Organization membership/role, organization-scoped query shape, Firestore rule, index, and active status. |
| Candidate appears publicly before owner publish | Audit public directory source/filter and candidate/onboarding writes immediately; treat as a privacy defect. |
| Invitation shows sent but inbox is empty | Email outbox/provider status, sender-domain authentication, recipient address, actual provider response, spam/junk folder, and idempotency record. |
| Claim link fails | Token hash/expiry/revocation/use state, authenticated account, invitation ownership condition, Function logs, and CORS. |
| Duplicate private profile or welcome email | Atomic claim/idempotency key/transaction behavior; do not manually delete around the incident. |
| Tier 1 appears after claim without owner declaration | Trace write ownership; remove the improper automatic tier write and add a regression test. |
| Public membership badge is wrong | Owner opt-in state, active partner/membership status, label mapping, revocation state, and public view mapping. |

Never weaken Firestore rules, manually publish a candidate, expose email logs/tokens, or bypass an owner’s self-attestation to resolve a test failure.
