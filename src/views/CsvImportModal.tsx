import React, { useRef, useState } from 'react';
import { RunActivity } from '../types/run';
import { calculateScore, checkTimeOverlap } from '../utils/calculations';
import { Upload, X } from 'lucide-react';
import { InlineMessage } from '../components/ui/InlineMessage';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (runs: RunActivity[], skippedCount: number, noHrCount: number) => void;
  existingRuns: RunActivity[];
  onLearnMore?: () => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  existingRuns,
  onLearnMore,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const parseCsvText = (text: string) => {
    const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) {
      throw new Error('CSV file appears to be empty or has no data rows.');
    }

    const parseLine = (line: string): string[] => {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      return values;
    };

    const header = parseLine(lines[0]).map((h) => h.replace(/^["']|["']$/g, '').trim());

    // Locate column indices
    const colActivityType = header.findIndex((h) => /^Activity Type$/i.test(h));
    const colActivityDate = header.findIndex((h) => /^Activity Date$/i.test(h));
    const colActivityName = header.findIndex((h) => /^Activity Name$/i.test(h));
    const colActivityDesc = header.findIndex((h) => /^Activity Description$/i.test(h));
    let colDistance = header.findIndex((h) => /^Distance\.1$/i.test(h));
    if (colDistance === -1) {
      colDistance = header.findIndex((h) => /^Distance$/i.test(h));
    }
    const colMovingTime = header.findIndex((h) => /^Moving Time$/i.test(h));
    const colHeartRate = header.findIndex((h) => /^Average Heart Rate$/i.test(h));
    const colElevation = header.findIndex((h) => /^Elevation Gain$/i.test(h));
    const colCadence = header.findIndex((h) => /^Average Cadence$/i.test(h));

    if (colActivityDate === -1 || colDistance === -1 || colMovingTime === -1) {
      throw new Error('Missing required Strava columns: Activity Date, Distance, and Moving Time.');
    }

    const importedActivities: RunActivity[] = [];
    let skippedCount = 0;
    let noHrCount = 0;
    const accumulatedRuns = [...existingRuns];

    for (let i = 1; i < lines.length; i++) {
      const row = parseLine(lines[i]);
      if (row.length < 3) continue;

      // Filter: Only 'Run'
      if (colActivityType !== -1) {
        const typeVal = row[colActivityType]?.replace(/^["']|["']$/g, '');
        if (typeVal && !/^Run$/i.test(typeVal)) {
          skippedCount++;
          continue;
        }
      }

      // Parse date & time
      const rawDate = row[colActivityDate]?.replace(/^["']|["']$/g, '');
      const parsedDate = new Date(rawDate);
      if (isNaN(parsedDate.getTime())) {
        skippedCount++;
        continue;
      }

      if (parsedDate.getTime() > Date.now()) {
        skippedCount++;
        continue;
      }

      const dateStr = parsedDate.toISOString().split('T')[0];
      const hours = parsedDate.getHours().toString().padStart(2, '0');
      const minutes = parsedDate.getMinutes().toString().padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;

      // Distance (meters to km)
      const rawDist = parseFloat(row[colDistance]?.replace(/,/g, ''));
      if (isNaN(rawDist) || rawDist <= 0) {
        skippedCount++;
        continue;
      }
      const distanceKm = rawDist > 100 ? rawDist / 1000 : rawDist;

      // Moving duration in seconds
      const durationSec = Math.round(parseFloat(row[colMovingTime]?.replace(/,/g, '')));
      if (isNaN(durationSec) || durationSec <= 0) {
        skippedCount++;
        continue;
      }

      // Check overlap
      const { overlaps } = checkTimeOverlap(accumulatedRuns, {
        date: dateStr,
        time: timeStr,
        duration: durationSec,
      });

      if (overlaps) {
        skippedCount++;
        continue;
      }

      // Heart Rate
      let avgHeartRate: number | null = null;
      if (colHeartRate !== -1) {
        const rawHr = parseFloat(row[colHeartRate]);
        if (!isNaN(rawHr) && rawHr > 0) {
          avgHeartRate = Math.round(rawHr);
        }
      }

      if (!avgHeartRate) {
        noHrCount++;
      }

      const title =
        colActivityName !== -1 && row[colActivityName]
          ? row[colActivityName].replace(/^["']|["']$/g, '').trim() || 'Outdoor run'
          : 'Outdoor run';

      const desc =
        colActivityDesc !== -1 && row[colActivityDesc]
          ? row[colActivityDesc].replace(/^["']|["']$/g, '').trim()
          : undefined;

      const elev =
        colElevation !== -1 ? Math.round(parseFloat(row[colElevation])) : null;
      const cad =
        colCadence !== -1 ? Math.round(parseFloat(row[colCadence])) : null;

      const score = calculateScore(distanceKm, durationSec, avgHeartRate);
      const paceSec = Math.round(durationSec / distanceKm);

      const newRun: RunActivity = {
        id: `csv-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        title,
        description: desc || undefined,
        date: dateStr,
        time: timeStr,
        distance: Math.round(distanceKm * 100) / 100,
        duration: durationSec,
        pace: paceSec,
        avgHeartRate,
        score,
        elevationGain: isNaN(elev as number) ? null : elev,
        cadence: isNaN(cad as number) ? null : cad,
        createdAt: parsedDate.toISOString(),
      };

      importedActivities.push(newRun);
      accumulatedRuns.push(newRun);
    }

    return { importedActivities, skippedCount, noHrCount };
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a valid .csv file exported from Strava.');
      return;
    }

    setIsProcessing(true);
    try {
      const text = await file.text();
      const { importedActivities, skippedCount, noHrCount } = parseCsvText(text);

      if (importedActivities.length === 0) {
        throw new Error('No valid running activities were found in the uploaded CSV.');
      }

      onImportSuccess(importedActivities, skippedCount, noHrCount);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to parse CSV file.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[340px] bg-[#19191F] border border-[#2E2E37] rounded-3xl pt-10 pb-6 px-6 flex flex-col items-center text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#87878F] hover:text-[#E3E4E9] p-1.5 rounded-full transition-colors cursor-pointer z-10"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5 stroke-[1.8]" />
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Dashed Upload Box matching Popup_-_Upload_Activity_059557ef.png with spacious padding */}
        <div className="w-full border border-dashed border-[#3C3C45] rounded-2xl py-8 px-5 flex flex-col items-center justify-center text-center gap-2 bg-transparent my-3">
          <Upload className="w-8 h-8 text-white stroke-[1.8] mb-1" />

          <h3 className="text-base font-bold text-white font-roboto">
            Upload Your Strava Activity
          </h3>
          <p className="text-sm text-[#87878F] font-roboto">
            Supports: CSV
          </p>

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-[#4963F4] hover:bg-[#3d54d9] text-white py-3.5 rounded-full font-medium text-base shadow-sm mt-4 transition-colors cursor-pointer active:scale-[0.98] disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Select File'}
          </button>
        </div>

        {/* Error message if parsing failed */}
        {error && (
          <div className="w-full mb-2">
            <InlineMessage
              type="Error"
              title="Import Failed"
              description={error}
            />
          </div>
        )}

        {/* Bottom Note with Learn more link */}
        <p className="text-xs text-[#87878F] font-roboto leading-5 mt-2">
          Currently we only support import from Strava CSV.{' '}
          {onLearnMore ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onLearnMore();
              }}
              className="underline text-[#87878F] hover:text-white cursor-pointer font-medium transition-colors"
            >
              Learn more
            </button>
          ) : (
            <span className="underline">Learn more</span>
          )}
        </p>
      </div>
    </div>
  );
};
