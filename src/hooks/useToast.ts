import { useCallback } from 'react';
import { showToast, toastManager, ToastManagerOptions } from '@/utils/toastManager';

/**
 * Custom hook for toast notifications with spam prevention
 * Provides backward compatibility with the original toast API
 */
export const useToast = () => {
  const success = useCallback((message: string, options?: ToastManagerOptions) => {
    return showshowToast.success(message, options);
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
    return showToast.dismissByGroup(groupKey);
  }, []);

  // Configuration methods
  const setMaxToasts = useCallback((max: number) => {
    toastManager.setMaxConcurrentToasts(max);
  }, []);

  const setDuplicateTimeout = useCallback((timeout: number) => {
    toastManager.setDuplicateTimeout(timeout);
  }, []);

  const getQueueStatus = useCallback(() => {
    return toastManager.getQueueStatus();
  }, []);

  const clearQueue = useCallback(() => {
    toastManager.clearQueue();
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