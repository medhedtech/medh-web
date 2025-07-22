"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '@/components/shared/ui/Toast';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  persistent?: boolean; // For loading toasts that need manual dismissal
}

interface ToastOptions {
  duration?: number;
  id?: string;
  persistent?: boolean;
}

interface ToastContextType {
  showToast: {
    success: (message: string, options?: ToastOptions) => string;
    error: (message: string, options?: ToastOptions) => string;
    info: (message: string, options?: ToastOptions) => string;
    warning: (message: string, options?: ToastOptions) => string;
    loading: (message: string, options?: ToastOptions) => string;
    dismiss: (toastId?: string) => void;
    dismissAll: () => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const generateId = useCallback(() => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, []);

  const addToast = useCallback((message: string, type: ToastType, options: ToastOptions = {}): string => {
    const id = options.id || generateId();
    const duration = options.duration !== undefined ? options.duration : (type === 'error' ? 6000 : type === 'loading' ? 0 : 4000);
    const persistent = options.persistent || type === 'loading';

    // Remove existing toast with same ID if it exists
    setToasts((prev) => prev.filter((toast) => toast.id !== id));

    const newToast: ToastMessage = {
      id,
      message,
      type,
      duration,
      persistent
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after duration (if not persistent)
    if (!persistent && duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    }

    return id;
  }, [generateId]);

  const dismissToast = useCallback((toastId?: string) => {
    if (toastId) {
      setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
    } else {
      // Dismiss the most recent toast if no ID provided
      setToasts((prev) => prev.slice(0, -1));
    }
  }, []);

  const dismissAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = {
    success: (message: string, options?: ToastOptions) => addToast(message, 'success', options),
    error: (message: string, options?: ToastOptions) => addToast(message, 'error', options),
    info: (message: string, options?: ToastOptions) => addToast(message, 'info', options),
    warning: (message: string, options?: ToastOptions) => addToast(message, 'warning', options),
    loading: (message: string, options?: ToastOptions) => addToast(message, 'loading', { persistent: true, ...options }),
    dismiss: dismissToast,
    dismissAll: dismissAllToasts,
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => dismissToast(toast.id)}
            persistent={toast.persistent}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider; 