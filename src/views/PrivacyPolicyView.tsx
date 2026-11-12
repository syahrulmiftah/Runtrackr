import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyViewProps {
  onBack: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onBack }) => {
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
          Privacy Policy
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
            1. Who we are
          </h2>
          <p>
            Runtrackr is operated by Syahrul Miftah. This policy explains how we collect, use, and protect your personal information.
          </p>
          <p>
            For questions or privacy requests, contact{' '}
            <span className="text-[#E3E4E9] underline underline-offset-2">
              syahrulmiftahfarid@gmail.com
            </span>.
          </p>
        </div>

        {/* 2 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            2. What we collect
          </h2>
          <p>When you use Runtrackr, we collect:</p>
          <ul className="list-disc list-outside pl-4 space-y-1 text-[#87878F]">
            <li>
              <strong className="text-[#E3E4E9] font-medium">Google account information:</strong> Name, email, profile picture, and unique account ID.
            </li>
            <li>
              <strong className="text-[#E3E4E9] font-medium">Running data:</strong> Activity title, description, location, date, time, distance, duration, pace, heart rate, elevation, and cadence.
            </li>
            <li>
              <strong className="text-[#E3E4E9] font-medium">Technical information:</strong> Sign-in sessions and basic information such as IP address, browser, and device details recorded by our service providers.
            </li>
          </ul>
          <p className="mt-1">
            We don't have access to your Google password. Uploaded Strava CSV files are deleted after import.
          </p>
        </div>

        {/* 3 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            3. How we use your data
          </h2>
          <p>We use your information to:</p>
          <ul className="list-disc list-outside pl-4 space-y-1">
            <li>Sign you in and manage your account.</li>
            <li>Store your runs and calculate scores.</li>
            <li>Display performance charts and statistics.</li>
            <li>Maintain security and fix technical issues.</li>
            <li>Respond to your questions and requests.</li>
          </ul>
          <p className="mt-1">
            We don't sell your data or use it for advertising. We don't currently use analytics tools.
          </p>
        </div>

        {/* 4 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            4. Heart rate data
          </h2>
          <p>
            Running data may include health-related information, such as heart rate. We use it only to calculate scores and display your running progress.
          </p>
        </div>

        {/* 5 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            5. Who we share your data with
          </h2>
          <p>We use the following providers to operate Runtrackr:</p>
          <ul className="list-disc list-outside pl-4 space-y-1">
            <li>Google: Account authentication.</li>
            <li>Supabase: Database and data storage.</li>
            <li>Vercel: App hosting.</li>
          </ul>
          <p className="mt-1">
            These providers may process your information on servers outside Indonesia. We may also disclose information when legally required or necessary to protect the app and its users.
          </p>
          <p>
            We don't sell or share your personal information for advertising.
          </p>
          <p>
            Our use of Google account information follows Google's API Services User Data Policy.
          </p>
        </div>

        {/* 6 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            6. Data access
          </h2>
          <p>
            Your runs are private and visible only to you within the app. As the app operator, Syahrul Miftah may technically access stored data when necessary for maintenance, security, or legal obligations.
          </p>
        </div>

        {/* 7 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            7. Data retention
          </h2>
          <p>
            We keep your account and running data while your account remains active.
          </p>
          <p>
            When you delete your account through the app, we delete your associated personal data. Some copies may temporarily remain in service-provider backups, subject to their retention policies.
          </p>
        </div>

        {/* 8 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            8. Security
          </h2>
          <p>
            We use reasonable security measures, including Google authentication, encrypted connections, and database access controls.
          </p>
          <p>
            However, no online service can guarantee complete security.
          </p>
        </div>

        {/* 9 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            9. Your rights
          </h2>
          <p>You can:</p>
          <ul className="list-disc list-outside pl-4 space-y-1">
            <li>Edit or delete your runs.</li>
            <li>Request a copy of your personal information.</li>
            <li>Request corrections to your information.</li>
            <li>Delete your account and associated data.</li>
            <li>Withdraw your consent by deleting your account.</li>
          </ul>
          <p className="mt-1">
            For privacy requests, contact{' '}
            <span className="text-[#E3E4E9] underline underline-offset-2">
              syahrulmiftahfarid@gmail.com
            </span>.
          </p>
        </div>

        {/* 10 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            10. Cookies and local storage
          </h2>
          <p>
            We use necessary storage to maintain your login session and keep the app functioning. We don't use advertising cookies.
          </p>
        </div>

        {/* 11 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            11. Children
          </h2>
          <p>
            Runtrackr is not intended for children under 16. We don't knowingly collect personal information from children under this age.
          </p>
        </div>

        {/* 12 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            12. Policy changes
          </h2>
          <p>
            We may update this policy as Runtrackr evolves. Any changes will be reflected in the updated date above. Important changes may also be communicated through the app.
          </p>
        </div>

        {/* 13 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#E3E4E9]">
            13. Contact
          </h2>
          <p>
            For questions, concerns, or requests regarding your personal data:
          </p>
          <p className="text-[#E3E4E9]">
            Syahrul Miftah
          </p>
          <p>
            Email:{' '}
            <span className="text-[#E3E4E9] underline underline-offset-2">
              syahrulmiftahfarid@gmail.com
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
