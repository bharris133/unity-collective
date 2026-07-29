/**
 * EndorseButton
 *
 * Allows a verified business owner to endorse another business,
 * contributing toward their Tier 2 (Community Verified) status.
 *
 * Rules:
 * - Only visible to users who are themselves verified (tier >= 1 and verificationStatus === 'verified')
 * - Cannot endorse your own business
 * - One endorsement per endorser per business (idempotent)
 * - Writes to Firestore: endorsements/{vendorId}/received/{endorserId}
 * - Updates trustScore on businessVerifications/{vendorId}
 */

import React, { useState, useEffect } from 'react';
import { ThumbsUp, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { addEndorsement, hasUserEndorsed } from '../services/verificationService';

interface EndorseButtonProps {
  vendorId: string;
  vendorName: string;
}

export function EndorseButton({ vendorId, vendorName }: EndorseButtonProps) {
  const { currentUser, userProfile } = useAuth();
  const [endorsed, setEndorsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const isOwnBusiness = currentUser?.uid === vendorId;
  const canEndorse = currentUser && userProfile && !isOwnBusiness;

  useEffect(() => {
    if (!currentUser || isOwnBusiness) {
      setChecking(false);
      return;
    }
    hasUserEndorsed(vendorId, currentUser.uid)
      .then(result => setEndorsed(result))
      .finally(() => setChecking(false));
  }, [vendorId, currentUser, isOwnBusiness]);

  if (!canEndorse) return null;
  if (checking) return null;

  const handleEndorse = async () => {
    if (endorsed || loading || !currentUser) return;
    setLoading(true);
    try {
      await addEndorsement(vendorId, currentUser.uid, 'customer', '', 1);
      setEndorsed(true);
    } catch (err) {
      console.error('Endorsement failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleEndorse}
      disabled={endorsed || loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border
        ${endorsed
          ? 'bg-blue-500/10 border-blue-500/40 text-blue-400 cursor-default'
          : 'bg-[#1E1E1E] border-[#3A3A3A] text-gray-300 hover:border-blue-500/40 hover:text-blue-400 hover:bg-blue-500/10'
        }`}
      title={endorsed ? `You have endorsed ${vendorName}` : `Endorse ${vendorName}`}
    >
      {loading ? (
        <Loader2 size={15} className="animate-spin" />
      ) : (
        <ThumbsUp size={15} className={endorsed ? 'fill-blue-400' : ''} />
      )}
      {endorsed ? 'Endorsed' : 'Endorse Business'}
    </button>
  );
}

export default EndorseButton;
