import { useState, useCallback, useEffect } from 'react';

export interface ErrorInfo {
  componentStack?: string;
  source?: string;
  [key: string]: any;
}

export interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  hasError: boolean;
  resetError: () => void;
  captureError: (error: Error, errorInfo?: ErrorInfo) => void;
  clearError: () => void;
  errorCount: number;
  lastErrorTimestamp: number | null;
}

interface ErrorBoundaryOptions {
  /**
   * Maximum number of errors to capture before stopping
   */
  maxErrorCount?: number;
  /**
   * Callback to run when an error is captured
   */
  onError?: (error: Error, errorInfo: ErrorInfo | null) => void;
  /**
   * Callback to run when errors are cleared/reset
   */
  onReset?: () => void;
  /**
   * Whether to log errors to console
   */
  logErrors?: boolean;
}

/**
 * Hook that provides error boundary functionality within a component
 * @param options Configuration options for the error boundary
 * @returns Object containing error state and functions to manage errors
 */
function useErrorBoundary(options: ErrorBoundaryOptions = {}): ErrorBoundaryState {
  const {
    maxErrorCount = Infinity,
    onError,
    onReset,
    logErrors = true
  } = options;

  const [error, setError] = useState<Error | null>(null);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [lastErrorTimestamp, setLastErrorTimestamp] = useState<number | null>(null);

  // Clear the error state completely
  const clearError = useCallback(() => {
    setError(null);
    setErrorInfo(null);
    if (onReset) onReset();
  }, [onReset]);

  // Function to reset the error state but keep the error count
  const resetError = useCallback(() => {
    clearError();
  }, [clearError]);

  // Function to capture and set an error with optional error info
  const captureError = useCallback((e: Error, info: ErrorInfo = {}) => {
    if (errorCount >= maxErrorCount) {
      if (logErrors) {
        console.warn('Error boundary: Maximum error count reached, not capturing error:', e);
      }
      return;
    }

    setError(e);
    setErrorInfo(info);
    setErrorCount(prev => prev + 1);
    setLastErrorTimestamp(Date.now());
    
    // Trigger onError callback if provided
    if (onError) {
      onError(e, info);
    }
    
    // Log error to console if enabled
    if (logErrors) {
      console.error('Error captured by useErrorBoundary:', e, info);
    }
  }, [errorCount, maxErrorCount, onError, logErrors]);

  // Observe uncaught errors using window.onerror
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      captureError(
        event.error || new Error(event.message),
        { source: 'window.onerror', event }
      );
      
      // Don't prevent default error handling
      return false;
    };

    // Add global error listener
    window.addEventListener('error', handleGlobalError);
    
    // Clean up on unmount
    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, [captureError]);

  return {
    error,
    errorInfo,
    hasError: error !== null,
    resetError,
    captureError,
    clearError,
    errorCount,
    lastErrorTimestamp,
  };
}

export default useErrorBoundary; 