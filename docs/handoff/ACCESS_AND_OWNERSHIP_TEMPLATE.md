# Access and Ownership Register Template

## Purpose

Use this document to preserve operational continuity **without recording credentials**. It identifies accountable owners, approved access paths, recovery contacts, and rotation expectations for every critical service.

> **Never add secret values here.** Do not record tokens, passwords, service-account JSON contents, API keys, recovery codes, private-key material, or screenshots containing them. Store secrets only in an approved password manager, identity provider, Firebase Secret Manager, or other owner-controlled secure location.

## Completion Instructions

The project owner or authorized operator should complete the tables below outside public Git history if names/contact details are sensitive. A future agent may read this document to know which access must be requested, but should never ask to persist credential values in source control.

## System Ownership Matrix

| System | Purpose | Account owner | Backup owner | Approved access location | Rotation / renewal cadence | Recovery procedure documented? |
|---|---|---|---|---|---|---|
| GitHub repository | Source code, PRs, releases | `<owner>` | `<backup>` | `<password manager / GitHub org>` | PATs at expiration or exposure | `<yes/no>` |
| Firebase project `unity-collective` | Auth, Firestore, Storage, Functions, Hosting | `<owner>` | `<backup>` | `<Google account / org>` | Review access quarterly | `<yes/no>` |
| Firebase service account | Admin claim and server administration | `<owner>` | `<backup>` | `<secure vault>` | Rotate after use/exposure or policy interval | `<yes/no>` |
| Firebase Secret Manager | Function secrets | `<owner>` | `<backup>` | `<Firebase Console / vault>` | Per secret policy | `<yes/no>` |
| Stripe | Payment configuration | `<owner>` | `<backup>` | `<Stripe Dashboard>` | Rotate/review keys by policy | `<yes/no>` |
| SendGrid | Transactional delivery | `<owner>` | `<backup>` | `<SendGrid Dashboard>` | Rotate API key after exposure or role change | `<yes/no>` |
| Domain registrar | Primary/custom domains | `<owner>` | `<backup>` | `<registrar account>` | Review renewal and MFA quarterly | `<yes/no>` |
| Hostinger/mailbox | Sender mailbox and domain email | `<owner>` | `<backup>` | `<Hostinger control panel>` | Review access/MFA quarterly | `<yes/no>` |
| Analytics/search tools | Launch monitoring and SEO | `<owner>` | `<backup>` | `<tool dashboard>` | Review access quarterly | `<yes/no>` |

## Firebase Operational Register

| Item | Record securely, not in Git |
|---|---|
| Firebase project ID | `unity-collective` |
| Approved admin user UIDs | `<list in secure owner record>` |
| Admin profile requirement | `users/{uid}.isAdmin = true` |
| Custom-claim procedure owner | `<owner>` |
| Service-account key location | `<secure vault reference>` |
| Function secret names | `SENDGRID_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `FRONTEND_URL` |
| Secret owner and last rotation date | `<secure owner record>` |
| Production Hosting URL(s) | `<record current domains>` |
| Storage bucket | `unity-collective.firebasestorage.app` |

## GitHub Token Hygiene

| Rule | Required practice |
|---|---|
| Scope | Prefer fine-grained tokens limited to `unity-collective` with only required repository permissions |
| Permission baseline | Contents read/write, Pull requests read/write, metadata read-only |
| Expiration | Use a short, documented expiration appropriate to the operator workflow |
| Exposure | Revoke immediately if pasted into a chat, commit, terminal screenshot, ticket, or untrusted environment |
| Handoff | Give an agent access through an approved connector/session where possible; do not place a token in a project file |
| Audit | Record token owner, purpose, creation, and expiration date in secure owner records |

## Agent Access Protocol

| Situation | Required owner action |
|---|---|
| Agent needs source access | Grant repository access or attach the repository/project; do not share broad account credentials |
| Agent needs Firebase read-only inspection | Use an approved operator/browser session or provide non-secret project configuration context |
| Agent needs production deployment | Explicitly authorize the exact deployment surface and ensure the operator account has access |
| Agent needs a service secret | Do not paste it into chat. Prefer configured secret management or have the owner execute the secret-bound command locally |
| Agent needs admin testing | Provide a non-production/admin test user only where appropriate; never grant real users broad admin permissions for convenience |

## Rebrand/DNS Register

When the final product name/domain is chosen, document:

| Item | Record |
|---|---|
| Approved public name | `<name>` |
| Primary domain | `<domain>` |
| Defensive/redirect domains | `<domains>` |
| Registrar and renewal date | `<record securely>` |
| DNS owner | `<owner>` |
| Firebase custom-domain status | `<pending / verified / live>` |
| Email sender-domain status | `<pending / verified / live>` |
| Redirect plan | `<old domain → new domain>` |
| Trademark/clearance decision owner | `<owner/advisor>` |

## Access Review Checklist

Conduct this review before a major launch, staff/agency change, or quarterly:

- [ ] Every critical system has a primary and backup owner.
- [ ] MFA is enabled for GitHub, Google/Firebase, Stripe, SendGrid, registrar, and email hosting.
- [ ] Former collaborators no longer have production access.
- [ ] Personal access tokens and service-account keys have known owners and expiration/rotation dates.
- [ ] Firebase secrets exist by name and the current Function deployment can access them.
- [ ] The domain registrar auto-renewal and recovery contact are confirmed.
- [ ] Production deploy rights are restricted to approved operators.
- [ ] No credentials appear in Git history, docs, test fixtures, screenshots, or project files.

## Related Files

- [`FIREBASE_OPERATIONS.md`](FIREBASE_OPERATIONS.md)
- [`DEPLOYMENT_AND_ROLLBACK.md`](DEPLOYMENT_AND_ROLLBACK.md)
- [`AGENT_OPERATING_GUIDE.md`](AGENT_OPERATING_GUIDE.md)
