# Cross-Agent Operating Guide

## Audience

This guide is written for **Manus, Claude Code, Codex, Kimi, and comparable advanced coding agents**. It intentionally uses repository-visible instructions and command-line procedures rather than relying on a particular platform’s proprietary memory, connectors, or tool names.

## Non-Negotiable Reading Gate

Before analyzing, editing, testing, deploying, or recommending a solution, read:

1. [`../Guidelines.md`](../Guidelines.md) — **mandatory behavioral standard**.
2. [`README.md`](README.md) — handoff package entry point and source-of-truth hierarchy.
3. [`CURRENT_STATE.md`](CURRENT_STATE.md) — what is live, deferred, and strategically pending.
4. The task-specific operations guide, especially [`VERIFICATION_OPERATIONS.md`](VERIFICATION_OPERATIONS.md) for Tier 1–3 work.

This gate applies even if an older agent summary claims the task is straightforward. The project has real Firebase state, security rules, and historic documentation drift; prior context may be incomplete.

## Required Agent Behavior

| Requirement | Expected behavior |
|---|---|
| Clarify before coding | State assumptions, surface ambiguity, and ask the owner when a business/security/product decision is not specified |
| Keep changes surgical | Change only the files/services required by the task; do not opportunistically refactor nearby code |
| Preserve public privacy | Never expose personal profile data, user IDs, certification documents, private notes, or private contact details in public storefronts/directory surfaces |
| Respect visual system | Keep the dark Pan-African theme and verify readable contrast, especially verification statuses |
| Trace data ownership | Identify the authoritative data source before changing a display or workflow |
| Treat Firebase as multi-surface | A data feature may require client code, Functions, Firestore rules, indexes, Storage rules, and a targeted deployment—not just a UI change |
| Test before handoff | Add/update tests where practical; run the required suite/build checks and report the actual result |
| Deploy safely | Deploy only affected Firebase surfaces; never approve unexpected index/secret/resource deletion |
| Document operational changes | Update this handoff package and feature docs when operations, data contracts, test gates, or deployment requirements change |

## Explicit Do-Not List

Do **not**:

- Commit secrets, service-account JSON files, personal access tokens, API keys, `.env.local`, `.env.production.local`, or screenshots containing credentials.
- Replace project-managed rules with broad authenticated-user access merely to bypass a test error.
- Create indexes manually in Console without adding the equivalent `firestore.indexes.json` configuration to Git.
- Remove a live Firestore index because a deployment prompt suggests it, unless all dependent queries are known and the owner has approved the deletion.
- Use a Firestore `where` plus `orderBy` query without checking required index configuration.
- Assume a user-facing Tier change comes from `onboarding`; Tier 2 and Tier 3 promotion is authoritative in `businesses/{uid}.verificationTier`.
- Treat mock-mode success as live Firebase permission validation.
- Run destructive Git operations, reset/rebase away user changes, or overwrite local environment files without explicit owner authorization.
- Deploy a full Firebase project by default. Select the specific deployment surfaces that changed.
- Promise that email, Stripe webhooks, or performance scaling are finished without executing their real end-to-end tests.

## Standard Task Workflow

### 1. Orient

Read the mandatory documents and inspect only the files relevant to the request. Explain the intended success criterion.

```text
Goal: <one sentence>
Likely layers: <frontend / service / rules / index / storage / function>
Assumptions: <explicit list>
Verification: <tests and live smoke test>
```

### 2. Discover

Trace the complete path before editing:

```text
User action
→ component/page
→ service function
→ Firestore/Storage/Function path
→ security rule/index
→ destination UI/state
```

If multiple data collections appear to represent the same value, identify the authoritative contract in [`ARCHITECTURE_AND_DATA.md`](ARCHITECTURE_AND_DATA.md).

### 3. Implement

Create a focused branch with a descriptive name:

```bash
git checkout main
git pull --ff-only origin main
git checkout -b fix/short-descriptive-name
```

Make the smallest correct change. Keep side effects and data migration choices explicit.

### 4. Test

Run the narrowest relevant test during iteration, then the full required quality gate:

```bash
pnpm test --run
pnpm run build

# If Functions changed
pnpm --dir functions run build
```

For Firebase security/features, execute the role-specific live smoke test after deployment. See [`TESTING_AND_QUALITY.md`](TESTING_AND_QUALITY.md).

### 5. Review and Document

Before commit:

```bash
git diff --check
git status --short
git diff -- <relevant-files>
```

Update handoff/feature documentation if any of the following changed:

- architecture or data ownership;
- Firebase rules/indexes/Storage/function operations;
- deployment commands;
- required tests;
- public privacy boundary;
- backlog/status;
- named feature behavior.

### 6. Commit and PR

Use a concise conventional-style subject that explains user impact, for example:

```text
fix: synchronize public verification tier displays
```

PR description should state:

1. root cause;
2. user-visible behavior changed;
3. files/layers changed;
4. tests/builds executed;
5. required deployment surfaces; and
6. exact post-deploy smoke test.

## Cross-Agent Prompt Starter

A project owner can paste the following into a new agent session:

```text
You are continuing work on the Unity Collective repository.

Before proposing or editing code, read these files in order:
1. docs/Guidelines.md
2. docs/handoff/README.md
3. docs/handoff/CURRENT_STATE.md
4. docs/handoff/ARCHITECTURE_AND_DATA.md
5. docs/handoff/TESTING_AND_QUALITY.md
6. The task-specific handoff/feature document relevant to the request.

Treat docs/handoff/ as current operational truth. Older documents may be historical.

Project requirements:
- React/TypeScript/Vite/Tailwind frontend; Firebase Auth, Firestore, Storage, Hosting, and Functions backend.
- Preserve the dark Pan-African theme (#111111 background, #1E1E1E surfaces, #D4AF37 gold accent).
- Never expose personal user data in public business views.
- Use the smallest correct change; do not refactor unrelated code.
- For Firebase behavior, trace client query/write, rules, indexes, Storage, and Functions before changing code.
- businesses/{uid}.verificationTier is authoritative after Tier 2/3 promotion.
- Add or update tests, run pnpm test --run and pnpm run build; run pnpm --dir functions run build when Functions change.
- Do not deploy or expose secrets without explicit owner approval.

Task: <insert task>
```

## Platform-Specific Notes

| Agent type | Use this guide by doing the following |
|---|---|
| Manus | Read the repository documents before making a plan; keep user-facing status concise; use explicit deployment surface selection |
| Claude Code | Start in repository root; read the mandatory files; use shell/test output as evidence; keep modifications scoped |
| Codex | Use repository files rather than inferred context; show tests and diff before proposing a patch; do not generate new configuration from assumptions |
| Kimi or other model agents | Use the cross-agent prompt starter; do not assume access to Firebase, GitHub, browser sessions, or secrets; ask the owner for required access |

## Communication Standard

A useful agent report contains evidence, not confidence alone:

| Report section | Include |
|---|---|
| Diagnosis | Exact error, code path, and root cause |
| Change | What changed and why it is minimal |
| Validation | Commands run and actual results |
| Deployment | Exact Firebase surfaces and commands |
| Owner action | Any required login, credential, or Console step |
| Residual risk | What remains untested or intentionally deferred |

## References

- [`../Guidelines.md`](../Guidelines.md)
- [`CURRENT_STATE.md`](CURRENT_STATE.md)
- [`ARCHITECTURE_AND_DATA.md`](ARCHITECTURE_AND_DATA.md)
- [`TESTING_AND_QUALITY.md`](TESTING_AND_QUALITY.md)
- [`DEPLOYMENT_AND_ROLLBACK.md`](DEPLOYMENT_AND_ROLLBACK.md)
