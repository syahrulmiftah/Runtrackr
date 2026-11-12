import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface DocumentationDetailViewProps {
  topicId: string;
  onBack: () => void;
}

export const DocumentationDetailView: React.FC<DocumentationDetailViewProps> = ({
  topicId,
  onBack,
}) => {
  return (
    <div className="w-full flex flex-col gap-5 max-w-md mx-auto pt-2 pb-12 font-roboto">
      {/* Top Header with Back button */}
      <div className="w-full flex items-center">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#27272F] hover:bg-[#3C3C45] border border-[#303037] flex items-center justify-center text-white transition-all cursor-pointer active:scale-95"
          aria-label="Back to documentation"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {topicId === 'strava' && (
        <div className="flex flex-col gap-6 text-sm leading-relaxed">
          {/* Header */}
          <div className="flex flex-col gap-2 mt-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Import runs from Strava
            </h1>
            <p className="text-sm text-[#87878F] leading-normal">
              Import your running history without entering each run manually.
            </p>
          </div>

          {/* Step 1 */}
          <div className="flex flex-col gap-1.5">
            <h2 className="text-sm font-semibold text-[#E3E4E9]">
              1. Export your data
            </h2>
            <p className="text-[#87878F]">
              Log in to Strava's website. Go to Settings → My Account → Download or Delete Your Account → Get Started. Request your data, then download and unzip the file when Strava emails you.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col gap-1.5">
            <h2 className="text-sm font-semibold text-[#E3E4E9]">
              2. Find the file
            </h2>
            <p className="text-[#87878F]">
              Open the extracted folder and find activities.csv. Don't upload the ZIP file or edit the CSV.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col gap-1.5">
            <h2 className="text-sm font-semibold text-[#E3E4E9]">
              3. Upload your runs
            </h2>
            <p className="text-[#87878F]">
              Select Upload run → Select file, choose activities.csv, review the summary, and confirm.
            </p>
          </div>

          {/* Good to know */}
          <div className="flex flex-col gap-2 pt-2">
            <h2 className="text-sm font-semibold text-[#E3E4E9]">
              Good to know
            </h2>
            <ul className="list-disc list-outside pl-4 space-y-1.5 text-[#87878F]">
              <li>Only runs are imported. Other activities are skipped.</li>
              <li>Runs without heart rate are imported but won't receive a score until you add a heart rate.</li>
              <li>Existing or overlapping runs are skipped.</li>
              <li>Interval and hilly runs may affect your scores.</li>
            </ul>
          </div>
        </div>
      )}

      {topicId === 'score' && (
        <div className="flex flex-col gap-6 text-sm leading-relaxed">
          {/* Header */}
          <div className="flex flex-col gap-2 mt-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              How your score works
            </h1>
            <p className="text-sm text-[#87878F] leading-normal">
              Your score measures running efficiency by comparing your pace with your average heart rate. A higher score generally means you ran faster for the effort.
            </p>
          </div>

          {/* Formula */}
          <div className="py-1">
            <p className="text-sm font-semibold text-[#E3E4E9]">
              Score = (distance ÷ duration) × 100 ÷ average heart rate
            </p>
          </div>

          {/* How to read your score */}
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-[#E3E4E9]">
              How to read your score
            </h2>
            <ul className="list-disc list-outside pl-4 space-y-1.5 text-[#87878F]">
              <li>Compare your scores with your own past runs, not other runners.</li>
              <li>Focus on weekly, monthly, quarterly, and yearly trends rather than individual runs.</li>
              <li>Accurate heart rate data helps produce more reliable scores.</li>
            </ul>
          </div>

          {/* What affects your score? */}
          <div className="flex flex-col gap-1.5">
            <h2 className="text-sm font-semibold text-[#E3E4E9]">
              What affects your score?
            </h2>
            <p className="text-[#87878F]">
              The score works best for steady runs at similar distances. Intervals and hilly runs may produce unusual scores because the formula doesn't account for pace changes or elevation.
            </p>
          </div>

          {/* How averages work */}
          <div className="flex flex-col gap-1.5">
            <h2 className="text-sm font-semibold text-[#E3E4E9]">
              How averages work
            </h2>
            <p className="text-[#87878F]">
              Period averages are calculated by adding all run scores and dividing by the number of runs. Days without runs aren't counted.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
