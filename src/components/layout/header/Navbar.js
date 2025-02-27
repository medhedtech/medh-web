"use client";
import { usePathname } from "next/navigation";
import NavItems from "./NavItems";
import NavbarLogo from "./NavbarLogo";
import NavbarRight from "./NavbarRight";
import NavItems2 from "./NavItems2";
import useIsTrue from "@/hooks/useIsTrue";
import NavbarTop from "./NavbarTop";
import { useState, useEffect, useRef, useCallback } from "react";
import MobileMenu from "./MobileMenu";

/**
 * Main navigation component for the application
 * Handles responsive behavior, scroll effects, and layout
 */
const Navbar = () => {
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
  
  // Refs
  const lastScrollY = useRef(0);
  const navbarRef = useRef(null);

  // Mobile detection using resize observer
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Check initially and on resize
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

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

  // Register scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [handleScroll]);

  // Determine container class based on page type
  const containerClass = (() => {
    if (isHome1 || isHome1Dark || isHome4 || isHome4Dark || isHome5 || isHome5Dark) {
      return "lg:container 3xl:container2-lg";
    } else if (isHome2 || isHome2Dark) {
      return "container sm:container-fluid lg:container 3xl:container-secondary";
    } else {
      return "lg:container 3xl:container-secondary-lg";
    }
  })();

  // Determine navbar appearance based on state
  const navbarAppearanceClass = (() => {
    let baseClasses = "fixed w-full transition-all duration-300 ease-in-out z-40";
    
    // Background & border based on scroll state
    if (isScrolled) {
      baseClasses += " bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg dark:shadow-gray-900/30 border-b border-gray-200/50 dark:border-gray-800/30";
    } else {
      baseClasses += " bg-white dark:bg-gray-900 border-b border-gray-200/50 dark:border-gray-800/30";
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

  // Height class based on scroll state
  const navbarHeightClass = isScrolled ? 'h-16 md:h-14' : 'h-18';

  return (
    <div 
      ref={navbarRef}
      className={navbarAppearanceClass}
      style={{
        transition: 'transform 0.3s ease, opacity 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
      }}
    >
      <nav className="relative">
        <div className={`${containerClass} mx-auto px-4 sm:px-6 lg:px-8`}>
          {/* Top Navigation for specific pages */}
          {(isHome4 || isHome4Dark || isHome5 || isHome5Dark) && <NavbarTop />}

          {/* Main Navigation */}
          <div className={`flex items-center justify-between transition-all duration-300 ${navbarHeightClass}`}>
            {/* Left section with logo */}
            <div className="flex-shrink-0">
              <NavbarLogo isScrolled={isScrolled} />
            </div>

            {/* Center section with navigation items */}
            <div className="hidden lg:block flex-1 px-8">
              <div className="transition-all duration-300 transform">
                {isHome2Dark ? <NavItems2 /> : <NavItems />}
              </div>
            </div>

            {/* Right section with actions and mobile menu */}
            <div className="flex items-center">
              <NavbarRight isScrolled={isScrolled} />
              <MobileMenu />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
