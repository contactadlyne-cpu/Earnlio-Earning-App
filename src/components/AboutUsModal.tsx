import React, { useState } from 'react';
import { X, ExternalLink, ArrowLeft } from 'lucide-react';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutUsModal: React.FC<AboutUsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [policyView, setPolicyView] = useState<'menu' | 'privacy' | 'terms' | 'cookie'>('menu');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 relative">
        <div className="flex items-center justify-between pr-4">
          {policyView !== 'menu' ? (
            <button
              onClick={() => setPolicyView('menu')}
              className="p-1 -ml-1 text-slate-600 hover:text-slate-900 flex items-center gap-1 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <h3 className="text-base font-extrabold text-slate-900">About Us</h3>
          )}

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {policyView === 'menu' && (
          <div className="space-y-3 pt-2">
            <button
              onClick={() => setPolicyView('privacy')}
              className="w-full flex items-center justify-between p-3.5 bg-[#f4f5f8] hover:bg-slate-100 rounded-2xl text-xs font-bold text-slate-800 transition-colors"
            >
              <span>Privacy Policy</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setPolicyView('terms')}
              className="w-full flex items-center justify-between p-3.5 bg-[#f4f5f8] hover:bg-slate-100 rounded-2xl text-xs font-bold text-slate-800 transition-colors"
            >
              <span>Terms of Service</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setPolicyView('cookie')}
              className="w-full flex items-center justify-between p-3.5 bg-[#f4f5f8] hover:bg-slate-100 rounded-2xl text-xs font-bold text-slate-800 transition-colors"
            >
              <span>Cookie Policy</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </button>

            <div className="pt-2 text-center text-[10px] text-slate-400 font-medium">
              Earnlio Technologies Inc. © 2026. All rights reserved.
            </div>
          </div>
        )}

        {policyView === 'privacy' && (
          <div className="space-y-2 text-xs text-slate-600 leading-relaxed max-h-64 overflow-y-auto p-1">
            <h4 className="font-bold text-slate-900 text-sm">Privacy Policy</h4>
            <p>
              Earnlio respects your privacy and is committed to protecting your personal data. We collect account identifiers, transaction history, and engagement metrics solely to credit rewards accurately and process payouts.
            </p>
            <p>
              Your personal data is encrypted in transit and at rest and is never sold to unauthorized third parties.
            </p>
          </div>
        )}

        {policyView === 'terms' && (
          <div className="space-y-2 text-xs text-slate-600 leading-relaxed max-h-64 overflow-y-auto p-1">
            <h4 className="font-bold text-slate-900 text-sm">Terms of Service</h4>
            <p>
              By using Earnlio, you agree to comply with our fair-play policies. Fraudulent activities, automated bot scripts, or fake multiple accounts will lead to instant account termination and forfeit of unreleased balances.
            </p>
            <p>
              Payouts require reaching the minimum $10.00 threshold and completing account verification.
            </p>
          </div>
        )}

        {policyView === 'cookie' && (
          <div className="space-y-2 text-xs text-slate-600 leading-relaxed max-h-64 overflow-y-auto p-1">
            <h4 className="font-bold text-slate-900 text-sm">Cookie Policy</h4>
            <p>
              We use essential session tokens and analytics cookies to deliver a seamless mobile experience, keep you logged in securely, and save your progress across device sessions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
