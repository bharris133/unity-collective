import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Camera, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { uploadProfileAvatar } from '../services/storageService';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { userProfile, currentUser, updateUserProfile, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    displayName: userProfile?.displayName ?? '',
    firstName: userProfile?.firstName ?? '',
    lastName: userProfile?.lastName ?? '',
    bio: userProfile?.bio ?? '',
    phone: userProfile?.phone ?? '',
    website: userProfile?.website ?? '',
    location: userProfile?.location ?? '',
  });

  const [avatarPreview, setAvatarPreview] = useState<string>(userProfile?.profilePicture ?? '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (!currentUser || !userProfile) {
    navigate('/');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveState('saving');
    setErrorMsg('');

    try {
      let profilePicture = userProfile.profilePicture ?? '';

      if (avatarFile) {
        const result = await uploadProfileAvatar(currentUser.uid, avatarFile);
        profilePicture = result.url;
      }

      await updateUserProfile({ ...form, profilePicture });
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setErrorMsg('Failed to save profile. Please try again.');
      setSaveState('error');
    }
  };

  const initials = (form.firstName?.[0] ?? '') + (form.lastName?.[0] ?? '');

  return (
    <div className="min-h-screen bg-[#111111] py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Your Profile</h1>
          <p className="text-gray-400">Update your personal information and avatar</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Avatar section */}
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-[#2A2A2A] border-2 border-[#3A3A3A] overflow-hidden flex items-center justify-center">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : initials ? (
                    <span className="text-2xl font-bold text-[#D4AF37]">{initials.toUpperCase()}</span>
                  ) : (
                    <User size={32} className="text-gray-500" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#D4AF37] flex items-center justify-center hover:bg-[#C49B2A] transition-colors"
                  title="Change avatar"
                >
                  <Camera size={13} className="text-black" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div>
                <p className="text-white font-semibold">{form.displayName || 'Your Name'}</p>
                <p className="text-gray-400 text-sm">{userProfile.email}</p>
                <p className="text-gray-500 text-xs mt-1 capitalize">{userProfile.role}</p>
              </div>
            </div>
          </div>

          {/* Form fields */}
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-6 mb-6 space-y-5">
            <h2 className="text-lg font-semibold text-white mb-4">Personal Information</h2>

            {/* Display name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                name="displayName"
                value={form.displayName}
                onChange={handleChange}
                placeholder="How you appear to others"
                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            {/* First / Last name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First"
                  className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last"
                  className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Bio
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Tell the community about yourself"
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

            {/* Phone / Website */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(555) 000-0000"
                  className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>
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

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email <span className="text-gray-500 font-normal">(cannot be changed here)</span>
              </label>
              <input
                type="email"
                value={userProfile.email}
                disabled
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-gray-500 text-sm cursor-not-allowed"
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

          {/* Save button */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 border border-[#3A3A3A] text-gray-300 rounded-lg hover:bg-[#2A2A2A] transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveState === 'saving'}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#D4AF37] hover:bg-[#C49B2A] disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors text-sm"
            >
              {saveState === 'saving' ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : saveState === 'saved' ? (
                <>
                  <CheckCircle size={16} />
                  Saved!
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
