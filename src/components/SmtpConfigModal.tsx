import React, { useState, useEffect } from 'react';
import { X, Server, Mail, Lock, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../api';

interface SmtpConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const SmtpConfigModal: React.FC<SmtpConfigModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [smtpHost, setSmtpHost] = useState('smtp.hostinger.com');
  const [smtpPort, setSmtpPort] = useState('465');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpFrom, setSmtpFrom] = useState('');
  const [smtpSecure, setSmtpSecure] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkStatus();
    }
  }, [isOpen]);

  const checkStatus = async () => {
    setIsLoading(true);
    const status = await api.getSmtpStatus();
    setIsLoading(false);

    if (status.isConfigured) {
      setIsConfigured(true);
      if (status.smtpHost) setSmtpHost(status.smtpHost);
      if (status.smtpPort) setSmtpPort(status.smtpPort);
      if (status.smtpUser) setSmtpUser(status.smtpUser);
      if (status.smtpFrom) setSmtpFrom(status.smtpFrom);
    }
  };

  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg('');
    setIsError(false);

    if (!smtpHost.trim() || !smtpUser.trim() || !smtpPass.trim()) {
      setStatusMsg('Please fill in SMTP Host, Username/Email, and Password.');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    const res = await api.configureSmtp({
      smtpHost: smtpHost.trim(),
      smtpPort: smtpPort.trim(),
      smtpUser: smtpUser.trim(),
      smtpPass: smtpPass.trim(),
      smtpFrom: smtpFrom.trim() || `"Earnlio Rewards" <${smtpUser.trim()}>`,
      smtpSecure,
    });
    setIsLoading(false);

    if (res.success) {
      setIsConfigured(true);
      setStatusMsg('✅ ' + res.message);
      setIsError(false);
      onShowToast('SMTP Server successfully configured! Live emails active.');
    } else {
      setStatusMsg('❌ ' + res.message);
      setIsError(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-[28px] max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#5E7270] hover:text-[#10282A] rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0F3B3A] text-[#CBF53C] flex items-center justify-center shadow-xs">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#10282A] font-['Outfit',sans-serif]">
              SMTP Email Setup
            </h3>
            <span className="text-xs text-[#5E7270] font-medium">
              Hostinger / Custom SMTP Credentials
            </span>
          </div>
        </div>

        {/* STATUS BANNER */}
        {isConfigured && !statusMsg && (
          <div className="bg-[#E3F6DF] text-[#0B6B3A] p-3.5 rounded-[18px] text-xs font-extrabold flex items-center gap-2 border border-[#0B6B3A]/20">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>SMTP Server is currently ACTIVE and verified.</span>
          </div>
        )}

        {statusMsg && (
          <div
            className={`p-3.5 rounded-[18px] text-xs font-bold flex items-center gap-2 border ${
              isError
                ? 'bg-[#FCE8E6] text-[#B3261E] border-[#B3261E]/20'
                : 'bg-[#E3F6DF] text-[#0B6B3A] border-[#0B6B3A]/20'
            }`}
          >
            {isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span className="leading-relaxed">{statusMsg}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSaveAndTest} className="space-y-3.5">
          {/* HOST & PORT */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-extrabold text-[#10282A]">SMTP Host</label>
              <input
                type="text"
                required
                placeholder="smtp.hostinger.com"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                className="w-full bg-[#F4F6F1] border border-slate-200 rounded-[14px] px-3.5 py-2.5 text-xs font-bold text-[#10282A] focus:outline-none focus:ring-2 focus:ring-[#0E7C74]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-extrabold text-[#10282A]">Port</label>
              <input
                type="text"
                required
                placeholder="465"
                value={smtpPort}
                onChange={(e) => setSmtpPort(e.target.value)}
                className="w-full bg-[#F4F6F1] border border-slate-200 rounded-[14px] px-3.5 py-2.5 text-xs font-bold text-[#10282A] focus:outline-none focus:ring-2 focus:ring-[#0E7C74]"
              />
            </div>
          </div>

          {/* USERNAME / EMAIL */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-[#10282A]">SMTP Email / Username</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="info@yourdomain.com"
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
                className="w-full bg-[#F4F6F1] border border-slate-200 rounded-[14px] px-3.5 py-2.5 pl-10 text-xs font-bold text-[#10282A] focus:outline-none focus:ring-2 focus:ring-[#0E7C74]"
              />
              <Mail className="w-4 h-4 text-[#5E7270] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-[#10282A]">SMTP Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Email Account Password"
                value={smtpPass}
                onChange={(e) => setSmtpPass(e.target.value)}
                className="w-full bg-[#F4F6F1] border border-slate-200 rounded-[14px] px-3.5 py-2.5 pl-10 text-xs font-bold text-[#10282A] focus:outline-none focus:ring-2 focus:ring-[#0E7C74]"
              />
              <Lock className="w-4 h-4 text-[#5E7270] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* SENDER DISPLAY NAME */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-[#10282A]">From Header (Optional)</label>
            <input
              type="text"
              placeholder='"Earnlio Rewards" <info@yourdomain.com>'
              value={smtpFrom}
              onChange={(e) => setSmtpFrom(e.target.value)}
              className="w-full bg-[#F4F6F1] border border-slate-200 rounded-[14px] px-3.5 py-2.5 text-xs font-bold text-[#10282A] focus:outline-none focus:ring-2 focus:ring-[#0E7C74]"
            />
          </div>

          {/* SECURE TOGGLE */}
          <label className="flex items-center gap-2 text-xs font-bold text-[#5E7270] cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={smtpSecure}
              onChange={(e) => setSmtpSecure(e.target.checked)}
              className="w-4 h-4 rounded accent-[#0E7C74]"
            />
            <span>Use SSL / Secure Connection (Port 465)</span>
          </label>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0F3B3A] hover:bg-[#10282A] text-[#CBF53C] font-extrabold py-3.5 px-5 rounded-full text-xs transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2 font-['Outfit',sans-serif] mt-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying SMTP Connection...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Save & Test SMTP Connection</span>
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-[#5E7270] text-center font-medium leading-relaxed pt-1">
          Common settings for Hostinger: Host: <code className="font-bold text-[#10282A]">smtp.hostinger.com</code>, Port: <code className="font-bold text-[#10282A]">465</code>.
        </p>
      </div>
    </div>
  );
};
