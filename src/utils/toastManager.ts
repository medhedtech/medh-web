import { toast, Renderable } from 'react-hot-toast';

interface ToastManagerOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  style?: React.CSSProperties;
  className?: string;
  icon?: Renderable;
  iconTheme?: {
    primary: string;
    secondary: string;
  };
  ariaProps?: {
    role: 'status' | 'alert';
    'aria-live': 'assertive' | 'off' | 'polite';
  };
  id?: string;
}

class ToastManager {
  private duplicateTimeout = 1000; // 1 second to prevent duplicates
  private duplicateTracker = new Map<string, number>();

  // Check if a toast is a duplicate within the timeout period
  private isDuplicate(message: string, type: string): boolean {
    const key = `${type}:${message}`;
    const now = Date.now();
    const lastShown = this.duplicateTracker.get(key);
    
    if (lastShown && (now - lastShown) < this.duplicateTimeout) {
      return true;
    }
    
    this.duplicateTracker.set(key, now);
    return false;
  }

  // Clean up old duplicate tracker entries
  private cleanupDuplicateTracker(): void {
    const now = Date.now();
    for (const [key, timestamp] of this.duplicateTracker.entries()) {
      if (now - timestamp > this.duplicateTimeout * 2) {
        this.duplicateTracker.delete(key);
      }
    }
  }

  // Public methods
  success(message: string, options: ToastManagerOptions = {}): string {
    if (this.isDuplicate(message, 'success')) {
      return '';
    }
    
    this.cleanupDuplicateTracker();
    return toast.success(message, options);
  }

  error(message: string, options: ToastManagerOptions = {}): string {
    if (this.isDuplicate(message, 'error')) {
      return '';
    }
    
    this.cleanupDuplicateTracker();
    return toast.error(message, options);
  }

  info(message: string, options: ToastManagerOptions = {}): string {
    if (this.isDuplicate(message, 'info')) {
      return '';
    }
    
    this.cleanupDuplicateTracker();
    return toast(message, { icon: 'ℹ️', ...options });
  }

  warning(message: string, options: ToastManagerOptions = {}): string {
    if (this.isDuplicate(message, 'warning')) {
      return '';
    }
    
    this.cleanupDuplicateTracker();
    return toast(message, { icon: '⚠️', ...options });
  }

  loading(message: string, options: ToastManagerOptions = {}): string {
    if (this.isDuplicate(message, 'loading')) {
      return '';
    }
    
    this.cleanupDuplicateTracker();
    return toast.loading(message, options);
  }

  // Dismiss all toasts
  dismissAll(): void {
    toast.dismiss();
  }

  // Dismiss specific toast
  dismiss(toastId?: string): void {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  }

  // Set duplicate timeout
  setDuplicateTimeout(timeout: number): void {
    this.duplicateTimeout = Math.max(500, timeout);
  }

  // Promise-based toast for async operations
  async promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options: ToastManagerOptions = {}
  ): Promise<T> {
    return toast.promise(promise, messages, options);
  }
}

// Create and export the singleton instance
export const toastManager = new ToastManager();

// Export convenience methods that match the original toast API
export const showToast = {
  success: (message: string, options?: ToastManagerOptions) => toastManager.success(message, options),
  error: (message: string, options?: ToastManagerOptions) => toastManager.error(message, options),
  warning: (message: string, options?: ToastManagerOptions) => toastManager.warning(message, options),
  info: (message: string, options?: ToastManagerOptions) => toastManager.info(message, options),
  loading: (message: string, options?: ToastManagerOptions) => toastManager.loading(message, options),
  dismiss: (toastId?: string) => toastManager.dismiss(toastId),
  dismissAll: () => toastManager.dismissAll(),
  promise: <T>(promise: Promise<T>, messages: { loading: string; success: string; error: string; }, options?: ToastManagerOptions) => toastManager.promise(promise, messages, options),
};

// Also export the direct toast functions for compatibility
export { toast };

// Export types
export type { ToastManagerOptions };
export { ToastManager };

// Make showToast globally available in browser environment
if (typeof window !== 'undefined') {
  (window as any).showToast = showToast;
}

// Global type declarations for TypeScript
declare global {
  interface Window {
    showToast: {
      success: (message: string, options?: ToastManagerOptions) => string;
      error: (message: string, options?: ToastManagerOptions) => string;
      warning: (message: string, options?: ToastManagerOptions) => string;
      info: (message: string, options?: ToastManagerOptions) => string;
      loading: (message: string, options?: ToastManagerOptions) => string;
      dismiss: (toastId?: string) => void;
      dismissAll: () => void;
      promise: <T>(promise: Promise<T>, messages: { loading: string; success: string; error: string; }, options?: ToastManagerOptions) => Promise<T>;
    };
  }
  
  // Make showToast available as a global variable
  var showToast: {
    success: (message: string, options?: ToastManagerOptions) => string;
    error: (message: string, options?: ToastManagerOptions) => string;
    warning: (message: string, options?: ToastManagerOptions) => string;
    info: (message: string, options?: ToastManagerOptions) => string;
    loading: (message: string, options?: ToastManagerOptions) => string;
    dismiss: (toastId?: string) => void;
    dismissAll: () => void;
    promise: <T>(promise: Promise<T>, messages: { loading: string; success: string; error: string; }, options?: ToastManagerOptions) => Promise<T>;
  };
}