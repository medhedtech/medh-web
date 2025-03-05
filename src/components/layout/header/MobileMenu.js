"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X, ChevronRight, Search, LogOut, User } from 'lucide-react';
import MobileMenuItems from "./MobileItems";
import MobileItems2 from "./MobileItems2";
import MobileMenuSearch from "./MobileMenuSearch";
import MobileMyAccount from "./MobileMyAccount";
import MobileSocial from "./MobileSocial";
import useIsTrue from "@/hooks/useIsTrue";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';

/**
 * Enhanced MobileMenu Component
 * Features:
 * - Smooth transitions and animations with GPU acceleration
 * - Improved accessibility with ARIA attributes
 * - Integration with site theme system
 * - Optimized performance with proper event cleanup
 * - Enhanced user experience with touch-friendly design
 * - Consistent styling with other Medh components
 */
const MobileMenu = ({ isOpen: propIsOpen, onClose: propOnClose }) => {
  // Page detection
  const isHome2Dark = useIsTrue("/home-2-dark");
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();
  
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
      
      // Reset menu state when opening
      setActiveSection('main');
      setMenuHistory([]);
    }
  }, [propOnClose]);
  
  const closeMenu = useCallback(() => {
    // Start closing animation
    setIsAnimating(true);
    setAnimationDirection('right');
    
    // Delay actual closing to allow animation to complete
    setTimeout(() => {
      if (propOnClose !== undefined) {
        propOnClose();
      } else {
        setIsInternalOpen(false);
      }
      
      // Return focus to the element that had focus before menu opened
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }, 300);
  }, [propOnClose]);
  
  // Handle animation end
  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };
  
  // Navigate to section with animation
  const navigateToSection = (section) => {
    setIsAnimating(true);
    setAnimationDirection('left');
    setMenuHistory(prev => [...prev, activeSection]);
    setTimeout(() => {
      setActiveSection(section);
      setIsAnimating(false);
      setAnimationDirection('right');
    }, 300);
  };
  
  // Go back to previous section with animation
  const goBack = () => {
    if (menuHistory.length === 0) {
      closeMenu();
      return;
    }
    
    setIsAnimating(true);
    setAnimationDirection('right');
    
    const previousSection = menuHistory[menuHistory.length - 1];
    setMenuHistory(prev => prev.slice(0, -1));
    
    setTimeout(() => {
      setActiveSection(previousSection);
      setIsAnimating(false);
      setAnimationDirection('left');
    }, 300);
  };
  
  // Close menu when pressing escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, closeMenu]);
  
  // Handle clicks outside menu to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    };
    
    // Only add the listener when the menu is open
    if (isOpen) {
      // Use a small delay to avoid capturing the click that opened the menu
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeMenu]);
  
  // Only handle body scroll if we're managing our own state
  // (parent Header component will handle this if props are provided)
  useEffect(() => {
    if (propOnClose === undefined && isOpen) {
      document.body.style.overflow = 'hidden';
    } else if (propOnClose === undefined) {
      document.body.style.overflow = '';
    }
    
    return () => {
      if (propOnClose === undefined) {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, propOnClose]);
  
  // Handle focus management for accessibility
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      // Set focus to the close button when menu opens
      setTimeout(() => {
        closeButtonRef.current.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Handle focus trap for keyboard navigation
  useEffect(() => {
    const handleTabKey = (e) => {
      if (!isOpen || !firstFocusableRef.current || !lastFocusableRef.current) return;
      
      // If shift + tab pressed and focus is on first element, move to last element
      if (e.key === 'Tab' && e.shiftKey && document.activeElement === firstFocusableRef.current) {
        e.preventDefault();
        lastFocusableRef.current.focus();
      }
      
      // If tab pressed and focus is on last element, move to first element
      if (e.key === 'Tab' && !e.shiftKey && document.activeElement === lastFocusableRef.current) {
        e.preventDefault();
        firstFocusableRef.current.focus();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleTabKey);
    }
    
    return () => {
      window.removeEventListener('keydown', handleTabKey);
    };
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
    
    if (roleLower === "admin" || roleLower === "super-admin") {
      return "/dashboards/admin-dashboard";
    } else if (roleLower === "instructor") {
      return "/dashboards/instructor-dashboard";
    } else if (roleLower === "student") {
      return "/dashboards/student-dashboard";
    } else if (roleLower === "coorporate") {
      return "/dashboards/coorporate-dashboard";
    } else if (roleLower === "coorporate-student") {
      return "/dashboards/coorporate-employee-dashboard";
    } else {
      // Default dashboard route if role is not recognized or undefined
      return "/dashboards";
    }
  };
  
  return (
    <>
      {/* Only render client-side content after mounting */}
      {mounted && (
        <>
          {/* Mobile Menu Button - Hamburger Icon (only show if we're self-managed) */}
          {propOnClose === undefined && (
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-full text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 transform hover:scale-105"
              onClick={openMenu}
              aria-expanded={isOpen}
              aria-label="Open main menu"
              aria-controls="mobile-menu"
              ref={firstFocusableRef}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          )}

          {/* Mobile Menu Panel */}
          <div 
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            className={`fixed top-0 right-0 w-[280px] sm:w-[330px] h-full bg-white dark:bg-gray-900 shadow-2xl z-[999] will-change-transform transition-all duration-300 ease-out transform ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            } ${isAnimating ? 'transition-transform' : ''}`}
            style={{ 
              maxHeight: '100vh', 
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
                  <ChevronRight className="h-5 w-5 transform rotate-180 mr-1" />
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
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="px-4 pt-4 pb-2">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Quick search..."
                  className="w-full py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-all"
                  aria-label="Quick search"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
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
                <div className="mt-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                    Your Account
                  </h3>
                  
                  <MobileMyAccount onClose={closeMenu} />
                </div>
                
                {/* Featured section */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary-500 mr-2"></span>
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
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                    <button 
                      className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      onClick={() => {
                        const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
                        document.documentElement.classList.toggle('dark');
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
