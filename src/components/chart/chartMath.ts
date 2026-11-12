export interface ChartPoint {
  index: number;
  key: string;
  label: string;
  shortLabel: string;
  value: number | null; // null if skipped in score mode
  displayValue: string;
  x: number;
  y: number;
}

/**
 * Computes min, max and Y-coordinate scaling for data points.
 */
export function computeYScale(
  values: (number | null)[],
  height: number,
  paddingTop: number = 24,
  paddingBottom: number = 24,
  formatTick?: (val: number) => string
): {
  min: number;
  max: number;
  scaleY: (val: number | null) => number;
  yTicks: { value: number; y: number; label: string }[];
} {
  const validValues = values.filter((v): v is number => v !== null && !isNaN(v));

  const formatLabel = (v: number) => (formatTick ? formatTick(v) : Math.round(v).toString());

  if (validValues.length === 0) {
    const defaultMid = height / 2;
    return {
      min: 0,
      max: 100,
      scaleY: () => defaultMid,
      yTicks: [
        { value: 100, y: paddingTop, label: formatLabel(100) },
        { value: 50, y: defaultMid, label: formatLabel(50) },
        { value: 0, y: height - paddingBottom, label: formatLabel(0) },
      ],
    };
  }

  let min = Math.min(...validValues);
  let max = Math.max(...validValues);

  // If min == max, expand range
  if (min === max) {
    min = Math.max(0, min - 10);
    max = max + 10;
  } else {
    // Add 10% breathing room to top and bottom
    const range = max - min;
    max = Math.ceil(max + range * 0.1);
    min = Math.max(0, Math.floor(min - range * 0.1));
  }

  const plotHeight = height - paddingTop - paddingBottom;

  const scaleY = (val: number | null) => {
    if (val === null || isNaN(val)) return height - paddingBottom;
    const norm = (val - min) / (max - min);
    return height - paddingBottom - norm * plotHeight;
  };

  const mid = Math.round((min + max) / 2);
  const yTicks = [
    { value: max, y: scaleY(max), label: formatLabel(max) },
    { value: mid, y: scaleY(mid), label: formatLabel(mid) },
    { value: min, y: scaleY(min), label: formatLabel(min) },
  ];

  return { min, max, scaleY, yTicks };
}

/**
 * Returns a slice of at most windowSize (12) items starting from windowOffset.
 * windowOffset is clamped so the window doesn't go out of bounds.
 */
export function getVisibleWindow<T>(
  items: T[],
  windowOffset: number,
  windowSize: number = 12
): {
  visibleItems: T[];
  clampedOffset: number;
  hasLeft: boolean;
  hasRight: boolean;
} {
  if (items.length <= windowSize) {
    return {
      visibleItems: items,
      clampedOffset: 0,
      hasLeft: false,
      hasRight: false,
    };
  }

  const maxOffset = items.length - windowSize;
  const clampedOffset = Math.max(0, Math.min(windowOffset, maxOffset));
  const visibleItems = items.slice(clampedOffset, clampedOffset + windowSize);

  return {
    visibleItems,
    clampedOffset,
    hasLeft: clampedOffset > 0,
    hasRight: clampedOffset < maxOffset,
  };
}

/**
 * Finds index of nearest point given a touch/mouse X position.
 */
export function findNearestPointIndex(clientX: number, pointsX: number[]): number {
  if (pointsX.length === 0) return -1;
  let nearestIdx = 0;
  let minDiff = Infinity;

  for (let i = 0; i < pointsX.length; i++) {
    const diff = Math.abs(clientX - pointsX[i]);
    if (diff < minDiff) {
      minDiff = diff;
      nearestIdx = i;
    }
  }

  return nearestIdx;
}

/**
 * Generates SVG path string connecting points with straight line segments matching Figma.
 */
export function generateSvgPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }
  return path;
}

/**
 * Generates closed SVG area path under the points down to the baseline.
 */
export function generateAreaPath(
  points: { x: number; y: number }[],
  bottomY: number
): string {
  if (points.length < 2) return '';
  const first = points[0];
  const last = points[points.length - 1];

  let path = `M ${first.x} ${bottomY} L ${first.x} ${first.y}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }
  path += ` L ${last.x} ${bottomY} Z`;
  return path;
}
