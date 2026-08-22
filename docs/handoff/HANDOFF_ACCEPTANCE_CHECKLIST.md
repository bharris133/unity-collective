# Handoff Acceptance Checklist

## Purpose

Use this checklist to determine whether Unity Collective is ready to be handed to a new agent, technical collaborator, or operating team. A handoff is complete when the receiver can orient, set up, test, make a focused change, and understand production boundaries without relying on the original builder’s memory.

## Documentation Acceptance

- [ ] [`../Guidelines.md`](../Guidelines.md) is present and identified as mandatory reading.
- [ ] [`README.md`](README.md) gives a clear reading order and source-of-truth hierarchy.
- [ ] Current product state, completed features, deferred work, and name decision status are documented in [`CURRENT_STATE.md`](CURRENT_STATE.md).
- [ ] Architecture, collection paths, integrations, privacy boundary, and authoritative data contracts are documented in [`ARCHITECTURE_AND_DATA.md`](ARCHITECTURE_AND_DATA.md).
- [ ] Local setup instructions distinguish mock mode from live Firebase mode.
- [ ] Firebase rules, indexes, Storage, Functions, and deploy-surface procedures are documented.
- [ ] Testing and manual smoke-test procedures are documented.
- [ ] Tier 1–3 verification operations and troubleshooting are documented.
- [ ] Cross-agent instructions are written in a platform-neutral form that works for Manus, Claude Code, Codex, Kimi, and similar tools.
- [ ] The backlog distinguishes active priorities from intentionally deferred items.
- [ ] An access/ownership register template exists without secrets.
- [ ] Historical documentation is clearly subordinate to the current `docs/handoff/` package.

## Clean Setup Acceptance

A receiving agent/operator should be able to perform the following on a clean workstation:

```bash
git clone https://github.com/bharris133/unity-collective.git
cd unity-collective
pnpm install
pnpm --dir functions install
pnpm test --run
pnpm run build
pnpm --dir functions run build
```

- [ ] Root dependencies install using the pinned pnpm workflow.
- [ ] Functions dependencies install separately.
- [ ] Tests pass at the currently documented baseline.
- [ ] Production frontend build succeeds.
- [ ] Functions TypeScript build succeeds.
- [ ] Mock-mode local app starts and renders.
- [ ] Live Firebase requirements are understandable without exposing credentials.

## Operational Acceptance

- [ ] The owner knows which account controls GitHub, Firebase, Stripe, SendGrid, domain/DNS, and mailbox access.
- [ ] No credential values, service-account JSON, or tokens are contained in the repository/handoff package.
- [ ] The owner knows how to rotate exposed GitHub tokens and other credentials.
- [ ] The owner understands that Firebase Hosting, rules, indexes, Storage, and Functions deploy independently.
- [ ] The owner knows to inspect Firestore index state until **Enabled** after index deployment.
- [ ] The owner knows to stop if the Firebase CLI proposes unexpected index deletion, secret destruction, or unrelated resource changes.
- [ ] The admin profile/custom-claim procedure is documented and owned.

## Functional Acceptance

| Area | Minimum demonstration |
|---|---|
| Public directory | Live business entries load when `VITE_USE_MOCK_DATA=false`; verification badge is readable and accurate |
| Vendor storefront | Public business data appears without private profile information |
| Vendor settings | Vendor can view current verification state and appropriate Tier 3 submission status |
| Verification | Controlled vendor upload → admin review → approved Certified display succeeds end-to-end |
| Moderation | Submitted report and endorsement appear in admin moderation views |
| Product management | Vendor can manage product data and CSV workflow according to current feature behavior |
| Profile/navigation | Key navigation links resolve to intended surfaces |
| Deployment | At least one targeted Firebase deployment has been executed with documented smoke test |

## Agent Readiness Acceptance

Give a receiving agent the prompt in [`AGENT_OPERATING_GUIDE.md`](AGENT_OPERATING_GUIDE.md), then ask it to perform a low-risk task such as documenting a component or improving an existing test.

- [ ] The agent reads `Guidelines.md` and the handoff package before proposing edits.
- [ ] The agent correctly identifies mock versus live Firebase behavior.
- [ ] The agent identifies the relevant source, service, rule, index, or Function layer.
- [ ] The agent proposes focused changes and a test plan rather than broad refactoring.
- [ ] The agent reports test/build results and deployment requirements precisely.
- [ ] The agent does not request, store, or expose secrets.

## Final Owner Sign-Off

| Sign-off item | Owner confirmation |
|---|---|
| Handoff package reviewed | `<date / initials>` |
| Access register completed securely | `<date / initials>` |
| Current deployment owner identified | `<date / initials>` |
| Current product name status understood | `<date / initials>` |
| Email scope intentionally deferred or approved | `<date / initials>` |
| Next development priority chosen | `<date / initials>` |
| Agent access protocol agreed | `<date / initials>` |

## Revalidation Rule

Re-run this checklist after any of the following:

- a major dependency/framework change;
- Firebase project, rule, index, Storage, Function, or secret change;
- final rebrand/domain migration;
- payment/email architecture decision;
- change in operating owner or technical agency; or
- broad production launch.

## References

- [`README.md`](README.md)
- [`LOCAL_SETUP.md`](LOCAL_SETUP.md)
- [`TESTING_AND_QUALITY.md`](TESTING_AND_QUALITY.md)
- [`DEPLOYMENT_AND_ROLLBACK.md`](DEPLOYMENT_AND_ROLLBACK.md)
- [`ACCESS_AND_OWNERSHIP_TEMPLATE.md`](ACCESS_AND_OWNERSHIP_TEMPLATE.md)
