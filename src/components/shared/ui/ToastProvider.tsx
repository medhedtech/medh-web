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
  details?: string; // For additional error details
}

interface ToastOptions {
  duration?: number;
  id?: string;
  persistent?: boolean;
  details?: string; // For additional error context
}

interface ToastContextType {
  showToast: {
    success: (message: string, options?: ToastOptions) => string;
    error: (message: string | Error | any, options?: ToastOptions) => string;
    info: (message: string, options?: ToastOptions) => string;
    warning: (message: string | any, options?: ToastOptions) => string;
    loading: (message: string, options?: ToastOptions) => string;
    dismiss: (toastId?: string) => void;
    dismissAll: () => void;
    fromError: (error: any, fallbackMessage?: string) => string;
    fromValidation: (validationErrors: any, fallbackMessage?: string) => string;
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

  // Utility function to parse HTML error responses
  const parseHtmlError = useCallback((htmlString: string): { message: string; details?: string } => {
    try {
      // Create a temporary DOM element to parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      
      // Try to extract error message from <pre> tag (common in Express error pages)
      const preElement = doc.querySelector('pre');
      if (preElement) {
        const errorText = preElement.textContent || preElement.innerText || '';
        
        // Extract ValidationError details
        if (errorText.includes('ValidationError:')) {
          const lines = errorText.split('\n');
          const errorLine = lines[0];
          
          // Extract the main error message
          const validationMatch = errorLine.match(/ValidationError:\s*(.+?)(?:\s+at\s+|$)/);
          if (validationMatch) {
            const rawMessage = validationMatch[1];
            
            // Parse individual field errors
            const fieldErrors = rawMessage.split(', ').map(error => {
              // Clean up field names and make them more user-friendly
              return error
                .replace(/contact_info\./g, '')
                .replace(/student_details\./g, '')
                .replace(/demo_session_details\./g, '')
                .replace(/_/g, ' ')
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .toLowerCase()
                .replace(/^./, str => str.toUpperCase());
            });
            
            const message = fieldErrors.length > 1 
              ? `Please fix the following errors:\n• ${fieldErrors.join('\n• ')}`
              : fieldErrors[0] || 'Validation failed';
            
            return {
              message,
              details: errorText
            };
          }
        }
        
        // Extract other common error patterns
        if (errorText.includes('Error:')) {
          const errorMatch = errorText.match(/Error:\s*(.+?)(?:\s+at\s+|$)/);
          if (errorMatch) {
            return {
              message: errorMatch[1],
              details: errorText
            };
          }
        }
        
        // Fallback to first line if no specific pattern found
        const firstLine = errorText.split('\n')[0].trim();
        return {
          message: firstLine || 'An error occurred',
          details: errorText
        };
      }
      
      // Try to extract from title or body text
      const title = doc.querySelector('title')?.textContent;
      const bodyText = doc.body?.textContent?.trim();
      
      return {
        message: title === 'Error' && bodyText ? bodyText.split('\n')[0] : (title || 'An error occurred'),
        details: bodyText
      };
    } catch (e) {
      return {
        message: 'Failed to parse error response',
        details: htmlString
      };
    }
  }, []);

  // Utility function to extract meaningful error messages from various error types
  const extractErrorMessage = useCallback((error: any): { message: string; details?: string } => {
    // Handle string messages
    if (typeof error === 'string') {
      // Check if it's HTML
      if (error.includes('<!DOCTYPE html>') || error.includes('<html')) {
        return parseHtmlError(error);
      }
      return { message: error };
    }

    // Handle Error objects
    if (error instanceof Error) {
      return { 
        message: error.message,
        details: error.stack
      };
    }

    // Handle Axios errors or API response errors
    if (error?.response?.data) {
      const responseData = error.response.data;
      
      // Handle HTML error responses
      if (typeof responseData === 'string' && (responseData.includes('<!DOCTYPE html>') || responseData.includes('<html'))) {
        return parseHtmlError(responseData);
      }
      
      // Handle JSON error responses
      if (typeof responseData === 'object') {
        return {
          message: responseData.message || responseData.error || 'An error occurred',
          details: JSON.stringify(responseData, null, 2)
        };
      }
      
      return { message: String(responseData) };
    }

    // Handle validation errors
    if (error?.errors && Array.isArray(error.errors)) {
      const errorMessages = error.errors.map((err: any) => err.message || err).join(', ');
      return { 
        message: errorMessages,
        details: JSON.stringify(error, null, 2)
      };
    }

    // Handle object with message property
    if (error?.message) {
      return { 
        message: error.message,
        details: JSON.stringify(error, null, 2)
      };
    }

    // Fallback
    return { 
      message: 'An unexpected error occurred',
      details: JSON.stringify(error, null, 2)
    };
  }, [parseHtmlError]);

  const addToast = useCallback((message: string, type: ToastType, options: ToastOptions = {}): string => {
    const id = options.id || generateId();
    const duration = options.duration !== undefined ? options.duration : (type === 'error' ? 8000 : type === 'loading' ? 0 : 4000);
    const persistent = options.persistent || type === 'loading';

    // Remove existing toast with same ID if it exists
    setToasts((prev) => prev.filter((toast) => toast.id !== id));

    const newToast: ToastMessage = {
      id,
      message,
      type,
      duration,
      persistent,
      details: options.details
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

  // Enhanced error and warning handlers
  const showErrorToast = useCallback((error: string | Error | any, options?: ToastOptions) => {
    const { message, details } = extractErrorMessage(error);
    return addToast(message, 'error', { ...options, details });
  }, [extractErrorMessage, addToast]);

  const showWarningToast = useCallback((warning: string | any, options?: ToastOptions) => {
    const { message, details } = typeof warning === 'string' ? { message: warning } : extractErrorMessage(warning);
    return addToast(message, 'warning', { ...options, details });
  }, [extractErrorMessage, addToast]);

  // Specific handler for API/URL errors
  const fromErrorHandler = useCallback((error: any, fallbackMessage: string = 'An error occurred') => {
    const { message, details } = extractErrorMessage(error);
    return addToast(message || fallbackMessage, 'error', { details });
  }, [extractErrorMessage, addToast]);

  // Specific handler for validation errors
  const fromValidationHandler = useCallback((validationErrors: any, fallbackMessage: string = 'Validation failed') => {
    if (typeof validationErrors === 'string' && validationErrors.includes('ValidationError:')) {
      const { message, details } = parseHtmlError(validationErrors);
      return addToast(message, 'error', { details });
    }
    
    const { message, details } = extractErrorMessage(validationErrors);
    return addToast(message || fallbackMessage, 'error', { details });
  }, [extractErrorMessage, parseHtmlError, addToast]);

  const showToast = {
    success: (message: string, options?: ToastOptions) => addToast(message, 'success', options),
    error: showErrorToast,
    info: (message: string, options?: ToastOptions) => addToast(message, 'info', options),
    warning: showWarningToast,
    loading: (message: string, options?: ToastOptions) => addToast(message, 'loading', { persistent: true, ...options }),
    dismiss: dismissToast,
    dismissAll: dismissAllToasts,
    fromError: fromErrorHandler,
    fromValidation: fromValidationHandler,
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
            details={toast.details}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider; 