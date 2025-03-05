import Image from "next/image";
import React, { useState, useEffect } from "react";
import logo1 from "@/assets/images/logo/medh_logo-1.png";
import Link from "next/link";
import logo0 from "@/assets/images/logo/medh_logo-2.png";
import { useTheme } from "next-themes";

/**
 * NavbarLogo Component
 * Renders the logo in the navbar with responsive sizing based on scroll state
 * Displays different logos for light and dark themes with smooth transitions
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isScrolled - Whether the navbar is scrolled
 */
const NavbarLogo = ({ isScrolled }) => {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // Mount effect for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Define logo size classes based on scroll state
  const logoSizeClass = isScrolled 
    ? 'w-[120px] h-[40px] sm:w-[140px] sm:h-[45px]' 
    : 'w-[140px] h-[45px] sm:w-[160px] sm:h-[55px]';

  // Handle logo hover state for interactive feedback
  const handleLogoHover = () => setIsHovered(true);
  const handleLogoLeave = () => setIsHovered(false);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={`relative ${logoSizeClass} opacity-0`} />
    );
  }

  return (
    <div className="relative">
      <div className={`flex items-center transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
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
              ${logoSizeClass}
              ${isHovered ? 'scale-105' : 'scale-100'}
            `}
          >
            {/* Dark mode logo */}
            <Image
              priority
              src={logo1}
              alt="Medh Logo Dark"
              fill
              sizes="(max-width: 768px) 140px, 160px"
              className={`
                object-contain transition-opacity duration-300
                ${resolvedTheme === 'dark' ? 'opacity-100 visible' : 'opacity-0 invisible'}
              `}
              onLoad={() => setLogoLoaded(true)}
            />
            
            {/* Light mode logo */}
            <Image
              priority
              src={logo0}
              alt="Medh Logo Light"
              fill
              sizes="(max-width: 768px) 140px, 160px"
              className={`
                object-contain transition-opacity duration-300 absolute top-0 left-0
                ${resolvedTheme === 'light' ? 'opacity-100 visible' : 'opacity-0 invisible'}
              `}
              onLoad={() => setLogoLoaded(true)}
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NavbarLogo;
