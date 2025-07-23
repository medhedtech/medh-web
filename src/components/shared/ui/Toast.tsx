import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'loading';
  onClose: () => void;
  duration?: number;
  persistent?: boolean; // If true, won't auto-dismiss
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
  duration = 5000,
  persistent = false
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Don't auto-dismiss if persistent or if duration is 0 (loading toasts)
    if (persistent || duration <= 0) return;

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Allow animation to finish before fully removing
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose, persistent]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
      case 'loading':
        return <Loader2 className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getStyles = () => {
    const baseStyles = 'relative max-w-md rounded-lg border shadow-lg transition-all duration-300 backdrop-blur-sm';
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-white/95 dark:bg-gray-800/95 border-green-200 dark:border-green-800`;
      case 'error':
        return `${baseStyles} bg-white/95 dark:bg-gray-800/95 border-red-200 dark:border-red-800`;
      case 'warning':
        return `${baseStyles} bg-white/95 dark:bg-gray-800/95 border-amber-200 dark:border-amber-800`;
      case 'loading':
        return `${baseStyles} bg-white/95 dark:bg-gray-800/95 border-blue-200 dark:border-blue-800`;
      case 'info':
      default:
        return `${baseStyles} bg-white/95 dark:bg-gray-800/95 border-blue-200 dark:border-blue-800`;
    }
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  if (!visible) return null;

  return (
    <div
      className={`${getStyles()} ${
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
      } p-4`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
            {message}
          </p>
        </div>
        {/* Show close button for all types except loading (unless persistent) */}
        {(type !== 'loading' || persistent) && (
          <button
            type="button"
            className="flex-shrink-0 ml-2 -mt-1 -mr-1 h-8 w-8 inline-flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
            onClick={handleClose}
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast; 