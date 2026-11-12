export interface RunActivity {
  id: string;
  title: string;
  description?: string;
  location?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  distance: number; // in kilometers, e.g. 6.98
  duration: number; // moving time in seconds, e.g. 3207
  pace: number; // in seconds per kilometer (e.g. 460 = 7'40")
  avgHeartRate: number | null; // bpm
  score: number | null; // Speed (m/min) * 100 / Avg HR
  elevationGain?: number | null; // meters
  cadence?: number | null; // spm
  createdAt: string;
}

export type TimeGroup = 'day' | 'week' | 'month' | 'quarter' | 'year';

export type ChartMetric = 'score' | 'distance' | 'pace' | 'duration' | 'heart-rate' | 'runs';
export type ChartMode = ChartMetric;

export interface PeriodSummary {
  key: string;
  label: string; // e.g. "19 Oct - 25 Oct, 2026"
  shortLabel: string; // e.g. "25 OCT" or "OCT"
  startDate: string; // ISO
  endDate: string; // ISO
  runCount: number;
  eligibleScoreCount: number;
  avgScore: number | null;
  totalDistance: number; // km
  totalDuration: number; // seconds
  avgPace: number; // seconds per km
  avgHeartRate: number | null; // bpm
  runs: RunActivity[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

