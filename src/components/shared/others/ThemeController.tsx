'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

interface ThemeControllerProps {
  position?: 'fixed' | 'absolute' | 'relative' | 'static' | 'sticky';
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

type ThemeMode = 'light' | 'dark' | 'system';

const ThemeController = ({ 
  position = 'fixed', 
  className = '',
  showLabel = false,
  size = 'md'
}: ThemeControllerProps) => {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTheme, setActiveTheme] = useState<ThemeMode>(theme as ThemeMode || 'system');
  
  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Initialize active theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    if (savedTheme) {
      setActiveTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setActiveTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Sync active theme with next-themes
  useEffect(() => {
    if (mounted && activeTheme !== theme) {
      setTheme(activeTheme);
    }
  }, [activeTheme, mounted, setTheme, theme]);

  // Add keyboard shortcut listener
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
        e.preventDefault();
        toggleTheme();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [activeTheme]);

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (activeTheme === 'system') {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [activeTheme, setTheme]);

  // Memoize the current theme for performance
  const currentTheme = useMemo(() => {
    if (!mounted) return 'light';
    return resolvedTheme || 'light';
  }, [mounted, resolvedTheme]);

  // Toggle between themes
  const toggleTheme = useCallback(() => {
    setActiveTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  }, []);

  // Cycle through all themes
  const cycleTheme = useCallback(() => {
    setActiveTheme(prev => {
      const themes: ThemeMode[] = ['light', 'dark', 'system'];
      const currentIndex = themes.indexOf(prev);
      const nextIndex = (currentIndex + 1) % themes.length;
      const newTheme = themes[nextIndex];
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const isDarkMode = currentTheme === 'dark';
  
  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className={`${position} bottom-4 left-4 z-50 animate-slideUp ${className}`}>
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
        <button 
          onClick={cycleTheme}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          className={`group relative flex items-center justify-center ${sizeClasses[size]} rounded-lg transition-all duration-300 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700/50`}
          aria-label={`Current theme: ${activeTheme}. Click to cycle themes.`}
        >
          <div className="relative">
            {/* Light icon */}
            <div className={`absolute inset-0 transform transition-transform duration-500 ${isDarkMode ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}>
              <Sun className={`${iconSizes[size]} text-yellow-500`} />
            </div>
            
            {/* Dark icon */}
            <div className={`absolute inset-0 transform transition-transform duration-500 ${!isDarkMode ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}>
              <Moon className={`${iconSizes[size]} text-indigo-600`} />
            </div>
            
            {/* System icon (shown when system theme is active) */}
            {activeTheme === 'system' && (
              <div className="absolute inset-0 transform transition-transform duration-500 rotate-0 opacity-100">
                <Monitor className={`${iconSizes[size]} text-gray-500 dark:text-gray-400`} />
              </div>
            )}
          </div>

          {/* Label if enabled */}
          {showLabel && (
            <span className="ml-2 text-sm font-medium">
              {activeTheme === 'system' ? 'System' : activeTheme === 'dark' ? 'Dark' : 'Light'}
            </span>
          )}

          {/* Tooltip */}
          <div 
            className={`
              absolute bottom-full left-0 mb-2 px-3 py-1.5 
              text-sm text-white bg-gray-900/95 dark:bg-gray-700/95 rounded-lg shadow-lg 
              transition-all duration-200 whitespace-nowrap backdrop-blur-sm
              ${showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}
              hidden sm:block
            `}
            role="tooltip"
          >
            <span className="block font-medium">
              {activeTheme === 'system' 
                ? `System theme (${systemTheme === 'dark' ? 'Dark' : 'Light'})` 
                : `Switch to ${activeTheme === 'dark' ? 'light' : 'dark'} mode`}
            </span>
            <span className="block text-xs text-gray-400 mt-0.5">Press Ctrl/⌘ + J to toggle</span>
            {/* Arrow */}
            <div className="absolute bottom-0 left-4 transform translate-y-full">
              <div className="border-solid border-t-gray-900/95 dark:border-t-gray-700/95 border-t-8 border-x-transparent border-x-8 border-b-0" />
            </div>
          </div>

          {/* Mobile Ripple Effect */}
          <div className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-600 opacity-0 group-active:opacity-20 transition-opacity duration-200" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default ThemeController;
