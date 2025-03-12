"use client";

import { Inter, Montserrat, Nunito_Sans } from "next/font/google";
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
import { useEffect } from "react";
import ThemeController from "@/components/shared/others/ThemeController";
import CookieConsent from "@/components/shared/gdpr/CookieConsent";
import Providers from "./Providers";

// Font configuration
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

// Modern heading font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-montserrat",
});

// Secondary modern font
const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-nunito",
  adjustFontFallback: true,
  fallback: ['system-ui', 'arial'],
  preload: true,
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

    // Set initial theme to light if no preference is set
    if (!localStorage.getItem('medh-theme')) {
      document.documentElement.classList.add('light');
    }

    // Listen for changes in reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionPreference = (e) => {
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
      className={`${hind.variable} ${inter.variable} ${montserrat.variable} ${nunito.variable} h-full`}
    >
      <body className="relative bg-bodyBg dark:bg-bodyBg-dark text-gray-700 dark:text-gray-200 min-h-screen font-sans antialiased">
        <Providers>
          {/* Preloader */}
          <PreloaderPrimary />
          
          {/* Main Content */}
          <div className="relative flex flex-col min-h-screen z-10">
            {children}
          </div>

          {/* Background Elements */}
          <div className="fixed inset-0 -z-10 pointer-events-none">
            <FixedShadow />
            <FixedShadow align={"right"} />
          </div>
          
          {/* Cookie Consent Banner */}
          <CookieConsent />
          
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
            className="z-[100]"
          />
        </Providers>
        <ThemeController />
      </body>
    </html>
  );
} 