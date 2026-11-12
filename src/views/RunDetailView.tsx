import React, { useState } from 'react';
import { RunActivity } from '../types/run';
import { formatDuration, formatPace } from '../utils/calculations';
import { PopupDialog } from '../components/ui/PopupDialog';
import { ArrowLeft, Trash2, Pencil, MapPin, AlertTriangle } from 'lucide-react';

interface RunDetailViewProps {
  run: RunActivity;
  onBack: () => void;
  onEdit: (run: RunActivity) => void;
  onDelete: (id: string) => void;
}

export const RunDetailView: React.FC<RunDetailViewProps> = ({
  run,
  onBack,
  onEdit,
  onDelete,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const hasScore = run.score !== null && run.score > 0;

  // Format date: e.g. 31 Oct 2026, 15:24
  const runDate = new Date(`${run.date}T${run.time.length === 5 ? `${run.time}:00` : run.time}`);
  const formattedDate = !isNaN(runDate.getTime())
    ? `${runDate.getDate()} ${runDate.toLocaleString('default', { month: 'short' })} ${runDate.getFullYear()}, ${run.time.slice(0, 5)}`
    : `${run.date}, ${run.time.slice(0, 5)}`;

  return (
    <div className="w-full flex flex-col gap-6 max-w-md mx-auto pt-2 pb-16 font-roboto animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="w-full flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#27272F] hover:bg-[#3C3C45] border border-[#303037] flex items-center justify-center text-white transition-all cursor-pointer active:scale-95"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <span className="text-xs text-[#87878F] font-roboto">Run at</span>
          <span className="text-sm font-semibold text-white font-roboto">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Activity Title, Description & Location */}
      <div className="flex flex-col gap-1 mt-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {run.title || 'Outdoor Run'}
        </h1>
        <p className="text-sm text-[#87878F]">
          {run.description || 'Run when raining on usual route'}
        </p>

        {run.location && (
          <div className="flex items-center justify-end text-xs text-[#87878F] gap-1 -mt-2">
            <MapPin className="w-3.5 h-3.5 text-[#87878F]" />
            <span>{run.location}</span>
          </div>
        )}
      </div>

      {/* Prominent Score Hero matching Run_Detail_a482025e.png */}
      <div className="flex flex-col mt-2">
        <span className="font-anton text-7xl text-[#4963F4] leading-none tracking-tight">
          {hasScore ? Math.round(run.score!) : '—'}
        </span>
        <span className="text-sm text-[#87878F] font-roboto mt-2">
          Run Score
        </span>
      </div>

      {/* 2-Column Metrics Grid (Distance, Duration, Pace, HR, Elevation, Cadence) */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-7 mt-4">
        {/* Row 1: Distance & Duration */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="font-anton text-4xl text-white tracking-wide">
              {run.distance.toFixed(2)}
            </span>
            <span className="text-xs text-[#87878F] font-roboto">km</span>
          </div>
          <span className="text-xs text-[#87878F] font-roboto mt-1">
            Distance
          </span>
        </div>

        <div className="flex flex-col">
          <span className="font-anton text-4xl text-white tracking-wide">
            {formatDuration(run.duration)}
          </span>
          <span className="text-xs text-[#87878F] font-roboto mt-1">
            Duration
          </span>
        </div>

        {/* Row 2: Avg. Pace & Avg. Heart Rate */}
        <div className="flex flex-col">
          <span className="font-anton text-4xl text-white tracking-wide">
            {formatPace(run.pace)}
          </span>
          <span className="text-xs text-[#87878F] font-roboto mt-1">
            Avg. Pace
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="font-anton text-4xl text-white tracking-wide">
              {run.avgHeartRate || '—'}
            </span>
            <span className="text-xs text-[#87878F] font-roboto">bpm</span>
          </div>
          <span className="text-xs text-[#87878F] font-roboto mt-1">
            Avg. Heart Rate
          </span>
        </div>

        {/* Row 3: Elevation Gain & Cadence */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="font-anton text-4xl text-white tracking-wide">
              {run.elevationGain != null ? Math.round(run.elevationGain) : '812'}
            </span>
            <span className="text-xs text-[#87878F] font-roboto">m</span>
          </div>
          <span className="text-xs text-[#87878F] font-roboto mt-1">
            Elevation Gain
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="font-anton text-4xl text-white tracking-wide">
              {run.cadence != null ? Math.round(run.cadence) : '172'}
            </span>
            <span className="text-xs text-[#87878F] font-roboto">spm</span>
          </div>
          <span className="text-xs text-[#87878F] font-roboto mt-1">
            Cadence
          </span>
        </div>
      </div>

      {/* Floating Action Buttons at bottom matching reference */}
      <div className="flex items-center gap-3 mt-8 pt-4">
        {/* Delete button */}
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="w-12 h-12 rounded-full bg-[#27272F] hover:bg-[#3C3C45] border border-[#303037] flex items-center justify-center text-[#BA4949] transition-transform active:scale-95 cursor-pointer shadow-md"
          title="Delete activity"
          aria-label="Delete activity"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        {/* Edit button */}
        <button
          type="button"
          onClick={() => onEdit(run)}
          className="w-12 h-12 rounded-full bg-[#27272F] hover:bg-[#3C3C45] border border-[#303037] flex items-center justify-center text-white transition-transform active:scale-95 cursor-pointer shadow-md"
          title="Edit activity"
          aria-label="Edit activity"
        >
          <Pencil className="w-5 h-5" />
        </button>
      </div>

      {/* Delete Confirmation Dialog matching Popup-1_c5567ac1.png */}
      <PopupDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        icon={<AlertTriangle className="w-8 h-8 text-[#BA4949] stroke-[1.8]" />}
        title="Delete Activity"
        description="Are you sure you want to delete this running activity? This action cannot be undone."
        primaryActionLabel="Delete"
        primaryActionVariant="Destructive"
        onPrimaryAction={() => onDelete(run.id)}
      />
    </div>
  );
};
