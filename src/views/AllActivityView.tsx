import React, { useMemo, useState } from 'react';
import { RunActivity } from '../types/run';
import { ActivityRow } from '../components/ui/ActivityTable';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

interface AllActivityViewProps {
  runs: RunActivity[];
  onBack: () => void;
  onSelectRun: (run: RunActivity) => void;
}

interface MonthGroup {
  key: string; // '2026-10'
  title: string; // 'Oct, 2026'
  totalDistance: number;
  totalDurationSec: number;
  runCount: number;
  runs: RunActivity[];
}

export const AllActivityView: React.FC<AllActivityViewProps> = ({
  runs,
  onBack,
  onSelectRun,
}) => {
  // Compute global dynamic min and max scores for consistent color scaling
  const { minScore, maxScore } = useMemo(() => {
    const scored = runs.filter((r) => r.score !== null && r.score > 0);
    if (scored.length === 0) return { minScore: 70, maxScore: 130 };
    const scores = scored.map((r) => r.score as number);
    return {
      minScore: Math.min(...scores),
      maxScore: Math.max(...scores),
    };
  }, [runs]);

  // Group all runs by month and year, sorted newest month first
  const monthGroups = useMemo<MonthGroup[]>(() => {
    const groupsMap = new Map<string, RunActivity[]>();

    // Sort all runs chronologically descending first
    const sortedRuns = [...runs].sort((a, b) => {
      const timeA = new Date(`${a.date}T${a.time || '12:00:00'}`).getTime();
      const timeB = new Date(`${b.date}T${b.time || '12:00:00'}`).getTime();
      return timeB - timeA;
    });

    sortedRuns.forEach((run) => {
      // run.date is 'YYYY-MM-DD'
      const monthKey = run.date.slice(0, 7); // '2026-10'
      if (!groupsMap.has(monthKey)) {
        groupsMap.set(monthKey, []);
      }
      groupsMap.get(monthKey)!.push(run);
    });

    const groups: MonthGroup[] = [];
    groupsMap.forEach((monthRuns, key) => {
      const [yearStr, monthStr] = key.split('-');
      const d = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
      const monthName = d.toLocaleString('en-US', { month: 'short' });
      const title = `${monthName}, ${yearStr}`;

      const totalDist = monthRuns.reduce((sum, r) => sum + r.distance, 0);
      const totalDur = monthRuns.reduce((sum, r) => sum + r.duration, 0);

      groups.push({
        key,
        title,
        totalDistance: totalDist,
        totalDurationSec: totalDur,
        runCount: monthRuns.length,
        runs: monthRuns,
      });
    });

    // Ensure groups are sorted descending by key
    groups.sort((a, b) => b.key.localeCompare(a.key));
    return groups;
  }, [runs]);

  // Set of expanded month keys. By default, expand the newest month (first group)
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (monthGroups.length > 0) {
      initial.add(monthGroups[0].key);
    }
    return initial;
  });

  const toggleMonth = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const formatHours = (seconds: number) => {
    const hours = seconds / 3600;
    return `${hours.toFixed(1)}h`;
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-md mx-auto pt-2 pb-16 font-roboto animate-in fade-in duration-150">
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
          All activity
        </h1>
      </div>

      {/* Monthly Sections List */}
      <div className="w-full flex flex-col gap-6">
        {monthGroups.length === 0 ? (
          <div className="bg-[#19191F] rounded-2xl p-8 text-center text-sm text-[#87878F]">
            No recorded activities yet.
          </div>
        ) : (
          monthGroups.map((group) => {
            const isExpanded = expandedKeys.has(group.key);

            return (
              <section key={group.key} className="w-full flex flex-col">
                {/* Monthly Summary Header (Collapsible trigger) */}
                <button
                  type="button"
                  onClick={() => toggleMonth(group.key)}
                  className="w-full flex items-center justify-between text-left py-2 select-none cursor-pointer group transition-colors"
                >
                  <div className="flex flex-col">
                    <h2 className="text-base font-bold text-white font-roboto tracking-tight">
                      {group.title}
                    </h2>
                    <div className="flex items-center gap-4 text-xs text-[#87878F] font-roboto mt-0.5">
                      <span>{group.totalDistance.toFixed(2)} km</span>
                      <span>{formatHours(group.totalDurationSec)}</span>
                      <span>
                        {group.runCount} {group.runCount === 1 ? 'run' : 'runs'}
                      </span>
                    </div>
                  </div>

                  <div className="text-white p-1 transition-transform">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {/* Collapsible Activity List */}
                {isExpanded && (
                  <div className="flex flex-col gap-2.5 mt-3 animate-in fade-in duration-150">
                    {group.runs.map((run) => (
                      <ActivityRow
                        key={run.id}
                        run={run}
                        minScore={minScore}
                        maxScore={maxScore}
                        onClick={() => onSelectRun(run)}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })
        )}
      </div>
    </div>
  );
};
