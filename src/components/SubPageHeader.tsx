import React from 'react';
import { ChevronLeft, Bell } from 'lucide-react';

interface SubPageHeaderProps {
  title: string;
  onBack: () => void;
  rightAction?: React.ReactNode;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
}

export const SubPageHeader: React.FC<SubPageHeaderProps> = ({
  title,
  onBack,
  rightAction,
  onOpenNotifications,
  unreadNotificationsCount = 0,
}) => {
  const handleBackClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.scrollTop = 0;
    onBack();
  };

  return (
    <div className="flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 bg-[#F4F6F1] relative sticky top-0 z-30 border-b border-slate-200/50 backdrop-blur-md">
      <button
        onClick={handleBackClick}
        className="w-10 h-10 rounded-full bg-white text-[#10282A] shadow-2xs flex items-center justify-center hover:bg-slate-100 transition-all cursor-pointer border border-[#10282A]/10 active:scale-95"
        aria-label="Back"
      >
        <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
      </button>

      <h1 className="text-base sm:text-lg font-extrabold text-[#10282A] tracking-tight text-center flex-1 mx-2 truncate font-['Outfit',sans-serif]">
        {title}
      </h1>

      <div className="w-10 flex justify-end items-center">
        {rightAction ? (
          rightAction
        ) : onOpenNotifications ? (
          <button
            onClick={onOpenNotifications}
            className="w-10 h-10 rounded-full bg-white text-[#10282A] shadow-2xs flex items-center justify-center hover:bg-slate-100 transition-all cursor-pointer border border-[#10282A]/10 active:scale-95 relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-[#10282A]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
};
