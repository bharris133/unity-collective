/**
 * 3-Tier Verification System — Type Definitions
 *
 * Tier 1 — Self-Declared:   Owner affirms Black ownership during onboarding.
 * Tier 2 — Community Verified: 3+ weighted endorsements or partner org review.
 * Tier 3 — Document Certified: Official cert (NMSDC, state MBE, etc.) reviewed by moderator.
 *
 * Progression is one-directional. Downgrade only via moderator-validated report.
 */

export type VerificationTier = 1 | 2 | 3;

// ─── businesses/{uid} additions ──────────────────────────────────────────────

export interface BusinessVerification {
  verificationTier: VerificationTier;
  selfAttestedAt: string | null;           // ISO timestamp — set when onboarding completes with isBlackOwned=true
  verifiedByCommunityAt: string | null;    // ISO timestamp — set when trustScore crosses threshold
  documentVerifiedAt: string | null;       // ISO timestamp — set when moderator approves Tier 3 submission
  trustScore: number;                      // 0-100, computed from endorsement weights
  endorserIds: string[];                   // UIDs of users who endorsed this business
  partnerOrgId: string | null;             // UID of partner org that verified, if any
  flaggedForReview: boolean;               // Set true when 3+ reports in 7 days
}

// ─── businesses/{bizId}/verificationSubmissions/{subId} ──────────────────────

export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'needs_info';
export type SubmissionType = 'document' | 'video' | 'other';

export interface VerificationSubmission {
  submissionId: string;
  businessId: string;
  type: SubmissionType;
  status: SubmissionStatus;
  fileUrls: string[];
  notes: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
}

// ─── endorsements/{endorsementId} ────────────────────────────────────────────

export type EndorsementRelationship = 'customer' | 'know_owner' | 'fellow_owner' | 'partner_org';

export interface Endorsement {
  endorsementId: string;
  businessId: string;
  fromUserId: string;
  relationship: EndorsementRelationship;
  comment: string;
  weight: number;    // 1-10 based on endorser's own tier: Tier1=1, Tier2=2, Tier3=5
  createdAt: string;
}

// ─── reports/{reportId} ──────────────────────────────────────────────────────

export type ReportReason = 'suspected_fake_ownership' | 'inappropriate' | 'spam' | 'other';
export type ReportStatus = 'open' | 'investigating' | 'resolved' | 'dismissed';

export interface Report {
  reportId: string;
  businessId: string;
  reportedBy: string;
  reason: ReportReason;
  detail: string;
  status: ReportStatus;
  moderatorNotes: string | null;
  resolvedBy: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

// ─── partnerOrganizations/{orgId} ────────────────────────────────────────────

export interface PartnerOrganization {
  orgId: string;
  name: string;
  city: string;
  badgeLabel: string;       // e.g. "Verified by Atlanta Black Chamber"
  moderatorUids: string[];
  active: boolean;
}
