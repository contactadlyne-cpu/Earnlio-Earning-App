import React, { useState } from 'react';
import { OfferItem } from '../../types';
import { SubPageHeader } from '../SubPageHeader';
import { formatCurrency } from '../../api';
import { Gift, CheckCircle2, Clock, Sparkles, Check, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

interface OfferDetailsScreenProps {
  offer: OfferItem;
  onBack: () => void;
  onCompleteOffer: (offer: OfferItem) => Promise<void>;
}

export const OfferDetailsScreen: React.FC<OfferDetailsScreenProps> = ({
  offer,
  onBack,
  onCompleteOffer,
}) => {
  // Track checklist completion for each step
  const [completedSteps, setCompletedSteps] = useState<number[]>([0]); // first step ready
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const toggleStep = (idx: number) => {
    if (completedSteps.includes(idx)) {
      setCompletedSteps(completedSteps.filter((s) => s !== idx));
    } else {
      setCompletedSteps([...completedSteps, idx]);
    }
  };

  const allStepsChecked = completedSteps.length >= offer.steps.length;

  const handleVerifyAndClaim = async () => {
    setIsVerifying(true);
    // Simulate verification check
    setTimeout(async () => {
      await onCompleteOffer(offer);
      setIsVerifying(false);
      setIsCompleted(true);
    }, 1500);
  };

  return (
    <div className="bg-[#F4F6F1] min-h-screen pb-24 flex flex-col justify-between">
      <div>
        <SubPageHeader title="Offer Details" onBack={onBack} />

        <div className="p-4 space-y-5 max-w-lg mx-auto w-full">
          {/* OFFER HEADER CARD */}
          <div className="bg-white rounded-[28px] p-6 border border-slate-200/60 shadow-2xs space-y-4 text-center">
            <div
              className="w-16 h-16 rounded-[22px] flex items-center justify-center mx-auto shadow-xs text-[#10282A]"
              style={{ backgroundColor: offer.tintColor || '#CBF53C' }}
            >
              <Gift className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-extrabold text-[#0E7C74] uppercase tracking-wider block mb-1">
                Verified Microtask
              </span>
              <h2 className="text-xl font-extrabold text-[#10282A] tracking-tight">{offer.title}</h2>
              <p className="text-xs text-[#5E7270] font-medium mt-1">{offer.subtitle}</p>
            </div>

            <div className="inline-flex items-center gap-2 bg-[#E3F6DF] text-[#0B6B3A] text-sm font-extrabold px-4 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-[#0B6B3A]" />
              <span>+{formatCurrency(offer.rewardUsd)} ({offer.points} points)</span>
            </div>
          </div>

          {/* INTERACTIVE CHECKLIST OF STEPS */}
          <div className="bg-white rounded-[24px] p-5 border border-slate-200/60 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-[#10282A] tracking-wider uppercase">
                Steps to complete
              </h3>
              <span className="text-xs font-bold text-[#0E7C74]">
                {completedSteps.length} of {offer.steps.length} done
              </span>
            </div>

            {/* PROGRESS BAR */}
            <div className="w-full h-1.5 bg-[#F4F6F1] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0E7C74] transition-all duration-300"
                style={{ width: `${(completedSteps.length / offer.steps.length) * 100}%` }}
              />
            </div>

            <div className="space-y-2.5 pt-2">
              {offer.steps.map((step, idx) => {
                const isChecked = completedSteps.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`p-3.5 rounded-[18px] border transition-all flex items-center justify-between cursor-pointer ${
                      isChecked
                        ? 'bg-[#E3F6DF]/40 border-[#0B6B3A]/30 text-[#10282A]'
                        : 'bg-[#F4F6F1] border-slate-200/80 text-[#5E7270] hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-colors shrink-0 ${
                          isChecked
                            ? 'bg-[#0B6B3A] text-white'
                            : 'bg-white border border-slate-300 text-[#5E7270]'
                        }`}
                      >
                        {isChecked ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <span className={`text-xs font-bold ${isChecked ? 'text-[#10282A]' : 'text-[#5E7270]'}`}>
                        {step}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-[#5E7270]">
                      {isChecked ? 'Done' : 'Tap to mark'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ESTIMATED CREDIT TIME */}
          <div className="bg-[#BFE9E3]/40 border border-[#BFE9E3] rounded-[22px] p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#0F3B3A] shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#0F3B3A]">Estimated Processing</span>
              <span className="text-[11px] font-medium text-[#0F3B3A]/80">
                {offer.estimatedTime || 'Credited within 24 hours.'}
              </span>
            </div>
          </div>

          {/* SAFETY BADGE */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#5E7270]">
            <ShieldCheck className="w-4 h-4 text-[#0B6B3A]" />
            <span>Guaranteed reward by Earnlio Partner Network</span>
          </div>
        </div>
      </div>

      {/* STICKY CTA BUTTON */}
      <div className="p-4 max-w-lg mx-auto w-full">
        {isCompleted ? (
          <div className="bg-[#E3F6DF] text-[#0B6B3A] p-4 rounded-full text-center text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
            <span>Offer Verified! +{formatCurrency(offer.rewardUsd)} Credited!</span>
          </div>
        ) : isVerifying ? (
          <div className="w-full bg-[#0F3B3A] text-white font-extrabold py-3.5 rounded-full text-xs flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#CBF53C]" />
            <span>Verifying completion with partner...</span>
          </div>
        ) : (
          <button
            onClick={handleVerifyAndClaim}
            className={`w-full font-extrabold py-3.5 rounded-full text-xs shadow-xs cursor-pointer transition-all active:scale-98 flex items-center justify-center gap-2 ${
              allStepsChecked
                ? 'bg-[#CBF53C] hover:bg-[#b8e030] text-[#10282A]'
                : 'bg-[#0F3B3A] hover:bg-[#0c3130] text-white'
            }`}
          >
            <span>{allStepsChecked ? 'Verify & Claim Reward' : 'Start Task & Complete Steps'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
