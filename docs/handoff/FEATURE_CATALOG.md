# Feature Catalog

## Purpose

This catalog helps a new agent locate the right feature boundary before editing. It is a navigation map, not an instruction to change every listed area. Read the linked feature guide and current source before implementation.

## Product Features

| Feature | Current state | Primary frontend/service locations | Primary operational guide |
|---|---|---|---|
| Authentication and profile | Firebase-backed profile and avatar editing are active | `src/contexts/AuthContext.tsx`, `src/pages/ProfilePage.tsx`, `src/services/authService.ts` | [`../features/authentication.md`](../features/authentication.md) |
| Vendor onboarding | Active multi-step onboarding | `src/pages/OnboardingWizard.tsx`, `src/services/onboardingService.ts`, `src/data/mockOnboarding.ts` | [`../features/business-directory.md`](../features/business-directory.md) and current source |
| Vendor settings | Active overrides, logo, CSV products, Tier 3 upload/status | `src/pages/VendorSettingsPage.tsx`, `src/services/businessService.ts` | [`VERIFICATION_OPERATIONS.md`](VERIFICATION_OPERATIONS.md) |
| Public storefront | Active public vendor view | `src/components/VendorStorefront.tsx`, `src/components/VerificationBadge.tsx` | [`ARCHITECTURE_AND_DATA.md`](ARCHITECTURE_AND_DATA.md) |
| Business Directory | Live Firestore directory and detail routing | `src/pages/BusinessDirectoryPage.tsx`, `src/components/BusinessDetail.tsx`, `src/services/businessService.ts` | [`../features/business-directory.md`](../features/business-directory.md) |
| Marketplace and cart | Active marketplace, checkout, order views | `src/components/MarketplacePage.tsx`, checkout/cart components, order services | [`../features/marketplace.md`](../features/marketplace.md), [`../features/shopping-cart.md`](../features/shopping-cart.md) |
| Product CSV upload | Active vendor product bulk upload | `src/components/ProductCsvUpload.tsx` | Relevant component tests |
| Orders | Buyer and vendor order surfaces active | `src/services/orderService.ts`, vendor/user order components | [`ARCHITECTURE_AND_DATA.md`](ARCHITECTURE_AND_DATA.md) |
| Tier 1–3 verification | Active end-to-end vendor submission and admin review | `src/services/verificationService.ts`, `src/components/VerificationProgress.tsx`, `src/components/admin/AdminPanel.tsx`, `functions/src/index.ts` | [`VERIFICATION_OPERATIONS.md`](VERIFICATION_OPERATIONS.md) |
| Endorsements and reports | Active community actions and admin moderation | `src/components/EndorseButton.tsx`, `src/components/ReportDialog.tsx`, `src/components/admin/AdminPanel.tsx` | [`VERIFICATION_OPERATIONS.md`](VERIFICATION_OPERATIONS.md) |
| Private messaging | Active participant-filtered messaging | `src/services/messageService.ts`, `src/components/MessagesPage.tsx`, `src/components/Navigation.tsx` | [`../features/private-messaging.md`](../features/private-messaging.md) |
| Community Hub, events, offers | Feature surfaces exist; scope should be reconfirmed before expansion | `src/pages/` and feature components/services | [`../features/community-hub.md`](../features/community-hub.md), [`../features/events.md`](../features/events.md), [`../features/community-offers.md`](../features/community-offers.md) |
| Favorites | Feature exists | Favorite context/service/components | [`../features/favorites.md`](../features/favorites.md) |
| Homepage / About / Education | Active launch content is seeded | `src/pages/HomePage.tsx`, `src/pages/AboutPage.tsx`, `src/pages/EducationPage.tsx` | [`../features/homepage.md`](../features/homepage.md) |
| Email logging and notifications | Logging exists; delivery validation deferred | `functions/src/index.ts`, `src/services/emailLogService.ts`, `src/components/EmailActivitySection.tsx` | [`BACKLOG_AND_KNOWN_ISSUES.md`](BACKLOG_AND_KNOWN_ISSUES.md) |

## High-Risk Feature Boundaries

These areas routinely require more than a frontend edit.

| Area | Must inspect before changing |
|---|---|
| Verification | Client data source, business/onboarding contract, submission path, Firestore rules, collection-group index, Storage rule, Function authorization, public badge surfaces |
| Orders and payments | Client checkout behavior, order creation source, Stripe Function/webhook behavior, required Firestore indexes, email/log side effects |
| Email | Trigger authority, Function secret, sender-domain verification, provider delivery logs, Firestore `emailLogs`, duplicate prevention |
| Messaging | Participant-filtered query, `messageThreads` and `messages` rules, navigation unread count behavior |
| Public directory | Live/mock mode, onboarding/business merge, public privacy boundary, verification tier override |
| Admin panel | Admin profile/claim contract, Firestore query index/rule behavior, Function authorization for mutations |

## Feature-Test Starting Points

| Feature | Test starting point |
|---|---|
| Verification authorization and tiers | `src/__tests__/verification/VerificationAdminAuthorization.test.ts` |
| Verification UI/service | `src/__tests__/verification/VerificationSession2.test.tsx` |
| Vendor settings | `src/__tests__/pages/VendorSettingsPage.test.tsx` |
| CSV upload | `src/__tests__/components/ProductCsvUpload.test.tsx` |
| Checkout | `src/__tests__/components/Checkout.test.tsx` |
| Stripe service | `src/__tests__/services/stripePaymentService.test.ts` |
| Storage service | `src/__tests__/services/storageService.test.ts` |
| Core types | `src/__tests__/types/types.test.ts` |

## Adding a New Feature

Before creating code:

1. Confirm the user problem, role(s), privacy implications, and success criteria.
2. Decide whether the feature is mock-only, Firebase-backed, or Function-backed.
3. Create a separate Markdown guide under `docs/features/` that states what it does, files involved, safe change instructions, scope-extension instructions, test methods, and deployment requirements.
4. Add it to the feature index and update this catalog.
5. Add automated coverage and an appropriate live/manual test path.
6. Update the backlog/status if the feature changes product priorities.

## References

- [`CURRENT_STATE.md`](CURRENT_STATE.md)
- [`ARCHITECTURE_AND_DATA.md`](ARCHITECTURE_AND_DATA.md)
- [`TESTING_AND_QUALITY.md`](TESTING_AND_QUALITY.md)
- [`../features/README.md`](../features/README.md)
