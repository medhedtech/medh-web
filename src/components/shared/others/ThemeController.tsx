'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

interface ThemeControllerProps {
  position?: 'fixed' | 'absolute' | 'relative' | 'static' | 'sticky';
}

const ThemeController = ({ position = 'fixed' }: ThemeControllerProps) => {
  const { theme, setTheme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Add keyboard shortcut listener
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
        e.preventDefault();
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [theme, setTheme]);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const isDarkMode = theme === 'dark';

  return (
    <div className={`${position} bottom-4 left-4 z-50 animate-slideUp`}>
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
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

          {/* Tooltip */}
          <div 
            className={`
              absolute bottom-full left-0 mb-2 px-3 py-1.5 
              text-sm text-white bg-gray-900/95 dark:bg-gray-700/95 rounded-lg shadow-lg 
              transition-all duration-200 whitespace-nowrap backdrop-blur-sm
              ${showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}
              hidden sm:block
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
