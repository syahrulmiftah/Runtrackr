import React, { useState } from 'react';
import { UserProfile } from '../types/run';
import { Button } from '../components/ui/Button';
import { PopupDialog } from '../components/ui/PopupDialog';
import {
  X,
  User,
  HelpCircle,
  FileText,
  RotateCcw,
  Download,
  Trash2,
  ShieldCheck,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onResetEmpty: () => void;
  onReseedData: () => void;
  onExportJson: () => void;
  onDeleteAccount: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onResetEmpty,
  onReseedData,
  onExportJson,
  onDeleteAccount,
}) => {
  const [activeTab, setActiveTab] = useState<'account' | 'guides' | 'legal'>('account');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ ...profile, name, email });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#19191F] border border-[#303037] rounded-xl p-5 flex flex-col gap-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#303037] pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#E3E4E9] font-roboto">
              Account & Settings
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#87878F] hover:text-[#E3E4E9] p-1 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-[#27272F] p-1 rounded-full border border-[#303037]">
          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`flex-1 py-1.5 text-xs font-roboto rounded-full transition-all cursor-pointer ${
              activeTab === 'account'
                ? 'bg-[#4963F4] text-[#E3E4E9] font-medium'
                : 'text-[#87878F] hover:text-[#E3E4E9]'
            }`}
          >
            Account & Data
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guides')}
            className={`flex-1 py-1.5 text-xs font-roboto rounded-full transition-all cursor-pointer ${
              activeTab === 'guides'
                ? 'bg-[#4963F4] text-[#E3E4E9] font-medium'
                : 'text-[#87878F] hover:text-[#E3E4E9]'
            }`}
          >
            Guides
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('legal')}
            className={`flex-1 py-1.5 text-xs font-roboto rounded-full transition-all cursor-pointer ${
              activeTab === 'legal'
                ? 'bg-[#4963F4] text-[#E3E4E9] font-medium'
                : 'text-[#87878F] hover:text-[#E3E4E9]'
            }`}
          >
            Legal
          </button>
        </div>

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="flex flex-col gap-4">
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 bg-[#27272F] rounded-xl border border-[#303037]">
                <div className="w-12 h-12 rounded-full bg-[#3C3C45] border border-[#303037] flex items-center justify-center font-anton text-lg text-[#E3E4E9]">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-bold text-[#E3E4E9] font-roboto truncate">
                    {name}
                  </span>
                  <span className="text-xs text-[#87878F] font-roboto truncate">
                    {email}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#87878F]">Runner Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#27272F] border border-[#303037] rounded-lg px-3 py-2 text-sm text-[#E3E4E9] focus:outline-none focus:border-[#4963F4]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#87878F]">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#27272F] border border-[#303037] rounded-lg px-3 py-2 text-sm text-[#E3E4E9] focus:outline-none focus:border-[#4963F4]"
                />
              </div>

              <Button
                type="submit"
                variant="Secondary"
                size="sm"
                label={isSaved ? 'Changes Saved!' : 'Update Profile'}
                leftIcon={isSaved ? <CheckCircle className="w-3.5 h-3.5 text-[#4AC189]" /> : undefined}
              />
            </form>

            <div className="border-t border-[#303037] pt-3 flex flex-col gap-2">
              <span className="text-xs font-bold text-[#87878F] uppercase tracking-wider">
                Data Management
              </span>

              <button
                type="button"
                onClick={onExportJson}
                className="w-full bg-[#27272F] hover:bg-[#3C3C45] border border-[#303037] rounded-lg px-3 py-2.5 flex items-center justify-between text-xs text-[#E3E4E9] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#4963F4]" />
                  <span>Export All Runs as JSON</span>
                </div>
                <span className="text-[11px] text-[#87878F]">Backup</span>
              </button>

              <button
                type="button"
                onClick={onReseedData}
                className="w-full bg-[#27272F] hover:bg-[#3C3C45] border border-[#303037] rounded-lg px-3 py-2.5 flex items-center justify-between text-xs text-[#E3E4E9] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D7960A]" />
                  <span>Re-seed 177 Real Strava Activities</span>
                </div>
                <span className="text-[11px] text-[#87878F]">Base Data</span>
              </button>

              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="w-full bg-[#27272F] hover:bg-[#BA4949]/20 border border-[#303037] rounded-lg px-3 py-2.5 flex items-center justify-between text-xs text-[#BA4949] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset to Empty State</span>
                </div>
                <span className="text-[11px] text-[#87878F]">Clear all</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-[#BA4949]/15 hover:bg-[#BA4949]/25 border border-[#BA4949]/40 rounded-lg px-3 py-2.5 flex items-center justify-between text-xs text-[#BA4949] transition-colors cursor-pointer mt-1"
              >
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  <span>Permanently Delete Account & Data</span>
                </div>
                <span className="text-[11px] text-[#BA4949]">Irreversible</span>
              </button>
            </div>
          </div>
        )}

        {/* Guides Tab */}
        {activeTab === 'guides' && (
          <div className="flex flex-col gap-3 text-xs font-roboto text-[#87878F]">
            <div className="bg-[#27272F] p-3 rounded-xl border border-[#303037] flex flex-col gap-1.5">
              <span className="font-bold text-sm text-[#E3E4E9]">
                How the Score Works
              </span>
              <p className="leading-5">
                The score calculates your running speed in meters per minute divided by your average heart rate:
              </p>
              <div className="bg-[#19191F] p-2.5 rounded-lg border border-[#303037] font-mono text-[11px] text-[#4963F4]">
                Score = (Distance (m) × 6000) / (Moving Time (s) × Avg HR)
              </div>
              <p className="leading-5">
                A higher score indicates greater running efficiency—covering more ground per heartbeat. Typical runner scores range from 80 to 150.
              </p>
            </div>

            <div className="bg-[#27272F] p-3 rounded-xl border border-[#303037] flex flex-col gap-1.5">
              <span className="font-bold text-sm text-[#E3E4E9]">
                How to Import Strava Runs
              </span>
              <p className="leading-5">
                1. Go to strava.com and request your bulk account archive under Settings → My Account → Download or Delete Your Account.
              </p>
              <p className="leading-5">
                2. Unzip the file and find <code className="text-[#E3E4E9]">activities.csv</code>.
              </p>
              <p className="leading-5">
                3. Click "Upload Run" in Runtrackr. Only runs will be imported; rides and non-running activities are automatically filtered out.
              </p>
            </div>
          </div>
        )}

        {/* Legal Tab */}
        {activeTab === 'legal' && (
          <div className="flex flex-col gap-3 text-xs font-roboto text-[#87878F]">
            <div className="bg-[#27272F] p-3 rounded-xl border border-[#303037] flex flex-col gap-1.5">
              <span className="font-bold text-sm text-[#E3E4E9]">
                Privacy Policy
              </span>
              <p className="leading-5">
                Runtrackr stores running activity data directly in your browser's local IndexedDB. Your activities, heart rate records, and notes are private to your device. Uploaded CSV files are processed in-memory and never permanently stored on external servers.
              </p>
            </div>

            <div className="bg-[#27272F] p-3 rounded-xl border border-[#303037] flex flex-col gap-1.5">
              <span className="font-bold text-sm text-[#E3E4E9]">
                Terms & Conditions
              </span>
              <p className="leading-5">
                Runtrackr is an analytical tool for recreational fitness tracking. The performance score is a mathematical index and should not be used as medical advice or clinical diagnostic data.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Reset to Empty confirmation */}
      <PopupDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Reset to Empty State"
        description="Are you sure you want to clear all activities? The app will return to the zero-state dashboard."
        primaryActionLabel="Clear All"
        primaryActionVariant="Destructive"
        onPrimaryAction={() => {
          onResetEmpty();
          onClose();
        }}
        secondaryActionLabel="Cancel"
      />

      {/* Delete Account confirmation */}
      <PopupDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Account"
        description="This will permanently wipe your profile, running history, and offline storage from this device."
        primaryActionLabel="Delete Forever"
        primaryActionVariant="Destructive"
        onPrimaryAction={() => {
          onDeleteAccount();
          onClose();
        }}
        secondaryActionLabel="Cancel"
      />
    </div>
  );
};
