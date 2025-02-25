'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeController = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme based on system preference or stored preference
  useEffect(() => {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem('theme');
    
    // Check system preference if no stored theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    if (isDarkMode) {
      // Switch to light mode
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      // Switch to dark mode
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <div className="fixed top-24 md:top-32 right-0 z-40 transition-transform duration-300 transform hover:translate-x-0 translate-x-14">
      <button
        onClick={toggleTheme}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        className="flex items-center gap-2 py-2 pl-3 pr-4 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-200 dark:to-white text-white dark:text-gray-800 rounded-l-lg shadow-lg transition-all duration-300 hover:pl-4"
      >
        {isDarkMode ? (
          <>
            <Sun size={20} className="text-yellow-400" />
            <span className="text-sm font-medium">Light</span>
          </>
        ) : (
          <>
            <Moon size={20} className="text-blue-300" />
            <span className="text-sm font-medium">Dark</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ThemeController;
