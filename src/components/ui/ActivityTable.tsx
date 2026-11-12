import React, { useMemo } from 'react';
import { RunActivity } from '../../types/run';
import { formatDuration, formatPace } from '../../utils/calculations';
import { ScoreBadge } from './ScoreBadge';
import { Button } from './Button';
import { Activity, ChevronRight, Heart } from 'lucide-react';

export interface ActivityRowProps {
  run: RunActivity;
  minScore?: number;
  maxScore?: number;
  onClick?: () => void;
}

/**
 * Reusable Activity Row component meeting Section 6.3 specs:
 * Left section:
 *   - Row 1: Date and time (text/sm/regular, White)
 *   - 8px gap
 *   - Row 2: Distance (title/sm/bold 18px, White)
 *   - 4px gap
 *   - Row 3: Duration, Pace, Heart Rate (text/sm/regular, Grey; Red if HR missing)
 * Right section:
 *   - Score badge with dynamic 5-color scale
 */
export const ActivityRow: React.FC<ActivityRowProps> = ({
  run,
  minScore,
  maxScore,
  onClick,
}) => {
  const runDate = new Date(`${run.date}T${run.time || '12:00:00'}`);
  const dateFormatted = !isNaN(runDate.getTime())
    ? `${runDate.getDate()} ${runDate.toLocaleString('default', { month: 'short' })}`
    : run.date;
  const timeFormatted = run.time || '12:00';

  const hasHeartRate = run.avgHeartRate !== null && run.avgHeartRate > 0;

  return (
    <div
      onClick={onClick}
      className="w-full bg-[#19191F] rounded-2xl p-4 flex items-center justify-between gap-4 transition-colors cursor-pointer select-none shadow-sm"
    >
      {/* Left section - Vertical information layout */}
      <div className="flex flex-col min-w-0 flex-1">
        {/* First row: Date and time */}
        <div className="text-xs font-normal text-[#87878F] font-roboto flex items-center gap-1.5">
          <span>{dateFormatted}</span>
          <span>·</span>
          <span>{timeFormatted}</span>
        </div>

        {/* 8px vertical gap */}
        <div className="h-2" />

        {/* Second row: Distance (18px bold white, Roboto font) */}
        <div className="text-lg font-bold text-[#E3E4E9] font-roboto tracking-tight">
          {run.distance.toFixed(2)} km
        </div>

        {/* 4px vertical gap */}
        <div className="h-1" />

        {/* Third row: Activity details (Duration, Pace, Heart Rate) */}
        <div className="text-sm font-normal text-[#87878F] font-roboto flex items-center gap-3">
          <span className="tabular-nums">{formatDuration(run.duration)}</span>
          <span className="tabular-nums">{formatPace(run.pace)}</span>

          <div className="flex items-center gap-1">
            <Heart
              className={`w-3.5 h-3.5 ${
                hasHeartRate
                  ? 'text-[#87878F] stroke-[2]'
                  : 'text-[#BA4949] stroke-[2]'
              }`}
            />
            <span
              className={`tabular-nums text-sm ${
                hasHeartRate ? 'text-[#87878F]' : 'text-[#BA4949]'
              }`}
            >
              {hasHeartRate ? run.avgHeartRate : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Right section - Score badge */}
      <div className="flex-shrink-0">
        <ScoreBadge score={run.score} minScore={minScore} maxScore={maxScore} />
      </div>
    </div>
  );
};

interface ActivityTableProps {
  runs: RunActivity[];
  onSelectRun: (run: RunActivity) => void;
  onViewAllActivity?: () => void;
  limit?: number;
}

/**
 * Recent Activity Table for Home Screen (Sections 6.2, 6.3, 6.4, 6.5):
 * - Heading: "Recent activity" (text/lg/regular, White)
 * - Removed checklist, sorting, Score header, and All Runs checkbox
 * - Previews latest 5 runs by default
 * - "View all activity" large secondary button beneath the list
 */
export const ActivityTable: React.FC<ActivityTableProps> = ({
  runs,
  onSelectRun,
  onViewAllActivity,
  limit = 5,
}) => {
  // Sort runs reverse-chronologically (latest run first)
  const sortedRuns = useMemo(() => {
    return [...runs].sort((a, b) => {
      const timeA = new Date(`${a.date}T${a.time || '12:00:00'}`).getTime();
      const timeB = new Date(`${b.date}T${b.time || '12:00:00'}`).getTime();
      return timeB - timeA;
    });
  }, [runs]);

  // Compute dataset min and max scores dynamically for color scale
  const { minScore, maxScore } = useMemo(() => {
    const scored = runs.filter((r) => r.score !== null && r.score > 0);
    if (scored.length === 0) return { minScore: 70, maxScore: 130 };
    const scores = scored.map((r) => r.score as number);
    return {
      minScore: Math.min(...scores),
      maxScore: Math.max(...scores),
    };
  }, [runs]);

  // Display only the latest 5 runs
  const displayedRuns = sortedRuns.slice(0, limit);

  if (runs.length === 0) {
    return (
      <div className="w-full flex flex-col gap-3">
        <h2 className="text-lg font-normal text-[#E3E4E9] font-roboto">
          Recent activity
        </h2>
        <div className="w-full bg-[#19191F] rounded-xl p-8 flex flex-col items-center justify-center text-center gap-2">
          <Activity className="w-8 h-8 text-[#87878F]" />
          <span className="text-sm font-medium text-[#E3E4E9]">No activities found</span>
          <span className="text-xs text-[#87878F]">
            Record your first run or upload a CSV file to see your performance history.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {/* 6.4 Table heading: Recent activity (text/lg/regular, White) */}
      <h2 className="text-lg font-normal text-[#E3E4E9] font-roboto">
        Recent activity
      </h2>

      {/* 6.3 Activity rows */}
      <div className="flex flex-col gap-2.5">
        {displayedRuns.map((run) => (
          <ActivityRow
            key={run.id}
            run={run}
            minScore={minScore}
            maxScore={maxScore}
            onClick={() => onSelectRun(run)}
          />
        ))}
      </div>

      {/* 6.5 Secondary Button: View all activity (pill 100px radius, no border, white chevron) */}
      {onViewAllActivity && (
        <div className="w-full mt-1">
          <Button
            variant="Secondary"
            size="md"
            fullWidth
            onClick={onViewAllActivity}
            rightIcon={<ChevronRight className="w-4 h-4 text-white" />}
            label="View all activity"
            className="border-none"
          />
        </div>
      )}
    </div>
  );
};
