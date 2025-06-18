import { toast, ToastOptions, Id } from 'react-toastify';

interface ToastManagerOptions extends ToastOptions {
  preventDuplicates?: boolean;
  maxToasts?: number;
  groupKey?: string;
}

class ToastManager {
  private activeToasts = new Set<string>();
  private toastQueue: Array<{ message: string; type: string; options: ToastManagerOptions }> = [];
  private isProcessingQueue = false;
  private maxConcurrentToasts = 3;
  private duplicateTimeout = 1000; // 1 second to prevent duplicates
  private duplicateTracker = new Map<string, number>();

  // Generate a unique key for toast message and type combination
  private generateToastKey(message: string, type: string, groupKey?: string): string {
    return `${type}:${groupKey || 'default'}:${message}`;
  }

  // Check if a toast is a duplicate within the timeout period
  private isDuplicate(key: string): boolean {
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

  // Process the toast queue
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.toastQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.toastQueue.length > 0 && this.activeToasts.size < this.maxConcurrentToasts) {
      const queueItem = this.toastQueue.shift();
      if (queueItem) {
        await this.showToastInternal(queueItem.message, queueItem.type, queueItem.options);
      }
    }

    this.isProcessingQueue = false;
  }

  // Internal method to show toast
  private async showToastInternal(message: string, type: string, options: ToastManagerOptions = {}): Promise<Id | null> {
    const key = this.generateToastKey(message, type, options.groupKey);

    // Check for duplicates if enabled
    if (options.preventDuplicates !== false && this.isDuplicate(key)) {
      return null;
    }

    // If we're at max capacity, queue the toast
    if (this.activeToasts.size >= this.maxConcurrentToasts) {
      this.toastQueue.push({ message, type, options });
      return null;
    }

    // Clean up old duplicate tracker entries periodically
    if (this.duplicateTracker.size > 100) {
      this.cleanupDuplicateTracker();
    }

    // Dismiss any existing toasts with the same group key if specified
    if (options.groupKey) {
      this.dismissByGroup(options.groupKey);
    }

    const toastId = this.generateToastId(key);
    this.activeToasts.add(key);

    // Set up auto-cleanup
    const autoClose = options.autoClose !== false ? (options.autoClose || 5000) : false;
    
    const toastOptions: ToastOptions = {
      ...options,
      toastId,
      onClose: () => {
        this.activeToasts.delete(key);
        this.processQueue(); // Process queue when a toast is closed
        if (options.onClose) {
          options.onClose();
        }
      },
      autoClose
    };

    let toastResult: Id;

    switch (type) {
      case 'success':
        toastResult = toast.success(message, toastOptions);
        break;
      case 'error':
        toastResult = toast.error(message, toastOptions);
        break;
      case 'warning':
        toastResult = toast.warning(message, toastOptions);
        break;
      case 'info':
        toastResult = toast.info(message, toastOptions);
        break;
      default:
        toastResult = toast(message, toastOptions);
        break;
    }

    return toastResult;
  }

  // Generate a unique toast ID
  private generateToastId(key: string): string {
    return `toast-${key}-${Date.now()}`;
  }

  // Public methods
  success(message: string, options: ToastManagerOptions = {}): Promise<Id | null> {
    return this.showToastInternal(message, 'success', { preventDuplicates: true, ...options });
  }

  error(message: string, options: ToastManagerOptions = {}): Promise<Id | null> {
    return this.showToastInternal(message, 'error', { preventDuplicates: true, ...options });
  }

  warning(message: string, options: ToastManagerOptions = {}): Promise<Id | null> {
    return this.showToastInternal(message, 'warning', { preventDuplicates: true, ...options });
  }

  info(message: string, options: ToastManagerOptions = {}): Promise<Id | null> {
    return this.showToastInternal(message, 'info', { preventDuplicates: true, ...options });
  }

  // Dismiss all toasts
  dismissAll(): void {
    toast.dismiss();
    this.activeToasts.clear();
    this.toastQueue.length = 0;
  }

  // Dismiss toasts by group key
  dismissByGroup(groupKey: string): void {
    const toastsToRemove: string[] = [];
    
    for (const key of this.activeToasts) {
      if (key.includes(`:${groupKey}:`)) {
        toast.dismiss(this.generateToastId(key));
        toastsToRemove.push(key);
      }
    }
    
    toastsToRemove.forEach(key => this.activeToasts.delete(key));
  }

  // Set maximum concurrent toasts
  setMaxConcurrentToasts(max: number): void {
    this.maxConcurrentToasts = Math.max(1, Math.min(10, max));
  }

  // Set duplicate timeout
  setDuplicateTimeout(timeout: number): void {
    this.duplicateTimeout = Math.max(500, timeout);
  }

  // Get queue status
  getQueueStatus(): { active: number; queued: number; max: number } {
    return {
      active: this.activeToasts.size,
      queued: this.toastQueue.length,
      max: this.maxConcurrentToasts
    };
  }

  // Clear the queue without showing toasts
  clearQueue(): void {
    this.toastQueue.length = 0;
  }

  // Force process queue (useful for testing or manual control)
  forceProcessQueue(): void {
    this.processQueue();
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
  dismiss: () => toastManager.dismissAll(),
  dismissByGroup: (groupKey: string) => toastManager.dismissByGroup(groupKey),
};

// Export types
export type { ToastManagerOptions };
export { ToastManager }; 