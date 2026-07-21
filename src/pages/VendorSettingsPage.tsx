import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, Camera, Save, Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import ProductCsvUpload from '../components/ProductCsvUpload';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { getOnboardingState } from '../services/onboardingService';
import { uploadBusinessLogo } from '../services/storageService';
import type { OnboardingState } from '../data/mockOnboarding';

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

  // Load onboarding data + any existing override
  useEffect(() => {
    if (!currentUser) return;

    const load = async () => {
      setDataLoading(true);
      try {
        const ob = await getOnboardingState(currentUser.uid);
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

          {/* Verification status (read-only) */}
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Verification Status</h2>
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${
                onboarding?.verificationStatus === 'verified' ? 'bg-[#228B22]' :
                onboarding?.verificationStatus === 'pending' ? 'bg-yellow-500' :
                onboarding?.verificationStatus === 'rejected' ? 'bg-[#CC0000]' :
                'bg-[#555555]'
              }`} />
              <span className="text-white capitalize">
                {onboarding?.verificationStatus ?? 'Not started'}
              </span>
              {onboarding?.verificationStatus !== 'verified' && (
                <Link
                  to="/onboarding"
                  className="ml-auto text-sm text-[#D4AF37] hover:text-[#C49B2A] transition-colors"
                >
                  Complete verification →
                </Link>
              )}
            </div>
          </div>

          {/* Error message */}
          {saveState === 'error' && (
            <div className="flex items-center gap-2 text-red-400 text-sm mb-4 bg-red-600/10 border border-red-600/20 rounded-lg px-4 py-3">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
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
