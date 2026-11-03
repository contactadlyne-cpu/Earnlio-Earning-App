import React, { useState } from 'react';
import { OfferItem } from '../../types';
import { SubPageHeader } from '../SubPageHeader';
import { Gift, ChevronRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface OffersScreenProps {
  offers: OfferItem[];
  onBack: () => void;
  onSelectOffer: (offer: OfferItem) => void;
}

export const OffersScreen: React.FC<OffersScreenProps> = ({
  offers,
  onBack,
  onSelectOffer,
}) => {
  return (
    <div className="bg-[#F4F6F1] min-h-screen pb-12 flex flex-col justify-between">
      <div>
        <SubPageHeader title="Offers" onBack={onBack} />

        <div className="p-4 space-y-5">
          {/* HERO CARD */}
          <div className="bg-[#0F3B3A] text-white rounded-[28px] p-6 text-center space-y-3 shadow-md">
            <div className="w-14 h-14 bg-[#CBF53C] text-[#10282A] rounded-[20px] flex items-center justify-center mx-auto shadow-xs">
              <Gift className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">Tasks and offers</h2>
            <p className="text-xs text-[#BFE9E3] font-medium">Earn big rewards for microtasks</p>
          </div>

          {/* AVAILABLE OFFERS LIST */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-[#10282A] tracking-wider uppercase px-1">
              Top offers
            </h3>

            <div className="space-y-2.5">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  onClick={() => onSelectOffer(offer)}
                  className="bg-white hover:bg-slate-50 border border-[#10282A]/5 rounded-[22px] p-4 flex items-center justify-between shadow-2xs cursor-pointer transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 text-[#10282A] font-bold"
                      style={{ backgroundColor: offer.tintColor || '#CBF53C' }}
                    >
                      <Gift className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-extrabold text-[#10282A] leading-tight">
                        {offer.title}
                      </span>
                      <span className="text-[11px] font-medium text-[#5E7270] leading-tight mt-0.5">
                        {offer.subtitle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-[#E3F6DF] text-[#0B6B3A] text-xs font-extrabold px-3 py-1 rounded-full">
                      +${offer.rewardUsd.toFixed(2)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#5E7270]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
