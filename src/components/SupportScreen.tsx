import React, { useState } from 'react';
import { UserState, AppConfig } from '../types';
import { ArrowLeft, Mail, ChevronRight, Copy, ChevronDown, Check, AlertCircle } from 'lucide-react';

interface SupportScreenProps {
  user: UserState;
  config: AppConfig;
  onBack: () => void;
}

export const SupportScreen: React.FC<SupportScreenProps> = ({ user, config, onBack }) => {
  const [copiedId, setCopiedId] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [problemReported, setProblemReported] = useState(false);
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [problemText, setProblemText] = useState('');

  const copyId = () => {
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleReportProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemText.trim()) return;
    setProblemReported(true);
    setTimeout(() => {
      setProblemReported(false);
      setShowProblemForm(false);
      setProblemText('');
    }, 2000);
  };

  const faqs = [
    {
      q: 'How can I withdraw money?',
      a: 'Go to the Wallet or Payment tab under Settings. Once your balance reaches the $10.00 threshold (10,000 points), select your preferred payment method (PayPal, Bank transfer, or Gift card) and submit your request.',
    },
    {
      q: 'How long does it take to process a withdrawal?',
      a: 'Standard payouts are reviewed and processed within 24 to 48 hours. You will receive a notification as soon as funds are dispatched.',
    },
    {
      q: 'How can I earn in the app?',
      a: 'You can earn through four core activities: watching short videos, reading articles, reading ebooks, and completing microtask offers, as well as referring friends!',
    },
  ];

  return (
    <div className="bg-[#F4F6F1] min-h-screen p-4 space-y-5 pb-28">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-[#10282A] hover:bg-white rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-extrabold text-[#10282A]">Support & help</h2>
        <div className="w-9" />
      </div>

      {/* CONTACT US SECTION */}
      <div className="space-y-2">
        <span className="text-[11px] font-extrabold tracking-wider text-[#5E7270] uppercase block px-1">
          Contact Us
        </span>

        {/* Email button */}
        <a
          href={`mailto:${config.supportEmail}`}
          className="w-full bg-white hover:bg-slate-50 border border-slate-200/60 rounded-[22px] p-4 flex items-center gap-3 text-xs font-bold text-[#10282A] transition-colors shadow-2xs block"
        >
          <Mail className="w-4 h-4 text-[#0E7C74]" />
          <span>{config.supportEmail || 'support@earnlio.com'}</span>
        </a>

        {/* Report a problem */}
        <button
          onClick={() => setShowProblemForm(!showProblemForm)}
          className="w-full bg-white hover:bg-slate-50 border border-slate-200/60 rounded-[22px] p-4 flex items-center justify-between text-xs font-bold text-[#10282A] transition-colors shadow-2xs cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#0E7C74]" />
            <span>Report a problem</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#5E7270]" />
        </button>

        {showProblemForm && (
          <div className="bg-white border border-slate-200/80 rounded-[22px] p-4 space-y-3 shadow-2xs">
            {problemReported ? (
              <p className="text-xs font-bold text-[#0B6B3A] text-center">
                Problem report submitted! Our support team will investigate within 24h.
              </p>
            ) : (
              <form onSubmit={handleReportProblem} className="space-y-2">
                <label className="text-xs font-bold text-[#10282A] block">
                  Describe the issue you are experiencing:
                </label>
                <textarea
                  rows={3}
                  required
                  value={problemText}
                  onChange={(e) => setProblemText(e.target.value)}
                  placeholder="Explain what happened..."
                  className="w-full bg-[#F4F6F1] border border-slate-200 rounded-[16px] p-3 text-xs text-[#10282A] focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-[#0F3B3A] text-white font-extrabold py-3 rounded-full text-xs cursor-pointer"
                >
                  Submit Report
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* ACCOUNT ID SECTION */}
      <div className="space-y-2">
        <span className="text-[11px] font-extrabold tracking-wider text-[#5E7270] uppercase block px-1">
          Account ID
        </span>

        <div className="bg-white border border-slate-200/60 rounded-[22px] p-4 flex items-center justify-between text-xs shadow-2xs">
          <span className="font-mono font-bold text-[#10282A]">{user.id}</span>
          <button onClick={copyId} className="text-[#5E7270] hover:text-[#10282A] cursor-pointer">
            {copiedId ? <Check className="w-4 h-4 text-[#0B6B3A]" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* FAQ ACCORDION SECTION */}
      <div className="space-y-2">
        <span className="text-[11px] font-extrabold tracking-wider text-[#5E7270] uppercase block px-1">
          FAQ
        </span>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/60 rounded-[22px] overflow-hidden shadow-2xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-[#10282A] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#5E7270] transition-transform ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openFaq === idx && (
                <div className="p-4 pt-0 text-xs text-[#5E7270] border-t border-slate-100 leading-relaxed bg-white">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER APP VERSION */}
      <div className="pt-6 text-center text-xs font-medium text-[#5E7270]">
        Current app version: {config.appVersion || '91.9 (110)'}
      </div>
    </div>
  );
};
