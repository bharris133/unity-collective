#!/usr/bin/env node
/**
 * Controlled QA fixture manager for Unity Collective.
 *
 * This is intentionally a local operator tool. It creates only records with
 * stable `qa_` identifiers, records every created document in a local manifest,
 * and reset deletes only IDs listed in that manifest. It never bulk-deletes a
 * collection and never accepts a Stripe live-mode key.
 *
 * Usage:
 *   QA_FIXTURE_PASSWORD='local-only-password' \
 *   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json \
 *   node scripts/qa-fixtures.cjs seed --project unity-collective --confirm-live
 *
 *   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json \
 *   node scripts/qa-fixtures.cjs inspect --project unity-collective --confirm-live
 *
 *   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json \
 *   node scripts/qa-fixtures.cjs reset --project unity-collective --confirm-live
 *
 * Optional Stripe test-key check (no Stripe object is created and no charge is made):
 *   STRIPE_SECRET_KEY=sk_test_... node scripts/qa-fixtures.cjs stripe-check
 */

const fs = require('node:fs');
const path = require('node:path');
const { initializeApp, applicationDefault, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const FIXTURE_MARKER = 'unity-collective-controlled-qa-fixture';
const MANIFEST_VERSION = 1;
const DEFAULT_PROJECT = 'unity-collective';
const DEFAULT_MANIFEST = '.qa-fixtures-manifest.json';

function printUsage() {
  console.log(`\nControlled QA fixture manager\n\nCommands:\n  seed          Create or refresh the labeled Firebase Auth and Firestore fixture set\n  inspect       Print the manifest and whether its tracked Firestore records exist\n  reset         Delete only records and Auth accounts listed in the manifest\n  stripe-check  Verify that an explicitly supplied Stripe secret key is test-mode\n\nRequired for seed, inspect, and reset:\n  --project unity-collective --confirm-live\n\nOptional:\n  --manifest <path>   Default: ${DEFAULT_MANIFEST}\n\nSafety:\n  - This utility only permits the ${DEFAULT_PROJECT} Firebase project.\n  - Seed/reset require --confirm-live.\n  - Reset refuses manifests without the ${FIXTURE_MARKER} marker.\n  - Stripe validation refuses keys that do not start with sk_test_.\n`);
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = { manifest: DEFAULT_MANIFEST, confirmLive: false, project: '' };

  for (let index = 0; index < rest.length; index += 1) {
    const value = rest[index];
    if (value === '--confirm-live') options.confirmLive = true;
    else if (value === '--manifest') options.manifest = rest[++index] || '';
    else if (value === '--project') options.project = rest[++index] || '';
    else throw new Error(`Unknown option: ${value}`);
  }

  return { command, options };
}

function assertLiveFirebaseGate(options) {
  if (!options.confirmLive) {
    throw new Error('Refusing live operation: add --confirm-live after verifying the selected Firebase project.');
  }
  if (options.project !== DEFAULT_PROJECT) {
    throw new Error(`Refusing project "${options.project || '(missing)'}". This utility only permits "${DEFAULT_PROJECT}".`);
  }
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS must point to an approved local Firebase service-account JSON file.');
  }
}

function manifestPath(options) {
  return path.resolve(process.cwd(), options.manifest || DEFAULT_MANIFEST);
}

function initializeAdmin(projectId) {
  if (!getApps().length) {
    initializeApp({ credential: applicationDefault(), projectId });
  }
  return { auth: getAuth(), db: getFirestore() };
}

function requireFixturePassword() {
  const password = process.env.QA_FIXTURE_PASSWORD;
  if (!password || password.length < 12) {
    throw new Error('QA_FIXTURE_PASSWORD must be set locally and contain at least 12 characters before seeding test accounts.');
  }
  return password;
}

function fixturePlan() {
  const users = [
    {
      uid: 'qa_admin_001', email: 'qa-admin@fixture.unitycollective.test', displayName: 'QA Administrator',
      firstName: 'QA', lastName: 'Administrator', role: 'admin', isAdmin: true, businessOwner: false,
    },
    {
      uid: 'qa_vendor_001', email: 'qa-vendor-one@fixture.unitycollective.test', displayName: 'QA Vendor One',
      firstName: 'QA', lastName: 'Vendor One', role: 'vendor', isAdmin: false, businessOwner: true,
      businessName: 'QA Heritage Market', location: 'Chicago, IL',
    },
    {
      uid: 'qa_vendor_002', email: 'qa-vendor-two@fixture.unitycollective.test', displayName: 'QA Vendor Two',
      firstName: 'QA', lastName: 'Vendor Two', role: 'vendor', isAdmin: false, businessOwner: true,
      businessName: 'QA Culture Studio', location: 'Atlanta, GA',
    },
    {
      uid: 'qa_buyer_001', email: 'qa-buyer-one@fixture.unitycollective.test', displayName: 'QA Buyer One',
      firstName: 'QA', lastName: 'Buyer One', role: 'buyer', isAdmin: false, businessOwner: false,
    },
    {
      uid: 'qa_buyer_002', email: 'qa-buyer-two@fixture.unitycollective.test', displayName: 'QA Buyer Two',
      firstName: 'QA', lastName: 'Buyer Two', role: 'buyer', isAdmin: false, businessOwner: false,
    },
  ];

  const stores = [
    {
      uid: 'qa_vendor_001', businessName: 'QA Heritage Market', category: 'Food & Beverage',
      description: 'Controlled QA fixture store for marketplace, report, and order-flow validation.',
      location: 'Chicago, IL', email: 'qa-vendor-one@fixture.unitycollective.test', phone: '555-0101',
      website: 'https://fixture.unitycollective.test/heritage-market', verificationTier: 1,
    },
    {
      uid: 'qa_vendor_002', businessName: 'QA Culture Studio', category: 'Arts & Crafts',
      description: 'Controlled QA fixture store for directory, endorsement, and verification-flow validation.',
      location: 'Atlanta, GA', email: 'qa-vendor-two@fixture.unitycollective.test', phone: '555-0102',
      website: 'https://fixture.unitycollective.test/culture-studio', verificationTier: 2,
    },
  ];

  const products = [
    {
      productId: 'qa_product_heritage_001', vendorId: 'qa_vendor_001', name: 'QA Heritage Coffee Sampler',
      description: 'Fixture product for cart, marketplace, and vendor-order testing.', price: 1899,
      category: 'Food & Beverage', images: [], inStock: true, stockQuantity: 24, tags: ['qa-fixture', 'coffee'],
    },
    {
      productId: 'qa_product_heritage_002', vendorId: 'qa_vendor_001', name: 'QA Heritage Gift Box',
      description: 'Fixture product for multi-item checkout and order-history testing.', price: 3499,
      category: 'Food & Beverage', images: [], inStock: true, stockQuantity: 12, tags: ['qa-fixture', 'gift'],
    },
    {
      productId: 'qa_product_culture_001', vendorId: 'qa_vendor_002', name: 'QA Culture Print',
      description: 'Fixture product for directory-to-storefront and marketplace testing.', price: 2500,
      category: 'Art & Collectibles', images: [], inStock: true, stockQuantity: 8, tags: ['qa-fixture', 'art'],
    },
  ];

  const orders = [
    {
      orderId: 'qa_order_paid_001', userId: 'qa_buyer_001', vendorId: 'qa_vendor_001',
      items: [{ productId: 'qa_product_heritage_001', name: 'QA Heritage Coffee Sampler', quantity: 1, price: 1899 }],
      subtotal: 1899, tax: 152, shipping: 0, platformFee: 0, total: 2051, status: 'paid',
      stripeSessionId: 'qa_seed_no_stripe_session', stripePaymentIntentId: 'qa_seed_no_stripe_payment_intent',
    },
    {
      orderId: 'qa_order_delivered_001', userId: 'qa_buyer_002', vendorId: 'qa_vendor_001',
      items: [
        { productId: 'qa_product_heritage_001', name: 'QA Heritage Coffee Sampler', quantity: 1, price: 1899 },
        { productId: 'qa_product_heritage_002', name: 'QA Heritage Gift Box', quantity: 1, price: 3499 },
      ],
      subtotal: 5398, tax: 432, shipping: 0, platformFee: 0, total: 5830, status: 'delivered',
      stripeSessionId: 'qa_seed_no_stripe_session', stripePaymentIntentId: 'qa_seed_no_stripe_payment_intent',
    },
  ];

  const reports = [
    {
      reportId: 'qa_report_open_001', businessId: 'qa_vendor_001', reportedBy: 'qa_buyer_001',
      reason: 'other', detail: 'QA fixture: open report for the Moderation queue.', status: 'open',
      moderatorNotes: null, resolvedBy: null, resolvedAt: null,
    },
    {
      reportId: 'qa_report_resolved_001', businessId: 'qa_vendor_002', reportedBy: 'qa_buyer_002',
      reason: 'inappropriate', detail: 'QA fixture: resolved report for Decision History.', status: 'resolved',
      moderatorNotes: 'QA fixture decision history record.', resolvedBy: 'qa_admin_001',
    },
  ];

  const endorsements = [
    {
      endorsementId: 'qa_endorsement_001', businessId: 'qa_vendor_002', fromUserId: 'qa_buyer_001',
      relationship: 'customer', comment: 'QA fixture: positive customer endorsement.', weight: 1,
    },
    {
      endorsementId: 'qa_endorsement_002', businessId: 'qa_vendor_002', fromUserId: 'qa_vendor_001',
      relationship: 'fellow_owner', comment: 'QA fixture: fellow business owner endorsement.', weight: 1,
    },
  ];

  const submissions = [
    {
      submissionId: 'qa_submission_pending_001', businessId: 'qa_vendor_001', type: 'document', status: 'pending',
      fileUrls: [], notes: 'QA fixture: pending Tier 3 review without an uploaded document.',
      reviewedBy: null, reviewedAt: null, rejectionReason: null,
    },
  ];

  return { users, stores, products, orders, reports, endorsements, submissions };
}

function fixtureMetadata(runId) {
  return {
    qaFixture: true,
    qaFixtureMarker: FIXTURE_MARKER,
    qaFixtureRunId: runId,
    qaFixtureCreatedAt: FieldValue.serverTimestamp(),
  };
}

function shippingAddress() {
  return {
    fullName: 'QA Buyer', addressLine1: '100 QA Test Way', city: 'Chicago', state: 'IL',
    zipCode: '60601', country: 'US', phone: '555-0199',
  };
}

function documentPaths(plan) {
  const paths = [];
  plan.users.forEach(({ uid }) => paths.push(`users/${uid}`));
  plan.stores.forEach(({ uid }) => {
    paths.push(`onboarding/${uid}`);
    paths.push(`businesses/${uid}`);
  });
  plan.products.forEach(({ productId }) => paths.push(`products/${productId}`));
  plan.orders.forEach(({ orderId }) => paths.push(`orders/${orderId}`));
  plan.reports.forEach(({ reportId }) => paths.push(`reports/${reportId}`));
  plan.endorsements.forEach(({ endorsementId }) => paths.push(`endorsements/${endorsementId}`));
  plan.submissions.forEach(({ businessId, submissionId }) => paths.push(`businesses/${businessId}/verificationSubmissions/${submissionId}`));
  return paths;
}

async function upsertAuthUser(auth, user, password) {
  try {
    const existing = await auth.getUser(user.uid);
    if (existing.email !== user.email) {
      throw new Error(`Existing QA Auth UID ${user.uid} has an unexpected email and will not be modified.`);
    }
    await auth.updateUser(user.uid, { password, displayName: user.displayName, emailVerified: true, disabled: false });
  } catch (error) {
    if (error.code !== 'auth/user-not-found') throw error;
    await auth.createUser({
      uid: user.uid, email: user.email, password, displayName: user.displayName, emailVerified: true,
    });
  }
}

async function seed(options) {
  assertLiveFirebaseGate(options);
  const password = requireFixturePassword();
  const { auth, db } = initializeAdmin(options.project);
  const plan = fixturePlan();
  const runId = new Date().toISOString().replace(/[:.]/g, '-');

  for (const user of plan.users) {
    await upsertAuthUser(auth, user, password);
  }
  await auth.setCustomUserClaims('qa_admin_001', { admin: true, qaFixture: true });

  const batch = db.batch();
  const metadata = fixtureMetadata(runId);
  for (const user of plan.users) {
    batch.set(db.doc(`users/${user.uid}`), {
      uid: user.uid, email: user.email, displayName: user.displayName, firstName: user.firstName,
      lastName: user.lastName, role: user.role, businessOwner: user.businessOwner,
      businessName: user.businessName || '', location: user.location || '', interests: [], favorites: [],
      orderHistory: [], joinedAt: new Date().toISOString(), isAdmin: user.isAdmin,
      profilePicture: '', bio: 'Controlled QA fixture account.', phone: '', website: '', ...metadata,
    }, { merge: true });
  }

  for (const store of plan.stores) {
    const completeSteps = ['registration', 'business-profile', 'verification', 'products', 'review', 'complete'];
    batch.set(db.doc(`onboarding/${store.uid}`), {
      memberId: store.uid, currentStep: 'complete', completedSteps: completeSteps,
      businessProfile: {
        businessName: store.businessName, category: store.category, description: store.description,
        location: store.location, phone: store.phone, email: store.email, website: store.website,
      },
      isBlackOwned: true, verificationStatus: 'verified', verificationTier: store.verificationTier,
      verificationDocs: [], skippedProducts: false, startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(), ...metadata,
    }, { merge: true });
    batch.set(db.doc(`businesses/${store.uid}`), {
      ownerId: store.uid, businessName: store.businessName, category: store.category,
      description: store.description, location: store.location, website: store.website, logoUrl: '',
      verificationTier: store.verificationTier, selfAttestedAt: FieldValue.serverTimestamp(),
      verifiedByCommunityAt: store.verificationTier >= 2 ? FieldValue.serverTimestamp() : null,
      documentVerifiedAt: null, trustScore: store.verificationTier >= 2 ? 3 : 0,
      endorserIds: store.verificationTier >= 2 ? ['qa_buyer_001', 'qa_vendor_001'] : [],
      partnerOrgId: null, flaggedForReview: false, ...metadata,
    }, { merge: true });
  }

  for (const product of plan.products) {
    batch.set(db.doc(`products/${product.productId}`), {
      ...product, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(), ...metadata,
    }, { merge: true });
  }

  for (const order of plan.orders) {
    batch.set(db.doc(`orders/${order.orderId}`), {
      ...order, shippingAddress: shippingAddress(), createdAt: FieldValue.serverTimestamp(),
      paidAt: FieldValue.serverTimestamp(),
      ...(order.status === 'delivered' ? { deliveredAt: FieldValue.serverTimestamp() } : {}),
      ...metadata,
    }, { merge: true });
  }

  for (const report of plan.reports) {
    batch.set(db.doc(`reports/${report.reportId}`), {
      ...report, createdAt: FieldValue.serverTimestamp(),
      ...(report.status === 'resolved' ? { resolvedAt: FieldValue.serverTimestamp() } : {}),
      ...metadata,
    }, { merge: true });
  }

  for (const endorsement of plan.endorsements) {
    batch.set(db.doc(`endorsements/${endorsement.endorsementId}`), {
      ...endorsement, createdAt: FieldValue.serverTimestamp(), ...metadata,
    }, { merge: true });
  }

  for (const submission of plan.submissions) {
    batch.set(db.doc(`businesses/${submission.businessId}/verificationSubmissions/${submission.submissionId}`), {
      ...submission, createdAt: FieldValue.serverTimestamp(), ...metadata,
    }, { merge: true });
  }

  await batch.commit();
  const manifest = {
    version: MANIFEST_VERSION, marker: FIXTURE_MARKER, projectId: options.project, runId,
    createdAt: new Date().toISOString(), authUserIds: plan.users.map(user => user.uid),
    documentPaths: documentPaths(plan),
  };
  fs.writeFileSync(manifestPath(options), `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o600 });

  console.log(`✅ Seeded ${manifest.authUserIds.length} QA Auth users and ${manifest.documentPaths.length} manifest-tracked Firestore documents.`);
  console.log(`   Manifest: ${manifestPath(options)}`);
  console.log('   Stripe fields on seeded orders are explicit non-payment placeholders. Run a real Stripe test-mode checkout separately.');
}

async function collectDynamicQaDocumentPaths(db, plan) {
  const paths = new Set();
  const vendorIds = plan.stores.map(store => store.uid);
  const buyerIds = plan.users.filter(user => user.role === 'buyer').map(user => user.uid);
  const qaUserIds = plan.users.map(user => user.uid);

  const collectByField = async (collectionName, field, values) => {
    for (let index = 0; index < values.length; index += 10) {
      const snapshot = await db.collection(collectionName).where(field, 'in', values.slice(index, index + 10)).get();
      snapshot.docs.forEach(docSnapshot => paths.add(docSnapshot.ref.path));
    }
  };

  // These queries are confined to stable QA owners/fixtures. They remove records
  // created through normal test flows after seed, without scanning a collection.
  await Promise.all([
    collectByField('products', 'vendorId', vendorIds),
    collectByField('orders', 'userId', buyerIds),
    collectByField('reports', 'reportedBy', buyerIds),
    collectByField('reports', 'businessId', vendorIds),
    collectByField('endorsements', 'fromUserId', qaUserIds),
    collectByField('endorsements', 'businessId', vendorIds),
  ]);

  const orderIds = [...paths]
    .filter(docPath => docPath.startsWith('orders/'))
    .map(docPath => docPath.split('/')[1]);
  if (orderIds.length) {
    await collectByField('emailLogs', 'orderId', orderIds);
  }

  for (const vendorId of vendorIds) {
    const submissions = await db.collection(`businesses/${vendorId}/verificationSubmissions`).get();
    submissions.docs.forEach(docSnapshot => paths.add(docSnapshot.ref.path));
    paths.add(`businessVerifications/${vendorId}`);
  }

  return [...paths];
}

function loadManifest(options) {
  const resolvedPath = manifestPath(options);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`No fixture manifest found at ${resolvedPath}. Refusing to infer deletions.`);
  }
  const manifest = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
  if (manifest.marker !== FIXTURE_MARKER || manifest.version !== MANIFEST_VERSION) {
    throw new Error('Fixture manifest marker/version is invalid. Refusing to delete anything.');
  }
  if (manifest.projectId !== options.project) {
    throw new Error(`Manifest project (${manifest.projectId}) does not match --project (${options.project}). Refusing to delete.`);
  }
  if (!Array.isArray(manifest.documentPaths) || !Array.isArray(manifest.authUserIds)) {
    throw new Error('Fixture manifest is incomplete. Refusing to delete anything.');
  }
  return { manifest, resolvedPath };
}

async function inspect(options) {
  assertLiveFirebaseGate(options);
  const { db } = initializeAdmin(options.project);
  const { manifest, resolvedPath } = loadManifest(options);
  const snapshots = await Promise.all(manifest.documentPaths.map(docPath => db.doc(docPath).get()));
  const existing = snapshots.filter(snapshot => snapshot.exists).length;
  console.log(JSON.stringify({
    manifest: resolvedPath,
    projectId: manifest.projectId,
    runId: manifest.runId,
    trackedAuthUsers: manifest.authUserIds.length,
    trackedFirestoreDocuments: manifest.documentPaths.length,
    existingFirestoreDocuments: existing,
  }, null, 2));
}

async function reset(options) {
  assertLiveFirebaseGate(options);
  const { auth, db } = initializeAdmin(options.project);
  const { manifest, resolvedPath } = loadManifest(options);
  const plan = fixturePlan();
  const dynamicQaPaths = await collectDynamicQaDocumentPaths(db, plan);
  const pathsToDelete = [...new Set([...manifest.documentPaths, ...dynamicQaPaths])];

  // Delete only manifest-tracked documents or records owned by stable QA fixture IDs.
  // Each batch stays well under Firestore's 500-operation limit.
  for (let index = 0; index < pathsToDelete.length; index += 400) {
    const batch = db.batch();
    pathsToDelete.slice(index, index + 400).forEach(docPath => batch.delete(db.doc(docPath)));
    await batch.commit();
  }

  for (const uid of manifest.authUserIds) {
    try {
      const user = await auth.getUser(uid);
      if (!user.email?.endsWith('@fixture.unitycollective.test')) {
        throw new Error(`Auth UID ${uid} does not have a QA fixture email. Refusing to delete.`);
      }
      await auth.deleteUser(uid);
    } catch (error) {
      if (error.code !== 'auth/user-not-found') throw error;
    }
  }

  fs.unlinkSync(resolvedPath);
  console.log(`✅ Deleted ${pathsToDelete.length} manifest-tracked or QA-owner-scoped Firestore documents and ${manifest.authUserIds.length} QA Auth users.`);
}

async function stripeCheck() {
  const key = process.env.STRIPE_SECRET_KEY || '';
  if (!key.startsWith('sk_test_')) {
    throw new Error('STRIPE_SECRET_KEY must be a Stripe test-mode secret key (sk_test_...). Live keys are refused.');
  }
  const response = await fetch('https://api.stripe.com/v1/account', {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!response.ok) {
    throw new Error(`Stripe test-mode check failed: ${response.status} ${await response.text()}`);
  }
  const account = await response.json();
  console.log(JSON.stringify({ connected: true, livemode: account.livemode, accountId: account.id }, null, 2));
  if (account.livemode) throw new Error('Stripe returned a live-mode account. No live-mode operation is permitted.');
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));
  if (command === 'seed') return seed(options);
  if (command === 'inspect') return inspect(options);
  if (command === 'reset') return reset(options);
  if (command === 'stripe-check') return stripeCheck();
  printUsage();
  process.exitCode = 1;
}

if (require.main === module) {
  main().catch(error => {
    console.error(`❌ ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { FIXTURE_MARKER, DEFAULT_PROJECT, fixturePlan, parseArgs, assertLiveFirebaseGate };
