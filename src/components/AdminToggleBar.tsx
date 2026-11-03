import React, { useState } from 'react';
import { Sliders, RefreshCw, PlusCircle, X, Wrench } from 'lucide-react';

interface AdminToggleBarProps {
  onAddTestBalance: () => void;
  onResetUser: () => void;
}

export const AdminToggleBar: React.FC<AdminToggleBarProps> = ({
  onAddTestBalance,
  onResetUser,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-22 right-3 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#0F3B3A] text-[#CBF53C] hover:bg-[#154e4d] p-2.5 rounded-full shadow-lg border border-white/20 transition-transform active:scale-90 flex items-center justify-center cursor-pointer"
          title="Demo Balance & Controls"
          aria-label="Open Demo Controls"
        >
          <Wrench className="w-4 h-4" />
        </button>
      ) : (
        <div className="bg-[#0F3B3A] text-white text-xs p-3 rounded-2xl shadow-2xl border border-white/20 flex flex-col gap-2.5 w-52 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-1 border-b border-white/10">
            <div className="flex items-center gap-1.5 font-bold text-[#CBF53C] text-[11px]">
              <Sliders className="w-3.5 h-3.5" />
              <span>Demo Controls</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white p-0.5 rounded-md cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
            <button
              onClick={() => {
                onAddTestBalance();
              }}
              className="bg-[#CBF53C] hover:bg-[#b8e030] text-[#10282A] px-3 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+$1.00 Test Balance</span>
            </button>

            <button
              onClick={() => {
                onResetUser();
              }}
              className="bg-white/10 hover:bg-white/15 text-white/90 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

