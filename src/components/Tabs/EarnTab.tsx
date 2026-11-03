import React from 'react';
import { ScreenName } from '../../types';
import { Play, FileText, BookOpen, Gift, ChevronRight } from 'lucide-react';

interface EarnTabProps {
  onNavigateScreen: (screen: ScreenName) => void;
}

export const EarnTab: React.FC<EarnTabProps> = ({ onNavigateScreen }) => {
  return (
    <div className="p-4 space-y-5 pb-28">
      {/* YOU WILL EARN FORMULA CARD */}
      <div className="bg-white rounded-[28px] p-6 shadow-xs border border-[#10282A]/5 text-center space-y-4">
        <span className="text-xs font-semibold text-[#5E7270] block">You will earn</span>

        <div className="text-2xl font-black text-[#0B6B3A] tracking-tight">
          1000 points = $1.00
        </div>

        {/* 3 STEPS ROW */}
        <div className="grid grid-cols-3 gap-2 border-t border-[#10282A]/5 pt-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-[#10282A] text-white text-xs font-extrabold flex items-center justify-center mb-1 shadow-xs">
              1
            </div>
            <span className="text-xs font-extrabold text-[#10282A]">Select</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-[#10282A] text-white text-xs font-extrabold flex items-center justify-center mb-1 shadow-xs">
              2
            </div>
            <span className="text-xs font-extrabold text-[#10282A]">Start</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-[#10282A] text-white text-xs font-extrabold flex items-center justify-center mb-1 shadow-xs">
              3
            </div>
            <span className="text-xs font-extrabold text-[#10282A]">Withdraw</span>
          </div>
        </div>
      </div>

      {/* 4 CATEGORY ROWS */}
      <div className="space-y-3">
        {/* VIDEOS */}
        <div
          onClick={() => onNavigateScreen('videos')}
          className="bg-white hover:bg-slate-50 border border-[#10282A]/5 rounded-[22px] p-4 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] shadow-2xs group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-[16px] bg-[#BFE9E3] text-[#0F3B3A] flex items-center justify-center shrink-0">
              <Play className="w-6 h-6 fill-[#0F3B3A]/20" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-[#10282A] leading-snug">Videos</span>
              <span className="text-xs font-medium text-[#5E7270] leading-snug">
                Quickest rewards here
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#10282A] group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* ARTICLES */}
        <div
          onClick={() => onNavigateScreen('articles')}
          className="bg-white hover:bg-slate-50 border border-[#10282A]/5 rounded-[22px] p-4 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] shadow-2xs group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-[16px] bg-[#FFD9B8] text-[#10282A] flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-[#10282A] leading-snug">Articles</span>
              <span className="text-xs font-medium text-[#5E7270] leading-snug">
                Earn for reading
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#10282A] group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* EBOOKS */}
        <div
          onClick={() => onNavigateScreen('ebooks')}
          className="bg-white hover:bg-slate-50 border border-[#10282A]/5 rounded-[22px] p-4 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] shadow-2xs group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-[16px] bg-[#E2DAFF] text-[#10282A] flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-[#10282A] leading-snug">Ebooks</span>
              <span className="text-xs font-medium text-[#5E7270] leading-snug">
                Earn as you read
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#10282A] group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* OFFERS */}
        <div
          onClick={() => onNavigateScreen('offers')}
          className="bg-white hover:bg-slate-50 border border-[#10282A]/5 rounded-[22px] p-4 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] shadow-2xs group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-[16px] bg-[#CBF53C] text-[#10282A] flex items-center justify-center shrink-0">
              <Gift className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-[#10282A] leading-snug">Offers</span>
              <span className="text-xs font-medium text-[#5E7270] leading-snug">
                Microtasks and offers
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#10282A] group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
