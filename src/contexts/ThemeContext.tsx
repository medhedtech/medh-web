'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useIsClient } from '@/utils/hydration';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: 'light' | 'dark';
  isDark: boolean;
  toggleTheme: () => void;
  isClient: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useCustomTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useCustomTheme must be used within a CustomThemeProvider');
  }
  return context;
};

interface CustomThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
}

export const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({
  children,
  defaultTheme = 'light'
}) => {
  const isClient = useIsClient();
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);
  const [mounted, setMounted] = useState(false);
  
  // Function to set theme and save it to localStorage
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    if (isClient) {
      localStorage.setItem('theme', newTheme);
    }
  };
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };
  
  // Initialize theme from localStorage and set up listeners
  useEffect(() => {
    if (!isClient) return;

    // Mark as mounted to prevent hydration mismatches
    setMounted(true);

    // Get saved theme from localStorage or use default
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setThemeState(savedTheme);
    }
  }, [isClient]);
  
  // Update document theme when it changes
  useEffect(() => {
    if (!isClient || !mounted) return;
    
    console.log('Initial theme check:', {
      storedTheme: localStorage.getItem('theme'),
      hasDarkClass: document.documentElement.classList.contains('dark'),
      isDarkMode: theme === 'dark'
    });
    
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme, isClient, mounted]);

  // Prevent hydration mismatch by returning consistent initial state
  const resolvedTheme = mounted ? theme : defaultTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme: resolvedTheme,
        setTheme,
        resolvedTheme,
        isDark: resolvedTheme === 'dark',
        toggleTheme,
        isClient
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;