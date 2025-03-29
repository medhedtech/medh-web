"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

export interface UseIsSecondaryOptions {
  /** Patterns to identify secondary sections */
  secondaryPatterns?: string[];
  /** Patterns to identify home sections */
  homePatterns?: string[];
}

export interface UseIsSecondaryResult {
  /** Whether the current path matches a secondary pattern */
  isSecondary: boolean;
  /** Function to check if a path matches a home pattern */
  isHome: (path?: string) => boolean;
  /** Function to check if a path matches a secondary pattern */
  isSecondaryPath: (path?: string) => boolean;
}

/**
 * Custom hook to determine if the current route is a secondary or home route
 * @param options - Configuration options
 * @returns Object with route state information and helper functions
 */
export const useIsSecondary = (
  options?: UseIsSecondaryOptions
): UseIsSecondaryResult => {
  const [isSecondary, setIsSecondary] = useState(false);
  const pathname = usePathname();
  
  // Default patterns with option to override
  const secondaryPatterns = useMemo(() => 
    options?.secondaryPatterns || ['dashboards', 'ecommerce', 'home-2'], 
  [options?.secondaryPatterns]);
  
  const homePatterns = useMemo(() => 
    options?.homePatterns || ['home-2'], 
  [options?.homePatterns]);
  
  // Create regex patterns once
  const secondaryRegex = useMemo(() => 
    new RegExp(`\\b(?:${secondaryPatterns.join('|')})\\b`),
  [secondaryPatterns]);
  
  const homeRegex = useMemo(() => 
    new RegExp(`\\b(?:${homePatterns.join('|')})\\b`),
  [homePatterns]);
  
  /**
   * Check if a path matches a home pattern
   * @param path - Path to test, defaults to current path
   * @returns Whether the path matches a home pattern
   */
  const isHome = (path?: string): boolean => {
    const pathToTest = path || pathname || '';
    return homeRegex.test(pathToTest);
  };
  
  /**
   * Check if a path matches a secondary pattern
   * @param path - Path to test, defaults to current path
   * @returns Whether the path matches a secondary pattern
   */
  const isSecondaryPath = (path?: string): boolean => {
    const pathToTest = path || pathname || '';
    return secondaryRegex.test(pathToTest);
  };
  
  // Update isSecondary state when pathname changes
  useEffect(() => {
    if (pathname) {
      setIsSecondary(isSecondaryPath(pathname));
    }
  }, [pathname]);
  
  return { 
    isSecondary, 
    isHome,
    isSecondaryPath
  };
};

export default useIsSecondary; 