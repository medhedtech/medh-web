"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X, ChevronLeft, LogOut, GraduationCap } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { MENU_CONFIG } from '@/constants/menu';
import { STYLES } from '@/constants/uiStyles';
import { IMobileMenuProps, IMenuItemProps } from './types';

// Import modular components
import QuickActions from './QuickActions';
import SearchBar from './SearchBar';
import UserAccount from './UserAccount';
import ThemeSwitcher from './ThemeSwitcher';
import Link from 'next/link';

/**
 * Enhanced MobileMenu Component
 * Modular architecture with improved performance and accessibility
 */
const MobileMenu: React.FC<IMobileMenuProps> = ({ 
  isOpen: propIsOpen, 
  onClose: propOnClose 
}) => {
  // Routing
  const router = useRouter();
  const pathname = usePathname();
  
  // State management
  const [mounted, setMounted] = useState(false);
  const [isInternalOpen, setIsInternalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('main');
  const [animationDirection, setAnimationDirection] = useState('right');
  const [menuHistory, setMenuHistory] = useState<string[]>([]);
  const [menuOpacity, setMenuOpacity] = useState(0);
  const [menuScale, setMenuScale] = useState(0.98);
  
  // User state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  
  // Refs
  const menuRef = useRef<HTMLDivElement>(null);
  const previousIsOpen = useRef<boolean | undefined>(propIsOpen);
  
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
  }, []);
  
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (!mounted) return;
    
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPosition = window.getComputedStyle(document.body).position;
    const originalTop = window.getComputedStyle(document.body).top;
    const originalWidth = window.getComputedStyle(document.body).width;
    const originalHeight = window.getComputedStyle(document.body).height;
    const scrollY = window.scrollY;
    
    if (isOpen) {
      // Save the current scroll position
      document.body.dataset.scrollY = scrollY.toString();
      
      // Apply styles to lock scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      
      // For Safari: Prevent touchmove events on the body
      const preventTouchMove = (e: TouchEvent) => {
        // Allow scrolling inside the menu
        if (menuRef.current && menuRef.current.contains(e.target as Node)) {
          return;
        }
        e.preventDefault();
      };
      
      document.body.addEventListener('touchmove', preventTouchMove, { passive: false });
      
      // Additional handling for iOS Safari to prevent rubberbanding
      const preventScroll = (e: Event) => {
        // Only prevent default for specific elements that might cause pull-to-refresh
        // Don't prevent default on interactive elements like buttons and links
        const target = e.target as HTMLElement;
        const isInteractive = target.tagName === 'BUTTON' || 
                             target.tagName === 'A' || 
                             target.tagName === 'INPUT' ||
                             target.closest('button') || 
                             target.closest('a');
        
        if (!isInteractive && !menuRef.current?.contains(target)) {
          e.preventDefault();
        }
      };
      
      // Prevent pull-to-refresh on mobile (mainly iOS)
      document.addEventListener('touchstart', preventScroll, { passive: false });
      
      return () => {
        // Clean up the event listeners
        document.body.removeEventListener('touchmove', preventTouchMove);
        document.removeEventListener('touchstart', preventScroll);
      };
    } else {
      // Restore styles and scroll position
      document.body.style.overflow = originalStyle;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      document.body.style.height = originalHeight;
      
      // Restore scroll position
      const savedScrollY = document.body.dataset.scrollY;
      if (savedScrollY) {
        window.scrollTo(0, parseInt(savedScrollY, 10));
        delete document.body.dataset.scrollY;
      }
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      document.body.style.height = originalHeight;
      
      // Restore scroll position on unmount
      const savedScrollY = document.body.dataset.scrollY;
      if (savedScrollY) {
        window.scrollTo(0, parseInt(savedScrollY, 10));
        delete document.body.dataset.scrollY;
      }
      
      // Remove any remaining event listeners just in case
      const noop = () => {};
      document.body.removeEventListener('touchmove', noop);
      document.removeEventListener('touchstart', noop);
    };
  }, [isOpen, mounted]);
  
  // Add escape key listener
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);
  
  // Focus trap for accessibility
  useEffect(() => {
    if (!mounted || !isOpen || !menuRef.current) return;
    
    // Focus the menu when it opens
    menuRef.current.focus();
    
    // Find all focusable elements in the menu
    const focusableElements = menuRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    // Handler for tab key to trap focus
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, mounted]);
  
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
    
    // Reset menu state when closed
    if (previousIsOpen.current && !isOpen) {
      setTimeout(() => {
        setActiveSection('main');
        setMenuHistory([]);
      }, 300);
    }
    
    previousIsOpen.current = isOpen;
  }, [isOpen]);
  
  // Enhanced menu navigation
  const navigateToSection = useCallback((section: string) => {
    setAnimationDirection('left');
    setMenuHistory(prev => [...prev, activeSection]);
    setActiveSection(section);
  }, [activeSection]);
  
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
  
  // Render section content based on active section
  const renderSectionContent = useCallback(() => {
    switch(activeSection) {
      case 'courses':
        return (
          <div className="p-4">
            <h2 className={STYLES.sectionHeading}>Courses</h2>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {MENU_CONFIG.industries.map((item, index) => (
                <MenuItem key={index} {...item} />
              ))}
            </div>
            <div className="mt-6">
              <Link 
                href="/courses"
                onClick={closeMenu}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-500/10 text-primary-500"
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                <span>View All Courses</span>
              </Link>
            </div>
          </div>
        );
      case 'pages':
        return (
          <div className="p-4">
            <h2 className={STYLES.sectionHeading}>Pages</h2>
            <div className="space-y-3 mt-3">
              <Link 
                href="/about-us" 
                onClick={closeMenu}
                className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <h3 className="font-medium">About Us</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Learn about our mission</p>
              </Link>
              <Link 
                href="/contact-us" 
                onClick={closeMenu}
                className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <h3 className="font-medium">Contact Us</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get in touch with us</p>
              </Link>
              <Link 
                href="/join-us-as-educator" 
                onClick={closeMenu}
                className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <h3 className="font-medium">Join As An Educator</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Become a teacher</p>
              </Link>
              <Link 
                href="/hire-from-medh" 
                onClick={closeMenu}
                className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <h3 className="font-medium">Hire From Medh</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Find qualified talent</p>
              </Link>
            </div>
          </div>
        );
      default:
        // Main menu section - already handled in the main render
        return null;
    }
  }, [activeSection, closeMenu, MENU_CONFIG?.industries]);
  
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
  const handleLogout = useCallback(() => {
    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("permissions");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    
    setIsLoggedIn(false);
    closeMenu();
    router.push("/");
    
    // Could add toast notification here
  }, [router]);
  
  // Enhanced menu item component for main navigation
  const MenuItem = useCallback(({ 
    icon: Icon, 
    label, 
    path, 
    color, 
    bg,
    isRelative,
    dropdown
  }: IMenuItemProps) => {
    const isActive = pathname === path;
    
    // Check if path is empty and provide a fallback
    const linkPath = path || '/';
    
    const handleClick = (e: React.MouseEvent) => {
      if (!path) {
        e.preventDefault(); // Prevent navigation for empty paths
        return;
      }
      
      // For items with dropdown but no specific path
      if (dropdown && isRelative) {
        e.preventDefault(); // Prevent default navigation
        navigateToSection(label.toLowerCase()); // Navigate to dropdown section
        return;
      }
      
      closeMenu();
    };
    
    return (
      <Link 
        href={linkPath}
        onClick={handleClick}
        className={`${STYLES.menuItem} ${isActive ? 'ring-2 ring-primary-500' : ''}`}
        aria-current={isActive ? 'page' : undefined}
      >
        <div className={`${STYLES.iconWrapper} ${bg || ''}`}>
          <Icon className={`h-5 w-5 ${color || 'text-gray-700 dark:text-gray-300'}`} />
        </div>
        <span className="text-xs font-medium mt-1 text-center
          text-gray-600 dark:text-gray-400
          group-hover:text-gray-900 dark:group-hover:text-white">
          {label}
        </span>
        {dropdown && (
          <span className="ml-1 text-gray-400">
            <ChevronLeft size={14} className="transform rotate-180" />
          </span>
        )}
      </Link>
    );
  }, [pathname, closeMenu, navigateToSection]);
  
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
          aria-label="Open navigation menu"
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
              height: '100%',
              maxHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            tabIndex={-1}
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
                      aria-label="Go back"
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
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Menu content with modular components */}
            <div className="flex-1 overflow-y-auto overscroll-y-contain">
              {/* Search Bar */}
              <SearchBar onClose={closeMenu} />
              
              {/* Quick Actions */}
              <QuickActions 
                isLoggedIn={isLoggedIn} 
                onClose={closeMenu} 
              />
              
              {/* Conditional rendering based on active section */}
              {activeSection === 'main' ? (
                <>
                  {/* Main Navigation */}
                  <div className="px-4 py-2">
                    <h2 className={STYLES.sectionHeading}>Explore</h2>
                    <nav className={STYLES.navContainer}>
                      {MENU_CONFIG.navSections.map((item, index) => (
                        <MenuItem
                          key={index}
                          {...item}
                        />
                      ))}
                    </nav>
                  </div>
                  
                  {/* User Account */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <UserAccount 
                      isLoggedIn={isLoggedIn}
                      userName={userName}
                      userRole={userRole}
                      onClose={closeMenu}
                      onLogout={handleLogout}
                    />
                  </div>
                </>
              ) : (
                // Render content for the selected section
                renderSectionContent()
              )}
            </div>

            {/* Theme Switcher */}
            <ThemeSwitcher 
              onClose={closeMenu}
              isLoggedIn={isLoggedIn}
              onLogout={handleLogout}
            />
          </div>
        </>
      )}
    </>
  );
};

export default MobileMenu; 