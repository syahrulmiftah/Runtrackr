import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ButtonProps } from './Button';

export interface SettingsButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'default' | 'danger';
  showChevron?: boolean;
}

/**
 * Reusable SettingsButton derived from ButtonProps.
 * Used across Manage Account, Documentation topics, and settings lists.
 */
export const SettingsButton: React.FC<SettingsButtonProps> = ({
  label,
  leftIcon,
  rightIcon,
  children,
  variant = 'default',
  showChevron = true,
  className = '',
  disabled,
  ...props
}) => {
  const isDanger = variant === 'danger';

  return (
    <button
      type="button"
      className={`w-full bg-[#27272F] hover:bg-[#303038] active:bg-[#1F1E26] border border-[#303037] rounded-xl px-4 py-3.5 flex items-center justify-between text-left transition-colors cursor-pointer select-none font-roboto ${
        isDanger ? 'text-[#BA4949]' : 'text-[#E3E4E9]'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      <div className="flex items-center gap-3 min-w-0">
        {leftIcon && (
          <span className={`flex-shrink-0 ${isDanger ? 'text-[#BA4949]' : 'text-[#E3E4E9]'}`}>
            {leftIcon}
          </span>
        )}
        <span className={`text-sm font-medium truncate ${isDanger ? 'text-[#BA4949]' : 'text-[#E3E4E9]'}`}>
          {label || children}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {rightIcon}
        {showChevron && (
          <ChevronRight
            className={`w-4 h-4 ${isDanger ? 'text-[#BA4949]' : 'text-[#87878F]'}`}
          />
        )}
      </div>
    </button>
  );
};
