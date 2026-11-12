import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export interface PopupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  primaryActionLabel?: string;
  primaryActionVariant?: 'Primary' | 'Destructive';
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const PopupDialog: React.FC<PopupDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  primaryActionLabel = 'Confirm',
  primaryActionVariant = 'Destructive',
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  icon,
  children,
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDestructive = primaryActionVariant === 'Destructive';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[340px] bg-[#19191F] border border-[#2E2E37] rounded-3xl p-6 flex flex-col items-center text-center gap-3.5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#87878F] hover:text-[#E3E4E9] p-1 rounded-full transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5 stroke-[1.8]" />
        </button>

        {/* Center Icon */}
        <div className="flex items-center justify-center pt-2">
          {icon || <AlertTriangle className="w-8 h-8 text-[#C94A4A] stroke-[1.8]" />}
        </div>

        {/* Title and Description */}
        <div className="flex flex-col gap-1.5 w-full">
          <h3 className="text-lg font-bold text-white font-roboto">
            {title}
          </h3>
          <p className="text-sm text-[#87878F] font-roboto leading-5 px-1">
            {description}
          </p>
        </div>

        {children}

        {/* Action Button(s) matching design reference pill */}
        <div className="w-full flex flex-col gap-2 mt-2">
          {primaryActionLabel && onPrimaryAction && (
            <button
              type="button"
              onClick={() => {
                onPrimaryAction();
                onClose();
              }}
              className={`w-full py-3.5 rounded-full font-medium text-base text-white transition-all cursor-pointer shadow-sm active:scale-[0.98] ${
                isDestructive
                  ? 'bg-[#BA4949] hover:bg-[#a63d3d]'
                  : 'bg-[#4963F4] hover:bg-[#3d54d9]'
              }`}
            >
              {primaryActionLabel}
            </button>
          )}

          {secondaryActionLabel && (
            <button
              type="button"
              onClick={onSecondaryAction || onClose}
              className="w-full py-2.5 rounded-full font-medium text-sm text-[#87878F] hover:text-[#E3E4E9] transition-colors cursor-pointer"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
