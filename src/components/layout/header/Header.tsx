"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Navbar from "./Navbar";
import MobileMenu from "./MobileMenu";
import useIsTrue from "@/hooks/useIsTrue";
import Aos from "aos";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type HeaderProps = {
  className?: string;
};

type UtilityFunction = (...args: any[]) => void;

/**
 * Modern, fixed header component with enhanced visual styling
 * Features progressive scroll indicator and smooth animations
 */
const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  // State management with TypeScript
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Refs for tracking previous values
  const previousWidth = useRef(0);
  const lastScrollY = useRef(0);
  
  // Path detection
  const pathname = usePathname();
  const isHome2 = useIsTrue("/home-2");
  const isHome2Dark = useIsTrue("/home-2-dark");

  // Client-side mounting effect
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Debounced resize handler with improved performance
  const handleResize = useCallback(() => {
    if (!isClient || typeof window === 'undefined') return;
    
    const currentWidth = window.innerWidth;
    if (Math.abs(currentWidth - previousWidth.current) > 10) {
      setViewportWidth(currentWidth);
      previousWidth.current = currentWidth;
      
      if (currentWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    }
  }, [isClient]);
  
  // Enhanced scroll handler with smooth progress tracking
  const handleScroll = useCallback(() => {
    if (!isClient || typeof window === 'undefined') return;
    
    const currentScrollY = window.scrollY;
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Calculate scroll percentage with smoothing for better visual effect
    const scrolled = Math.min((winScroll / height) * 100, 100);
    setScrollProgress(Math.round(scrolled * 100) / 100); // Round to 2 decimal places for smoother animation
    
    // Update scrolled state for styling
    setHasScrolled(currentScrollY > 10);
    
    // Update reference
    lastScrollY.current = currentScrollY;
  }, [isClient]);

  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;
    
    setViewportWidth(window.innerWidth);
    previousWidth.current = window.innerWidth;
    lastScrollY.current = window.scrollY;
    
    // Apply initial scroll state
    handleScroll();
    
    // Initialize AOS with enhanced config
    Aos.init({
      offset: 80,
      duration: 800,
      once: true,
      easing: "ease-in-out",
      disable: window.innerWidth < 768,
      mirror: false,
      anchorPlacement: 'top-bottom'
    });
    
    // Optimized event listeners with improved throttling
    const debouncedResize = debounce(handleResize, 150);
    const throttledScroll = throttle(handleScroll, 80); // More frequent updates for smoother progress bar
    
    window.addEventListener('resize', debouncedResize, { passive: true });
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [isClient, handleResize, handleScroll]);
  
  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (!isClient) return;
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, isClient]);

  // Header animation variants with spring physics for natural motion
  const headerVariants = {
    visible: { 
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.4
      }
    },
    initial: { 
      y: -20, 
      opacity: 0 
    }
  };

  // Enhanced progress bar animation with smoother transitions
  const progressBarVariants = {
    initial: { width: "0%" },
    animate: { 
      width: `${scrollProgress}%`,
      opacity: scrollProgress > 3 ? 1 : 0,
      transition: { type: "tween", duration: 0.15, ease: "easeOut" }
    }
  };

  // Don't render mobile menu or progress bar until client-side
  if (!isClient) {
    return (
      <motion.header
        className="fixed top-0 left-0 right-0 z-40 w-full"
        initial="initial"
        animate="visible"
        variants={headerVariants}
        aria-label="Site header"
      >
        {/* Skip to content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Skip to content
        </a>
        
        {/* Navbar component */}
        <Navbar 
          onMobileMenuOpen={() => setIsMobileMenuOpen(true)} 
          viewportWidth={0}
          scrollProgress={0}
        />
      </motion.header>
    );
  }
  
  return (
    <>
      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <MobileMenu 
            key="mobile-menu"
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
      
      <motion.header
        className="fixed top-0 left-0 right-0 z-40 w-full"
        initial="initial"
        animate="visible"
        variants={headerVariants}
        aria-label="Site header"
      >
        {/* Skip to content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Skip to content
        </a>
        
        {/* Enhanced progress bar with gradient and animation */}
        <motion.div 
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-400 z-[51]"
          initial="initial"
          animate="animate"
          variants={progressBarVariants}
          style={{
            boxShadow: scrollProgress > 10 ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
          }}
          aria-hidden="true"
        />
        
        {/* Navbar component */}
        <Navbar 
          onMobileMenuOpen={() => setIsMobileMenuOpen(true)} 
          viewportWidth={viewportWidth}
          scrollProgress={scrollProgress}
        />
      </motion.header>
    </>
  );
};

// Utility functions with improved typings
const debounce = (func: UtilityFunction, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func: UtilityFunction, limit: number) => {
  let inThrottle: boolean;
  return function executedFunction(...args: any[]) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export default Header; 