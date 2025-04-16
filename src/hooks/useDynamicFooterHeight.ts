import { useEffect, RefObject } from 'react';

/**
 * Hook to dynamically adjust content min-height based on footer height
 * This ensures the footer always appears at the bottom, even on short pages,
 * without creating unnecessary scrollbars
 * 
 * @param contentRef - Reference to the main content container
 */
export function useDynamicFooterHeight(contentRef: RefObject<HTMLElement>) {
  useEffect(() => {
    // Function to update the CSS variable with the footer height
    const updateFooterMargin = () => {
      const footer = document.querySelector('footer');
      if (!footer || !contentRef.current) return;
      
      // Get footer height
      const footerHeight = footer.offsetHeight;
      
      // Update CSS variable
      document.documentElement.style.setProperty('--footer-margin', `${footerHeight}px`);
      
      // Ensure content has enough minimum height
      const windowHeight = window.innerHeight;
      const headerHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '0', 
        10
      );
      
      // Set min-height to viewport height minus header and footer
      contentRef.current.style.minHeight = `calc(${windowHeight}px - ${headerHeight}px - ${footerHeight}px)`;
    };
    
    // Update on resize and initial load
    updateFooterMargin();
    window.addEventListener('resize', updateFooterMargin);
    
    // Fallback for dynamic content changes
    const resizeObserver = new ResizeObserver(updateFooterMargin);
    
    // Observe the footer for size changes
    const footer = document.querySelector('footer');
    if (footer) {
      resizeObserver.observe(footer);
    }
    
    return () => {
      window.removeEventListener('resize', updateFooterMargin);
      resizeObserver.disconnect();
    };
  }, [contentRef]);
} 