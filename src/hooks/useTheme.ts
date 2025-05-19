'use client';
import { useTheme as useNextThemes } from 'next-themes';
import { useCustomTheme } from '@/contexts/ThemeContext';
import { ThemeMode } from '@/contexts/ThemeContext';

/**
 * Hook for accessing and manipulating the application theme
 * This hook provides access to the next-themes implementation which is used in this project
 * 
 * @returns Theme context with current theme and theme manipulation functions
 * 
 * @example
 * const { theme, isDark, toggleTheme } = useTheme();
 * 
 * // Conditionally render based on theme
 * return (
 *   <div className={isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}>
 *     <button onClick={toggleTheme}>Toggle Theme</button>
 *   </div>
 * );
 */
export function useTheme() {
  // We're using next-themes in this project
  const { 
    theme, 
    setTheme 
  } = useNextThemes();
  
  // Add extra convenience methods
  return {
    theme,
    setTheme,
    resolvedTheme: theme as 'light' | 'dark',
    isDark: theme === 'dark',
    toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark')
  };
}

export default useTheme; 