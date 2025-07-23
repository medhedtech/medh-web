import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";
import logo1 from "@/assets/images/logo/medh_logo-1.png";
import Link from "next/link";
import logo0 from "@/assets/images/logo/medh_logo-2.png";
import { useTheme } from "next-themes";

/**
 * Props for the NavbarLogo component
 */
interface NavbarLogoProps {
  isScrolled: boolean;
}

/**
 * NavbarLogo Component
 * Renders the logo in the navbar with responsive sizing based on scroll state
 * In dark mode, displays logo1; in light mode, displays logo0
 * Maintains aspect ratio across all screen sizes
 */
const NavbarLogo: React.FC<NavbarLogoProps> = ({ isScrolled }) => {
  const [logoLoaded, setLogoLoaded] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const { setTheme } = useTheme();

  // Get original logo dimensions to calculate proper ratio
  const logoRatio = useMemo(() => 3.1, []);  // Width/height ratio for the logo (adjust based on your logo)

  // Mount effect for hydration
  useEffect(() => {
    setMounted(true);
    
    // Check dark mode on initial load
    if (typeof window !== 'undefined') {
      // First check localStorage
      const storedTheme = localStorage.getItem('medh-theme');
      
      // Then check if document has dark class
      const hasDarkClass = document.documentElement.classList.contains('dark');
      
      // Set dark mode if either condition is true
      setIsDarkMode(storedTheme === 'dark' || hasDarkClass);
      
      console.log('Initial theme check:', { 
        storedTheme, 
        hasDarkClass, 
        isDarkMode: storedTheme === 'dark' || hasDarkClass 
      });
    }
  }, []);

  // Theme detection logic
  useEffect(() => {
    if (!mounted) return;

    // Function to check if dark mode is active
    const checkDarkMode = (): void => {
      // Check both localStorage and DOM class
      const storedTheme = localStorage.getItem('medh-theme');
      const hasDarkClass = document.documentElement.classList.contains('dark');
      
      // Update state if needed
      const shouldBeDark = storedTheme === 'dark' || hasDarkClass;
      if (isDarkMode !== shouldBeDark) {
        setIsDarkMode(shouldBeDark);
        console.log('Theme updated:', shouldBeDark ? 'dark' : 'light');
      }
    };
    
    // Check immediately
    checkDarkMode();
    
    // Set up listeners for theme changes
    
    // 1. Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent): void => {
      if (e.key === 'medh-theme') {
        checkDarkMode();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // 2. Set up MutationObserver for class changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    // 3. Listen for theme toggle button clicks
    const themeButtons = document.querySelectorAll('.theme-toggle, [data-theme-toggle]');
    const handleThemeButtonClick = (): void => {
      // Give time for changes to apply
      setTimeout(checkDarkMode, 50);
    };
    
    themeButtons.forEach((button) => {
      button.addEventListener('click', handleThemeButtonClick);
    });
    
    // Clean up all listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      observer.disconnect();
      themeButtons.forEach((button) => {
        button.removeEventListener('click', handleThemeButtonClick);
      });
    };
  }, [mounted, isDarkMode]);

  // Public function to manually toggle dark mode
  const toggleDarkMode = (): void => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setTheme(newMode ? 'dark' : 'light');
    console.log('Manually toggled to:', newMode ? 'dark' : 'light');
  };

  // Memoize logo size classes to prevent unnecessary calculations
  const logoSizeClass = useMemo(() => {
    // Base width for different viewport sizes (maintains aspect ratio)
    const baseWidth = {
      xs: isScrolled ? 100 : 120,    // Extra small (< 640px)
      sm: isScrolled ? 120 : 140,    // Small (≥ 640px)
      md: isScrolled ? 140 : 160,    // Medium (≥ 768px)
      lg: isScrolled ? 160 : 180,    // Large (≥ 1024px)
      xl: isScrolled ? 180 : 200     // Extra large (≥ 1280px)
    };
    
    // Calculate heights based on logo ratio (width/height)
    const heights = {
      xs: Math.round(baseWidth.xs / logoRatio),
      sm: Math.round(baseWidth.sm / logoRatio),
      md: Math.round(baseWidth.md / logoRatio),
      lg: Math.round(baseWidth.lg / logoRatio),
      xl: Math.round(baseWidth.xl / logoRatio)
    };
    
    return `
      w-[${baseWidth.xs}px] h-[${heights.xs}px]
      sm:w-[${baseWidth.sm}px] sm:h-[${heights.sm}px]
      md:w-[${baseWidth.md}px] md:h-[${heights.md}px]
      lg:w-[${baseWidth.lg}px] lg:h-[${heights.lg}px]
      xl:w-[${baseWidth.xl}px] xl:h-[${heights.xl}px]
      transition-all duration-300 ease-in-out
    `;
  }, [isScrolled, logoRatio]);

  // Handle logo hover state for interactive feedback
  const handleLogoHover = (): void => setIsHovered(true);
  const handleLogoLeave = (): void => setIsHovered(false);
  
  // Handle logo load events
  const handleLogoLoad = (): void => setLogoLoaded(true);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={`relative opacity-0 ${logoSizeClass.trim()}`} />
    );
  }

  return (
    <div className="relative">
      <div className={`flex items-center transition-all duration-300 ${isScrolled ? 'py-1 md:py-2' : 'py-2 md:py-3'}`}>
        <Link 
          href="/"
          className={`
            relative block transition-all duration-300
            ${logoLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          aria-label="Go to homepage"
          onMouseEnter={handleLogoHover}
          onMouseLeave={handleLogoLeave}
        >
          <div 
            className={`
              relative transition-all duration-300 transform
              ${logoSizeClass.trim()}
              ${isHovered ? 'scale-105' : 'scale-100'}
              aspect-ratio-auto
            `}
            style={{ aspectRatio: logoRatio }}
          >
            {/* LOGO MANAGEMENT: In dark mode, show logo1; in light mode, show logo0 */}
            
            {/* Dark mode logo (logo1) */}
            <Image
              priority
              src={logo1}
              alt="Medh Logo Dark"
              fill
              sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, (max-width: 1024px) 140px, (max-width: 1280px) 160px, 180px"
              className={`
                object-contain transition-all duration-500 ease-in-out
                ${isDarkMode ? 'opacity-100 visible' : 'opacity-0 invisible'}
              `}
              onLoad={handleLogoLoad}
              onError={handleLogoLoad}
              style={{ 
                objectFit: 'contain'
              }}
            />
            
            {/* Light mode logo (logo0) */}
            <Image
              priority
              src={logo0}
              alt="Medh Logo Light"
              fill
              sizes="(max-width: 640px) 120px, (max-width: 768px) 140px, (max-width: 1024px) 160px, (max-width: 1280px) 180px, 200px"
              quality={100}
              unoptimized={true}
              className={`
                object-contain transition-all duration-500 ease-in-out absolute top-0 left-0 gpu-accelerated
                ${!isDarkMode ? 'opacity-100 visible' : 'opacity-0 invisible'}
              `}
              style={{ 
                objectFit: 'contain',
                imageRendering: '-webkit-optimize-contrast' as any,
                backfaceVisibility: 'hidden',
                WebkitFontSmoothing: 'antialiased',
                transform: 'translate3d(0,0,0)'
              }}
              onLoad={handleLogoLoad}
              onError={handleLogoLoad}
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NavbarLogo; 