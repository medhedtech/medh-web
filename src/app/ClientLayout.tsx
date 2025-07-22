"use client";

import "@/assets/css/icofont.min.css";
import "@/assets/css/popup.css";
import "@/assets/css/video-modal.css";
import "aos/dist/aos.css";
import "./globals.css";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Import centralized font config
import { poppins, montserrat, hind } from "@/lib/fonts";

// Import extracted components
import ScrollProgress from "@/components/shared/ui/ScrollProgress";
import ScrollToTop from "@/components/shared/ui/ScrollToTop";

// Import other components
import FixedShadow from "@/components/shared/others/FixedShadow";
import CookieConsent from "@/components/shared/gdpr/CookieConsent";
import Providers from "./Providers";
import GoogleAnalytics from "@/components/shared/analytics/GoogleAnalytics";

// Custom hooks
import { useAnalyticsPageTracking } from "@/hooks/useAnalyticsPageTracking";
import { useDocumentBodyReset, useFixBodyClasses } from "@/hooks/useDocumentBodyReset";

// Dynamically import components that aren't needed immediately
const PreloaderPrimary = dynamic(
  () => import("@/components/shared/others/PreloaderPrimary"),
  { ssr: false }
);

// Constants
const MAIN_CONTENT_ID = "main-content";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  // Get Google Analytics measurement ID from environment variable
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
  
  // Use custom hook for analytics page tracking (initial + route changes)
  useAnalyticsPageTracking();
  
  // Use hooks to fix body styling issues
  useDocumentBodyReset();
  useFixBodyClasses();
  
  useEffect(() => {
    // Initialize smooth scrolling behavior
    const initSmoothScroll = () => {
      // Check if the user prefers reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Apply smooth scrolling to html element
      document.documentElement.style.scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
      
      // Fix for body element styling - ensure Google One Tap visibility
      if (typeof window !== 'undefined') {
        // Ensure proper overflow settings but allow Google One Tap to show
        document.documentElement.style.overflowX = 'hidden';
        document.documentElement.style.overflowY = 'visible';
        document.body.style.overflowY = 'visible';
      }
    };

    initSmoothScroll();

    // Listen for changes in reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionPreference = (e: MediaQueryListEvent) => {
      document.documentElement.style.scrollBehavior = e.matches ? 'auto' : 'smooth';
    };

    mediaQuery.addEventListener('change', handleMotionPreference);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionPreference);
    };
  }, []);

  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={`${hind.variable} ${poppins.variable} ${montserrat.variable} h-full`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="relative bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-200 min-h-screen font-sans antialiased overflow-x-hidden overflow-y-visible">
        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />}
        
        <Providers>
          {/* Skip to content link for accessibility */}
          <a 
            href={`#${MAIN_CONTENT_ID}`}
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-blue-500 focus:text-white focus:top-0 focus:left-0 focus:rounded-md"
          >
            Skip to content
          </a>
          
          {/* Scroll Progress Bar */}
          <ScrollProgress />
          
          {/* Preloader */}
          <PreloaderPrimary />
          
          {/* Main Content - No Width Constraints, Overflow Visible for Google One Tap */}
          <div 
            id={MAIN_CONTENT_ID}
            className="relative flex flex-col min-h-screen w-full z-10 pt-6 overflow-visible"
            tabIndex={-1}
          >
            {children}
          </div>

          {/* Background Elements */}
          <div className="fixed inset-0 -z-10 pointer-events-none">
            <FixedShadow align="left" />
            <FixedShadow align="right" />
          </div>
          
          {/* Cookie Consent Banner */}
          <CookieConsent />
          
          {/* Scroll to Top Button */}
          <ScrollToTop />
          
          {/* Toast Notifications - Lower z-index than Google One Tap */}
          <ToastContainer 
            position="top-right"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            className="z-[100]"
            style={{ zIndex: 100 }}
          />
          {/* Vercel Speed Insights */}
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}