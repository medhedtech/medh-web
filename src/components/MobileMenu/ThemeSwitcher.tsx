"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon, Settings, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { STYLES } from '@/constants/uiStyles';
import { IThemeSwitcherProps } from './types';

/**
 * ThemeSwitcher Component
 * Animated theme switching with toggle switch design
 */
const ThemeSwitcher: React.FC<IThemeSwitcherProps> = ({ 
  onClose,
  isLoggedIn,
  onLogout
}) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Handle mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Toggle theme with animation
  const toggleTheme = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    // Apply theme after animation starts
    setTimeout(() => {
      setTheme(newTheme);
      
      // Reset animation state after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 150);
  };
  
  // Don't render until mounted to prevent hydration issues
  if (!mounted) return null;
  
  // Determine current theme
  const isDark = theme === 'dark';
  
  return (
    <div className={STYLES.stickyFooter}>
      <div className="flex items-center justify-between">
        {/* Theme Toggle Switch */}
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-3">
            Theme
          </span>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isDark 
                ? 'bg-blue-600' 
                : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={isDark}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                isDark ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
            {/* Icons inside the toggle */}
            <Sun className={`absolute left-1 h-3 w-3 text-yellow-500 transition-opacity duration-300 ${
              isDark ? 'opacity-0' : 'opacity-100'
            }`} />
            <Moon className={`absolute right-1 h-3 w-3 text-blue-200 transition-opacity duration-300 ${
              isDark ? 'opacity-100' : 'opacity-0'
            }`} />
          </button>
        </div>

        <div className="flex items-center">
          {isLoggedIn && (
            <button
              onClick={onLogout}
              className="p-2 mr-1 rounded-lg text-red-600 dark:text-red-400
                hover:bg-red-50 dark:hover:bg-red-900/20
                transition-colors duration-200"
              aria-label="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher; 