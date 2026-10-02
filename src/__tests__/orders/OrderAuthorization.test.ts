import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const projectRoot = process.cwd();
const rules = readFileSync(resolve(projectRoot, 'firestore.rules'), 'utf8');
const orderServiceSource = readFileSync(resolve(projectRoot, 'src/services/orderService.ts'), 'utf8');
const indexes = JSON.parse(
  readFileSync(resolve(projectRoot, 'firestore.indexes.json'), 'utf8')
) as {
  indexes: Array<{
    collectionGroup: string;
    queryScope: string;
    fields: Array<{ fieldPath: string; order: string }>;
  }>;
};

describe('Vendor order authorization contract', () => {
  it('allows a vendor to read orders assigned to that vendor', () => {
    const orderRules = rules.slice(rules.indexOf('match /orders/{orderId}'), rules.indexOf('// ─── Reports'));

    expect(orderRules).toContain('resource.data.vendorId == request.auth.uid');
  });

  it('limits vendor status changes to the supported paid, processing, and shipped transitions', () => {
    const orderRules = rules.slice(rules.indexOf('match /orders/{orderId}'), rules.indexOf('// ─── Reports'));

    expect(orderRules).toContain("resource.data.status == 'paid'");
    expect(orderRules).toContain("request.resource.data.status == 'processing'");
    expect(orderRules).toContain("request.resource.data.status == 'shipped'");
    expect(orderRules).toContain("request.resource.data.status == 'delivered'");
    expect(orderRules).toContain("affectedKeys().hasOnly(['status'])");
  });

  it('keeps the vendor query aligned with its configured composite index', () => {
    expect(orderServiceSource).toContain("where('vendorId', '==', vendorId)");
    expect(orderServiceSource).toContain("orderBy('createdAt', 'desc')");
    expect(indexes.indexes).toContainEqual({
      collectionGroup: 'orders',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'vendorId', order: 'ASCENDING' },
        { fieldPath: 'createdAt', order: 'DESCENDING' },
      ],
    });
  });
});
