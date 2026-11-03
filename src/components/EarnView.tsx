import React from 'react';
import { EarningCategoryType, AppConfig } from '../types';
import { ChevronRight } from 'lucide-react';
import {
  CategoryIconVideos,
  CategoryIconArticles,
  CategoryIconEbooks,
  CategoryIconOffers,
} from './Icons3D';

interface EarnViewProps {
  config: AppConfig;
  onSelectCategory: (category: EarningCategoryType) => void;
}

export const EarnView: React.FC<EarnViewProps> = ({ onSelectCategory }) => {
  const earnItems: Array<{
    id: EarningCategoryType;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'Videos',
      title: 'Videos',
      subtitle: 'Quickest rewards here',
      icon: <CategoryIconVideos className="w-10 h-10 shrink-0" />,
    },
    {
      id: 'Articles',
      title: 'Articles',
      subtitle: 'Read & finish articles',
      icon: <CategoryIconArticles className="w-10 h-10 shrink-0" />,
    },
    {
      id: 'Ebooks',
      title: 'eBooks',
      subtitle: 'Earn for reading chapters',
      icon: <CategoryIconEbooks className="w-10 h-10 shrink-0" />,
    },
    {
      id: 'Offers',
      title: 'Offers',
      subtitle: 'Microtasks and offers',
      icon: <CategoryIconOffers className="w-10 h-10 shrink-0" />,
    },
  ];

  return (
    <div className="px-4 pt-1.5 pb-28 space-y-5">
      {/* YOU WILL EARN FORMULA CARD */}
      <div className="bg-white rounded-[28px] p-5 shadow-2xs border border-slate-200/60 text-center">
        <span className="text-xs font-semibold text-[#5E7270] block mb-0.5">
          Reward Value Rate:
        </span>
        <div className="text-lg font-extrabold text-[#0B6B3A] tracking-tight mb-4">
          10,000 points = $10.00
        </div>

        {/* 3 STEPS ROW */}
        <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-full bg-[#0F3B3A] text-white text-xs font-extrabold flex items-center justify-center mb-1 shadow-2xs">
              1
            </div>
            <span className="text-xs font-bold text-[#10282A]">Select</span>
            <span className="text-[10px] text-[#5E7270]">Select category</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-full bg-[#0F3B3A] text-white text-xs font-extrabold flex items-center justify-center mb-1 shadow-2xs">
              2
            </div>
            <span className="text-xs font-bold text-[#10282A]">Start</span>
            <span className="text-[10px] text-[#5E7270]">Complete activity</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-full bg-[#0F3B3A] text-white text-xs font-extrabold flex items-center justify-center mb-1 shadow-2xs">
              3
            </div>
            <span className="text-xs font-bold text-[#10282A]">Redeem</span>
            <span className="text-[10px] text-[#5E7270]">Claim rewards</span>
          </div>
        </div>
      </div>

      {/* CATEGORY LIST */}
      <div className="space-y-3">
        {earnItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectCategory(item.id)}
            className="bg-white hover:bg-slate-50 border border-slate-200/60 rounded-[24px] p-4 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] shadow-2xs group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#F4F6F1] border border-slate-100 shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-[#10282A] leading-snug">
                  {item.title}
                </span>
                <span className="text-xs font-medium text-[#5E7270] leading-snug">
                  {item.subtitle}
                </span>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#F4F6F1] flex items-center justify-center text-[#5E7270] group-hover:bg-[#0F3B3A] group-hover:text-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
