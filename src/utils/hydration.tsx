import React, { useEffect, useState } from 'react';

/**
 * Hook to safely handle client-side only operations and prevent hydration mismatches
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
 * Component wrapper to prevent hydration mismatches
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