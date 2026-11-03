import React from 'react';
import { UserState, Transaction, AppConfig, EarningCategoryType } from '../types';
import { ChevronRight } from 'lucide-react';
import { formatCurrency } from '../api';
import {
  CategoryIconVideos,
  CategoryIconArticles,
  CategoryIconEbooks,
  CategoryIconOffers,
} from './Icons3D';

interface DashboardViewProps {
  user: UserState;
  config: AppConfig;
  transactions: Transaction[];
  onSelectCategory: (category: EarningCategoryType) => void;
  onOpenWallet: () => void;
  onOpenTransactionsHistory?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  config,
  transactions,
  onSelectCategory,
  onOpenWallet,
  onOpenTransactionsHistory,
}) => {
  const minThreshold = config.minWithdrawalUsd || 10.0;
  const currentBalance = user.balanceUsd || 0.0;
  const currentPoints = user.points || 0;

  // Calculate percentage toward redemption
  const progressPercent = Math.min(100, Math.floor((currentBalance / minThreshold) * 100));
  const reqPointsFormatted = (minThreshold * 1000).toLocaleString();

  // 4 Confirmed Earning Categories with Custom 3D Themes and Badges
  const categories: Array<{
    id: EarningCategoryType;
    title: string;
    description: string;
    badgeText: string;
    icon: React.ReactNode;
    cardGradient: string;
    borderStyle: string;
    ringStyle: string;
    badgeStyle: string;
  }> = [
    {
      id: 'Videos',
      title: 'Videos',
      description: 'Quickest rewards here',
      badgeText: 'Quick Watch',
      icon: <CategoryIconVideos className="w-11 h-11 transition-transform duration-300 group-hover:scale-110 drop-shadow-xs" />,
      cardGradient: 'from-[#DFF6F9] via-[#ECFAF8] to-[#F7FDFF]',
      borderStyle: 'border-cyan-300/90 hover:border-cyan-500/90 shadow-2xs hover:shadow-md',
      ringStyle: 'bg-cyan-500/20 border-cyan-400/60',
      badgeStyle: 'bg-[#0891B2] text-white group-hover:bg-[#0F3B3A] group-hover:text-[#22D3EE]',
    },
    {
      id: 'Articles',
      title: 'Articles',
      description: 'Read & finish articles',
      badgeText: 'Read & Claim',
      icon: <CategoryIconArticles className="w-11 h-11 transition-transform duration-300 group-hover:scale-110 drop-shadow-xs" />,
      cardGradient: 'from-[#FFE8CC] via-[#FFF3E5] to-[#FFFBF5]',
      borderStyle: 'border-amber-300/90 hover:border-amber-500/90 shadow-2xs hover:shadow-md',
      ringStyle: 'bg-amber-500/20 border-amber-400/60',
      badgeStyle: 'bg-[#E65100] text-white group-hover:bg-[#FF9800]',
    },
    {
      id: 'Ebooks',
      title: 'eBooks',
      description: 'Earn per minute read',
      badgeText: 'Per Minute',
      icon: <CategoryIconEbooks className="w-11 h-11 transition-transform duration-300 group-hover:scale-110 drop-shadow-xs" />,
      cardGradient: 'from-[#E9D5FF] via-[#F3E8FF] to-[#FAF5FF]',
      borderStyle: 'border-purple-300/90 hover:border-purple-500/90 shadow-2xs hover:shadow-md',
      ringStyle: 'bg-purple-500/20 border-purple-400/60',
      badgeStyle: 'bg-[#6B21A8] text-white group-hover:bg-[#9333EA]',
    },
    {
      id: 'Offers',
      title: 'Offers',
      description: 'Microtasks & rewards',
      badgeText: 'Up to $5.00',
      icon: <CategoryIconOffers className="w-11 h-11 transition-transform duration-300 group-hover:scale-110 drop-shadow-xs" />,
      cardGradient: 'from-[#D9F99D] via-[#ECFDF5] to-[#F7FEE7]',
      borderStyle: 'border-emerald-300/90 hover:border-emerald-500/90 shadow-2xs hover:shadow-md',
      ringStyle: 'bg-[#CBF53C]/40 border-[#CBF53C]/90',
      badgeStyle: 'bg-[#0F3B3A] text-[#CBF53C] group-hover:bg-[#CBF53C] group-hover:text-[#10282A]',
    },
  ];

  // Category Icon Resolver for Reward History using 3D Icons
  const renderCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'videos':
        return <CategoryIconVideos className="w-10 h-10 shrink-0 drop-shadow-xs" />;
      case 'ebooks':
      case 'books':
        return <CategoryIconEbooks className="w-10 h-10 shrink-0 drop-shadow-xs" />;
      case 'articles':
        return <CategoryIconArticles className="w-10 h-10 shrink-0 drop-shadow-xs" />;
      case 'offers':
      default:
        return <CategoryIconOffers className="w-10 h-10 shrink-0 drop-shadow-xs" />;
    }
  };

  return (
    <div className="px-4 pt-1.5 pb-28 space-y-5">
      {/* 1. PROGRESS TO REDEMPTION CARD */}
      <div className="bg-gradient-to-br from-[#0F3B3A] via-[#0E4A48] to-[#0A2E2D] text-white rounded-[28px] p-5 shadow-md border border-white/10 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#CBF53C]/10 rounded-full blur-2xl pointer-events-none" />

        <h2 className="text-center font-extrabold text-white text-base mb-3.5 tracking-tight font-['Outfit',sans-serif]">
          Progress to Redemption
        </h2>

        {/* CURRENT BALANCE BLOCK */}
        <div className="bg-white/10 rounded-2xl p-4 text-center mb-4 backdrop-blur-md border border-white/10 shadow-inner">
          <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase block mb-1">
            Current Balance
          </span>
          <div className="text-3xl font-black text-white tracking-tight font-['Outfit',sans-serif]">
            {formatCurrency(currentBalance)}
          </div>
          <div className="inline-flex items-center gap-1.5 bg-[#CBF53C] text-[#10282A] text-xs font-black px-3.5 py-1 rounded-full mt-2.5 shadow-sm">
            <span>{Math.round(currentBalance * 1000).toLocaleString()} points</span>
          </div>
        </div>

        {/* PROGRESS BAR BLOCK */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-white/90">
            <span>Progress to $10.00</span>
            <span className="text-[#CBF53C] font-extrabold font-['Outfit',sans-serif]">{progressPercent}%</span>
          </div>

          <div className="relative w-full h-3 bg-black/25 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-[#CBF53C] rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(203,245,60,0.6)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-white/70 pt-0.5">
            <span>Earned: {formatCurrency(currentBalance)}</span>
            <span>
              Goal: $10.00 ({reqPointsFormatted} points)
            </span>
          </div>
        </div>

        {/* REDEEM CTA */}
        {currentBalance >= minThreshold && (
          <button
            onClick={onOpenWallet}
            className="w-full mt-4 bg-[#CBF53C] hover:bg-[#b8e030] text-[#10282A] font-extrabold py-3 px-4 rounded-full text-xs transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer font-['Outfit',sans-serif]"
          >
            <span>Threshold Reached! Redeem Now</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. EXPLORE REWARD ACTIVITIES - UPGRADED 2x2 GRID */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[11px] font-extrabold tracking-wider text-[#5E7270] uppercase">
            Explore Reward Activities
          </h3>
        </div>

        {/* UPGRADED 2x2 GRID CARDS */}
        <div className="grid grid-cols-2 gap-3.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`bg-gradient-to-b ${cat.cardGradient} border ${cat.borderStyle} rounded-[26px] p-4 flex flex-col items-center justify-between text-center group transition-all duration-300 shadow-2xs hover:shadow-lg cursor-pointer min-h-[152px] relative overflow-hidden active:scale-[0.98]`}
            >
              {/* GLOSSY CORNER REFLECTION */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/40 rounded-full blur-xl pointer-events-none" />

              {/* ICON CONTAINER WITH 3D RING */}
              <div className={`w-13 h-13 rounded-2xl border ${cat.ringStyle} flex items-center justify-center my-0.5 group-hover:scale-110 transition-transform duration-300 shadow-2xs relative`}>
                {cat.icon}
              </div>

              {/* TITLE & DESCRIPTION */}
              <div className="space-y-0.5 my-1 relative z-10">
                <span className="text-sm font-black text-[#10282A] leading-tight block text-center font-['Outfit',sans-serif]">
                  {cat.title}
                </span>
                <span className="text-[11px] font-medium text-[#5E7270] leading-tight block text-center">
                  {cat.description}
                </span>
              </div>

              {/* REWARD BADGE CTA PILL */}
              <div className={`mt-1 ${cat.badgeStyle} text-[10px] font-black px-3 py-1 rounded-full transition-colors duration-200 shadow-2xs tracking-wide uppercase`}>
                {cat.badgeText}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. REWARD HISTORY */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[11px] font-extrabold tracking-wider text-[#5E7270] uppercase">
            Reward History
          </h3>
          <button
            onClick={() => {
              if (onOpenTransactionsHistory) onOpenTransactionsHistory();
              else onOpenWallet();
            }}
            className="text-xs font-bold text-[#0E7C74] hover:text-[#0F3B3A] hover:underline flex items-center gap-0.5 transition-colors cursor-pointer"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {transactions.length === 0 ? (
            <div className="bg-white rounded-[22px] p-6 text-center text-[#5E7270] text-xs border border-slate-200/60 shadow-2xs">
              No rewards claimed yet. Complete an offer, article, video, or book activity to get rewards!
            </div>
          ) : (
            transactions.slice(0, 5).map((tx) => {
              const amount = tx.amountUsd ?? tx.rewardAmount ?? 0;
              return (
                <div
                  key={tx.id}
                  className="bg-white border border-slate-200/60 hover:border-slate-300 rounded-[22px] p-3.5 flex items-center justify-between gap-3.5 transition-all shadow-2xs"
                >
                  {/* LEFT: ICON + CATEGORY/TITLE + TIMESTAMP */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {renderCategoryIcon(tx.category)}
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs sm:text-sm font-bold text-[#10282A] leading-tight truncate pr-1">
                        {tx.title || tx.category}
                      </span>
                      <span className="text-[11px] font-medium text-[#5E7270] leading-tight mt-0.5">
                        {tx.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT: REWARD AMOUNT BADGE & STATUS */}
                  <div className="shrink-0 text-right flex flex-col items-end">
                    <span className="text-xs font-black text-[#0B6B3A] bg-[#E3F6DF] px-2.5 py-1 rounded-full whitespace-nowrap shadow-2xs font-['Outfit',sans-serif]">
                      +{formatCurrency(amount)}
                    </span>
                    <span className="text-[10px] font-medium text-[#5E7270] block mt-1">
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
