import { describe, it, expect } from 'vitest';
import { parseCsvRows } from '../../components/ProductCsvUpload';

const HEADER = 'name,description,price,category,inStock,stockQuantity,tags\n';

describe('parseCsvRows', () => {
  it('parses a valid row correctly', () => {
    const csv = HEADER + '"Wellness Journal","A guided journal",24.99,"Books & Education",true,50,"journal,wellness"';
    const rows = parseCsvRows(csv, 'vendor-uid');
    expect(rows).toHaveLength(1);
    expect(rows[0].name).toBe('Wellness Journal');
    expect(rows[0].price).toBe(2499);
    expect(rows[0].category).toBe('Books & Education');
    expect(rows[0].inStock).toBe(true);
    expect(rows[0].stockQuantity).toBe(50);
    expect(rows[0].tags).toEqual(['journal', 'wellness']);
    expect(rows[0].errors).toHaveLength(0);
  });

  it('flags missing name', () => {
    const csv = HEADER + '"","A description",9.99,"Apparel",true,10,""';
    const rows = parseCsvRows(csv, 'vendor-uid');
    expect(rows[0].errors).toContain('Name is required');
  });

  it('flags missing description', () => {
    const csv = HEADER + '"My Product","",9.99,"Apparel",true,10,""';
    const rows = parseCsvRows(csv, 'vendor-uid');
    expect(rows[0].errors).toContain('Description is required');
  });

  it('flags invalid price', () => {
    const csv = HEADER + '"My Product","A description",abc,"Apparel",true,10,""';
    const rows = parseCsvRows(csv, 'vendor-uid');
    expect(rows[0].errors.some(e => e.includes('Invalid price'))).toBe(true);
  });

  it('flags unknown category', () => {
    const csv = HEADER + '"My Product","A description",9.99,"Unknown Category",true,10,""';
    const rows = parseCsvRows(csv, 'vendor-uid');
    expect(rows[0].errors.some(e => e.includes('Unknown category'))).toBe(true);
  });

  it('converts price from dollars to cents', () => {
    const csv = HEADER + '"Item","Desc",14.99,"Services",true,5,""';
    const rows = parseCsvRows(csv, 'vendor-uid');
    expect(rows[0].price).toBe(1499);
  });

  it('handles inStock=false correctly', () => {
    const csv = HEADER + '"Item","Desc",9.99,"Apparel",false,0,""';
    const rows = parseCsvRows(csv, 'vendor-uid');
    expect(rows[0].inStock).toBe(false);
  });

  it('returns empty array for CSV with only a header', () => {
    const csv = HEADER;
    const rows = parseCsvRows(csv, 'vendor-uid');
    expect(rows).toHaveLength(0);
  });

  it('parses multiple rows', () => {
    const csv =
      HEADER +
      '"Product A","Desc A",10.00,"Apparel",true,5,""\n' +
      '"Product B","Desc B",20.00,"Services",false,0,""';
    const rows = parseCsvRows(csv, 'vendor-uid');
    expect(rows).toHaveLength(2);
    expect(rows[0].name).toBe('Product A');
    expect(rows[1].name).toBe('Product B');
  });

  it('handles empty tags gracefully', () => {
    const csv = HEADER + '"Item","Desc",5.00,"Other",true,1,""';
    const rows = parseCsvRows(csv, 'vendor-uid');
    expect(rows[0].tags).toEqual([]);
  });
});
