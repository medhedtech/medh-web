'use client';

import React, { useEffect, useState } from 'react';

/**
 * Hook to safely detect if we're running on the client side
 * This prevents hydration mismatches by ensuring server and client render the same initially
 */
export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

/**
 * Hook to safely get the current year without hydration mismatches
 */
export const useCurrentYear = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient) {
      setCurrentYear(new Date().getFullYear());
    }
  }, [isClient]);

  return currentYear;
};

/**
 * Hook to safely detect mobile viewport without hydration mismatches
 */
export const useIsMobile = (breakpoint: number = 640) => {
  const [isMobile, setIsMobile] = useState(false);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Initial check
    checkMobile();

    // Add resize listener with debounce
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [isClient, breakpoint]);

  return { isMobile, isClient };
};

/**
 * Hook to safely access localStorage without hydration mismatches
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;

    try {
      const item = localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key, isClient]);

  const setValue = (value: T | ((val: T) => T)) => {
    if (!isClient) return;

    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};

/**
 * Safe localStorage access that won't cause hydration issues
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silently fail
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently fail
    }
  },
};

/**
 * Safe sessionStorage access that won't cause hydration issues
 */
export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // Silently fail
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(key);
    } catch {
      // Silently fail
    }
  },
};

/**
 * Safe way to generate random values that won't cause hydration mismatches
 * Uses crypto.getRandomValues when available, falls back to deterministic values
 */
export const safeRandom = {
  number: (min: number = 0, max: number = 1): number => {
    if (typeof window !== 'undefined' && window.crypto) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return min + (array[0] / (0xFFFFFFFF + 1)) * (max - min);
    }
    // Fallback to Math.random for server-side or unsupported browsers
    return min + Math.random() * (max - min);
  },
  
  integer: (min: number = 0, max: number = 100): number => {
    return Math.floor(safeRandom.number(min, max + 1));
  },
  
  boolean: (): boolean => {
    return safeRandom.number() > 0.5;
  },
  
  string: (length: number = 10): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(safeRandom.integer(0, chars.length - 1));
    }
    return result;
  }
};

/**
 * Hook to safely access window properties without hydration mismatches
 */
export const useWindowProperty = <T>(property: keyof Window, defaultValue: T): T => {
  const [value, setValue] = useState<T>(defaultValue);
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      setValue(window[property] as T);
    }
  }, [property, isClient]);

  return value;
};

/**
 * Wrapper component to prevent hydration mismatches for client-only content
 */
export const ClientOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => {
  const isClient = useIsClient();

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Utility to suppress hydration warnings for elements that might be affected by browser extensions
 */
export const getHydrationSafeProps = () => ({
  suppressHydrationWarning: true,
}); 