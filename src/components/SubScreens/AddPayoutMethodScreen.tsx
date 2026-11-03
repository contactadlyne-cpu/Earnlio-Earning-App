import React, { useState } from 'react';
import { SubPageHeader } from '../SubPageHeader';
import { CreditCard, Building2, Gift, CheckCircle2 } from 'lucide-react';

interface AddPayoutMethodScreenProps {
  onBack: () => void;
  onSaveMethod: (type: 'paypal' | 'bank' | 'gift_card', detail: string) => void;
}

export const AddPayoutMethodScreen: React.FC<AddPayoutMethodScreenProps> = ({
  onBack,
  onSaveMethod,
}) => {
  const [selectedType, setSelectedType] = useState<'paypal' | 'bank' | 'gift_card'>('paypal');
  const [detail, setDetail] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail.trim()) return;
    onSaveMethod(selectedType, detail.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onBack();
    }, 1200);
  };

  return (
    <div className="bg-[#F4F6F1] min-h-screen pb-24">
      <SubPageHeader title="Add payout method" onBack={onBack} />

      <form onSubmit={handleSubmit} className="p-4 space-y-5">
        <p className="text-xs text-[#5E7270] font-medium px-1">
          Choose where you want to receive your money.
        </p>

        {/* METHOD SELECTION CARDS */}
        <div className="space-y-3">
          {/* PayPal */}
          <button
            type="button"
            onClick={() => setSelectedType('paypal')}
            className={`w-full p-4 rounded-[22px] border text-left flex items-center justify-between transition-all cursor-pointer ${
              selectedType === 'paypal'
                ? 'bg-white border-[#0F3B3A] ring-2 ring-[#0F3B3A]'
                : 'bg-white border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[16px] bg-[#BFE9E3] flex items-center justify-center text-[#0F3B3A]">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-[#10282A] block">PayPal</span>
                <span className="text-[11px] text-[#5E7270]">Usually within 24 hours</span>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedType === 'paypal' ? 'border-[#0F3B3A] bg-[#0F3B3A]' : 'border-slate-300'
              }`}
            >
              {selectedType === 'paypal' && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </button>

          {/* Bank Transfer */}
          <button
            type="button"
            onClick={() => setSelectedType('bank')}
            className={`w-full p-4 rounded-[22px] border text-left flex items-center justify-between transition-all cursor-pointer ${
              selectedType === 'bank'
                ? 'bg-white border-[#0F3B3A] ring-2 ring-[#0F3B3A]'
                : 'bg-white border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[16px] bg-[#FFD9B8] flex items-center justify-center text-[#10282A]">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-[#10282A] block">Bank transfer</span>
                <span className="text-[11px] text-[#5E7270]">1 to 3 business days</span>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedType === 'bank' ? 'border-[#0F3B3A] bg-[#0F3B3A]' : 'border-slate-300'
              }`}
            >
              {selectedType === 'bank' && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </button>

          {/* Gift Card */}
          <button
            type="button"
            onClick={() => setSelectedType('gift_card')}
            className={`w-full p-4 rounded-[22px] border text-left flex items-center justify-between transition-all cursor-pointer ${
              selectedType === 'gift_card'
                ? 'bg-white border-[#0F3B3A] ring-2 ring-[#0F3B3A]'
                : 'bg-white border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[16px] bg-[#E2DAFF] flex items-center justify-center text-[#10282A]">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-[#10282A] block">Gift card</span>
                <span className="text-[11px] text-[#5E7270]">Instant delivery</span>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedType === 'gift_card' ? 'border-[#0F3B3A] bg-[#0F3B3A]' : 'border-slate-300'
              }`}
            >
              {selectedType === 'gift_card' && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </button>
        </div>

        {/* ACCOUNT DETAIL INPUT */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-bold text-[#10282A] block">
            {selectedType === 'paypal' && 'PayPal email'}
            {selectedType === 'bank' && 'Account number / IBAN'}
            {selectedType === 'gift_card' && 'Email address for voucher'}
          </label>
          <input
            type="text"
            required
            placeholder="name@email.com"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-[16px] px-3.5 py-3 text-xs text-[#10282A] font-medium focus:outline-none"
          />
        </div>

        {saved ? (
          <div className="bg-[#E3F6DF] text-[#0B6B3A] py-3.5 rounded-full text-center text-xs font-extrabold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Payout method saved!</span>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full bg-[#CBF53C] hover:bg-[#b8e030] text-[#10282A] font-extrabold py-3.5 rounded-full text-xs shadow-xs cursor-pointer"
          >
            Save method
          </button>
        )}
      </form>
    </div>
  );
};
