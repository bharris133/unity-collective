import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const {
  DEFAULT_PROJECT,
  FIXTURE_MARKER,
  assertLiveFirebaseGate,
  fixturePlan,
  parseArgs,
  qaStoragePrefixes,
} = require('../../../scripts/qa-fixtures.cjs');

describe('controlled QA fixture utility', () => {
  it('creates a deterministic, labeled fixture plan for the required role and data surfaces', () => {
    const plan = fixturePlan();

    expect(plan.users.map((user: { uid: string }) => user.uid)).toEqual([
      'qa_admin_001',
      'qa_vendor_001',
      'qa_vendor_002',
      'qa_buyer_001',
      'qa_buyer_002',
    ]);
    expect(plan.stores).toHaveLength(2);
    expect(plan.products).toHaveLength(3);
    expect(plan.orders).toHaveLength(2);
    expect(plan.reports.map((report: { status: string }) => report.status)).toEqual(['open', 'resolved']);
    expect(plan.endorsements).toHaveLength(2);
    expect(plan.submissions).toHaveLength(1);
    expect(plan.products.every((product: { productId: string }) => product.productId.startsWith('qa_'))).toBe(true);
    expect(plan.orders.every((order: { orderId: string }) => order.orderId.startsWith('qa_'))).toBe(true);
  });

  it('requires an explicit confirmation flag and the approved Firebase project for live operations', () => {
    expect(() => assertLiveFirebaseGate({ confirmLive: false, project: DEFAULT_PROJECT })).toThrow(/--confirm-live/);
    expect(() => assertLiveFirebaseGate({ confirmLive: true, project: 'another-project' })).toThrow(/only permits/);
  });

  it('parses only the documented command options', () => {
    expect(parseArgs(['seed', '--project', DEFAULT_PROJECT, '--confirm-live', '--manifest', 'tmp/qa.json'])).toEqual({
      command: 'seed',
      options: { project: DEFAULT_PROJECT, confirmLive: true, manifest: 'tmp/qa.json' },
    });
    expect(() => parseArgs(['seed', '--unsafe'])).toThrow(/Unknown option/);
  });

  it('exports a stable marker used to protect reset operations', () => {
    expect(FIXTURE_MARKER).toBe('unity-collective-controlled-qa-fixture');
  });

  it('limits Storage cleanup to prefixes owned by the fixed QA fixture users', () => {
    expect(qaStoragePrefixes(fixturePlan())).toEqual([
      'avatars/qa_admin_001/',
      'avatars/qa_vendor_001/',
      'avatars/qa_vendor_002/',
      'avatars/qa_buyer_001/',
      'avatars/qa_buyer_002/',
      'businesses/qa_vendor_001/',
      'onboarding/qa_vendor_001/docs/',
      'products/qa_vendor_001/',
      'businesses/qa_vendor_002/',
      'onboarding/qa_vendor_002/docs/',
      'products/qa_vendor_002/',
    ]);
  });
});
