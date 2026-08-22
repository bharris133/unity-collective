# Firebase Operations

## Scope

This guide is the operational reference for the Firebase project backing Unity Collective. Read it before changing Firestore rules, indexes, Storage rules, Functions, Firebase secrets, or administrator access.

> Never put credentials in this file. Document only an owner, approved access location, and rotation process in [`ACCESS_AND_OWNERSHIP_TEMPLATE.md`](ACCESS_AND_OWNERSHIP_TEMPLATE.md).

## Firebase Configuration Surface

| Capability | Repository control file | Typical deploy target |
|---|---|---|
| Firestore security rules | `firestore.rules` | `firestore:rules` |
| Firestore indexes | `firestore.indexes.json` | `firestore:indexes` |
| Storage rules | `storage.rules` | `storage` |
| Cloud Functions | `functions/src/index.ts` and `functions/` | `functions` |
| Hosting | `dist/` after root Vite build | `hosting` |
| Firebase project configuration | `firebase.json` | Controls deploy mapping and Functions predeploy build |

The Firebase project identifier used by production operations is `unity-collective`.

## Deployment Selection Matrix

| Changed files | Required command | Notes |
|---|---|---|
| React/UI/service code only | `pnpm run build` then `firebase deploy --only hosting --project unity-collective` | Do not deploy rules/functions unnecessarily |
| `firestore.rules` only | `firebase deploy --only firestore:rules --project unity-collective` | Rules compile and deploy without frontend rebuild |
| `firestore.indexes.json` only | `firebase deploy --only firestore:indexes --project unity-collective` | Check Firebase Console until every required index is **Enabled** |
| `storage.rules` only | `firebase deploy --only storage --project unity-collective` | Test an authenticated upload and authorized read after deployment |
| `functions/src/**` or `functions/package.json` | `firebase deploy --only functions --project unity-collective` | Functions are built by the configured predeploy step; inspect deploy output |
| Multiple surfaces | Explicitly list only what changed, for example `firebase deploy --only firestore:rules,functions --project unity-collective` | Avoid a blind full deploy |

### Why Explicit Deploys Matter

A full `firebase deploy` may attempt to reconcile live Firestore indexes with the local `firestore.indexes.json`. If the local file does not describe a production index, the CLI can ask to delete it. Do not approve index deletion until the local configuration has been reconciled and the affected query has been verified.

## Firestore Rules Principles

1. Every client query must be permitted by its Firestore rule **as a query**, not only by a document-level rule that appears equivalent.
2. A `collectionGroup()` query needs a recursive match path, such as:

   ```rules
   match /{path=**}/verificationSubmissions/{submissionId} {
     // Appropriate vendor/admin access checks here
   }
   ```

3. Avoid relying solely on cross-document `get()` lookups inside collection-group rules. Prefer a custom auth claim, direct path ownership where valid, or a deliberately aligned user-profile authorization contract.
4. Query constraints must match what the rule can prove. A list query is not automatically allowed because a single-document read is allowed.
5. Rules do not filter insecure results; Firestore rejects the entire query if it could return forbidden data.

### Known Collection-Group Requirement

The Admin Verifications tab uses `collectionGroup('verificationSubmissions')`. It requires both:

- the recursive verification-submission rule in `firestore.rules`; and
- the collection-group single-field index for `verificationSubmissions.status` in `firestore.indexes.json`.

The query will fail if either is missing. Symptoms can look similar—permission denied versus a missing-index link—so inspect the exact DevTools/Firestore error before changing anything.

## Index Operations

### Existing Operational Index Patterns

| Collection group / collection | Fields | Purpose |
|---|---|---|
| `orders` collection | `userId` ascending + `createdAt` descending | User order history |
| `orders` collection | `vendorId` ascending + `createdAt` descending | Vendor order history |
| `verificationSubmissions` collection group | `status` ascending + `createdAt` descending | Ordered review queries where required |
| `verificationSubmissions` collection group | `status` single-field ascending | Filtered pending-review query |

### Index Procedure

1. Reproduce and read the precise Firestore error.
2. Determine whether the query needs a composite index, a collection-group single-field override, or client-side sorting.
3. Add the exact configuration to `firestore.indexes.json`.
4. Commit the configuration and add a regression check where practical.
5. Deploy only indexes.
6. Wait for the Firebase Console state to become **Enabled**.
7. Retest the live query.

Do not assume that a composite index satisfies a single-field collection-group filter. The verification review flow required both types at different points.

## Storage Operations

Storage is used for vendor logos, product images, profile assets, and certification documents. `storage.rules` controls read/write access.

### Tier 3 Document Path

Verification document uploads are stored beneath the business-owned verification path. The vendor must be able to upload only to their own path, while authorized administrators require document read access for review.

Verify all three paths after changing Storage rules:

1. Vendor can upload their own eligible document.
2. Vendor cannot upload to another business path.
3. Authorized admin can open the submitted document; an ordinary non-admin cannot.

### Admin Claims in Storage

Storage rules use the Firebase Auth custom claim pattern for admin access. When setting a claim, users need a fresh token. Signing out and back in is the simplest refresh path.

## Cloud Functions

Functions live in `functions/src/index.ts`; the Functions project has its own `package.json`, TypeScript build, and Node 20 runtime requirement.

| Function area | Purpose | Operational caution |
|---|---|---|
| Stripe | Payment/webhook integration | Do not assume the webhook creates current client-side orders; inspect active order flow first |
| SendGrid | Buyer/vendor email sending and logging | Keys are Firebase secrets; delivery behavior remains a design and validation follow-up |
| Verification | Document submission, admin review, trust-score recalculation | Must remain aligned with Firestore rules and authoritative tier data contract |

### Functions Build and Deploy

```bash
pnpm --dir functions install
pnpm --dir functions run build
firebase deploy --only functions --project unity-collective
```

If a Function uses a Firebase secret, ensure the secret exists in the production project before deployment. Document secret **names** and owners only; never record secret values.

## Administrator Access

### User Profile Marker

The established visible admin marker is:

```text
users/{adminUid}.isAdmin = true
```

Some code also recognizes the legacy `role: 'admin'` profile value. Do not downgrade an existing admin to `role: 'buyer'` without confirming every admin check in rules, Functions, and UI.

### Custom Claim Setup

`script/set-admin-claim.cjs` can assign the `admin: true` custom claim. It requires a Firebase service-account JSON on the operator machine, which must remain ignored by Git.

Safe process:

1. Obtain the administrator’s Firebase Auth UID from Firebase Console.
2. Confirm the target is the actual administrator—not a vendor test account.
3. Obtain the approved service-account key through the owner’s secure access procedure.
4. Configure the local credentials path.
5. Run the script with the explicit target UID.
6. Sign out/in as the administrator before testing Storage or claim-based access.
7. Verify the `users/{uid}.isAdmin` profile marker remains correct.

Do not batch-grant admin claims to all users. It is a per-administrator action.

## Firebase Secret Registry — Names Only

| Secret name | Used by | Owner must confirm |
|---|---|---|
| `SENDGRID_API_KEY` | SendGrid mail Function | Sender verification, key scope, version, and delivery monitoring |
| `STRIPE_SECRET_KEY` | Stripe Function/webhook behavior | Test/live mode and rotation ownership |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification | Endpoint alignment and event configuration |
| `FRONTEND_URL` | Functions CORS/redirect settings | Deployed domain alignment |

The actual names/versioning in the Firebase Console are operational data. Never add secret values to local documentation, source, test fixtures, screenshots, or pull requests.

## Incident Triage Order

When a live Firebase feature fails:

1. Confirm mock versus live data mode.
2. Read the browser error exactly—permission, index, missing Function, Storage authorization, or network error.
3. Confirm the relevant deployment surface contains the expected current commit.
4. Check Firestore rules/indexes or Storage rules for the exact query/path.
5. Check Firebase Functions logs for server-side behavior.
6. Test with the correct user role and fresh login token.
7. Add a regression test before finalizing the fix.

## References

- [`../../firebase.json`](../../firebase.json)
- [`../../firestore.rules`](../../firestore.rules)
- [`../../firestore.indexes.json`](../../firestore.indexes.json)
- [`../../storage.rules`](../../storage.rules)
- [`../../functions/package.json`](../../functions/package.json)
- [`VERIFICATION_OPERATIONS.md`](VERIFICATION_OPERATIONS.md)
- [`DEPLOYMENT_AND_ROLLBACK.md`](DEPLOYMENT_AND_ROLLBACK.md)
