import React from 'react';
import { StreakState } from '../../types';
import { SubPageHeader } from '../SubPageHeader';
import { Flame, Sparkles, Check, CheckCircle2, Lock } from 'lucide-react';
import {
  MilestoneIcon3D_3Days,
  MilestoneIcon3D_7Days,
  MilestoneIcon3D_30Days,
} from '../Icons3D';

interface DailyStreakScreenProps {
  streak: StreakState;
  onBack: () => void;
  onClaimStreak: () => Promise<void>;
  onClaimMilestone?: (milestoneDays: number, rewardUsd: number, points: number) => Promise<void>;
}

export const DailyStreakScreen: React.FC<DailyStreakScreenProps> = ({
  streak,
  onBack,
  onClaimStreak,
  onClaimMilestone,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const isClaimedToday = streak.lastClaimedDate === todayStr;

  const now = new Date();
  const currentDayIdx = (now.getDay() + 6) % 7; // Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const fullDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const milestones = [
    {
      days: 3,
      label: '3-Day Bonus',
      rewardText: '+$0.015',
      pointsText: '+15 points',
      rewardUsd: 0.015,
      points: 15,
      icon: <MilestoneIcon3D_3Days className="w-12 h-12 shrink-0 drop-shadow-xs" />,
    },
    {
      days: 7,
      label: '7-Day Bonus',
      rewardText: '+$0.05',
      pointsText: '+50 points',
      rewardUsd: 0.05,
      points: 50,
      icon: <MilestoneIcon3D_7Days className="w-12 h-12 shrink-0 drop-shadow-xs" />,
    },
    {
      days: 30,
      label: '30-Day Master',
      rewardText: '+$0.50',
      pointsText: '+500 points',
      rewardUsd: 0.50,
      points: 500,
      icon: <MilestoneIcon3D_30Days className="w-12 h-12 shrink-0 drop-shadow-xs" />,
    },
  ];

  return (
    <div className="bg-[#F4F6F1] min-h-screen pb-28">
      <SubPageHeader title="Daily Streak" onBack={onBack} />

      <div className="p-4 space-y-5 max-w-lg mx-auto w-full">
        {/* HERO FLAME CARD */}
        <div className="bg-[#0F3B3A] text-white rounded-[28px] p-6 text-center space-y-3 shadow-md relative overflow-hidden">
          <div className="w-16 h-16 bg-[#CBF53C] text-[#10282A] rounded-[24px] flex items-center justify-center mx-auto shadow-xs">
            <Flame className="w-8 h-8 fill-[#10282A]/20" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {streak.count} Day Streak
          </h2>
          <p className="text-xs text-[#BFE9E3] font-medium max-w-xs mx-auto">
            Collect rewards daily to keep your streak active! Earn +$0.005 every 24 hours.
          </p>
        </div>

        {/* WEEK ACTIVITY ROW */}
        <div className="bg-white rounded-[24px] p-5 border border-slate-200/60 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-[#10282A] tracking-wider uppercase">
              This Week's Activity
            </h3>
            <span className="text-[11px] font-bold text-[#0E7C74]">
              Today: {fullDayNames[currentDayIdx]}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 pt-2">
            {dayLabels.map((label, idx) => {
              const dayActivity = streak.weekActivity && streak.weekActivity[idx];
              const isToday = idx === currentDayIdx;
              const isChecked = dayActivity?.active || (isToday && isClaimedToday);

              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 min-w-0">
                  <div
                    className={`w-9 sm:w-10 h-9 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isChecked
                        ? 'bg-[#CBF53C] text-[#10282A] border border-[#b8e030] shadow-2xs'
                        : isToday
                        ? 'bg-[#BFE9E3] text-[#0F3B3A] border-2 border-[#0E7C74] font-black animate-pulse'
                        : 'bg-[#F4F6F1] text-[#5E7270] border border-slate-200/60'
                    }`}
                  >
                    {isChecked ? <Check className="w-4 h-4 stroke-[3]" /> : label}
                  </div>

                  <span
                    className={`text-[10px] font-bold truncate ${
                      isToday ? 'text-[#0E7C74] uppercase font-black' : 'text-[#5E7270]'
                    }`}
                  >
                    {isToday ? 'Today' : fullDayNames[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STREAK MILESTONES SECTION */}
        <div className="bg-white rounded-[24px] p-5 border border-slate-200/60 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-[#10282A] tracking-wider uppercase">
              Streak Milestones
            </h3>
            <span className="text-[11px] font-bold text-[#0E7C74]">
              Max 30D Bonus = $0.50
            </span>
          </div>

          <div className="space-y-3">
            {milestones.map((m) => {
              const isMilestoneClaimed = (streak.claimedMilestones || []).includes(m.days);
              const isMilestoneUnlocked = streak.count >= m.days;

              return (
                <div
                  key={m.days}
                  className="flex items-center justify-between p-3.5 bg-[#F4F6F1] rounded-[22px] border border-slate-200/60 shadow-2xs transition-all hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                    {m.icon}
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-extrabold text-[#10282A] block truncate">
                        {m.label}
                      </span>
                      <span className="text-[11px] font-semibold text-[#5E7270] mt-0.5">
                        {m.pointsText} ({m.rewardText})
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isMilestoneClaimed ? (
                      <span className="text-[11px] font-extrabold text-[#0B6B3A] bg-[#E3F6DF] px-3.5 py-1.5 rounded-full flex items-center gap-1 border border-[#0B6B3A]/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Claimed</span>
                      </span>
                    ) : isMilestoneUnlocked ? (
                      <button
                        onClick={() => onClaimMilestone && onClaimMilestone(m.days, m.rewardUsd, m.points)}
                        className="bg-[#CBF53C] hover:bg-[#b8e030] text-[#10282A] text-xs font-black px-4 py-2 rounded-full shadow-2xs cursor-pointer transition-all active:scale-95"
                      >
                        Claim {m.rewardText}
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-[#5E7270] bg-slate-200 px-3 py-1.5 rounded-full flex items-center gap-1 border border-slate-300/60">
                        <Lock className="w-3 h-3 text-[#5E7270]" />
                        <span>{m.rewardText}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAIN DAILY STREAK CLAIM BUTTON */}
        <div className="pt-2">
          <button
            onClick={onClaimStreak}
            disabled={isClaimedToday}
            className={`w-full font-extrabold py-3.5 px-4 rounded-full text-xs sm:text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 text-center leading-tight cursor-pointer ${
              isClaimedToday
                ? 'bg-[#E3F6DF] border-2 border-[#0B6B3A]/30 text-[#0B6B3A] cursor-not-allowed shadow-2xs'
                : 'bg-[#CBF53C] hover:bg-[#b8e030] text-[#10282A] active:scale-98'
            }`}
          >
            {isClaimedToday ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#0B6B3A] shrink-0" />
                <span>Claimed Today (+ $0.005)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#10282A] shrink-0" />
                <span>Claim Daily Bonus (+ $0.005)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
