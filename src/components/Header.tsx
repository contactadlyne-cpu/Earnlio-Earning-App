import React from 'react';
import { UserProfile, UserState, StreakState } from '../types';
import { Flame, Bell } from 'lucide-react';

interface HeaderProps {
  user: UserProfile | UserState;
  streak?: StreakState;
  hasUnreadNotifications?: boolean;
  unreadNotificationsCount?: number;
  onOpenNotifications: () => void;
  onOpenStreak?: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  streak,
  hasUnreadNotifications,
  unreadNotificationsCount = 0,
  onOpenNotifications,
  onOpenStreak,
  onOpenProfile,
}) => {
  const showDot = hasUnreadNotifications || unreadNotificationsCount > 0;
  const streakCount = streak ? streak.count : ('streakFlame' in user ? user.streakFlame || 0 : 0);

  return (
    <header className="bg-[#0F3B3A] text-white px-4 pt-[max(0.875rem,env(safe-area-inset-top))] pb-5 rounded-b-[28px] shadow-sm flex items-center justify-between">
      {/* LEFT: AVATAR & WELCOME */}
      <div onClick={onOpenProfile} className="flex items-center gap-3 cursor-pointer group">
        <div className="w-11 h-11 rounded-full bg-[#CBF53C] text-[#10282A] font-black text-lg flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 overflow-hidden">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user.avatarLetter || user.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] font-medium text-white/70 leading-tight">Welcome</span>
          <span className="text-sm font-bold text-white tracking-tight leading-tight group-hover:text-[#CBF53C] transition-colors">
            {user.name}
          </span>
        </div>
      </div>

      {/* RIGHT: STREAK CHIP & NOTIFICATION BELL */}
      <div className="flex items-center gap-2.5">
        {/* STREAK FLAME CHIP */}
        <button
          onClick={onOpenStreak}
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full text-white text-xs font-extrabold transition-all active:scale-95 cursor-pointer"
        >
          <Flame className="w-4 h-4 text-white fill-white/20" />
          <span>{streakCount}</span>
        </button>

        {/* NOTIFICATION BELL */}
        <button
          onClick={onOpenNotifications}
          className="relative w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-white transition-all active:scale-95 cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {showDot && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#CBF53C] rounded-full ring-2 ring-[#0F3B3A]" />
          )}
        </button>
      </div>
    </header>
  );
};
