import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import {
  PARTNER_CANDIDATE_CATEGORIES,
  PARTNER_CANDIDATE_CSV_HEADERS,
  type PartnerCandidate,
  type PartnerCandidateInput,
  type PartnerPortalAccess,
  type ParsedPartnerCandidate,
  type ProvisionPartnerOrganizationInput,
} from '../types/Partner';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (character === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += character;
    }
  }

  values.push(current);
  return values;
}

function normalizeCandidate(values: string[]): PartnerCandidateInput {
  const [businessName = '', primaryContactName = '', contactEmail = '', city = '', state = '', category = '', website = '', partnerMemberId = ''] = values;
  return {
    businessName: businessName.trim(),
    primaryContactName: primaryContactName.trim(),
    contactEmail: contactEmail.trim(),
    city: city.trim(),
    state: state.trim(),
    category: category.trim(),
    website: website.trim(),
    partnerMemberId: partnerMemberId.trim(),
  };
}

export function validatePartnerCandidate(candidate: PartnerCandidateInput): string[] {
  const errors: string[] = [];
  if (!candidate.businessName) errors.push('Business name is required');
  if (!candidate.primaryContactName) errors.push('Primary contact name is required');
  if (!EMAIL_PATTERN.test(candidate.contactEmail)) errors.push('A valid contact email is required');
  if (!candidate.city) errors.push('City is required');
  if (!candidate.state) errors.push('State is required');
  if (candidate.category && !(PARTNER_CANDIDATE_CATEGORIES as readonly string[]).includes(candidate.category)) {
    errors.push(`Unknown category: "${candidate.category}"`);
  }
  if (candidate.website) {
    try {
      const url = new URL(candidate.website);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported protocol');
    } catch {
      errors.push('Website must be a valid http(s) URL');
    }
  }
  return errors;
}

export function parsePartnerCandidateCsv(csvText: string): ParsedPartnerCandidate[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map(header => header.trim());
  const expectedHeaders = [...PARTNER_CANDIDATE_CSV_HEADERS];
  if (headers.length !== expectedHeaders.length || headers.some((header, index) => header !== expectedHeaders[index])) {
    return [{
      ...normalizeCandidate([]),
      rowIndex: 1,
      errors: [`CSV headers must be: ${expectedHeaders.join(', ')}`],
    }];
  }

  const seenCandidates = new Set<string>();
  return lines.slice(1).map((line, index) => {
    const candidate = normalizeCandidate(parseCsvLine(line));
    const errors = validatePartnerCandidate(candidate);
    const duplicateKey = `${candidate.businessName.toLowerCase()}|${candidate.contactEmail.toLowerCase()}`;
    if (candidate.businessName && candidate.contactEmail && seenCandidates.has(duplicateKey)) {
      errors.push('Duplicate business name and contact email in this file');
    }
    seenCandidates.add(duplicateKey);
    return { ...candidate, rowIndex: index + 2, errors };
  });
}

export const partnerService = {
  async getMyPortalAccess(): Promise<PartnerPortalAccess | null> {
    if (USE_MOCK_DATA) return null;
    const callable = httpsCallable<unknown, PartnerPortalAccess | null>(functions, 'getMyPartnerPortalAccess');
    const result = await callable({});
    return result.data;
  },

  async listCandidates(): Promise<PartnerCandidate[]> {
    const callable = httpsCallable<unknown, PartnerCandidate[]>(functions, 'listMyPartnerCandidates');
    const result = await callable({});
    return result.data;
  },

  async createCandidates(candidates: PartnerCandidateInput[]): Promise<{ createdCount: number }> {
    const callable = httpsCallable<{ candidates: PartnerCandidateInput[] }, { createdCount: number }>(functions, 'createPartnerCandidates');
    const result = await callable({ candidates });
    return result.data;
  },

  async provisionOrganization(input: ProvisionPartnerOrganizationInput): Promise<{ success: boolean }> {
    const callable = httpsCallable<ProvisionPartnerOrganizationInput, { success: boolean }>(functions, 'provisionPartnerOrganization');
    const result = await callable(input);
    return result.data;
  },
};
