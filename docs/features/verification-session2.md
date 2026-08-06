# Verification Session 2 — Feature Documentation

## What This Feature Does

Implements the full 3-tier business verification document submission and review flow:

- **Tier 1 (Self-Declared):** Set during onboarding when the vendor affirms Black ownership.
- **Tier 2 (Community Verified):** Auto-promoted when weighted endorsement sum ≥ 3.
- **Tier 3 (Document Certified):** Vendor uploads an official certification document; admin reviews and approves via the Admin Panel.

---

## Files Involved

| File | Role |
|---|---|
| `functions/src/index.ts` | Three new Cloud Functions: `submitVerificationDocument`, `reviewSubmission`, `updateTrustScore` |
| `src/pages/VendorSettingsPage.tsx` | Tier 3 document upload widget (file picker, progress bar, submission status) |
| `src/components/admin/AdminPanel.tsx` | Admin Verifications tab — Session 2 submission review UI |
| `src/services/verificationService.ts` | Client-side service: `getAllPendingSubmissions`, `getBusinessVerification`, `addEndorsement`, etc. |
| `src/types/Verification.ts` | TypeScript types: `VerificationSubmission`, `Endorsement`, `Report`, `BusinessVerification` |
| `src/components/VerificationProgress.tsx` | 3-step tier checklist shown to vendors |
| `src/components/VerificationBadge.tsx` | Tier badge shown on directory cards and storefront headers |
| `firestore.rules` | `verificationSubmissions` subcollection rule |
| `storage.rules` | Admin read access to verification docs; `businesses/{id}/verification/**` path |
| `src/__tests__/verification/VerificationSession2.test.tsx` | 28 tests covering all new functionality |

---

## How the Flow Works

### Vendor Side

1. Vendor visits **Store Settings** (`/vendor/settings`).
2. Below the Verification Progress checklist, the **Apply for Tier 3 Certification** section appears (hidden if already Tier 3).
3. Vendor selects a PDF/JPG/PNG file (max 10 MB) and optionally adds notes.
4. Clicking **Submit for Review**:
   - Uploads the file to Firebase Storage at `businesses/{uid}/verification/{timestamp}_{filename}`
   - Calls the `submitVerificationDocument` Cloud Function with the download URL
   - The function creates a `verificationSubmissions` document under `businesses/{uid}/verificationSubmissions/`
5. The widget switches to a status display showing "Under Review".

### Admin Side

1. Admin visits **Admin Panel → Verifications**.
2. The sidebar badge counts pending `verificationSubmissions` across all businesses.
3. The list shows all submissions with business name, type, date, and status badge.
4. Clicking a submission opens the detail pane showing:
   - Business name and Firebase UID
   - Submission type, date, vendor notes
   - Clickable document links (open in new tab)
   - Approve / Reject actions
5. **Approve:** Calls `reviewSubmission` Cloud Function → sets `verificationTier=3`, `documentVerifiedAt`, clears `flaggedForReview` on the `businesses` doc.
6. **Reject:** Calls `reviewSubmission` with `decision='rejected'` and a rejection reason.

### Trust Score / Tier 2 Auto-Promotion

The `updateTrustScore` Cloud Function should be called after any endorsement is added:

```typescript
const fns = getFunctions();
const updateScore = httpsCallable(fns, 'updateTrustScore');
await updateScore({ businessId: vendorId });
```

It recalculates the weighted endorsement sum and auto-promotes to Tier 2 when `totalWeight >= 3`.

---

## How to Make Changes

### Adding a new submission type

1. Add the new type to `SubmissionType` in `src/types/Verification.ts`:
   ```typescript
   export type SubmissionType = 'document' | 'video' | 'other' | 'your_new_type';
   ```
2. Update the file picker `accept` attribute in `VendorSettingsPage.tsx` if needed.
3. Update the `type` dropdown/label in the admin detail pane in `AdminPanel.tsx`.

### Changing the Tier 2 threshold

In `functions/src/index.ts`, find `updateTrustScore` and change:
```typescript
if (totalWeight >= 3 && currentTier === 1) {
```
to the desired threshold.

### Adding email notifications on approval/rejection

In `reviewSubmission` (Cloud Functions), after the `bizRef.set(...)` call, add a `sendEmail` call using the existing `sendEmailNotification` helper pattern from `sendOrderEmailsCallable`.

### Adding a new Firestore index

Add to `firestore.indexes.json` following the existing pattern:
```json
{
  "collectionGroup": "verificationSubmissions",
  "queryScope": "COLLECTION_GROUP",
  "fields": [
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```

---

## Deploy Instructions

### First-time deploy (Cloud Functions)

```bash
cd ~/unity-collective
git pull origin main
firebase deploy --only functions --project unity-collective
```

### Full deploy (hosting + rules + functions)

```bash
pnpm run build
firebase deploy --project unity-collective
```

### Rules-only deploy (no rebuild needed)

```bash
firebase deploy --only firestore:rules,storage --project unity-collective
```

---

## Testing

```bash
pnpm test --run
# Expected: 175 tests pass (19 test files)
```

The Session 2 tests are in `src/__tests__/verification/VerificationSession2.test.tsx` and cover:
- `verificationService` mock data paths
- `VerificationProgress` tier display
- `VerificationBadge` tier badges
- Upload widget logic (state machine, progress clamping, tier gating)
- `AdminPanel` VerificationsTab UI rendering
