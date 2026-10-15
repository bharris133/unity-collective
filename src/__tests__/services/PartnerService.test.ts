import { describe, expect, it } from 'vitest';
import { parsePartnerCandidateCsv, validatePartnerCandidate } from '../../services/partnerService';

const HEADER = 'business_name,primary_contact_name,contact_email,city,state,category,website,partner_member_id';

describe('partner candidate validation', () => {
  it('accepts a valid private candidate without assigning a tier or public status', () => {
    const errors = validatePartnerCandidate({
      businessName: 'Heritage Market',
      primaryContactName: 'Jordan Smith',
      contactEmail: 'jordan@example.com',
      city: 'Chicago',
      state: 'IL',
      category: 'Food & Beverage',
      website: 'https://heritage.example.com',
      partnerMemberId: 'CHM-001',
    });

    expect(errors).toEqual([]);
  });

  it('rejects missing identity and invalid contact details', () => {
    const errors = validatePartnerCandidate({
      businessName: '',
      primaryContactName: '',
      contactEmail: 'not-an-email',
      city: '',
      state: '',
      category: 'Unknown',
      website: 'not-a-url',
      partnerMemberId: '',
    });

    expect(errors).toEqual(expect.arrayContaining([
      'Business name is required',
      'Primary contact name is required',
      'A valid contact email is required',
      'City is required',
      'State is required',
      'Unknown category: "Unknown"',
      'Website must be a valid http(s) URL',
    ]));
  });

  it('parses the approved candidate template and detects duplicate rows', () => {
    const csv = [
      HEADER,
      'Heritage Market,Jordan Smith,jordan@example.com,Chicago,IL,Food & Beverage,https://heritage.example.com,CHM-001',
      'Heritage Market,Jordan Smith,jordan@example.com,Chicago,IL,Food & Beverage,https://heritage.example.com,CHM-001',
    ].join('\n');

    const rows = parsePartnerCandidateCsv(csv);

    expect(rows[0].errors).toEqual([]);
    expect(rows[1].errors).toContain('Duplicate business name and contact email in this file');
  });

  it('rejects a CSV whose headers could include unapproved candidate data', () => {
    const rows = parsePartnerCandidateCsv('business_name,contact_email,black_owned_status\nHeritage Market,jordan@example.com,true');

    expect(rows).toHaveLength(1);
    expect(rows[0].rowIndex).toBe(1);
    expect(rows[0].errors[0]).toContain('CSV headers must be:');
  });
});
