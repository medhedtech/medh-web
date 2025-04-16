import { useCallback } from 'react';

/**
 * Custom hook that provides a scrollToTop function
 * Smoothly scrolls the page to the top
 */
export function useScrollToTop() {
  const scrollToTop = useCallback(() => {
    // Check if the user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  }, []);

  return scrollToTop;
} 