import 'next-themes';
import { ThemeMode } from '@/contexts/ThemeContext';

/**
 * Extends the next-themes module with our custom theme functionality
 */
declare module 'next-themes' {
  export interface UseThemeProps {
    /** The current theme (light or dark) */
    theme?: ThemeMode | string;
    /** Set the theme */
    setTheme: (theme: ThemeMode | string) => void;
    /** Whether the current theme is dark */
    isDark?: boolean;
    /** Toggle between light and dark themes */
    toggleTheme?: () => void;
  }
} 