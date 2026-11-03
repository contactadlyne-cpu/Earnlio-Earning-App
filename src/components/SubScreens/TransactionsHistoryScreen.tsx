import React, { useState } from 'react';
import { Transaction } from '../../types';
import { SubPageHeader } from '../SubPageHeader';
import { formatCurrency } from '../../api';
import {
  Play,
  BookOpen,
  Newspaper,
  Gift,
  ArrowDownLeft,
  ArrowUpRight,
  Flame,
  Users,
  Search,
  Filter,
} from 'lucide-react';

interface TransactionsHistoryScreenProps {
  transactions: Transaction[];
  onBack: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
}

export const TransactionsHistoryScreen: React.FC<TransactionsHistoryScreenProps> = ({
  transactions,
  onBack,
  onOpenNotifications,
  unreadNotificationsCount = 0,
}) => {
  const [filter, setFilter] = useState<'all' | 'rewards' | 'withdrawals'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Icon Resolver
  const renderCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'videos':
        return (
          <div className="w-10 h-10 rounded-xl bg-[#BFE9E3] flex items-center justify-center shrink-0">
            <Play className="w-5 h-5 text-[#0F3B3A] fill-[#0F3B3A]/20" />
          </div>
        );
      case 'ebooks':
      case 'books':
        return (
          <div className="w-10 h-10 rounded-xl bg-[#E2DAFF] flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-[#10282A]" />
          </div>
        );
      case 'articles':
        return (
          <div className="w-10 h-10 rounded-xl bg-[#FFD9B8] flex items-center justify-center shrink-0">
            <Newspaper className="w-5 h-5 text-[#10282A]" />
          </div>
        );
      case 'offers':
        return (
          <div className="w-10 h-10 rounded-xl bg-[#CBF53C] flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5 text-[#10282A]" />
          </div>
        );
      case 'streak':
        return (
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-orange-600 fill-orange-500/20" />
          </div>
        );
      case 'referral':
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-emerald-700" />
          </div>
        );
      case 'withdrawal':
      case 'withdraw':
      case 'redemption':
      case 'redeem':
        return (
          <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-5 h-5 text-[#10282A]" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-[#CBF53C] flex items-center justify-center shrink-0">
            <ArrowDownLeft className="w-5 h-5 text-[#10282A]" />
          </div>
        );
    }
  };

  // Filter transactions
  const filteredTxs = transactions.filter((tx) => {
    const amount = tx.amountUsd ?? tx.rewardAmount ?? 0;
    if (filter === 'rewards' && amount < 0) return false;
    if (filter === 'withdrawals' && amount >= 0) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = (tx.title || '').toLowerCase().includes(q);
      const categoryMatch = (tx.category || '').toLowerCase().includes(q);
      return titleMatch || categoryMatch;
    }
    return true;
  });

  // Calculate totals
  const totalEarnedUsd = transactions
    .filter((tx) => (tx.amountUsd ?? 0) > 0)
    .reduce((acc, tx) => acc + (tx.amountUsd ?? 0), 0);

  const totalWithdrawnUsd = Math.abs(
    transactions
      .filter((tx) => (tx.amountUsd ?? 0) < 0)
      .reduce((acc, tx) => acc + (tx.amountUsd ?? 0), 0)
  );

  return (
    <div className="bg-[#F4F6F1] min-h-screen pb-28">
      <SubPageHeader
        title="Transaction History"
        onBack={onBack}
        onOpenNotifications={onOpenNotifications}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      <div className="p-4 space-y-4 max-w-lg mx-auto w-full">
        {/* SUMMARY STATS CARD */}
        <div className="bg-gradient-to-br from-[#0F3B3A] to-[#0A2E2D] text-white rounded-[26px] p-4 shadow-sm border border-white/10 flex items-center justify-around text-center">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/70 block mb-0.5">
              Total Earned
            </span>
            <span className="text-lg font-black text-[#CBF53C] font-['Outfit',sans-serif]">
              +{formatCurrency(totalEarnedUsd)}
            </span>
          </div>
          <div className="w-px h-8 bg-white/15" />
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/70 block mb-0.5">
              Total Redeemed
            </span>
            <span className="text-lg font-black text-white font-['Outfit',sans-serif]">
              {formatCurrency(totalWithdrawnUsd)}
            </span>
          </div>
          <div className="w-px h-8 bg-white/15" />
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/70 block mb-0.5">
              Total Records
            </span>
            <span className="text-lg font-black text-[#BFE9E3] font-['Outfit',sans-serif]">
              {transactions.length}
            </span>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="space-y-3">
          {/* SEARCH INPUT */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#5E7270] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by category or activity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200/80 rounded-full pl-9 pr-4 py-2.5 text-xs text-[#10282A] font-medium placeholder-[#5E7270] focus:outline-none focus:ring-2 focus:ring-[#0E7C74]/40 shadow-2xs"
            />
          </div>

          {/* FILTER PILLS */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 touch-pan-x">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#0F3B3A] text-white shadow-xs'
                  : 'bg-white text-[#5E7270] border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              All ({transactions.length})
            </button>
            <button
              onClick={() => setFilter('rewards')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filter === 'rewards'
                  ? 'bg-[#0F3B3A] text-white shadow-xs'
                  : 'bg-white text-[#5E7270] border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              Rewards
            </button>
            <button
              onClick={() => setFilter('withdrawals')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filter === 'withdrawals'
                  ? 'bg-[#0F3B3A] text-white shadow-xs'
                  : 'bg-white text-[#5E7270] border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              Redemptions
            </button>
          </div>
        </div>

        {/* TRANSACTIONS LIST */}
        <div className="space-y-2.5 pt-1">
          {filteredTxs.length === 0 ? (
            <div className="bg-white rounded-[24px] p-8 text-center space-y-2 border border-slate-200/60 shadow-2xs">
              <Filter className="w-8 h-8 text-[#5E7270]/50 mx-auto" />
              <p className="text-xs font-bold text-[#10282A]">No transactions found</p>
              <p className="text-[11px] text-[#5E7270]">
                {searchQuery ? 'Try matching another search term.' : 'Complete an activity to see your rewards here!'}
              </p>
            </div>
          ) : (
            filteredTxs.map((tx) => {
              const amount = tx.amountUsd ?? tx.rewardAmount ?? 0;
              const isPositive = amount >= 0;

              return (
                <div
                  key={tx.id}
                  className="bg-white border border-slate-200/60 hover:border-slate-300 rounded-[22px] p-3.5 flex items-center justify-between gap-3 transition-all shadow-2xs"
                >
                  {/* LEFT: ICON + TITLE + TIMESTAMP */}
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

                  {/* RIGHT: AMOUNT + STATUS */}
                  <div className="shrink-0 text-right flex flex-col items-end">
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-full whitespace-nowrap shadow-2xs font-['Outfit',sans-serif] ${
                        isPositive
                          ? 'text-[#0B6B3A] bg-[#E3F6DF]'
                          : 'text-[#10282A] bg-slate-200'
                      }`}
                    >
                      {isPositive ? `+${formatCurrency(amount)}` : `-${formatCurrency(Math.abs(amount))}`}
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
