import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const rules = readFileSync('firestore.rules', 'utf8');
const functionsSource = readFileSync('functions/src/index.ts', 'utf8');
const indexes = JSON.parse(readFileSync('firestore.indexes.json', 'utf8')) as {
  indexes: Array<{ collectionGroup: string; fields: Array<{ fieldPath: string }> }>;
};

describe('private partner candidate foundation authorization contract', () => {
  it('keeps partner organization, staff, and candidate records closed to direct client access', () => {
    const partnerRules = rules.slice(
      rules.indexOf('// ─── Partner candidate foundation'),
      rules.indexOf('// ─── Onboarding')
    );
    expect(partnerRules).toContain('match /partnerOrganizations/{partnerOrgId}');
    expect(partnerRules).toContain('match /partnerStaff/{staffUid}');
    expect(partnerRules).toContain('match /partnerCandidates/{candidateId}');
    expect(partnerRules.match(/allow read, write: if false;/g)).toHaveLength(3);
  });

  it('uses organization-scoped staff access and callable server writes', () => {
    const partnerSection = functionsSource.slice(functionsSource.indexOf('// ─── Partner candidate foundation'));
    expect(partnerSection).toContain("db.collection('partnerStaff').doc(uid)");
    expect(partnerSection).toContain("db.collection('partnerCandidates')");
    expect(partnerSection).toContain('provisionPartnerOrganization');
    expect(partnerSection).toContain('createPartnerCandidates');
    expect(partnerSection).toContain('trainingConfirmed !== true');
    expect(partnerSection).toContain(".where('partnerOrgId', '==', staff.partnerOrgId)");
    expect(partnerSection).toContain('contactEmail: data.contactEmail');
    expect(partnerSection).not.toContain('return candidatesSnap.docs.map(candidate => ({ candidateId: candidate.id, ...candidate.data() }))');
  });

  it('declares the exact duplicate-check index used by the candidate function', () => {
    expect(indexes.indexes).toContainEqual(expect.objectContaining({
      collectionGroup: 'partnerCandidates',
      fields: [
        expect.objectContaining({ fieldPath: 'partnerOrgId' }),
        expect.objectContaining({ fieldPath: 'contactEmailNormalized' }),
      ],
    }));
  });

  it('does not create public onboarding or verification records in the candidate foundation', () => {
    const partnerSection = functionsSource.slice(functionsSource.indexOf('// ─── Partner candidate foundation'));
    expect(partnerSection).not.toContain("collection('onboarding')");
    expect(partnerSection).not.toContain('verificationTier');
    expect(partnerSection).not.toContain('updateTrustScore');
  });
});
