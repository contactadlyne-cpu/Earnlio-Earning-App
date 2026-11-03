import React, { useState, useEffect } from 'react';
import { EbookItem } from '../../types';
import { SubPageHeader } from '../SubPageHeader';
import { BookOpen, ArrowLeft, CheckCircle2, Sparkles, ChevronRight, Bookmark, Type, Clock } from 'lucide-react';

interface EbooksScreenProps {
  ebooks: EbookItem[];
  onBack: () => void;
  onReadMinute?: (book: EbookItem) => Promise<void>;
  onFinishEbook?: (book: EbookItem) => Promise<void>;
}

export const EbooksScreen: React.FC<EbooksScreenProps> = ({
  ebooks,
  onBack,
  onReadMinute,
  onFinishEbook,
}) => {
  const [readingBook, setReadingBook] = useState<EbookItem | null>(null);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [readingSeconds, setReadingSeconds] = useState(0);
  const [readMinutesCount, setReadMinutesCount] = useState(0);
  const [justCredited, setJustCredited] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  // Live timer adding points for every 60 seconds read
  useEffect(() => {
    let interval: any;
    if (readingBook) {
      interval = setInterval(() => {
        setReadingSeconds((prev) => {
          if (prev + 1 >= 60) {
            // Full 60 seconds reached!
            if (onReadMinute) onReadMinute(readingBook);
            if (onFinishEbook) onFinishEbook(readingBook);
            setReadMinutesCount((c) => c + 1);
            setJustCredited(true);
            setTimeout(() => setJustCredited(false), 3000);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [readingBook, onReadMinute, onFinishEbook]);

  const handleOpenBook = (book: EbookItem) => {
    setReadingBook(book);
    setCurrentChapterIdx(0);
    setReadingSeconds(0);
    setReadMinutesCount(0);
    setJustCredited(false);
  };

  const currentContent = readingBook?.content[currentChapterIdx] || readingBook?.content[0] || '';

  return (
    <div className="bg-[#F4F6F1] min-h-screen pb-24 flex flex-col justify-between">
      <div>
        <SubPageHeader title="eBooks" onBack={onBack} />

        <div className="p-4 space-y-5 max-w-lg mx-auto w-full">
          {/* HERO BANNER */}
          <div className="bg-[#0F3B3A] text-white rounded-[28px] p-6 text-center space-y-3 shadow-md">
            <div className="w-14 h-14 bg-[#CBF53C] text-[#10282A] rounded-[20px] flex items-center justify-center mx-auto shadow-xs">
              <BookOpen className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Read & Receive Rewards Every Minute</h2>
            <p className="text-xs text-[#BFE9E3] font-medium max-w-xs mx-auto">
              Enjoy fiction, finance, and self-growth books. Points credit continuously for every minute you read.
            </p>
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1 rounded-full text-[11px] font-bold text-[#CBF53C]">
              <span>Continuous Rewards</span>
              <span aria-hidden="true">·</span>
              <span>1 min = +$0.015</span>
            </div>
          </div>

          {/* EBOOK SHELF */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-extrabold text-[#5E7270] tracking-wider uppercase">
                Library Shelf
              </h3>
              <span className="text-xs font-bold text-[#0E7C74]">
                {ebooks.length} titles
              </span>
            </div>

            <div className="space-y-3">
              {ebooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleOpenBook(book)}
                  className="bg-white hover:bg-slate-50 border border-slate-200/60 rounded-[24px] p-4 flex items-center gap-4 shadow-2xs cursor-pointer transition-all active:scale-[0.99] group"
                >
                  {/* COVER THUMBNAIL */}
                  <div
                    className="w-16 h-20 rounded-[16px] shrink-0 border border-black/5 flex flex-col justify-between p-2.5 shadow-2xs group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: book.tintColor || '#BFE9E3' }}
                  >
                    <Bookmark className="w-4 h-4 text-[#10282A]/70" />
                    <span className="text-[10px] font-black text-[#10282A] line-clamp-2 leading-tight">
                      {book.title}
                    </span>
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#0E7C74] uppercase tracking-wider">
                        {book.genre}
                      </span>
                      <span className="text-[11px] font-medium text-[#5E7270]">
                        {book.timeLeftText}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-[#10282A] leading-snug">
                      {book.title}
                    </h3>

                    {/* PROGRESS BAR */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-[#5E7270]">
                        <span>Progress</span>
                        <span>{book.progressPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#F4F6F1] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0E7C74] rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(4, book.progressPercent)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-[#5E7270] shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FULL-SCREEN EBOOK READER VIEW */}
      {readingBook && (
        <div className="fixed inset-0 z-50 bg-[#F4F6F1] flex flex-col justify-between overflow-hidden animate-in fade-in duration-200">
          {/* READER TOP BAR */}
          <div className="bg-white border-b border-slate-200/80 px-4 py-3 flex items-center justify-between shadow-xs shrink-0">
            <button
              onClick={() => setReadingBook(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#0E7C74] hover:text-[#0F3B3A] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <span className="text-xs font-extrabold text-[#10282A] truncate max-w-[180px]">
              {readingBook.title}
            </span>

            {/* FONT SIZE CONTROLLER */}
            <div className="flex items-center gap-1 bg-[#F4F6F1] p-1 rounded-full border border-slate-200/80">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  fontSize === 'sm' ? 'bg-[#0F3B3A] text-white' : 'text-[#5E7270]'
                }`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  fontSize === 'base' ? 'bg-[#0F3B3A] text-white' : 'text-[#5E7270]'
                }`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  fontSize === 'lg' ? 'bg-[#0F3B3A] text-white' : 'text-[#5E7270]'
                }`}
              >
                A+
              </button>
            </div>
          </div>

          {/* READING PROGRESS & EARNING HUD */}
          <div className="bg-[#0F3B3A] text-white px-4 py-2.5 shadow-sm shrink-0">
            <div className="max-w-lg mx-auto w-full flex items-center justify-between text-xs font-bold mb-1.5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#CBF53C]" />
                <span>Next reward in: {60 - readingSeconds}s</span>
              </div>
              <span className="text-[#CBF53C] bg-white/10 px-2.5 py-0.5 rounded-full">
                {readMinutesCount} min credited (+${(readMinutesCount * 0.015).toFixed(3)})
              </span>
            </div>

            <div className="max-w-lg mx-auto w-full w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#CBF53C] transition-all duration-300 ease-linear rounded-full"
                style={{ width: `${(readingSeconds / 60) * 100}%` }}
              />
            </div>
          </div>

          {/* CELEBRATORY NOTIFICATION BANNER */}
          {justCredited && (
            <div className="bg-[#E3F6DF] border-b border-[#0B6B3A]/20 px-4 py-2 text-center text-xs font-black text-[#0B6B3A] flex items-center justify-center gap-2 animate-bounce shrink-0">
              <CheckCircle2 className="w-4 h-4" />
              <span>+1 Minute Milestone Reached! +$0.015 (15 pts) credited to your balance!</span>
            </div>
          )}

          {/* CHAPTER BODY */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-lg mx-auto w-full space-y-4">
            {/* CHAPTER TABS */}
            {readingBook.content.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {readingBook.content.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentChapterIdx(idx)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                      currentChapterIdx === idx
                        ? 'bg-[#0F3B3A] text-white shadow-xs'
                        : 'bg-white text-[#5E7270] hover:text-[#10282A] border border-slate-200/60'
                    }`}
                  >
                    Chapter {idx + 1}
                  </button>
                ))}
              </div>
            )}

            {/* BOOK READING CONTAINER */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-200/60 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[11px] font-bold text-[#5E7270] uppercase tracking-wider block">
                  {readingBook.genre}
                </span>
                <h1 className="text-xl font-black text-[#10282A]">{readingBook.title}</h1>
              </div>

              <div
                className={`text-[#10282A] leading-relaxed font-serif whitespace-pre-line space-y-3 ${
                  fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base' : 'text-sm'
                }`}
              >
                {currentContent}
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-[#5E7270]">
                <span>Reading session active</span>
                <span className="font-bold text-[#0B6B3A]">+15 pts every 60s</span>
              </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="bg-white border-t border-slate-200/80 p-4 shadow-lg shrink-0 max-w-lg mx-auto w-full flex items-center justify-between">
            <span className="text-xs text-[#5E7270] font-medium">
              Keep this screen open to accumulate rewards.
            </span>
            <button
              onClick={() => setReadingBook(null)}
              className="bg-[#0F3B3A] text-white font-extrabold text-xs px-5 py-2.5 rounded-full cursor-pointer hover:bg-[#0c3130] transition-colors"
            >
              Done Reading
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
