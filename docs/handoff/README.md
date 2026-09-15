# Unity Collective — Cross-Agent Handoff Package

**Purpose:** This directory is the current operational handoff for advanced coding agents and technical collaborators working on Unity Collective. It is designed for Manus, Claude Code, Codex, Kimi, and similar agents that need to become productive quickly without relying on stale historical documentation.

> **Working product name:** **Unity Collective** remains the implemented name in source, configuration, and production. **Black Jubilee** is a proposed future brand, not an approved or implemented rebrand. Do not rename code, domains, sender identities, metadata, or assets until the owner explicitly confirms a final brand decision and appropriate clearance has been completed.

## Mandatory Reading Gate

Every agent **must read [`../Guidelines.md`](../Guidelines.md) before proposing or changing code.** It is the project’s non-negotiable operating standard: clarify assumptions, prefer the smallest correct change, avoid opportunistic refactors, and define verifiable success criteria.

After `Guidelines.md`, use this order:

| Order | Read | Use it for |
|---:|---|---|
| 1 | [`CURRENT_STATE.md`](CURRENT_STATE.md) | Product status, completed functionality, active decisions, and deferred work |
| 2 | [`ARCHITECTURE_AND_DATA.md`](ARCHITECTURE_AND_DATA.md) | Application layers, data model, authoritative data contracts, and security boundaries |
| 3 | [`FEATURE_CATALOG.md`](FEATURE_CATALOG.md) | Feature-to-source/test map for the area you are about to change |
| 4 | [`LOCAL_SETUP.md`](LOCAL_SETUP.md) | Clean setup, package installation, environment modes, and local run commands |
| 5 | [`TESTING_AND_QUALITY.md`](TESTING_AND_QUALITY.md) | Required automated, manual, permission, and production validation gates |
| 6 | [`AGENT_OPERATING_GUIDE.md`](AGENT_OPERATING_GUIDE.md) | Branch, PR, deployment, safety, and communication workflow |
| 7 | Read the task-specific guide | Use [`VERIFICATION_OPERATIONS.md`](VERIFICATION_OPERATIONS.md) for Tier 1–3 verification work, or the appropriate feature doc under [`../features/`](../features/) |
| 8 | [`BACKLOG_AND_KNOWN_ISSUES.md`](BACKLOG_AND_KNOWN_ISSUES.md) | Confirm whether the requested work is active, deferred, or intentionally out of scope |

Read [`FIREBASE_OPERATIONS.md`](FIREBASE_OPERATIONS.md) and [`DEPLOYMENT_AND_ROLLBACK.md`](DEPLOYMENT_AND_ROLLBACK.md) **before any live Firebase, Functions, Storage, or Hosting deployment**.

## Package Contents

| Document | Scope |
|---|---|
| [`CURRENT_STATE.md`](CURRENT_STATE.md) | Current product, feature, release, and strategic status |
| [`ARCHITECTURE_AND_DATA.md`](ARCHITECTURE_AND_DATA.md) | Application layers, Firestore model, data ownership, and integration map |
| [`FEATURE_CATALOG.md`](FEATURE_CATALOG.md) | Feature-to-source/test map for the area you are about to change |
| [`LOCAL_SETUP.md`](LOCAL_SETUP.md) | Reproducible developer/agent setup with mock and live data modes |
| [`FIREBASE_OPERATIONS.md`](FIREBASE_OPERATIONS.md) | Firebase ownership, rules, indexes, Storage, Functions, secrets, and admin access |
| [`DEPLOYMENT_AND_ROLLBACK.md`](DEPLOYMENT_AND_ROLLBACK.md) | Deployment selection matrix, production verification, and recovery steps |
| [`TESTING_AND_QUALITY.md`](TESTING_AND_QUALITY.md) | Automated tests, visual checks, permission tests, and load-test roadmap |
| [`VERIFICATION_OPERATIONS.md`](VERIFICATION_OPERATIONS.md) | Tier 1–3 vendor/admin workflow and troubleshooting |
| [`QA_FIXTURES.md`](QA_FIXTURES.md) | Controlled live Firebase test fixtures, manifest safeguards, cleanup, and Stripe test-mode boundary |
| [`AGENT_OPERATING_GUIDE.md`](AGENT_OPERATING_GUIDE.md) | Cross-agent workflow, constraints, review requirements, and prompt starter |
| [`FEATURE_CATALOG.md`](FEATURE_CATALOG.md) | Feature-to-source/test/operations map for fast agent orientation |
| [`BACKLOG_AND_KNOWN_ISSUES.md`](BACKLOG_AND_KNOWN_ISSUES.md) | Deferred product work and known operational follow-ups |
| [`DOCUMENTATION_MAINTENANCE.md`](DOCUMENTATION_MAINTENANCE.md) | Current-versus-historical documentation policy and update rules |
| [`ACCESS_AND_OWNERSHIP_TEMPLATE.md`](ACCESS_AND_OWNERSHIP_TEMPLATE.md) | Secure, no-secret system ownership and credential-rotation register |
| [`HANDOFF_ACCEPTANCE_CHECKLIST.md`](HANDOFF_ACCEPTANCE_CHECKLIST.md) | Objective criteria for a successful handoff |

## Source-of-Truth Hierarchy

When documentation conflicts, use this precedence order:

1. **Current source code, Firebase configuration files, and package manifests**.
2. **`docs/Guidelines.md` and this `docs/handoff/` package**.
3. **Current task-specific documents under `docs/features/`**, especially [`../features/verification-session2.md`](../features/verification-session2.md).
4. **Historical documents** such as older Phase 1/2, refactoring, presentation, and archived agent briefs.

The repository contains older material that is useful for context but may reference obsolete file names, mock-only workflows, old test counts, or non-Firebase deployment options. Do not treat it as operating truth without reconciling it to the files above.

## Security Rule

This package deliberately contains **no secrets**. Do not add GitHub personal access tokens, Firebase service-account JSON files, SendGrid keys, Stripe secret keys, password exports, or private domain-registry credentials to Git, Markdown, tickets, prompts, or chat transcripts. Record only the accountable owner and approved access location in [`ACCESS_AND_OWNERSHIP_TEMPLATE.md`](ACCESS_AND_OWNERSHIP_TEMPLATE.md).

## First Task Protocol

Before acting on a new task, an agent should state:

1. The user’s goal and what success means.
2. The smallest files/services likely involved.
3. Any assumptions or missing information.
4. The exact test and deployment checks required.

This prevents the common failure mode of editing a visible UI symptom while missing the owning data source, Firestore rule, index, or Cloud Function.

## Related Documentation

- [`../Guidelines.md`](../Guidelines.md) — mandatory coding behavior.
- [`../README.md`](../README.md) — repository-wide documentation index; some entries are historical.
- [`../features/README.md`](../features/README.md) — feature-level documentation index.
- [`../deployment/DEPLOYMENT_PROCEDURES_GUIDE.md`](../deployment/DEPLOYMENT_PROCEDURES_GUIDE.md) — older deployment reference; use this handoff’s Firebase-specific runbook first.
- [`../ROADMAP.md`](../ROADMAP.md) — historical roadmap; use the current backlog in this directory for active priorities.

---

**Maintainer expectation:** Update this handoff package in the same pull request whenever a change alters architecture, deployment procedures, test expectations, security rules, a major data contract, or the active backlog.
