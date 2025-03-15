'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeController = ({ position = 'fixed' }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  // Initialize theme based on system preference or stored preference
  useEffect(() => {
    const initializeTheme = () => {
      try {
        // Check if theme is stored in localStorage
        const storedTheme = localStorage.getItem('theme');
        
        // Check system preference if no stored theme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set initial theme
        const shouldUseDarkMode = storedTheme === 'dark' || (!storedTheme && prefersDark);
        
        setIsDarkMode(shouldUseDarkMode);
        document.documentElement.classList.toggle('dark', shouldUseDarkMode);
        
        // Add transition class after initial load
        document.documentElement.classList.add('theme-transition');
      } catch (error) {
        console.error('Error initializing theme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
        document.documentElement.classList.toggle('dark', e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // Add keyboard shortcut listener
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
        e.preventDefault();
        toggleTheme();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isDarkMode]);

  // Toggle theme function
  const toggleTheme = () => {
    try {
      const newDarkMode = !isDarkMode;
      document.documentElement.classList.toggle('dark', newDarkMode);
      localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
      setIsDarkMode(newDarkMode);
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className={`${position} bottom-4 left-4 z-50 animate-slideUp`}>
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
        <button 
          onClick={toggleTheme}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          className="group relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          <div className="relative w-5 h-5">
            <div className={`absolute inset-0 transform transition-transform duration-500 ${isDarkMode ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'}`}>
              <Sun className="w-5 h-5 text-yellow-500" />
            </div>
            <div className={`absolute inset-0 transform transition-transform duration-500 ${!isDarkMode ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}>
              <Moon className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          
          {/* Text Label */}
          {/* <span className="text-xs font-medium whitespace-nowrap">
            {isDarkMode ? 'Light' : 'Dark'}
          </span> */}

          {/* Tooltip */}
          <div 
            className={`
              absolute bottom-full left-0 mb-2 px-3 py-1.5 
              text-sm text-white bg-gray-900/95 dark:bg-gray-700/95 rounded-lg shadow-lg 
              transition-all duration-200 whitespace-nowrap backdrop-blur-sm
              ${showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}
            `}
          >
            <span className="block font-medium">
              {isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            </span>
            <span className="block text-xs text-gray-400 mt-0.5">Press Ctrl/⌘ + J</span>
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

// Add this to your global CSS file (e.g., globals.css)
/*
.theme-transition * {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-duration: 200ms;
  transition-timing-function: ease-out;
}
*/
