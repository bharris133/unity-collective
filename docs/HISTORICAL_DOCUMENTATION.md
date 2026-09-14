# Historical Documentation Guide

## Purpose

Unity Collective has accumulated planning, implementation, mock-data, and milestone documents across several development phases. These materials remain valuable as **historical context**, but they are not the default instructions for operating or changing the live Firebase-backed platform.

> **Use the current handoff package before taking implementation or deployment action.** Start with [`handoff/README.md`](handoff/README.md), then read [`Guidelines.md`](Guidelines.md). When documentation conflicts with source or configuration, the current source/configuration is authoritative.

## Documentation Hierarchy

| Priority | Documentation | Intended use |
|---:|---|---|
| 1 | [`Guidelines.md`](Guidelines.md) | Mandatory reasoning and change-management standard. |
| 2 | [`handoff/README.md`](handoff/README.md) and `docs/handoff/` | Current operations: product state, architecture, local setup, Firebase, testing, deployment, security, and backlog. |
| 3 | Current feature guides, especially [`features/verification-session2.md`](features/verification-session2.md) | Feature-specific implementation and operational detail. |
| 4 | Current source, configuration, and tests | Final authority if any documentation conflicts with implementation. |
| 5 | Historical/reference materials listed below | Prior intent, design rationale, and milestone context only. |

## Historical and Reference Areas

| Location | Status | How to use it safely |
|---|---|---|
| [`ROADMAP.md`](ROADMAP.md) | Historical planning record | Use for original product intent; do not treat phase status or implementation claims as current. |
| `setup/` | Historical/reference | May describe older local environments or workflows. Use [`handoff/LOCAL_SETUP.md`](handoff/LOCAL_SETUP.md) for current setup. |
| `development/` | Mixed historical/reference | Helpful for context, but verify mock-data, Firebase, tooling, and test claims against the handoff package and current source. |
| `testing/` | Historical/reference | Some guides describe superseded test strategies. Use [`handoff/TESTING_AND_QUALITY.md`](handoff/TESTING_AND_QUALITY.md) for the active quality gate. |
| `deployment/` | Historical/reference | Use [`handoff/DEPLOYMENT_AND_ROLLBACK.md`](handoff/DEPLOYMENT_AND_ROLLBACK.md) and [`handoff/FIREBASE_OPERATIONS.md`](handoff/FIREBASE_OPERATIONS.md) for current targeted Firebase deploys. |
| `architecture/` | Historical/reference | Useful design context. Confirm Firebase collection, Function, and public-privacy contracts against current configuration and handoff architecture. |
| `project-management/` | Historical reporting | Preserves milestone reports and visual-review context; current priorities are in [`handoff/BACKLOG_AND_KNOWN_ISSUES.md`](handoff/BACKLOG_AND_KNOWN_ISSUES.md). |
| `refactoring/` | Historical engineering record | Documents prior refactoring proposals and results; do not resume an old plan without reconfirming current need and scope. |
| `internal/` | Historical agent/process context | May contain earlier handoff assumptions. The cross-agent operating standard is [`handoff/AGENT_OPERATING_GUIDE.md`](handoff/AGENT_OPERATING_GUIDE.md). |
| `launch_presentation/` and `phase2_presentation/` | Stakeholder communication assets | Use for narrative or visual reference, not implementation instructions. |

## Current Operational Shortcuts

| Need | Current source |
|---|---|
| Understand live product state and active/deferred work | [`handoff/CURRENT_STATE.md`](handoff/CURRENT_STATE.md) and [`handoff/BACKLOG_AND_KNOWN_ISSUES.md`](handoff/BACKLOG_AND_KNOWN_ISSUES.md) |
| Change a Firebase-backed feature safely | [`handoff/ARCHITECTURE_AND_DATA.md`](handoff/ARCHITECTURE_AND_DATA.md) and the relevant operations guide |
| Change Tier 1–3 verification | [`handoff/VERIFICATION_OPERATIONS.md`](handoff/VERIFICATION_OPERATIONS.md) |
| Set up, test, or deploy | [`handoff/LOCAL_SETUP.md`](handoff/LOCAL_SETUP.md), [`handoff/TESTING_AND_QUALITY.md`](handoff/TESTING_AND_QUALITY.md), and [`handoff/DEPLOYMENT_AND_ROLLBACK.md`](handoff/DEPLOYMENT_AND_ROLLBACK.md) |
| Understand required Firebase rules, indexes, Storage, or Functions behavior | [`handoff/FIREBASE_OPERATIONS.md`](handoff/FIREBASE_OPERATIONS.md) |

## Maintenance Rule

Do not delete historical documents merely because they are outdated. Preserve them for context, but update this guide or add a local historical notice whenever a document could reasonably be mistaken for current operations.

When a code, rule, index, Function, deployment, or feature behavior change affects current operations, update the relevant handoff or feature guide in the same pull request.

## References

- [`handoff/DOCUMENTATION_MAINTENANCE.md`](handoff/DOCUMENTATION_MAINTENANCE.md)
- [`handoff/AGENT_OPERATING_GUIDE.md`](handoff/AGENT_OPERATING_GUIDE.md)
- [`handoff/HANDOFF_ACCEPTANCE_CHECKLIST.md`](handoff/HANDOFF_ACCEPTANCE_CHECKLIST.md)
