import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'Primary' | 'Secondary' | 'Destructive';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  children?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'Secondary',
  size = 'md',
  leftIcon,
  rightIcon,
  label,
  children,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'h-10 px-3 text-sm gap-1.5 min-w-[40px]',
    md: 'h-12 px-4 text-sm gap-2 min-w-[48px]',
    lg: 'h-14 px-5 text-base gap-2 min-w-[56px]',
  }[size];

  const variantStyles = {
    Primary: 'bg-[#4963F4] text-[#E3E4E9] hover:bg-[#3d54d9] active:bg-[#4963F4]/80 disabled:opacity-40',
    Secondary: 'bg-[#27272F] text-[#E3E4E9] hover:bg-[#3C3C45] active:bg-[#0D0C11] disabled:opacity-40',
    Destructive: 'bg-[#BA4949] text-white hover:bg-[#a63d3d] active:bg-[#BA4949]/70 disabled:opacity-40',
  }[variant];

  return (
    <button
      className={`inline-flex items-center justify-center font-roboto font-normal rounded-full transition-colors cursor-pointer select-none ${sizeStyles} ${variantStyles} ${
        fullWidth ? 'w-full' : ''
      } ${disabled ? 'cursor-not-allowed opacity-40' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      {label && <span>{label}</span>}
      {children}
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
