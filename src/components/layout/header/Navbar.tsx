"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, Video } from "lucide-react";
import NavItems from "./NavItems";
import NavbarLogo from "./NavbarLogo";
import DashboardProfileComponent from "./DashboardProfileComponent";
import NavItems2 from "./NavItems2";
import useIsTrue from "@/hooks/useIsTrue";
import NavbarTop from "./NavbarTop";
import NavbarSearch from "@/components/shared/search/NavbarSearch";

interface NavbarProps {
  onMobileMenuOpen?: () => void;
  viewportWidth?: number;
  scrollProgress?: number;
}

/**
 * Modern navigation component with enhanced styling and interactions
 * Supports multiple layout variants and responsive behavior
 */
const Navbar = ({ onMobileMenuOpen, viewportWidth = 0, scrollProgress = 0 }: NavbarProps) => {
  // Path and page detection
  const pathname = usePathname();
  const isHome1 = useIsTrue("/");
  const isHome1Dark = useIsTrue("/home-1-dark");
  const isHome2 = useIsTrue("/home-2");
  const isHome2Dark = useIsTrue("/home-2-dark");
  const isHome4 = useIsTrue("/home-4");
  const isHome4Dark = useIsTrue("/home-4-dark");
  const isHome5 = useIsTrue("/home-5");
  const isHome5Dark = useIsTrue("/home-5-dark");
  
  // UI state
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [hideNavbar, setHideNavbar] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  
  // Refs
  const lastScrollY = useRef<number>(0);
  const navbarRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Router for navigation
  const router = useRouter();

  // Mobile detection using both resize observer and props
  useEffect(() => {
    setIsMobile(viewportWidth > 0 ? viewportWidth < 1024 : window.innerWidth < 1024);
  }, [viewportWidth]);

  // Check login status and get user info
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!token && !!userId);

    if (token && userId) {
      try {
        const storedFullName = localStorage.getItem("fullName");
        const storedUserName = localStorage.getItem("userName");
        const name = storedFullName || storedUserName || "";
        
        if (name) {
          // Get first name for display
          const firstName = name.trim().split(' ')[0];
          setUserName(firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase());
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    }
  }, []);

  // Scroll handler with debouncing for better performance
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    // Update scrolled state (controls visual appearance)
    setIsScrolled(currentScrollY > 30);
    
    // Auto-hide logic with threshold checks to prevent jitter
    if (currentScrollY > 100) { 
      if (currentScrollY > lastScrollY.current + 10) {
        setHideNavbar(false); // We've disabled the hide behavior per requirement
      } else if (lastScrollY.current > currentScrollY + 10) {
        setHideNavbar(false); // Always show navbar
      }
    } else {
      setHideNavbar(false); // Always show when near top
    }
    
    lastScrollY.current = currentScrollY;
  }, []);

  // Use scrollProgress prop from parent Header component if available
  useEffect(() => {
    // Only update scrolled state if scrollProgress is coming from props
    if (scrollProgress > 0) {
      setIsScrolled(scrollProgress > 3);
    }
  }, [scrollProgress]);

  // Register scroll event listener (only if scrollProgress not provided)
  useEffect(() => {
    if (scrollProgress === 0) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }
    
    // Entrance animation with slightly delayed appearance for a smoother entrance
    const timer = setTimeout(() => setIsVisible(true), 120);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [handleScroll, scrollProgress]);

  // Toggle search functionality
  const toggleSearch = useCallback(() => {
    setIsSearchActive(!isSearchActive);
  }, [isSearchActive]);

  // Handle clicks outside search to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  // Determine container class based on page type
  const containerClass = (() => {
    if (isHome1 || isHome1Dark || isHome4 || isHome4Dark || isHome5 || isHome5Dark) {
      return "w-full max-w-[1920px] lg:px-4 xl:px-6";
    } else if (isHome2 || isHome2Dark) {
      return "w-full max-w-[1920px] lg:px-4 xl:px-6";
    } else {
      return "w-full max-w-[1920px] lg:px-4 xl:px-6";
    }
  })();

  // Determine navbar appearance based on state (enhanced with modern glass morphism)
  const navbarAppearanceClass = (() => {
    let baseClasses = "fixed w-full transition-all duration-300 ease-in-out z-50";
    
    if (isSearchActive) {
      baseClasses += " bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg dark:shadow-gray-900/30 border-b border-gray-200/30 dark:border-gray-800/30";
    } else if (isScrolled) {
      baseClasses += " bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg dark:shadow-gray-900/30 border-b border-gray-200/20 dark:border-gray-800/20";
    } else {
      baseClasses += " bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/10 dark:border-gray-800/10";
    }
    
    // Visibility based on animation (we keep it visible at all times per requirement)
    if (!isVisible) {
      baseClasses += " -translate-y-5 opacity-0";
    } else {
      baseClasses += " translate-y-0 opacity-100";
    }
    
    return baseClasses;
  })();

  // Height class based on scroll state and screen size (slightly taller for better visibility)
  const navbarHeightClass = (() => {
    if (isScrolled) {
      return 'h-16 lg:h-18';
    }
    return 'h-18 lg:h-20';
  })();

  // Check if the current page is the search page
  const isSearchPage = pathname?.startsWith('/search');

  return (
    <>
      <style jsx global>{`
        @keyframes searchAppear {
          0% {
            opacity: 0;
            transform: translateX(10px) scale(0.95);
          }
          40% {
            opacity: 0.7;
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.2);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(79, 70, 229, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(79, 70, 229, 0);
          }
        }
        
        @keyframes highlightFade {
          0% {
            background-color: rgba(79, 70, 229, 0.1);
          }
          100% {
            background-color: rgba(79, 70, 229, 0);
          }
        }
        
        .nav-search-active {
          animation: searchAppear 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .pulse-focus:focus {
          animation: pulse 2s infinite;
        }
        
        .highlight-fade {
          animation: highlightFade 1.5s ease-out forwards;
        }
      `}</style>
      <div 
        ref={navbarRef}
        className={navbarAppearanceClass}
        style={{
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
        }}
      >
        <nav className="relative w-full flex justify-center">
          <div className={`${containerClass} mx-auto px-3 sm:px-4 lg:px-5`}>
            {/* Top Navigation for specific pages */}
            {(isHome4 || isHome4Dark || isHome5 || isHome5Dark) && <NavbarTop />}

            {/* Main Navigation with enhanced spacing and hover effects */}
            <div className={`flex items-center justify-between transition-all duration-300 ${navbarHeightClass}`}>
              {/* Logo section with improved styling - optimized for mobile */}
              <div className="flex-shrink-0 mr-1 sm:mr-2 lg:mr-8 transition-transform duration-300 hover:scale-105">
                <NavbarLogo isScrolled={isScrolled} />
              </div>

              {/* Center section with navigation - now centered */}
              <div 
                className={`hidden lg:flex flex-grow justify-center transition-all duration-500 ease-out ${
                  isSearchActive 
                    ? 'transform -translate-x-14 opacity-90' 
                    : 'transform translate-x-0 opacity-100'
                }`}
                style={{
                  transitionTimingFunction: isSearchActive 
                    ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' 
                    : 'cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <NavItems />
              </div>

              {/* Right section with search icon, store icon and profile */}
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-5">
                {/* Search icon with inline search bar */}
                <div 
                  ref={searchRef}
                  className="relative hidden lg:flex items-center"
                >
                  {!isSearchActive ? (
                    <button 
                      className="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105 active:scale-95"
                      aria-label="Search"
                      onClick={toggleSearch}
                      suppressHydrationWarning
                    >
                      <Search size={22} />
                    </button>
                  ) : (
                    <div 
                      className="flex-1 w-[280px] transition-all duration-400 ease-out opacity-100 scale-100 transform nav-search-active"
                    >
                      <div className="flex items-center">
                        <div className="flex-1">
                          <NavbarSearch 
                            isScrolled={isScrolled}
                            setIsSearchActive={setIsSearchActive}
                          />
                        </div>
                        <button
                          onClick={() => setIsSearchActive(false)}
                          className="ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-all duration-300 hover:rotate-90 hover:text-primary-500"
                          aria-label="Close search"
                          suppressHydrationWarning
                          style={{
                            transitionDelay: '0.05s'
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* EduStore Icon - positioned near search */}
                <div className="hidden lg:flex relative">
                  <div className="relative group">
                    <button
                      className="p-2.5 rounded-full text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                      aria-label="EduStore - Coming Soon"
                      title="EduStore - Coming Soon"
                      suppressHydrationWarning
                    >
                      <ShoppingCart size={22} className="transform group-hover:rotate-12 transition-transform duration-300" />
                    </button>
                    
                    {/* Coming Soon Tooltip */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-500 dark:to-primary-600 text-white text-sm font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50">
                      <span className="relative z-10">🚀 Coming Soon!</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-primary-600 dark:border-b-primary-500"></div>
                      
                      {/* Animated background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                    </div>
                  </div>
                </div>


                
                {/* DashboardProfileComponent instead of NavbarRight */}
                <div 
                  className={`flex-shrink-0 transition-all duration-500 ${
                    isSearchActive ? 'transform translate-x-2' : ''
                  }`}
                  style={{
                    transitionDelay: isSearchActive ? '0.1s' : '0s',
                    transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  <DashboardProfileComponent isScrolled={isScrolled} />
                </div>
                
                {/* Mobile menu button - ensure it's always visible with better mobile styling */}
                {typeof onMobileMenuOpen === 'function' && (
                  <button
                    type="button"
                    suppressHydrationWarning
                    className="lg:hidden inline-flex items-center justify-center p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-gray-700 hover:text-gray-900 bg-gray-100/70 hover:bg-gray-100/90 dark:bg-gray-800/70 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700/90 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 transform hover:scale-105 active:scale-95 backdrop-blur-sm shadow-sm flex-shrink-0 min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] -ml-1 sm:ml-1"
                    onClick={onMobileMenuOpen}
                    aria-expanded="false"
                    aria-label="Open main menu"
                  >
                    <span className="sr-only">Open main menu</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true">
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
