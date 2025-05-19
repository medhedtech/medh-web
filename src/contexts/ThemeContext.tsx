'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: 'light' | 'dark';
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
  defaultTheme = 'light'
}) => {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);
  
  // Function to set theme and save it to localStorage
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
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
    if (typeof window === 'undefined') return;

    // Get saved theme from localStorage or use default
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setThemeState(savedTheme);
    }
    
    // Update document with current theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);
  
  // Update theme when it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        resolvedTheme: theme,
        isDark: theme === 'dark',
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;