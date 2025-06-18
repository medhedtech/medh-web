import { Id } from 'react-toastify';

interface ToastManagerOptions {
  preventDuplicates?: boolean;
  maxToasts?: number;
  groupKey?: string;
  autoClose?: number | false;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  theme?: 'light' | 'dark' | 'colored';
  toastId?: string | number;
  onClose?: () => void;
  onOpen?: () => void;
}

declare global {
  var showToast: {
    success: (message: string, options?: ToastManagerOptions) => Promise<Id | null>;
    error: (message: string, options?: ToastManagerOptions) => Promise<Id | null>;
    warning: (message: string, options?: ToastManagerOptions) => Promise<Id | null>;
    info: (message: string, options?: ToastManagerOptions) => Promise<Id | null>;
    loading: (message: string, options?: ToastManagerOptions) => Promise<Id | null>;
    dismiss: (toastId?: Id) => void;
    dismissAll: () => void;
    dismissByGroup: (groupKey: string) => void;
  };

  interface Window {
    showToast: typeof showToast;
  }
}

export {}; 