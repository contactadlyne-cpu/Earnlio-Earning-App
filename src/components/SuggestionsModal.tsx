import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

interface SuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuggestion: (text: string) => Promise<boolean>;
}

export const SuggestionsModal: React.FC<SuggestionsModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuggestion,
}) => {
  if (!isOpen) return null;

  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const charCount = text.trim().length;
  const isValid = charCount >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    const success = await onSubmitSuggestion(text);
    setIsSubmitting(false);

    if (success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setText('');
        onClose();
      }, 1600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-extrabold text-slate-900 pr-6">Share your idea</h3>

        {submitted ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <p className="text-xs font-bold text-slate-800">Suggestion Sent!</p>
            <p className="text-[11px] text-slate-500">Thank you for helping us improve Earnlio.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <p className="text-xs text-slate-500 leading-relaxed">
              Share ideas for new features, ways to earn, payout methods, or improvements. We read every suggestion.
            </p>

            <label className="text-xs font-bold text-slate-800 block leading-snug">
              What new functionality would you like to add to the platform?
            </label>

            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe the feature or improvement you are missing..."
              className="w-full bg-[#f4f5f8] border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2f1160] resize-none"
            />

            <div className={`text-[11px] font-semibold ${isValid ? 'text-emerald-600' : 'text-rose-500'}`}>
              {charCount} / 10 minimum characters
            </div>

            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={`w-full py-3 rounded-xl font-bold text-xs transition-all shadow-2xs ${
                isValid
                  ? 'bg-[#2f1160] hover:bg-[#250d4d] text-white active:scale-98'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Send suggestion'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
