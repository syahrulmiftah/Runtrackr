import React from 'react';

export interface ScoreBadgeProps {
  score: number | null;
  minScore?: number;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Calculates dynamic 5-color scale (Red -> Orange -> Yellow -> Lime -> Green)
 * based on minimum and maximum scores, matching Excel's conditional formatting color scale.
 */
export function getScoreColorScale(
  score: number | null,
  minScore: number = 70,
  maxScore: number = 130
): {
  color: string;
  bgRgba: string;
} {
  if (score === null || score === undefined || isNaN(score) || score <= 0) {
    return {
      color: '#BA4949',
      bgRgba: 'rgba(186, 73, 73, 0.24)',
    };
  }

  const range = maxScore - minScore;
  const t = range > 0 ? Math.max(0, Math.min(1, (score - minScore) / range)) : 1;

  // 5-color scale: Red -> Orange -> Yellow -> Lime -> Green
  const stops = [
    { t: 0.00, r: 239, g: 68, b: 68 },   // Red #EF4444
    { t: 0.25, r: 249, g: 115, b: 22 },  // Orange #F97316
    { t: 0.50, r: 234, g: 179, b: 8 },   // Yellow #EAB308
    { t: 0.75, r: 132, g: 204, b: 22 },  // Lime #84CC16
    { t: 1.00, r: 34, g: 197, b: 94 },   // Green #22C55E
  ];

  let lower = stops[0];
  let upper = stops[stops.length - 1];

  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i].t && t <= stops[i + 1].t) {
      lower = stops[i];
      upper = stops[i + 1];
      break;
    }
  }

  const factor = upper.t === lower.t ? 0 : (t - lower.t) / (upper.t - lower.t);
  const r = Math.round(lower.r + (upper.r - lower.r) * factor);
  const g = Math.round(lower.g + (upper.g - lower.g) * factor);
  const b = Math.round(lower.b + (upper.b - lower.b) * factor);

  return {
    color: `rgb(${r}, ${g}, ${b})`,
    bgRgba: `rgba(${r}, ${g}, ${b}, 0.24)`,
  };
}

/**
 * ScoreBadge Component with dynamic 5-color scale.
 * Number uses solid color; background uses identical color at 24% opacity.
 */
export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  minScore = 70,
  maxScore = 130,
  size = 'md',
  className = '',
}) => {
  const { color, bgRgba } = getScoreColorScale(score, minScore, maxScore);

  const sizeClasses =
    size === 'sm'
      ? 'w-8 h-8 text-xs rounded-lg'
      : size === 'lg'
      ? 'w-14 h-14 text-lg rounded-2xl'
      : 'w-11 h-11 text-base rounded-xl';

  return (
    <div
      className={`aspect-square flex-shrink-0 inline-flex items-center justify-center font-anton transition-colors select-none ${sizeClasses} ${className}`}
      style={{
        backgroundColor: bgRgba,
        color: color,
      }}
    >
      <span className="tracking-wide font-anton leading-none">
        {score !== null && score > 0 ? Math.round(score) : '-'}
      </span>
    </div>
  );
};
