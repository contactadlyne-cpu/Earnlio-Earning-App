import React from 'react';
import { MainTab, TopTab } from '../types';

interface TopNavProps {
  activeTab: MainTab | TopTab;
  onSelectTab?: (tab: MainTab) => void;
  onTabChange?: (tab: MainTab) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ activeTab, onSelectTab, onTabChange }) => {
  const handleSelect = (tab: MainTab) => {
    if (onSelectTab) onSelectTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const tabs: { id: MainTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'earn', label: 'Rewards' },
    { id: 'referral', label: 'Referral' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="px-2.5 sm:px-4 pt-2.5 pb-2 w-full">
      <div className="grid grid-cols-4 gap-1 p-1 bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-full shadow-2xs text-center w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className={`py-2 px-1 rounded-full text-[11px] sm:text-xs transition-all duration-150 text-center truncate cursor-pointer flex items-center justify-center min-h-[34px] ${
                isActive
                  ? 'bg-[#CBF53C] text-[#10282A] font-black shadow-2xs'
                  : 'text-[#5E7270] font-bold hover:text-[#10282A] hover:bg-white/80'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
