# Live Firebase QA Acceptance Script

**Status:** Operator runbook for a controlled, reversible live-Firebase QA session.

This script tests the QA accounts and records created by `scripts/qa-fixtures.cjs`. It is intended for the deployed Unity Collective application that uses live Firebase. It does not deploy any Firebase surface, change real-user records, or validate a real payment or email delivery.

> **Release signal:** The run is successful only when the fixture seed and inspection succeed, the relevant role-by-role checks pass without unexpected browser or Firebase errors, and reset removes the controlled fixture set. A result from mock mode is not a live-Firebase acceptance result.

## What This Test Is—and Is Not

| Topic | Controlled live QA fixture session | Mock-data session |
|---|---|---|
| Data location | The `unity-collective` Firebase project | Browser memory and source files under `src/data/` |
| Authentication | Real Firebase Auth accounts in the fixture-only email domain | Local mock account state |
| Rules and Functions | Exercises deployed Firestore/Storage rules and callable Functions | Does not prove deployed Firebase authorization or Function behavior |
| Persistence | Persists until the guarded `reset` command removes it | Usually disappears on refresh or when browser storage is cleared |
| Proper use | Role-based release smoke testing | Fast visual/component development checks |

The fixture utility creates only five accounts and records whose identifiers begin with `qa_`. It writes a local manifest before it can reset anything. The reset path removes only manifest-tracked or QA-owner-scoped Firestore records, the QA Auth accounts, and the fixed QA Storage prefixes. It never scans or deletes a whole collection or Storage bucket.[1]

## Scope and Intentional Boundaries

This is a comprehensive acceptance pass for the **currently supported Firebase-backed surfaces**: authentication, public directory/detail/storefront display, profiles, products, CSV import, vendor and buyer order views, endorsements, reports, moderation, and Tier 3 verification.

The pass deliberately does **not** certify payments or email delivery. The seeded order IDs are explicit non-payment placeholders. The visible marketplace checkout currently has a client-side flow that can write a QA-owned Firestore order after creating a Stripe PaymentMethod; it does not prove a Stripe charge, Checkout Session, webhook, or email delivery. Do not press its payment button as evidence of a completed payment. The read-only `stripe-check` command confirms only that a supplied **test-mode** secret can reach Stripe.[1] [2]

Messages, Favorites, and Community Offers are not included as live acceptance criteria. The current QA fixtures do not seed message threads, Favorites uses browser local storage and a mock catalog, and Offers remains outside the current live-fixture contract. If a navigation item displays mock content or a Firebase failure falls back to mock content, record that result rather than treating it as a pass. These are separate, focused product/data-contract decisions—not workarounds for this run.[3]

## Before Starting

Use the project checkout that contains the fixture manifest after seeding. Do not use real customer data, a personal password, a real certification document, or a real payment card.

1. Update to current `main` and install dependencies. The current Node 20 compatibility fix pins the root fixture dependency to Firebase Admin 13.10.0. If a `jwks-rsa`/`jose` `ERR_REQUIRE_ESM` error appears again, stop and verify that the checkout is current before attempting a live operation.

   ```powershell
   git checkout main
   git pull origin main
   pnpm install
   git log -1 --oneline
   ```

2. Choose a unique local-only QA password of at least 12 characters. Do not paste it in screenshots, files committed to Git, or chat.

3. Confirm that `serviceAccountKey.json` is the approved service-account file for **unity-collective** and is outside version control. In PowerShell, set only local environment variables:

   ```powershell
   $env:QA_FIXTURE_PASSWORD='choose-a-unique-local-only-password'
   $env:GOOGLE_APPLICATION_CREDENTIALS='.\serviceAccountKey.json'
   ```

4. Seed and inspect. The expected inspection result is **5 tracked Auth users**, **19 tracked Firestore documents**, and **19 existing Firestore documents**.

   ```powershell
   node scripts/qa-fixtures.cjs seed --project unity-collective --confirm-live
   node scripts/qa-fixtures.cjs inspect --project unity-collective --confirm-live
   ```

5. Open the deployed Unity Collective site in one clean browser profile or private window. In the browser developer console, run the following before the first sign-in. It clears a browser-only mock-auth override; it makes no Firebase change.

   ```javascript
   localStorage.removeItem('mock_auth_enabled');
   localStorage.removeItem('mock_auth_user');
   location.reload();
   ```

6. Keep the browser console open throughout the session. Capture any unexpected error, failed network request, permission denial, blank result, or mock-data fallback. Do not weaken a Firebase rule, edit a fixture record manually, or manually delete QA records to make a check pass.

## QA Accounts and Seeded Data

All five accounts use the local `QA_FIXTURE_PASSWORD` chosen during seed.

| Persona | Sign-in address | Seeded role and data | Primary checks |
|---|---|---|---|
| QA Administrator | `qa-admin@fixture.unitycollective.test` | Admin profile and `admin: true` claim | Verification review, moderation, privacy-safe decision history |
| QA Vendor One | `qa-vendor-one@fixture.unitycollective.test` | QA Heritage Market; Tier 1; one pending Tier 3 submission; two products; two vendor orders | Store settings, upload, product management, CSV import, order view, Tier 3 result |
| QA Vendor Two | `qa-vendor-two@fixture.unitycollective.test` | QA Culture Studio; Tier 2; one product | Community Verified presentation and public storefront |
| QA Buyer One | `qa-buyer-one@fixture.unitycollective.test` | One paid-style placeholder order; existing endorsement of QA Culture Studio | Profile persistence, report, idempotent endorsement, buyer order view |
| QA Buyer Two | `qa-buyer-two@fixture.unitycollective.test` | One delivered-style multi-item placeholder order; no existing endorsement | Buyer order view and new endorsement write |

## Acceptance Sequence

Sign out completely between personas. Always refresh after a write before marking persistence as passed. The order below intentionally rejects the seeded no-file verification record before testing a genuine QA-only document upload.

### 1. Public Visitor Baseline

Remain signed out. Open **Business Directory** and search `QA`.

| Check | Expected result |
|---|---|
| Directory data source | QA Heritage Market and QA Culture Studio appear. The historical mock listings must not substitute for these results. |
| Tier display | QA Heritage Market shows **Self-Declared**. QA Culture Studio shows **Community Verified**. |
| Detail page | Selecting **View Details** preserves the same tier badge and shows only public business information. |
| Storefront | Open `/vendors/qa_vendor_001` and `/vendors/qa_vendor_002`. Each shows its corresponding tier in the high-contrast Verification panel. |
| Privacy boundary | No raw UID, private profile data, moderator information, or certification-document URL appears on a public page. |

A mock listing, unexpected fallback, or a blank directory is a failure to record. Check that the deployed app is built with `VITE_USE_MOCK_DATA=false`, then capture the browser-console and network errors before changing configuration.[2]

### 2. QA Buyer One: Profile, Report, Idempotency, and Buyer Order

Sign in as QA Buyer One.

1. Open the user menu, select **Profile**, change the display name to `QA Buyer One Smoke`, and save. The success state should appear. Refresh the page; the changed display name should remain. This is a QA-only profile write and reset removes the entire QA account.
2. Open `/directory/qa_vendor_002`. **Endorse Business** should already read **Endorsed** and be disabled. This proves the existing endorsement is detected rather than duplicated.
3. Open `/directory/qa_vendor_001`, select **Report**, choose **Other**, enter `QA manual acceptance report — do not action`, and submit. The dialog must change to **Report Submitted**. Close it.
4. Open **Marketplace**, search for `QA Heritage`, add a product to the cart, open the cart, and confirm that the product, quantity, and total are present. Close the cart. **Do not submit payment** in this acceptance run.
5. Open the user menu, select **Orders**, and confirm one paid-style order containing **QA Heritage Coffee Sampler** is displayed with the QA shipping location.
6. Navigate to `/admin`. The page must deny access; a buyer must not receive an admin queue, report contents, or verification documents.

### 3. QA Buyer Two: Delivered Order and New Endorsement

Sign in as QA Buyer Two.

1. Open **Orders**. Confirm one delivered-style order contains both **QA Heritage Coffee Sampler** and **QA Heritage Gift Box**.
2. Open `/directory/qa_vendor_002`. Select **Endorse Business** and wait for its label to change to **Endorsed**. Refresh; it must remain **Endorsed**.
3. Do not expect this click alone to prove a Tier 2 promotion. The visible button currently records the endorsement; Tier recalculation is a separate callable action and must be confirmed through the established verification design before it is claimed as automatic behavior.

### 4. QA Vendor Two: Tier 2 and Public Store

Sign in as QA Vendor Two.

1. Use **My Store** and confirm the public storefront shows **Community Verified** and **QA Culture Print**.
2. Open **Dashboard**. Confirm that the dashboard identifies the business as **Community Verified (Tier 2)**.
3. Open **Store Settings**. Confirm that it loads the QA Culture Studio information without exposing personal-profile data on the public storefront.
4. Open `/vendors/qa_vendor_001` and use **Endorse Business** only if the button has not already been used by this vendor in the session. Record the result; reset removes QA-owned endorsements afterwards.

### 5. QA Administrator: Moderation and Rejection Path

Sign in as QA Administrator. If this is the first administrator sign-in after seed, sign out and back in once more to ensure the Firebase Auth custom claim is refreshed.

1. Open the user menu and select **Admin Panel**. The admin page must load rather than show Access Denied.
2. Select **Moderation**. Under **Open Reports**, confirm both the seeded QA report and Buyer One’s `QA manual acceptance report` appear. Each row must show a business name, category, reason, details, date, and a privacy-safe `Member •` reference rather than a full raw UID.
3. Select **Endorsements**. Confirm the two seeded entries and the new Buyer Two entry appear with business context, relationship, and available comment context.
4. Resolve the manually created Buyer One report. Select **Decision History** and confirm that same report moves there with **Resolved**, a decision date, and a privacy-safe moderator reference. The seeded resolved QA Culture Studio report should also remain visible.
5. Select **Verifications**. Confirm **QA Heritage Market** appears with a single **Pending** record. Its seeded record deliberately has no document link; the absence of a file is expected and is not a Storage test.
6. Select QA Heritage Market, choose **Reject Submission**, enter `QA acceptance rejection before upload test`, then choose **Confirm Rejection**. The list should update to **Rejected**.

### 6. QA Vendor One: Rejection, Storage Upload, Store, Products, CSV, and Orders

Sign in as QA Vendor One.

1. Open **Store Settings**. After the administrator rejection and a refresh, the Tier 3 upload widget should be available again. If the rejected status or rejection reason is not visible, record it as a UX defect; do not create a second pending submission until the original is confirmed rejected.
2. Select the harmless existing `src/assets/logo_main.png` file from the repository, add the note `QA-only verification upload`, and select **Submit for Review**. The upload must finish and display **Under Review**. Refresh Store Settings and confirm the state persists. Do not upload a real certificate.
3. Update the description to append `QA smoke update`, save it, refresh, and confirm the change remains. Open **View My Store** and verify that the public description reflects the saved business override.
4. Open **Dashboard**. Confirm the two seeded products appear. Add a new product named `QA One-Off Product`, use category **Other**, price `12.34`, and a short QA-only description. Confirm that it appears on the dashboard. Edit its price to `13.45`, save, and then delete it; the list should return to the prior count.
5. Return to **Store Settings**, expand **Bulk Product Upload**, and upload `docs/handoff/fixtures/qa-product-smoke.csv`. Confirm that two valid rows are recognized and the import reports two successful products. Verify either imported product appears in the dashboard or marketplace. Reset cleans products owned by QA Vendor One.
6. Open **Orders**. QA Vendor One must see both seeded orders: one paid-style and one delivered-style. Select the paid order’s **Update status** control and attempt the permitted transition to Processing once. If the status does not change or the browser console reports `permission-denied`, record this as a Firestore-rule/UI contract defect. Do **not** change the rule in the Firebase Console; vendor status updates need a focused implementation and test after this run.

### 7. QA Administrator: Private Document Review and Tier 3 Promotion

Sign in again as QA Administrator.

1. Open **Admin Panel → Verifications**. QA Heritage Market must now have one **Pending** submission with one document link.
2. Open **Document 1**. The QA image should be accessible only to the intended reviewer in this workflow. Do not copy or share the download URL.
3. Choose **Approve — Promote to Tier 3**. The submission should become Approved and the detail pane should state that the business was promoted to Tier 3.
4. Return to **Moderation** and confirm that the records created during the run still show expected business context while preserving privacy-safe member references.
5. Open **Email Logs** only to observe the existing state. An empty state is expected when no checkout/email flow was deliberately invoked. An email log, if one exists, is not proof of inbox delivery.

### 8. Post-Promotion Vendor and Public Verification Check

Sign in as QA Vendor One and then repeat the public check while signed out.

| Surface | Expected result after refresh |
|---|---|
| Vendor One Store Settings | Tier 3 appears in Verification Progress; the Tier 3 upload widget is no longer offered. |
| Vendor One Dashboard | **Document Certified (Tier 3)** is visible. |
| Public Directory card and detail | QA Heritage Market shows **Certified**. |
| Public storefront | The Verification panel is readable and shows **Certified**. |
| Privacy | The certification image, its URL, reviewer identity, and admin notes remain absent from public pages. |

## Cleanup Is Mandatory

After recording the results, sign out of the site and run reset from the **same project directory** that contains `.qa-fixtures-manifest.json`.

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS='.\serviceAccountKey.json'
node scripts/qa-fixtures.cjs reset --project unity-collective --confirm-live
node scripts/qa-fixtures.cjs inspect --project unity-collective --confirm-live
```

The reset success message should identify QA-owner-scoped Firestore records, the QA-only Storage prefixes, and five Auth users. The final `inspect` command should refuse because the manifest has been removed. That refusal is the expected proof that reset completed; it is not an error to repair.

If reset fails, do not manually bulk-delete Firestore collections, Storage folders, Auth users, or the manifest. Save the exact command output and stop. The failure should be handled as a focused fixture-utility issue because the manifest is the safety boundary.[1]

## Result Log and Defect Format

Record a pass or failure for each row. A failed expected security check, such as buyer access being denied at `/admin`, counts as a pass. A blank page, unexpected mock fallback, leaked private value, or silent permission denial counts as a failure.

| Section | Pass / fail | Route and persona | Evidence or exact error |
|---|---|---|---|
| Seed and inspect |  |  |  |
| Public directory and storefront |  |  |  |
| Buyer One profile/report/order |  |  |  |
| Buyer Two endorsement/order |  |  |  |
| Vendor Two Tier 2/storefront |  |  |  |
| Admin moderation/rejection |  |  |  |
| Vendor One upload/products/CSV/orders |  |  |  |
| Admin document review/approval |  |  |  |
| Public Tier 3 display/privacy |  |  |  |
| Reset and post-reset refusal |  |  |  |

For every failure, capture the role, exact URL, expected behavior, actual behavior, browser-console output, and the relevant Firebase/Function error. Do not redact the QA-only fixture identity from a private issue report, but never include passwords, secret keys, document URLs, or personal data.

## Future Frontend Test Automation

The repository has a **historical** Playwright configuration and mock-data test files, but the active package manifest no longer contains the Playwright dependency or `test:e2e` scripts. Several historical tests also expect older routes and exact mock listings. They should not be used as a release gate in their current state.[3]

The recommended sequence is to restore automated browser coverage in a focused testing workstream after this manual baseline identifies the working core flows. First, reconcile the test cases with current routes, roles, Tier 1–3 labels, and accessible UI names. Next, add Playwright and supported scripts on a dedicated branch for deterministic mock-mode visual and interaction checks. Then add a separate Firebase Emulator lane for Auth, Firestore, Storage, Functions, and security rules. The emulator lane should seed isolated test accounts rather than use the production `unity-collective` fixture project in continuous integration.

The durable release stack should have four layers: existing Vitest component/service tests for fast feedback; Playwright mock-mode tests for layout and user interactions; Firebase Emulator integration tests for permissions and callable Functions; and this short, deliberate live-fixture smoke test before an important production release. When functional scope stabilizes, the planned 25–50-user load scenarios can build on the emulator or an explicitly isolated test environment rather than on the live project.[2] [3]

## References

[1]: QA_FIXTURES.md "Controlled QA Fixtures"
[2]: TESTING_AND_QUALITY.md "Testing and Quality"
[3]: BACKLOG_AND_KNOWN_ISSUES.md "Backlog and Known Issues"
