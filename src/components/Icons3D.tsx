import React from 'react';

export const CategoryIconVideos: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="vidBg" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#22D3EE" />
        <stop offset="50%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#0891B2" />
      </linearGradient>
      <linearGradient id="vidDepth" x1="0" y1="0" x2="0" y2="1" gradientUnits="bounding`Box`">
        <stop offset="0%" stopColor="#0891B2" />
        <stop offset="100%" stopColor="#164E63" />
      </linearGradient>
      <linearGradient id="vidArrow" x1="22" y1="18" x2="44" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
      <filter id="vidShadow" x="2" y="4" width="60" height="60" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="5" stdDeviation="3.5" floodColor="#0891B2" floodOpacity="0.45" />
      </filter>
    </defs>
    {/* 3D Depth Base */}
    <rect x="8" y="13" width="48" height="42" rx="16" fill="url(#vidDepth)" />
    {/* Main 3D Card */}
    <rect x="8" y="8" width="48" height="42" rx="16" fill="url(#vidBg)" filter="url(#vidShadow)" />
    {/* Glossy Top Reflection */}
    <path d="M12 12 C 12 12, 28 10, 48 16 C 42 16, 22 16, 12 28 Z" fill="#FFFFFF" opacity="0.32" />
    {/* 3D Play Button */}
    <path
      d="M26 21.5 C26 19.8 27.9 18.8 29.3 19.7 L42.2 28.2 C43.5 29.0 43.5 31.0 42.2 31.8 L29.3 40.3 C27.9 41.2 26 40.2 26 38.5 V21.5 Z"
      fill="url(#vidArrow)"
    />
  </svg>
);

export const CategoryIconArticles: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="artBg" x1="12" y1="6" x2="52" y2="58" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF9800" />
        <stop offset="50%" stopColor="#F57C00" />
        <stop offset="100%" stopColor="#E65100" />
      </linearGradient>
      <linearGradient id="artPage" x1="16" y1="10" x2="48" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#FFF3E0" />
      </linearGradient>
      <filter id="artShadow" x="4" y="6" width="56" height="56" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="5" stdDeviation="3.5" floodColor="#E65100" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Back 3D Page Stacking */}
    <rect x="18" y="12" width="34" height="44" rx="8" fill="#FFE0B2" />
    {/* Main 3D Article Card */}
    <rect x="12" y="8" width="36" height="46" rx="8" fill="url(#artPage)" filter="url(#artShadow)" />
    {/* Article Header Banner */}
    <path d="M12 14 C12 10.7 14.7 8 18 8 H42 C45.3 8 48 10.7 48 14 V20 H12 V14 Z" fill="url(#artBg)" />
    {/* Lines */}
    <rect x="18" y="26" width="24" height="3.5" rx="1.75" fill="#F57C00" opacity="0.85" />
    <rect x="18" y="32" width="20" height="3.5" rx="1.75" fill="#F57C00" opacity="0.55" />
    <rect x="18" y="38" width="22" height="3.5" rx="1.75" fill="#F57C00" opacity="0.55" />
    <rect x="18" y="44" width="14" height="3.5" rx="1.75" fill="#F57C00" opacity="0.35" />
  </svg>
);

export const CategoryIconEbooks: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bookCover" x1="6" y1="12" x2="58" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#C084FC" />
        <stop offset="50%" stopColor="#9333EA" />
        <stop offset="100%" stopColor="#6B21A8" />
      </linearGradient>
      <linearGradient id="bookPages" x1="12" y1="16" x2="52" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F3E8FF" />
      </linearGradient>
      <filter id="bookShadow" x="2" y="8" width="60" height="52" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="5" stdDeviation="3.5" floodColor="#6B21A8" floodOpacity="0.45" />
      </filter>
    </defs>
    {/* Book Back Cover Depth */}
    <path
      d="M8 44 C 18 42, 32 45, 32 45 C 32 45, 46 42, 56 44 V 49 C 46 47, 32 50, 32 50 C 32 50, 18 47, 8 49 Z"
      fill="#581C87"
    />
    {/* Main 3D Pages */}
    <path
      d="M10 16 C 20 14, 31 17, 32 18 C 33 17, 44 14, 54 16 V 44 C 44 42, 33 45, 32 45 C 31 45, 20 42, 10 44 Z"
      fill="url(#bookPages)"
      filter="url(#bookShadow)"
    />
    <path d="M31.5 17.5 V 45.5" stroke="#D8B4FE" strokeWidth="2" strokeLinecap="round" />
    {/* Ribbon Bookmark */}
    <path d="M32 18 V 34 L36 31 L40 34 V 17 C 37 16.5, 34 17, 32 18 Z" fill="#F59E0B" />
    {/* Book Covers */}
    <path d="M8 14 C 18 12, 31 15, 32 16 V 46 C 31 45, 18 42, 8 44 Z" fill="url(#bookCover)" opacity="0.9" />
    <path d="M56 14 C 46 12, 33 15, 32 16 V 46 C 33 45, 46 42, 56 44 Z" fill="url(#bookCover)" opacity="0.9" />
  </svg>
);

export const CategoryIconOffers: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="boxBg" x1="10" y1="20" x2="54" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="50%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="ribbonBg" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#DB2777" />
      </linearGradient>
      <linearGradient id="coinBg" x1="36" y1="32" x2="54" y2="50" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <filter id="giftShadow" x="2" y="6" width="60" height="56" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="5" stdDeviation="3.5" floodColor="#059669" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Gift Box Base */}
    <rect x="12" y="24" width="40" height="32" rx="6" fill="url(#boxBg)" filter="url(#giftShadow)" />
    <rect x="28" y="24" width="8" height="32" fill="url(#ribbonBg)" />
    {/* Box Lid */}
    <rect x="9" y="18" width="46" height="8" rx="3" fill="url(#boxBg)" />
    <rect x="28" y="18" width="8" height="8" fill="url(#ribbonBg)" />
    {/* Bow 3D */}
    <path d="M24 13 C 18 8, 22 18, 29 18 C 29 18, 24 16, 24 13 Z" fill="url(#ribbonBg)" />
    <path d="M40 13 C 46 8, 42 18, 35 18 C 35 18, 40 16, 40 13 Z" fill="url(#ribbonBg)" />
    <circle cx="32" cy="18" r="3" fill="#F472B6" />
    {/* 3D Star Coin */}
    <circle cx="44" cy="42" r="9" fill="url(#coinBg)" />
    <circle cx="44" cy="42" r="7" fill="none" stroke="#FEF3C7" strokeWidth="1" opacity="0.6" />
    <path
      d="M44 37.5 L45.2 40.5 L48.5 40.8 L46 42.9 L46.8 46 L44 44.3 L41.2 46 L42 42.9 L39.5 40.8 L42.8 40.5 Z"
      fill="#FFFFFF"
    />
  </svg>
);

export const MilestoneIcon3D_3Days: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="stk3Bg" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2DD4BF" />
        <stop offset="50%" stopColor="#0E7C74" />
        <stop offset="100%" stopColor="#0F3B3A" />
      </linearGradient>
      <linearGradient id="stk3Flame" x1="20" y1="14" x2="44" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#CBF53C" />
        <stop offset="100%" stopColor="#A3E635" />
      </linearGradient>
      <filter id="stk3Shadow" x="2" y="4" width="60" height="60" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="5" stdDeviation="3" floodColor="#0F3B3A" floodOpacity="0.4" />
      </filter>
    </defs>
    <rect x="8" y="12" width="48" height="42" rx="16" fill="#0A2A29" />
    <rect x="8" y="8" width="48" height="42" rx="16" fill="url(#stk3Bg)" filter="url(#stk3Shadow)" />
    <path d="M12 12 C 12 12, 28 10, 48 16 C 42 16, 22 16, 12 28 Z" fill="#FFFFFF" opacity="0.25" />
    <path
      d="M32 16 C32 16 38 22 38 28 C38 30.5 36.8 32.7 35 34 C37 33 39 31 39 28 C41.5 30.5 43 34 43 38 C43 44 38 49 32 49 C26 49 21 44 21 38 C21 31 27 24 32 16 Z"
      fill="url(#stk3Flame)"
    />
    <path
      d="M32 30 C32 30 35 34 35 37 C35 38.5 34 40 32 41 C30 40 29 38.5 29 37 C29 34 32 30 32 30 Z"
      fill="#FFFFFF"
      opacity="0.9"
    />
  </svg>
);

export const MilestoneIcon3D_7Days: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="stk7Bg" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDBA74" />
        <stop offset="50%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#C2410C" />
      </linearGradient>
      <linearGradient id="stk7Gold" x1="20" y1="14" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#FACC15" />
      </linearGradient>
      <filter id="stk7Shadow" x="2" y="4" width="60" height="60" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="5" stdDeviation="3" floodColor="#C2410C" floodOpacity="0.4" />
      </filter>
    </defs>
    <rect x="8" y="12" width="48" height="42" rx="16" fill="#7C2D12" />
    <rect x="8" y="8" width="48" height="42" rx="16" fill="url(#stk7Bg)" filter="url(#stk7Shadow)" />
    <path d="M12 12 C 12 12, 28 10, 48 16 C 42 16, 22 16, 12 28 Z" fill="#FFFFFF" opacity="0.3" />
    <circle cx="32" cy="25" r="10" fill="url(#stk7Gold)" />
    <circle cx="32" cy="25" r="7.5" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
    <path d="M26 33 L21 46 L32 41 L43 46 L38 33 Z" fill="url(#stk7Gold)" />
    <path d="M32 20 L33.2 23.2 L36.5 23.5 L34 25.8 L34.8 29 L32 27.2 L29.2 29 L30 25.8 L27.5 23.5 L30.8 23.2 Z" fill="#7C2D12" />
  </svg>
);

export const MilestoneIcon3D_30Days: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="stk30Bg" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="50%" stopColor="#7E22CE" />
        <stop offset="100%" stopColor="#581C87" />
      </linearGradient>
      <linearGradient id="stk30Crown" x1="16" y1="18" x2="48" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#CBF53C" />
        <stop offset="100%" stopColor="#84B800" />
      </linearGradient>
      <filter id="stk30Shadow" x="2" y="4" width="60" height="60" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="5" stdDeviation="3" floodColor="#581C87" floodOpacity="0.45" />
      </filter>
    </defs>
    <rect x="8" y="12" width="48" height="42" rx="16" fill="#3B0764" />
    <rect x="8" y="8" width="48" height="42" rx="16" fill="url(#stk30Bg)" filter="url(#stk30Shadow)" />
    <path d="M12 12 C 12 12, 28 10, 48 16 C 42 16, 22 16, 12 28 Z" fill="#FFFFFF" opacity="0.25" />
    <path
      d="M18 42 L16 23 L26 31 L32 20 L38 31 L48 23 L46 42 Z"
      fill="url(#stk30Crown)"
    />
    <rect x="18" y="40" width="28" height="4" rx="2" fill="#FFFFFF" opacity="0.9" />
    <circle cx="16" cy="21" r="2.5" fill="#CBF53C" />
    <circle cx="32" cy="18" r="3" fill="#CBF53C" />
    <circle cx="48" cy="21" r="2.5" fill="#CBF53C" />
  </svg>
);
