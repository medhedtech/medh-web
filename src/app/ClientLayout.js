"use client";

import { Inter } from "next/font/google";
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
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";

// Font configuration
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
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

export default function ClientLayout({ children }) {
  useEffect(() => {
    // Function to initialize smooth scrolling behavior
    const initSmoothScroll = () => {
      // Check if the user prefers reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Apply smooth scrolling to html element
      document.documentElement.style.scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
      
      // Add CSS class for smooth scrolling
      document.documentElement.classList.add('scroll-smooth');
    };

    initSmoothScroll();

    // Listen for changes in reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionPreference = (e) => {
      document.documentElement.style.scrollBehavior = e.matches ? 'auto' : 'smooth';
    };

    mediaQuery.addEventListener('change', handleMotionPreference);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionPreference);
    };
  }, []);

  return (
    <html lang="en" className={`${hind.variable} ${inter.variable} h-full scroll-smooth`}>
      <body className="relative bg-bodyBg dark:bg-bodyBg-dark text-gray-700 dark:text-gray-200 min-h-screen font-sans flex flex-col antialiased scroll-smooth">
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {/* Preloader */}
            <PreloaderPrimary />
            
            {/* Main Content */}
            <div className="flex-grow flex flex-col relative z-10 scroll-smooth">
              {children}
            </div>

            {/* Background Elements */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
              <FixedShadow />
              <FixedShadow align={"right"} />
            </div>
            
            {/* Toast Notifications */}
            <ToastContainer 
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </ThemeProvider>
      </body>
    </html>
  );
} 