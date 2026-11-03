import React, { useState, useEffect } from 'react';
import { ArticleItem } from '../../types';
import { SubPageHeader } from '../SubPageHeader';
import { formatCurrency } from '../../api';
import { Newspaper, Sparkles, CheckCircle2, ArrowLeft, Clock, BookOpen, Share2 } from 'lucide-react';

interface ArticlesScreenProps {
  articles: ArticleItem[];
  onBack: () => void;
  onFinishArticle: (article: ArticleItem) => Promise<void>;
}

export const ArticlesScreen: React.FC<ArticlesScreenProps> = ({
  articles,
  onBack,
  onFinishArticle,
}) => {
  const [readingArticle, setReadingArticle] = useState<ArticleItem | null>(null);
  const [readProgress, setReadProgress] = useState(0);
  const [readSeconds, setReadSeconds] = useState(0);
  const [isEligible, setIsEligible] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  // Active reading timer
  useEffect(() => {
    let timer: any;
    if (readingArticle && !claimed) {
      timer = setInterval(() => {
        setReadSeconds((s) => {
          const next = s + 1;
          if (next >= 10 && readProgress >= 80) {
            setIsEligible(true);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [readingArticle, readProgress, claimed]);

  const handleOpenArticle = (art: ArticleItem) => {
    setReadingArticle(art);
    setReadProgress(0);
    setReadSeconds(0);
    setIsEligible(false);
    setClaimed(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const totalScroll = el.scrollHeight - el.clientHeight;
    if (totalScroll > 0) {
      const pct = Math.min(100, Math.round((el.scrollTop / totalScroll) * 100));
      setReadProgress(pct);
      if (pct >= 85 || readSeconds >= 12) {
        setIsEligible(true);
      }
    }
  };

  const handleFinish = async () => {
    if (!readingArticle || isClaiming || claimed) return;
    setIsClaiming(true);
    await onFinishArticle(readingArticle);
    setClaimed(true);
    setIsClaiming(false);
    setTimeout(() => {
      setReadingArticle(null);
      setClaimed(false);
    }, 1200);
  };

  return (
    <div className="bg-[#F4F6F1] min-h-screen pb-24 flex flex-col justify-between">
      <div>
        <SubPageHeader title="Articles" onBack={onBack} />

        <div className="p-4 space-y-5 max-w-lg mx-auto w-full">
          {/* HERO BANNER */}
          <div className="bg-[#0F3B3A] text-white rounded-[28px] p-6 text-center space-y-3 shadow-md">
            <div className="w-14 h-14 bg-[#CBF53C] text-[#10282A] rounded-[20px] flex items-center justify-center mx-auto shadow-xs">
              <Newspaper className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Read & Get Rewards</h2>
            <p className="text-xs text-[#BFE9E3] font-medium max-w-xs mx-auto">
              Read curated articles on finance, productivity, and tech to earn rewards.
            </p>
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1 rounded-full text-[11px] font-bold text-[#CBF53C]">
              <span>Read to the end to claim</span>
              <span aria-hidden="true">·</span>
              <span>Daily new reads</span>
            </div>
          </div>

          {/* ARTICLES LIST */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-extrabold text-[#5E7270] tracking-wider uppercase">
                Featured Articles
              </h3>
              <span className="text-xs font-bold text-[#0E7C74]">
                {articles.length} articles
              </span>
            </div>

            <div className="space-y-2.5">
              {articles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => handleOpenArticle(art)}
                  className="bg-white hover:bg-slate-50 border border-slate-200/60 rounded-[24px] p-4 flex items-center justify-between shadow-2xs cursor-pointer transition-all active:scale-[0.99] group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-[16px] bg-[#FFD9B8] text-[#10282A] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Newspaper className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-extrabold text-[#10282A] leading-tight">
                        {art.title}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5E7270] mt-1">
                        <Clock className="w-3 h-3 text-[#5E7270]" />
                        <span>{art.readTimeText}</span>
                        <span aria-hidden="true">·</span>
                        <span>{art.points} pts</span>
                      </div>
                    </div>
                  </div>

                  <span className="bg-[#E3F6DF] text-[#0B6B3A] text-xs font-extrabold px-3 py-1.5 rounded-full shrink-0">
                    +{formatCurrency(art.rewardUsd)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ARTICLE READER MODAL / FULL SCREEN VIEW */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 bg-[#F4F6F1] flex flex-col justify-between overflow-hidden animate-in fade-in duration-200">
          {/* STICKY TOP APP BAR */}
          <div className="bg-white border-b border-slate-200/80 px-4 py-3 flex items-center justify-between shadow-xs shrink-0">
            <button
              onClick={() => setReadingArticle(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#0E7C74] hover:text-[#0F3B3A] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <span className="text-xs font-bold text-[#10282A] truncate max-w-[200px]">
              {readingArticle.title}
            </span>

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0B6B3A] bg-[#E3F6DF] px-2.5 py-0.5 rounded-full">
              +{readingArticle.points} pts
            </div>
          </div>

          {/* SCROLLABLE READING CONTAINER */}
          <div
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-lg mx-auto w-full space-y-5"
          >
            {/* ARTICLE HERO CARD */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-200/60 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#5E7270]">
                <span>{readingArticle.readTimeText}</span>
                <span aria-hidden="true">·</span>
                <span>Earnlio Editorial</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#0E7C74] font-bold">Verified Reward</span>
              </div>

              <h1 className="text-2xl font-black text-[#10282A] leading-tight tracking-tight">
                {readingArticle.title}
              </h1>

              {/* READ PROGRESS INDICATOR */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px] text-[#5E7270] font-bold">
                  <span>Reading Progress: {readProgress}%</span>
                  <span>Active time: {readSeconds}s</span>
                </div>
                <div className="w-full h-2 bg-[#F4F6F1] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#CBF53C] transition-all duration-200"
                    style={{ width: `${Math.max(5, readProgress)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* ARTICLE BODY PROSE */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-200/60 shadow-2xs space-y-4 text-[#10282A] leading-relaxed text-sm">
              <p className="font-semibold text-base text-[#0F3B3A]">
                Key Takeaway: Practical daily habits compound into meaningful personal success and financial peace of mind.
              </p>

              <p>
                {readingArticle.content}
              </p>

              <p>
                In today's fast-paced environment, taking intentional micro-breaks to absorb insightful articles improves memory retention and mental acuity. When paired with micro-rewards, digital reading transforms from passive consumption into an active, rewarding endeavor.
              </p>

              <div className="p-4 rounded-[20px] bg-[#F4F6F1] border border-slate-200/80 space-y-2">
                <span className="text-xs font-bold text-[#0F3B3A] block">
                  How Earnlio Rewards Reading:
                </span>
                <p className="text-xs text-[#5E7270] leading-normal">
                  Articles are verified for attentive completion. Once you scroll through and review the highlights, your reward balance is updated immediately in your secure wallet.
                </p>
              </div>

              <p>
                Continue exploring new topics daily to keep your streak active and unlock higher redemption thresholds!
              </p>

              <div className="pt-2 text-center text-xs text-[#5E7270]">
                — End of Article —
              </div>
            </div>
          </div>

          {/* BOTTOM STICKY REWARD CTA */}
          <div className="bg-white border-t border-slate-200/80 p-4 shadow-lg shrink-0 max-w-lg mx-auto w-full">
            {claimed ? (
              <div className="bg-[#E3F6DF] text-[#0B6B3A] py-3.5 rounded-full text-center text-xs font-extrabold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Article Completed! +{formatCurrency(readingArticle.rewardUsd)} Credited!</span>
              </div>
            ) : isEligible ? (
              <button
                onClick={handleFinish}
                disabled={isClaiming}
                className="w-full bg-[#CBF53C] hover:bg-[#b8e030] text-[#10282A] font-extrabold py-3.5 rounded-full text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-[#10282A]" />
                <span>
                  {isClaiming
                    ? 'Crediting reward...'
                    : `Claim +${formatCurrency(readingArticle.rewardUsd)} (${readingArticle.points} pts)`}
                </span>
              </button>
            ) : (
              <div className="text-center space-y-1">
                <p className="text-xs text-[#5E7270] font-bold">
                  Scroll through and read for a few moments to unlock reward
                </p>
                <div className="w-full h-1.5 bg-[#F4F6F1] rounded-full overflow-hidden max-w-xs mx-auto">
                  <div
                    className="h-full bg-[#0E7C74] transition-all duration-300"
                    style={{ width: `${readProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
