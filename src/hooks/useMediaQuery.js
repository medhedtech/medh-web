"use client";
import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive media queries
 * Uses window.matchMedia API with a fallback for older browsers
 * 
 * @param {string} query - CSS media query string (e.g. '(max-width: 768px)')
 * @returns {boolean} - Whether the media query matches
 * 
 * @example
 * // Check if screen is mobile sized
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * 
 * // Check if device is in dark mode
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      setMatches(media.matches);

      const listener = (e) => setMatches(e.matches);
      media.addEventListener('change', listener);

      return () => media.removeEventListener('change', listener);
    }
  }, [query]);

  return matches;
};

export default useMediaQuery; 