import React from 'react';

export interface LineTabOption<T extends string = string> {
  id: T;
  label: string;
}

interface LineTabsProps<T extends string = string> {
  tabs: LineTabOption<T>[];
  activeId: T;
  onChange: (id: T) => void;
  className?: string;
}

/**
 * Reusable Line-style Tabs Component
 * Supports 'active' and 'inactive' variants strictly meeting:
 * - Active: lg/bold (16px), px-3 (12px), py-2 (8px), White, 2px solid primary border.
 * - Inactive: lg/regular (16px), px-3 (12px), py-2 (8px), Grey, 1.5px solid border color.
 */
export function LineTabs<T extends string = string>({
  tabs,
  activeId,
  onChange,
  className = '',
}: LineTabsProps<T>) {
  return (
    <div
      className={`w-full flex items-center border-b border-[#303037] overflow-x-auto no-scrollbar scrollbar-none ${className}`}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`cursor-pointer whitespace-nowrap transition-colors select-none focus:outline-none ${
              isActive
                ? 'text-base font-bold text-[#E3E4E9] px-[12px] py-[8px] border-b-2 border-[#4963F4] -mb-[1px]'
                : 'text-base font-normal text-[#87878F] px-[12px] py-[8px] border-b-[1.5px] border-transparent hover:text-[#E3E4E9] -mb-[1px]'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
