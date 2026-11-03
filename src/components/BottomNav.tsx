import React from 'react';
import { BottomNavTab, BottomTab } from '../types';
import { Home, CircleDollarSign, SunMedium } from 'lucide-react';

interface BottomNavProps {
  activeTab: BottomNavTab | BottomTab;
  onSelectTab?: (tab: BottomNavTab) => void;
  onTabChange?: (tab: BottomNavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab, onTabChange }) => {
  const handleSelect = (tab: BottomNavTab) => {
    if (onSelectTab) onSelectTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-0 right-0 z-40 flex justify-center pointer-events-none px-4">
      <div className="bg-[#0F3B3A] text-white px-3 py-2 rounded-full shadow-2xl flex items-center gap-2 pointer-events-auto border border-white/10 max-w-[340px] w-full justify-around">
        {/* HOME */}
        <button
          onClick={() => handleSelect('home')}
          className={`flex-1 py-2 px-3 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer min-h-[48px] ${
            activeTab === 'home'
              ? 'bg-[#CBF53C] text-[#10282A] font-bold'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5 font-bold">Home</span>
        </button>

        {/* EARN */}
        <button
          onClick={() => handleSelect('earn')}
          className={`flex-1 py-2 px-3 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer min-h-[48px] ${
            activeTab === 'earn'
              ? 'bg-[#CBF53C] text-[#10282A] font-bold'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <CircleDollarSign className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5 font-bold">Rewards</span>
        </button>

        {/* SETTINGS */}
        <button
          onClick={() => handleSelect('settings')}
          className={`flex-1 py-2 px-3 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer min-h-[48px] ${
            activeTab === 'settings'
              ? 'bg-[#CBF53C] text-[#10282A] font-bold'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <SunMedium className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5 font-bold">Settings</span>
        </button>
      </div>
    </div>
  );
};
