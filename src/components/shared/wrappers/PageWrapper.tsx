"use client";
import React, { useState, useEffect, useRef, ReactNode } from "react";
import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DemoSessionForm from "@/components/forms/DemoSessionForm";

// Import custom hooks from consolidated file
import {
  useScrollToTop,
  useSmoothAnchorScroll,
  useScrollVisibility,
  useDynamicFooterHeight
} from "@/hooks/useScrolling";
import { useDocumentBodyReset, useFixBodyClasses } from "@/hooks/useDocumentBodyReset";

interface PageWrapperProps {
  children: ReactNode;
  /**
   * Skip to content ID for accessibility
   */
  skipToContentId?: string;
  /**
   * Whether to add top padding for header spacing
   */
  addTopPadding?: boolean;
  /**
   * Whether to add bottom padding
   */
  addBottomPadding?: boolean;
  /**
   * Whether to show the footer
   */
  showFooter?: boolean;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ 
  children,
  skipToContentId = "main-content",
  addTopPadding = true,
  addBottomPadding = true,
  showFooter = true
}) => {
  const [hasPageLoaded, setHasPageLoaded] = useState<boolean>(false);
  const [showDemoForm, setShowDemoForm] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Use custom hooks for better separation of concerns
  const scrollToTop = useScrollToTop();
  const handleSmoothScroll = useSmoothAnchorScroll();
  const showScrollTop = useScrollVisibility(300);
  
  // Fix body styling issues
  useDocumentBodyReset();
  useFixBodyClasses();
  
  // Handle dynamic footer height
  useDynamicFooterHeight(contentRef);



  // Effect for smooth scroll anchor handling
  useEffect(() => {
    // Add event listeners
    document.addEventListener('click', handleSmoothScroll as EventListener);
    
    // Set page as loaded after a small delay for smoother transitions
    const timer = setTimeout(() => {
      setHasPageLoaded(true);
    }, 100);
    
    // Cleanup
    return () => {
      document.removeEventListener('click', handleSmoothScroll as EventListener);
      clearTimeout(timer);
    };
  }, [handleSmoothScroll]);

  // Global demo form event listener
  useEffect(() => {
    const handleOpenDemoForm = () => {
      setShowDemoForm(true);
    };

    const handleCloseDemoForm = () => {
      setShowDemoForm(false);
    };

    // Listen for custom events to open/close demo form
    window.addEventListener('openDemoForm', handleOpenDemoForm);
    window.addEventListener('closeDemoForm', handleCloseDemoForm);

    return () => {
      window.removeEventListener('openDemoForm', handleOpenDemoForm);
      window.removeEventListener('closeDemoForm', handleCloseDemoForm);
    };
  }, []);

  // Keyboard shortcut for scroll to top (Alt+ArrowUp)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'ArrowUp') {
        scrollToTop();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollToTop]);



  return (
    <div className="flex flex-col min-h-screen w-full bg-white dark:bg-gray-950 overflow-x-hidden">
      {/* Google One Tap FedCM Support - Minimal CSS for browser compatibility */}
      <style jsx global>{`
        /* Google One Tap FedCM - Browser-specific overrides that can't be done with Tailwind */
        .credential-picker-container,
        [data-testid="credential-picker-container"],
        iframe[src*="accounts.google.com"] {
          z-index: 2147483647 !important;
          position: fixed !important;
        }
        
        dialog[open]:has([data-testid*="fedcm"]),
        dialog[open]:has([class*="fedcm"]),
        iframe[src*="accounts.google.com/gsi/"],
        iframe[src*="accounts.google.com"][src*="client_id"] {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          position: fixed !important;
          z-index: 2147483647 !important;
          top: 0 !important;
          right: 0 !important;
        }
      `}</style>

      {/* Skip to content link for accessibility */}
      <a 
        href={`#${skipToContentId}`}
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-blue-500 focus:text-white focus:top-0 focus:left-0 focus:rounded-md focus:shadow-lg"
      >
        Skip to content
      </a>
      
      {/* Header - Fixed height with Tailwind */}
      <Header className="h-16 md:h-20 fixed top-0 left-0 right-0 z-40" />



      {/* Main content with Tailwind classes */}
      <main 
        ref={contentRef}
        id={skipToContentId}
        role="main"
        tabIndex={-1}
        className={`flex-grow w-full transition-opacity duration-700 will-change-opacity overflow-visible ${
          addTopPadding ? 'pt-16 md:pt-20' : ''
        } ${
          addBottomPadding ? 'pb-8' : ''
        } ${hasPageLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="animate-fade-in overflow-visible">
          {children}
        </div>
      </main>
      
      {/* Footer with theme prop */}
      {showFooter && <Footer />}

      {/* Modal Portal Root: ensures modals render above header and all content but below Google One Tap */}
      <div id="modal-root"></div>

      {/* Global Demo Session Form */}
      {showDemoForm && (
        <DemoSessionForm onClose={() => setShowDemoForm(false)} />
      )}
    </div>
  );
};

export default PageWrapper; 