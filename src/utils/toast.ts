// Toast notification utility for the application
export interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  className?: string;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

const defaultOptions: ToastOptions = {
  duration: 3000,
  position: 'top-right',
};

const getToastStyles = (type: ToastType, position: string): string => {
  const baseStyles = 'fixed z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 max-w-sm';
  
  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-white',
  };

  const typeIcons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };

  return `${baseStyles} ${positionStyles[position as keyof typeof positionStyles]} ${typeStyles[type]}`;
};

const createToast = (message: string, type: ToastType, options: ToastOptions = {}): void => {
  if (typeof window === 'undefined') return;

  const config = { ...defaultOptions, ...options };
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = getToastStyles(type, config.position!);
  
  // Add icon and message
  const typeIcons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };
  
  toast.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="flex-shrink-0">${typeIcons[type]}</span>
      <span class="text-sm font-medium">${message}</span>
    </div>
  `;

  // Add custom className if provided
  if (config.className) {
    toast.className += ` ${config.className}`;
  }

  // Add to DOM
  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);

  // Remove after duration
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, config.duration);
};

// Helper function for loading toast
const createLoadingToast = (message: string, options: ToastOptions = {}): HTMLElement => {
  if (typeof window === 'undefined') return document.createElement('div');

  const config = { ...defaultOptions, ...options };
  
  const toast = document.createElement('div');
  toast.className = getToastStyles('info', config.position!);
  
  toast.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="flex-shrink-0 animate-spin">⏳</span>
      <span class="text-sm font-medium">${message}</span>
    </div>
  `;

  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);

  return toast;
};

// Helper function to remove toast
const removeToast = (toast: HTMLElement): void => {
  if (toast && document.body.contains(toast)) {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }
};

// Main toast API
export const toast = {
  success: (message: string, options?: ToastOptions) => createToast(message, 'success', options),
  error: (message: string, options?: ToastOptions) => createToast(message, 'error', options),
  info: (message: string, options?: ToastOptions) => createToast(message, 'info', options),
  warning: (message: string, options?: ToastOptions) => createToast(message, 'warning', options),
  
  // Promise-based toast for async operations
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: ToastOptions
  ): Promise<T> => {
    const loadingToast = createLoadingToast(messages.loading, options);
    
    return promise
      .then((result) => {
        removeToast(loadingToast);
        createToast(messages.success, 'success', options);
        return result;
      })
      .catch((error) => {
        removeToast(loadingToast);
        createToast(messages.error, 'error', options);
        throw error;
      });
  },
};

// Legacy support for existing showToast patterns
export const showToast = toast;

export default toast; 