import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook that tracks whether the page has been scrolled past a certain threshold
 * @param threshold - The scroll position threshold in pixels
 * @returns A boolean indicating whether the threshold has been passed
 */
export function useScrollVisibility(threshold: number = 300) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    // Using requestAnimationFrame for performance
    requestAnimationFrame(() => {
      setIsVisible(window.scrollY > threshold);
    });
  }, [threshold]);
  
  useEffect(() => {
    // Check initial position
    handleScroll();
    
    // Add scroll listener with passive flag for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
  
  return isVisible;
} 