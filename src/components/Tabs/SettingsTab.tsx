import React, { useState } from 'react';
import { UserProfile, WalletState, Transaction, SettingsSubTab, ScreenName } from '../../types';
import { Pencil, Copy, Check, ChevronRight, Play, FileText, Gift, BookOpen, Wallet, Plus } from 'lucide-react';

interface SettingsTabProps {
  user: UserProfile;
  wallet: WalletState;
  transactions: Transaction[];
  onNavigateScreen: (screen: ScreenName) => void;
  onOpenShareIdea: () => void;
  onOpenAboutUs: () => void;
  onOpenDeleteAccount: () => void;
  onToggle2FA: () => void;
  onTogglePromo: () => void;
  onCopyText: (text: string, msg: string) => void;
  onLogout: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  user,
  wallet,
  transactions,
  onNavigateScreen,
  onOpenShareIdea,
  onOpenAboutUs,
  onOpenDeleteAccount,
  onToggle2FA,
  onTogglePromo,
  onCopyText,
  onLogout,
}) => {
  const [subTab, setSubTab] = useState<SettingsSubTab>('account');
  const [copiedId, setCopiedId] = useState(false);
  const [txFilter, setTxFilter] = useState('All time');

  const copyAccountId = () => {
    onCopyText(user.id, 'Account ID copied to clipboard!');
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const currentBalance = wallet.balanceUsd || 0;
  const minThreshold = wallet.payoutThresholdUsd || 10;
  const progressPercent = Math.min(100, Math.floor((currentBalance / minThreshold) * 100));
  const canWithdraw = currentBalance >= minThreshold;

  return (
    <div className="p-4 space-y-5 pb-28">
      {/* SUB-TAB SEGMENTED CONTROL */}
      <div className="flex items-center p-1 bg-[#EAF0E8] rounded-[20px]">
        <button
          onClick={() => setSubTab('account')}
          className={`flex-1 py-2.5 text-xs font-extrabold rounded-[16px] transition-colors cursor-pointer ${
            subTab === 'account'
              ? 'bg-[#0F3B3A] text-white shadow-xs'
              : 'text-[#10282A]/70 hover:text-[#10282A]'
          }`}
        >
          Account
        </button>
        <button
          onClick={() => setSubTab('payment')}
          className={`flex-1 py-2.5 text-xs font-extrabold rounded-[16px] transition-colors cursor-pointer ${
            subTab === 'payment'
              ? 'bg-[#0F3B3A] text-white shadow-xs'
              : 'text-[#10282A]/70 hover:text-[#10282A]'
          }`}
        >
          Payment
        </button>
      </div>

      {subTab === 'account' ? (
        <>
          {/* PROFILE ROW */}
          <div className="flex items-center gap-4 bg-white rounded-[24px] p-4 border border-[#10282A]/5 shadow-2xs">
            <div className="w-14 h-14 rounded-full bg-[#0F3B3A] text-[#CBF53C] font-black text-xl flex items-center justify-center shrink-0">
              {user.avatarLetter || 'S'}
            </div>

            <div className="flex-1">
              <h2 className="text-base font-extrabold text-[#10282A] leading-tight">
                {user.name}
              </h2>
              <span className="text-xs font-medium text-[#5E7270] block mt-0.5">
                {user.country}
              </span>
            </div>

            <button
              onClick={() => onNavigateScreen('edit_profile')}
              className="w-10 h-10 rounded-full bg-[#F4F6F1] hover:bg-[#EAF0E8] flex items-center justify-center text-[#10282A] transition-colors cursor-pointer"
              aria-label="Edit Profile"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>

          {/* ACHIEVEMENTS PREVIEW */}
          <div className="bg-white rounded-[24px] p-4 border border-[#10282A]/5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#10282A]">Achievements</span>
              <button
                onClick={() => onNavigateScreen('achievements')}
                className="text-xs font-extrabold text-[#0E7C74] hover:underline cursor-pointer"
              >
                See all
              </button>
            </div>
            <span className="text-xs font-semibold text-[#5E7270] block">1 / 20 unlocked</span>

            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {/* Video Rookie */}
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-[16px] bg-[#EAF0E8] text-[#5E7270] flex items-center justify-center mb-1">
                  <Play className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold text-[#10282A] leading-tight">Video Rookie</span>
              </div>

              {/* Page Turner */}
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-[16px] bg-[#EAF0E8] text-[#5E7270] flex items-center justify-center mb-1">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold text-[#10282A] leading-tight">Page Turner</span>
              </div>

              {/* Task Master */}
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-[16px] bg-[#EAF0E8] text-[#5E7270] flex items-center justify-center mb-1">
                  <Gift className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold text-[#10282A] leading-tight">Task Master</span>
              </div>

              {/* Bookworm (UNLOCKED) */}
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-[16px] bg-[#CBF53C] text-[#10282A] flex items-center justify-center mb-1 shadow-2xs">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold text-[#10282A] leading-tight">Bookworm</span>
              </div>

              {/* First Cashout */}
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-[16px] bg-[#EAF0E8] text-[#5E7270] flex items-center justify-center mb-1">
                  <Wallet className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold text-[#10282A] leading-tight">First Cashout</span>
              </div>
            </div>
          </div>

          {/* ACCOUNT DETAILS CARD */}
          <div className="bg-white rounded-[24px] p-5 border border-[#10282A]/5 space-y-3.5 shadow-2xs">
            {/* Account ID */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#5E7270]">Account ID</span>
              <div className="flex items-center gap-1.5 font-mono text-[#10282A] font-extrabold">
                <span>{user.id}</span>
                <button onClick={copyAccountId} className="text-[#5E7270] hover:text-[#10282A]">
                  {copiedId ? <Check className="w-3.5 h-3.5 text-[#0B6B3A]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Date Joined */}
            <div className="flex items-center justify-between text-xs border-t border-[#10282A]/5 pt-3">
              <span className="font-semibold text-[#5E7270]">Date joined</span>
              <span className="font-extrabold text-[#10282A]">{user.dateJoined}</span>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between text-xs border-t border-[#10282A]/5 pt-3">
              <span className="font-semibold text-[#5E7270]">Language</span>
              <span className="font-extrabold text-[#10282A]">{user.language}</span>
            </div>

            {/* Currency */}
            <div className="flex items-center justify-between text-xs border-t border-[#10282A]/5 pt-3">
              <span className="font-semibold text-[#5E7270]">Currency</span>
              <span className="font-extrabold text-[#10282A]">{user.currency}</span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between text-xs border-t border-[#10282A]/5 pt-3">
              <span className="font-semibold text-[#5E7270]">Email</span>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#10282A]">{user.email}</span>
                <button
                  onClick={() => onNavigateScreen('edit_profile')}
                  className="text-xs font-extrabold text-[#0E7C74] border border-[#0E7C74] rounded-full px-3 py-0.5 hover:bg-[#0E7C74]/5 transition-colors cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Password */}
            <div className="flex items-center justify-between text-xs border-t border-[#10282A]/5 pt-3">
              <span className="font-semibold text-[#5E7270]">Password</span>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#10282A]">••••••••</span>
                <button
                  onClick={() => onNavigateScreen('edit_profile')}
                  className="text-xs font-extrabold text-[#0E7C74] border border-[#0E7C74] rounded-full px-3 py-0.5 hover:bg-[#0E7C74]/5 transition-colors cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>

            {/* 2FA */}
            <div className="flex items-center justify-between text-xs border-t border-[#10282A]/5 pt-3">
              <span className="font-semibold text-[#5E7270]">2FA</span>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#10282A]">
                  {user.twoFactorEnabled ? 'On' : 'Off'}
                </span>
                <button
                  onClick={onToggle2FA}
                  className="text-xs font-extrabold text-[#0E7C74] border border-[#0E7C74] rounded-full px-3 py-0.5 hover:bg-[#0E7C74]/5 transition-colors cursor-pointer"
                >
                  {user.twoFactorEnabled ? 'Turn off' : 'Turn on'}
                </button>
              </div>
            </div>
          </div>

          {/* PREFERENCES */}
          <div className="bg-white rounded-[24px] p-4 border border-[#10282A]/5 flex items-center justify-between shadow-2xs">
            <span className="text-xs font-extrabold text-[#10282A]">Receive promo emails</span>
            <button
              onClick={onTogglePromo}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                user.promoEmailsEnabled ? 'bg-[#0E7C74]' : 'bg-[#DDE3DC]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  user.promoEmailsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* MORE OPTIONS */}
          <div className="space-y-2">
            <button
              onClick={onOpenShareIdea}
              className="w-full bg-white hover:bg-slate-50 border border-[#10282A]/5 rounded-[22px] p-4 flex items-center justify-between text-xs font-extrabold text-[#10282A] transition-colors shadow-2xs cursor-pointer min-h-[50px]"
            >
              <span>Share your idea</span>
              <ChevronRight className="w-5 h-5 text-[#5E7270]" />
            </button>

            <button
              onClick={onOpenAboutUs}
              className="w-full bg-white hover:bg-slate-50 border border-[#10282A]/5 rounded-[22px] p-4 flex items-center justify-between text-xs font-extrabold text-[#10282A] transition-colors shadow-2xs cursor-pointer min-h-[50px]"
            >
              <span>About Us</span>
              <ChevronRight className="w-5 h-5 text-[#5E7270]" />
            </button>

            <button
              onClick={() => onNavigateScreen('support_help')}
              className="w-full bg-white hover:bg-slate-50 border border-[#10282A]/5 rounded-[22px] p-4 flex items-center justify-between text-xs font-extrabold text-[#10282A] transition-colors shadow-2xs cursor-pointer min-h-[50px]"
            >
              <span>Support & help</span>
              <ChevronRight className="w-5 h-5 text-[#5E7270]" />
            </button>
          </div>

          {/* LOGOUT & DELETE ACCOUNT */}
          <div className="pt-2 text-center space-y-3">
            <button
              onClick={onLogout}
              className="px-8 py-2.5 bg-white border border-[#10282A]/10 rounded-full text-xs font-extrabold text-[#10282A] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Logout
            </button>

            <button
              onClick={onOpenDeleteAccount}
              className="block w-full text-xs font-extrabold text-[#B3261E] hover:underline cursor-pointer"
            >
              Delete account
            </button>
          </div>
        </>
      ) : (
        /* PAYMENT SUB-TAB */
        <div className="space-y-5">
          {/* EARNED AMOUNT CARD */}
          <div className="bg-[#0F3B3A] text-white rounded-[28px] p-6 shadow-md space-y-4">
            <span className="text-[11px] font-extrabold tracking-wider text-[#BFE9E3] uppercase block">
              Earned Amount
            </span>

            <div className="text-4xl font-black text-white">
              ${currentBalance.toFixed(3)}
            </div>

            <p className="text-xs text-[#BFE9E3] font-medium leading-relaxed">
              You have reached {progressPercent}% of the ${minThreshold} payment threshold
            </p>

            <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#CBF53C] rounded-full transition-all duration-300"
                style={{ width: `${Math.max(2, progressPercent)}%` }}
              />
            </div>

            <button
              onClick={() => canWithdraw && onNavigateScreen('withdraw')}
              disabled={!canWithdraw}
              className={`w-full py-3.5 rounded-full text-xs font-extrabold transition-all min-h-[48px] ${
                canWithdraw
                  ? 'bg-[#CBF53C] text-[#10282A] hover:bg-[#bce62b] shadow-sm cursor-pointer'
                  : 'bg-[#DDE3DC] text-[#5E7270] cursor-not-allowed'
              }`}
            >
              Withdraw
            </button>
          </div>

          {/* PAYOUT METHOD CARD */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-[#10282A] block px-1">
              Payout method
            </span>

            <button
              onClick={() => onNavigateScreen('add_payout_method')}
              className="w-full bg-white hover:bg-slate-50 border border-[#10282A]/5 rounded-[22px] p-4 flex items-center justify-between text-xs font-extrabold text-[#10282A] transition-colors shadow-2xs cursor-pointer min-h-[52px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[14px] bg-[#BFE9E3] text-[#0F3B3A] flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <span>Add method</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#5E7270]" />
            </button>
          </div>

          {/* TRANSACTION HISTORY */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-extrabold text-[#10282A]">Transaction history</span>

              <select
                value={txFilter}
                onChange={(e) => setTxFilter(e.target.value)}
                className="text-xs font-extrabold text-[#0E7C74] bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option value="All time">All time</option>
                <option value="Withdrawals">Withdrawals</option>
                <option value="Rewards">Rewards</option>
              </select>
            </div>

            <div className="bg-white rounded-[24px] p-6 border border-[#10282A]/5 text-center space-y-3 shadow-2xs">
              {transactions.length === 0 ? (
                <p className="text-xs text-[#5E7270] font-medium">No transactions to show</p>
              ) : (
                <div className="space-y-2 text-left">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between text-xs p-3 rounded-[16px] bg-[#F4F6F1]"
                    >
                      <div>
                        <span className="font-extrabold text-[#10282A] block">{tx.title}</span>
                        <span className="text-[10px] font-medium text-[#5E7270]">{tx.timestamp}</span>
                      </div>
                      <span
                        className={`font-extrabold ${
                          tx.amountUsd >= 0 ? 'text-[#0B6B3A]' : 'text-[#10282A]'
                        }`}
                      >
                        {tx.amountUsd >= 0
                          ? `+$${tx.amountUsd.toFixed(3)}`
                          : `-$${Math.abs(tx.amountUsd).toFixed(2)}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => onNavigateScreen('withdraw')}
                className="text-xs font-extrabold text-[#0E7C74] hover:underline block mx-auto pt-1 cursor-pointer"
              >
                Show more
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
