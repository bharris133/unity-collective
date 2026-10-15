import { useCallback, useEffect, useRef, useState } from 'react';
import { Building2, CheckCircle2, Download, FileUp, Loader2, ShieldAlert, Upload, UsersRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { partnerService, parsePartnerCandidateCsv, validatePartnerCandidate } from '../services/partnerService';
import {
  PARTNER_CANDIDATE_CATEGORIES,
  PARTNER_CANDIDATE_CSV_HEADERS,
  type PartnerCandidate,
  type PartnerCandidateInput,
  type PartnerPortalAccess,
  type ParsedPartnerCandidate,
  type ProvisionPartnerOrganizationInput,
} from '../types/Partner';

const emptyCandidate: PartnerCandidateInput = {
  businessName: '',
  primaryContactName: '',
  contactEmail: '',
  city: '',
  state: '',
  category: '',
  website: '',
  partnerMemberId: '',
};

const emptyProvision: ProvisionPartnerOrganizationInput = {
  name: '',
  city: '',
  state: '',
  agreementVersion: '',
  staffEmail: '',
  trainingConfirmed: false,
};

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

function downloadCandidateTemplate() {
  const rows = [
    PARTNER_CANDIDATE_CSV_HEADERS,
    ['Example Heritage Market', 'Jordan Smith', 'jordan@example.com', 'Chicago', 'IL', 'Food & Beverage', 'https://example.com', 'CHM-001'],
  ];
  const csv = rows.map(row => row.map(value => `"${value.replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'unity_collective_partner_candidate_template.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export default function PartnerPortalPage() {
  const { currentUser, userProfile } = useAuth();
  const [access, setAccess] = useState<PartnerPortalAccess | null>(null);
  const [candidates, setCandidates] = useState<PartnerCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [candidate, setCandidate] = useState<PartnerCandidateInput>(emptyCandidate);
  const [candidateErrors, setCandidateErrors] = useState<string[]>([]);
  const [attested, setAttested] = useState(false);
  const [savingCandidate, setSavingCandidate] = useState(false);
  const [notice, setNotice] = useState('');
  const [csvRows, setCsvRows] = useState<ParsedPartnerCandidate[]>([]);
  const [csvName, setCsvName] = useState('');
  const [importing, setImporting] = useState(false);
  const [provision, setProvision] = useState<ProvisionPartnerOrganizationInput>(emptyProvision);
  const [provisioning, setProvisioning] = useState(false);
  const [provisionNotice, setProvisionNotice] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = userProfile?.isAdmin === true;
  const validCsvRows = csvRows.filter(row => row.errors.length === 0);
  const invalidCsvRows = csvRows.filter(row => row.errors.length > 0);

  const loadPortal = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const portalAccess = await partnerService.getMyPortalAccess();
      setAccess(portalAccess);
      if (portalAccess) {
        const privateCandidates = await partnerService.listCandidates();
        setCandidates(privateCandidates);
      }
    } catch (loadError) {
      setError(errorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    void loadPortal();
  }, [loadPortal]);

  const handleCreateCandidate = async () => {
    const errors = validatePartnerCandidate(candidate);
    setCandidateErrors(errors);
    if (errors.length > 0 || !attested) return;

    setSavingCandidate(true);
    setError('');
    setNotice('');
    try {
      await partnerService.createCandidates([candidate]);
      setCandidate(emptyCandidate);
      setAttested(false);
      setNotice('Candidate saved to the private partner list. Invitation delivery is not enabled in this foundation release.');
      await loadPortal();
    } catch (createError) {
      setError(errorMessage(createError));
    } finally {
      setSavingCandidate(false);
    }
  };

  const handleCsv = (file: File) => {
    setCsvName(file.name);
    setNotice('');
    const reader = new FileReader();
    reader.onload = event => setCsvRows(parsePartnerCandidateCsv(String(event.target?.result ?? '')));
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!attested || validCsvRows.length === 0 || invalidCsvRows.length > 0) return;
    setImporting(true);
    setError('');
    setNotice('');
    try {
      await partnerService.createCandidates(validCsvRows);
      setCsvRows([]);
      setCsvName('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setAttested(false);
      setNotice(`${validCsvRows.length} private candidate${validCsvRows.length === 1 ? '' : 's'} saved. Invitation delivery is not enabled in this foundation release.`);
      await loadPortal();
    } catch (importError) {
      setError(errorMessage(importError));
    } finally {
      setImporting(false);
    }
  };

  const handleProvision = async () => {
    if (!provision.name || !provision.city || !provision.state || !provision.agreementVersion || !provision.staffEmail || !provision.trainingConfirmed) {
      setError('Complete every partner setup field and confirm training before creating portal access.');
      return;
    }

    setProvisioning(true);
    setError('');
    setProvisionNotice('');
    try {
      await partnerService.provisionOrganization(provision);
      setProvisionNotice(`Partner portal access was created for ${provision.staffEmail}. The staff member can sign in and open this page.`);
      setProvision(emptyProvision);
    } catch (provisionError) {
      setError(errorMessage(provisionError));
    } finally {
      setProvisioning(false);
    }
  };

  if (!currentUser) {
    return <AccessDenied message="Sign in to access the Partner Portal." />;
  }

  if (loading) {
    return <div className="min-h-screen bg-[#111111] pt-28 text-center text-gray-400"><Loader2 className="animate-spin mx-auto mb-3" />Loading Partner Portal…</div>;
  }

  if (!isAdmin && !access) {
    return <AccessDenied message="Your account does not have active Partner Portal access. Contact Unity Collective support if you believe this is an error." />;
  }

  return (
    <div className="min-h-screen bg-[#111111] pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#1E1E1E] to-[#111111] p-7">
          <p className="text-[#D4AF37] text-sm font-semibold uppercase tracking-widest mb-2">Unity Collective Partner Program</p>
          <h1 className="text-3xl font-bold text-white">Partner Portal</h1>
          <p className="text-gray-400 mt-2 max-w-3xl">Manage private Business Accelerator candidates. Candidate information remains private and does not create a public business listing, verification tier, or invitation email.</p>
        </header>

        {error && <div role="alert" className="rounded-xl border border-red-700/50 bg-red-950/30 px-5 py-4 text-red-300">{error}</div>}
        {notice && <div role="status" className="rounded-xl border border-green-700/50 bg-green-950/30 px-5 py-4 text-green-300">{notice}</div>}

        {isAdmin && <section className="rounded-2xl border border-[#2A2A2A] bg-[#1E1E1E] p-6">
          <div className="flex gap-3 mb-5"><Building2 className="text-[#D4AF37]" /><div><h2 className="text-xl font-semibold text-white">Provision Partner Portal Access</h2><p className="text-sm text-gray-400 mt-1">The staff member must already have a Unity Collective account. This creates one active organization and one organization-scoped staff access record.</p></div></div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Official organization name" value={provision.name} onChange={value => setProvision(current => ({ ...current, name: value }))} />
            <Field label="Partner staff account email" type="email" value={provision.staffEmail} onChange={value => setProvision(current => ({ ...current, staffEmail: value }))} />
            <Field label="City" value={provision.city} onChange={value => setProvision(current => ({ ...current, city: value }))} />
            <Field label="State" value={provision.state} onChange={value => setProvision(current => ({ ...current, state: value }))} />
            <Field label="Agreement version" value={provision.agreementVersion} onChange={value => setProvision(current => ({ ...current, agreementVersion: value }))} />
          </div>
          <label className="mt-4 flex gap-3 rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-4 text-sm text-gray-300 cursor-pointer"><input type="checkbox" checked={provision.trainingConfirmed} onChange={event => setProvision(current => ({ ...current, trainingConfirmed: event.target.checked }))} className="mt-1 accent-[#D4AF37]" /><span>I confirm the assigned staff member completed Partner Portal and candidate-template training for this agreement.</span></label>
          <button type="button" onClick={handleProvision} disabled={provisioning} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-5 py-3 font-semibold text-black hover:bg-[#E8C84A] disabled:opacity-60">
            {provisioning ? <Loader2 size={17} className="animate-spin" /> : <UsersRound size={17} />} Create Partner Portal Access
          </button>
          {provisionNotice && <p role="status" className="mt-3 text-sm text-green-300">{provisionNotice}</p>}
        </section>}

        {access && <>
          <section className="rounded-2xl border border-[#2A2A2A] bg-[#1E1E1E] p-6">
            <p className="text-[#D4AF37] text-sm font-semibold">ACTIVE PARTNER</p>
            <h2 className="text-2xl text-white font-semibold mt-1">{access.organization.name}</h2>
            <p className="text-gray-400 mt-1">{access.organization.city}, {access.organization.state} · Agreement {access.organization.agreementVersion}</p>
          </section>

          <section className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-[#2A2A2A] bg-[#1E1E1E] p-6">
              <h2 className="text-xl font-semibold text-white">Add One Private Candidate</h2>
              <p className="text-sm text-gray-400 mt-1 mb-5">Only use contact information your organization is authorized to share for the Unity Collective Business Accelerator.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Business name" value={candidate.businessName} onChange={value => setCandidate(current => ({ ...current, businessName: value }))} />
                <Field label="Primary contact name" value={candidate.primaryContactName} onChange={value => setCandidate(current => ({ ...current, primaryContactName: value }))} />
                <Field label="Contact email" type="email" value={candidate.contactEmail} onChange={value => setCandidate(current => ({ ...current, contactEmail: value }))} />
                <Field label="Partner member ID (optional)" value={candidate.partnerMemberId} onChange={value => setCandidate(current => ({ ...current, partnerMemberId: value }))} />
                <Field label="City" value={candidate.city} onChange={value => setCandidate(current => ({ ...current, city: value }))} />
                <Field label="State" value={candidate.state} onChange={value => setCandidate(current => ({ ...current, state: value }))} />
                <label className="block text-sm text-gray-300">Category (optional)<select value={candidate.category} onChange={event => setCandidate(current => ({ ...current, category: event.target.value }))} className="mt-1 w-full rounded-lg border border-white/10 bg-[#111111] px-3 py-2.5 text-white"><option value="">Select a category</option>{PARTNER_CANDIDATE_CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)}</select></label>
                <Field label="Website (optional)" value={candidate.website} onChange={value => setCandidate(current => ({ ...current, website: value }))} />
              </div>
              <Attestation checked={attested} onChange={setAttested} />
              {candidateErrors.length > 0 && <ul className="mt-3 text-sm text-red-300 list-disc pl-5">{candidateErrors.map(item => <li key={item}>{item}</li>)}</ul>}
              <button type="button" onClick={handleCreateCandidate} disabled={savingCandidate || !attested} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#228B22] px-5 py-3 text-white font-semibold hover:bg-green-700 disabled:opacity-60">
                {savingCandidate ? <Loader2 size={17} className="animate-spin" /> : <CheckCircle2 size={17} />} Save Private Candidate
              </button>
            </div>

            <div className="rounded-2xl border border-[#2A2A2A] bg-[#1E1E1E] p-6">
              <h2 className="text-xl font-semibold text-white">Bulk Candidate Upload</h2>
              <p className="text-sm text-gray-400 mt-1">Validate candidates before creating private records. Invalid rows are never submitted.</p>
              <button type="button" onClick={downloadCandidateTemplate} className="mt-4 inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#E8C84A] text-sm font-medium"><Download size={16} />Download CSV Template</button>
              <div className="mt-5 rounded-xl border-2 border-dashed border-[#3A3A3A] p-7 text-center hover:border-[#D4AF37]/50 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <FileUp className="mx-auto text-gray-500 mb-2" />
                <p className="text-sm text-gray-300">{csvName || 'Select a completed .csv file'}</p>
                <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={event => { const file = event.target.files?.[0]; if (file) handleCsv(file); }} />
              </div>
              {csvRows.length > 0 && <div className="mt-5">
                <p className="text-sm text-gray-300"><span className="text-green-400">{validCsvRows.length} valid</span> · <span className="text-red-400">{invalidCsvRows.length} with errors</span></p>
                <div className="mt-3 max-h-48 overflow-auto rounded-lg border border-[#2A2A2A] text-xs">{csvRows.map(row => <div key={row.rowIndex} className="border-b border-[#2A2A2A] px-3 py-2 text-gray-300"><span className="text-gray-500">Row {row.rowIndex}:</span> {row.businessName || 'Missing business name'} {row.errors.length > 0 && <span className="text-red-300">— {row.errors.join('; ')}</span>}</div>)}</div>
                <button type="button" onClick={handleImport} disabled={importing || !attested || validCsvRows.length === 0 || invalidCsvRows.length > 0} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#228B22] px-5 py-3 text-white font-semibold hover:bg-green-700 disabled:opacity-60">{importing ? <Loader2 size={17} className="animate-spin" /> : <Upload size={17} />} Import {validCsvRows.length} Private Candidate{validCsvRows.length === 1 ? '' : 's'}</button>
              </div>}
            </div>
          </section>

          <section className="rounded-2xl border border-[#2A2A2A] bg-[#1E1E1E] overflow-hidden">
            <div className="p-6 border-b border-[#2A2A2A]"><h2 className="text-xl font-semibold text-white">Private Candidate List</h2><p className="text-sm text-gray-400 mt-1">These records are visible only through authorized partner operations. They are not public directory listings.</p></div>
            {candidates.length === 0 ? <p className="p-6 text-gray-400">No private candidates have been added yet.</p> : <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-[#161616] text-gray-400"><tr><th className="text-left px-6 py-3">Business</th><th className="text-left px-6 py-3">Contact</th><th className="text-left px-6 py-3">Location</th><th className="text-left px-6 py-3">Status</th></tr></thead><tbody>{candidates.map(item => <tr key={item.candidateId} className="border-t border-[#2A2A2A]"><td className="px-6 py-4 text-white">{item.businessName}</td><td className="px-6 py-4 text-gray-300">{item.primaryContactName}<br /><span className="text-gray-500">{item.contactEmail}</span></td><td className="px-6 py-4 text-gray-300">{item.city}, {item.state}</td><td className="px-6 py-4"><span className="rounded-full bg-yellow-900/30 border border-yellow-700/40 px-2 py-1 text-xs text-yellow-300">Private · ready for future invitation</span></td></tr>)}</tbody></table></div>}
          </section>
        </>}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="block text-sm text-gray-300">{label}<input type={type} value={value} onChange={event => onChange(event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-[#111111] px-3 py-2.5 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none" /></label>;
}

function Attestation({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="mt-5 flex gap-3 rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-4 text-sm text-gray-300 cursor-pointer"><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} className="mt-1 accent-[#D4AF37]" /><span>I confirm this organization is authorized to share these business contacts and invite them to the Unity Collective Business Accelerator.</span></label>;
}

function AccessDenied({ message }: { message: string }) {
  return <div className="min-h-screen bg-[#111111] pt-28 px-4"><div className="max-w-xl mx-auto rounded-2xl border border-red-700/40 bg-[#1E1E1E] p-8 text-center"><ShieldAlert className="mx-auto text-red-400 mb-4" size={42} /><h1 className="text-2xl font-bold text-white">Partner Portal Access Required</h1><p className="mt-3 text-gray-400">{message}</p></div></div>;
}
