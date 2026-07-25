/**
 * ReportDialog
 *
 * Allows any logged-in user to flag a business for review.
 * Reports are written to Firestore: reports/{autoId}
 * Admins review open reports in the AdminPanel Moderation tab.
 *
 * Report reasons (aligned with spec):
 * - Not Black-owned
 * - Misrepresentation
 * - Fraudulent products
 * - Inappropriate content
 * - Other
 */

import React, { useState } from 'react';
import { Flag, X, Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { submitReport } from '../services/verificationService';

const REPORT_REASONS = [
  'Not Black-owned',
  'Misrepresentation',
  'Fraudulent products',
  'Inappropriate content',
  'Other',
] as const;

type ReportReason = typeof REPORT_REASONS[number];

interface ReportDialogProps {
  vendorId: string;
  vendorName: string;
}

export function ReportDialog({ vendorId, vendorName }: ReportDialogProps) {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>('Not Black-owned');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!currentUser) return null;

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await submitReport({
        vendorId,
        reporterId: currentUser.uid,
        reason,
        details: details.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Report submission failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSubmitted(false);
    setReason('Not Black-owned');
    setDetails('');
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors"
        title={`Report ${vendorName}`}
      >
        <Flag size={13} />
        Report
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl w-full max-w-md p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-400" />
                <h3 className="text-base font-bold text-white">Report Business</h3>
              </div>
              <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-[#228B22]/20 border border-[#228B22]/40 flex items-center justify-center mx-auto mb-3">
                  <Flag size={22} className="text-[#228B22]" />
                </div>
                <p className="text-white font-semibold mb-1">Report Submitted</p>
                <p className="text-sm text-gray-400">
                  Our moderation team will review your report within 3 business days.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-5 px-5 py-2 bg-[#2A2A2A] text-gray-300 rounded-lg text-sm hover:bg-[#333] transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-400 mb-5">
                  You are reporting <span className="text-white font-semibold">{vendorName}</span>. All reports are reviewed by our moderation team.
                </p>

                {/* Reason */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Reason</label>
                  <div className="space-y-2">
                    {REPORT_REASONS.map(r => (
                      <label key={r} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="reason"
                          value={r}
                          checked={reason === r}
                          onChange={() => setReason(r)}
                          className="accent-red-500"
                        />
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{r}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Additional details <span className="text-gray-500">(optional)</span>
                  </label>
                  <textarea
                    value={details}
                    onChange={e => setDetails(e.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder="Provide any supporting details..."
                    className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 text-sm resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">{details.length}/500</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 border border-[#3A3A3A] text-gray-300 rounded-lg hover:bg-[#2A2A2A] transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <Flag size={15} />}
                    Submit Report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ReportDialog;
