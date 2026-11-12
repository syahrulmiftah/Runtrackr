import React, { useRef } from 'react';
import { ArrowLeft, User, Upload, Info } from 'lucide-react';
import { UserProfile } from '../types/run';

interface EditProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onBack: () => void;
}

export const EditProfileView: React.FC<EditProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
  onBack,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateProfile({
            ...userProfile,
            avatarUrl: reader.result,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-md mx-auto pt-2 pb-8">
      {/* Top Header */}
      <div className="w-full flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#27272F] hover:bg-[#3C3C45] border border-[#303037] flex items-center justify-center text-white transition-all cursor-pointer active:scale-95"
          aria-label="Back to manage account"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-medium text-white font-roboto">
          Edit profile
        </h1>
      </div>

      {/* Avatar & Upload Photo button */}
      <div className="w-full flex flex-col items-center text-center mt-2">
        <div className="w-20 h-20 rounded-full bg-[#27272F] border border-[#303037] flex items-center justify-center overflow-hidden shadow-inner">
          {userProfile.avatarUrl ? (
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <User className="w-10 h-10 text-white" />
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={handlePhotoClick}
          className="inline-flex items-center gap-1.5 bg-[#27272F] hover:bg-[#3C3C45] border border-[#303037] rounded-full px-4 py-2 text-xs font-medium text-white mt-3.5 cursor-pointer transition-colors active:scale-95"
        >
          <span>Upload photo</span>
          <Upload className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Form Fields: Read-only username & google email */}
      <div className="w-full flex flex-col gap-4 mt-2">
        {/* Username */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#87878F] font-roboto">
            Username
          </label>
          <div className="w-full bg-[#27272F] border border-[#303037] rounded-xl px-4 py-3.5 text-sm text-[#E3E4E9] font-roboto cursor-not-allowed select-none opacity-90">
            {userProfile.name}
          </div>
        </div>

        {/* Google Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#87878F] font-roboto">
            Google email
          </label>
          <div className="w-full bg-[#27272F] border border-[#303037] rounded-xl px-4 py-3.5 text-sm text-[#87878F] font-roboto cursor-not-allowed select-none">
            {userProfile.email}
          </div>

          {/* Info Notice Banner */}
          <div className="w-full bg-[#161B30] border border-[#232F6E] text-[#4963F4] rounded-xl p-3.5 flex items-center gap-2.5 text-xs font-medium mt-1">
            <Info className="w-4 h-4 text-[#4963F4] flex-shrink-0" />
            <span>You cant change google email for now</span>
          </div>
        </div>
      </div>
    </div>
  );
};
