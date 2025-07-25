"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface HydrationSafeThemeProps {
  children: (isDark: boolean, mounted: boolean) => React.ReactNode;
  fallbackTheme?: 'light' | 'dark';
}

/**
 * A component that safely handles theme-dependent rendering to prevent hydration mismatches.
 * It ensures the server and client render the same content initially, then updates once hydrated.
 */
export default function HydrationSafeTheme({ 
  children, 
  fallbackTheme = 'light' 
}: HydrationSafeThemeProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial client render, use fallback theme
  // After hydration, use actual theme
  const isDark = mounted 
    ? (resolvedTheme || theme) === 'dark'
    : fallbackTheme === 'dark';

  return <>{children(isDark, mounted)}</>;
} 