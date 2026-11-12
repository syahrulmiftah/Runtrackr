import React from 'react';
import { TimeGroup } from '../../types/run';

export interface TimeGroupSelectionProps {
  value: TimeGroup;
  onChange: (value: TimeGroup) => void;
}

const TABS: { key: TimeGroup; label: string }[] = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Weekly' },
  { key: 'month', label: 'Monthly' },
  { key: 'quarter', label: 'Quarterly' },
  { key: 'year', label: 'Yearly' },
];

export const TimeGroupSelection: React.FC<TimeGroupSelectionProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="w-full bg-[#27272F] p-1 rounded-full flex items-center justify-between border border-[#303037]">
      {TABS.map((tab) => {
        const isActive = value === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`flex-1 py-1.5 px-2 text-xs font-roboto rounded-full text-center transition-all cursor-pointer ${
              isActive
                ? 'bg-[#4963F4] text-[#E3E4E9] font-medium shadow-sm'
                : 'text-[#87878F] hover:text-[#E3E4E9] bg-transparent'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
