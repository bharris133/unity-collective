import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const projectRoot = process.cwd();
const rules = readFileSync(resolve(projectRoot, 'firestore.rules'), 'utf8');
const functionsSource = readFileSync(resolve(projectRoot, 'functions/src/index.ts'), 'utf8');
const firestoreIndexes = JSON.parse(
  readFileSync(resolve(projectRoot, 'firestore.indexes.json'), 'utf8')
) as {
  fieldOverrides: Array<{
    collectionGroup: string;
    fieldPath: string;
    indexes: Array<{ queryScope: string; order: string }>;
  }>;
};

describe('Verification administration authorization contract', () => {
  it('explicitly authorizes administrators to read verification submission collection-group queries', () => {
    expect(rules).toContain('match /{path=**}/verificationSubmissions/{submissionId}');
    expect(rules).toContain('allow read: if isAdmin();');
  });

  it('retains vendor access to only the submission subcollection beneath their own business path', () => {
    expect(rules).toContain('match /businesses/{businessId}');
    expect(rules).toContain('allow read: if isOwner(businessId) || isAdmin();');
    expect(rules).toContain('request.resource.data.businessId == businessId;');
  });

  it('accepts the established isAdmin profile field and the custom claim for admin checks', () => {
    expect(rules).toContain('request.auth.token.admin == true');
    expect(rules).toContain('get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true');
  });

  it('defines the status single-field index required by the pending collection-group query', () => {
    expect(firestoreIndexes.fieldOverrides).toContainEqual({
      collectionGroup: 'verificationSubmissions',
      fieldPath: 'status',
      indexes: [{ queryScope: 'COLLECTION_GROUP', order: 'ASCENDING' }],
    });
  });

  it('uses the same admin contract when the reviewSubmission Cloud Function authorizes a review', () => {
    const reviewSubmissionSection = functionsSource.slice(functionsSource.indexOf('export const reviewSubmission'));
    expect(reviewSubmissionSection).toContain("callerData?.isAdmin === true");
    expect(reviewSubmissionSection).toContain("callerData?.role === 'admin'");
    expect(reviewSubmissionSection).toContain('request.auth.token.admin === true');
  });
});
