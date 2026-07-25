/**
 * VerificationBadge
 *
 * Renders a colored chip based on verificationTier (1, 2, or 3).
 * Used on business cards, storefronts, dashboards, and search results.
 *
 * Tier 1 — Self-Declared:       Yellow chip
 * Tier 2 — Community Verified:  Blue shield
 * Tier 3 — Document Certified:  Green checkmark
 */

import React from 'react';
import { CheckCircle, Shield, Star } from 'lucide-react';
import type { VerificationTier } from '../types/Verification';

interface VerificationBadgeProps {
  tier: VerificationTier;
  partnerLabel?: string;  // e.g. "Verified by Atlanta Black Chamber"
  size?: 'sm' | 'md';
}

const TIER_CONFIG: Record<
  VerificationTier,
  { label: string; icon: React.ElementType; bg: string; border: string; text: string }
> = {
  1: {
    label: 'Self-Declared',
    icon: Star,
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/40',
    text: 'text-yellow-400',
  },
  2: {
    label: 'Community Verified',
    icon: Shield,
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/40',
    text: 'text-blue-400',
  },
  3: {
    label: 'Certified',
    icon: CheckCircle,
    bg: 'bg-[#228B22]/20',
    border: 'border-[#228B22]/40',
    text: 'text-[#228B22]',
  },
};

export function VerificationBadge({ tier, partnerLabel, size = 'sm' }: VerificationBadgeProps) {
  const config = TIER_CONFIG[tier];
  const Icon = config.icon;
  const iconSize = size === 'md' ? 16 : 13;
  const textClass = size === 'md' ? 'text-sm font-semibold' : 'text-xs font-semibold';

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${config.bg} border ${config.border} rounded-full px-3 py-1`}
      title={partnerLabel ?? config.label}
    >
      <Icon size={iconSize} className={config.text} />
      <span className={`${textClass} ${config.text}`}>
        {partnerLabel ?? config.label}
      </span>
    </div>
  );
}

export default VerificationBadge;
