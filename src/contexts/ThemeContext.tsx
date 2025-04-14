'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: 'light' | 'dark'; // The actual theme applied (system resolves to light or dark)
  systemTheme?: 'dark' | 'light'; // The system preference regardless of chosen theme
  isDark: boolean;
  toggleTheme: () => void;
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
  defaultTheme = 'system'
}) => {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  
  // Function to set theme and save it to localStorage
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };
  
  // Initialize theme from localStorage and set up listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Get saved theme from localStorage or use default
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    if (savedTheme) {
      setThemeState(savedTheme);
    }
    
    // Function to update the resolved theme based on system preference or selected theme
    const updateResolvedTheme = () => {
      const currentTheme = localStorage.getItem('theme') as ThemeMode || theme;
      
      if (currentTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setResolvedTheme(systemTheme);
        document.documentElement.classList.toggle('dark', systemTheme === 'dark');
      } else {
        setResolvedTheme(currentTheme as 'light' | 'dark');
        document.documentElement.classList.toggle('dark', currentTheme === 'dark');
      }
    };
    
    // Initial update
    updateResolvedTheme();
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => updateResolvedTheme();
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);
  
  // Update theme when it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setResolvedTheme(systemTheme);
      document.documentElement.classList.toggle('dark', systemTheme === 'dark');
    } else {
      setResolvedTheme(theme as 'light' | 'dark');
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        resolvedTheme,
        systemTheme: theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : undefined,
        isDark: resolvedTheme === 'dark',
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;