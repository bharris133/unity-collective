export const PARTNER_CANDIDATE_CATEGORIES = [
  'Food & Beverage',
  'Fashion & Apparel',
  'Beauty & Personal Care',
  'Technology',
  'Professional Services',
  'Arts & Crafts',
  'Home & Garden',
  'Health & Wellness',
  'Education & Training',
  'Entertainment',
  'Other',
] as const;

export const PARTNER_CANDIDATE_CSV_HEADERS = [
  'business_name',
  'primary_contact_name',
  'contact_email',
  'city',
  'state',
  'category',
  'website',
  'partner_member_id',
] as const;

export type PartnerCandidateCategory = typeof PARTNER_CANDIDATE_CATEGORIES[number];
export type PartnerCandidateStatus = 'private_ready';

export interface PartnerOrganization {
  name: string;
  city: string;
  state: string;
  agreementVersion: string;
  active: boolean;
}

export interface PartnerStaffAccess {
  role: 'staff';
  active: boolean;
}

export interface PartnerCandidateInput {
  businessName: string;
  primaryContactName: string;
  contactEmail: string;
  city: string;
  state: string;
  category: string;
  website: string;
  partnerMemberId: string;
}

export interface PartnerCandidate extends PartnerCandidateInput {
  candidateId: string;
  status: PartnerCandidateStatus;
}

export interface ParsedPartnerCandidate extends PartnerCandidateInput {
  rowIndex: number;
  errors: string[];
}

export interface PartnerPortalAccess {
  organization: PartnerOrganization;
  staff: PartnerStaffAccess;
}

export interface ProvisionPartnerOrganizationInput {
  name: string;
  city: string;
  state: string;
  agreementVersion: string;
  staffEmail: string;
  trainingConfirmed: boolean;
}
