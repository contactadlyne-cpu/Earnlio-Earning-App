import React, { useState, useEffect } from 'react';
import { EarningCategoryType } from '../types';
import { X, Play, BookOpen, Newspaper, Gift, CheckCircle2, Sparkles } from 'lucide-react';

interface EarnTaskModalProps {
  category: EarningCategoryType | null;
  onClose: () => void;
  onCompleteTask: (category: EarningCategoryType, title: string, rewardUsd: number, rewardPoints: number) => Promise<boolean>;
}

export const EarnTaskModal: React.FC<EarnTaskModalProps> = ({
  category,
  onClose,
  onCompleteTask,
}) => {
  if (!category) return null;

  // State for Videos
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);

  // State for eBooks
  const [bookReadPercent, setBookReadPercent] = useState(0);
  const [bookCompleted, setBookCompleted] = useState(false);

  // State for Articles
  const [articleReadPercent, setArticleReadPercent] = useState(0);
  const [articleCompleted, setArticleCompleted] = useState(false);

  // General Loading/Claiming State
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Video Progress Effect
  useEffect(() => {
    let interval: any;
    if (videoPlaying && videoProgress < 100) {
      interval = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= 95) {
            setVideoPlaying(false);
            setVideoCompleted(true);
            return 100;
          }
          return prev + 10;
        });
      }, 600);
    }
    return () => clearInterval(interval);
  }, [videoPlaying, videoProgress]);

  const handleClaimReward = async (title: string, rewardUsd: number, rewardPoints: number) => {
    setIsClaiming(true);
    const success = await onCompleteTask(category, title, rewardUsd, rewardPoints);
    setIsClaiming(false);
    if (success) {
      setClaimSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-[28px] sm:rounded-[28px] p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto relative">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-[#F4F6F1] text-[#5E7270] hover:text-[#10282A] rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {claimSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-[#E3F6DF] text-[#0B6B3A] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-[#10282A]">Reward Credited!</h3>
            <p className="text-xs text-[#5E7270]">Your balance and points have been updated.</p>
          </div>
        ) : (
          <>
            {/* 1. VIDEOS */}
            {category === 'Videos' && (
              <div className="space-y-4 text-center">
                <div className="flex items-center justify-center gap-2 text-[#0F3B3A] font-extrabold text-lg pt-1">
                  <Play className="w-6 h-6 text-[#0E7C74] fill-[#0E7C74]/20" />
                  <span>Watch Short Clip</span>
                </div>
                <p className="text-xs text-[#5E7270]">Watch full stream clip to earn +$0.010 and 10 points.</p>

                <div className="bg-[#0F3B3A] rounded-[22px] p-6 text-white space-y-4 relative overflow-hidden">
                  <div className="h-32 flex items-center justify-center bg-white/10 rounded-xl">
                    {videoPlaying ? (
                      <div className="animate-pulse font-bold text-sm text-[#CBF53C]">
                        Streaming Video Clip... {videoProgress}%
                      </div>
                    ) : videoCompleted ? (
                      <div className="font-extrabold text-[#CBF53C] text-sm">Clip Finished!</div>
                    ) : (
                      <Play className="w-12 h-12 text-white/80" />
                    )}
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#CBF53C] transition-all duration-300"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>
                </div>

                {!videoPlaying && !videoCompleted && (
                  <button
                    onClick={() => {
                      setVideoProgress(0);
                      setVideoPlaying(true);
                    }}
                    className="w-full bg-[#CBF53C] hover:bg-[#b8e030] text-[#10282A] font-extrabold py-3.5 rounded-full text-xs shadow-xs cursor-pointer"
                  >
                    Play Stream Clip
                  </button>
                )}

                {videoCompleted && (
                  <button
                    onClick={() => handleClaimReward('Watched Short Video Clip', 0.01, 10)}
                    disabled={isClaiming}
                    className="w-full bg-[#0F3B3A] text-white font-extrabold py-3.5 rounded-full text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#CBF53C]" />
                    <span>{isClaiming ? 'Claiming...' : 'Claim +$0.010 (10 pts)'}</span>
                  </button>
                )}
              </div>
            )}

            {/* 2. EBOOKS */}
            {category === 'Ebooks' && (
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2 text-[#0F3B3A] font-extrabold text-lg pt-1">
                  <BookOpen className="w-6 h-6 text-[#0E7C74]" />
                  <span>eBook: The Quiet Garden</span>
                </div>
                <p className="text-xs text-[#5E7270]">Read through the chapter to claim eBook rewards.</p>

                <div
                  onScroll={(e) => {
                    const el = e.currentTarget;
                    const pct = Math.min(100, Math.floor(((el.scrollTop + el.clientHeight) / el.scrollHeight) * 100));
                    setBookReadPercent(pct);
                    if (pct >= 85) setBookCompleted(true);
                  }}
                  className="bg-[#F4F6F1] rounded-[22px] p-4 border border-slate-200/80 max-h-48 overflow-y-auto space-y-2 text-xs text-[#10282A] leading-relaxed font-serif"
                >
                  <p className="font-bold font-sans text-[#0F3B3A]">Chapter 1: The Hidden Path</p>
                  <p>
                    The morning dew lingered on the gravel path as Sarah stepped into the ancient courtyard. Every step brought a newfound appreciation for silent focus and daily steady progress.
                  </p>
                  <p>
                    By reading books, finishing tasks, and staying engaged, Earnlio users steadily accumulate rewards toward cashouts.
                  </p>
                  <p className="text-[10px] font-sans text-[#5E7270] text-center pt-2">
                    --- End of Chapter 1 ---
                  </p>
                </div>

                <div className="text-[11px] font-bold text-[#0E7C74] text-right">
                  Read progress: {bookReadPercent}%
                </div>

                {bookCompleted ? (
                  <button
                    onClick={() => handleClaimReward('Read eBook Chapter 1', 0.015, 15)}
                    disabled={isClaiming}
                    className="w-full bg-[#0F3B3A] text-white font-extrabold py-3.5 rounded-full text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#CBF53C]" />
                    <span>{isClaiming ? 'Claiming...' : 'Claim +$0.015 (15 pts)'}</span>
                  </button>
                ) : (
                  <p className="text-[11px] text-[#5E7270] text-center italic">Scroll to bottom to finish reading</p>
                )}
              </div>
            )}

            {/* 3. ARTICLES */}
            {category === 'Articles' && (
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2 text-[#0F3B3A] font-extrabold text-lg pt-1">
                  <Newspaper className="w-6 h-6 text-[#0E7C74]" />
                  <span>Article: Why Sleep Matters</span>
                </div>
                <p className="text-xs text-[#5E7270]">Read this quick article to claim reward points.</p>

                <div
                  onScroll={(e) => {
                    const el = e.currentTarget;
                    const pct = Math.min(100, Math.floor(((el.scrollTop + el.clientHeight) / el.scrollHeight) * 100));
                    setArticleReadPercent(pct);
                    if (pct >= 85) setArticleCompleted(true);
                  }}
                  className="bg-[#FFD9B8]/20 rounded-[22px] p-4 border border-orange-100 max-h-48 overflow-y-auto space-y-2 text-xs text-[#10282A] leading-relaxed"
                >
                  <p className="font-bold text-[#0F3B3A]">Health & Focus in the Digital Age</p>
                  <p>
                    Quality sleep is essential for physical health, mental clarity, and emotional well-being. Studies show that adults who consistently get 7-8 hours of restful sleep experience improved focus.
                  </p>
                  <p>
                    Setting aside daily quiet reading time helps improve productivity while earning rewards.
                  </p>
                  <p className="text-[10px] text-[#5E7270] text-center pt-2">
                    --- End of Article ---
                  </p>
                </div>

                <div className="text-[11px] font-bold text-[#0E7C74] text-right">
                  Read progress: {articleReadPercent}%
                </div>

                {articleCompleted ? (
                  <button
                    onClick={() => handleClaimReward('Read Why Sleep Matters Article', 0.01, 10)}
                    disabled={isClaiming}
                    className="w-full bg-[#0F3B3A] text-white font-extrabold py-3.5 rounded-full text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#CBF53C]" />
                    <span>{isClaiming ? 'Claiming...' : 'Claim +$0.010 (10 pts)'}</span>
                  </button>
                ) : (
                  <p className="text-[11px] text-[#5E7270] text-center italic">Scroll down to finish reading</p>
                )}
              </div>
            )}

            {/* 4. OFFERS */}
            {category === 'Offers' && (
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2 text-[#0F3B3A] font-extrabold text-lg pt-1">
                  <Gift className="w-6 h-6 text-[#0E7C74]" />
                  <span>Microtasks & Offers</span>
                </div>
                <p className="text-xs text-[#5E7270]">Select an offer task to complete and claim instant credit.</p>

                <div className="space-y-2.5">
                  <div className="bg-[#F4F6F1] rounded-[22px] p-3.5 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#10282A] block">Sign up for a new app</span>
                      <span className="text-[10px] text-[#5E7270]">+1500 Points</span>
                    </div>
                    <button
                      onClick={() => handleClaimReward('Signed up for app', 1.50, 1500)}
                      disabled={isClaiming}
                      className="bg-[#CBF53C] text-[#10282A] text-xs font-extrabold px-3 py-1.5 rounded-full hover:bg-[#b8e030] cursor-pointer"
                    >
                      Claim +$1.50
                    </button>
                  </div>

                  <div className="bg-[#F4F6F1] rounded-[22px] p-3.5 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#10282A] block">Rate an app</span>
                      <span className="text-[10px] text-[#5E7270]">+400 Points</span>
                    </div>
                    <button
                      onClick={() => handleClaimReward('Rated an app', 0.40, 400)}
                      disabled={isClaiming}
                      className="bg-[#CBF53C] text-[#10282A] text-xs font-extrabold px-3 py-1.5 rounded-full hover:bg-[#b8e030] cursor-pointer"
                    >
                      Claim +$0.40
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
