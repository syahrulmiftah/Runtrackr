import { PeriodSummary, RunActivity, TimeGroup } from '../types/run';

/**
 * Calculates Runtrackr physiological performance score:
 * Excel Formula: =(J / K) * (100 / M)
 * where:
 *   J = Distance in km
 *   K = Duration in days (seconds / 86400, standard Excel time serial format)
 *   M = Average Heart Rate (bpm)
 *
 * Mathematically:
 * Score = (Distance_km / (Duration_seconds / 86400)) * (100 / Avg_HeartRate)
 *       = (Distance_km * 8,640,000) / (Duration_seconds * Avg_HeartRate)
 */
export function calculateScore(
  distanceKm: number,
  durationSeconds: number,
  avgHeartRate: number | null
): number | null {
  if (!avgHeartRate || avgHeartRate <= 0 || distanceKm <= 0 || durationSeconds <= 0) {
    return null;
  }
  const excelTimeInDays = durationSeconds / 86400;
  const speedKmPerDay = distanceKm / excelTimeInDays;
  const score = speedKmPerDay * (100 / avgHeartRate);
  return Math.round(score * 100) / 100;
}

/**
 * Converts pace in seconds/km to human display: 8’15”
 */
export function formatPace(secondsPerKm: number): string {
  if (!secondsPerKm || isNaN(secondsPerKm) || !isFinite(secondsPerKm) || secondsPerKm <= 0) {
    return "0’00”";
  }
  const mins = Math.floor(secondsPerKm / 60);
  const secs = Math.round(secondsPerKm % 60);
  if (secs === 60) {
    return `${mins + 1}’00”`;
  }
  return `${mins}’${secs.toString().padStart(2, '0')}”`;
}

/**
 * Parses user pace input ("8'15", "8:15", "8'15\"") to total seconds per km.
 */
export function parsePaceToSeconds(paceStr: string): number {
  if (!paceStr) return 0;
  const clean = paceStr.replace(/[’”"]/g, ':').replace(/[^0-9:]/g, '');
  const parts = clean.split(':').map((p) => parseInt(p, 10));
  if (parts.length === 1 && !isNaN(parts[0])) {
    return parts[0] * 60;
  }
  if (parts.length >= 2) {
    const mins = isNaN(parts[0]) ? 0 : parts[0];
    const secs = isNaN(parts[1]) ? 0 : parts[1];
    return mins * 60 + secs;
  }
  return 0;
}

/**
 * Formats duration seconds to HH:MM:SS or MM:SS
 */
export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds <= 0) return '00:00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Parses HH:MM:SS or MM:SS to seconds
 */
export function parseDurationToSeconds(durationStr: string): number {
  if (!durationStr) return 0;
  const parts = durationStr.trim().split(':').map((p) => parseInt(p, 10) || 0);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 1) {
    return parts[0] * 60;
  }
  return 0;
}

/**
 * Checks if a candidate run time interval overlaps with any existing run.
 * Interval: [startTime, startTime + duration]
 */
export function checkTimeOverlap(
  runs: RunActivity[],
  candidate: { date: string; time: string; duration: number },
  excludeId?: string
): { overlaps: boolean; conflictingRun?: RunActivity } {
  const candidateStart = new Date(`${candidate.date}T${candidate.time}`).getTime();
  if (isNaN(candidateStart)) return { overlaps: false };
  const candidateEnd = candidateStart + candidate.duration * 1000;

  for (const run of runs) {
    if (excludeId && run.id === excludeId) continue;
    const runStart = new Date(`${run.date}T${run.time}`).getTime();
    if (isNaN(runStart)) continue;
    const runEnd = runStart + run.duration * 1000;

    // Overlap condition:
    // (candidateStart < runEnd) && (candidateEnd > runStart)
    if (candidateStart < runEnd && candidateEnd > runStart) {
      return { overlaps: true, conflictingRun: run };
    }
  }

  return { overlaps: false };
}

/**
 * Helper to get Monday of the week for a given date
 */
function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const MONTH_NAMES_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Aggregates runs by the chosen time grouping (day, week, month, quarter, year).
 * Results are sorted chronologically ascending.
 */
export function groupActivities(
  runs: RunActivity[],
  timeGroup: TimeGroup
): PeriodSummary[] {
  if (runs.length === 0) return [];

  // Sort runs chronologically
  const sortedRuns = [...runs].sort((a, b) => {
    const timeA = new Date(`${a.date}T${a.time}`).getTime();
    const timeB = new Date(`${b.date}T${b.time}`).getTime();
    return timeA - timeB;
  });

  const groups = new Map<string, {
    key: string;
    label: string;
    shortLabel: string;
    startDate: Date;
    endDate: Date;
    runs: RunActivity[];
  }>();

  for (const run of sortedRuns) {
    const runDate = new Date(`${run.date}T12:00:00`);
    if (isNaN(runDate.getTime())) continue;

    let key = '';
    let label = '';
    let shortLabel = '';
    let startDate = new Date(runDate);
    let endDate = new Date(runDate);

    const year = runDate.getFullYear();
    const month = runDate.getMonth();
    const dateNum = runDate.getDate();

    switch (timeGroup) {
      case 'day': {
        key = run.date;
        label = `${dateNum} ${MONTH_NAMES[month]} ${year}`;
        shortLabel = `${dateNum} ${MONTH_NAMES[month].toUpperCase()}`;
        startDate = new Date(`${run.date}T00:00:00`);
        endDate = new Date(`${run.date}T23:59:59`);
        break;
      }
      case 'week': {
        const monday = getMonday(runDate);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        const mDay = monday.getDate();
        const mMonth = MONTH_NAMES[monday.getMonth()];
        const sDay = sunday.getDate();
        const sMonth = MONTH_NAMES[sunday.getMonth()];
        const sYear = sunday.getFullYear();

        key = `${monday.getFullYear()}-W${Math.ceil(((monday.getTime() - new Date(monday.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7)}`;
        label = `${mDay} ${mMonth} - ${sDay} ${sMonth}, ${sYear}`;
        shortLabel = `${sDay} ${sMonth.toUpperCase()}`;
        startDate = monday;
        endDate = sunday;
        break;
      }
      case 'month': {
        key = `${year}-${(month + 1).toString().padStart(2, '0')}`;
        label = `${MONTH_NAMES_FULL[month]} ${year}`;
        shortLabel = MONTH_NAMES[month].toUpperCase();
        startDate = new Date(year, month, 1);
        endDate = new Date(year, month + 1, 0, 23, 59, 59);
        break;
      }
      case 'quarter': {
        const q = Math.floor(month / 3) + 1;
        key = `${year}-Q${q}`;
        const qMonths = [
          'January–March',
          'April–June',
          'July–September',
          'October–December',
        ];
        label = `Q${q} ${year} (${qMonths[q - 1]})`;
        shortLabel = `Q${q} ${year}`;
        startDate = new Date(year, (q - 1) * 3, 1);
        endDate = new Date(year, q * 3, 0, 23, 59, 59);
        break;
      }
      case 'year': {
        key = `${year}`;
        label = `${year}`;
        shortLabel = `${year}`;
        startDate = new Date(year, 0, 1);
        endDate = new Date(year, 11, 31, 23, 59, 59);
        break;
      }
    }

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        label,
        shortLabel,
        startDate,
        endDate,
        runs: [],
      });
    }

    groups.get(key)!.runs.push(run);
  }

  const summaries: PeriodSummary[] = [];

  for (const group of groups.values()) {
    const totalDistance = group.runs.reduce((acc, r) => acc + r.distance, 0);
    const totalDuration = group.runs.reduce((acc, r) => acc + r.duration, 0);

    const scoredRuns = group.runs.filter((r) => r.score !== null && r.score > 0);
    const avgScore =
      scoredRuns.length > 0
        ? Math.round(
            (scoredRuns.reduce((acc, r) => acc + (r.score ?? 0), 0) /
              scoredRuns.length) *
              100
          ) / 100
        : null;

    const hrRuns = group.runs.filter((r) => r.avgHeartRate !== null && r.avgHeartRate > 0);
    const avgHeartRate =
      hrRuns.length > 0
        ? Math.round(
            hrRuns.reduce((acc, r) => acc + (r.avgHeartRate ?? 0), 0) / hrRuns.length
          )
        : null;

    const avgPace = totalDistance > 0 ? Math.round(totalDuration / totalDistance) : 0;

    summaries.push({
      key: group.key,
      label: group.label,
      shortLabel: group.shortLabel,
      startDate: group.startDate.toISOString(),
      endDate: group.endDate.toISOString(),
      runCount: group.runs.length,
      eligibleScoreCount: scoredRuns.length,
      avgScore,
      totalDistance: Math.round(totalDistance * 100) / 100,
      totalDuration,
      avgPace,
      avgHeartRate,
      runs: group.runs,
    });
  }

  // Return chronologically sorted
  return summaries.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
}
