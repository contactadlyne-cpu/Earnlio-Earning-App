import React, { useState } from 'react';
import { SubPageHeader } from '../SubPageHeader';
import { ShieldCheck, User, Sparkles } from 'lucide-react';
import { GoogleLogoIcon } from './WelcomeScreen';

interface SignUpScreenProps {
  onBack: () => void;
  onSignUpSuccess: (name: string, email: string) => void;
  onGoToLogin: () => void;
  onGuestLogin: () => void;
  onShowToast: (msg: string) => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onBack,
  onSignUpSuccess,
  onGoToLogin,
  onGuestLogin,
  onShowToast,
}) => {
  const [friendCode, setFriendCode] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleGoogleSignUp = () => {
    setIsSigningUp(true);
    setTimeout(() => {
      onSignUpSuccess('Shoaib Ahmad', 'contactadlyne@gmail.com');
      onShowToast('Account created with Google successfully!');
      setIsSigningUp(false);
    }, 400);
  };

  return (
    <div className="bg-[#F4F6F1] min-h-screen flex flex-col justify-between pb-10">
      <SubPageHeader title="Create Account" onBack={onBack} />

      <div className="px-5 py-6 flex-1 flex flex-col justify-between max-w-md mx-auto w-full">
        <div className="space-y-6 pt-2">
          <div className="space-y-2 text-center">
            <div className="w-16 h-16 bg-[#CBF53C] text-[#10282A] rounded-[22px] flex items-center justify-center font-black text-3xl shadow-md mx-auto font-['Outfit',sans-serif]">
              E
            </div>
            <h2 className="text-2xl font-black text-[#10282A] font-['Outfit',sans-serif] pt-2">
              Join Earnlio
            </h2>
            <p className="text-xs text-[#5E7270] font-medium leading-relaxed max-w-xs mx-auto">
              Create your account instantly with 1-click Google authentication.
            </p>
          </div>

          <div className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-xs space-y-4">
            {/* REFERRAL CODE */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#10282A]">Referral Code (Optional)</label>
              <input
                type="text"
                placeholder="e.g. shoaib10"
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value)}
                className="w-full bg-[#F4F6F1] border border-slate-200/80 rounded-[18px] px-4 py-3 text-xs font-bold text-[#10282A] focus:outline-none focus:ring-2 focus:ring-[#0E7C74]"
              />
            </div>

            {/* GOOGLE SIGN UP BUTTON */}
            <button
              onClick={handleGoogleSignUp}
              disabled={isSigningUp}
              className="w-full bg-[#CBF53C] hover:bg-[#b8e030] text-[#10282A] font-extrabold py-4 px-6 rounded-full text-sm transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-3 min-h-[52px] font-['Outfit',sans-serif] mt-2"
            >
              <GoogleLogoIcon />
              <span>{isSigningUp ? 'Creating Account...' : 'Sign up with Google'}</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#5E7270] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0E7C74]" />
              <span>Instant setup, 100% Secure</span>
            </div>
          </div>
        </div>

        {/* GUEST & LOGIN ACTIONS */}
        <div className="pt-6 border-t border-slate-200/60 space-y-3 text-center">
          <button
            type="button"
            onClick={onGuestLogin}
            className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-[#10282A] font-extrabold py-3.5 px-5 rounded-full text-xs transition-all shadow-2xs active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4 text-[#0E7C74]" />
            <span>Continue as Guest Explorer</span>
          </button>

          <p className="text-xs text-[#5E7270] font-medium">
            Already have an account?{' '}
            <button onClick={onGoToLogin} className="text-[#0E7C74] font-extrabold hover:underline">
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
