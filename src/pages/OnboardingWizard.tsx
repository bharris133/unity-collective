import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ONBOARDING_STEPS,
  BUSINESS_CATEGORIES,
  ACCEPTED_DOC_TYPES,
  type OnboardingState,
  type OnboardingStep,
  type OnboardingVerificationDoc,
} from '../data/mockOnboarding';
import { saveOnboardingState } from '../services/onboardingService';
import { uploadVerificationDoc } from '../services/storageService';

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEP_LABELS: Record<OnboardingStep, string> = {
  'registration': 'Account',
  'business-profile': 'Profile',
  'verification': 'Verify',
  'products': 'Products',
  'review': 'Review',
  'complete': 'Done',
};

function StepIndicator({ currentStep }: { currentStep: OnboardingStep }) {
  const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {ONBOARDING_STEPS.filter(s => s !== 'complete').map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step} className="flex items-center">
            <div className={`flex flex-col items-center`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors
                ${done ? 'bg-red-600 border-red-600 text-white' : active ? 'bg-transparent border-yellow-400 text-yellow-400' : 'bg-transparent border-gray-600 text-gray-600'}`}>
                {done ? '✓' : i + 1}
              </div>
              <span className={`text-xs mt-1 ${active ? 'text-yellow-400' : done ? 'text-red-400' : 'text-gray-600'}`}>
                {STEP_LABELS[step]}
              </span>
            </div>
            {i < ONBOARDING_STEPS.length - 2 && (
              <div className={`w-12 h-0.5 mb-5 ${done ? 'bg-red-600' : 'bg-gray-700'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();

  const [step, setStep] = useState<OnboardingStep>('registration');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1: registration (pre-filled from auth)
  const [regData, setRegData] = useState({
    firstName: (userProfile as any)?.firstName || '',
    lastName: (userProfile as any)?.lastName || '',
    email: currentUser?.email || '',
    phone: (userProfile as any)?.phone || '',
  });

  // Step 2: business profile
  const [bizData, setBizData] = useState({
    businessName: '',
    category: '',
    description: '',
    location: '',
    phone: '',
    email: currentUser?.email || '',
    website: '',
  });

  // Step 3: verification
  const [isBlackOwned, setIsBlackOwned] = useState(false);
  const [verificationDocs, setVerificationDocs] = useState<OnboardingVerificationDoc[]>([]);
  const [docType, setDocType] = useState<OnboardingVerificationDoc['docType']>('business-license');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 4: products
  const [skippedProducts, setSkippedProducts] = useState(false);

  // ─── Validation ─────────────────────────────────────────────────────────────

  function validateStep(): boolean {
    const e: Record<string, string> = {};
    if (step === 'registration') {
      if (!regData.firstName.trim()) e.firstName = 'First name is required.';
      if (!regData.lastName.trim()) e.lastName = 'Last name is required.';
      if (!regData.email.trim()) e.email = 'Email is required.';
    }
    if (step === 'business-profile') {
      if (!bizData.businessName.trim()) e.businessName = 'Business name is required.';
      if (!bizData.category) e.category = 'Please select a category.';
      if (!bizData.description.trim()) e.description = 'Description is required.';
      if (!bizData.location.trim()) e.location = 'Location is required.';
      if (!bizData.email.trim()) e.email = 'Business email is required.';
    }
    if (step === 'verification') {
      if (!isBlackOwned) e.isBlackOwned = 'Please confirm your business ownership status.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ─── Navigation ─────────────────────────────────────────────────────────────

  function nextStep() {
    if (!validateStep()) return;
    const idx = ONBOARDING_STEPS.indexOf(step);
    setStep(ONBOARDING_STEPS[idx + 1]);
    setErrors({});
  }

  function prevStep() {
    const idx = ONBOARDING_STEPS.indexOf(step);
    if (idx > 0) setStep(ONBOARDING_STEPS[idx - 1]);
    setErrors({});
  }

  async function handleComplete() {
    if (!currentUser) return;
    const state: OnboardingState = {
      memberId: currentUser.uid,
      currentStep: 'complete',
      completedSteps: [...ONBOARDING_STEPS],
      businessProfile: {
        businessName: bizData.businessName,
        category: bizData.category,
        description: bizData.description,
        location: bizData.location,
        phone: bizData.phone || regData.phone,
        email: bizData.email,
        website: bizData.website,
      },
      isBlackOwned,
      verificationStatus: 'pending',
      verificationDocs,
      skippedProducts,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    await saveOnboardingState(state);
    setStep('complete');
  }

  // ─── Document upload (Firebase Storage or mock) ──────────────────────────────

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setUploading(true);
    setErrors({});
    try {
      const result = await uploadVerificationDoc(currentUser.uid, file);
      const doc: OnboardingVerificationDoc = {
        docType,
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        storageUrl: result.url,
        storagePath: result.path,
      };
      setVerificationDocs(prev => [...prev, doc]);
    } catch (err) {
      console.error('Upload failed:', err);
      setErrors({ upload: 'Upload failed. Please try again.' });
    } finally {
      setUploading(false);
      // Reset the file input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function handleRemoveDoc(index: number) {
    setVerificationDocs(prev => prev.filter((_, i) => i !== index));
  }

  // ─── Shared input classes ────────────────────────────────────────────────────

  const inputCls = 'w-full bg-[#2A2A2A] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors';
  const labelCls = 'block text-sm font-medium text-gray-300 mb-1';
  const errorCls = 'text-red-400 text-xs mt-1';

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#111111] pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Become a <span className="text-red-500">[Unity Collective]</span> Member
          </h1>
          <p className="text-gray-400">Complete the steps below to activate your storefront.</p>
        </div>

        {step !== 'complete' && <StepIndicator currentStep={step} />}

        {/* Card */}
        <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-8">

          {/* ── Step 1: Registration ── */}
          {step === 'registration' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Confirm Your Account Details</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelCls}>First Name</label>
                  <input className={inputCls} value={regData.firstName}
                    onChange={e => setRegData(p => ({ ...p, firstName: e.target.value }))} placeholder="First name" />
                  {errors.firstName && <p className={errorCls}>{errors.firstName}</p>}
                </div>
                <div>
                  <label className={labelCls}>Last Name</label>
                  <input className={inputCls} value={regData.lastName}
                    onChange={e => setRegData(p => ({ ...p, lastName: e.target.value }))} placeholder="Last name" />
                  {errors.lastName && <p className={errorCls}>{errors.lastName}</p>}
                </div>
              </div>
              <div className="mb-4">
                <label className={labelCls}>Email Address</label>
                <input className={inputCls} value={regData.email} readOnly
                  onChange={e => setRegData(p => ({ ...p, email: e.target.value }))} placeholder="Email" />
                {errors.email && <p className={errorCls}>{errors.email}</p>}
              </div>
              <div className="mb-6">
                <label className={labelCls}>Phone Number <span className="text-gray-500">(optional)</span></label>
                <input className={inputCls} value={regData.phone}
                  onChange={e => setRegData(p => ({ ...p, phone: e.target.value }))} placeholder="(555) 000-0000" />
              </div>
            </div>
          )}

          {/* ── Step 2: Business Profile ── */}
          {step === 'business-profile' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Tell Us About Your Business</h2>
              <div className="mb-4">
                <label className={labelCls}>Business Name</label>
                <input className={inputCls} value={bizData.businessName}
                  onChange={e => setBizData(p => ({ ...p, businessName: e.target.value }))} placeholder="Your business name" />
                {errors.businessName && <p className={errorCls}>{errors.businessName}</p>}
              </div>
              <div className="mb-4">
                <label className={labelCls}>Category</label>
                <select className={inputCls} value={bizData.category}
                  onChange={e => setBizData(p => ({ ...p, category: e.target.value }))}>
                  <option value="">Select a category</option>
                  {BUSINESS_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className={errorCls}>{errors.category}</p>}
              </div>
              <div className="mb-4">
                <label className={labelCls}>Description</label>
                <textarea className={`${inputCls} resize-none`} rows={3} value={bizData.description}
                  onChange={e => setBizData(p => ({ ...p, description: e.target.value }))}
                  placeholder="Describe what your business offers to the community" />
                {errors.description && <p className={errorCls}>{errors.description}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelCls}>Location</label>
                  <input className={inputCls} value={bizData.location}
                    onChange={e => setBizData(p => ({ ...p, location: e.target.value }))} placeholder="City, State" />
                  {errors.location && <p className={errorCls}>{errors.location}</p>}
                </div>
                <div>
                  <label className={labelCls}>Business Phone <span className="text-gray-500">(optional)</span></label>
                  <input className={inputCls} value={bizData.phone}
                    onChange={e => setBizData(p => ({ ...p, phone: e.target.value }))} placeholder="(555) 000-0000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className={labelCls}>Business Email</label>
                  <input className={inputCls} value={bizData.email}
                    onChange={e => setBizData(p => ({ ...p, email: e.target.value }))} placeholder="business@example.com" />
                  {errors.email && <p className={errorCls}>{errors.email}</p>}
                </div>
                <div>
                  <label className={labelCls}>Website <span className="text-gray-500">(optional)</span></label>
                  <input className={inputCls} value={bizData.website}
                    onChange={e => setBizData(p => ({ ...p, website: e.target.value }))} placeholder="https://..." />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Verification ── */}
          {step === 'verification' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Verify Your Business</h2>
              <p className="text-gray-400 text-sm mb-6">
                Verified Black-owned businesses receive a badge on their storefront, building trust with community members.
              </p>

              {/* Self-declaration */}
              <div className={`border rounded-xl p-5 mb-6 cursor-pointer transition-colors ${isBlackOwned ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-[#2A2A2A]'}`}
                onClick={() => setIsBlackOwned(p => !p)}>
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${isBlackOwned ? 'bg-red-600 border-red-600' : 'border-gray-500'}`}>
                    {isBlackOwned && <span className="text-white text-xs">✓</span>}
                  </div>
                  <div>
                    <p className="text-white font-medium">I declare that this is a Black-owned business</p>
                    <p className="text-gray-400 text-sm mt-1">
                      By checking this box, you confirm that this business is majority-owned and operated by a Black individual or family.
                    </p>
                  </div>
                </div>
              </div>
              {errors.isBlackOwned && <p className={`${errorCls} -mt-4 mb-4`}>{errors.isBlackOwned}</p>}

              {/* Document upload */}
              <div className="border border-white/10 rounded-xl p-5 bg-[#2A2A2A]">
                <p className="text-white font-medium mb-1">
                  Supporting Document <span className="text-gray-500 font-normal">(optional but recommended)</span>
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  Upload a business license, EIN document, or signed affidavit to expedite verification.
                </p>

                <div className="flex gap-3 mb-3">
                  <select
                    className={`${inputCls} flex-1`}
                    value={docType}
                    onChange={e => setDocType(e.target.value as OnboardingVerificationDoc['docType'])}
                  >
                    {ACCEPTED_DOC_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Uploading…
                      </>
                    ) : (
                      'Upload'
                    )}
                  </button>
                </div>
                {errors.upload && <p className={errorCls}>{errors.upload}</p>}

                {verificationDocs.length > 0 && (
                  <ul className="space-y-2 mt-3">
                    {verificationDocs.map((doc, i) => (
                      <li key={i} className="flex items-center justify-between bg-[#1E1E1E] rounded-lg px-4 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-green-400 text-xs flex-shrink-0">✓</span>
                          <span className="text-white text-sm truncate">{doc.fileName}</span>
                          <span className="text-gray-500 text-xs flex-shrink-0">
                            ({ACCEPTED_DOC_TYPES.find(d => d.value === doc.docType)?.label})
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveDoc(i)}
                          className="text-gray-500 hover:text-red-400 text-sm transition-colors flex-shrink-0 ml-2"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* ── Step 4: Products ── */}
          {step === 'products' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Add Your Products or Services</h2>
              <p className="text-gray-400 text-sm mb-6">
                You can add products now or skip and do it later from your dashboard — which will be activated once you complete onboarding.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => { setSkippedProducts(false); nextStep(); }}
                  className="border-2 border-red-600 rounded-xl p-6 text-left hover:bg-red-600/10 transition-colors group">
                  <div className="text-3xl mb-3">🛍️</div>
                  <p className="text-white font-semibold mb-1">Add Products Now</p>
                  <p className="text-gray-400 text-sm">Go to your dashboard right after completing onboarding to add your first product.</p>
                </button>
                <button
                  onClick={() => { setSkippedProducts(true); nextStep(); }}
                  className="border-2 border-white/10 rounded-xl p-6 text-left hover:border-white/30 transition-colors">
                  <div className="text-3xl mb-3">⏭️</div>
                  <p className="text-white font-semibold mb-1">Skip for Now</p>
                  <p className="text-gray-400 text-sm">Complete onboarding first. Your dashboard will be waiting when you're ready.</p>
                </button>
              </div>
            </div>
          )}

          {/* ── Step 5: Review ── */}
          {step === 'review' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Review & Submit</h2>
              <div className="space-y-4">
                <div className="bg-[#2A2A2A] rounded-xl p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Account</p>
                  <p className="text-white">{regData.firstName} {regData.lastName}</p>
                  <p className="text-gray-400 text-sm">{regData.email}</p>
                </div>
                <div className="bg-[#2A2A2A] rounded-xl p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Business Profile</p>
                  <p className="text-white font-semibold">{bizData.businessName}</p>
                  <p className="text-gray-400 text-sm">{bizData.category} · {bizData.location}</p>
                  <p className="text-gray-300 text-sm mt-2">{bizData.description}</p>
                </div>
                <div className="bg-[#2A2A2A] rounded-xl p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Verification</p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${isBlackOwned ? 'bg-green-500' : 'bg-gray-500'}`} />
                    <span className="text-white text-sm">{isBlackOwned ? 'Black-owned declaration submitted' : 'No declaration'}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    {verificationDocs.length > 0 ? `${verificationDocs.length} document(s) uploaded` : 'No documents uploaded'}
                  </p>
                  <p className="text-yellow-400 text-xs mt-2">Verification status: Pending admin review</p>
                </div>
                <div className="bg-[#2A2A2A] rounded-xl p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Products</p>
                  <p className="text-white text-sm">{skippedProducts ? 'Skipped — will add from dashboard' : 'Will add from dashboard after completing'}</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 6: Complete ── */}
          {step === 'complete' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">You're In the Collective!</h2>
              <p className="text-gray-400 mb-2">
                Welcome, <span className="text-white font-medium">{bizData.businessName || regData.firstName}</span>.
              </p>
              <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm">
                Your storefront is being set up. Your Black-owned verification is <span className="text-yellow-400">pending review</span> — we'll notify you once it's approved.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
                  Go to My Dashboard
                </button>
                <button onClick={() => navigate('/')}
                  className="px-6 py-3 border border-white/20 hover:border-white/40 text-white rounded-lg font-medium transition-colors">
                  Return to Home
                </button>
              </div>
            </div>
          )}

          {/* ── Navigation buttons ── */}
          {step !== 'complete' && step !== 'products' && (
            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
              <button onClick={prevStep} disabled={step === 'registration'}
                className="px-5 py-2.5 border border-white/20 hover:border-white/40 text-white rounded-lg font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                ← Back
              </button>
              {step === 'review' ? (
                <button onClick={handleComplete}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
                  Submit & Go Live 🚀
                </button>
              ) : (
                <button onClick={nextStep}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
                  Continue →
                </button>
              )}
            </div>
          )}

          {/* Back button for products step */}
          {step === 'products' && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <button onClick={prevStep}
                className="px-5 py-2.5 border border-white/20 hover:border-white/40 text-white rounded-lg font-medium transition-colors">
                ← Back
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
