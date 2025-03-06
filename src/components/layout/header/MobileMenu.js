"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X, ChevronRight, Search, LogOut, User, Home, Book, Bell, Settings, Info, HelpCircle, Award, Bookmark, Heart, Share2, Calendar } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faSignOutAlt, faArrowLeft, faTimes, faCog, faSun, faMoon, faGraduationCap, faBookOpen, faBell, faHeart, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import MobileMenuItems from "./MobileItems";
import MobileItems2 from "./MobileItems2";
import MobileMenuSearch from "./MobileMenuSearch";
import MobileMyAccount from "./MobileMyAccount";
import MobileSocial from "./MobileSocial";
import useIsTrue from "@/hooks/useIsTrue";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import Image from 'next/image';

/**
 * Enhanced MobileMenu Component
 * Features:
 * - Modern UI with Gen Z aesthetics and smooth transitions
 * - Improved accessibility with ARIA attributes
 * - Consistent icon system with FontAwesome and Lucide
 * - Optimized performance with proper event cleanup
 * - Enhanced user experience with intuitive interactions
 * - Beautiful visual hierarchy with proper spacing
 */
const MobileMenu = ({ isOpen: propIsOpen, onClose: propOnClose }) => {
  // Page detection
  const isHome2Dark = useIsTrue("/home-2-dark");
  const router = useRouter();
  const { theme, resolvedTheme, setTheme } = useTheme();
  
  // UI state
  const [mounted, setMounted] = useState(false);
  const [isInternalOpen, setIsInternalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeSection, setActiveSection] = useState('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [animationDirection, setAnimationDirection] = useState('right');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  
  // Handle mounting state
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Determine actual open state based on props or internal state
  const isOpen = propIsOpen !== undefined ? propIsOpen : isInternalOpen;
  
  // Refs for accessibility and event handling
  const menuRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Track menu sections for navigation history
  const [menuHistory, setMenuHistory] = useState([]);

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("username");
    setIsLoggedIn(!!token && !!userId);
    
    if (token && userId) {
      // Get user name from localStorage or token
      const name = localStorage.getItem("name") || "";
      const email = localStorage.getItem("email") || "";
      setUserName(name || email?.split('@')[0] || "");
      
      // Get user role from localStorage
      const role = localStorage.getItem("role") || "";
      setUserRole(role || "");
    }
    
    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      const newUserId = localStorage.getItem("userId");
      setIsLoggedIn(!!newToken && !!newUserId);
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  
  // Store elements that had focus before menu opened
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
    }
  }, [isOpen]);
  
  // Handle menu toggle with animations
  const openMenu = useCallback(() => {
    if (propOnClose === undefined) {
      setIsAnimating(true);
      setAnimationDirection('right');
      setIsInternalOpen(true);
      
      // Reset to main section when opening
      setActiveSection('main');
      setMenuHistory([]);
    }
  }, [propOnClose]);
  
  const closeMenu = useCallback(() => {
    if (propOnClose) {
      propOnClose();
    } else {
      setIsAnimating(true);
      setAnimationDirection('right');
      setIsInternalOpen(false);
      
      // Return focus to previous element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [propOnClose]);
  
  // Handle animation completion
  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };
  
  // Section navigation
  const navigateToSection = (section) => {
    setIsAnimating(true);
    setAnimationDirection('left');
    setMenuHistory(prev => [...prev, activeSection]);
    setActiveSection(section);
  };
  
  // Back navigation
  const goBack = () => {
    if (menuHistory.length > 0) {
      setIsAnimating(true);
      setAnimationDirection('right');
      const prevSection = menuHistory[menuHistory.length - 1];
      setActiveSection(prevSection);
      setMenuHistory(prev => prev.slice(0, -1));
    }
  };
  
  // Accessibility - Close on ESC key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, closeMenu]);
  
  // Handle clicks outside menu to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && isOpen) {
        // Check if the click was on an element with the attribute data-mobile-menu-toggle
        const isToggleButton = e.target.closest('[data-mobile-menu-toggle]');
        if (!isToggleButton) {
          closeMenu();
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeMenu]);
  
  // Focus management
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      // Focus the close button when menu opens
      setTimeout(() => {
        closeButtonRef.current.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Handle tab navigation within the menu
  useEffect(() => {
    const handleTabKey = (e) => {
      // Only handle tab navigation if the menu is open
      if (!isOpen || !firstFocusableRef.current || !lastFocusableRef.current) return;
      
      const isTabPressed = e.key === 'Tab';
      
      if (!isTabPressed) return;
      
      if (e.shiftKey) {
        // If shift + tab and focus is on first element, move to last
        if (document.activeElement === firstFocusableRef.current) {
          e.preventDefault();
          lastFocusableRef.current.focus();
        }
      } else {
        // If tab and focus is on last element, move to first
        if (document.activeElement === lastFocusableRef.current) {
          e.preventDefault();
          firstFocusableRef.current.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);
  
  // Close mobile menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        closeMenu();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, closeMenu]);

  // Handle quick search
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      closeMenu();
    }
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setSearchFocused(false);
  };
  
  // Handle user logout
  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("permissions");
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    
    // Remove cookies if they exist
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    setIsLoggedIn(false);
    closeMenu();
    
    // Redirect to home
    router.push("/");
  };
  
  // Get dashboard URL based on role
  const getDashboardUrl = () => {
    // Ensure userRole is a string and provide a default value
    const roleLower = (userRole || "").toLowerCase();
    
    switch(roleLower) {
      case "admin":
      case "administrator":
        return "/admin/dashboard";
      case "instructor":
      case "teacher":
        return "/instructor/dashboard";
      case "student":
      case "learner":
        return "/student/dashboard";
      default:
        return "/dashboard"; // Default dashboard
    }
  };
  
  // No need to render until hydration is complete
  if (!mounted) return null;
  
  return (
    <>
      {/* Mobile menu toggle button - Only shown in standalone mode */}
      {propOnClose === undefined && (
        <button
          type="button"
          onClick={openMenu}
          data-mobile-menu-toggle="true"
          className="lg:hidden inline-flex items-center justify-center p-2 rounded-full text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 transform hover:scale-105"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label="Open menu"
        >
          <span className="sr-only">Open main menu</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      )}
      
      {/* Animated mobile menu */}
      {mounted && (
        <>
          <div
            id="mobile-menu"
            ref={menuRef}
            className={`fixed inset-y-0 right-0 z-[999] w-full sm:max-w-sm bg-white dark:bg-gray-900 shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            style={{
              willChange: 'transform',
              overflowY: 'auto',
              boxShadow: isOpen ? '-5px 0px 25px rgba(0, 0, 0, 0.15)' : 'none'
            }}
            onTransitionEnd={handleAnimationEnd}
          >
            {/* Menu Header with Back Button and Close Button */}
            <div className="sticky top-0 flex items-center justify-between bg-white dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700 z-10">
              {/* Back button - Only show when in a submenu */}
              {menuHistory.length > 0 ? (
                <button
                  type="button"
                  className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  onClick={goBack}
                  aria-label="Go back to previous menu"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 mr-2" />
                  <span>Back</span>
                </button>
              ) : (
                <div className="text-lg font-semibold bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
                  Menu
                </div>
              )}
              
              {/* Close button */}
              <button
                type="button"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={closeMenu}
                aria-label="Close menu"
                ref={closeButtonRef}
              >
                <span className="sr-only">Close menu</span>
                <FontAwesomeIcon icon={faTimes} className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="px-4 pt-4 pb-2">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  placeholder="Quick search..."
                  className={`w-full py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white ${
                    searchFocused 
                      ? 'bg-white dark:bg-gray-700 ring-2 ring-primary-500 dark:ring-primary-400 shadow-md' 
                      : 'bg-gray-100 dark:bg-gray-800'
                  } rounded-full focus:outline-none transition-all duration-300`}
                  aria-label="Quick search"
                />
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className={`absolute left-3 top-2.5 h-4 w-4 ${
                    searchFocused 
                      ? 'text-primary-500 dark:text-primary-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  } transition-colors duration-300`} 
                />
                <button type="submit" className="sr-only">Search</button>
              </form>
            </div>

            {/* Mobile menu content - Main Menu */}
            <div 
              className={`px-4 sm:px-5 pb-28 transition-all duration-300 transform ${
                isAnimating && activeSection !== 'main'
                  ? animationDirection === 'left' 
                    ? '-translate-x-full' 
                    : 'translate-x-full'
                  : 'translate-x-0'
              } ${activeSection !== 'main' ? 'hidden' : ''}`}
            >
              {/* Main section */}
              <div className="py-2">
                {/* Primary Navigation */}
                <nav aria-label="Primary navigation" className="mt-4 space-y-1">
                  {isHome2Dark ? <MobileItems2 /> : <MobileMenuItems />}
                </nav>
                
                {/* User Account Section */}
                <div className="mt-8">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                    <FontAwesomeIcon icon={faUser} className="h-3 w-3 mr-2" />
                    Your Account
                  </h3>
                  
                  {isLoggedIn ? (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="relative flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center overflow-hidden">
                          <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {userName || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {userRole || 'Student'}
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex space-x-1">
                          {/* Dashboard button */}
                          <Link
                            href={getDashboardUrl()}
                            className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            onClick={closeMenu}
                          >
                            <FontAwesomeIcon icon={faUser} className="h-3 w-3" aria-hidden="true" />
                            <span className="sr-only">Dashboard</span>
                          </Link>
                          
                          {/* Logout button */}
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                          >
                            <FontAwesomeIcon icon={faSignOutAlt} className="h-3 w-3" aria-hidden="true" />
                            <span className="sr-only">Log out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <MobileMyAccount onClose={closeMenu} />
                  )}
                </div>
                
                {/* Featured section */}
                <div className="mt-8 p-4 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-lg border border-primary-100 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                    <span className="flex h-5 w-5 mr-2 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                      <FontAwesomeIcon icon={faGraduationCap} className="h-3 w-3 text-primary-600 dark:text-primary-400" />
                    </span>
                    New Courses Available
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Check out our latest professional certifications.
                  </p>
                  <button
                    className="mt-3 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform transition-transform hover:-translate-y-0.5"
                    onClick={() => {
                      router.push('/courses');
                      closeMenu();
                    }}
                  >
                    <FontAwesomeIcon icon={faBookOpen} className="h-3 w-3 mr-2" />
                    Browse Courses
                  </button>
                </div>
                
                {/* Social links */}
                <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <MobileSocial />
                </div>
              </div>
            </div>
            
            {/* Settings Menu Section - Hidden by default */}
            <div 
              className={`px-4 sm:px-5 pb-20 transition-all duration-300 transform ${
                isAnimating && activeSection !== 'settings'
                  ? animationDirection === 'left' 
                    ? '-translate-x-full' 
                    : 'translate-x-full'
                  : 'translate-x-0'
              } ${activeSection !== 'settings' ? 'hidden' : ''}`}
            >
              <div className="py-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <FontAwesomeIcon icon={faCog} className="h-4 w-4 mr-2 text-primary-500" />
                  Settings
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 flex items-center">
                      {resolvedTheme === 'dark' ? (
                        <FontAwesomeIcon icon={faMoon} className="h-4 w-4 mr-2 text-purple-500" />
                      ) : (
                        <FontAwesomeIcon icon={faSun} className="h-4 w-4 mr-2 text-amber-500" />
                      )}
                      Dark Mode
                    </span>
                    <button 
                      className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      onClick={() => {
                        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
                      }}
                    >
                      <div className={`bg-white dark:bg-primary-500 w-4 h-4 rounded-full transform transition-transform duration-300 ${
                        resolvedTheme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                      }`}></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Backdrop - always present but conditionally visible */}
          <div 
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[998] transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={closeMenu}
            aria-hidden="true"
          />
        </>
      )}
    </>
  );
};

export default MobileMenu;
