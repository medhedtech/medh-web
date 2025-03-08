"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X, ChevronRight, Search, LogOut, User, Home, Book, Bell, Settings, Info, HelpCircle, Award, Bookmark, Heart, Share2, Calendar } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faSignOutAlt, faArrowLeft, faTimes, faCog, faSun, faMoon, faGraduationCap, faBookOpen, faBell, faHeart, faShareAlt, faTachometerAlt, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
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
  
  // Track menu sections for navigation history
  const [menuHistory, setMenuHistory] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
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
  
  // Enhanced navigation
  const navigateToSection = useCallback((section) => {
    setIsAnimating(true);
    setAnimationDirection('left');
    setMenuHistory(prev => [...prev, activeSection]);
    setActiveSection(section);
  }, [activeSection]);
  
  // Enhanced back navigation
  const goBack = useCallback(() => {
    if (menuHistory.length > 0) {
      setIsAnimating(true);
      setAnimationDirection('right');
      const prevSection = menuHistory[menuHistory.length - 1];
      setActiveSection(prevSection);
      setMenuHistory(prev => prev.slice(0, -1));
    }
  }, [menuHistory]);
  
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

  // Enhanced search functionality
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setIsSearching(true);
    
    // Simulated search suggestions - replace with actual API call
    if (e.target.value.trim()) {
      setSearchSuggestions([
        { type: 'course', title: 'React Development', path: '/courses/react' },
        { type: 'blog', title: 'Modern Web Development', path: '/blogs/web-dev' },
        { type: 'training', title: 'Corporate Training', path: '/corporate-training' }
      ]);
    } else {
      setSearchSuggestions([]);
    }
    
    setIsSearching(false);
  }, []);

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
      {/* Mobile menu toggle button with improved spacing */}
      {propOnClose === undefined && (
        <button
          type="button"
          onClick={openMenu}
          data-mobile-menu-toggle="true"
          className="lg:hidden inline-flex items-center justify-center p-3 rounded-full text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 transform hover:scale-105"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label="Open menu"
        >
          <span className="sr-only">Open main menu</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      )}
      
      {/* Animated mobile menu with enhanced spacing */}
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
              WebkitOverflowScrolling: 'touch',
              boxShadow: isOpen ? '-5px 0px 25px rgba(0, 0, 0, 0.2)' : 'none'
            }}
            onTransitionEnd={handleAnimationEnd}
          >
            {/* Enhanced Menu Header with improved styling */}
            <div className="sticky top-0 flex items-center justify-between bg-white/90 dark:bg-gray-900/95 backdrop-blur-md px-6 py-5 border-b border-gray-200/80 dark:border-gray-700/80 z-10">
              {menuHistory.length > 0 ? (
                <button
                  type="button"
                  className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
                  onClick={goBack}
                  aria-label="Go back to previous menu"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 mr-3" />
                  <span className="font-medium">Back</span>
                </button>
              ) : (
                <div className="text-lg font-semibold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent px-3">
                  Menu
                </div>
              )}
              
              <button
                type="button"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-3 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 transform hover:scale-105 active:scale-95"
                onClick={closeMenu}
                aria-label="Close menu"
                ref={closeButtonRef}
              >
                <span className="sr-only">Close menu</span>
                <FontAwesomeIcon icon={faTimes} className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Enhanced Quick Search with better styling */}
            <div className="px-6 pt-6 pb-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  placeholder="Quick search..."
                  className={`w-full py-3.5 pl-12 pr-4 text-base text-gray-900 dark:text-white rounded-xl ${
                    searchFocused 
                      ? 'bg-white dark:bg-gray-800 ring-2 ring-primary-500 dark:ring-primary-400 shadow-lg border-transparent' 
                      : 'bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700'
                  } focus:outline-none transition-all duration-300`}
                  aria-label="Quick search"
                />
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className={`absolute left-4 top-4 h-5 w-5 ${
                    searchFocused 
                      ? 'text-primary-500 dark:text-primary-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  } transition-colors duration-300`} 
                />
                <button type="submit" className="sr-only">Search</button>
              </form>

              {/* Search Suggestions with enhanced styling */}
              {searchQuery && searchSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-4 px-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="py-2 px-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Search Results</h3>
                    </div>
                    {searchSuggestions.map((suggestion, index) => (
                      <Link
                        key={index}
                        href={suggestion.path}
                        className="flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-b border-gray-100 dark:border-gray-800 last:border-0"
                        onClick={closeMenu}
                      >
                        <span className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mr-3">
                          <FontAwesomeIcon icon={suggestion.type === 'Course' ? faGraduationCap : faFile} className="h-4 w-4" />
                        </span>
                        <div>
                          <span className="block text-sm font-medium text-gray-900 dark:text-white">
                            {suggestion.title}
                          </span>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mt-1 block">
                            {suggestion.type}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Divider with gradient effect */}
            <div className="px-6">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
            </div>

            {/* Mobile menu content with enhanced styling */}
            <div 
              className={`px-6 pb-32 pt-4 transition-all duration-300 transform ${
                isAnimating && activeSection !== 'main'
                  ? animationDirection === 'left' 
                    ? '-translate-x-full' 
                    : 'translate-x-full'
                  : 'translate-x-0'
              } ${activeSection !== 'main' ? 'hidden' : ''}`}
            >
              {/* Main section with improved styling */}
              <div className="py-2 space-y-8">
                {/* Primary Navigation with better styling */}
                <nav aria-label="Primary navigation" className="space-y-1">
                  <style jsx global>{`
                    /* Enhance accordion styling */
                    .accordion-container {
                      @apply space-y-1;
                    }
                    
                    .accordion-controller {
                      @apply w-full flex justify-between items-center py-3 px-4 rounded-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800/80;
                    }
                    
                    .accordion-controller.active {
                      @apply bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400;
                    }
                    
                    .accordion-content {
                      @apply space-y-1 py-2 pl-4 ml-4 mt-1 border-l-2 border-gray-200 dark:border-gray-700;
                    }
                    
                    /* Enhance active item styling */
                    .mobile-item-active {
                      @apply border-l-2 border-primary-500 pl-2 -ml-2 text-primary-600 dark:text-primary-400;
                    }
                    
                    /* Add animation to accordion content */
                    .accordion-content {
                      animation: slideDown 0.2s ease-out;
                    }
                    
                    @keyframes slideDown {
                      from {
                        opacity: 0;
                        transform: translateY(-10px);
                      }
                      to {
                        opacity: 1;
                        transform: translateY(0);
                      }
                    }
                  `}</style>
                  {isHome2Dark ? <MobileItems2 /> : <MobileMenuItems />}
                </nav>
                
                {/* Section divider with subtle gradient */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
                
                {/* User Account Section with enhanced styling */}
                <div className="pt-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 flex items-center px-4">
                    <span>Account</span>
                    <span className="ml-2 h-px bg-gray-300 dark:bg-gray-700 flex-grow"></span>
                  </h3>

                  {/* Enhance account section content */}
                  <div className="space-y-1">
                    {isLoggedIn ? (
                      <>
                        {/* User profile section with improved styling */}
                        <div className="flex items-center px-4 py-3 mb-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                              <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{userName || 'User'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{userRole || 'Member'}</p>
                          </div>
                        </div>

                        {/* Enhanced dashboard link */}
                        <Link
                          href={getDashboardUrl()}
                          onClick={closeMenu}
                          className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl group transition-colors duration-200"
                        >
                          <FontAwesomeIcon icon={faTachometerAlt} className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-200" />
                          <span>Dashboard</span>
                        </Link>

                        {/* Enhanced logout button */}
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl group transition-colors duration-200"
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200" />
                          <span>Sign out</span>
                        </button>
                      </>
                    ) : (
                      <div className="space-y-2 pt-2">
                        {/* Enhanced sign in and register buttons */}
                        <Link
                          href="/login"
                          onClick={closeMenu}
                          className="flex items-center justify-center w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <FontAwesomeIcon icon={faSignInAlt} className="h-5 w-5 mr-2" />
                          <span>Sign in</span>
                        </Link>
                        
                        <Link
                          href="/register"
                          onClick={closeMenu}
                          className="flex items-center justify-center w-full px-4 py-3 mt-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <FontAwesomeIcon icon={faUserPlus} className="h-5 w-5 mr-2" />
                          <span>Register</span>
                        </Link>
                      </div>
                    )}
                  </div>
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
          
          {/* Enhanced Backdrop */}
          <div 
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[998] transition-all duration-300 ${
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
