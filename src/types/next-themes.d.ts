import 'next-themes';
import { ThemeMode } from '@/contexts/ThemeContext';

/**
 * Extends the next-themes module with our custom theme functionality
 */
declare module 'next-themes' {
  export interface UseThemeProps {
    /** The current theme (light, dark, or system) */
    theme?: ThemeMode | string;
    /** The resolved theme (always light or dark) */
    resolvedTheme?: 'light' | 'dark';
    /** Convenience property to check if current theme is dark */
    isDark?: boolean;
    /** Toggle between light and dark themes */
    toggleTheme?: () => void;
    /** Set the theme */
    setTheme: (theme: ThemeMode | string) => void;
    /** If enableSystem is true, returns the System theme preference ("dark" or "light"), regardless what the active theme is */
    systemTheme?: 'dark' | 'light';
  }
} 