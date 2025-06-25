// Error handling hook for MEDH API
import { useCallback } from 'react';
import { toast } from '../utils/toast';
import { ApiError } from '../types/common';
import { ApiErrorHandler } from '../lib/error-handler';

export const useErrorHandler = () => {
  const handleError = useCallback((error: ApiError | Error, options?: {
    showToast?: boolean;
    customMessage?: string;
    onRetry?: () => void;
  }) => {
    const { showToast = true, customMessage, onRetry } = options || {};
    
    const errorDetails = ApiErrorHandler.getErrorDetails(error);
    const message = customMessage || errorDetails.message;
    
    // Show toast notification if enabled
    if (showToast) {
      toast.error(message, {
        duration: 5000, // Longer duration for errors
      });
    }
    
    // Log detailed error information for debugging
    console.error('API Error:', {
      message: errorDetails.message,
      code: errorDetails.code,
      details: errorDetails.details,
      hint: errorDetails.hint,
      originalError: error,
    });
    
    // Handle specific error types
    if (ApiErrorHandler.shouldRedirectToLogin(error)) {
      // Clear any stored tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        sessionStorage.removeItem('auth_token');
        
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    }
    
    // Return error details for further handling
    return errorDetails;
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    options?: {
      loadingMessage?: string;
      successMessage?: string;
      errorMessage?: string;
      retryCount?: number;
    }
  ): Promise<T | null> => {
    const {
      loadingMessage = 'Processing...',
      successMessage,
      errorMessage,
      retryCount = 0,
    } = options || {};

    try {
      const result = await toast.promise(
        asyncFn(),
        {
          loading: loadingMessage,
          success: successMessage || 'Operation completed successfully',
          error: errorMessage || 'Operation failed',
        }
      );
      
      return result;
    } catch (error) {
      const errorDetails = handleError(error as ApiError | Error, {
        showToast: false, // Don't show additional toast since promise toast handles it
      });
      
      // Retry logic for retryable errors
      if (retryCount > 0 && ApiErrorHandler.isRetryableError(error as ApiError | Error)) {
        console.log(`Retrying operation (${retryCount} attempts remaining)...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        return handleAsyncError(asyncFn, { ...options, retryCount: retryCount - 1 });
      }
      
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
  };
};