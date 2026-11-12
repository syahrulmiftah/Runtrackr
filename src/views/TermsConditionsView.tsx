import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface TermsConditionsViewProps {
  onBack: () => void;
  onNavigateToPrivacyPolicy?: () => void;
}

export const TermsConditionsView: React.FC<TermsConditionsViewProps> = ({
  onBack,
  onNavigateToPrivacyPolicy,
}) => {
  return (
    <div className="w-full flex flex-col gap-5 max-w-md mx-auto pt-2 pb-12 font-roboto">
      {/* Top Header with Back button */}
      <div className="w-full flex items-center">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#27272F] hover:bg-[#3C3C45] border border-[#303037] flex items-center justify-center text-white transition-all cursor-pointer active:scale-95"
          aria-label="Back to manage account"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Title & Date */}
      <div className="flex flex-col gap-1 mt-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Terms and Conditions
        </h1>
        <p className="text-xs text-[#87878F]">
          Last updated: November 4, 2026
        </p>
      </div>

      {/* Document Sections */}
      <div className="flex flex-col gap-6 text-sm text-[#87878F] leading-relaxed">
        {/* 1 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            1. Using the app
          </h2>
          <p>
            These terms apply to your use of Runtrackr, operated by Syahrul Miftah. By signing in with Google, you agree to these terms. You must be at least 16 years old and use your own account.
          </p>
        </div>

        {/* 2 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            2. Purpose and health disclaimer
          </h2>
          <p>
            Runtrackr tracks your runs, calculates scores, and displays performance trends for personal reference. It is not a medical device and does not provide medical or training advice. Scores are estimates, not scientific proof of fitness.
          </p>
        </div>

        {/* 3 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            3. Your data and privacy
          </h2>
          <p>
            We collect your Google profile information and running data to provide the app's features. We don't sell your data or use it for advertising.
          </p>
          <p>
            We use Supabase for data storage, Vercel for hosting, and Google for sign-in. Your data may be stored outside your country.
          </p>
          <p>
            You can edit or delete individual runs in the app. You can also delete your account and associated data through the account settings.
          </p>
          <p>
            See our{' '}
            {onNavigateToPrivacyPolicy ? (
              <button
                type="button"
                onClick={onNavigateToPrivacyPolicy}
                className="text-[#4963F4] hover:underline underline-offset-2 cursor-pointer font-medium"
              >
                [Privacy Policy]
              </button>
            ) : (
              <span className="text-[#4963F4] font-medium">[Privacy Policy]</span>
            )}{' '}
            for more details.
          </p>
        </div>

        {/* 4 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            4. Strava imports
          </h2>
          <p>
            Only import data that belongs to you. Runtrackr is not affiliated with or endorsed by Strava. Imports may fail or skip some activities, so check your data afterward.
          </p>
        </div>

        {/* 5 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            5. Scores and accuracy
          </h2>
          <p>
            Scores depend on your pace and heart rate and may be affected by inaccurate readings, intervals, hills, or distance differences. We may change the formula, which can affect past scores. We don't guarantee that scores or charts will always be accurate.
          </p>
        </div>

        {/* 6 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            6. Acceptable use
          </h2>
          <p>
            You must not access other users' data, upload malicious files, abuse the service, reverse engineer or resell the app, or use it unlawfully.
          </p>
        </div>

        {/* 7 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            7. Availability and ownership
          </h2>
          <p>
            Runtrackr is provided free of charge, as available. We may change, suspend, or discontinue it at any time. Keep your own backup of your running data, as data export may not be available.
          </p>
          <p>
            The app's design, code, and content belong to Syahrul Miftah. Your running data remains yours. You allow us to store and process it to provide the service.
          </p>
        </div>

        {/* 8 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            8. Liability
          </h2>
          <p>
            The app is provided without warranties to the extent permitted by law. We aren't responsible for inaccurate scores, lost data, or other losses resulting from use of the app, except where liability cannot legally be excluded.
          </p>
        </div>

        {/* 9 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            9. Account suspension
          </h2>
          <p>
            You can stop using Runtrackr at any time. We may suspend or terminate access if you violate these terms or threaten the service's security.
          </p>
        </div>

        {/* 10 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            10. Changes and governing law
          </h2>
          <p>
            We may update these terms and revise the date above. Continued use after changes means you accept the updated terms, where legally permitted.
          </p>
          <p>
            These terms are governed by the laws of Indonesia. Disputes will be handled by the courts of Jakarta, Indonesia, subject to applicable law.
          </p>
        </div>

        {/* 11 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            11. Contact
          </h2>
          <p>
            For questions or data requests, contact Syahrul Miftah through the app.
          </p>
        </div>
      </div>
    </div>
  );
};
