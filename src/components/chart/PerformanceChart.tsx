import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { ChartMetric, PeriodSummary } from '../../types/run';
import { computeYScale, findNearestPointIndex, generateAreaPath, generateSvgPath, getVisibleWindow } from './chartMath';
import { formatDuration, formatPace } from '../../utils/calculations';

interface PerformanceChartProps {
  metric: ChartMetric;
  onMetricChange: (metric: ChartMetric) => void;
  periods: PeriodSummary[];
  onSelectPeriod?: (period: PeriodSummary | null) => void;
  selectedPeriodKey?: string | null;
}

const METRIC_TABS: { id: ChartMetric; label: string }[] = [
  { id: 'score', label: 'Score' },
  { id: 'distance', label: 'Distance' },
  { id: 'pace', label: 'Pace' },
  { id: 'duration', label: 'Duration' },
  { id: 'heart-rate', label: 'Heart Rate' },
  { id: 'runs', label: 'Runs' },
];

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  metric,
  onMetricChange,
  periods,
  onSelectPeriod,
  selectedPeriodKey,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(343);

  // Default window offset to the most recent 12 points (at the end)
  const initialOffset = Math.max(0, periods.length - 12);
  const [windowOffset, setWindowOffset] = useState(initialOffset);
  const [selectedIdxInWindow, setSelectedIdxInWindow] = useState<number | null>(null);

  // Resize observer to ensure responsive width
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0] && entries[0].contentRect.width > 0) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Sync window offset when periods length changes
  useEffect(() => {
    setWindowOffset(Math.max(0, periods.length - 12));
    setSelectedIdxInWindow(null);
  }, [periods.length]);

  const { visibleItems } = useMemo(() => {
    return getVisibleWindow(periods, windowOffset, 12);
  }, [periods, windowOffset]);

  // Sync selected period from props if provided
  useEffect(() => {
    if (selectedPeriodKey) {
      const idx = visibleItems.findIndex((p) => p.key === selectedPeriodKey);
      if (idx !== -1) {
        setSelectedIdxInWindow(idx);
      }
    }
  }, [selectedPeriodKey, visibleItems]);

  // Selected item: defaults to latest item in visible window if none selected
  const activeItem = useMemo(() => {
    if (visibleItems.length === 0) return null;
    if (selectedIdxInWindow !== null && visibleItems[selectedIdxInWindow]) {
      return visibleItems[selectedIdxInWindow];
    }
    return visibleItems[visibleItems.length - 1];
  }, [visibleItems, selectedIdxInWindow]);

  // SVG dimensions
  const svgHeight = 160;
  const paddingLeft = 16;
  const paddingRight = 44; // room for Y-axis labels on right
  const paddingTop = 16;
  const paddingBottom = 20; // reduced gap to x-axis labels

  const plotWidth = Math.max(100, containerWidth - paddingLeft - paddingRight);

  // Extract values based on metric
  const rawValues = useMemo(() => {
    switch (metric) {
      case 'score':
        return visibleItems.map((p) => (p.avgScore !== null && p.avgScore > 0 ? p.avgScore : null));
      case 'distance':
        return visibleItems.map((p) => p.totalDistance);
      case 'pace':
        return visibleItems.map((p) => (p.avgPace > 0 ? p.avgPace : null));
      case 'duration':
        return visibleItems.map((p) => p.totalDuration);
      case 'heart-rate':
        return visibleItems.map((p) => (p.avgHeartRate !== null && p.avgHeartRate > 0 ? p.avgHeartRate : null));
      case 'runs':
        return visibleItems.map((p) => p.runCount);
      default:
        return visibleItems.map((p) => p.avgScore);
    }
  }, [visibleItems, metric]);

  const { scaleY, yTicks } = useMemo(() => {
    const formatTick = (val: number) => {
      switch (metric) {
        case 'score':
          return Math.round(val).toString();
        case 'distance':
          return `${val >= 10 ? Math.round(val) : val.toFixed(1)} km`;
        case 'pace':
          return formatPace(val);
        case 'duration': {
          const mins = Math.round(val / 60);
          if (mins < 60) return `${mins}m`;
          const hrs = Math.floor(mins / 60);
          const rem = mins % 60;
          return `${hrs}h${rem > 0 ? ` ${rem}m` : ''}`;
        }
        case 'heart-rate':
          return `${Math.round(val)} bpm`;
        case 'runs':
          return Math.round(val).toString();
        default:
          return Math.round(val).toString();
      }
    };
    return computeYScale(rawValues, svgHeight, paddingTop, paddingBottom, formatTick);
  }, [rawValues, svgHeight, paddingTop, paddingBottom, metric]);

  // Compute (x, y) coordinates for each visible point
  const points = useMemo(() => {
    if (visibleItems.length === 0) return [];

    const stepX = visibleItems.length > 1 ? plotWidth / (visibleItems.length - 1) : plotWidth / 2;

    return visibleItems.map((item, idx) => {
      const x = paddingLeft + (visibleItems.length > 1 ? idx * stepX : plotWidth / 2);
      let val: number | null = null;
      let isEligible = true;

      switch (metric) {
        case 'score':
          val = item.avgScore;
          isEligible = val !== null && val > 0;
          break;
        case 'distance':
          val = item.totalDistance;
          isEligible = true;
          break;
        case 'pace':
          val = item.avgPace;
          isEligible = val > 0;
          break;
        case 'duration':
          val = item.totalDuration;
          isEligible = true;
          break;
        case 'heart-rate':
          val = item.avgHeartRate;
          isEligible = val !== null && val > 0;
          break;
        case 'runs':
          val = item.runCount;
          isEligible = true;
          break;
      }

      const y = scaleY(val);

      return {
        idx,
        item,
        x,
        y,
        val,
        isEligible,
      };
    });
  }, [visibleItems, plotWidth, paddingLeft, scaleY, metric]);

  // In score/pace/HR mode, line connects eligible points, skipping empty periods
  const eligiblePoints = useMemo(() => {
    return points.filter((p) => p.isEligible);
  }, [points]);

  const pathD = useMemo(() => {
    return generateSvgPath(eligiblePoints);
  }, [eligiblePoints]);

  // Area fill under the trend line down to the chart baseline
  const areaD = useMemo(() => {
    if (eligiblePoints.length < 2) return '';
    const bottomY = svgHeight - paddingBottom;
    return generateAreaPath(eligiblePoints, bottomY);
  }, [eligiblePoints, svgHeight, paddingBottom]);

  // Active point coordinates for vertical indicator
  const activePoint = useMemo(() => {
    if (!activeItem) return null;
    return points.find((p) => p.item.key === activeItem.key) || null;
  }, [points, activeItem]);

  // Pointer drag/swipe handling for chart navigation (horizontal slide window only)
  const pointerStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastSwipeTimeRef = useRef<number>(0);
  const isDraggingChartRef = useRef<boolean>(false);

  // Dedicated needle drag state
  const isDraggingNeedleRef = useRef<boolean>(false);

  const selectPointByIndex = useCallback(
    (indexInWindow: number) => {
      if (indexInWindow >= 0 && indexInWindow < visibleItems.length) {
        setSelectedIdxInWindow(indexInWindow);
        onSelectPeriod?.(visibleItems[indexInWindow]);
      }
    },
    [visibleItems, onSelectPeriod]
  );

  // Chart Navigation: Shift visible window by 1 position (does not move needle directly)
  const navigateChart = useCallback(
    (direction: 'next' | 'prev') => {
      const now = Date.now();
      // Allow rapid consecutive swipes (debounced to 60ms)
      if (now - lastSwipeTimeRef.current < 60) return;
      lastSwipeTimeRef.current = now;

      const maxOffset = Math.max(0, periods.length - 12);
      if (direction === 'next') {
        // Swipe left on chart -> Navigate to the next chart position (forward in time)
        setWindowOffset((prev) => Math.min(maxOffset, prev + 1));
      } else {
        // Swipe right on chart -> Navigate to the previous chart position (backward in time)
        setWindowOffset((prev) => Math.max(0, prev - 1));
      }
    },
    [periods.length]
  );

  // Main chart area touch handlers: Dedicated EXCLUSIVELY to navigation swipe
  const handleChartPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    pointerStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    isDraggingChartRef.current = false;
  };

  const handleChartPointerMove = (e: React.PointerEvent) => {
    if (!pointerStartRef.current) return;
    const deltaX = e.clientX - pointerStartRef.current.x;
    const deltaY = e.clientY - pointerStartRef.current.y;

    // Detect horizontal swipe vs vertical page scroll
    if (Math.abs(deltaX) > 16 && Math.abs(deltaX) > Math.abs(deltaY)) {
      isDraggingChartRef.current = true;
      if (deltaX < -20) {
        // Swipe left on chart -> Navigate to next chart position
        navigateChart('next');
        pointerStartRef.current.x = e.clientX;
      } else if (deltaX > 20) {
        // Swipe right on chart -> Navigate to previous chart position
        navigateChart('prev');
        pointerStartRef.current.x = e.clientX;
      }
    }
  };

  const handleChartPointerUp = (e: React.PointerEvent) => {
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
    pointerStartRef.current = null;
    isDraggingChartRef.current = false;
  };

  // Dedicated Needle Control touch handlers: Dedicated EXCLUSIVELY to moving needle / selecting data point
  const handleNeedlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation(); // Never trigger chart navigation
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    isDraggingNeedleRef.current = true;

    // Immediately select nearest point on tap/down
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect && points.length > 0) {
      const clickX = e.clientX - rect.left;
      const xPositions = points.map((p) => p.x);
      const nearest = findNearestPointIndex(clickX, xPositions);
      if (nearest >= 0 && nearest < visibleItems.length) {
        selectPointByIndex(nearest);
      }
    }
  };

  const handleNeedlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingNeedleRef.current) return;
    e.stopPropagation(); // Never trigger chart navigation

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || points.length === 0) return;

    const currentX = e.clientX - rect.left;
    const xPositions = points.map((p) => p.x);
    const nearest = findNearestPointIndex(currentX, xPositions);
    if (nearest >= 0 && nearest < visibleItems.length) {
      selectPointByIndex(nearest);
    }
  };

  const handleNeedlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingNeedleRef.current) {
      e.stopPropagation();
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      isDraggingNeedleRef.current = false;
    }
  };

  const isEmpty = periods.length === 0;

  const isScoreActive = metric === 'score';
  const isPaceActive = metric === 'pace';
  const isHrActive = metric === 'heart-rate';
  const isRunsActive = metric === 'runs';
  const isDistActive = metric === 'distance';
  const isDurActive = metric === 'duration';

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#19191F] rounded-2xl p-5 flex flex-col gap-4"
    >
      {/* 1. Selected Period Header (e.g. 25 Oct, 2026) */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[#E3E4E9] font-roboto">
          {activeItem ? activeItem.label : 'No data recorded yet'}
        </span>
      </div>

      {/* 2. 6 Metrics Overview Grid (3 columns × 2 rows) - active chart metric highlighted with primary color */}
      <div className="grid grid-cols-3 grid-rows-2 gap-x-4 gap-y-4 w-full">
        {/* 1. Avg. Score */}
        <div className="w-full flex flex-col justify-between h-[48px] min-w-0">
          <div className="flex items-baseline leading-none h-[26px]">
            <span
              className={`font-anton text-2xl tracking-wide leading-none truncate ${
                isScoreActive ? 'text-[#4963F4]' : 'text-[#E3E4E9]'
              }`}
            >
              {activeItem && activeItem.avgScore !== null && activeItem.avgScore > 0
                ? Math.round(activeItem.avgScore)
                : '-'}
            </span>
          </div>
          <div
            className={`text-xs font-roboto truncate leading-none ${
              isScoreActive ? 'text-[#4963F4] font-medium' : 'text-[#87878F]'
            }`}
          >
            Avg. Score
          </div>
        </div>

        {/* 2. Avg. Pace */}
        <div className="w-full flex flex-col justify-between h-[48px] min-w-0">
          <div className="flex items-baseline leading-none h-[26px]">
            <span
              className={`font-anton text-2xl tracking-wide leading-none truncate ${
                isPaceActive ? 'text-[#4963F4]' : 'text-[#E3E4E9]'
              }`}
            >
              {activeItem ? formatPace(activeItem.avgPace) : "0'00\""}
            </span>
          </div>
          <div
            className={`text-xs font-roboto truncate leading-none ${
              isPaceActive ? 'text-[#4963F4] font-medium' : 'text-[#87878F]'
            }`}
          >
            Avg. Pace
          </div>
        </div>

        {/* 3. Avg. Heart Rate */}
        <div className="w-full flex flex-col justify-between h-[48px] min-w-0">
          <div className="flex items-baseline gap-1 leading-none h-[26px]">
            <span
              className={`font-anton text-2xl tracking-wide leading-none truncate ${
                isHrActive ? 'text-[#4963F4]' : 'text-[#E3E4E9]'
              }`}
            >
              {activeItem && activeItem.avgHeartRate ? activeItem.avgHeartRate : '-'}
            </span>
            {activeItem?.avgHeartRate && (
              <span
                className={`text-xs font-anton leading-none ${
                  isHrActive ? 'text-[#4963F4]' : 'text-[#87878F]'
                }`}
              >
                bpm
              </span>
            )}
          </div>
          <div
            className={`text-xs font-roboto truncate leading-none ${
              isHrActive ? 'text-[#4963F4] font-medium' : 'text-[#87878F]'
            }`}
          >
            Avg. Heart Rate
          </div>
        </div>

        {/* 4. Runs */}
        <div className="w-full flex flex-col justify-between h-[48px] min-w-0">
          <div className="flex items-baseline leading-none h-[26px]">
            <span
              className={`font-anton text-2xl tracking-wide leading-none truncate ${
                isRunsActive ? 'text-[#4963F4]' : 'text-[#E3E4E9]'
              }`}
            >
              {activeItem ? activeItem.runCount : '0'}
            </span>
          </div>
          <div
            className={`text-xs font-roboto truncate leading-none ${
              isRunsActive ? 'text-[#4963F4] font-medium' : 'text-[#87878F]'
            }`}
          >
            Runs
          </div>
        </div>

        {/* 5. Distance */}
        <div className="w-full flex flex-col justify-between h-[48px] min-w-0">
          <div className="flex items-baseline gap-1 leading-none h-[26px]">
            <span
              className={`font-anton text-2xl tracking-wide leading-none truncate ${
                isDistActive ? 'text-[#4963F4]' : 'text-[#E3E4E9]'
              }`}
            >
              {activeItem ? activeItem.totalDistance.toFixed(2) : '0.00'}
            </span>
            <span
              className={`text-xs font-anton leading-none ${
                isDistActive ? 'text-[#4963F4]' : 'text-[#87878F]'
              }`}
            >
              km
            </span>
          </div>
          <div
            className={`text-xs font-roboto truncate leading-none ${
              isDistActive ? 'text-[#4963F4] font-medium' : 'text-[#87878F]'
            }`}
          >
            Distance
          </div>
        </div>

        {/* 6. Duration */}
        <div className="w-full flex flex-col justify-between h-[48px] min-w-0">
          <div className="flex items-baseline leading-none h-[26px]">
            <span
              className={`font-anton text-2xl tracking-wide leading-none truncate ${
                isDurActive ? 'text-[#4963F4]' : 'text-[#E3E4E9]'
              }`}
            >
              {activeItem ? formatDuration(activeItem.totalDuration) : '00:00:00'}
            </span>
          </div>
          <div
            className={`text-xs font-roboto truncate leading-none ${
              isDurActive ? 'text-[#4963F4] font-medium' : 'text-[#87878F]'
            }`}
          >
            Duration
          </div>
        </div>
      </div>

      {/* 3. Metric Pill Tabs directly above chart (Hide scrollbars) */}
      <div
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none pt-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {METRIC_TABS.map((tab) => {
          const isActive = tab.id === metric;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onMetricChange(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer select-none ${
                isActive
                  ? 'border border-[#4963F4] text-[#4963F4] bg-[#4963F4]/15'
                  : 'border border-[#303037] text-[#87878F] hover:text-[#E3E4E9] hover:border-[#87878F]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 4. Chart & Needle Interaction Section */}
      <div className="w-full relative select-none">
        {/* 4.1 Main Chart Area (Dedicated exclusively to chart navigation via horizontal swipe) */}
        <div
          className="w-full relative select-none touch-pan-y cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
          onPointerDown={handleChartPointerDown}
          onPointerMove={handleChartPointerMove}
          onPointerUp={handleChartPointerUp}
          onPointerCancel={handleChartPointerUp}
        >
          <svg
            width="100%"
            height={svgHeight}
            className="overflow-visible block w-full"
            style={{ width: '100%', height: svgHeight }}
          >
            <defs>
              {/* Area gradient under the chart: primary #4963F4 at 40% opacity fading to 0% at the baseline */}
              <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4963F4" stopOpacity="0.40" />
                <stop offset="100%" stopColor="#4963F4" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {yTicks.map((tick, i) => (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={tick.y}
                  x2={paddingLeft + plotWidth}
                  y2={tick.y}
                  stroke="#303037"
                  strokeWidth="1"
                  strokeDasharray={i === yTicks.length - 1 ? undefined : '2,2'}
                />
                {/* Y-axis tick labels on the right */}
                <text
                  x={paddingLeft + plotWidth + 8}
                  y={tick.y + 3}
                  fill="#87878F"
                  fontSize="10"
                  fontFamily="Roboto, sans-serif"
                  textAnchor="start"
                >
                  {tick.label}
                </text>
              </g>
            ))}

            {/* Area Gradient Fill under chart */}
            {!isEmpty && areaD && (
              <path
                d={areaD}
                fill="url(#chartAreaGradient)"
                stroke="none"
              />
            )}

            {/* Vertical Needle Selection Indicator (Solid White line) */}
            {activePoint && !isEmpty && (
              <line
                x1={activePoint.x}
                y1={paddingTop}
                x2={activePoint.x}
                y2={svgHeight - paddingBottom}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            )}

            {/* Trend Polyline */}
            {!isEmpty && pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#4963F4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Points */}
            {!isEmpty &&
              points.map((pt) => {
                const isSelected = activeItem?.key === pt.item.key;

                // If metric is score/pace/HR and point is not eligible, render subtle indicator
                if ((metric === 'score' || metric === 'pace' || metric === 'heart-rate') && !pt.isEligible) {
                  return (
                    <circle
                      key={pt.item.key}
                      cx={pt.x}
                      cy={scaleY(0)}
                      r="2.5"
                      fill="#303037"
                      opacity="0.5"
                    />
                  );
                }

                return (
                  <g key={pt.item.key} className="transition-transform duration-100">
                    {/* Selected outer glow / halo matching Figma variant (primary 35% halo) */}
                    {isSelected && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="9"
                        fill="#4963F4"
                        fillOpacity="0.35"
                      />
                    )}
                    {/* Inner dot */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="3.5"
                      fill={isSelected ? '#4963F4' : '#19191F'}
                      stroke="#4963F4"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}
          </svg>
        </div>

        {/* 4.2 Dedicated Needle Control (Independent touch area for data point selection) */}
        {!isEmpty && activePoint && (
          <>
            {/* Horizontal needle track allowing touch along the baseline to select data points */}
            <div
              className="absolute z-10 touch-none cursor-pointer"
              style={{
                left: `${paddingLeft}px`,
                width: `${plotWidth}px`,
                top: `${svgHeight - paddingBottom - 10}px`,
                height: '50px',
              }}
              onPointerDown={handleNeedlePointerDown}
              onPointerMove={handleNeedlePointerMove}
              onPointerUp={handleNeedlePointerUp}
              onPointerCancel={handleNeedlePointerUp}
              title="Click or drag to select data point"
            />

            {/* Chevron Needle Control: 14x10px visible triangle centered inside a 50x50px touch target */}
            <div
              className="absolute z-20 flex items-center justify-center cursor-pointer select-none touch-none"
              style={{
                width: '50px',
                height: '50px',
                left: `${activePoint.x}px`,
                top: `${svgHeight - paddingBottom - 20}px`,
                transform: 'translateX(-50%)',
              }}
              onPointerDown={handleNeedlePointerDown}
              onPointerMove={handleNeedlePointerMove}
              onPointerUp={handleNeedlePointerUp}
              onPointerCancel={handleNeedlePointerUp}
              title={`Selected point: ${activeItem?.label || ''}`}
              aria-label="Chart needle control"
              role="slider"
              aria-valuenow={activePoint.idx}
              aria-valuemin={0}
              aria-valuemax={visibleItems.length - 1}
            >
              <svg
                width="14"
                height="10"
                viewBox="0 0 14 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="overflow-visible pointer-events-none drop-shadow-sm"
              >
                {/* Upward chevron triangle (14px wide, 10px high, 1px rounded corners) */}
                <path
                  d="M 6.13 1.25 C 6.52 0.58 7.48 0.58 7.87 1.25 L 13.14 8.75 C 13.53 9.42 13.05 10 12.27 10 L 1.73 10 C 0.95 10 0.47 9.42 0.86 8.75 Z"
                  fill="#FFFFFF"
                />
              </svg>
            </div>
          </>
        )}

        {/* 4.3 X-axis date labels with increased 12px vertical spacing */}
        <div
          className="flex justify-between items-center pt-3 text-[10px] text-[#87878F] font-roboto"
          style={{ paddingLeft: `${paddingLeft}px`, paddingRight: `${paddingRight}px` }}
        >
          {visibleItems.length > 0 ? (
            <>
              <span>{visibleItems[0].shortLabel}</span>
              {visibleItems.length > 4 && (
                <span>
                  {visibleItems[Math.floor(visibleItems.length / 2)].shortLabel}
                </span>
              )}
              {visibleItems.length > 1 && (
                <span>{visibleItems[visibleItems.length - 1].shortLabel}</span>
              )}
            </>
          ) : (
            <span>No activity periods</span>
          )}
        </div>
      </div>
    </div>
  );
};
