import React, { useState, useEffect, useMemo } from 'react';
import { ChartMetric, RunActivity, TimeGroup, UserProfile } from './types/run';
import { StorageService } from './db/storage';
import { groupActivities } from './utils/calculations';
import { ToastProvider, useToast } from './components/ui/Toast';
import { DashboardView } from './views/DashboardView';
import { RunDetailView } from './views/RunDetailView';
import { AddEditRunView } from './views/AddEditRunView';
import { AllActivityView } from './views/AllActivityView';
import { ManageAccountView } from './views/ManageAccountView';
import { EditProfileView } from './views/EditProfileView';
import { PrivacyPolicyView } from './views/PrivacyPolicyView';
import { TermsConditionsView } from './views/TermsConditionsView';
import { DocumentationView } from './views/DocumentationView';
import { DocumentationDetailView } from './views/DocumentationDetailView';
import { CsvImportModal } from './views/CsvImportModal';
import { PopupDialog } from './components/ui/PopupDialog';
import { DecorativeBackground } from './components/ui/DecorativeBackground';
import { LogOut, AlertTriangle } from 'lucide-react';

function AppContent() {
  const { showToast } = useToast();

  // Primary data state
  const [runs, setRuns] = useState<RunActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Syahrul Miftah',
    email: 'syahrulmiftahfarid@gmail.com',
  });

  // Navigation & views
  const [activeView, setActiveView] = useState<
    | 'dashboard'
    | 'run-detail'
    | 'add-run'
    | 'all-activity'
    | 'manage-account'
    | 'edit-profile'
    | 'privacy-policy'
    | 'terms-conditions'
    | 'documentation'
    | 'doc-detail'
  >('dashboard');

  const [selectedRun, setSelectedRun] = useState<RunActivity | null>(null);
  const [editingRun, setEditingRun] = useState<RunActivity | null>(null);
  const [runDetailSourceView, setRunDetailSourceView] = useState<'dashboard' | 'all-activity'>('dashboard');
  const [docTopicId, setDocTopicId] = useState<string>('strava');

  // Dashboard controls
  const [timeGroup, setTimeGroup] = useState<TimeGroup>('day');
  const [chartMetric, setChartMetric] = useState<ChartMetric>('score');
  const [selectedPeriodKey, setSelectedPeriodKey] = useState<string | null>(null);

  // Modals & popups
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);

  // Load runs and profile on boot
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [loadedRuns, profile] = await Promise.all([
          StorageService.getAllRuns(),
          StorageService.getUserProfile(),
        ]);
        setRuns(loadedRuns);
        setUserProfile(profile);
      } catch (err) {
        console.error('Failed to load data from storage:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Compute aggregated periods whenever runs or timeGroup change
  const periods = useMemo(() => {
    return groupActivities(runs, timeGroup);
  }, [runs, timeGroup]);

  // Time group change
  const handleTimeGroupChange = (tg: TimeGroup) => {
    setTimeGroup(tg);
    setSelectedPeriodKey(null);
  };

  // Run management handlers
  const handleSaveRun = async (savedRun: RunActivity) => {
    const isEditing = Boolean(editingRun);
    await StorageService.saveRun(savedRun);

    setRuns((prev) => {
      const idx = prev.findIndex((r) => r.id === savedRun.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = savedRun;
        return copy;
      }
      return [savedRun, ...prev];
    });

    setSelectedRun(savedRun);
    setActiveView('run-detail');

    showToast({
      type: 'Success',
      title: isEditing ? 'Run Updated' : 'Run Added',
      description: `Saved "${savedRun.title}" (${savedRun.distance.toFixed(2)} km).`,
    });
  };

  const handleDeleteRun = async (id: string) => {
    await StorageService.deleteRun(id);
    setRuns((prev) => prev.filter((r) => r.id !== id));
    setActiveView(runDetailSourceView);
    setSelectedRun(null);
    showToast({
      type: 'Success',
      title: 'Run Deleted',
      description: 'The selected activity has been removed from your history.',
    });
  };

  // CSV Import Success
  const handleImportSuccess = async (
    importedRuns: RunActivity[],
    skippedCount: number,
    noHrCount: number
  ) => {
    await StorageService.saveMultipleRuns(importedRuns);
    setRuns((prev) => [...importedRuns, ...prev]);

    showToast({
      type: 'Success',
      title: 'CSV Import Completed',
      description: `Imported ${importedRuns.length} runs. (${noHrCount} missing HR flagged, ${skippedCount} non-running/overlaps skipped).`,
    });
  };

  // Profile update
  const handleUpdateProfile = async (updated: UserProfile) => {
    setUserProfile(updated);
    await StorageService.updateUserProfile(updated);
    showToast({
      type: 'Success',
      title: 'Profile Updated',
      description: 'Your profile details have been saved.',
    });
  };

  // Logout handler
  const handleLogout = () => {
    setActiveView('dashboard');
    showToast({
      type: 'Success',
      title: 'Logged Out',
      description: 'You will be logged out, you can log in again anytime.',
    });
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    await StorageService.clearAllRuns();
    localStorage.clear();
    setRuns([]);
    const resetProfile = {
      name: 'Syahrul Miftah',
      email: 'syahrulmiftahfarid@gmail.com',
    };
    setUserProfile(resetProfile);
    await StorageService.updateUserProfile(resetProfile);
    setActiveView('dashboard');
    showToast({
      type: 'Success',
      title: 'Account Deleted',
      description: 'Your account and all associated running data have been deleted.',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0C11] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#4963F4] border-t-transparent rounded-full animate-spin" />
          <span className="font-anton text-lg uppercase tracking-wider text-[#E3E4E9]">
            Runtrackr
          </span>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#0D0C11] text-[#E3E4E9] flex flex-col items-center p-4 pb-16 selection:bg-[#4963F4] selection:text-white overflow-x-hidden">
      {/* Global Decorative Background Element (White ellipse, 300x32px, 200px Figma blur glow, -24px top) */}
      <DecorativeBackground />

      <div className="w-full max-w-[375px] flex flex-col">
        {/* View Router */}
        {activeView === 'dashboard' && (
          <DashboardView
            userProfile={userProfile}
            timeGroup={timeGroup}
            onTimeGroupChange={handleTimeGroupChange}
            chartMetric={chartMetric}
            onChartMetricChange={setChartMetric}
            runs={runs}
            periods={periods}
            selectedPeriodKey={selectedPeriodKey}
            onSelectPeriodFromChart={(p) => setSelectedPeriodKey(p ? p.key : null)}
            onSelectRun={(run) => {
              setSelectedRun(run);
              setRunDetailSourceView('dashboard');
              setActiveView('run-detail');
            }}
            onViewAllActivity={() => setActiveView('all-activity')}
            onOpenAddRun={() => {
              setEditingRun(null);
              setActiveView('add-run');
            }}
            onOpenUploadRun={() => setShowUploadModal(true)}
            onOpenSettings={() => setActiveView('manage-account')}
          />
        )}

        {activeView === 'add-run' && (
          <AddEditRunView
            initialRun={editingRun}
            existingRuns={runs}
            onBack={() => {
              if (editingRun && selectedRun) {
                setActiveView('run-detail');
              } else {
                setActiveView(runDetailSourceView);
              }
            }}
            onSave={handleSaveRun}
          />
        )}

        {activeView === 'run-detail' && selectedRun && (
          <RunDetailView
            run={selectedRun}
            onBack={() => setActiveView(runDetailSourceView)}
            onEdit={(run) => {
              setEditingRun(run);
              setActiveView('add-run');
            }}
            onDelete={handleDeleteRun}
          />
        )}

        {activeView === 'all-activity' && (
          <AllActivityView
            runs={runs}
            onBack={() => setActiveView('dashboard')}
            onSelectRun={(run) => {
              setSelectedRun(run);
              setRunDetailSourceView('all-activity');
              setActiveView('run-detail');
            }}
          />
        )}

        {activeView === 'manage-account' && (
          <ManageAccountView
            userProfile={userProfile}
            onBack={() => setActiveView('dashboard')}
            onNavigateToEditProfile={() => setActiveView('edit-profile')}
            onNavigateToPrivacyPolicy={() => setActiveView('privacy-policy')}
            onNavigateToTerms={() => setActiveView('terms-conditions')}
            onNavigateToDocumentation={() => setActiveView('documentation')}
            onPromptLogout={() => setShowLogoutDialog(true)}
            onPromptDeleteAccount={() => setShowDeleteAccountDialog(true)}
          />
        )}

        {activeView === 'edit-profile' && (
          <EditProfileView
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onBack={() => setActiveView('manage-account')}
          />
        )}

        {activeView === 'privacy-policy' && (
          <PrivacyPolicyView
            onBack={() => setActiveView('manage-account')}
          />
        )}

        {activeView === 'terms-conditions' && (
          <TermsConditionsView
            onBack={() => setActiveView('manage-account')}
            onNavigateToPrivacyPolicy={() => setActiveView('privacy-policy')}
          />
        )}

        {activeView === 'documentation' && (
          <DocumentationView
            onBack={() => setActiveView('manage-account')}
            onSelectTopic={(topicId) => {
              setDocTopicId(topicId);
              setActiveView('doc-detail');
            }}
          />
        )}

        {activeView === 'doc-detail' && (
          <DocumentationDetailView
            topicId={docTopicId}
            onBack={() => setActiveView('documentation')}
          />
        )}
      </div>

      {/* CSV Import Modal matching Popup_-_Upload_Activity_059557ef.png */}
      <CsvImportModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onImportSuccess={handleImportSuccess}
        existingRuns={runs}
        onLearnMore={() => {
          setShowUploadModal(false);
          setDocTopicId('strava');
          setActiveView('doc-detail');
        }}
      />

      {/* Logout Confirmation Dialog matching Popup_39199985.png */}
      <PopupDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        icon={<LogOut className="w-8 h-8 text-white stroke-[1.8]" />}
        title="Log out from runtrackr"
        description="You will be logged out, you can log in again anytime"
        primaryActionLabel="Log out"
        primaryActionVariant="Primary"
        onPrimaryAction={handleLogout}
      />

      {/* Delete Account Confirmation Dialog matching Popup-1_c5567ac1.png */}
      <PopupDialog
        isOpen={showDeleteAccountDialog}
        onClose={() => setShowDeleteAccountDialog(false)}
        icon={<AlertTriangle className="w-8 h-8 text-[#BA4949] stroke-[1.8]" />}
        title="Delete Account"
        description="Your account will be deleted, this action cannot be undone"
        primaryActionLabel="Delete"
        primaryActionVariant="Destructive"
        onPrimaryAction={handleDeleteAccount}
      />
    </main>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
