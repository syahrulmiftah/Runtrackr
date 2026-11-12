import React from 'react';

export interface MetricProps {
  value: string | number;
  unit?: string;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Metric: React.FC<MetricProps> = ({
  value,
  unit,
  label,
  size = 'md',
}) => {
  const valueSizeClass = {
    sm: 'text-xl leading-6',
    md: 'text-3xl leading-9',
    lg: 'text-5xl leading-none',
  }[size];

  const labelSizeClass = {
    sm: 'text-[10px] leading-3.5',
    md: 'text-xs leading-4',
    lg: 'text-sm leading-5',
  }[size];

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-baseline gap-1.5">
        <span className={`font-anton uppercase tracking-wide text-[#E3E4E9] ${valueSizeClass}`}>
          {value}
        </span>
        {unit && (
          <span className="font-anton text-xs text-[#87878F] uppercase tracking-normal">
            {unit}
          </span>
        )}
      </div>
      <span className={`font-roboto text-[#87878F] ${labelSizeClass}`}>
        {label}
      </span>
    </div>
  );
};

export interface MiniMetricCardProps {
  cardLabel: string;
  value: string | number;
  unit?: string;
  label: string;
  size?: 'sm' | 'md';
}

export const MiniMetricCard: React.FC<MiniMetricCardProps> = ({
  cardLabel,
  value,
  unit,
  label,
  size = 'sm',
}) => {
  return (
    <div className="flex-1 bg-[#19191F] rounded-xl p-3.5 flex flex-col gap-2 border border-[#303037] min-w-0">
      <span className="text-xs text-[#87878F] font-roboto truncate">
        {cardLabel}
      </span>
      <Metric value={value} unit={unit} label={label} size={size} />
    </div>
  );
};

export interface ThreeMetricsProps {
  highestScore: { score: number | string; dateOrLabel: string };
  firstPeriod: { score: number | string; dateOrLabel: string };
  latestPeriod: { score: number | string; dateOrLabel: string };
}

export const ThreeMetrics: React.FC<ThreeMetricsProps> = ({
  highestScore,
  firstPeriod,
  latestPeriod,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2 w-full">
      <MiniMetricCard
        cardLabel="Highest score"
        value={highestScore.score}
        label={highestScore.dateOrLabel}
      />
      <MiniMetricCard
        cardLabel="First recorded"
        value={firstPeriod.score}
        label={firstPeriod.dateOrLabel}
      />
      <MiniMetricCard
        cardLabel="Latest recorded"
        value={latestPeriod.score}
        label={latestPeriod.dateOrLabel}
      />
    </div>
  );
};
