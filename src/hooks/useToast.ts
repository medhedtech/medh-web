import { useCallback } from 'react';
import { showToast, toastManager, ToastManagerOptions } from '@/utils/toastManager';

/**
 * Custom hook for toast notifications with spam prevention
 * Provides backward compatibility with the original toast API
 */
export const useToast = () => {
  const success = useCallback((message: string, options?: ToastManagerOptions) => {
    return showToast.success(message, options);
  }, []);

  const error = useCallback((message: string, options?: ToastManagerOptions) => {
    return showToast.error(message, options);
  }, []);

  const warning = useCallback((message: string, options?: ToastManagerOptions) => {
    return showToast.warning(message, options);
  }, []);

  const info = useCallback((message: string, options?: ToastManagerOptions) => {
    return showToast.info(message, options);
  }, []);

  const dismiss = useCallback(() => {
    return showToast.dismiss();
  }, []);

  const dismissByGroup = useCallback((groupKey: string) => {
    // Fallback for dismissByGroup - just dismiss all
    return showToast.dismiss();
  }, []);

  // Configuration methods - simplified implementations
  const setMaxToasts = useCallback((max: number) => {
    // No-op for now, can be implemented later
    console.log('setMaxToasts:', max);
  }, []);

  const setDuplicateTimeout = useCallback((timeout: number) => {
    // No-op for now, can be implemented later
    console.log('setDuplicateTimeout:', timeout);
  }, []);

  const getQueueStatus = useCallback(() => {
    // Return empty status for now
    return { pending: 0, active: 0 };
  }, []);

  const clearQueue = useCallback(() => {
    // Just dismiss all toasts
    showToast.dismiss();
  }, []);

  // Backward compatibility - object with methods that match original toast API
  const toast = {
    success,
    error,
    warning,
    info,
    dismiss,
    // Additional methods
    dismissByGroup,
    setMaxToasts,
    setDuplicateTimeout,
    getQueueStatus,
    clearQueue,
  };

  return {
    toast,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissByGroup,
    setMaxToasts,
    setDuplicateTimeout,
    getQueueStatus,
    clearQueue,
  };
};

export default useToast; 