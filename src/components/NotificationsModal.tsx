import React from 'react';
import { NotificationItem } from '../types';
import { X, Bell, CheckCheck, CheckCircle2, Circle } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onMarkSingleAsRead?: (id: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  notifications,
  onClose,
  onMarkAllAsRead,
  onMarkSingleAsRead,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-t-[28px] sm:rounded-[28px] p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto relative">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 pr-2">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#0F3B3A]" />
            <h3 className="text-base font-extrabold text-[#10282A]">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-[#0E7C74] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#5E7270] hover:text-[#10282A] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ACTION BAR */}
        <div className="flex justify-between items-center px-1">
          <span className="text-[11px] font-extrabold text-[#5E7270] uppercase tracking-wider">
            All Alerts ({notifications.length})
          </span>
          <button
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0}
            className={`text-xs font-extrabold flex items-center gap-1 px-3 py-1 rounded-full border transition-all cursor-pointer ${
              unreadCount > 0
                ? 'bg-[#0F3B3A] text-[#CBF53C] border-[#0F3B3A] shadow-2xs hover:bg-[#0c3130]'
                : 'bg-slate-100 text-slate-400 border-slate-200 cursor-default opacity-60'
            }`}
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="space-y-2.5">
          {notifications.length === 0 ? (
            <p className="text-xs text-[#5E7270] text-center py-6">No notifications</p>
          ) : (
            notifications.map((notif) => {
              const isUnread = !notif.read;
              return (
                <div
                  key={notif.id}
                  onClick={() => onMarkSingleAsRead && onMarkSingleAsRead(notif.id)}
                  className={`p-3.5 rounded-[20px] text-left transition-all cursor-pointer relative group ${
                    isUnread
                      ? 'bg-white border-2 border-[#0E7C74]/60 shadow-2xs hover:border-[#0E7C74]'
                      : 'bg-[#F8F9F6] border border-slate-200/50 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {isUnread ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0E7C74] shrink-0 animate-pulse" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      )}
                      <span
                        className={`text-xs truncate ${
                          isUnread
                            ? 'font-black text-[#10282A]'
                            : 'font-medium text-slate-400'
                        }`}
                      >
                        {notif.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] ${
                          isUnread ? 'font-bold text-[#0E7C74]' : 'font-normal text-slate-400'
                        }`}
                      >
                        {notif.timestamp}
                      </span>

                      {isUnread && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkSingleAsRead && onMarkSingleAsRead(notif.id);
                          }}
                          className="text-[10px] font-extrabold bg-[#BFE9E3]/60 text-[#0F3B3A] hover:bg-[#0F3B3A] hover:text-white px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>

                  <p
                    className={`text-[11px] leading-snug pl-4 ${
                      isUnread
                        ? 'font-bold text-[#10282A]'
                        : 'font-normal text-slate-400'
                    }`}
                  >
                    {notif.message}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
