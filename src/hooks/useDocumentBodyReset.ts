import { useEffect } from 'react';

/**
 * Hook to reset any problematic inline styles that might be applied to the body element
 * by third-party scripts or libraries. This ensures proper layout and scrolling behavior.
 */
export function useDocumentBodyReset() {
  useEffect(() => {
    // Function to reset body styling
    const resetBodyStyles = () => {
      if (typeof window === 'undefined') return;
      
      // Remove any fixed dimensions or positioning
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.height = '';
      
      // Ensure proper overflow behavior
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'auto';
      
      // Remove any margin or padding that might cause issues
      document.body.style.margin = '';
      document.body.style.padding = '';
    };
    
    // Run immediately
    resetBodyStyles();
    
    // Also run on resize to ensure proper layout after screen size changes
    window.addEventListener('resize', resetBodyStyles);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', resetBodyStyles);
    };
  }, []);
}

/**
 * Hook to fix body classes by removing auto-generated classes that might cause styling issues
 */
export function useFixBodyClasses() {
  useEffect(() => {
    // Function to clean up problematic auto-generated classes
    const cleanupBodyClasses = () => {
      if (typeof window === 'undefined') return;
      
      const body = document.body;
      const bodyClasses = Array.from(body.classList);
      
      // Remove auto-generated classes like __className_559008
      bodyClasses.forEach(className => {
        if (className.startsWith('__className_')) {
          body.classList.remove(className);
        }
      });
    };
    
    // Run on mount
    cleanupBodyClasses();
    
    // Create an observer to watch for class changes on the body element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          cleanupBodyClasses();
        }
      });
    });
    
    // Start observing
    observer.observe(document.body, { attributes: true });
    
    // Cleanup observer on unmount
    return () => {
      observer.disconnect();
    };
  }, []);
} 