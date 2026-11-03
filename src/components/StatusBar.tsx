import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const [timeString, setTimeString] = useState<string>('8:46');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      hours = hours % 12 || 12;
      const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
      setTimeString(`${hours}:${minStr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#2f1160] text-white/90 text-xs px-4 pt-2.5 pb-1 flex items-center justify-between select-none">
      <span className="font-semibold tracking-tight text-[13px]">{timeString}</span>
      <div className="flex items-center gap-1.5 opacity-90 text-[11px]">
        <Wifi className="w-3.5 h-3.5" />
        <Signal className="w-3.5 h-3.5" />
        <div className="flex items-center gap-0.5 font-medium">
          <Battery className="w-4 h-4 rotate-90" />
          <span>27%</span>
        </div>
      </div>
    </div>
  );
};
