import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info' | 'error';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (message && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#10282A] text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-[#CBF53C]/30 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none">
      {type === 'error' ? (
        <AlertCircle className="w-4 h-4 text-[#B3261E]" />
      ) : (
        <CheckCircle2 className="w-4 h-4 text-[#CBF53C]" />
      )}
      <span>{message}</span>
    </div>
  );
};
