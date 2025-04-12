"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X, ChevronRight, Search, LogOut, User, Home, Book, Bell, Settings, Info, HelpCircle, Award, Bookmark, Heart, Share2, Calendar, ChevronLeft, Sun, Moon, Users, GraduationCap, Briefcase, FileText, ExternalLink, Mail, Phone, MapPin, DollarSign, Globe, BarChart } from 'lucide-react';
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

// Centralized config data for menu options
const MENU_CONFIG = {
  // Quick actions configuration
  quickActions: {
    guest: [
      { icon: Home, label: "Home", path: "/" },
      { icon: Book, label: "Courses", path: "/courses" },
    ],
    authenticated: [
      { icon: Home, label: "Home", path: "/" },
      { icon: Book, label: "Courses", path: "/courses" },
      { icon: Bell, label: "Notifications", path: "/notifications" },
      { icon: Bookmark, label: "Saved", path: "/saved" }
    ]
  },
  
  // Primary navigation sections - updated to match NavItems2.js
  navSections: [
    { icon: Info, label: 'About', path: '/about-us', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20', hasDropdown: false },
    { icon: FileText, label: 'Blog', path: '/dashboards/instructor-dashboard', color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-900/20'},
    { icon: Bookmark, label: 'Pages', path: '/about-us', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20'},
    { icon: Mail, label: 'Contact', path: '/contact-us', color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-900/20'},
    { icon: Briefcase, label: 'Corporate', path: '/corporate-training-courses', color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/20' },
    { icon: Users, label: 'Hire Talent', path: '/hire-from-medh', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20' },
    { icon: Bell, label: 'Updates', path: '/notifications', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20' }
  ],
  
  // Search suggestion types and their corresponding icons
  suggestionTypes: {
    course: Book,
    blog: FileText,
    instructor: User,
    default: Book
  }
};

// Reusable style classes as constants
const STYLES = {
  gridContainer: "grid grid-cols-4 gap-4 mb-6",
  navContainer: "grid grid-cols-4 gap-3 mt-6",
  quickActionItem: `
    flex flex-col items-center justify-center p-3
    rounded-xl bg-gray-50 dark:bg-gray-800/50
    hover:bg-gray-100 dark:hover:bg-gray-700/50
    transition-colors duration-200
  `,
  menuItem: `
    relative group flex flex-col items-center justify-center p-3 rounded-xl
    bg-gray-50/80 dark:bg-gray-800/50
    hover:bg-white dark:hover:bg-gray-700/50
    border border-gray-200/50 dark:border-gray-700/50
    transition-all duration-300 transform 
    hover:scale-105 hover:shadow-lg
  `,
  iconWrapper: `
    flex items-center justify-center w-10 h-10 
    rounded-xl transition-transform duration-300
    group-hover:-translate-y-1
  `,
  suggestionItem: `
    flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50
    border-b border-gray-100 dark:border-gray-800 last:border-0
    transition-colors duration-200
  `
};

// Reusable UI Component Factory
const UIComponents = {
  // Generic link creator with consistent styling
  createLinkItem: (props) => {
    const { icon: Icon, label, path, onClick, className = "", children, ...rest } = props;
    
    return (
      <Link href={path} onClick={onClick} className={className} {...rest}>
        {children || (
          <>
            {Icon && <Icon className="h-6 w-6 mb-2 text-gray-700 dark:text-gray-300" />}
            <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
          </>
        )}
      </Link>
    );
  },
  
  // Quick action item
  QuickActionItem: (props) => {
    return UIComponents.createLinkItem({
      ...props,
      className: STYLES.quickActionItem
    });
  },
  
  // Menu icon for navigation items
  MenuIcon: ({ children, className = "" }) => (
    <div className={`${STYLES.iconWrapper} ${className}`}>
      {children}
    </div>
  ),
  
  // Full menu item with icon
  MenuItem: (props) => {
    const { icon: Icon, label, path, onClick, color, bg, className = "" } = props;
    
    return UIComponents.createLinkItem({
      ...props,
      className: `${STYLES.menuItem} ${className}`,
      children: (
        <>
          <UIComponents.MenuIcon className={bg}>
            <Icon className={`h-5 w-5 ${color || "text-gray-700 dark:text-gray-300"}`} />
          </UIComponents.MenuIcon>
          <span className="text-xs font-medium mt-1
            text-gray-600 dark:text-gray-400
            group-hover:text-gray-900 dark:group-hover:text-white">
            {label}
          </span>
        </>
      )
    });
  },
  
  // Search suggestion item
  SearchSuggestion: (props) => {
    const { type, title, path, onClick } = props;
    const SuggestionIcon = MENU_CONFIG.suggestionTypes[type] || MENU_CONFIG.suggestionTypes.default;
    
    return UIComponents.createLinkItem({
      path,
      onClick,
      className: STYLES.suggestionItem,
      children: (
        <>
          <div className="flex-shrink-0 w-10 h-10 rounded-full
            bg-primary-100 dark:bg-primary-900/20
            text-primary-600 dark:text-primary-400
            flex items-center justify-center mr-3">
            <SuggestionIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {title}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {type}
            </div>
          </div>
        </>
      )
    });
  }
};

/**
 * Enhanced MobileMenu Component with DRY principles
 */
const MobileMenu = ({ isOpen: propIsOpen, onClose: propOnClose }) => {
  // Page detection
  const isHome2Dark = useIsTrue("/home-2-dark");
  const router = useRouter();
  const { theme, resolvedTheme, setTheme } = useTheme();
  
  // Enhanced UI state
  const [mounted, setMounted] = useState(false);
  const [isInternalOpen, setIsInternalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [animationDirection, setAnimationDirection] = useState('right');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [menuOpacity, setMenuOpacity] = useState(0);
  const [menuScale, setMenuScale] = useState(0.98);
  
  // Track menu sections for navigation history
  const [menuHistory, setMenuHistory] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Refs for enhanced interactions
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Determine actual open state
  const isOpen = propIsOpen !== undefined ? propIsOpen : isInternalOpen;
  
  // Handle mounting state and data initialization
  useEffect(() => {
    setMounted(true);
    
    // Check authentication status
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!token && !!userId);

    if (token && userId) {
      const name = localStorage.getItem("name") || "";
      const email = localStorage.getItem("email") || "";
      setUserName(name || email?.split('@')[0] || "");
      setUserRole(localStorage.getItem("role") || "");
    }

    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
    }
  }, []);
  
  // Enhanced animation effects
  useEffect(() => {
    if (isOpen) {
      // Stagger animations for smooth opening
      setTimeout(() => setMenuOpacity(1), 50);
      setTimeout(() => setMenuScale(1), 100);
    } else {
      setMenuOpacity(0);
      setMenuScale(0.98);
    }
  }, [isOpen]);
  
  // Get quick actions based on authentication status
  const getQuickActions = useCallback(() => {
    return isLoggedIn 
      ? MENU_CONFIG.quickActions.authenticated 
      : MENU_CONFIG.quickActions.guest;
  }, [isLoggedIn]);
  
  // Enhanced search functionality
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setIsSearching(true);
    
    // Intelligent search suggestions
    if (e.target.value.trim()) {
      // Simulate API call for suggestions
      setSearchSuggestions([
        { type: 'course', title: 'React Development', path: '/courses/react' },
        { type: 'blog', title: 'Modern Web Development', path: '/blogs/web-dev' },
        { type: 'instructor', title: 'John Doe', path: '/instructors/john-doe' },
      ]);
    } else {
      setSearchSuggestions([]);
    }
    
    setIsSearching(false);
  }, []);
  
  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Save to recent searches
      const updatedSearches = [
        searchQuery,
        ...recentSearches.filter(s => s !== searchQuery)
      ].slice(0, 5);
      
      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
      
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      closeMenu();
    }
  };
  
  // Enhanced menu navigation
  const navigateToSection = useCallback((section) => {
    setAnimationDirection('left');
    setMenuHistory(prev => [...prev, activeSection]);
    setActiveSection(section);
  }, [activeSection]);
  
  // Enhanced back navigation
  const goBack = useCallback(() => {
    if (menuHistory.length > 0) {
      setAnimationDirection('right');
      const prevSection = menuHistory[menuHistory.length - 1];
      setActiveSection(prevSection);
      setMenuHistory(prev => prev.slice(0, -1));
    }
  }, [menuHistory]);
  
  // Handle logout with animation
  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("permissions");
    
    setIsLoggedIn(false);
    closeMenu();
    router.push("/");
  };
  
  // Enhanced close menu function
  const closeMenu = useCallback(() => {
    setMenuScale(0.98);
    setMenuOpacity(0);
    
    setTimeout(() => {
      if (propOnClose) {
        propOnClose();
      } else {
        setIsInternalOpen(false);
      }
    }, 200);
  }, [propOnClose]);
  
  // No need to render until hydration is complete
  if (!mounted) return null;
  
  return (
    <>
      {/* Enhanced mobile menu toggle */}
      {propOnClose === undefined && (
        <button
          type="button"
          onClick={() => setIsInternalOpen(true)}
          className="lg:hidden inline-flex items-center justify-center p-3 rounded-xl
            text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 
            dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/80
            focus:outline-none focus:ring-2 focus:ring-primary-500 
            transition-all duration-200 transform hover:scale-105 active:scale-95"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          <span className="sr-only">Open menu</span>
          <Menu className="h-6 w-6" />
        </button>
      )}
      
      {/* Enhanced mobile menu with glassmorphism */}
      {mounted && (
        <>
          {/* Backdrop with blur effect */}
          <div 
            className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[998] transition-opacity duration-300
              ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Main menu container with enhanced animations */}
          <div
            ref={menuRef}
            className={`fixed inset-y-0 right-0 z-[999] w-full sm:max-w-sm
              bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl
              shadow-2xl overflow-hidden transition-all duration-300 ease-out
              ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            style={{
              opacity: menuOpacity,
              transform: `translateX(${isOpen ? '0' : '100%'}) scale(${menuScale})`,
              transition: 'transform 0.3s ease-out, opacity 0.2s ease-out',
            }}
            role="dialog"
            aria-modal="true"
          >
            {/* Enhanced header with animations */}
            <div className="sticky top-0 z-50">
              <div className="relative">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/80 dark:from-gray-900/80 to-transparent pointer-events-none" />
                
                {/* Header content */}
                <div className="relative flex items-center justify-between px-4 py-4">
                  {menuHistory.length > 0 ? (
                    <button
                      onClick={goBack}
                      className="inline-flex items-center text-gray-700 dark:text-gray-300
                        hover:text-primary-600 dark:hover:text-primary-400
                        transition-colors duration-200"
                    >
                      <ChevronLeft className="h-5 w-5 mr-1" />
                      <span className="font-medium">Back</span>
                    </button>
                  ) : (
                    <div className="text-lg font-semibold bg-gradient-to-r from-primary-600 to-purple-600 
                      bg-clip-text text-transparent">
                      Menu
                    </div>
                  )}

                  {/* Close button with animation */}
                  <button
                    onClick={closeMenu}
                    className="p-2 rounded-full text-gray-700 dark:text-gray-300
                      hover:bg-gray-100 dark:hover:bg-gray-800
                      transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced search section */}
            <div className="px-4 pt-2 pb-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search courses, topics, instructors..."
                  className={`w-full py-3 pl-11 pr-4 text-base rounded-xl
                    transition-all duration-200
                    ${searchFocused 
                      ? 'bg-white dark:bg-gray-800 ring-2 ring-primary-500 shadow-lg' 
                      : 'bg-gray-100 dark:bg-gray-800/60'}
                    text-gray-900 dark:text-white
                    placeholder-gray-500 dark:placeholder-gray-400
                    focus:outline-none`}
                />
                <Search className={`absolute left-3 top-3.5 h-5 w-5
                  ${searchFocused 
                    ? 'text-primary-500 dark:text-primary-400' 
                    : 'text-gray-400 dark:text-gray-500'}
                  transition-colors duration-200`}
                />
              </form>

              {/* Search suggestions with animations */}
              {searchQuery && searchSuggestions.length > 0 && (
                <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg
                  border border-gray-200 dark:border-gray-700 overflow-hidden
                  animate-fadeIn">
                  {searchSuggestions.map((suggestion, index) => (
                    <UIComponents.SearchSuggestion 
                      key={index}
                      {...suggestion}
                      onClick={closeMenu}
                    />
                  ))}
                </div>
              )}

              {/* Recent searches */}
              {!searchQuery && recentSearches.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Recent Searches
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(search);
                          searchInputRef.current?.focus();
                        }}
                        className="px-3 py-1.5 text-sm rounded-lg
                          bg-gray-100 dark:bg-gray-800
                          text-gray-700 dark:text-gray-300
                          hover:bg-gray-200 dark:hover:bg-gray-700
                          transition-colors duration-200"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main menu content with sections */}
            <div className="flex-1 overflow-y-auto overscroll-y-contain">
              <div className="px-4 py-2">
                {/* Quick actions grid */}
                <div className={STYLES.gridContainer}>
                  {getQuickActions().map((action, index) => (
                    <UIComponents.QuickActionItem
                      key={index}
                      {...action}
                      onClick={closeMenu}
                    />
                  ))}
                </div>

                {/* Navigation sections with enhanced styling */}
                <nav className={STYLES.navContainer}>
                  {MENU_CONFIG.navSections.map((item, index) => (
                    <UIComponents.MenuItem
                      key={index}
                      {...item}
                      onClick={closeMenu}
                    />
                  ))}
                </nav>

                {/* User section */}
                {isLoggedIn ? (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center px-4 py-3 mb-4
                      bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full
                          bg-primary-100 dark:bg-primary-900/20
                          text-primary-600 dark:text-primary-400
                          flex items-center justify-center">
                          <User className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {userName || 'User'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {userRole || 'Member'}
                        </div>
                      </div>
                    </div>

                    {/* User actions */}
                    <div className="space-y-1">
                      <Link
                        href="/dashboards"
                        onClick={closeMenu}
                        className="flex items-center px-4 py-3 rounded-xl
                          text-gray-700 dark:text-gray-300
                          hover:bg-gray-100 dark:hover:bg-gray-800
                          transition-colors duration-200"
                      >
                        <Home className="h-5 w-5 mr-3" />
                        <span>Dashboard</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 rounded-xl
                          text-red-600 dark:text-red-400
                          hover:bg-red-50 dark:hover:bg-red-900/20
                          transition-colors duration-200"
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-3">
                      <Link
                        href="/login"
                        onClick={closeMenu}
                        className="flex items-center justify-center w-full px-4 py-3
                          bg-primary-600 hover:bg-primary-700
                          text-white rounded-xl
                          transition-all duration-200
                          transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Sign In
                      </Link>

                      <Link
                        href="/register"
                        onClick={closeMenu}
                        className="flex items-center justify-center w-full px-4 py-3
                          border border-gray-300 dark:border-gray-700
                          text-gray-700 dark:text-gray-300
                          hover:bg-gray-50 dark:hover:bg-gray-800
                          rounded-xl
                          transition-all duration-200
                          transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Create Account
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Theme toggle and settings */}
            <div className="sticky bottom-0 z-50 w-full px-4 py-4
              bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
              border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                  className="flex items-center px-4 py-2 rounded-lg
                    text-gray-700 dark:text-gray-300
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    transition-colors duration-200"
                >
                  {resolvedTheme === 'dark' ? (
                    <Moon className="h-5 w-5 mr-2" />
                  ) : (
                    <Sun className="h-5 w-5 mr-2" />
                  )}
                  <span>{resolvedTheme === 'dark' ? 'Dark' : 'Light'} Mode</span>
                </button>

                <Link
                  href="/settings"
                  onClick={closeMenu}
                  className="p-2 rounded-lg
                    text-gray-700 dark:text-gray-300
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    transition-colors duration-200"
                >
                  <Settings className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileMenu;
