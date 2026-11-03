import React from 'react';
import { User, ShieldCheck } from 'lucide-react';

interface WelcomeScreenProps {
  onGoogleLogin: () => void;
  onGuestLogin: () => void;
}

export const GoogleLogoIcon = () => (
  <svg className="w-5 h-5 min-w-[20px]" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGoogleLogin,
  onGuestLogin,
}) => {
  return (
    <div className="bg-[#0F3B3A] text-white min-h-screen px-6 py-12 flex flex-col justify-between items-start text-left relative overflow-hidden">
      {/* BACKGROUND DECORATIVE BLURS */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#CBF53C]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#06B6D4]/15 rounded-full blur-3xl pointer-events-none" />

      {/* BRAND LOGO & HEADINGS */}
      <div className="space-y-6 pt-10 relative z-10 w-full">
        {/* LIME E BADGE */}
        <div className="w-20 h-20 bg-[#CBF53C] text-[#10282A] rounded-[26px] flex items-center justify-center font-black text-4xl shadow-xl ring-4 ring-white/10 font-['Outfit',sans-serif]">
          E
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-black tracking-tight text-white leading-tight font-['Outfit',sans-serif]">
            Earnlio
          </h1>
          <p className="text-[#BFE9E3] text-base font-medium max-w-xs leading-relaxed">
            Earn real rewards for watching videos, reading articles, eBooks, and quick daily activities.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#CBF53C]">
          <ShieldCheck className="w-4 h-4 text-[#CBF53C]" />
          <span>Secure Google Auth Integration</span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="w-full space-y-3.5 pb-6 relative z-10">
        {/* GOOGLE SIGN IN BUTTON */}
        <button
          onClick={onGoogleLogin}
          className="w-full bg-white hover:bg-slate-50 text-[#10282A] font-extrabold py-4 px-6 rounded-full text-sm sm:text-base transition-all shadow-xl active:scale-[0.98] cursor-pointer min-h-[54px] font-['Outfit',sans-serif] flex items-center justify-center gap-3 border border-slate-200"
        >
          <GoogleLogoIcon />
          <span>Sign in with Google</span>
        </button>

        {/* GUEST EXPLORER BUTTON */}
        <button
          onClick={onGuestLogin}
          className="w-full bg-white/10 hover:bg-white/15 text-white font-extrabold py-3.5 px-6 rounded-full text-xs sm:text-sm backdrop-blur-md border border-white/20 transition-all text-center flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
        >
          <User className="w-4 h-4 text-[#CBF53C]" />
          <span>Continue as Guest Explorer</span>
        </button>

        <p className="text-center text-[11px] text-slate-300/80 pt-1 font-medium">
          By continuing, you agree to Earnlio's Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
};
