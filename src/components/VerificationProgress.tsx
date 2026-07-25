/**
 * VerificationProgress
 *
 * Displays a 3-step tier progression checklist for vendors.
 * Shows which tier they have reached and what's needed for the next tier.
 *
 * Used in:
 * - VendorSettingsPage (full view)
 * - MemberDashboard (compact view)
 */

import React from 'react';
import { CheckCircle, Circle, Star, Shield, Lock } from 'lucide-react';
import type { VerificationTier } from '../types/Verification';

interface VerificationProgressProps {
  tier: VerificationTier;
  endorsementCount?: number;   // number of endorsements received so far
  compact?: boolean;           // compact mode for dashboard sidebar
}

const TIER_STEPS = [
  {
    tier: 1 as VerificationTier,
    title: 'Self-Declared',
    description: 'Check the "I affirm this is a Black-owned business" box during business setup.',
    requirement: 'Complete onboarding with self-attestation',
    icon: Star,
    color: 'yellow',
  },
  {
    tier: 2 as VerificationTier,
    title: 'Community Verified',
    description: 'Receive endorsements from 3 or more verified community members.',
    requirement: '3 endorsements from verified businesses',
    icon: Shield,
    color: 'blue',
  },
  {
    tier: 3 as VerificationTier,
    title: 'Document Certified',
    description: 'Upload an official third-party certification (NMSDC, state MBE, or equivalent) for human review.',
    requirement: 'Upload official certification document',
    icon: CheckCircle,
    color: 'green',
  },
];

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', icon: 'text-yellow-400' },
  blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-400',   icon: 'text-blue-400'   },
  green:  { bg: 'bg-[#228B22]/10',  border: 'border-[#228B22]/30',  text: 'text-[#228B22]',  icon: 'text-[#228B22]'  },
};

export function VerificationProgress({ tier, endorsementCount = 0, compact = false }: VerificationProgressProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {TIER_STEPS.map(step => {
          const achieved = tier >= step.tier;
          const colors = COLOR_MAP[step.color];
          const Icon = step.icon;
          return (
            <div
              key={step.tier}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold
                ${achieved ? `${colors.bg} ${colors.border} ${colors.text}` : 'bg-[#2A2A2A] border-[#3A3A3A] text-gray-500'}`}
              title={step.title}
            >
              {achieved
                ? <Icon size={12} className={colors.icon} />
                : <Lock size={12} />
              }
              T{step.tier}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-6">
      <h3 className="text-base font-bold text-white mb-5">Verification Progress</h3>

      <div className="space-y-4">
        {TIER_STEPS.map((step, idx) => {
          const achieved = tier >= step.tier;
          const isCurrent = tier === step.tier;
          const isNext = tier === step.tier - 1;
          const colors = COLOR_MAP[step.color];
          const Icon = step.icon;

          return (
            <div key={step.tier} className="relative">
              {/* Connector line */}
              {idx < TIER_STEPS.length - 1 && (
                <div className={`absolute left-4 top-9 w-0.5 h-6 ${achieved ? colors.bg.replace('/10', '/40') : 'bg-[#2A2A2A]'}`} />
              )}

              <div className={`flex items-start gap-4 p-4 rounded-lg border transition-colors
                ${achieved
                  ? `${colors.bg} ${colors.border}`
                  : isNext
                    ? 'bg-[#1A1A1A] border-[#2A2A2A] border-dashed'
                    : 'bg-[#161616] border-[#222] opacity-50'
                }`}
              >
                {/* Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                  ${achieved ? `${colors.bg} border ${colors.border}` : 'bg-[#2A2A2A] border border-[#3A3A3A]'}`}
                >
                  {achieved
                    ? <Icon size={16} className={colors.icon} />
                    : <Circle size={16} className="text-gray-600" />
                  }
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-semibold ${achieved ? colors.text : 'text-gray-400'}`}>
                      Tier {step.tier} — {step.title}
                    </span>
                    {isCurrent && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.border} border ${colors.text}`}>
                        Current
                      </span>
                    )}
                    {achieved && !isCurrent && (
                      <CheckCircle size={14} className={colors.icon} />
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed ${achieved ? 'text-gray-300' : 'text-gray-500'}`}>
                    {step.description}
                  </p>

                  {/* Endorsement progress bar for Tier 2 */}
                  {step.tier === 2 && !achieved && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Endorsements</span>
                        <span className="text-xs text-blue-400">{endorsementCount} / 3</span>
                      </div>
                      <div className="h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${Math.min((endorsementCount / 3) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Tier 3 upload CTA */}
                  {step.tier === 3 && !achieved && tier >= 1 && (
                    <a
                      href="/vendor/settings"
                      className="inline-block mt-2 text-xs text-[#D4AF37] hover:underline"
                    >
                      Upload certification in Store Settings →
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VerificationProgress;
