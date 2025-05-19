"use client";
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.theme-toggle-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  if (!mounted) return null;

  const isDarkMode = theme === 'dark';

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative theme-toggle-container">
      {/* Main toggle button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="theme-toggle p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
        aria-label="Toggle theme"
        title="Toggle theme"
      >
        <div className="relative w-6 h-6">
          <div className={`absolute inset-0 transform transition-transform duration-500 ease-spring ${isDarkMode ? 'rotate-0' : 'rotate-90 opacity-0'}`}>
            <Moon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
          </div>
          <div className={`absolute inset-0 transform transition-transform duration-500 ease-spring ${isDarkMode ? '-rotate-90 opacity-0' : 'rotate-0'}`}>
            <Sun className="w-6 h-6 text-gray-800 dark:text-gray-200" />
          </div>
        </div>
      </button>

      {/* Theme selection dropdown */}
      <div className={`
        absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700
        transform transition-all duration-200 ease-in-out origin-top-right
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
      `}>
        <button
          onClick={() => handleThemeChange('light')}
          className={`
            w-full px-4 py-2 text-sm text-left flex items-center space-x-3
            ${theme === 'light' ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-700 dark:text-gray-300'}
            hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150
          `}
        >
          <Sun className="w-4 h-4" />
          <span>Light</span>
        </button>
        <button
          onClick={() => handleThemeChange('dark')}
          className={`
            w-full px-4 py-2 text-sm text-left flex items-center space-x-3
            ${theme === 'dark' ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-700 dark:text-gray-300'}
            hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150
          `}
        >
          <Moon className="w-4 h-4" />
          <span>Dark</span>
        </button>
      </div>

      {/* Add styles for the spring easing */}
      <style jsx>{`
        .ease-spring {
          transition-timing-function: cubic-bezier(0.5, 0, 0.1, 1.5);
        }
      `}</style>
    </div>
  );
};

export default ThemeToggle; 