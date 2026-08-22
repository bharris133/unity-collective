# Documentation Maintenance and Historical Reference Policy

## Purpose

The repository contains valuable historical documentation from earlier mock-data, Phase 1/2, refactoring, and design work. It also contains current Firebase-backed operating behavior. This guide prevents future agents from accidentally following an older procedure when a current one exists.

## Current Documentation Hierarchy

| Priority | Documentation | Use |
|---:|---|---|
| 1 | [`../Guidelines.md`](../Guidelines.md) | Mandatory behavioral and change-management standard |
| 2 | [`README.md`](README.md) and all files in `docs/handoff/` | Current operational truth for setup, architecture, Firebase, testing, deployment, security, and backlog |
| 3 | Current feature docs, especially [`../features/verification-session2.md`](../features/verification-session2.md) | Feature-specific operations and implementation detail |
| 4 | Current source/configuration files | Final truth when docs and code differ |
| 5 | Existing project-management, development, refactoring, launch, Phase 2, and internal docs | Historical context only unless reconciled to current implementation |

## Historical Documents That Need Caution

| Area | Why caution is required |
|---|---|
| Earlier Phase 1/2 docs | May describe mock authentication/data workflows and older UI structure |
| Older agent/coding primers | May reference outdated paths, test counts, feature status, or project architecture |
| Generic deployment guides | May describe Netlify, Vercel, GitHub Pages, or generic hosting rather than current Firebase operations |
| Testing summaries | May mention Playwright or test counts that do not match the current Vitest baseline |
| Roadmap | Useful for historical intent but not a complete representation of the current launch backlog |
| Presentations | Useful for stakeholder storytelling, not implementation instructions |

Do not delete historical documentation simply because it is outdated. Preserve it as context, but clearly label it if a future edit brings the discrepancy to light.

## Documentation Update Rules

Update a handoff or feature document in the same PR whenever a change modifies one of these:

| Change type | Documentation to update |
|---|---|
| New/changed Firestore collection, schema, or authoritative field | `ARCHITECTURE_AND_DATA.md` and relevant feature guide |
| Firestore rule/index/Storage rule behavior | `FIREBASE_OPERATIONS.md`, relevant feature guide, and deployment runbook if commands change |
| Cloud Function behavior, secret dependency, or admin authority | `FIREBASE_OPERATIONS.md`, relevant feature guide, and tests guide |
| Deployment process | `DEPLOYMENT_AND_ROLLBACK.md` |
| Testing baseline or required test type | `TESTING_AND_QUALITY.md`, relevant feature doc, and handoff acceptance checklist |
| User-visible major feature | `CURRENT_STATE.md`, relevant feature guide, and backlog if priority changes |
| New strategic decision | `CURRENT_STATE.md` and `BACKLOG_AND_KNOWN_ISSUES.md` |
| Final brand decision | `CURRENT_STATE.md`, backlog, deployment domain guidance, and any rebrand plan |

## Documentation Quality Standard

A current operations document must include:

1. What the feature/process does.
2. The involved files/services.
3. How a developer or agent changes it safely.
4. How it is tested.
5. How it is deployed, if production behavior is affected.
6. Any privacy/security/ownership constraint.
7. The current known limitation or deferred decision, if applicable.

Each named feature should retain a separate Markdown document under `docs/features/` or `docs/handoff/` as appropriate.

## Recommended Long-Term Cleanup

This handoff package should be used before undertaking broad documentation cleanup. After it is adopted, schedule a focused documentation-maintenance task to:

| Action | Desired outcome |
|---|---|
| Correct broken README links | No quick-start link should point to a missing file |
| Add “Historical / superseded” notices | Legacy docs are still accessible but cannot be mistaken for current operational instructions |
| Consolidate duplicate setup/deploy/test guides | One current canonical runbook per operational area |
| Maintain feature index | Every active major feature points to its current guide |
| Add release/change log discipline | Production-impacting changes are easy to trace to PR and deploy instructions |

This cleanup should be documentation-only and should not be mixed with feature development unless the owner explicitly requests it.

## References

- [`README.md`](README.md)
- [`../README.md`](../README.md)
- [`AGENT_OPERATING_GUIDE.md`](AGENT_OPERATING_GUIDE.md)
- [`HANDOFF_ACCEPTANCE_CHECKLIST.md`](HANDOFF_ACCEPTANCE_CHECKLIST.md)
