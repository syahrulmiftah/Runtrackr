import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  type: 'Success' | 'Error';
  title: string;
  description?: string;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container floating at bottom */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-[92%] max-w-[343px] pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#19191F] border border-[#303037] rounded-xl p-3.5 shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === 'Success' ? (
                <CheckCircle2 className="w-5 h-5 text-[#4AC189] flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-[#BA4949] flex-shrink-0" />
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-[#E3E4E9] font-roboto truncate">
                  {toast.title}
                </span>
                {toast.description && (
                  <span className="text-xs text-[#87878F] font-roboto truncate">
                    {toast.description}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-xs text-[#87878F] hover:text-[#E3E4E9] px-2 py-1 rounded bg-[#27272F] hover:bg-[#3C3C45] transition-colors cursor-pointer flex-shrink-0 font-roboto"
            >
              Dismiss
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
