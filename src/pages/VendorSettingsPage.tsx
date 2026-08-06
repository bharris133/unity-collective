import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, Camera, Save, Loader2, CheckCircle, AlertCircle, ExternalLink, Upload, FileText, Clock } from 'lucide-react';
import ProductCsvUpload from '../components/ProductCsvUpload';
import { VerificationProgress } from '../components/VerificationProgress';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { getOnboardingState } from '../services/onboardingService';
import { uploadBusinessLogo } from '../services/storageService';
import { getFunctions, httpsCallable } from 'firebase/functions';
import type { OnboardingState } from '../data/mockOnboarding';
import type { VerificationSubmission } from '../types/Verification';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface StoreForm {
  businessName: string;
  category: string;
  description: string;
  location: string;
  website: string;
}

export default function VendorSettingsPage() {
  const navigate = useNavigate();
  const { currentUser, userProfile, loading: authLoading } = useAuth();

  const [onboarding, setOnboarding] = useState<OnboardingState | null>(null);
  const [form, setForm] = useState<StoreForm>({
    businessName: '',
    category: '',
    description: '',
    location: '',
    website: '',
  });
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [dataLoading, setDataLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verification document upload state
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docNotes, setDocNotes] = useState('');
  const [docUploadState, setDocUploadState] = useState<'idle' | 'uploading' | 'submitting' | 'submitted' | 'error'>('idle');
  const [docUploadProgress, setDocUploadProgress] = useState(0);
  const [docUploadError, setDocUploadError] = useState('');
  const [existingSubmission, setExistingSubmission] = useState<VerificationSubmission | null>(null);
  const docFileInputRef = useRef<HTMLInputElement>(null);

  // Load onboarding data + any existing override + existing submission
  useEffect(() => {
    if (!currentUser) return;

    const load = async () => {
      setDataLoading(true);
      try {
        const ob = await getOnboardingState(currentUser.uid);

        // Check for existing verification submission
        if (!USE_MOCK_DATA) {
          try {
            const subSnap = await getDocs(
              query(
                collection(db, 'businesses', currentUser.uid, 'verificationSubmissions'),
                where('status', 'in', ['pending', 'approved', 'needs_info'])
              )
            );
            if (!subSnap.empty) {
              const d = subSnap.docs[0];
              setExistingSubmission({ submissionId: d.id, businessId: currentUser.uid, ...d.data() } as VerificationSubmission);
            }
          } catch {
            // Submission check is non-critical — ignore errors
          }
        }
        setOnboarding(ob);

        // Start form from onboarding data
        const bp = ob?.businessProfile;
        let merged: StoreForm = {
          businessName: bp?.businessName ?? '',
          category: bp?.category ?? '',
          description: bp?.description ?? '',
          location: bp?.location ?? '',
          website: bp?.website ?? '',
        };

        // Apply any existing override on top
        if (!USE_MOCK_DATA) {
          const overrideSnap = await getDoc(doc(db, 'businesses', currentUser.uid));
          if (overrideSnap.exists()) {
            const ov = overrideSnap.data();
            merged = {
              businessName: ov.businessName ?? merged.businessName,
              category: ov.category ?? merged.category,
              description: ov.description ?? merged.description,
              location: ov.location ?? merged.location,
              website: ov.website ?? merged.website,
            };
            if (ov.logoUrl) setLogoPreview(ov.logoUrl);
          }
        }

        setForm(merged);
      } catch (err) {
        console.error('Error loading vendor settings:', err);
      } finally {
        setDataLoading(false);
      }
    };

    load();
  }, [currentUser]);

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <p className="text-gray-400">Loading store settings...</p>
      </div>
    );
  }

  // Only vendors can access this page
  const isVendor = userProfile?.role === 'vendor' || userProfile?.businessOwner;
  if (!currentUser || !isVendor) {
    navigate('/dashboard');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleDocUpload = async () => {
    if (!docFile || !currentUser) return;
    setDocUploadState('uploading');
    setDocUploadProgress(0);
    setDocUploadError('');

    try {
      // 1. Upload file to Firebase Storage
      const storageRef = ref(storage, `businesses/${currentUser.uid}/verification/${Date.now()}_${docFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, docFile);

      const downloadUrl = await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          snapshot => {
            const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setDocUploadProgress(pct);
          },
          reject,
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });

      // 2. Call Cloud Function to create submission record
      setDocUploadState('submitting');
      const functions = getFunctions();
      const submitFn = httpsCallable(functions, 'submitVerificationDocument');
      await submitFn({
        businessId: currentUser.uid,
        fileUrls: [downloadUrl],
        notes: docNotes,
        type: 'document',
      });

      setDocUploadState('submitted');
      setDocFile(null);
      setDocNotes('');
      // Refresh submission status
      setExistingSubmission({
        submissionId: 'pending-refresh',
        businessId: currentUser.uid,
        type: 'document',
        status: 'pending',
        fileUrls: [downloadUrl],
        notes: docNotes,
        reviewedBy: null,
        reviewedAt: null,
        rejectionReason: null,
        createdAt: new Date().toISOString(),
      });
    } catch (err: unknown) {
      setDocUploadState('error');
      const msg = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setDocUploadError(msg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveState('saving');
    setErrorMsg('');

    try {
      let logoUrl = logoPreview;

      // Upload new logo if one was selected
      if (logoFile) {
        const result = await uploadBusinessLogo(currentUser.uid, logoFile);
        logoUrl = result.url;
      }

      // Write override doc to businesses/{uid}
      const overrideData = {
        ...form,
        ...(logoUrl ? { logoUrl } : {}),
        updatedAt: new Date().toISOString(),
      };

      if (!USE_MOCK_DATA) {
        await setDoc(doc(db, 'businesses', currentUser.uid), overrideData, { merge: true });
      }

      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 3000);
    } catch (err) {
      console.error('Error saving store settings:', err);
      setErrorMsg('Failed to save settings. Please try again.');
      setSaveState('error');
    }
  };

  const storeUrl = `/vendors/${currentUser.uid}`;

  return (
    <div className="min-h-screen bg-[#111111] py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Store Settings</h1>
            <p className="text-gray-400">Customize how your store appears to buyers</p>
          </div>
          <Link
            to={storeUrl}
            className="flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#C49B2A] transition-colors mt-1"
          >
            <ExternalLink size={14} />
            View My Store
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Logo section */}
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Store Logo</h2>
            <div className="flex items-center gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-[#2A2A2A] border-2 border-[#3A3A3A] overflow-hidden flex items-center justify-center">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Store logo" className="w-full h-full object-cover" />
                  ) : (
                    <Store size={32} className="text-[#555555]" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#D4AF37] flex items-center justify-center hover:bg-[#C49B2A] transition-colors"
                  title="Change logo"
                >
                  <Camera size={13} className="text-black" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </div>
              <div>
                <p className="text-white font-semibold">{form.businessName || 'Your Store'}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Recommended: square image, at least 200×200px
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-sm text-[#D4AF37] hover:text-[#C49B2A] transition-colors"
                >
                  Upload new logo
                </button>
              </div>
            </div>
          </div>

          {/* Store info */}
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-6 mb-6 space-y-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-white">Store Information</h2>
              {onboarding?.businessProfile && (
                <span className="text-xs text-gray-500">
                  Pre-filled from your onboarding — edit to override
                </span>
              )}
            </div>

            {/* Business name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Business Name
              </label>
              <input
                type="text"
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                placeholder="Your business name"
                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Apparel, Food & Beverage, Services"
                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Store Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Tell buyers what makes your store unique"
                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="City, State"
                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://yoursite.com"
                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
          </div>

          {/* Error message */}
          {saveState === 'error' && (
            <div className="flex items-center gap-2 text-red-400 text-sm mb-4 bg-red-600/10 border border-red-600/20 rounded-lg px-4 py-3">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Verification Progress */}
          <VerificationProgress
            tier={onboarding?.verificationTier ?? 1}
            endorsementCount={0}
          />

          {/* Tier 3 Document Upload — only show when Tier 1 or 2 and not already certified */}
          {(onboarding?.verificationTier ?? 1) < 3 && (
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-6">
              <h3 className="text-base font-bold text-white mb-1">Apply for Tier 3 Certification</h3>
              <p className="text-xs text-gray-400 mb-4">
                Upload an official certification document (NMSDC, state MBE, ByBlack certificate, or equivalent).
                Our team will review it and promote your listing to Certified status.
              </p>

              {existingSubmission ? (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A]">
                  {existingSubmission.status === 'pending' && <Clock size={18} className="text-yellow-400 mt-0.5 flex-shrink-0" />}
                  {existingSubmission.status === 'approved' && <CheckCircle size={18} className="text-green-400 mt-0.5 flex-shrink-0" />}
                  {existingSubmission.status === 'needs_info' && <AlertCircle size={18} className="text-orange-400 mt-0.5 flex-shrink-0" />}
                  <div>
                    <div className="text-sm font-semibold text-white capitalize">{existingSubmission.status === 'pending' ? 'Under Review' : existingSubmission.status === 'approved' ? 'Approved' : 'More Info Needed'}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {existingSubmission.status === 'pending' && 'Your document has been submitted and is awaiting review by our team.'}
                      {existingSubmission.status === 'approved' && 'Your certification has been approved. Your listing is now Tier 3 Certified.'}
                      {existingSubmission.status === 'needs_info' && 'Our team needs additional information. Please check your messages.'}
                    </div>
                    {existingSubmission.notes && (
                      <div className="text-xs text-gray-500 mt-1 italic">&ldquo;{existingSubmission.notes}&rdquo;</div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* File picker */}
                  <div
                    className="border-2 border-dashed border-[#3A3A3A] rounded-lg p-6 text-center cursor-pointer hover:border-[#D4AF37] transition-colors mb-3"
                    onClick={() => docFileInputRef.current?.click()}
                  >
                    {docFile ? (
                      <div className="flex items-center justify-center gap-2 text-sm text-white">
                        <FileText size={18} className="text-[#D4AF37]" />
                        <span>{docFile.name}</span>
                        <span className="text-gray-500">({(docFile.size / 1024).toFixed(0)} KB)</span>
                      </div>
                    ) : (
                      <>
                        <Upload size={24} className="text-gray-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Click to select a PDF or image file</p>
                        <p className="text-xs text-gray-600 mt-1">Max 10 MB &mdash; PDF, JPG, PNG accepted</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={docFileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={e => setDocFile(e.target.files?.[0] ?? null)}
                  />

                  {/* Notes */}
                  <textarea
                    value={docNotes}
                    onChange={e => setDocNotes(e.target.value)}
                    placeholder="Optional: describe the document (e.g. ByBlack certificate, state MBE cert)"
                    rows={2}
                    className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors mb-3 resize-none"
                  />

                  {/* Upload progress */}
                  {docUploadState === 'uploading' && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Uploading...</span>
                        <span>{docUploadProgress}%</span>
                      </div>
                      <div className="h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
                        <div className="h-full bg-[#D4AF37] rounded-full transition-all" style={{ width: `${docUploadProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {docUploadState === 'error' && (
                    <div className="flex items-center gap-2 text-red-400 text-xs mb-3">
                      <AlertCircle size={14} />
                      <span>{docUploadError}</span>
                    </div>
                  )}

                  {docUploadState === 'submitted' && (
                    <div className="flex items-center gap-2 text-green-400 text-sm mb-3">
                      <CheckCircle size={16} />
                      <span>Document submitted for review. Our team will respond within 3&ndash;5 business days.</span>
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={!docFile || docUploadState === 'uploading' || docUploadState === 'submitting' || docUploadState === 'submitted'}
                    onClick={handleDocUpload}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#228B22] hover:bg-[#1a6b1a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
                  >
                    {docUploadState === 'uploading' || docUploadState === 'submitting' ? (
                      <><Loader2 size={16} className="animate-spin" />Submitting...</>
                    ) : (
                      <><Upload size={16} />Submit for Review</>
                    )}
                  </button>
                </>
              )}
            </div>
          )}

          {/* CSV product upload */}
          <ProductCsvUpload vendorId={currentUser.uid} />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 border border-[#3A3A3A] text-gray-300 rounded-lg hover:bg-[#2A2A2A] transition-colors text-sm"
            >
              Back to Dashboard
            </button>
            <button
              type="submit"
              disabled={saveState === 'saving'}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#D4AF37] hover:bg-[#C49B2A] disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors text-sm"
            >
              {saveState === 'saving' ? (
                <><Loader2 size={16} className="animate-spin" />Saving...</>
              ) : saveState === 'saved' ? (
                <><CheckCircle size={16} />Saved!</>
              ) : (
                <><Save size={16} />Save Settings</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
