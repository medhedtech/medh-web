"use client";
import React, { useState, useEffect, useRef, ReactNode, useCallback } from "react";
import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PageWrapperProps {
  children: ReactNode;
  /**
   * Skip to content ID for accessibility
   */
  skipToContentId?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ 
  children,
  skipToContentId = "main-content" 
}) => {
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  // Handle scroll events - memoized for performance
  const handleScroll = useCallback((): void => {
    // Calculate scroll position percentage
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = window.scrollY;
    const percentage = Math.min((scrolled / windowHeight) * 100, 100);
    
    setScrollPercentage(percentage);
    setShowScrollTop(scrolled > 300);
  }, []);
  
  // Scroll to top function - memoized for performance
  const scrollToTop = useCallback((): void => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    });
  }, []);
  
  // Smooth scroll handler - memoized for performance
  const handleSmoothScroll = useCallback((e: MouseEvent): void => {
    const target = (e.target as Element).closest('a[href^="#"]');
    if (!target) return;

    const id = target.getAttribute('href');
    if (!id || id === '#') return;

    const element = document.querySelector(id);
    if (!element) return;

    e.preventDefault();
    const yOffset = -80; // Offset for fixed header
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    });
  }, []);

  useEffect(() => {
    // Add event listeners
    document.addEventListener('click', handleSmoothScroll as EventListener);
    
    // Optimized scroll listener with requestAnimationFrame for better performance
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Set initial scroll position
    handleScroll();
    
    // Set page as loaded after a small delay for smoother transitions
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    
    // Cleanup
    return () => {
      document.removeEventListener('click', handleSmoothScroll as EventListener);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
    };
  }, [handleScroll, handleSmoothScroll]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 relative">
      {/* Skip to content link for accessibility */}
      <a 
        href={`#${skipToContentId}`}
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary-500 focus:text-white focus:top-0 focus:left-0"
      >
        Skip to content
      </a>
      
      {/* Header */}
      <Header />

      {/* Vertical scroll progress indicator */}
      <div 
        className="fixed right-4 top-1/2 transform -translate-y-1/2 h-[30vh] w-1 bg-gray-200 dark:bg-gray-800 rounded-full z-40 hidden md:block"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(scrollPercentage)}
        aria-label="Page scroll progress"
      >
        <motion.div 
          className="w-full bg-gradient-to-b from-primary-500 to-primary-600 rounded-full"
          style={{ 
            height: `${scrollPercentage}%`,
            transition: 'height 0.2s ease'
          }}
          aria-hidden="true"
        />
      </div>

      {/* Enhanced scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="fixed bottom-6 right-6 p-3 rounded-full bg-primary-500 hover:bg-primary-600 text-white shadow-lg z-40 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 transition-all duration-300 transform hover:scale-110 dark:focus:ring-primary-600 dark:focus:ring-offset-gray-900"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            title="Scroll to top"
          >
            <ChevronUp size={24} aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main content with padding for fixed header */}
      <main 
        ref={mainContentRef}
        id={skipToContentId}
        tabIndex={-1}
        className={`flex-grow transition-opacity duration-700 pt-16 md:pt-20 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="animate-fadeIn">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PageWrapper; 