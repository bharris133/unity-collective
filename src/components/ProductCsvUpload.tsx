import React, { useState, useRef } from 'react';
import { Upload, Download, CheckCircle, AlertCircle, Loader2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { productService } from '../services/productService';
import { PRODUCT_CATEGORIES } from '../types/Product';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ParsedRow {
  rowIndex: number;
  name: string;
  description: string;
  price: number;        // in cents
  category: string;
  inStock: boolean;
  stockQuantity: number;
  tags: string[];
  errors: string[];
}

interface ImportResult {
  succeeded: number;
  failed: number;
  errors: string[];
}

// ─── CSV Template ─────────────────────────────────────────────────────────────

const CSV_HEADERS = ['name', 'description', 'price', 'category', 'inStock', 'stockQuantity', 'tags'];

const TEMPLATE_ROWS = [
  ['Wellness Journal', 'A guided daily journal for women over 40.', '24.99', 'Books & Education', 'true', '50', 'journal,wellness,self-care'],
  ['Herbal Tea Blend', 'Organic blend of chamomile, lavender, and mint.', '14.99', 'Food & Beverage', 'true', '100', 'tea,herbal,organic'],
];

function downloadTemplate() {
  const rows = [CSV_HEADERS, ...TEMPLATE_ROWS];
  const csv = rows.map(r => r.map(cell => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'unity_collective_product_template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Parser ───────────────────────────────────────────────────────────────────

export function parseCsvRows(csvText: string, vendorId: string): ParsedRow[] {
  const lines = csvText.trim().split('\n').filter(l => l.trim() !== '');
  if (lines.length < 2) return [];

  // Strip header row
  const dataLines = lines.slice(1);

  return dataLines.map((line, idx) => {
    const rowIndex = idx + 2; // 1-based, skipping header
    const errors: string[] = [];

    // Simple CSV split — handles quoted fields
    const cells = parseCsvLine(line);

    const [rawName, rawDesc, rawPrice, rawCategory, rawInStock, rawQty, rawTags] = cells;

    const name = (rawName ?? '').trim();
    const description = (rawDesc ?? '').trim();
    const priceStr = (rawPrice ?? '').trim();
    const category = (rawCategory ?? '').trim();
    const inStockStr = (rawInStock ?? 'true').trim().toLowerCase();
    const qtyStr = (rawQty ?? '0').trim();
    const tagsStr = (rawTags ?? '').trim();

    if (!name) errors.push('Name is required');
    if (!description) errors.push('Description is required');

    const priceFloat = parseFloat(priceStr);
    if (isNaN(priceFloat) || priceFloat < 0) {
      errors.push(`Invalid price: "${priceStr}" — must be a number like 24.99`);
    }
    const price = isNaN(priceFloat) ? 0 : Math.round(priceFloat * 100);

    const validCategories = PRODUCT_CATEGORIES as readonly string[];
    if (!category) {
      errors.push('Category is required');
    } else if (!validCategories.includes(category)) {
      errors.push(`Unknown category: "${category}". Valid: ${validCategories.join(', ')}`);
    }

    const inStock = inStockStr !== 'false';
    const stockQuantity = parseInt(qtyStr, 10) || 0;
    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];

    return { rowIndex, name, description, price, category, inStock, stockQuantity, tags, errors };
  });
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  vendorId: string;
}

export default function ProductCsvUpload({ vendorId }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validRows = rows.filter(r => r.errors.length === 0);
  const invalidRows = rows.filter(r => r.errors.length > 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);

    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      const parsed = parseCsvRows(text, vendorId);
      setRows(parsed);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (validRows.length === 0) return;
    setImporting(true);
    setResult(null);

    let succeeded = 0;
    const errors: string[] = [];
    const now = new Date().toISOString();

    for (const row of validRows) {
      try {
        await productService.create({
          productId: '',
          vendorId,
          name: row.name,
          description: row.description,
          price: row.price,
          category: row.category,
          images: [],
          inStock: row.inStock,
          stockQuantity: row.stockQuantity,
          tags: row.tags,
          createdAt: now,
          updatedAt: now,
        });
        succeeded++;
      } catch (err) {
        errors.push(`Row ${row.rowIndex} ("${row.name}"): ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    setImporting(false);
    setResult({ succeeded, failed: errors.length, errors });
    if (succeeded > 0) {
      // Clear the parsed rows on full success
      setRows([]);
      setFileName('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    setRows([]);
    setFileName('');
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl overflow-hidden mb-6">
      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setExpanded(prev => !prev)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#252525] transition-colors"
      >
        <div>
          <h2 className="text-lg font-semibold text-white">Bulk Product Upload</h2>
          <p className="text-sm text-gray-500 mt-0.5">Import multiple products at once using a CSV file</p>
        </div>
        {expanded ? (
          <ChevronUp size={20} className="text-gray-400 shrink-0" />
        ) : (
          <ChevronDown size={20} className="text-gray-400 shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-6 pb-6 border-t border-[#2A2A2A] pt-5">
          {/* Step 1: Download template */}
          <div className="mb-5">
            <p className="text-sm text-gray-400 mb-3">
              <span className="text-[#D4AF37] font-medium">Step 1:</span> Download the template, fill it in, then upload.
            </p>
            <button
              type="button"
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-4 py-2 border border-[#D4AF37] text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/10 transition-colors text-sm font-medium"
            >
              <Download size={15} />
              Download CSV Template
            </button>
          </div>

          {/* Step 2: Upload file */}
          <div className="mb-5">
            <p className="text-sm text-gray-400 mb-3">
              <span className="text-[#D4AF37] font-medium">Step 2:</span> Upload your completed CSV file.
            </p>
            <div
              className="border-2 border-dashed border-[#3A3A3A] rounded-lg p-6 text-center hover:border-[#D4AF37]/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={24} className="text-[#555555] mx-auto mb-2" />
              {fileName ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-white text-sm">{fileName}</span>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); handleClear(); }}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Click to select a .csv file</p>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Preview table */}
          {rows.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-400">
                  <span className="text-white font-medium">{rows.length}</span> rows found —{' '}
                  <span className="text-[#228B22]">{validRows.length} valid</span>
                  {invalidRows.length > 0 && (
                    <>, <span className="text-[#CC0000]">{invalidRows.length} with errors</span></>
                  )}
                </p>
              </div>

              <div className="overflow-x-auto rounded-lg border border-[#2A2A2A]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#2A2A2A] text-gray-400">
                      <th className="px-3 py-2 text-left">#</th>
                      <th className="px-3 py-2 text-left">Name</th>
                      <th className="px-3 py-2 text-left">Price</th>
                      <th className="px-3 py-2 text-left">Category</th>
                      <th className="px-3 py-2 text-left">Stock</th>
                      <th className="px-3 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(row => (
                      <tr
                        key={row.rowIndex}
                        className={`border-t border-[#2A2A2A] ${row.errors.length > 0 ? 'bg-red-900/10' : ''}`}
                      >
                        <td className="px-3 py-2 text-gray-500">{row.rowIndex}</td>
                        <td className="px-3 py-2 text-white max-w-[160px] truncate">{row.name || '—'}</td>
                        <td className="px-3 py-2 text-[#D4AF37]">
                          {row.price > 0 ? `$${(row.price / 100).toFixed(2)}` : '—'}
                        </td>
                        <td className="px-3 py-2 text-gray-300">{row.category || '—'}</td>
                        <td className="px-3 py-2 text-gray-300">{row.stockQuantity}</td>
                        <td className="px-3 py-2">
                          {row.errors.length === 0 ? (
                            <CheckCircle size={14} className="text-[#228B22]" />
                          ) : (
                            <div className="flex items-start gap-1">
                              <AlertCircle size={14} className="text-[#CC0000] shrink-0 mt-0.5" />
                              <span className="text-[#CC0000]">{row.errors[0]}</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Import result */}
          {result && (
            <div className={`rounded-lg px-4 py-3 mb-5 text-sm ${
              result.failed === 0
                ? 'bg-green-900/20 border border-green-700/30 text-green-400'
                : 'bg-red-900/20 border border-red-700/30 text-red-400'
            }`}>
              <p className="font-medium mb-1">
                {result.succeeded} product{result.succeeded !== 1 ? 's' : ''} imported successfully
                {result.failed > 0 && `, ${result.failed} failed`}
              </p>
              {result.errors.map((e, i) => (
                <p key={i} className="text-xs opacity-80">{e}</p>
              ))}
            </div>
          )}

          {/* Import button */}
          {validRows.length > 0 && (
            <button
              type="button"
              onClick={handleImport}
              disabled={importing}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#228B22] hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
            >
              {importing ? (
                <><Loader2 size={16} className="animate-spin" />Importing...</>
              ) : (
                <><Upload size={16} />Import {validRows.length} Product{validRows.length !== 1 ? 's' : ''}</>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
