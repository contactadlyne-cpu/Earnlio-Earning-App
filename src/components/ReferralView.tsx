import React, { useState } from 'react';
import { UserState } from '../types';
import { Copy, Share2, Info, ChevronDown, ChevronUp, Check, ExternalLink, Ticket } from 'lucide-react';

interface ReferralViewProps {
  user: UserState;
  onApplyReferralCode: (code: string) => Promise<boolean>;
}

export const ReferralView: React.FC<ReferralViewProps> = ({ user, onApplyReferralCode }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showFriendCode, setShowFriendCode] = useState(false);
  const [friendCodeInput, setFriendCodeInput] = useState('');
  const [applyingCode, setApplyingCode] = useState(false);
  const [codeSuccessMsg, setCodeSuccessMsg] = useState('');
  const [codeErrorMsg, setCodeErrorMsg] = useState('');
  const [graphicTab, setGraphicTab] = useState<'site' | 'social'>('site');

  const referralLink = user.referralLink || `https://earnlio.com/?r=${user.referralCode || 'adxens'}`;
  const referralCode = user.referralCode || 'adxens';

  const copyToClipboard = (text: string, type: 'link' | 'code') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Earnlio and get $10 reward!',
          text: `Use my code ${referralCode} to start receiving rewards on Earnlio!`,
          url: referralLink,
        });
      } catch (e) {
        copyToClipboard(referralLink, 'link');
      }
    } else {
      copyToClipboard(referralLink, 'link');
    }
  };

  const handleClaimFriendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendCodeInput.trim()) return;
    setApplyingCode(true);
    setCodeErrorMsg('');
    setCodeSuccessMsg('');

    const success = await onApplyReferralCode(friendCodeInput.trim());
    setApplyingCode(false);
    if (success) {
      setCodeSuccessMsg('Friend code redeemed! +$0.50 credited to your balance!');
      setFriendCodeInput('');
    } else {
      setCodeErrorMsg('Invalid or already claimed referral code.');
    }
  };

  return (
    <div className="px-4 pt-1.5 pb-28 space-y-5">
      {/* REFER AND EARN $10 CARD */}
      <div className="bg-white rounded-[28px] p-5 border border-slate-200/60 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#10282A] tracking-tight">
            Refer and get $10 reward
          </h2>
          <Info className="w-5 h-5 text-[#5E7270]" />
        </div>

        <p className="text-xs text-[#5E7270] leading-relaxed">
          Send the link to a friend. If they create an account and make their first redemption, you both get $10 reward.
        </p>

        {/* LINK FIELD */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 bg-[#F4F6F1] border border-slate-200 rounded-[16px] px-3.5 py-2.5 text-xs text-[#10282A] font-medium focus:outline-none select-all"
          />
          <button
            onClick={() => copyToClipboard(referralLink, 'link')}
            className="p-2.5 bg-[#F4F6F1] border border-slate-200 rounded-[16px] text-[#10282A] hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
            title="Copy Link"
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
            className="flex-1 bg-[#F4F6F1] border border-slate-200 rounded-[16px] px-3.5 py-2.5 text-xs text-[#10282A] font-medium focus:outline-none select-all"
          />
          <button
            onClick={() => copyToClipboard(referralCode, 'code')}
            className="p-2.5 bg-[#F4F6F1] border border-slate-200 rounded-[16px] text-[#10282A] hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
            title="Copy Code"
          >
            {copiedCode ? <Check className="w-4 h-4 text-[#0B6B3A]" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* SHARE LINK BUTTON */}
        <button
          onClick={handleShare}
          className="w-full bg-[#0F3B3A] hover:bg-[#0c3130] text-white font-extrabold py-3 px-4 rounded-full text-xs flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98 cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-[#CBF53C]" />
          <span>Share link</span>
        </button>

        {/* SOCIAL CHIPS ROW */}
        <div className="flex items-center justify-center gap-2 pt-1">
          {['Facebook', 'WhatsApp', 'X', 'Reddit', 'Telegram', 'Instagram'].map((social) => (
            <button
              key={social}
              onClick={handleShare}
              className="px-2.5 py-1.5 rounded-full bg-[#F4F6F1] text-[#10282A] text-[10px] font-bold hover:bg-[#BFE9E3] transition-colors cursor-pointer"
            >
              {social}
            </button>
          ))}
        </div>
      </div>

      {/* OPTIONAL FRIEND'S CODE ACCORDION */}
      <div className="bg-white rounded-[22px] border border-slate-200/60 overflow-hidden shadow-2xs">
        <button
          onClick={() => setShowFriendCode(!showFriendCode)}
          className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-[#10282A] hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#0E7C74]" />
            <span>I have a friend's code</span>
          </div>
          <div className="flex items-center gap-1 text-[#5E7270] font-normal">
            <span>Optional</span>
            {showFriendCode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showFriendCode && (
          <form onSubmit={handleClaimFriendCode} className="p-4 pt-0 border-t border-slate-100 space-y-3">
            {user.friendCodeApplied ? (
              <div className="bg-[#E3F6DF] text-[#0B6B3A] p-3 rounded-[16px] text-xs font-bold">
                Applied code: {user.friendCodeApplied} (+$0.50 credited)
              </div>
            ) : (
              <>
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Enter referral code"
                    value={friendCodeInput}
                    onChange={(e) => setFriendCodeInput(e.target.value)}
                    className="flex-1 bg-[#F4F6F1] border border-slate-200 rounded-[16px] px-3.5 py-2 text-xs text-[#10282A] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={applyingCode || !friendCodeInput.trim()}
                    className="bg-[#0F3B3A] text-white text-xs font-extrabold px-4 py-2 rounded-full disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {applyingCode ? 'Claiming...' : 'Claim'}
                  </button>
                </div>
                {codeSuccessMsg && (
                  <p className="text-xs text-[#0B6B3A] font-bold">{codeSuccessMsg}</p>
                )}
                {codeErrorMsg && (
                  <p className="text-xs text-[#B3261E] font-bold">{codeErrorMsg}</p>
                )}
              </>
            )}
          </form>
        )}
      </div>

      {/* SHARE A GRAPHIC SECTION */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-extrabold tracking-wider text-[#5E7270] uppercase px-1">
          Share a graphic
        </h3>

        {/* SUB-TABS */}
        <div className="flex items-center gap-2 p-1 bg-[#F4F6F1] rounded-full border border-slate-200/80">
          <button
            onClick={() => setGraphicTab('site')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-full transition-colors cursor-pointer ${
              graphicTab === 'site'
                ? 'bg-[#0F3B3A] text-white shadow-xs'
                : 'text-[#5E7270] hover:text-[#10282A]'
            }`}
          >
            For your site
          </button>
          <button
            onClick={() => setGraphicTab('social')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-full transition-colors cursor-pointer ${
              graphicTab === 'social'
                ? 'bg-[#0F3B3A] text-white shadow-xs'
                : 'text-[#5E7270] hover:text-[#10282A]'
            }`}
          >
            Instagram & Facebook
          </button>
        </div>

        <p className="text-xs text-[#5E7270] px-1">
          {graphicTab === 'site'
            ? 'Put this image on a page or forum. It uses your link.'
            : 'Download or share this graphic for Instagram or Facebook stories.'}
        </p>

        {/* GRAPHIC CARD PREVIEW */}
        <div className="bg-white rounded-[28px] p-6 border border-slate-200/60 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xs">
          <div className="bg-[#0F3B3A] text-white p-6 rounded-[22px] shadow-sm max-w-xs w-full space-y-3">
            <div className="inline-block bg-[#CBF53C] text-[#10282A] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              Earnlio
            </div>
            <div className="text-lg font-black tracking-tight leading-tight">
              Earn Real Money for Activities You Enjoy
            </div>
            <p className="text-[11px] text-white/80">
              Watch videos, read articles & ebooks, and complete microtask offers!
            </p>
            <div className="bg-white/10 backdrop-blur-xs rounded-[16px] p-2 text-xs font-mono text-white">
              Code: <span className="text-[#CBF53C] font-bold">{referralCode}</span>
            </div>
          </div>

          <button
            onClick={() => copyToClipboard(referralLink, 'link')}
            className="mt-4 text-xs font-bold text-[#0E7C74] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Copy banner link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
