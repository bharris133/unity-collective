import { useState, useEffect } from 'react';
import {
  Users,
  Building,
  Package,
  Calendar,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  ShieldCheck,
  ShieldX,
  ChevronRight,
  AlertTriangle,
  Mail,
} from 'lucide-react';
import { emailLogService, type EmailLog } from '../../services/emailLogService';
import { useAuth } from '../../contexts/AuthContext';
import {
  type OnboardingState,
  type VerificationStatus,
} from '../../data/mockOnboarding';
import {
  getAllOnboardingStates,
  saveOnboardingState,
} from '../../services/onboardingService';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// ─── Shared style tokens ──────────────────────────────────────────────────────
const PANEL_BG   = 'bg-[#0A0A0A]';
const SIDEBAR_BG = 'bg-[#111111]';
const CARD_BG    = 'bg-[#1A1A1A]';
const BORDER     = 'border-[#2A2A2A]';
const TEXT_GOLD  = 'text-[#D4AF37]';
const TEXT_MUTED = 'text-[#888888]';
const BTN_GREEN  = 'bg-[#2D6A2D] hover:bg-[#3A8A3A] text-white';
const BTN_RED    = 'bg-[#8B1A1A] hover:bg-[#B22222] text-white';
const BTN_GOLD   = 'bg-[#D4AF37] hover:bg-[#E8C84A] text-black';
const BADGE_PENDING  = 'bg-yellow-900/40 text-yellow-400 border border-yellow-700/50';
const BADGE_VERIFIED = 'bg-green-900/40 text-green-400 border border-green-700/50';
const BADGE_REJECTED = 'bg-red-900/40 text-red-400 border border-red-700/50';

function statusBadgeClass(status: VerificationStatus) {
  if (status === 'verified')   return BADGE_VERIFIED;
  if (status === 'rejected')   return BADGE_REJECTED;
  if (status === 'pending')    return BADGE_PENDING;
  return 'bg-gray-800 text-gray-400 border border-gray-700';
}

function statusLabel(status: VerificationStatus) {
  if (status === 'verified')   return 'Verified';
  if (status === 'rejected')   return 'Rejected';
  if (status === 'pending')    return 'Pending';
  return 'Unverified';
}

// ─── Main AdminPanel ──────────────────────────────────────────────────────────
export default function AdminPanel() {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('verifications');

  if (!userProfile?.isAdmin) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${PANEL_BG}`}>
        <div className="text-center">
          <XCircle size={64} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className={TEXT_MUTED}>You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'verifications', name: 'Verifications', icon: ShieldCheck },
    { id: 'dashboard',     name: 'Dashboard',     icon: BarChart3 },
    { id: 'users',         name: 'Users',          icon: Users },
    { id: 'businesses',    name: 'Businesses',     icon: Building },
    { id: 'products',      name: 'Products',       icon: Package },
    { id: 'events',        name: 'Events',         icon: Calendar },
    { id: 'email_logs',    name: 'Email Logs',     icon: Mail },
    { id: 'settings',      name: 'Settings',       icon: Settings },
  ];

  return (
    <div className={`min-h-screen ${PANEL_BG} flex`}>
      {/* Sidebar */}
      <aside className={`w-64 ${SIDEBAR_BG} border-r ${BORDER} flex flex-col`}>
        <div className="p-6 border-b border-[#2A2A2A]">
          <h2 className={`text-xl font-bold ${TEXT_GOLD}`}>Admin Panel</h2>
          <p className={`text-xs ${TEXT_MUTED} mt-1`}>[Unity Collective]</p>
        </div>
        <nav className="flex-1 py-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-6 py-3 text-left text-sm transition-colors ${
                  isActive
                    ? `${TEXT_GOLD} border-r-2 border-[#D4AF37] bg-[#D4AF37]/10`
                    : `text-[#AAAAAA] hover:text-white hover:bg-white/5`
                }`}
              >
                <Icon size={18} className="mr-3 flex-shrink-0" />
                {tab.name}
                {tab.id === 'verifications' && <PendingBadge />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === 'verifications' && <VerificationsTab />}
        {activeTab === 'dashboard'     && <DashboardTab />}
        {activeTab === 'users'         && <UsersTab />}
        {activeTab === 'businesses'    && <BusinessesTab />}
        {activeTab === 'products'      && <ProductsTab />}
        {activeTab === 'events'        && <EventsTab />}
        {activeTab === 'email_logs'    && <EmailLogsTab />}
        {activeTab === 'settings'      && <SettingsTab />}
      </main>
    </div>
  );
}

// Small red dot badge showing pending count
function PendingBadge() {
  const [pendingCount, setPendingCount] = useState(0);
  useEffect(() => {
    getAllOnboardingStates()
      .then(states => setPendingCount(states.filter(s => s.verificationStatus === 'pending').length))
      .catch(() => setPendingCount(0));
  }, []);
  if (pendingCount === 0) return null;
  return (
    <span className="ml-auto bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {pendingCount}
    </span>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDisplayName(memberId: string): string {
  return memberId;
}

// ─── Verifications Tab ────────────────────────────────────────────────────────
function VerificationsTab() {
  const [states, setStates] = useState<OnboardingState[]>([]);
  const [selected, setSelected] = useState<OnboardingState | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [filter, setFilter] = useState<'all' | VerificationStatus>('all');

  // Reload from store on mount and after actions
  const reload = () => { getAllOnboardingStates().then(setStates); };
  useEffect(() => { reload(); }, []);

  const filtered = filter === 'all'
    ? states
    : states.filter(s => s.verificationStatus === filter);

  const pendingCount  = states.filter(s => s.verificationStatus === 'pending').length;
  const verifiedCount = states.filter(s => s.verificationStatus === 'verified').length;
  const rejectedCount = states.filter(s => s.verificationStatus === 'rejected').length;

  async function handleApprove(state: OnboardingState) {
    const updated = { ...state, verificationStatus: 'verified' as VerificationStatus };
    await saveOnboardingState(updated);
    reload();
    setSelected(updated);
    setShowRejectInput(false);
  }

  async function handleReject(state: OnboardingState) {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    const updated = {
      ...state,
      verificationStatus: 'rejected' as VerificationStatus,
      rejectionReason: rejectReason || 'No reason provided.',
    };
    await saveOnboardingState(updated);
    reload();
    setSelected(updated);
    setShowRejectInput(false);
    setRejectReason('');
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Business Verifications</h1>
        <p className={TEXT_MUTED}>Review and approve Black-owned business applications</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Pending Review', count: pendingCount,  icon: Clock,        color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-800/40' },
          { label: 'Verified',       count: verifiedCount, icon: ShieldCheck,  color: 'text-green-400',  bg: 'bg-green-900/20 border-green-800/40' },
          { label: 'Rejected',       count: rejectedCount, icon: ShieldX,      color: 'text-red-400',    bg: 'bg-red-900/20 border-red-800/40' },
        ].map(({ label, count, icon: Icon, color, bg }) => (
          <div key={label} className={`${CARD_BG} border ${bg} rounded-lg p-5 flex items-center gap-4`}>
            <Icon size={32} className={color} />
            <div>
              <p className={`text-2xl font-bold ${color}`}>{count}</p>
              <p className={`text-sm ${TEXT_MUTED}`}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'verified', 'rejected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === f
                ? `${BTN_GOLD}`
                : `${CARD_BG} text-[#AAAAAA] border ${BORDER} hover:text-white`
            }`}
          >
            {f === 'all' ? 'All' : statusLabel(f as VerificationStatus)}
          </button>
        ))}
      </div>

      {/* Two-pane layout */}
      <div className="flex gap-6">
        {/* List */}
        <div className={`flex-1 ${CARD_BG} border ${BORDER} rounded-lg overflow-hidden`}>
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <ShieldCheck size={48} className="text-[#333] mx-auto mb-3" />
              <p className={TEXT_MUTED}>No submissions in this category.</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#2A2A2A]">
              {filtered.map(state => (
                <li
                  key={state.memberId}
                  onClick={() => { setSelected(state); setShowRejectInput(false); setRejectReason(''); }}
                  className={`flex items-center justify-between px-6 py-4 cursor-pointer transition-colors ${
                    selected?.memberId === state.memberId
                      ? 'bg-[#D4AF37]/10 border-l-2 border-[#D4AF37]'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                      <Building size={18} className={TEXT_GOLD} />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{state.businessProfile.businessName}</p>
                      <p className={`text-xs ${TEXT_MUTED}`}>{getDisplayName(state.memberId)} · {state.businessProfile.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadgeClass(state.verificationStatus)}`}>
                      {statusLabel(state.verificationStatus)}
                    </span>
                    {state.isBlackOwned && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-red-900/40 via-black/40 to-green-900/40 text-[#D4AF37] border border-[#D4AF37]/40">
                        ✦ Black-Owned
                      </span>
                    )}
                    <ChevronRight size={14} className={TEXT_MUTED} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Detail pane */}
        {selected ? (
          <div className={`w-96 ${CARD_BG} border ${BORDER} rounded-lg p-6 flex flex-col gap-5`}>
            <div>
              <h2 className="text-lg font-bold text-white">{selected.businessProfile.businessName}</h2>
              <p className={`text-sm ${TEXT_MUTED}`}>{getDisplayName(selected.memberId)}</p>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusBadgeClass(selected.verificationStatus)}`}>
                {statusLabel(selected.verificationStatus)}
              </span>
              {selected.isBlackOwned && (
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r from-red-900/40 via-black/40 to-green-900/40 text-[#D4AF37] border border-[#D4AF37]/40">
                  ✦ Black-Owned (Self-Declared)
                </span>
              )}
            </div>

            {/* Business profile */}
            <div className={`border ${BORDER} rounded-lg p-4 space-y-2`}>
              <p className={`text-xs font-semibold uppercase tracking-wider ${TEXT_MUTED} mb-3`}>Business Profile</p>
              {[
                { label: 'Category',    value: selected.businessProfile.category },
                { label: 'Location',    value: selected.businessProfile.location },
                { label: 'Phone',       value: selected.businessProfile.phone },
                { label: 'Email',       value: selected.businessProfile.email },
                { label: 'Website',     value: selected.businessProfile.website || '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className={TEXT_MUTED}>{label}</span>
                  <span className="text-white text-right max-w-[180px] truncate">{value}</span>
                </div>
              ))}
              <div className="pt-2">
                <p className={`text-xs ${TEXT_MUTED} mb-1`}>Description</p>
                <p className="text-sm text-white leading-relaxed">{selected.businessProfile.description}</p>
              </div>
            </div>

            {/* Submitted documents */}
            <div className={`border ${BORDER} rounded-lg p-4`}>
              <p className={`text-xs font-semibold uppercase tracking-wider ${TEXT_MUTED} mb-3`}>
                Submitted Documents ({selected.verificationDocs.length})
              </p>
              {selected.verificationDocs.length === 0 ? (
                <p className={`text-sm ${TEXT_MUTED}`}>No documents uploaded.</p>
              ) : (
                <ul className="space-y-2">
                  {selected.verificationDocs.map((doc, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <FileText size={16} className={TEXT_GOLD} />
                      <div>
                        <p className="text-white">{doc.fileName}</p>
                        <p className={`text-xs ${TEXT_MUTED}`}>{doc.docType} · {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Timestamps */}
            <div className={`text-xs ${TEXT_MUTED} space-y-1`}>
              <p>Submitted: {new Date(selected.startedAt).toLocaleDateString()}</p>
              {selected.completedAt && <p>Completed: {new Date(selected.completedAt).toLocaleDateString()}</p>}
            </div>

            {/* Actions — only show if pending */}
            {selected.verificationStatus === 'pending' && (
              <div className="space-y-3 pt-2 border-t border-[#2A2A2A]">
                <button
                  onClick={() => handleApprove(selected)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold ${BTN_GREEN} transition-colors`}
                >
                  <ShieldCheck size={16} />
                  Approve & Verify
                </button>

                {showRejectInput && (
                  <div>
                    <textarea
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      placeholder="Reason for rejection (optional)..."
                      rows={3}
                      className={`w-full ${CARD_BG} border ${BORDER} rounded-lg px-3 py-2 text-sm text-white placeholder-[#555] focus:outline-none focus:border-red-700 resize-none`}
                    />
                  </div>
                )}

                <button
                  onClick={() => handleReject(selected)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold ${BTN_RED} transition-colors`}
                >
                  <ShieldX size={16} />
                  {showRejectInput ? 'Confirm Rejection' : 'Reject Application'}
                </button>

                {showRejectInput && (
                  <button
                    onClick={() => { setShowRejectInput(false); setRejectReason(''); }}
                    className={`w-full text-sm ${TEXT_MUTED} hover:text-white transition-colors`}
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}

            {/* Already actioned */}
            {selected.verificationStatus === 'verified' && (
              <div className="flex items-center gap-2 text-green-400 text-sm pt-2 border-t border-[#2A2A2A]">
                <CheckCircle size={16} />
                This business has been verified.
              </div>
            )}
            {selected.verificationStatus === 'rejected' && (
              <div className="pt-2 border-t border-[#2A2A2A]">
                <div className="flex items-center gap-2 text-red-400 text-sm mb-2">
                  <AlertTriangle size={16} />
                  This application was rejected.
                </div>
                <button
                  onClick={() => handleApprove(selected)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${BTN_GREEN} transition-colors`}
                >
                  <ShieldCheck size={16} />
                  Override — Approve Anyway
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={`w-96 ${CARD_BG} border ${BORDER} rounded-lg flex items-center justify-center`}>
            <div className="text-center p-8">
              <Eye size={40} className="text-[#333] mx-auto mb-3" />
              <p className={`text-sm ${TEXT_MUTED}`}>Select a submission to review</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────
function DashboardTab() {
  const stats = [
    { name: 'Total Users',      value: '1,247', change: '+12%', icon: Users,    color: 'text-blue-400' },
    { name: 'Active Businesses',value: '89',    change: '+8%',  icon: Building, color: 'text-green-400' },
    { name: 'Products Listed',  value: '456',   change: '+23%', icon: Package,  color: 'text-purple-400' },
    { name: 'Monthly Revenue',  value: '$12,430',change: '+15%',icon: BarChart3,color: TEXT_GOLD },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className={TEXT_MUTED}>Overview of [Unity Collective] platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(({ name, value, change, icon: Icon, color }) => (
          <div key={name} className={`${CARD_BG} border ${BORDER} rounded-lg p-6 flex items-center justify-between`}>
            <div>
              <p className={`text-sm ${TEXT_MUTED}`}>{name}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-sm text-green-400">{change} from last month</p>
            </div>
            <Icon size={32} className={color} />
          </div>
        ))}
      </div>

      <div className={`${CARD_BG} border ${BORDER} rounded-lg`}>
        <div className="p-6 border-b border-[#2A2A2A]">
          <h2 className="text-lg font-bold text-white">Recent Activity</h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            { action: 'New business registered', detail: 'Heritage Foods Market',     time: '2 hours ago' },
            { action: 'Product added',           detail: 'African Spice Collection',  time: '4 hours ago' },
            { action: 'Event created',           detail: 'Business Networking Mixer', time: '6 hours ago' },
            { action: 'User joined',             detail: 'Marcus Johnson',            time: '8 hours ago' },
          ].map((a, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-[#1E1E1E] last:border-0">
              <div>
                <p className="text-sm font-medium text-white">{a.action}</p>
                <p className={`text-xs ${TEXT_MUTED}`}>{a.detail}</p>
              </div>
              <span className={`text-xs ${TEXT_MUTED}`}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState<{ id: string; name: string; email: string; role: string; status: string; joinDate: string }[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      if (USE_MOCK_DATA) {
        const { mockUsers } = await import('../../data/mockUsers');
        setUsers(Object.values(mockUsers).map((u, i) => ({
          id: String(i + 1),
          name: u.displayName,
          email: u.email,
          role: u.role,
          status: 'Active',
          joinDate: (u as any).createdAt ? new Date((u as any).createdAt).toLocaleDateString() : 'N/A',
        })));
        return;
      }
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        setUsers(snapshot.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            name: data.displayName ?? data.firstName ?? d.id,
            email: data.email ?? '',
            role: data.role ?? 'buyer',
            status: 'Active',
            joinDate: data.joinedAt ? new Date(data.joinedAt).toLocaleDateString() : 'N/A',
          };
        }));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className={TEXT_MUTED}>Manage community members</p>
        </div>
        <button className={`${BTN_GOLD} px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2`}>
          <Plus size={16} />
          Add User
        </button>
      </div>

      <div className={`${CARD_BG} border ${BORDER} rounded-lg overflow-hidden`}>
        <table className="min-w-full">
          <thead className="bg-[#111111]">
            <tr>
              {['User', 'Role', 'Status', 'Join Date', 'Actions'].map(h => (
                <th key={h} className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${TEXT_MUTED}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className={`text-xs ${TEXT_MUTED}`}>{user.email}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-400 border border-blue-800/40 capitalize">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${BADGE_VERIFIED}`}>
                    {user.status}
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm ${TEXT_MUTED}`}>{user.joinDate}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button className="text-blue-400 hover:text-blue-300"><Eye size={15} /></button>
                    <button className={TEXT_GOLD + ' hover:text-yellow-300'}><Edit size={15} /></button>
                    <button className="text-red-500 hover:text-red-400"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Businesses Tab ───────────────────────────────────────────────────────────
function BusinessesTab() {
  const [states, setStates] = useState<OnboardingState[]>([]);
  useEffect(() => { getAllOnboardingStates().then(setStates); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Businesses</h1>
          <p className={TEXT_MUTED}>All registered businesses</p>
        </div>
        <button className={`${BTN_GOLD} px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2`}>
          <Plus size={16} />
          Add Business
        </button>
      </div>

      <div className={`${CARD_BG} border ${BORDER} rounded-lg overflow-hidden`}>
        <table className="min-w-full">
          <thead className="bg-[#111111]">
            <tr>
              {['Business', 'Owner', 'Category', 'Status', 'Black-Owned', 'Actions'].map(h => (
                <th key={h} className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${TEXT_MUTED}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {states.map(state => (
              <tr key={state.memberId} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-white">{state.businessProfile.businessName}</p>
                  <p className={`text-xs ${TEXT_MUTED}`}>{state.businessProfile.location}</p>
                </td>
                <td className={`px-6 py-4 text-sm ${TEXT_MUTED}`}>{getDisplayName(state.memberId)}</td>
                <td className={`px-6 py-4 text-sm ${TEXT_MUTED}`}>{state.businessProfile.category}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadgeClass(state.verificationStatus)}`}>
                    {statusLabel(state.verificationStatus)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {state.isBlackOwned
                    ? <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-red-900/40 via-black/40 to-green-900/40 text-[#D4AF37] border border-[#D4AF37]/40">✦ Yes</span>
                    : <span className={`text-xs ${TEXT_MUTED}`}>No</span>
                  }
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button className="text-blue-400 hover:text-blue-300"><Eye size={15} /></button>
                    <button className={TEXT_GOLD + ' hover:text-yellow-300'}><Edit size={15} /></button>
                    <button className="text-red-500 hover:text-red-400"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Products Tab ─────────────────────────────────────────────────────────────
function ProductsTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className={TEXT_MUTED}>Manage marketplace products</p>
        </div>
        <button className={`${BTN_GOLD} px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2`}>
          <Plus size={16} />
          Add Product
        </button>
      </div>
      <div className={`${CARD_BG} border ${BORDER} rounded-lg p-8 text-center`}>
        <Package size={48} className="text-[#333] mx-auto mb-3" />
        <p className={TEXT_MUTED}>Product management interface coming in Phase 3.</p>
      </div>
    </div>
  );
}

// ─── Events Tab ───────────────────────────────────────────────────────────────
function EventsTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Events</h1>
          <p className={TEXT_MUTED}>Manage community events</p>
        </div>
        <button className={`${BTN_GOLD} px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2`}>
          <Plus size={16} />
          Create Event
        </button>
      </div>
      <div className={`${CARD_BG} border ${BORDER} rounded-lg p-8 text-center`}>
        <Calendar size={48} className="text-[#333] mx-auto mb-3" />
        <p className={TEXT_MUTED}>Event management interface coming in Phase 3.</p>
      </div>
    </div>
  );
}

// ─── Email Logs Tab ──────────────────────────────────────────────────────────
const EMAIL_TYPE_LABELS: Record<EmailLog['type'], string> = {
  buyer_confirmation: 'Buyer Confirmation',
  vendor_notification: 'Vendor Notification',
};

function formatLogTimestamp(ts: EmailLog['timestamp']): string {
  if (!ts) return '—';
  const date = (ts as { toDate?: () => Date }).toDate?.() ?? new Date(ts as string);
  return date.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

function EmailLogsTab() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'sent' | 'failed'>('all');

  useEffect(() => {
    emailLogService.getAll()
      .then(setLogs)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? logs : logs.filter(l => l.status === filter);
  const sentCount = logs.filter(l => l.status === 'sent').length;
  const failedCount = logs.filter(l => l.status === 'failed').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Email Logs</h1>
          <p className={TEXT_MUTED}>Transaction email activity across all orders</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-green-400 bg-green-900/30 border border-green-700/30 rounded-full px-3 py-1">{sentCount} sent</span>
          {failedCount > 0 && (
            <span className="text-xs text-red-400 bg-red-900/30 border border-red-700/30 rounded-full px-3 py-1">{failedCount} failed</span>
          )}
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-6">
        {(['all', 'sent', 'failed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              filter === f
                ? 'bg-[#D4AF37] text-black'
                : 'bg-[#2A2A2A] text-gray-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && (
        <p className={`${TEXT_MUTED} text-center py-12`}>Loading email logs...</p>
      )}

      {!loading && filtered.length === 0 && (
        <div className={`${CARD_BG} border ${BORDER} rounded-lg p-12 text-center`}>
          <Mail size={48} className="text-[#333] mx-auto mb-3" />
          <p className={TEXT_MUTED}>
            {filter === 'all' ? 'No email logs yet. They will appear here after the first purchase.' : `No ${filter} emails found.`}
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className={`${CARD_BG} border ${BORDER} rounded-lg overflow-hidden`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">To</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Error</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, i) => (
                <tr key={log.id} className={`border-b border-[#1E1E1E] ${ i % 2 === 0 ? '' : 'bg-white/[0.02]' }`}>
                  <td className="px-4 py-3">
                    {log.status === 'sent' ? (
                      <span className="flex items-center gap-1.5 text-green-400 text-xs font-medium">
                        <CheckCircle size={13} /> Sent
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-red-400 text-xs font-medium">
                        <XCircle size={13} /> Failed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-300">{EMAIL_TYPE_LABELS[log.type]}</td>
                  <td className="px-4 py-3 text-gray-300 max-w-[200px] truncate">{log.to}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-[#D4AF37]">UC-{log.orderId.slice(-8).toUpperCase()}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{formatLogTimestamp(log.timestamp)}</td>
                  <td className="px-4 py-3 text-red-400 text-xs max-w-[200px] truncate">{log.error ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function SettingsTab() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className={TEXT_MUTED}>Platform configuration</p>
      </div>
      <div className={`${CARD_BG} border ${BORDER} rounded-lg p-8 text-center`}>
        <Settings size={48} className="text-[#333] mx-auto mb-3" />
        <p className={TEXT_MUTED}>Settings interface coming in Phase 3.</p>
      </div>
    </div>
  );
}
