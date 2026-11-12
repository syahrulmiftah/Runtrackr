import React, { useMemo, useState, useEffect } from 'react';
import { ChartMetric, PeriodSummary, RunActivity, TimeGroup, UserProfile } from '../types/run';
import { PerformanceChart } from '../components/chart/PerformanceChart';
import { LineTabs, LineTabOption } from '../components/ui/LineTabs';
import { ActivityTable } from '../components/ui/ActivityTable';
import { DualRangeSlider } from '../components/ui/DualRangeSlider';
import { groupActivities } from '../utils/calculations';
import { Plus, Upload } from 'lucide-react';

interface DashboardViewProps {
  userProfile: UserProfile;
  timeGroup: TimeGroup;
  onTimeGroupChange: (tg: TimeGroup) => void;
  chartMetric: ChartMetric;
  onChartMetricChange: (metric: ChartMetric) => void;
  runs: RunActivity[];
  periods: PeriodSummary[];
  selectedPeriodKey: string | null;
  onSelectPeriodFromChart: (period: PeriodSummary | null) => void;
  onSelectRun: (run: RunActivity) => void;
  onViewAllActivity: () => void;
  onOpenAddRun: () => void;
  onOpenUploadRun: () => void;
  onOpenSettings: () => void;
}

const TIME_GROUP_TABS: LineTabOption<TimeGroup>[] = [
  { id: 'day', label: 'Daily' },
  { id: 'week', label: 'Weekly' },
  { id: 'month', label: 'Monthly' },
  { id: 'quarter', label: 'Quarterly' },
  { id: 'year', label: 'Yearly' },
];

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  timeGroup,
  onTimeGroupChange,
  chartMetric,
  onChartMetricChange,
  runs,
  periods,
  selectedPeriodKey,
  onSelectPeriodFromChart,
  onSelectRun,
  onViewAllActivity,
  onOpenAddRun,
  onOpenUploadRun,
  onOpenSettings,
}) => {
  // Maximum run distance in dataset
  const maxDistance = useMemo(() => {
    if (runs.length === 0) return 25;
    const maxVal = Math.max(...runs.map((r) => r.distance));
    return Math.max(10, Math.ceil(maxVal));
  }, [runs]);

  // Dual knob distance filter state for chart (lower limit and upper limit)
  const [minDist, setMinDist] = useState<number>(0);
  const [maxDist, setMaxDist] = useState<number>(maxDistance);

  // Keep maxDist synced if runs dataset updates
  useEffect(() => {
    setMaxDist(maxDistance);
  }, [maxDistance]);

  const isFilterActive = minDist > 0 || maxDist < maxDistance;

  // Runs filtered by distance range for the chart
  const chartRuns = useMemo(() => {
    if (!isFilterActive) return runs;
    return runs.filter((r) => r.distance >= minDist && r.distance <= maxDist);
  }, [runs, minDist, maxDist, isFilterActive]);

  // Periods recalculated when distance filter is active
  const chartPeriods = useMemo(() => {
    if (!isFilterActive) return periods;
    return groupActivities(chartRuns, timeGroup);
  }, [periods, chartRuns, timeGroup, isFilterActive]);

  const handleResetFilter = () => {
    setMinDist(0);
    setMaxDist(maxDistance);
  };

  return (
    <div className="w-full flex flex-col gap-5 max-w-md mx-auto">
      {/* 1. Header (Vertical layout: Avatar on top, then Welcome back, then User title) */}
      <header className="w-full flex flex-col gap-3 pt-2">
        {/* Top bar: Avatar on the left, Upload & Add on the right */}
        <div className="w-full flex items-center justify-between">
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-11 h-11 rounded-full overflow-hidden border border-[#303037] hover:border-[#87878F] transition-transform hover:scale-105 active:scale-95 cursor-pointer bg-[#27272F] flex items-center justify-center select-none"
            title="Account & Settings"
            aria-label="Account and Settings"
          >
            <img
              src={userProfile.avatarUrl || DEFAULT_AVATAR}
              alt={userProfile.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to avatar silhouette if image fails to load
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenUploadRun}
              className="w-10 h-10 rounded-full bg-[#27272F] hover:bg-[#3C3C45] border border-[#303037] flex items-center justify-center text-[#E3E4E9] transition-all cursor-pointer shadow-sm active:scale-95"
              title="Upload Strava CSV"
              aria-label="Upload CSV"
            >
              <Upload className="w-4 h-4 text-[#E3E4E9]" />
            </button>

            <button
              type="button"
              onClick={onOpenAddRun}
              className="w-10 h-10 rounded-full bg-[#4963F4] hover:bg-[#3d54d9] text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
              title="Add Manual Run"
              aria-label="Add Run"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Vertical Welcome Message and Title */}
        <div className="flex flex-col">
          <span className="text-lg font-normal text-[#87878F] font-roboto leading-snug">
            Welcome back!
          </span>
          <h1 className="text-2xl font-normal text-[#E3E4E9] font-roboto tracking-tight">
            {userProfile.name}
          </h1>
        </div>
      </header>

      {/* 2. Reusable Line-Style Time Group Tabs */}
      <LineTabs
        tabs={TIME_GROUP_TABS}
        activeId={timeGroup}
        onChange={onTimeGroupChange}
      />

      {/* Revised Distance Filter with Dual Knobs (Placed below timegroup tabs and above chart card) */}
      <div className="w-full bg-[#19191F] rounded-2xl p-4 flex flex-col gap-2.5 select-none shadow-sm">
        {/* Top Header: "Distance (km)" on left, Reset secondary pill button on right (hidden when resetted) */}
        <div className="flex items-center justify-between min-h-[28px]">
          <span className="text-xs text-[#87878F] font-roboto font-normal">
            Distance (km)
          </span>

          {isFilterActive && (
            <button
              type="button"
              onClick={handleResetFilter}
              className="h-7 px-3 rounded-full text-xs font-roboto bg-[#27272F] text-[#E3E4E9] hover:bg-[#3C3C45] active:bg-[#0D0C11] transition-colors select-none cursor-pointer flex items-center justify-center border-none animate-in fade-in duration-150"
            >
              Reset
            </button>
          )}
        </div>

        {/* Dual Knob Slider with thin 2px line, blue active connector, and 5px white stroke knobs */}
        <DualRangeSlider
          min={0}
          max={maxDistance}
          step={0.5}
          minValue={minDist}
          maxValue={maxDist}
          onChange={(newMin, newMax) => {
            setMinDist(newMin);
            setMaxDist(newMax);
          }}
        />

        {/* Bottom indicators: Lower limit in solid white, count "177 of 177", Upper limit in solid white */}
        <div className="flex justify-between items-center font-roboto">
          <span className="text-sm font-medium text-white tabular-nums">
            {minDist % 1 === 0 ? minDist : minDist.toFixed(1)}
          </span>
          <span className="text-xs text-[#87878F] tabular-nums">
            {chartRuns.length} of {runs.length}
          </span>
          <span className="text-sm font-medium text-white tabular-nums">
            {maxDist % 1 === 0 ? maxDist : maxDist.toFixed(1)}
          </span>
        </div>
      </div>

      {/* 3. Performance Chart (with 6-metric grid, active blue metrics, metric tabs, white needle, and 1-point swipe) */}
      <PerformanceChart
        metric={chartMetric}
        onMetricChange={onChartMetricChange}
        periods={chartPeriods}
        selectedPeriodKey={selectedPeriodKey}
        onSelectPeriod={onSelectPeriodFromChart}
      />

      {/* 4. Recent Activity Section (Latest 5 runs + Secondary Button for View All Activity; unaffected by chart filter) */}
      <ActivityTable
        runs={runs}
        onSelectRun={onSelectRun}
        onViewAllActivity={onViewAllActivity}
        limit={5}
      />
    </div>
  );
};
