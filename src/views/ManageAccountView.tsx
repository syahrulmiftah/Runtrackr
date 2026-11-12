import React from 'react';
import { ArrowLeft, User, Pencil, ShieldCheck, FileText, LogOut } from 'lucide-react';
import { UserProfile } from '../types/run';
import { SettingsButton } from '../components/ui/SettingsButton';

interface ManageAccountViewProps {
  userProfile: UserProfile;
  onBack: () => void;
  onNavigateToEditProfile: () => void;
  onNavigateToPrivacyPolicy: () => void;
  onNavigateToTerms: () => void;
  onNavigateToDocumentation: () => void;
  onPromptLogout: () => void;
  onPromptDeleteAccount: () => void;
}

export const ManageAccountView: React.FC<ManageAccountViewProps> = ({
  userProfile,
  onBack,
  onNavigateToEditProfile,
  onNavigateToPrivacyPolicy,
  onNavigateToTerms,
  onNavigateToDocumentation,
  onPromptLogout,
  onPromptDeleteAccount,
}) => {
  return (
    <div className="w-full flex flex-col gap-6 max-w-md mx-auto pt-2 pb-8">
      {/* Top Header */}
      <div className="w-full flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#27272F] hover:bg-[#3C3C45] border border-[#303037] flex items-center justify-center text-white transition-all cursor-pointer active:scale-95"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-medium text-white font-roboto">
          Manage account
        </h1>
      </div>

      {/* User Profile Card */}
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

        <h2 className="text-lg font-bold text-white font-roboto mt-3.5">
          {userProfile.name}
        </h2>
        <p className="text-sm text-[#87878F] font-roboto mt-0.5">
          {userProfile.email}
        </p>

        <button
          type="button"
          onClick={onNavigateToEditProfile}
          className="inline-flex items-center gap-1.5 bg-[#27272F] hover:bg-[#3C3C45] border border-[#303037] rounded-full px-4 py-2 text-xs font-medium text-white mt-3.5 cursor-pointer transition-colors active:scale-95"
        >
          <span>Edit profile</span>
          <Pencil className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Settings Section */}
      <div className="w-full flex flex-col gap-2.5 mt-2">
        <span className="text-sm font-medium text-[#87878F] font-roboto pl-1">
          Settings
        </span>

        <SettingsButton
          label="Privacy policy"
          leftIcon={<ShieldCheck className="w-5 h-5 text-[#E3E4E9]" />}
          onClick={onNavigateToPrivacyPolicy}
        />

        <SettingsButton
          label="Terms and conditions"
          leftIcon={<FileText className="w-5 h-5 text-[#E3E4E9]" />}
          onClick={onNavigateToTerms}
        />

        <SettingsButton
          label="Documentation"
          leftIcon={<FileText className="w-5 h-5 text-[#E3E4E9]" />}
          onClick={onNavigateToDocumentation}
        />

        <SettingsButton
          label="Logout"
          variant="danger"
          leftIcon={<LogOut className="w-5 h-5 text-[#BA4949]" />}
          onClick={onPromptLogout}
        />
      </div>

      {/* Delete Account Button */}
      <div className="w-full mt-4">
        <button
          type="button"
          onClick={onPromptDeleteAccount}
          className="w-full bg-[#BA4949] hover:bg-[#a63d3d] text-white py-3.5 rounded-full font-medium text-base text-center transition-colors cursor-pointer active:scale-[0.98]"
        >
          Delete account
        </button>
      </div>
    </div>
  );
};
