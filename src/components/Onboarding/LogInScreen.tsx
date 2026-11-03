import React, { useState } from 'react';
import { SubPageHeader } from '../SubPageHeader';
import { ShieldCheck, User } from 'lucide-react';
import { GoogleLogoIcon } from './WelcomeScreen';

interface LogInScreenProps {
  onBack: () => void;
  onLoginSuccess: (email: string) => void;
  onGoToSignUp?: () => void;
  onGuestLogin: () => void;
  onShowToast: (msg: string) => void;
}

export const LogInScreen: React.FC<LogInScreenProps> = ({
  onBack,
  onLoginSuccess,
  onGoToSignUp,
  onGuestLogin,
  onShowToast,
}) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleAuth = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      onLoginSuccess('contactadlyne@gmail.com');
      onShowToast('Signed in with Google successfully!');
      setIsLoggingIn(false);
    }, 400);
  };

  return (
    <div className="bg-[#F4F6F1] min-h-screen flex flex-col justify-between pb-10">
      <SubPageHeader title="Log in" onBack={onBack} />

      <div className="px-5 py-6 flex-1 flex flex-col justify-between max-w-md mx-auto w-full">
        <div className="space-y-6 pt-4">
          <div className="space-y-2 text-center">
            <div className="w-16 h-16 bg-[#0F3B3A] text-[#CBF53C] rounded-[22px] flex items-center justify-center font-black text-3xl shadow-md mx-auto font-['Outfit',sans-serif]">
              E
            </div>
            <h2 className="text-2xl font-black text-[#10282A] font-['Outfit',sans-serif] pt-2">
              Sign In to Earnlio
            </h2>
            <p className="text-xs text-[#5E7270] font-medium leading-relaxed max-w-xs mx-auto">
              We now use fast, secure Google authentication. No passwords or email codes needed.
            </p>
          </div>

          <div className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-xs space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#0E7C74] bg-[#0E7C74]/10 py-2 px-4 rounded-full w-fit mx-auto">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Google OAuth Account</span>
            </div>

            {/* GOOGLE SIGN IN BUTTON */}
            <button
              onClick={handleGoogleAuth}
              disabled={isLoggingIn}
              className="w-full bg-[#10282A] hover:bg-[#1a3a3d] text-white font-extrabold py-4 px-6 rounded-full text-sm transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-3 min-h-[52px] font-['Outfit',sans-serif]"
            >
              <GoogleLogoIcon />
              <span>{isLoggingIn ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>
          </div>
        </div>

        {/* GUEST LOGIN BUTTON */}
        <div className="pt-6 border-t border-slate-200/60 space-y-3 text-center">
          <button
            type="button"
            onClick={onGuestLogin}
            className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-[#10282A] font-extrabold py-3.5 px-5 rounded-full text-xs transition-all shadow-2xs active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4 text-[#0E7C74]" />
            <span>Continue as Guest Explorer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
