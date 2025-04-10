"use client";

import { useMemo } from 'react';
import useMediaQuery from './useMediaQuery';

// Tailwind CSS breakpoints
export const breakpoints = {
  xs: 0,      // Extra small devices (portrait phones)
  sm: 640,    // Small devices (landscape phones)
  md: 768,    // Medium devices (tablets)
  lg: 1024,   // Large devices (desktops)
  xl: 1280,   // Extra large devices (large desktops)
  '2xl': 1536 // 2X Extra large devices
};

export type Breakpoint = keyof typeof breakpoints;

export interface ScreenSize {
  // Current breakpoint
  current: Breakpoint;
  
  // Boolean flags for ease of use
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  
  // Specific breakpoint checks 
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2Xl: boolean;
  
  // Comparison helpers
  smallerThan: (breakpoint: Breakpoint) => boolean;
  largerThan: (breakpoint: Breakpoint) => boolean;
  between: (min: Breakpoint, max: Breakpoint) => boolean;
}

/**
 * Hook that provides responsive breakpoint information
 * Consistent with Tailwind CSS breakpoints
 * 
 * @returns Object with current breakpoint and helper methods
 * 
 * @example
 * const { isMobile, isDesktop, current } = useScreenSize();
 * 
 * if (isMobile) {
 *   // Do something for mobile
 * }
 * 
 * // Use the between helper method
 * const isMediumSize = between('sm', 'lg');
 */
export default function useScreenSize(): ScreenSize {
  // Use the useMediaQuery hook to check various breakpoints
  const isXs = true; // Always true as this is the base case
  const isSm = useMediaQuery(`(min-width: ${breakpoints.sm}px)`);
  const isMd = useMediaQuery(`(min-width: ${breakpoints.md}px)`);
  const isLg = useMediaQuery(`(min-width: ${breakpoints.lg}px)`);
  const isXl = useMediaQuery(`(min-width: ${breakpoints.xl}px)`);
  const is2Xl = useMediaQuery(`(min-width: ${breakpoints['2xl']}px)`);

  // Determine current breakpoint
  const current = useMemo<Breakpoint>(() => {
    if (is2Xl) return '2xl';
    if (isXl) return 'xl';
    if (isLg) return 'lg';
    if (isMd) return 'md';
    if (isSm) return 'sm';
    return 'xs';
  }, [isSm, isMd, isLg, isXl, is2Xl]);

  // Common device type categories
  const isMobile = current === 'xs' || current === 'sm';
  const isTablet = current === 'md' || current === 'lg';
  const isDesktop = current === 'xl' || current === '2xl';

  // Helper functions for breakpoint comparisons
  const smallerThan = (breakpoint: Breakpoint): boolean => {
    const breakpointValue = breakpoints[breakpoint];
    const currentValue = breakpoints[current];
    return currentValue < breakpointValue;
  };

  const largerThan = (breakpoint: Breakpoint): boolean => {
    const breakpointValue = breakpoints[breakpoint];
    const currentValue = breakpoints[current];
    return currentValue > breakpointValue;
  };

  const between = (min: Breakpoint, max: Breakpoint): boolean => {
    const minValue = breakpoints[min];
    const maxValue = breakpoints[max];
    const currentValue = breakpoints[current];
    return currentValue >= minValue && currentValue <= maxValue;
  };

  return {
    current,
    isMobile,
    isTablet,
    isDesktop,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    smallerThan,
    largerThan,
    between
  };
} 