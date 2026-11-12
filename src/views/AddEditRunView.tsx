import React, { useState, useEffect } from 'react';
import { RunActivity } from '../types/run';
import {
  calculateScore,
  checkTimeOverlap,
  formatDuration,
  formatPace,
  parseDurationToSeconds,
  parsePaceToSeconds,
} from '../utils/calculations';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { InlineMessage } from '../components/ui/InlineMessage';

interface AddEditRunViewProps {
  onBack: () => void;
  onSave: (run: RunActivity) => void;
  existingRuns: RunActivity[];
  initialRun?: RunActivity | null;
}

export const AddEditRunView: React.FC<AddEditRunViewProps> = ({
  onBack,
  onSave,
  existingRuns,
  initialRun,
}) => {
  const isEditing = Boolean(initialRun);

  // Form states
  const [title, setTitle] = useState('Outdoor Run');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('2026-11-12');
  const [time, setTime] = useState('01:23:59');
  const [distanceKmStr, setDistanceKmStr] = useState('12.24');
  const [durationStr, setDurationStr] = useState('01:21:51');
  const [paceStr, setPaceStr] = useState("8'15\"");
  const [avgHeartRateStr, setAvgHeartRateStr] = useState('163');
  const [elevationGainStr, setElevationGainStr] = useState('812');
  const [cadenceStr, setCadenceStr] = useState('172');

  const [overlapError, setOverlapError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset or prefill on mount / initialRun change
  useEffect(() => {
    if (initialRun) {
      setTitle(initialRun.title || 'Outdoor Run');
      setDescription(initialRun.description || '');
      setLocation(initialRun.location || '');
      setDate(initialRun.date);
      setTime(initialRun.time.length === 5 ? `${initialRun.time}:00` : initialRun.time);
      setDistanceKmStr(initialRun.distance.toString());
      setDurationStr(formatDuration(initialRun.duration));
      setPaceStr(formatPace(initialRun.pace));
      setAvgHeartRateStr(initialRun.avgHeartRate ? initialRun.avgHeartRate.toString() : '');
      setElevationGainStr(initialRun.elevationGain != null ? initialRun.elevationGain.toString() : '');
      setCadenceStr(initialRun.cadence != null ? initialRun.cadence.toString() : '');
    } else {
      const now = new Date();
      setTitle('Outdoor Run');
      setDescription('');
      setLocation('');
      setDate(now.toISOString().split('T')[0]);
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);
      setDistanceKmStr('12.24');
      setDurationStr('01:21:51');
      setPaceStr("8'15\"");
      setAvgHeartRateStr('163');
      setElevationGainStr('812');
      setCadenceStr('172');
    }
    setOverlapError(null);
    setErrors({});
  }, [initialRun]);

  // Synchronized field handlers
  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDistanceKmStr(val);
    const dist = parseFloat(val);
    const durSec = parseDurationToSeconds(durationStr);

    if (!isNaN(dist) && dist > 0 && durSec > 0) {
      const newPaceSec = Math.round(durSec / dist);
      setPaceStr(formatPace(newPaceSec));
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDurationStr(val);
    const durSec = parseDurationToSeconds(val);
    const dist = parseFloat(distanceKmStr);

    if (durSec > 0 && !isNaN(dist) && dist > 0) {
      const newPaceSec = Math.round(durSec / dist);
      setPaceStr(formatPace(newPaceSec));
    }
  };

  const handlePaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPaceStr(val);
    const cleanPace = val.replace(/[’”"]/g, '');
    const paceSec = parsePaceToSeconds(cleanPace);
    const durSec = parseDurationToSeconds(durationStr);

    if (paceSec > 0 && durSec > 0) {
      const newDistance = Math.round((durSec / paceSec) * 100) / 100;
      setDistanceKmStr(newDistance.toFixed(2));
    }
  };

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return 'Select date';
    const d = new Date(`${dateString}T12:00:00`);
    if (isNaN(d.getTime())) return dateString;
    return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOverlapError(null);
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!date) newErrors.date = 'Date is required';
    if (!time) newErrors.time = 'Time is required';

    const dist = parseFloat(distanceKmStr);
    if (isNaN(dist) || dist <= 0) newErrors.distance = 'Valid distance required';

    const durSec = parseDurationToSeconds(durationStr);
    if (durSec <= 0) newErrors.duration = 'Valid duration required';

    const hr = parseInt(avgHeartRateStr, 10);
    if (!avgHeartRateStr || isNaN(hr) || hr <= 0) {
      newErrors.heartRate = 'Average heart rate is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check time overlap
    const { overlaps, conflictingRun } = checkTimeOverlap(
      existingRuns,
      { date, time: time.slice(0, 5), duration: durSec },
      initialRun?.id
    );

    if (overlaps && conflictingRun) {
      setOverlapError(
        `Time conflict: overlaps with "${conflictingRun.title}" at ${conflictingRun.time} on ${conflictingRun.date}.`
      );
      return;
    }

    const calculatedScore = calculateScore(dist, durSec, hr);
    const paceSec = Math.round(durSec / dist);

    const savedActivity: RunActivity = {
      id: initialRun ? initialRun.id : `run-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim(),
      description: description.trim() || undefined,
      location: location.trim() || undefined,
      date,
      time: time.slice(0, 8),
      distance: dist,
      duration: durSec,
      pace: paceSec,
      avgHeartRate: hr,
      score: calculatedScore,
      elevationGain: elevationGainStr ? parseInt(elevationGainStr, 10) : null,
      cadence: cadenceStr ? parseInt(cadenceStr, 10) : null,
      createdAt: initialRun ? initialRun.createdAt : new Date().toISOString(),
    };

    onSave(savedActivity);
  };

  return (
    <div className="w-full flex flex-col gap-5 max-w-md mx-auto pt-2 pb-12 font-roboto animate-in fade-in duration-150">
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
        <h1 className="text-lg font-medium text-white font-roboto">
          {isEditing ? 'Edit Run' : 'Add New Run'}
        </h1>
      </div>

      {/* Overlap Error notice */}
      {overlapError && (
        <InlineMessage
          type="Error"
          title="Overlap Detected"
          description={overlapError}
        />
      )}

      {/* Form matching Add_New_Run_1aabb582.png */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white font-roboto">
            Title <span className="text-[#4963F4]">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Outdoor Run"
            className={`w-full bg-[#27272F] border ${
              errors.title ? 'border-[#BA4949]' : 'border-[#303037]'
            } focus:border-[#4963F4] rounded-xl px-4 py-3.5 text-sm text-[#E3E4E9] outline-none transition-colors placeholder:text-[#87878F]`}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white font-roboto">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter Description"
            className="w-full bg-[#27272F] border border-[#303037] focus:border-[#4963F4] rounded-xl px-4 py-3.5 text-sm text-[#E3E4E9] outline-none transition-colors placeholder:text-[#87878F]"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white font-roboto">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your location run"
            className="w-full bg-[#27272F] border border-[#303037] focus:border-[#4963F4] rounded-xl px-4 py-3.5 text-sm text-[#E3E4E9] outline-none transition-colors placeholder:text-[#87878F]"
          />
        </div>

        {/* Date & Time Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white font-roboto">
              Date <span className="text-[#4963F4]">*</span>
            </label>
            <div className="relative flex items-center justify-between bg-[#27272F] border border-[#303037] focus-within:border-[#4963F4] rounded-xl px-4 py-3.5 cursor-pointer">
              <span className="text-sm text-[#E3E4E9]">
                {formatDateDisplay(date)}
              </span>
              <ChevronDown className="w-4 h-4 text-[#87878F] pointer-events-none" />
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
          </div>

          {/* Time */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white font-roboto">
              Time <span className="text-[#4963F4]">*</span>
            </label>
            <div className="relative flex items-center justify-between bg-[#27272F] border border-[#303037] focus-within:border-[#4963F4] rounded-xl px-4 py-3.5 cursor-pointer">
              <span className="text-sm text-[#E3E4E9]">
                {time || '01:23:59'}
              </span>
              <ChevronDown className="w-4 h-4 text-[#87878F] pointer-events-none" />
              <input
                type="time"
                step="1"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Distance */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white font-roboto">
            Distance <span className="text-[#4963F4]">*</span>
          </label>
          <div className="relative flex items-center bg-[#27272F] border border-[#303037] focus-within:border-[#4963F4] rounded-xl px-4 py-3.5">
            <input
              type="number"
              step="0.01"
              required
              value={distanceKmStr}
              onChange={handleDistanceChange}
              placeholder="12.24"
              className="w-full bg-transparent text-sm text-[#E3E4E9] outline-none pr-8 placeholder:text-[#87878F]"
            />
            <span className="absolute right-4 text-sm text-[#87878F]">km</span>
          </div>
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white font-roboto">
            Duration <span className="text-[#4963F4]">*</span>
          </label>
          <div className="relative flex items-center bg-[#27272F] border border-[#303037] focus-within:border-[#4963F4] rounded-xl px-4 py-3.5">
            <input
              type="text"
              required
              value={durationStr}
              onChange={handleDurationChange}
              placeholder="01:21:51"
              className="w-full bg-transparent text-sm text-[#E3E4E9] outline-none pr-8 placeholder:text-[#87878F]"
            />
            <ChevronDown className="absolute right-4 w-4 h-4 text-[#87878F] pointer-events-none" />
          </div>
        </div>

        {/* Pace */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white font-roboto">
            Pace <span className="text-[#4963F4]">*</span>
          </label>
          <div className="relative flex items-center bg-[#27272F] border border-[#303037] focus-within:border-[#4963F4] rounded-xl px-4 py-3.5">
            <input
              type="text"
              required
              value={paceStr}
              onChange={handlePaceChange}
              placeholder="8'15&quot;"
              className="w-full bg-transparent text-sm text-[#E3E4E9] outline-none pr-20 placeholder:text-[#87878F]"
            />
            <span className="absolute right-4 text-sm text-[#87878F]">min / km</span>
          </div>
        </div>

        {/* Bottom 3 Columns: Avg. Heart Rate, Elevation Gain, Cadence */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Avg. Heart Rate */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white font-roboto truncate">
              Avg. Heart Rate <span className="text-[#4963F4]">*</span>
            </label>
            <div className="relative flex items-center bg-[#27272F] border border-[#303037] focus-within:border-[#4963F4] rounded-xl px-3 py-3.5">
              <input
                type="number"
                required
                value={avgHeartRateStr}
                onChange={(e) => setAvgHeartRateStr(e.target.value)}
                placeholder="163"
                className="w-full bg-transparent text-sm text-[#E3E4E9] outline-none pr-8 placeholder:text-[#87878F]"
              />
              <span className="absolute right-2.5 text-xs text-[#87878F]">bpm</span>
            </div>
          </div>

          {/* Elevation Gain */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white font-roboto truncate">
              Elevation Gain
            </label>
            <div className="relative flex items-center bg-[#27272F] border border-[#303037] focus-within:border-[#4963F4] rounded-xl px-3 py-3.5">
              <input
                type="number"
                value={elevationGainStr}
                onChange={(e) => setElevationGainStr(e.target.value)}
                placeholder="812"
                className="w-full bg-transparent text-sm text-[#E3E4E9] outline-none pr-5 placeholder:text-[#87878F]"
              />
              <span className="absolute right-2.5 text-xs text-[#87878F]">m</span>
            </div>
          </div>

          {/* Cadence */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white font-roboto truncate">
              Cadence
            </label>
            <div className="relative flex items-center bg-[#27272F] border border-[#303037] focus-within:border-[#4963F4] rounded-xl px-3 py-3.5">
              <input
                type="number"
                value={cadenceStr}
                onChange={(e) => setCadenceStr(e.target.value)}
                placeholder="172"
                className="w-full bg-transparent text-sm text-[#E3E4E9] outline-none pr-8 placeholder:text-[#87878F]"
              />
              <span className="absolute right-2.5 text-xs text-[#87878F]">spm</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full mt-3">
          <button
            type="submit"
            className="w-full bg-[#4963F4] hover:bg-[#3d54d9] text-white py-3.5 rounded-full font-medium text-base shadow-sm transition-all cursor-pointer active:scale-[0.98]"
          >
            {isEditing ? 'Save Changes' : 'Add Run'}
          </button>
        </div>
      </form>
    </div>
  );
};
