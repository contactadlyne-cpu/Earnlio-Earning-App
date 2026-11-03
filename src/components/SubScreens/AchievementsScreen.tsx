import React from 'react';
import { Achievement } from '../../types';
import { SubPageHeader } from '../SubPageHeader';
import { Play, Newspaper, Gift, BookOpen, Wallet, Flame, Star, Trophy, Clock, Lock } from 'lucide-react';

interface AchievementsScreenProps {
  achievements: Achievement[];
  onBack: () => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({
  achievements,
  onBack,
}) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const renderIcon = (type: Achievement['iconType'], unlocked: boolean) => {
    const iconClass = unlocked ? 'text-[#10282A]' : 'text-[#5E7270]';
    switch (type) {
      case 'video':
        return <Play className={`w-5 h-5 ${iconClass}`} />;
      case 'article':
        return <Newspaper className={`w-5 h-5 ${iconClass}`} />;
      case 'offer':
        return <Gift className={`w-5 h-5 ${iconClass}`} />;
      case 'book':
        return <BookOpen className={`w-5 h-5 ${iconClass}`} />;
      case 'wallet':
        return <Wallet className={`w-5 h-5 ${iconClass}`} />;
      case 'flame':
        return <Flame className={`w-5 h-5 ${iconClass}`} />;
      case 'star':
        return <Star className={`w-5 h-5 ${iconClass}`} />;
      case 'trophy':
        return <Trophy className={`w-5 h-5 ${iconClass}`} />;
      case 'clock':
        return <Clock className={`w-5 h-5 ${iconClass}`} />;
      default:
        return <Star className={`w-5 h-5 ${iconClass}`} />;
    }
  };

  return (
    <div className="bg-[#F4F6F1] min-h-screen pb-24">
      <SubPageHeader title="Achievements" onBack={onBack} />

      <div className="p-4 space-y-4">
        {/* UNLOCKED COUNT HEADER */}
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-extrabold text-[#10282A]">
            {unlockedCount} / {achievements.length} unlocked
          </span>
        </div>

        {/* 4-COLUMN GRID OF 20 BADGES */}
        <div className="grid grid-cols-4 gap-3">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center p-2 rounded-[20px] transition-all"
            >
              <div
                className={`w-14 h-14 rounded-[22px] flex items-center justify-center mb-1.5 shadow-2xs relative ${
                  item.unlocked
                    ? 'bg-[#CBF53C] border border-[#b8e030]'
                    : 'bg-[#EAF0E8] border border-slate-200/60'
                }`}
              >
                {renderIcon(item.iconType, item.unlocked)}
                {!item.unlocked && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-slate-300 flex items-center justify-center">
                    <Lock className="w-2.5 h-2.5 text-slate-600" />
                  </div>
                )}
              </div>
              <span
                className={`text-[10px] leading-tight font-bold ${
                  item.unlocked ? 'text-[#10282A]' : 'text-[#5E7270]'
                }`}
              >
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
