import React, { useState } from 'react';
import { UserState, AppConfig, Transaction } from '../types';
import { formatCurrency } from '../api';
import {
  Copy,
  Pencil,
  ChevronRight,
  Play,
  BookOpen,
  Wallet,
  Check,
  ChevronDown,
  Gift,
  Newspaper,
  Download,
} from 'lucide-react';

interface SettingsViewProps {
  user: UserState;
  config: AppConfig;
  transactions: Transaction[];
  onUpdateUserSettings: (settings: Partial<UserState>) => void;
  onOpenSuggestionModal: () => void;
  onOpenAboutUsModal: () => void;
  onOpenSupportScreen: () => void;
  onOpenWallet: () => void;
  onOpenAchievements?: () => void;
  onOpenEditProfile?: () => void;
  onOpenSmtpConfig?: () => void;
  onLogout: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  config,
  transactions,
  onUpdateUserSettings,
  onOpenSuggestionModal,
  onOpenAboutUsModal,
  onOpenSupportScreen,
  onOpenWallet,
  onOpenAchievements,
  onOpenEditProfile,
  onOpenSmtpConfig,
  onLogout,
}) => {
  const [subTab, setSubTab] = useState<'account' | 'payment'>('account');
  const [copiedId, setCopiedId] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(user.email);
  const [historyFilter, setHistoryFilter] = useState('All time');

  const copyAccountId = () => {
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSaveEmail = () => {
    onUpdateUserSettings({ email: emailInput });
    setIsEditingEmail(false);
  };

  const handleToggle2FA = () => {
    onUpdateUserSettings({ twoFactorEnabled: !user.twoFactorEnabled });
  };

  const currentBalance = user.balanceUsd || 0;
  const minThreshold = config.minWithdrawalUsd || 10;
  const progressPercent = Math.min(100, Math.floor((currentBalance / minThreshold) * 100));

  return (
    <div className="px-4 pt-1.5 pb-28 space-y-5">
      {/* SUB-TABS: Account / Payment */}
      <div className="flex items-center gap-2 p-1 bg-[#F4F6F1] rounded-full border border-slate-200/80">
        <button
          onClick={() => setSubTab('account')}
          className={`flex-1 py-2 text-xs font-extrabold rounded-full transition-all cursor-pointer ${
            subTab === 'account'
              ? 'bg-[#0F3B3A] text-white shadow-xs'
              : 'text-[#5E7270] hover:text-[#10282A]'
          }`}
        >
          Account
        </button>
        <button
          onClick={() => setSubTab('payment')}
          className={`flex-1 py-2 text-xs font-extrabold rounded-full transition-all cursor-pointer ${
            subTab === 'payment'
              ? 'bg-[#0F3B3A] text-white shadow-xs'
              : 'text-[#5E7270] hover:text-[#10282A]'
          }`}
        >
          Payment
        </button>
      </div>

      {subTab === 'account' ? (
        <>
          {/* USER PROFILE HEADER */}
          <div className="flex items-center gap-4 py-1">
            <div className="relative">
              <div
                onClick={onOpenEditProfile}
                className="w-16 h-16 rounded-full bg-[#CBF53C] text-[#10282A] font-black text-2xl flex items-center justify-center shadow-xs border-2 border-white cursor-pointer overflow-hidden"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.avatarLetter || user.name.charAt(0).toUpperCase()
                )}
              </div>
              <button
                onClick={onOpenEditProfile}
                className="absolute bottom-0 right-0 p-1 bg-[#0F3B3A] text-white rounded-full border-2 border-white shadow-xs cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </div>

            <div className="flex-1 cursor-pointer" onClick={onOpenEditProfile}>
              <h3 className="text-lg font-bold text-[#10282A]">{user.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-[#5E7270] font-medium mt-0.5">
                <span>{user.country}</span>
              </div>
            </div>

            <button
              onClick={onOpenEditProfile}
              className="p-2 text-[#0E7C74] hover:bg-[#BFE9E3]/30 rounded-full transition-colors cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>

          {/* ACHIEVEMENTS PREVIEW SECTION */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold tracking-wider text-[#5E7270] uppercase">
                Achievements
              </span>
              <button
                onClick={onOpenAchievements}
                className="text-xs font-bold text-[#0E7C74] hover:underline cursor-pointer"
              >
                See all
              </button>
            </div>
            <span className="text-xs font-bold text-[#10282A] block">
              {user.unlockedCount ?? 1} / {user.totalAchievements ?? 20} unlocked
            </span>

            {/* ACHIEVEMENTS HORIZONTAL ROW */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pt-1 pb-1">
              {/* Video Rookie */}
              <div className="flex flex-col items-center text-center min-w-[62px]">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF0E8] border border-slate-200/80 flex items-center justify-center mb-1 shadow-2xs">
                  <Play className="w-5 h-5 text-[#5E7270] fill-[#5E7270]/20" />
                </div>
                <span className="text-[10px] font-bold text-[#5E7270] leading-tight">
                  Video Rookie
                </span>
              </div>

              {/* Page Turner */}
              <div className="flex flex-col items-center text-center min-w-[62px]">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF0E8] border border-slate-200/80 flex items-center justify-center mb-1 shadow-2xs">
                  <Newspaper className="w-5 h-5 text-[#5E7270]" />
                </div>
                <span className="text-[10px] font-bold text-[#5E7270] leading-tight">
                  Page Turner
                </span>
              </div>

              {/* Task Master */}
              <div className="flex flex-col items-center text-center min-w-[62px]">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF0E8] border border-slate-200/80 flex items-center justify-center mb-1 shadow-2xs">
                  <Gift className="w-5 h-5 text-[#5E7270]" />
                </div>
                <span className="text-[10px] font-bold text-[#5E7270] leading-tight">
                  Task Master
                </span>
              </div>

              {/* Bookworm - Unlocked */}
              <div className="flex flex-col items-center text-center min-w-[62px]">
                <div className="w-12 h-12 rounded-2xl bg-[#CBF53C] border border-[#b8e030] flex items-center justify-center mb-1 shadow-2xs">
                  <BookOpen className="w-5 h-5 text-[#10282A]" />
                </div>
                <span className="text-[10px] font-extrabold text-[#10282A] leading-tight">
                  Bookworm
                </span>
              </div>

              {/* First Cashout */}
              <div className="flex flex-col items-center text-center min-w-[62px]">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF0E8] border border-slate-200/80 flex items-center justify-center mb-1 shadow-2xs">
                  <Wallet className="w-5 h-5 text-[#5E7270]" />
                </div>
                <span className="text-[10px] font-bold text-[#5E7270] leading-tight">
                  First Cashout
                </span>
              </div>
            </div>
          </div>

          {/* ACCOUNT DETAILS LIST */}
          <div className="space-y-3 pt-2">
            <span className="text-[11px] font-extrabold tracking-wider text-[#5E7270] uppercase block px-1">
              Account
            </span>

            <div className="bg-white rounded-[24px] p-4 space-y-3.5 border border-slate-200/60 shadow-2xs">
              {/* Account ID */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#5E7270]">Account ID</span>
                <div className="flex items-center gap-1.5 font-mono text-[#10282A] font-bold">
                  <span>{user.id}</span>
                  <button onClick={copyAccountId} className="text-[#5E7270] hover:text-[#10282A] cursor-pointer">
                    {copiedId ? <Check className="w-3.5 h-3.5 text-[#0B6B3A]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Date Joined */}
              <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-3">
                <span className="font-semibold text-[#5E7270]">Date joined</span>
                <span className="font-bold text-[#10282A]">{user.dateJoined}</span>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-3">
                <span className="font-semibold text-[#5E7270]">Language</span>
                <div className="flex items-center gap-1 font-bold text-[#10282A]">
                  <span>{user.language}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#5E7270]" />
                </div>
              </div>

              {/* Currency */}
              <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-3">
                <span className="font-semibold text-[#5E7270]">Currency</span>
                <span className="font-bold text-[#10282A]">{user.currency}</span>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-3">
                <span className="font-semibold text-[#5E7270]">Email</span>
                {isEditingEmail ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="bg-[#F4F6F1] border border-slate-300 rounded-lg px-2 py-1 text-xs focus:outline-none"
                    />
                    <button
                      onClick={handleSaveEmail}
                      className="text-xs font-bold text-[#0E7C74] hover:underline cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#10282A] truncate max-w-[140px]">{user.email}</span>
                    <button
                      onClick={() => setIsEditingEmail(true)}
                      className="text-xs font-bold text-[#0E7C74] border border-[#0E7C74] rounded-full px-3 py-0.5 hover:bg-[#BFE9E3]/30 transition-colors cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-3">
                <span className="font-semibold text-[#5E7270]">Password</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#10282A]">********</span>
                  <button className="text-xs font-bold text-[#0E7C74] border border-[#0E7C74] rounded-full px-3 py-0.5 hover:bg-[#BFE9E3]/30 transition-colors cursor-pointer">
                    Change
                  </button>
                </div>
              </div>

              {/* 2FA */}
              <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-3">
                <span className="font-semibold text-[#5E7270]">2FA</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#10282A]">
                    {user.twoFactorEnabled ? 'On' : 'Off'}
                  </span>
                  <button
                    onClick={handleToggle2FA}
                    className="text-xs font-bold text-[#0E7C74] border border-[#0E7C74] rounded-full px-3 py-0.5 hover:bg-[#BFE9E3]/30 transition-colors cursor-pointer"
                  >
                    {user.twoFactorEnabled ? 'Turn off' : 'Turn on'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* LOWER LINKS & MODAL TRIGGERS */}
          <div className="space-y-2.5 pt-2">
            {/* Share your idea */}
            <button
              onClick={onOpenSuggestionModal}
              className="w-full bg-white hover:bg-slate-50 border border-slate-200/60 rounded-[22px] p-4 flex items-center justify-between text-xs font-bold text-[#10282A] transition-colors shadow-2xs cursor-pointer"
            >
              <span>Share your idea</span>
              <ChevronRight className="w-4 h-4 text-[#5E7270]" />
            </button>

            {/* About Us */}
            <button
              onClick={onOpenAboutUsModal}
              className="w-full bg-white hover:bg-slate-50 border border-slate-200/60 rounded-[22px] p-4 flex items-center justify-between text-xs font-bold text-[#10282A] transition-colors shadow-2xs cursor-pointer"
            >
              <span>About Us</span>
              <ChevronRight className="w-4 h-4 text-[#5E7270]" />
            </button>

            {/* Support & help */}
            <button
              onClick={onOpenSupportScreen}
              className="w-full bg-white hover:bg-slate-50 border border-slate-200/60 rounded-[22px] p-4 flex items-center justify-between text-xs font-bold text-[#10282A] transition-colors shadow-2xs cursor-pointer"
            >
              <span>Support & help</span>
              <ChevronRight className="w-4 h-4 text-[#5E7270]" />
            </button>
          </div>

          {/* LOGOUT & DELETE ACCOUNT */}
          <div className="pt-4 text-center space-y-3">
            <button
              onClick={onLogout}
              className="px-8 py-2.5 border border-slate-300 rounded-full text-xs font-bold text-[#10282A] hover:bg-white transition-colors cursor-pointer"
            >
              Logout
            </button>
            <button
              onClick={onLogout}
              className="block w-full text-[11px] font-bold text-[#B3261E] hover:underline transition-colors cursor-pointer"
            >
              Delete account
            </button>
          </div>
        </>
      ) : (
        /* PAYMENT SUB-TAB */
        <div className="space-y-5">
          {/* PAYMENT BLOCK */}
          <div className="bg-[#0F3B3A] text-white rounded-[24px] p-5 space-y-3 shadow-xs">
            <span className="text-[11px] font-extrabold tracking-wider text-white/70 uppercase block">
              Redemption Status
            </span>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white/80">Reward Balance:</span>
              <span className="text-xl font-extrabold text-[#CBF53C]">{formatCurrency(currentBalance)}</span>
            </div>

            <p className="text-[11px] text-white/70 font-medium">
              You've reached {progressPercent}% of redemption threshold ({formatCurrency(minThreshold)})
            </p>

            <div className="relative w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#CBF53C] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <button
              onClick={onOpenWallet}
              disabled={currentBalance < minThreshold}
              className={`w-full py-3 rounded-full text-xs font-extrabold transition-all shadow-xs cursor-pointer ${
                currentBalance >= minThreshold
                  ? 'bg-[#CBF53C] text-[#10282A] hover:bg-[#b8e030] active:scale-98'
                  : 'bg-[#DDE3DC] text-[#5E7270] cursor-not-allowed'
              }`}
            >
              Redeem
            </button>
          </div>

          {/* PAYOUT METHOD BLOCK */}
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold tracking-wider text-[#5E7270] uppercase block px-1">
              Redemption Method
            </span>

            <button
              onClick={onOpenWallet}
              className="w-full bg-white hover:bg-slate-50 border border-slate-200/60 rounded-[22px] p-4 flex items-center justify-between text-xs font-bold text-[#10282A] transition-colors shadow-2xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#0E7C74]" />
                <span>Add Redemption Method</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5E7270]" />
            </button>
          </div>

          {/* TRANSACTION HISTORY BLOCK */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-extrabold tracking-wider text-[#5E7270] uppercase">
                Transaction History
              </span>

              <select
                value={historyFilter}
                onChange={(e) => setHistoryFilter(e.target.value)}
                className="text-xs font-bold text-[#10282A] bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option value="All time">All time</option>
                <option value="Redemptions">Redemptions</option>
                <option value="Rewards">Rewards</option>
              </select>
            </div>

            <div className="bg-white rounded-[24px] p-4 border border-slate-200/60 space-y-3 shadow-2xs">
              {transactions.length === 0 ? (
                <p className="text-xs text-[#5E7270] font-medium text-center py-4">No transactions to show</p>
              ) : (
                <div className="space-y-2 text-left">
                  {transactions.slice(0, 5).map((tx) => {
                    const amount = tx.amountUsd ?? tx.rewardAmount ?? 0;
                    return (
                      <div key={tx.id} className="flex items-center justify-between text-xs bg-[#F4F6F1] p-3 rounded-2xl border border-slate-100">
                        <div>
                          <span className="font-bold text-[#10282A] block">{tx.title || tx.category}</span>
                          <span className="text-[10px] text-[#5E7270]">{tx.timestamp}</span>
                        </div>
                        <span className={`font-extrabold px-2.5 py-0.5 rounded-full ${amount >= 0 ? 'bg-[#E3F6DF] text-[#0B6B3A]' : 'bg-slate-200 text-[#10282A]'}`}>
                          {amount >= 0 ? `+${formatCurrency(amount)}` : `-${formatCurrency(Math.abs(amount))}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                onClick={onOpenWallet}
                className="text-xs font-bold text-[#0E7C74] hover:underline block mx-auto pt-1 cursor-pointer"
              >
                Show more
              </button>
            </div>
          </div>

          {/* HOSTINGER BACKEND DEPLOYMENT ZIP BLOCK */}
          <div className="bg-[#0F3B3A] text-white rounded-[26px] p-5 space-y-3.5 shadow-md border border-[#CBF53C]/30 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#CBF53C] text-[#10282A] flex items-center justify-center font-black">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#CBF53C] font-['Outfit',sans-serif]">
                    Hostinger Backend Package
                  </h4>
                  <span className="text-[10px] text-white/70 block">Node.js + Express SMTP Auth</span>
                </div>
              </div>
              <span className="bg-[#CBF53C]/20 text-[#CBF53C] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#CBF53C]/40">
                Ready to Deploy
              </span>
            </div>

            <p className="text-xs text-white/80 leading-relaxed font-medium">
              Deploy this standalone backend ZIP on Hostinger. Configure your Hostinger SMTP credentials in <code className="bg-black/30 px-1.5 py-0.5 rounded text-[#CBF53C]">.env</code> to send real verification email codes for Signup, Login, and Password Resets!
            </p>

            <a
              href="/backend-hostinger.zip"
              download="backend-hostinger.zip"
              className="w-full bg-[#CBF53C] hover:bg-[#b8e030] text-[#10282A] font-extrabold py-3 px-4 rounded-full text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer font-['Outfit',sans-serif]"
            >
              <Download className="w-4 h-4" />
              <span>Download Hostinger Backend ZIP</span>
            </a>

            {onOpenSmtpConfig && (
              <button
                type="button"
                onClick={onOpenSmtpConfig}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-extrabold py-3 px-4 rounded-full text-xs transition-all flex items-center justify-center gap-2 border border-white/20 cursor-pointer font-['Outfit',sans-serif]"
              >
                <span>⚙️ Configure Preview SMTP Email Server</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
