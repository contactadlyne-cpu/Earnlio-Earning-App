import React, { useState } from 'react';
import { SubPageHeader } from '../SubPageHeader';
import { Mail, KeyRound, Lock, Eye, EyeOff, CheckCircle2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { api } from '../../api';

interface ForgotPasswordScreenProps {
  onBack: () => void;
  onGoToLogin?: () => void;
  onResetSubmitted?: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onBack,
  onGoToLogin,
  onResetSubmitted,
}) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // STEP 1: SEND RESET OTP CODE
  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.sendForgotPasswordCode(email.trim());
      setStep('reset');
      setErrorMsg('');
    } catch (err) {
      setErrorMsg('Failed to send password reset code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // STEP 2: VERIFY CODE AND RESET PASSWORD
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otpCode.trim() || otpCode.length < 6) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.resetPassword(email.trim(), otpCode.trim(), newPassword);

      if (res.success) {
        setSuccessMsg(res.message || 'Password successfully reset!');
        if (onResetSubmitted) {
          setTimeout(() => {
            onResetSubmitted();
          }, 1500);
        }
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg('Failed to reset password. Please check your verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setIsSubmitting(true);
    try {
      await api.sendForgotPasswordCode(email.trim());
      setErrorMsg('');
    } catch (err) {
      setErrorMsg('Failed to resend code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F4F6F1] min-h-screen flex flex-col justify-between pb-10">
      <SubPageHeader
        title={step === 'request' ? 'Forgot Password' : 'Reset Password'}
        onBack={step === 'reset' ? () => setStep('request') : onBack}
      />

      <div className="px-5 py-4 flex-1 space-y-5 max-w-md mx-auto w-full">
        {errorMsg && (
          <div className="bg-[#FCE8E6] text-[#B3261E] p-3.5 rounded-[18px] text-xs font-bold border border-[#B3261E]/20 animate-shake">
            {errorMsg}
          </div>
        )}

        {successMsg ? (
          <div className="bg-white rounded-[26px] p-6 border border-slate-200 shadow-sm text-center space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-[#E3F6DF] text-[#0B6B3A] mx-auto flex items-center justify-center shadow-2xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-[#10282A] font-['Outfit',sans-serif]">
                Password Reset Successful!
              </h3>
              <p className="text-xs text-[#5E7270]">
                Your password for <strong className="text-[#10282A]">{email}</strong> has been updated. You can now log in with your new password.
              </p>
            </div>

            <button
              onClick={onGoToLogin || onBack}
              className="w-full bg-[#CBF53C] hover:bg-[#b8e030] text-[#10282A] font-extrabold py-3.5 px-6 rounded-full text-xs transition-all shadow-md active:scale-98 cursor-pointer font-['Outfit',sans-serif]"
            >
              Go to Log In Now
            </button>
          </div>
        ) : step === 'request' ? (
          /* STEP 1: REQUEST CODE */
          <form onSubmit={handleRequestResetCode} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-[#10282A] font-['Outfit',sans-serif]">
                Recover Password
              </h2>
              <p className="text-xs text-[#5E7270] font-medium leading-relaxed">
                Enter your registered email address to receive a 6-digit verification code.
              </p>
            </div>

            {/* EMAIL INPUT */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-extrabold text-[#10282A]">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 rounded-[18px] px-4 py-3.5 pl-11 text-sm font-bold text-[#10282A] focus:outline-none focus:ring-2 focus:ring-[#0E7C74] shadow-2xs"
                />
                <Mail className="w-5 h-5 text-[#5E7270] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#CBF53C] hover:bg-[#b8e030] text-[#10282A] font-extrabold py-4 px-6 rounded-full text-xs sm:text-sm transition-all shadow-md active:scale-98 cursor-pointer mt-3 flex items-center justify-center gap-2 min-h-[50px] font-['Outfit',sans-serif]"
            >
              <span>{isSubmitting ? 'Sending Code...' : 'Send Verification Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* STEP 2: VERIFY OTP AND SET NEW PASSWORD */
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4 animate-fadeIn">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-[#10282A] font-['Outfit',sans-serif]">
                Set New Password
              </h2>
              <p className="text-xs text-[#5E7270] font-medium leading-relaxed">
                Enter the 6-digit code sent to <strong className="text-[#10282A]">{email}</strong> and choose a new password.
              </p>
            </div>

            {/* 6-DIGIT OTP CODE */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#10282A]">6-Digit Code</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white border border-slate-200/80 rounded-[18px] px-4 py-3 text-center text-lg font-black tracking-[0.4em] text-[#10282A] focus:outline-none focus:ring-2 focus:ring-[#0E7C74] shadow-2xs font-mono"
                />
                <KeyRound className="w-5 h-5 text-[#5E7270] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#10282A]">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 rounded-[18px] px-4 py-3.5 pl-11 pr-11 text-sm font-bold text-[#10282A] focus:outline-none focus:ring-2 focus:ring-[#0E7C74] shadow-2xs"
                />
                <Lock className="w-5 h-5 text-[#5E7270] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5E7270] hover:text-[#10282A]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#10282A]">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 rounded-[18px] px-4 py-3.5 pl-11 text-sm font-bold text-[#10282A] focus:outline-none focus:ring-2 focus:ring-[#0E7C74] shadow-2xs"
                />
                <ShieldCheck className="w-5 h-5 text-[#5E7270] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* RESET SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting || otpCode.length < 6 || !newPassword}
              className="w-full bg-[#CBF53C] hover:bg-[#b8e030] disabled:opacity-50 text-[#10282A] font-extrabold py-4 px-6 rounded-full text-xs sm:text-sm transition-all shadow-md active:scale-98 cursor-pointer min-h-[50px] font-['Outfit',sans-serif]"
            >
              <span>{isSubmitting ? 'Resetting Password...' : 'Reset Password'}</span>
            </button>

            {/* RESEND CODE LINK */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleResendCode}
                className="text-xs font-bold text-[#0E7C74] hover:underline cursor-pointer"
              >
                Didn't receive code? Resend code
              </button>
            </div>
          </form>
        )}

        <div className="pt-3 text-center border-t border-slate-200/60">
          <button
            type="button"
            onClick={onGoToLogin || onBack}
            className="text-xs font-extrabold text-[#0E7C74] hover:underline cursor-pointer"
          >
            Return to Log In
          </button>
        </div>
      </div>
    </div>
  );
};
