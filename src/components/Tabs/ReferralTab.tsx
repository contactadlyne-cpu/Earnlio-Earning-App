import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Info, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface ReferralTabProps {
  user: UserProfile;
  onCopyText: (text: string, toastMessage: string) => void;
  onClaimFriendCode: (code: string) => void;
}

export const ReferralTab: React.FC<ReferralTabProps> = ({
  user,
  onCopyText,
  onClaimFriendCode,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [friendCodeOpen, setFriendCodeOpen] = useState(false);
  const [friendCodeInput, setFriendCodeInput] = useState('');
  const [graphicTab, setGraphicTab] = useState<'site' | 'social'>('site');

  const referralLink = user.referralLink || 'https://earnlio.com/?r=shoaib';
  const referralCode = user.referralCode || 'shoaib10';

  const handleCopyLink = () => {
    onCopyText(referralLink, 'Referral link copied to clipboard!');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    onCopyText(referralCode, 'Referral code copied to clipboard!');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleClaimCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendCodeInput.trim()) return;
    onClaimFriendCode(friendCodeInput.trim());
    setFriendCodeInput('');
  };

  return (
    <div className="p-4 space-y-5 pb-28">
      {/* REFER AND EARN $10 CARD */}
      <div className="bg-white rounded-[28px] p-6 shadow-xs border border-[#10282A]/5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#10282A] tracking-tight">
            Refer and earn $10
          </h2>
          <div className="w-8 h-8 rounded-full bg-[#10282A]/5 flex items-center justify-center text-[#10282A]/60">
            <Info className="w-5 h-5" />
          </div>
        </div>

        <p className="text-xs text-[#5E7270] font-medium leading-relaxed">
          Send the link to a friend. If they create an account and make their first withdrawal, you both get $10.
        </p>

        {/* LINK FIELD */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 bg-[#F4F6F1] border border-[#10282A]/10 rounded-[16px] px-4 py-3 text-xs text-[#10282A] font-semibold focus:outline-none select-all"
          />
          <button
            onClick={handleCopyLink}
            className="w-11 h-11 bg-[#F4F6F1] hover:bg-[#EAF0E8] rounded-[16px] border border-[#10282A]/10 flex items-center justify-center text-[#10282A] shrink-0 transition-colors cursor-pointer"
            title="Copy link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-[#0B6B3A]" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* CODE FIELD */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={`Your code: ${referralCode}`}
            className="flex-1 bg-[#F4F6F1] border border-[#10282A]/10 rounded-[16px] px-4 py-3 text-xs text-[#10282A] font-semibold focus:outline-none select-all"
          />
          <button
            onClick={handleCopyCode}
            className="w-11 h-11 bg-[#F4F6F1] hover:bg-[#EAF0E8] rounded-[16px] border border-[#10282A]/10 flex items-center justify-center text-[#10282A] shrink-0 transition-colors cursor-pointer"
            title="Copy code"
          >
            {copiedCode ? <Check className="w-4 h-4 text-[#0B6B3A]" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* LIME SHARE LINK BUTTON */}
        <button
          onClick={handleCopyLink}
          className="w-full bg-[#CBF53C] hover:bg-[#bce62b] text-[#10282A] font-extrabold py-3.5 px-6 rounded-full text-xs shadow-sm transition-all active:scale-[0.98] cursor-pointer min-h-[48px]"
        >
          Share link
        </button>

        {/* SOCIAL SHARE CHIPS */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {['Facebook', 'WhatsApp', 'X', 'Reddit'].map((social) => (
            <button
              key={social}
              onClick={handleCopyLink}
              className="px-4 py-2 bg-[#F4F6F1] hover:bg-[#EAF0E8] rounded-full text-xs font-bold text-[#10282A] transition-colors cursor-pointer"
            >
              {social}
            </button>
          ))}
        </div>
      </div>

      {/* FRIEND CODE EXPANDABLE */}
      <div className="bg-white rounded-[22px] border border-[#10282A]/5 overflow-hidden shadow-2xs">
        <button
          onClick={() => setFriendCodeOpen(!friendCodeOpen)}
          className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-[#10282A] hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>🎫</span>
            <span>I have a friend's code</span>
          </span>
          <div className="flex items-center gap-1 text-[#5E7270] font-semibold">
            <span>Optional</span>
            {friendCodeOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {friendCodeOpen && (
          <form onSubmit={handleClaimCode} className="p-4 pt-0 space-y-3 border-t border-[#10282A]/5">
            {user.friendCodeApplied ? (
              <div className="bg-[#E3F6DF] text-[#0B6B3A] p-3 rounded-[16px] text-xs font-extrabold">
                Referral code claimed: {user.friendCodeApplied} (+$0.50 bonus)
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={friendCodeInput}
                  onChange={(e) => setFriendCodeInput(e.target.value)}
                  className="flex-1 bg-[#F4F6F1] border border-[#10282A]/10 rounded-[16px] px-3.5 py-2.5 text-xs text-[#10282A] font-semibold focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!friendCodeInput.trim()}
                  className="bg-[#0F3B3A] text-white font-extrabold px-4 py-2.5 rounded-full text-xs hover:bg-[#0F3B3A]/90 disabled:opacity-50 cursor-pointer"
                >
                  Apply
                </button>
              </div>
            )}
          </form>
        )}
      </div>

      {/* SHARE A GRAPHIC SECTION */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-[#10282A] tracking-tight">
          Share a graphic
        </h3>

        {/* SEGMENTED CONTROL */}
        <div className="flex items-center p-1 bg-[#EAF0E8] rounded-[18px]">
          <button
            onClick={() => setGraphicTab('site')}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-[14px] transition-colors cursor-pointer ${
              graphicTab === 'site'
                ? 'bg-[#0F3B3A] text-white shadow-xs'
                : 'text-[#10282A]/70 hover:text-[#10282A]'
            }`}
          >
            For your site
          </button>
          <button
            onClick={() => setGraphicTab('social')}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-[14px] transition-colors cursor-pointer ${
              graphicTab === 'social'
                ? 'bg-[#0F3B3A] text-white shadow-xs'
                : 'text-[#10282A]/70 hover:text-[#10282A]'
            }`}
          >
            Instagram & Facebook
          </button>
        </div>

        {/* GRAPHIC PREVIEW */}
        <div className="bg-white rounded-[28px] p-6 border border-[#10282A]/5 text-center space-y-4">
          <p className="text-xs text-[#5E7270] font-medium leading-relaxed">
            {graphicTab === 'site'
              ? 'Put this image on a page or forum. It uses your link.'
              : 'Share this poster on your Instagram stories or Facebook feed.'}
          </p>

          <div className="bg-[#0F3B3A] text-white rounded-[22px] p-6 space-y-3 shadow-md">
            <div className="inline-block bg-[#CBF53C] text-[#10282A] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              Earnlio Official
            </div>
            <div className="text-xl font-black tracking-tight leading-tight">
              Earn $10.00 Payouts Everyday
            </div>
            <p className="text-xs text-[#BFE9E3] font-medium">
              Watch videos, read books & articles to claim instant balance!
            </p>
            <div className="bg-white/10 rounded-[14px] p-2 text-xs font-mono text-white">
              Code: <span className="text-[#CBF53C] font-extrabold">{referralCode}</span>
            </div>
          </div>

          <button
            onClick={handleCopyLink}
            className="text-xs font-extrabold text-[#0E7C74] hover:underline block mx-auto cursor-pointer"
          >
            Copy graphic link
          </button>
        </div>
      </div>
    </div>
  );
};
