/**
 * Verification Service
 *
 * Reads and writes the 3-tier verification data model:
 *   - businesses/{uid}  (verificationTier + related fields)
 *   - businesses/{bizId}/verificationSubmissions
 *   - endorsements
 *   - reports
 *
 * All writes that change verificationTier are done via Cloud Functions (Session 2).
 * This service handles reads and user-initiated writes (endorse, report, submit doc).
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import type {
  BusinessVerification,
  Endorsement,
  EndorsementRelationship,
  Report,
  ReportReason,
  VerificationSubmission,
  VerificationTier,
} from '../types/Verification';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// ─── Default verification state for a new business ───────────────────────────

export function defaultBusinessVerification(selfAttested: boolean): BusinessVerification {
  return {
    verificationTier: 1,
    selfAttestedAt: selfAttested ? new Date().toISOString() : null,
    verifiedByCommunityAt: null,
    documentVerifiedAt: null,
    trustScore: 0,
    endorserIds: [],
    partnerOrgId: null,
    flaggedForReview: false,
  };
}

// ─── Read business verification fields ───────────────────────────────────────

export async function getBusinessVerification(businessId: string): Promise<BusinessVerification | null> {
  if (USE_MOCK) return getMockVerification(businessId);

  const snap = await getDoc(doc(db, 'businesses', businessId));
  if (!snap.exists()) return null;

  const data = snap.data();
  // Only return verification fields; businesses doc may have other override fields
  return {
    verificationTier: (data.verificationTier as VerificationTier) ?? 1,
    selfAttestedAt: data.selfAttestedAt instanceof Timestamp
      ? data.selfAttestedAt.toDate().toISOString()
      : data.selfAttestedAt ?? null,
    verifiedByCommunityAt: data.verifiedByCommunityAt instanceof Timestamp
      ? data.verifiedByCommunityAt.toDate().toISOString()
      : data.verifiedByCommunityAt ?? null,
    documentVerifiedAt: data.documentVerifiedAt instanceof Timestamp
      ? data.documentVerifiedAt.toDate().toISOString()
      : data.documentVerifiedAt ?? null,
    trustScore: data.trustScore ?? 0,
    endorserIds: data.endorserIds ?? [],
    partnerOrgId: data.partnerOrgId ?? null,
    flaggedForReview: data.flaggedForReview ?? false,
  };
}

// ─── Set Tier 1 on onboarding completion ─────────────────────────────────────

export async function setTier1OnAttestation(businessId: string): Promise<void> {
  if (USE_MOCK) return;

  await setDoc(
    doc(db, 'businesses', businessId),
    {
      verificationTier: 1,
      selfAttestedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

// ─── Endorsements ─────────────────────────────────────────────────────────────

export async function getEndorsementsForBusiness(businessId: string): Promise<Endorsement[]> {
  if (USE_MOCK) return getMockEndorsements(businessId);

  // Single-field filter only — no composite index needed
  const q = query(
    collection(db, 'endorsements'),
    where('businessId', '==', businessId)
  );
  const snap = await getDocs(q);
  const endorsements = snap.docs.map(d => ({ endorsementId: d.id, ...d.data() } as Endorsement));
  // Sort client-side by createdAt descending
  return endorsements.sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
}

export async function hasUserEndorsed(businessId: string, userId: string): Promise<boolean> {
  if (USE_MOCK) return false;

  const q = query(
    collection(db, 'endorsements'),
    where('businessId', '==', businessId),
    where('fromUserId', '==', userId)
  );
  const snap = await getDocs(q);
  return !snap.empty;
}

export async function addEndorsement(
  businessId: string,
  fromUserId: string,
  relationship: EndorsementRelationship,
  comment: string,
  endorserTier: VerificationTier
): Promise<void> {
  const weight = endorserTier === 3 ? 5 : endorserTier === 2 ? 2 : 1;

  await addDoc(collection(db, 'endorsements'), {
    businessId,
    fromUserId,
    relationship,
    comment,
    weight,
    createdAt: serverTimestamp(),
  });
}

// ─── Reports ─────────────────────────────────────────────────────────────────

export async function submitReport(
  businessId: string,
  reportedBy: string,
  reason: ReportReason,
  detail: string
): Promise<void> {
  await addDoc(collection(db, 'reports'), {
    businessId,
    reportedBy,
    reason,
    detail,
    status: 'open',
    moderatorNotes: null,
    resolvedBy: null,
    createdAt: serverTimestamp(),
    resolvedAt: null,
  });
}

// ─── Verification submissions ─────────────────────────────────────────────────

export async function getSubmissionsForBusiness(businessId: string): Promise<VerificationSubmission[]> {
  if (USE_MOCK) return getMockSubmissions(businessId);

  const q = query(
    collection(db, 'businesses', businessId, 'verificationSubmissions'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ submissionId: d.id, businessId, ...d.data() } as VerificationSubmission));
}

// ─── Admin: all pending submissions across all businesses ────────────────────

export async function getAllPendingSubmissions(): Promise<VerificationSubmission[]> {
  if (USE_MOCK) return getMockAllPendingSubmissions();

  // Avoid composite index requirement: filter by status only, sort client-side
  const { collectionGroup } = await import('firebase/firestore');
  const q = query(
    collectionGroup(db, 'verificationSubmissions'),
    where('status', '==', 'pending')
  );
  const snap = await getDocs(q);
  const submissions = snap.docs.map(d => {
    const bizId = d.ref.parent.parent?.id ?? '';
    return { submissionId: d.id, businessId: bizId, ...d.data() } as VerificationSubmission;
  });
  // Sort client-side by createdAt descending
  return submissions.sort((a, b) => {
    const aTime = (a.createdAt as any)?.toMillis?.() ?? new Date(a.createdAt as string).getTime() ?? 0;
    const bTime = (b.createdAt as any)?.toMillis?.() ?? new Date(b.createdAt as string).getTime() ?? 0;
    return bTime - aTime;
  });
}

// ─── Admin: all open reports ──────────────────────────────────────────────────

export async function getAllOpenReports(): Promise<Report[]> {
  if (USE_MOCK) return getMockOpenReports();

  // Avoid composite index requirement by filtering status only, then sorting client-side
  const q = query(
    collection(db, 'reports'),
    where('status', 'in', ['open', 'investigating'])
  );
  const snap = await getDocs(q);
  const reports = snap.docs.map(d => ({ reportId: d.id, ...d.data() } as Report));
  // Sort client-side by createdAt descending
  return reports.sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
}

// ─── Admin: all flagged businesses ───────────────────────────────────────────

export async function getFlaggedBusinesses(): Promise<{ businessId: string; flaggedForReview: boolean }[]> {
  if (USE_MOCK) return getMockFlaggedBusinesses();

  const q = query(
    collection(db, 'businesses'),
    where('flaggedForReview', '==', true)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ businessId: d.id, flaggedForReview: true }));
}

// ─── Mock data ────────────────────────────────────────────────────────────────

function getMockVerification(businessId: string): BusinessVerification {
  const mockTiers: Record<string, BusinessVerification> = {
    'mock-vendor-001': {
      verificationTier: 3,
      selfAttestedAt: '2025-06-10T00:00:00.000Z',
      verifiedByCommunityAt: '2025-07-01T00:00:00.000Z',
      documentVerifiedAt: '2025-07-15T00:00:00.000Z',
      trustScore: 72,
      endorserIds: ['mock-user-001', 'mock-user-003', 'mock-user-004'],
      partnerOrgId: null,
      flaggedForReview: false,
    },
    'mock-user-002': {
      verificationTier: 1,
      selfAttestedAt: '2026-05-20T00:00:00.000Z',
      verifiedByCommunityAt: null,
      documentVerifiedAt: null,
      trustScore: 3,
      endorserIds: ['mock-user-005'],
      partnerOrgId: null,
      flaggedForReview: false,
    },
  };
  return mockTiers[businessId] ?? defaultBusinessVerification(false);
}

function getMockEndorsements(businessId: string): Endorsement[] {
  if (businessId !== 'mock-vendor-001') return [];
  return [
    { endorsementId: 'end-001', businessId, fromUserId: 'mock-user-001', relationship: 'customer', comment: 'Great products, authentic owner!', weight: 1, createdAt: '2025-07-01T00:00:00.000Z' },
    { endorsementId: 'end-002', businessId, fromUserId: 'mock-user-003', relationship: 'fellow_owner', comment: 'Verified at our local market.', weight: 2, createdAt: '2025-07-02T00:00:00.000Z' },
    { endorsementId: 'end-003', businessId, fromUserId: 'mock-user-004', relationship: 'know_owner', comment: '', weight: 1, createdAt: '2025-07-03T00:00:00.000Z' },
  ];
}

function getMockSubmissions(businessId: string): VerificationSubmission[] {
  if (businessId !== 'mock-vendor-001') return [];
  return [
    {
      submissionId: 'sub-001',
      businessId,
      type: 'document',
      status: 'approved',
      fileUrls: ['https://storage.example.com/mock-cert.pdf'],
      notes: 'NMSDC certification attached.',
      reviewedBy: 'mock-admin-001',
      reviewedAt: '2025-07-15T00:00:00.000Z',
      rejectionReason: null,
      createdAt: '2025-07-10T00:00:00.000Z',
    },
  ];
}

function getMockAllPendingSubmissions(): VerificationSubmission[] {
  return [
    {
      submissionId: 'sub-002',
      businessId: 'mock-user-002',
      type: 'document',
      status: 'pending',
      fileUrls: ['https://storage.example.com/mock-ein.pdf'],
      notes: 'EIN document for Chen Creative Studio.',
      reviewedBy: null,
      reviewedAt: null,
      rejectionReason: null,
      createdAt: '2026-05-22T00:00:00.000Z',
    },
    {
      submissionId: 'sub-003',
      businessId: 'mock-biz-003',
      type: 'document',
      status: 'pending',
      fileUrls: ['https://storage.example.com/mock-mbe.pdf'],
      notes: 'State MBE certification.',
      reviewedBy: null,
      reviewedAt: null,
      rejectionReason: null,
      createdAt: '2026-05-25T00:00:00.000Z',
    },
  ];
}

function getMockOpenReports(): Report[] {
  return [
    {
      reportId: 'rep-001',
      businessId: 'mock-biz-004',
      reportedBy: 'mock-user-007',
      reason: 'suspected_fake_ownership',
      detail: 'Owner does not appear to be Black-owned based on public records.',
      status: 'open',
      moderatorNotes: null,
      resolvedBy: null,
      createdAt: '2026-07-20T00:00:00.000Z',
      resolvedAt: null,
    },
  ];
}

function getMockFlaggedBusinesses(): { businessId: string; flaggedForReview: boolean }[] {
  return [{ businessId: 'mock-biz-004', flaggedForReview: true }];
}
