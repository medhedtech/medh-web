/**
 * Utility functions for managing the global demo session form
 */

/**
 * Opens the global demo session form
 */
export const openDemoForm = (): void => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('openDemoForm'));
  }
};

/**
 * Closes the global demo session form
 */
export const closeDemoForm = (): void => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('closeDemoForm'));
  }
};

/**
 * Hook to handle demo form actions
 */
export const useDemoForm = () => {
  return {
    openDemoForm,
    closeDemoForm
  };
}; 