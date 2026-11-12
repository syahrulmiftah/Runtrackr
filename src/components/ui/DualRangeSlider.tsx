import React, { useRef } from 'react';

export interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  minValue: number;
  maxValue: number;
  onChange: (minValue: number, maxValue: number) => void;
}

/**
 * Reusable DualRangeSlider component:
 * - 2 knobs for lower and upper limits
 * - Thin 2px track
 * - Blue active line connecting the two knobs
 * - 5px outside white stroke on knobs for larger visual touch presence
 * - Robust mobile touch & desktop pointer capture
 */
export const DualRangeSlider: React.FC<DualRangeSliderProps> = ({
  min,
  max,
  step = 0.5,
  minValue,
  maxValue,
  onChange,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingLower = useRef(false);
  const isDraggingUpper = useRef(false);

  const range = Math.max(0.1, max - min);
  const lowerPercent = Math.max(0, Math.min(100, ((minValue - min) / range) * 100));
  const upperPercent = Math.max(0, Math.min(100, ((maxValue - min) / range) * 100));

  const getValueFromClientX = (clientX: number): number => {
    if (!trackRef.current) return min;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawVal = min + ratio * range;
    return Math.round(rawVal / step) * step;
  };

  // Lower Knob Drag Handlers
  const handleLowerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    isDraggingLower.current = true;
  };

  const handleLowerMove = (e: React.PointerEvent) => {
    if (!isDraggingLower.current) return;
    e.stopPropagation();
    const val = getValueFromClientX(e.clientX);
    const clamped = Math.max(min, Math.min(val, maxValue - step));
    onChange(clamped, maxValue);
  };

  const handleLowerUp = (e: React.PointerEvent) => {
    if (isDraggingLower.current) {
      e.stopPropagation();
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      isDraggingLower.current = false;
    }
  };

  // Upper Knob Drag Handlers
  const handleUpperDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    isDraggingUpper.current = true;
  };

  const handleUpperMove = (e: React.PointerEvent) => {
    if (!isDraggingUpper.current) return;
    e.stopPropagation();
    const val = getValueFromClientX(e.clientX);
    const clamped = Math.min(max, Math.max(val, minValue + step));
    onChange(minValue, clamped);
  };

  const handleUpperUp = (e: React.PointerEvent) => {
    if (isDraggingUpper.current) {
      e.stopPropagation();
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      isDraggingUpper.current = false;
    }
  };

  // Tap on track to jump closest knob
  const handleTrackPointerDown = (e: React.PointerEvent) => {
    const val = getValueFromClientX(e.clientX);
    const distToLower = Math.abs(val - minValue);
    const distToUpper = Math.abs(val - maxValue);

    if (distToLower <= distToUpper) {
      const clamped = Math.max(min, Math.min(val, maxValue - step));
      onChange(clamped, maxValue);
    } else {
      const clamped = Math.min(max, Math.max(val, minValue + step));
      onChange(minValue, clamped);
    }
  };

  return (
    <div
      ref={trackRef}
      onPointerDown={handleTrackPointerDown}
      className="relative w-full h-7 flex items-center cursor-pointer select-none touch-none px-2"
    >
      {/* Background thin track (2px) */}
      <div className="absolute left-2 right-2 h-[2px] bg-[#27272F] rounded-full" />

      {/* Active blue line between the two knobs (2px) */}
      <div
        className="absolute h-[2px] bg-[#4963F4] rounded-full"
        style={{
          left: `calc(8px + (100% - 16px) * ${lowerPercent / 100})`,
          width: `calc((100% - 16px) * ${(upperPercent - lowerPercent) / 100})`,
        }}
      />

      {/* Lower Limit Knob with 2px outside white stroke */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none z-10"
        style={{
          left: `calc(8px + (100% - 16px) * ${lowerPercent / 100})`,
        }}
        onPointerDown={handleLowerDown}
        onPointerMove={handleLowerMove}
        onPointerUp={handleLowerUp}
        onPointerCancel={handleLowerUp}
        role="slider"
        aria-label="Lower distance limit"
        aria-valuenow={minValue}
        aria-valuemin={min}
        aria-valuemax={maxValue}
      >
        <div className="w-3 h-3 bg-[#4963F4] rounded-full ring-[2px] ring-white shadow-sm transition-transform active:scale-110" />
      </div>

      {/* Upper Limit Knob with 2px outside white stroke */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none z-20"
        style={{
          left: `calc(8px + (100% - 16px) * ${upperPercent / 100})`,
        }}
        onPointerDown={handleUpperDown}
        onPointerMove={handleUpperMove}
        onPointerUp={handleUpperUp}
        onPointerCancel={handleUpperUp}
        role="slider"
        aria-label="Upper distance limit"
        aria-valuenow={maxValue}
        aria-valuemin={minValue}
        aria-valuemax={max}
      >
        <div className="w-3 h-3 bg-[#4963F4] rounded-full ring-[2px] ring-white shadow-sm transition-transform active:scale-110" />
      </div>
    </div>
  );
};
