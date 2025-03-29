"use client";

import { Montserrat, Poppins } from "next/font/google";
import localFont from "next/font/local";
import "@/assets/css/icofont.min.css";
import "@/assets/css/popup.css";
import "@/assets/css/video-modal.css";
import "aos/dist/aos.css";
import "./globals.css";
import FixedShadow from "@/components/shared/others/FixedShadow";
import PreloaderPrimary from "@/components/shared/others/PreloaderPrimary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
// import ThemeController from "@/components/shared/others/ThemeController";
import CookieConsent from "@/components/shared/gdpr/CookieConsent";
import Providers from "./Providers";
import { ChevronUp } from "lucide-react";

// Font configuration
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

// Modern heading font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-montserrat",
});

// Using local font instead of Google Fonts to avoid build issues
const hind = localFont({
  src: [
    {
      path: '../assets/fonts/Hind-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Hind-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Hind-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Hind-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Hind-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: "swap",
  variable: "--font-hind",
});

interface ClientLayoutProps {
  children: React.ReactNode;
}

// Scroll Progress Component
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setProgress(scrolled);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div 
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Scroll To Top Component
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 p-3 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      } z-50`}
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  useEffect(() => {
    // Initialize smooth scrolling behavior
    const initSmoothScroll = () => {
      // Check if the user prefers reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Apply smooth scrolling to html element
      document.documentElement.style.scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
      
      // Prevent double scrollbars
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'auto';
      document.body.style.height = '100vh';
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
      // Reset overflow styles
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, []);

  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={`${hind.variable} ${poppins.variable} ${montserrat.variable} h-full`}
    >
      <body className="relative bg-bodyBg dark:bg-bodyBg-dark text-gray-700 dark:text-gray-200 min-h-screen font-sans antialiased">
        <Providers>
          {/* Scroll Progress Bar */}
          <ScrollProgress />
          
          {/* Preloader */}
          <PreloaderPrimary />
          
          {/* Main Content - No Width Constraints */}
          <div className="relative flex flex-col min-h-screen w-full z-10">
            {children}
          </div>

          {/* Background Elements */}
          <div className="fixed inset-0 -z-10 pointer-events-none">
            <FixedShadow align="left" />
            <FixedShadow align="right" />
          </div>
          
          {/* Cookie Consent Banner */}
          <CookieConsent />
          
          {/* Theme Controller */}
          {/* <ThemeController /> */}
          
          {/* Scroll to Top Button */}
          <ScrollToTop />
          
          {/* Toast Notifications */}
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
          />
        </Providers>
      </body>
    </html>
  );
}