import React, { useState, useEffect } from 'react';
import { VideoItem } from '../../types';
import { SubPageHeader } from '../SubPageHeader';
import { formatCurrency } from '../../api';
import { Play, Pause, RotateCcw, Volume2, Maximize2, Sparkles, CheckCircle2, X, Clock } from 'lucide-react';

interface VideosScreenProps {
  videos: VideoItem[];
  onBack: () => void;
  onWatchVideo: (video: VideoItem) => Promise<void>;
}

export const VideosScreen: React.FC<VideosScreenProps> = ({
  videos,
  onBack,
  onWatchVideo,
}) => {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // Playback timer effect
  useEffect(() => {
    let timer: any;
    if (activeVideo && isPlaying && !isCompleted) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          if (next >= activeVideo.durationSeconds) {
            setIsPlaying(false);
            setIsCompleted(true);
            return activeVideo.durationSeconds;
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeVideo, isPlaying, isCompleted]);

  const handleStartWatch = (vid: VideoItem) => {
    setActiveVideo(vid);
    setElapsedSeconds(0);
    setIsPlaying(true);
    setIsCompleted(false);
    setIsClaiming(false);
  };

  const handleTogglePlay = () => {
    if (!isCompleted) {
      setIsPlaying((prev) => !prev);
    }
  };

  const handleRestart = () => {
    setElapsedSeconds(0);
    setIsPlaying(true);
    setIsCompleted(false);
  };

  const handleClaim = async () => {
    if (!activeVideo || isClaiming) return;
    setIsClaiming(true);
    await onWatchVideo(activeVideo);
    setTimeout(() => {
      setActiveVideo(null);
      setIsClaiming(false);
    }, 600);
  };

  const progressPercent = activeVideo
    ? Math.min(100, Math.round((elapsedSeconds / activeVideo.durationSeconds) * 100))
    : 0;

  return (
    <div className="bg-[#F4F6F1] min-h-screen pb-24 flex flex-col justify-between">
      <div>
        <SubPageHeader title="Videos" onBack={onBack} />

        <div className="p-4 space-y-5 max-w-lg mx-auto w-full">
          {/* HERO BANNER CARD */}
          <div className="bg-[#0F3B3A] text-white rounded-[28px] p-6 text-center space-y-3 shadow-md relative overflow-hidden">
            <div className="w-14 h-14 bg-[#CBF53C] text-[#10282A] rounded-[20px] flex items-center justify-center mx-auto shadow-xs">
              <Play className="w-7 h-7 fill-[#10282A]/20" />
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Watch & Get Rewards</h2>
            <p className="text-xs text-[#BFE9E3] font-medium max-w-xs mx-auto">
              Watch sponsored streams and quick clips to receive immediate rewards.
            </p>
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1 rounded-full text-[11px] font-bold text-[#CBF53C]">
              <span>Instant Crediting</span>
              <span aria-hidden="true">·</span>
              <span>10,000 pts = $10.00</span>
            </div>
          </div>

          {/* AVAILABLE CLIPS LIST */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-extrabold text-[#5E7270] tracking-wider uppercase">
                Available Video Clips
              </h3>
              <span className="text-xs font-bold text-[#0E7C74]">
                {videos.length} videos available
              </span>
            </div>

            <div className="space-y-2.5">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => handleStartWatch(vid)}
                  className="bg-white hover:bg-slate-50 border border-slate-200/60 rounded-[24px] p-4 flex items-center justify-between shadow-2xs cursor-pointer transition-all active:scale-[0.99] group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-[16px] bg-[#BFE9E3] text-[#0F3B3A] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Play className="w-5 h-5 fill-[#0F3B3A]/20" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-extrabold text-[#10282A] leading-tight">
                        {vid.title}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5E7270] mt-1">
                        <Clock className="w-3 h-3 text-[#5E7270]" />
                        <span>{vid.durationText}</span>
                        <span aria-hidden="true">·</span>
                        <span>{vid.points} pts</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-[#E3F6DF] text-[#0B6B3A] text-xs font-extrabold px-3 py-1.5 rounded-full">
                      +{formatCurrency(vid.rewardUsd)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE VIDEO PLAYER MODAL */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-[#10282A]/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl space-y-4 text-center relative max-h-[92vh] overflow-y-auto">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 p-2 bg-[#F4F6F1] text-[#5E7270] hover:text-[#10282A] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* HEADER */}
            <div className="pr-8 text-left">
              <span className="text-[10px] font-bold text-[#0E7C74] uppercase tracking-wider block">
                Sponsored Video Stream
              </span>
              <h3 className="text-lg font-extrabold text-[#10282A]">{activeVideo.title}</h3>
            </div>

            {/* VIDEO PLAYER SCREEN */}
            <div className="bg-[#0F3B3A] rounded-[24px] p-5 text-white space-y-4 shadow-inner relative overflow-hidden">
              {/* VIDEO SIMULATED VIEWPORT */}
              <div className="h-44 sm:h-52 bg-gradient-to-br from-[#0c3130] to-[#164e4d] rounded-[18px] flex flex-col items-center justify-center relative p-4 border border-white/10">
                {/* VIDEO STATUS OVERLAY */}
                {isCompleted ? (
                  <div className="flex flex-col items-center gap-2 animate-in zoom-in duration-300">
                    <div className="w-14 h-14 rounded-full bg-[#CBF53C] text-[#10282A] flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-extrabold text-[#CBF53C]">Stream Completed!</span>
                  </div>
                ) : (
                  <button
                    onClick={handleTogglePlay}
                    className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xs flex items-center justify-center text-white transition-transform active:scale-90 cursor-pointer shadow-md"
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-white ml-1" />}
                  </button>
                )}

                {/* DURATION PILL ON TOP */}
                <div className="absolute top-3 right-3 bg-black/60 px-2.5 py-1 rounded-full text-[11px] font-mono text-white/90">
                  {elapsedSeconds}s / {activeVideo.durationSeconds}s
                </div>

                {/* LIVE PLAYING TICKER */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#CBF53C] animate-ping' : 'bg-white/40'}`} />
                  <span className="text-[11px] font-medium text-white/80">
                    {isPlaying ? 'Streaming Clip...' : isCompleted ? 'Finished' : 'Paused'}
                  </span>
                </div>

                {/* VOLUME ICON */}
                <div className="absolute bottom-3 right-3 text-white/60">
                  <Volume2 className="w-4 h-4" />
                </div>
              </div>

              {/* PROGRESS BAR & CONTROLS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-white/80 font-bold">
                  <span>{progressPercent}% watched</span>
                  <span className="text-[#CBF53C]">+{activeVideo.points} points</span>
                </div>

                <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#CBF53C] rounded-full transition-all duration-300 ease-linear"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* CONTROLS ROW */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart</span>
                </button>

                <button
                  onClick={handleTogglePlay}
                  className="text-xs font-bold text-[#CBF53C] hover:underline cursor-pointer"
                >
                  {isPlaying ? 'Pause' : isCompleted ? 'Watched' : 'Resume'}
                </button>
              </div>
            </div>

            {/* CLAIM OR INSTRUCTION BUTTON */}
            {isCompleted ? (
              <button
                onClick={handleClaim}
                disabled={isClaiming}
                className="w-full bg-[#CBF53C] hover:bg-[#b8e030] text-[#10282A] font-extrabold py-3.5 rounded-full text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-[#10282A]" />
                <span>
                  {isClaiming
                    ? 'Crediting reward...'
                    : `Claim +${formatCurrency(activeVideo.rewardUsd)} (${activeVideo.points} pts)`}
                </span>
              </button>
            ) : (
              <p className="text-[11px] text-[#5E7270] font-medium">
                Please watch the clip until 100% to unlock your reward points.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
