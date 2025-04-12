"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Navbar from "./Navbar";
import MobileMenu from "./MobileMenu";
import useIsTrue from "@/hooks/useIsTrue";
import Aos from "aos";
import stickyHeader from "@/libs/stickyHeader";
import smoothScroll from "@/libs/smoothScroll";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";

type HeaderProps = {
  className?: string;
};

type UtilityFunction = (...args: any[]) => void;

const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  // State management with TypeScript
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const previousWidth = useRef(0);
  const lastScrollY = useRef(0);
  
  // Path detection
  const pathname = usePathname();
  const isHome2 = useIsTrue("/home-2");
  const isHome2Dark = useIsTrue("/home-2-dark");

  // Debounced resize handler
  const handleResize = useCallback(() => {
    const currentWidth = window.innerWidth;
    if (Math.abs(currentWidth - previousWidth.current) > 10) {
      setViewportWidth(currentWidth);
      previousWidth.current = currentWidth;
      
      if (currentWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    }
  }, []);
  
  // Enhanced scroll handler with direction detection
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    // Update scroll direction
    setIsScrollingUp(currentScrollY < lastScrollY.current);
    lastScrollY.current = currentScrollY;
    
    // Update progress
    setScrollProgress(scrolled);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setViewportWidth(window.innerWidth);
      previousWidth.current = window.innerWidth;
      lastScrollY.current = window.scrollY;
      
      // Initialize AOS with enhanced config
      Aos.init({
        offset: 50,
        duration: 800,
        once: true,
        easing: "ease-in-out",
        disable: window.innerWidth < 768,
        mirror: false,
        anchorPlacement: 'top-bottom'
      });
      
      // Initialize custom scripts
      stickyHeader();
      smoothScroll();
      
      // Optimized event listeners
      const debouncedResize = debounce(handleResize, 150);
      const throttledScroll = throttle(handleScroll, 100);
      
      window.addEventListener('resize', debouncedResize, { passive: true });
      window.addEventListener('scroll', throttledScroll, { passive: true });
      
      return () => {
        window.removeEventListener('resize', debouncedResize);
        window.removeEventListener('scroll', throttledScroll);
      };
    }
  }, [handleResize, handleScroll]);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const headerMotionProps: HTMLMotionProps<"header"> = {
    className: `relative z-40 ${className}`,
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };

  const progressBarMotionProps: HTMLMotionProps<"div"> = {
    className: "fixed top-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600 z-[51]",
    initial: { width: 0 },
    animate: { 
      width: `${scrollProgress}%`,
      opacity: scrollProgress > 5 ? 1 : 0
    },
    transition: { duration: 0.2 }
  };

  const contentMotionProps: HTMLMotionProps<"div"> = {
    className: "relative",
    animate: { 
      y: 0,
      opacity: 1
    },
    transition: { duration: 0.3 }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <MobileMenu 
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
      
      <motion.header {...headerMotionProps}>
        {/* Skip to content link */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Skip to content
        </a>
        
        {/* Animated progress bar */}
        <motion.div 
          {...progressBarMotionProps}
          aria-hidden="true"
        />
        
        {/* Header content */}
        <motion.div {...contentMotionProps}>
          <Navbar 
            onMobileMenuOpen={() => setIsMobileMenuOpen(true)} 
            viewportWidth={viewportWidth}
            scrollProgress={scrollProgress}
          />
        </motion.div>
      </motion.header>
    </>
  );
};

// Utility functions
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