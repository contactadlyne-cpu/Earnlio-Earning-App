import React, { useState } from 'react';
import { UserState, AppConfig } from '../types';
import { ArrowLeft, Wallet, CheckCircle2, ShieldCheck, DollarSign, CreditCard, Building2, Gift } from 'lucide-react';
import { formatCurrency } from '../api';

interface WalletViewProps {
  user: UserState;
  config: AppConfig;
  onBack: () => void;
  onWithdrawSubmit: (method: string, amount: number) => Promise<boolean>;
}

export const WalletView: React.FC<WalletViewProps> = ({
  user,
  config,
  onBack,
  onWithdrawSubmit,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'paypal' | 'bank' | 'gift'>('paypal');
  const [payoutAccount, setPayoutAccount] = useState(user.email);
  const [amountInput, setAmountInput] = useState<string>(
    user.balanceUsd >= config.minWithdrawalUsd ? user.balanceUsd.toFixed(2) : config.minWithdrawalUsd.toFixed(2)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const minThreshold = config.minWithdrawalUsd || 10;
  const currentBalance = user.balanceUsd || 0;
  const canWithdraw = currentBalance >= minThreshold;
  const progressPercent = Math.min(100, Math.floor((currentBalance / minThreshold) * 100));

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const numAmount = parseFloat(amountInput);

    if (isNaN(numAmount) || numAmount < minThreshold) {
      setErrorMsg(`Minimum redemption amount is $${minThreshold.toFixed(2)}`);
      return;
    }

    if (numAmount > currentBalance) {
      setErrorMsg(`Cannot redeem more than current balance (${formatCurrency(currentBalance)})`);
      return;
    }

    setIsSubmitting(true);
    const success = await onWithdrawSubmit(selectedMethod, numAmount);
    setIsSubmitting(false);

    if (success) {
      setWithdrawSuccess(true);
    } else {
      setErrorMsg('Redemption processing failed. Please check your balance or try again.');
    }
  };

  return (
    <div className="bg-[#F4F6F1] min-h-screen p-4 space-y-5 pb-28">
      {/* TOP HEADER */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-[#10282A] hover:bg-white rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-extrabold text-[#10282A]">Redemption</h2>
        <div className="w-9" />
      </div>

      {withdrawSuccess ? (
        <div className="bg-white rounded-[28px] p-6 border border-slate-200/60 text-center space-y-4 my-6 shadow-2xs">
          <div className="w-16 h-16 bg-[#E3F6DF] text-[#0B6B3A] rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-extrabold text-[#10282A]">Redemption Requested!</h3>
          <p className="text-xs text-[#5E7270] leading-relaxed">
            Your redemption of <span className="font-bold text-[#10282A]">${parseFloat(amountInput).toFixed(2)}</span> via{' '}
            <span className="font-bold text-[#10282A] uppercase">{selectedMethod}</span> has been submitted for review.
          </p>
          <button
            onClick={() => {
              setWithdrawSuccess(false);
              onBack();
            }}
            className="w-full bg-[#0F3B3A] hover:bg-[#0c3130] text-white font-extrabold py-3.5 rounded-full text-xs transition-colors shadow-xs cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      ) : (
        <>
          {/* BALANCE CARD */}
          <div className="bg-[#0F3B3A] text-white rounded-[28px] p-5 shadow-xs space-y-3">
            <span className="text-[11px] font-extrabold tracking-wider text-white/70 uppercase block">
              Available Balance
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight font-['Outfit',sans-serif]">
                {formatCurrency(currentBalance)}
              </span>
              <span className="text-xs font-bold text-[#CBF53C]">
                ({Math.round(currentBalance * 1000).toLocaleString()} points)
              </span>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-bold text-white/80">
                <span>Redemption Progress</span>
                <span className="text-[#CBF53C] font-extrabold font-['Outfit',sans-serif]">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#CBF53C] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-white/60 block text-right">
                Minimum redemption: $10.00 (10,000 points)
              </span>
            </div>
          </div>

          {/* REDEEM FORM */}
          <form onSubmit={handleWithdraw} className="space-y-4">
            <h3 className="text-xs font-extrabold tracking-wider text-[#5E7270] uppercase px-1">
              Select Redemption Method
            </h3>

            {/* METHOD LIST */}
            <div className="space-y-2.5">
              {/* PayPal */}
              <button
                type="button"
                onClick={() => setSelectedMethod('paypal')}
                className={`w-full p-4 rounded-[22px] border text-left flex items-center justify-between transition-all cursor-pointer ${
                  selectedMethod === 'paypal'
                    ? 'bg-white border-[#0F3B3A] ring-2 ring-[#0F3B3A]'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#BFE9E3] flex items-center justify-center text-[#0F3B3A]">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#10282A] block">PayPal Vouchers</span>
                    <span className="text-[10px] text-[#5E7270]">Usually within 24 hours</span>
                  </div>
                </div>
                {selectedMethod === 'paypal' && <CheckCircle2 className="w-5 h-5 text-[#0F3B3A]" />}
              </button>

              {/* Bank Transfer */}
              <button
                type="button"
                onClick={() => setSelectedMethod('bank')}
                className={`w-full p-4 rounded-[22px] border text-left flex items-center justify-between transition-all cursor-pointer ${
                  selectedMethod === 'bank'
                    ? 'bg-white border-[#0F3B3A] ring-2 ring-[#0F3B3A]'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFD9B8] flex items-center justify-center text-[#10282A]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#10282A] block">Direct Bank Transfer</span>
                    <span className="text-[10px] text-[#5E7270]">1 to 3 business days</span>
                  </div>
                </div>
                {selectedMethod === 'bank' && <CheckCircle2 className="w-5 h-5 text-[#0F3B3A]" />}
              </button>

              {/* Gift Card */}
              <button
                type="button"
                onClick={() => setSelectedMethod('gift')}
                className={`w-full p-4 rounded-[22px] border text-left flex items-center justify-between transition-all cursor-pointer ${
                  selectedMethod === 'gift'
                    ? 'bg-white border-[#0F3B3A] ring-2 ring-[#0F3B3A]'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E2DAFF] flex items-center justify-center text-[#10282A]">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#10282A] block">Digital Gift Vouchers</span>
                    <span className="text-[10px] text-[#5E7270]">Instant delivery</span>
                  </div>
                </div>
                {selectedMethod === 'gift' && <CheckCircle2 className="w-5 h-5 text-[#0F3B3A]" />}
              </button>
            </div>

            {/* ACCOUNT / RECEIVER DETAIL INPUT */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-[#10282A] block">
                {selectedMethod === 'paypal' && 'PayPal Email Address'}
                {selectedMethod === 'bank' && 'Bank Account Number / IBAN'}
                {selectedMethod === 'gift' && 'Email for Gift Voucher'}
              </label>
              <input
                type="text"
                required
                value={payoutAccount}
                onChange={(e) => setPayoutAccount(e.target.value)}
                placeholder="name@email.com"
                className="w-full bg-white border border-slate-200 rounded-[16px] px-3.5 py-2.5 text-xs text-[#10282A] font-medium focus:outline-none"
              />
            </div>

            {/* REDEMPTION AMOUNT */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#10282A] block">
                Redemption Amount (USD)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5E7270]">
                  <DollarSign className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min={minThreshold}
                  max={currentBalance}
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-[16px] pl-9 pr-3.5 py-2.5 text-xs text-[#10282A] font-bold focus:outline-none"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs font-bold text-[#B3261E] bg-rose-50 p-3 rounded-[16px] border border-rose-200">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={!canWithdraw || isSubmitting}
              className={`w-full py-3.5 rounded-full font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                canWithdraw
                  ? 'bg-[#CBF53C] hover:bg-[#b8e030] text-[#10282A] active:scale-98'
                  : 'bg-[#DDE3DC] text-[#5E7270] cursor-not-allowed'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Processing...'
                  : canWithdraw
                  ? `Redeem $${parseFloat(amountInput || '10').toFixed(2)}`
                  : `Minimum $${minThreshold.toFixed(2)} Required to Redeem`}
              </span>
            </button>

            {!canWithdraw && (
              <p className="text-[11px] text-center text-[#5E7270] font-medium pt-1">
                You need ${(minThreshold - currentBalance).toFixed(2)} more to reach minimum redemption threshold.
              </p>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#5E7270] pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0B6B3A]" />
              <span>Compliant & Encrypted by Earnlio Rewards System</span>
            </div>
          </form>
        </>
      )}
    </div>
  );
};
