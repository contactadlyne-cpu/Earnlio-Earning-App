import React from 'react';
import { WalletState, Transaction, ScreenName } from '../../types';
import { Play, FileText, BookOpen, Gift } from 'lucide-react';

interface DashboardTabProps {
  wallet: WalletState;
  transactions: Transaction[];
  onNavigateScreen: (screen: ScreenName) => void;
  onOpenWithdraw: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  wallet,
  transactions,
  onNavigateScreen,
  onOpenWithdraw,
}) => {
  const minThreshold = wallet.payoutThresholdUsd || 10.0;
  const currentBalance = wallet.balanceUsd || 0;
  const currentPoints = wallet.points || 0;

  const progressPercent = Math.min(
    100,
    Math.floor((currentBalance / minThreshold) * 100)
  );

  const renderCategoryIcon = (category: string) => {
    switch (category) {
      case 'Videos':
        return (
          <div className="w-12 h-12 rounded-[16px] bg-[#BFE9E3] text-[#0F3B3A] flex items-center justify-center shrink-0">
            <Play className="w-5 h-5 fill-[#0F3B3A]/20" />
          </div>
        );
      case 'Articles':
        return (
          <div className="w-12 h-12 rounded-[16px] bg-[#FFD9B8] text-[#10282A] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        );
      case 'Ebooks':
        return (
          <div className="w-12 h-12 rounded-[16px] bg-[#E2DAFF] text-[#10282A] flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-[16px] bg-[#CBF53C] text-[#10282A] flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="p-4 space-y-6 pb-28">
      {/* 1. PROGRESS TO PAYOUT CARD */}
      <div className="bg-[#0F3B3A] text-white rounded-[28px] p-6 shadow-md space-y-4 relative overflow-hidden">
        <span className="text-[11px] font-extrabold tracking-wider text-[#BFE9E3] uppercase block">
          Progress to payout
        </span>

        {/* BALANCE & POINTS PILL */}
        <div className="space-y-2">
          <div className="text-4xl font-black tracking-tight text-white">
            ${currentBalance.toFixed(2)}
          </div>
          <div className="inline-flex items-center bg-[#CBF53C] text-[#10282A] text-xs font-extrabold px-3 py-1 rounded-full shadow-xs">
            <span>{currentPoints.toFixed(2)} points</span>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-white/90">
            <span>Progress to ${minThreshold.toFixed(2)}</span>
            <span className="text-[#CBF53C] font-extrabold">{progressPercent}%</span>
          </div>

          <div className="w-full h-2.5 bg-white/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#CBF53C] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.max(2, progressPercent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-medium text-[#BFE9E3]">
            <span>$0.00</span>
            <span>${minThreshold.toFixed(2)} (10,000 points)</span>
          </div>
        </div>

        {/* IF THRESHOLD REACHED */}
        {currentBalance >= minThreshold && (
          <button
            onClick={onOpenWithdraw}
            className="w-full mt-2 bg-[#CBF53C] hover:bg-[#bce62b] text-[#10282A] font-extrabold py-3 px-4 rounded-full text-xs transition-all shadow-md active:scale-[0.98] cursor-pointer"
          >
            Threshold Reached! Withdraw Now
          </button>
        )}
      </div>

      {/* 2. EXPLORE WAYS TO EARN */}
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-[#10282A] tracking-tight">
          Explore ways to earn
        </h2>

        <div className="grid grid-cols-4 gap-2.5">
          {/* VIDEOS */}
          <button
            onClick={() => onNavigateScreen('videos')}
            className="bg-white hover:bg-slate-50 border border-[#10282A]/5 rounded-[22px] p-3 flex flex-col items-center justify-center text-center space-y-2 transition-all active:scale-95 shadow-xs cursor-pointer min-h-[90px]"
          >
            <div className="w-11 h-11 rounded-[16px] bg-[#BFE9E3] text-[#0F3B3A] flex items-center justify-center">
              <Play className="w-5 h-5 fill-[#0F3B3A]/20" />
            </div>
            <span className="text-xs font-bold text-[#10282A]">Videos</span>
          </button>

          {/* ARTICLES */}
          <button
            onClick={() => onNavigateScreen('articles')}
            className="bg-white hover:bg-slate-50 border border-[#10282A]/5 rounded-[22px] p-3 flex flex-col items-center justify-center text-center space-y-2 transition-all active:scale-95 shadow-xs cursor-pointer min-h-[90px]"
          >
            <div className="w-11 h-11 rounded-[16px] bg-[#FFD9B8] text-[#10282A] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#10282A]">Articles</span>
          </button>

          {/* EBOOKS */}
          <button
            onClick={() => onNavigateScreen('ebooks')}
            className="bg-white hover:bg-slate-50 border border-[#10282A]/5 rounded-[22px] p-3 flex flex-col items-center justify-center text-center space-y-2 transition-all active:scale-95 shadow-xs cursor-pointer min-h-[90px]"
          >
            <div className="w-11 h-11 rounded-[16px] bg-[#E2DAFF] text-[#10282A] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#10282A]">Ebooks</span>
          </button>

          {/* OFFERS */}
          <button
            onClick={() => onNavigateScreen('offers')}
            className="bg-white hover:bg-slate-50 border border-[#10282A]/5 rounded-[22px] p-3 flex flex-col items-center justify-center text-center space-y-2 transition-all active:scale-95 shadow-xs cursor-pointer min-h-[90px]"
          >
            <div className="w-11 h-11 rounded-[16px] bg-[#CBF53C] text-[#10282A] flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#10282A]">Offers</span>
          </button>
        </div>
      </div>

      {/* 3. EARNINGS HISTORY */}
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-[#10282A] tracking-tight">
          Earnings history
        </h2>

        <div className="space-y-2.5">
          {transactions.length === 0 ? (
            <div className="bg-white rounded-[22px] p-6 text-center text-[#5E7270] text-xs font-medium border border-[#10282A]/5">
              No transactions to show
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white border border-[#10282A]/5 rounded-[22px] p-3.5 flex items-center justify-between shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  {renderCategoryIcon(tx.category)}
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-[#10282A] leading-tight">
                      {tx.category}
                    </span>
                    <span className="text-[11px] font-medium text-[#5E7270] leading-tight mt-0.5">
                      {tx.timestamp}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-[#E3F6DF] text-[#0B6B3A] text-xs font-extrabold px-2.5 py-1 rounded-full">
                    +{tx.amountUsd >= 0.01 ? tx.amountUsd.toFixed(2) : tx.amountUsd.toFixed(3)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
