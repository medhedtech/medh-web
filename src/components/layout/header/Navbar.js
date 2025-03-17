"use client";
import { usePathname } from "next/navigation";
import NavItems from "./NavItems";
import NavbarLogo from "./NavbarLogo";
import NavbarRight from "./NavbarRight";
import NavItems2 from "./NavItems2";
import useIsTrue from "@/hooks/useIsTrue";
import NavbarTop from "./NavbarTop";
import { useState, useEffect, useRef, useCallback } from "react";
import NavbarSearch from "@/components/shared/search/NavbarSearch";

/**
 * Main navigation component for the application
 * Handles responsive behavior, scroll effects, and layout
 */
const Navbar = ({ onMobileMenuOpen, viewportWidth = 0, scrollProgress = 0 }) => {
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hideNavbar, setHideNavbar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  // Refs
  const lastScrollY = useRef(0);
  const navbarRef = useRef(null);

  // Mobile detection using both resize observer and props
  useEffect(() => {
    setIsMobile(viewportWidth > 0 ? viewportWidth < 1024 : window.innerWidth < 1024);
  }, [viewportWidth]);

  // Scroll handler with debouncing for better performance
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    // Update scrolled state (controls visual appearance)
    setIsScrolled(currentScrollY > 30);
    
    // Auto-hide logic with threshold checks to prevent jitter
    if (currentScrollY > 100) { 
      if (currentScrollY > lastScrollY.current + 10) {
        setHideNavbar(true); // Scrolling down - hide navbar
      } else if (lastScrollY.current > currentScrollY + 10) {
        setHideNavbar(false); // Scrolling up - show navbar
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
    
    // Entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [handleScroll, scrollProgress]);

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

  // Determine navbar appearance based on state
  const navbarAppearanceClass = (() => {
    let baseClasses = "fixed w-full transition-all duration-300 ease-in-out z-50";
    
    if (isSearchActive) {
      baseClasses += " bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg dark:shadow-gray-900/30";
    } else if (isScrolled) {
      baseClasses += " bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg dark:shadow-gray-900/30 border-b border-gray-200/50 dark:border-gray-800/30";
    } else {
      baseClasses += " bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/30";
    }
    
    // Visibility based on animation and scroll state
    if (!isVisible) {
      baseClasses += " -translate-y-5 opacity-0";
    } else if (hideNavbar && !isMobile) {
      baseClasses += " -translate-y-full";
    } else {
      baseClasses += " translate-y-0 opacity-100";
    }
    
    return baseClasses;
  })();

  // Height class based on scroll state and screen size
  const navbarHeightClass = (() => {
    if (isScrolled) {
      return 'h-14 lg:h-16';
    }
    return 'h-16 lg:h-18';
  })();

  // Check if the current page is the search page
  const isSearchPage = pathname?.startsWith('/search');

  return (
    <div 
      ref={navbarRef}
      className={navbarAppearanceClass}
      style={{
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
      }}
    >
      <nav className="relative w-full flex justify-center">
        <div className={`${containerClass} mx-auto px-3 sm:px-4`}>
          {/* Top Navigation for specific pages */}
          {(isHome4 || isHome4Dark || isHome5 || isHome5Dark) && <NavbarTop />}

          {/* Main Navigation */}
          <div className={`flex items-center justify-between transition-all duration-300 ${navbarHeightClass}`}>
            {/* Conditional logo rendering with improved spacing */}
            {!isSearchActive && (
              <div className="flex-shrink-0 mr-3 lg:mr-6">
                <NavbarLogo isScrolled={isScrolled} />
              </div>
            )}

            {/* Center section with improved layout */}
            <div className="hidden lg:flex flex-1 items-center justify-center max-w-6xl mx-auto">
              {!isSearchActive ? (
                <div className="flex-1 px-3 lg:px-4 flex items-center justify-between">
                  <div className="transition-all duration-300 transform flex-grow max-w-2xl xl:max-w-3xl">
                    {isHome2Dark ? <NavItems2 /> : <NavItems />}
                  </div>
                  <div className="ml-4 xl:ml-6 flex-shrink-0">
                    <NavbarSearch 
                      isScrolled={isScrolled} 
                      setIsSearchActive={setIsSearchActive}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-2xl xl:max-w-3xl px-3 lg:px-4">
                  <NavbarSearch 
                    isScrolled={isScrolled} 
                    setIsSearchActive={setIsSearchActive}
                  />
                </div>
              )}
            </div>

            {/* Right section with improved spacing */}
            {!isSearchActive && (
              <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                <div className="flex-shrink-0">
                  <NavbarRight isScrolled={isScrolled} />
                </div>
                {/* Mobile menu button with improved styling */}
                {typeof onMobileMenuOpen === 'function' && (
                  <button
                    type="button"
                    suppressHydrationWarning
                    className="lg:hidden inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100/90 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/90 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 transform hover:scale-105 active:scale-95"
                    onClick={onMobileMenuOpen}
                    aria-expanded="false"
                    aria-label="Open main menu"
                  >
                    <span className="sr-only">Open main menu</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true">
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
