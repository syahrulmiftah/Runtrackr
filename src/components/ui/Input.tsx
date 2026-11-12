import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  unit?: string;
  error?: string | boolean;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, required = false, unit, error, helperText, className = '', disabled, ...props }, ref) => {
    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        {label && (
          <label className="flex items-center gap-1 text-xs text-[#87878F] font-roboto">
            <span>{label}</span>
            {required && <span className="text-[#4963F4] text-xs leading-none">*</span>}
          </label>
        )}

        <div
          className={`flex items-center rounded-lg px-3 py-2.5 bg-[#27272F] border transition-colors ${
            hasError
              ? 'border-[#BA4949] focus-within:border-[#BA4949]'
              : 'border-[#303037] focus-within:border-[#4963F4] focus-within:bg-[#3C3C45]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            ref={ref}
            disabled={disabled}
            className="w-full bg-transparent text-[#E3E4E9] placeholder-[#87878F] text-sm font-roboto focus:outline-none disabled:cursor-not-allowed"
            {...props}
          />
          {unit && (
            <span className="text-xs text-[#87878F] font-roboto pl-2 select-none flex-shrink-0">
              {unit}
            </span>
          )}
        </div>

        {(errorMessage || helperText) && (
          <p className={`text-xs font-roboto ${hasError ? 'text-[#BA4949]' : 'text-[#87878F]'}`}>
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
