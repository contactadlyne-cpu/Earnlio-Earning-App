import React, { useState, useRef } from 'react';
import { UserProfile } from '../../types';
import { SubPageHeader } from '../SubPageHeader';
import { Camera, Check, Lock, Upload, Image } from 'lucide-react';

interface EditProfileScreenProps {
  user: UserProfile;
  onBack: () => void;
  onSave: (updated: Partial<UserProfile>) => void;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  user,
  onBack,
  onSave,
}) => {
  const [name, setName] = useState(user.name || 'Shoaib Ahmad');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(user.avatarUrl || '');
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      avatarUrl: selectedAvatarUrl,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onBack();
    }, 1200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('File size exceeds 8MB limit. Please choose a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-[#F4F6F1] min-h-screen pb-28 relative">
      <SubPageHeader title="Edit Profile" onBack={onBack} />

      {/* HIDDEN NATIVE FILE INPUT FOR MOBILE PHOTO UPLOAD */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <form onSubmit={handleSubmit} className="p-4 space-y-5 max-w-lg mx-auto">
        {/* AVATAR UPLOADER BLOCK */}
        <div className="flex flex-col items-center pt-2 space-y-2">
          <div className="relative group cursor-pointer" onClick={triggerUpload}>
            <div className="w-24 h-24 rounded-full bg-[#CBF53C] text-[#10282A] font-black text-3xl flex items-center justify-center shadow-md border-4 border-white overflow-hidden transition-transform duration-300 group-hover:scale-105">
              {selectedAvatarUrl ? (
                <img src={selectedAvatarUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                name.charAt(0).toUpperCase() || 'S'
              )}
            </div>

            {/* CAMERA BADGE BUTTON */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerUpload();
              }}
              className="absolute bottom-0 right-0 bg-[#0F3B3A] text-[#CBF53C] p-2 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform cursor-pointer"
              aria-label="Change profile photo"
            >
              <Camera className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <button
            type="button"
            onClick={triggerUpload}
            className="text-xs font-bold text-[#0E7C74] hover:underline cursor-pointer flex items-center gap-1.5 mt-1 bg-[#EBF5E9] px-3.5 py-1.5 rounded-full border border-[#0E7C74]/20 hover:bg-[#E2F0E0] transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload photo from device</span>
          </button>
        </div>

        {/* INPUT FIELDS CARD */}
        <div className="bg-white rounded-[26px] p-5 border border-slate-200/80 space-y-4 shadow-2xs">
          {/* FULL NAME (EDITABLE) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-[#10282A]">Full name</label>
              <span className="text-[10px] font-bold text-[#0E7C74] uppercase tracking-wider">Editable</span>
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full bg-[#F4F6F1] border border-slate-200 rounded-[18px] px-4 py-3 text-sm text-[#10282A] font-extrabold focus:outline-none focus:ring-2 focus:ring-[#0E7C74] shadow-2xs transition-all"
            />
          </div>

          {/* EMAIL (READ-ONLY) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#5E7270] flex items-center gap-1">
                <span>Email address</span>
                <Lock className="w-3 h-3 text-[#5E7270]" />
              </label>
              <span className="text-[10px] font-bold text-[#5E7270] bg-slate-100 px-2 py-0.5 rounded-full">Read-only</span>
            </div>
            <div className="relative">
              <input
                type="email"
                readOnly
                disabled
                value={user.email || 'name@email.com'}
                className="w-full bg-[#EAEFE6]/70 border border-slate-200/80 rounded-[18px] px-4 py-3 text-xs text-[#5E7270] font-semibold cursor-not-allowed select-none"
              />
              <Lock className="w-4 h-4 text-[#5E7270] absolute right-3.5 top-1/2 -translate-y-1/2 opacity-60" />
            </div>
            <span className="text-[10px] font-medium text-[#5E7270] block px-1">
              Email address is verified and linked to your account.
            </span>
          </div>

          {/* COUNTRY (READ-ONLY) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#5E7270] flex items-center gap-1">
              <span>Country</span>
              <Lock className="w-3 h-3 text-[#5E7270]" />
            </label>
            <input
              type="text"
              readOnly
              disabled
              value={user.country || 'Pakistan'}
              className="w-full bg-[#EAEFE6]/70 border border-slate-200/80 rounded-[18px] px-4 py-3 text-xs text-[#5E7270] font-semibold cursor-not-allowed select-none"
            />
          </div>

          {/* LANGUAGE (READ-ONLY) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#5E7270] flex items-center gap-1">
              <span>Language</span>
              <Lock className="w-3 h-3 text-[#5E7270]" />
            </label>
            <input
              type="text"
              readOnly
              disabled
              value={user.language || 'English'}
              className="w-full bg-[#EAEFE6]/70 border border-slate-200/80 rounded-[18px] px-4 py-3 text-xs text-[#5E7270] font-semibold cursor-not-allowed select-none"
            />
          </div>

          {/* CURRENCY (READ-ONLY) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#5E7270] flex items-center gap-1">
              <span>Currency</span>
              <Lock className="w-3 h-3 text-[#5E7270]" />
            </label>
            <input
              type="text"
              readOnly
              disabled
              value={user.currency || 'U.S. Dollar (USD)'}
              className="w-full bg-[#EAEFE6]/70 border border-slate-200/80 rounded-[18px] px-4 py-3 text-xs text-[#5E7270] font-semibold cursor-not-allowed select-none"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        {saved ? (
          <div className="bg-[#E3F6DF] text-[#0B6B3A] border border-[#0B6B3A]/20 py-3.5 rounded-full text-center text-xs font-extrabold flex items-center justify-center gap-2 shadow-2xs">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Profile updated successfully!</span>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full bg-[#CBF53C] hover:bg-[#b8e030] text-[#10282A] font-extrabold py-3.5 rounded-full text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer font-['Outfit',sans-serif]"
          >
            Save profile changes
          </button>
        )}
      </form>
    </div>
  );
};
