/**
 * set-admin-claim.js
 *
 * Sets the { admin: true } custom claim on a Firebase Auth user so that
 * Firebase Storage rules can identify them as an admin.
 *
 * Usage:
 *   1. Replace ADMIN_UID below with your admin user's Firebase UID
 *   2. Download a service account key from Firebase Console (see instructions below)
 *   3. Run: GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json node scripts/set-admin-claim.js
 *
 * How to get your service account key:
 *   Firebase Console → Project Settings → Service Accounts → Generate new private key
 *   Save the downloaded JSON file as serviceAccountKey.json in the project root.
 *   (It is already in .gitignore — never commit it.)
 *
 * How to find your Admin UID:
 *   Firebase Console → Authentication → Users → find your admin email → copy the User UID column
 */

// firebase-admin v12+ uses modular imports — admin.auth() no longer exists
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

// ─── REPLACE THIS ─────────────────────────────────────────────────────────────
const ADMIN_UID = 'REPLACE_WITH_YOUR_ADMIN_UID';
// ──────────────────────────────────────────────────────────────────────────────

if (ADMIN_UID === 'REPLACE_WITH_YOUR_ADMIN_UID') {
  console.error('ERROR: Please replace ADMIN_UID in this script with your actual Firebase UID.');
  console.error('Find it at: Firebase Console → Authentication → Users → copy the User UID column');
  process.exit(1);
}

initializeApp({ credential: applicationDefault() });

getAuth()
  .setCustomUserClaims(ADMIN_UID, { admin: true })
  .then(() => {
    console.log(`✅ Admin claim set successfully for UID: ${ADMIN_UID}`);
    console.log('   Sign out and sign back in for the claim to take effect.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Failed to set admin claim:', err.message);
    process.exit(1);
  });
