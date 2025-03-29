'use client';
import { useTheme as useThemeContext } from '@/contexts/ThemeContext';

/**
 * Hook for accessing and manipulating the application theme
 * 
 * @returns Theme context with current theme, resolved theme, and theme manipulation functions
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
  return useThemeContext();
}

export default useTheme; 