import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

export interface InlineMessageProps {
  type?: 'Error' | 'Warning' | 'Success' | 'Info';
  title?: string;
  description: string;
  className?: string;
  action?: React.ReactNode;
}

export const InlineMessage: React.FC<InlineMessageProps> = ({
  type = 'Warning',
  title,
  description,
  className = '',
  action,
}) => {
  const styles = {
    Error: {
      bg: 'bg-[#BA4949]/20 border-[#BA4949]/40',
      text: 'text-[#BA4949]',
      icon: <XCircle className="w-5 h-5 text-[#BA4949] flex-shrink-0" />,
    },
    Warning: {
      bg: 'bg-[#D7960A]/20 border-[#D7960A]/40',
      text: 'text-[#D7960A]',
      icon: <AlertTriangle className="w-5 h-5 text-[#D7960A] flex-shrink-0" />,
    },
    Success: {
      bg: 'bg-[#4AC189]/20 border-[#4AC189]/40',
      text: 'text-[#4AC189]',
      icon: <CheckCircle className="w-5 h-5 text-[#4AC189] flex-shrink-0" />,
    },
    Info: {
      bg: 'bg-[#4963F4]/20 border-[#4963F4]/40',
      text: 'text-[#4963F4]',
      icon: <Info className="w-5 h-5 text-[#4963F4] flex-shrink-0" />,
    },
  }[type];

  return (
    <div
      className={`rounded-xl p-3 flex items-start gap-2.5 border ${styles.bg} ${className}`}
    >
      <div className="mt-0.5">{styles.icon}</div>
      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        {title && (
          <span className={`text-xs font-bold font-roboto ${styles.text}`}>
            {title}
          </span>
        )}
        <span className={`text-xs font-roboto leading-4.5 ${styles.text}`}>
          {description}
        </span>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};
