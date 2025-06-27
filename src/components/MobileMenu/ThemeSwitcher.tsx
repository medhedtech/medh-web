"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon, Settings, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { STYLES } from '@/constants/uiStyles';
import { IThemeSwitcherProps } from './types';

/**
 * ThemeSwitcher Component
 * Animated theme switching and settings access
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
      }, 600);
    }, 150);
  };
  
  // Don't render until mounted to prevent hydration issues
  if (!mounted) return null;
  
  // Determine current theme
  const isDark = theme === 'dark';
  
  return (
    <div className={STYLES.stickyFooter}>
      <div className="flex items-center justify-between">
        <button
          onClick={toggleTheme}
          className="flex items-center px-4 py-2 rounded-lg
            text-gray-700 dark:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-800
            transition-colors duration-200"
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          <div className="relative w-5 h-5 mr-2">
            {isDark ? (
              <Moon className={`h-5 w-5 absolute ${isAnimating ? 'animate-fadeOutRotate' : 'animate-fadeIn'}`} />
            ) : (
              <Sun className={`h-5 w-5 absolute ${isAnimating ? 'animate-fadeOutRotate' : 'animate-fadeIn'}`} />
            )}
          </div>
          <span>{isDark ? 'Dark' : 'Light'} Mode</span>
        </button>

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