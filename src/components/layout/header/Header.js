"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Navbar from "./Navbar";
import MobileMenu from "./MobileMenu";
import useIsTrue from "@/hooks/useIsTrue";
import Aos from "aos";
import stickyHeader from "@/libs/stickyHeader";
import smoothScroll from "@/libs/smoothScroll";
import { usePathname } from "next/navigation";

const Header = () => {
  // State management
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const previousWidth = useRef(0);
  
  // Path detection
  const pathname = usePathname();
  const isHome2 = useIsTrue("/home-2");
  const isHome2Dark = useIsTrue("/home-2-dark");

  // Handle resize with debounce for performance
  const handleResize = useCallback(() => {
    // Only update state if width actually changed by at least 10px
    // This prevents excessive rerenders on mobile when address bar shows/hides
    if (Math.abs(window.innerWidth - previousWidth.current) > 10) {
      setViewportWidth(window.innerWidth);
      previousWidth.current = window.innerWidth;
      
      // Close mobile menu when switching to desktop
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    }
  }, []);
  
  // Track scroll progress for potential UI enhancements
  const handleScroll = useCallback(() => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    // Only update state if the change is significant (more than 0.5%)
    // This prevents excessive re-renders on small scroll movements
    setScrollProgress(prevProgress => {
      const difference = Math.abs(scrolled - prevProgress);
      return difference > 0.5 ? scrolled : prevProgress;
    });
  }, []);

  // Throttled scroll handler to limit updates
  const throttledHandleScroll = useCallback(() => {
    // Use requestAnimationFrame for smooth, throttled updates
    if (!window.scrollThrottleFrame) {
      window.scrollThrottleFrame = requestAnimationFrame(() => {
        handleScroll();
        window.scrollThrottleFrame = null;
      });
    }
  }, [handleScroll]);

  useEffect(() => {
    // Initialize viewport width
    if (typeof window !== 'undefined') {
      setViewportWidth(window.innerWidth);
      previousWidth.current = window.innerWidth;
    }
    
    // Set up AOS animation library
    Aos.init({
      offset: 50,
      duration: 800,
      once: true,
      easing: "ease-in-out",
      // Disable animations on mobile for performance
      disable: window.innerWidth < 768
    });
    
    // Initialize header scripts
    stickyHeader();
    smoothScroll();
    
    // Add event listeners
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', throttledHandleScroll);
      
      // Clean up any pending animation frame
      if (window.scrollThrottleFrame) {
        cancelAnimationFrame(window.scrollThrottleFrame);
        window.scrollThrottleFrame = null;
      }
    };
  }, [handleResize, throttledHandleScroll]);
  
  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile menu - render here at root level to ensure proper z-index */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <header className="relative z-40">
        {/* Skip to content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to content
        </a>
        
        {/* Progress bar for long pages (visible on scroll) */}
        <div 
          className="fixed top-0 left-0 h-1 bg-primary-500 z-[51] transition-all duration-100"
          style={{ width: `${scrollProgress}%`, opacity: scrollProgress > 5 ? 1 : 0 }}
          aria-hidden="true"
        />
        
        <div className="relative">
          {/* Main navbar */}
          <Navbar 
            onMobileMenuOpen={() => setIsMobileMenuOpen(true)} 
            viewportWidth={viewportWidth}
            scrollProgress={scrollProgress}
          />
        </div>
      </header>
    </>
  );
};

export default Header;
