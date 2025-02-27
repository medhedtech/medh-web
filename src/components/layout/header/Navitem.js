"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

export default function Navitem({ navItem, idx, children }) {
  const { name, path, dropdown, isRelative } = navItem;
  const [isOpen, setIsOpen] = useState(false);
  const navItemRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Handle outside clicks to close dropdown
  useEffect(() => {
    if (!dropdown) return;
    
    const handleClickOutside = (event) => {
      if (navItemRef.current && !navItemRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdown]);
  
  // Toggle dropdown visibility on nav item click
  const handleNavItemClick = (e) => {
    if (dropdown && !path) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };
  
  // Close dropdown when window is resized
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);
  
  // Get the child element (dropdown) and inject the isOpen state into it
  const renderChildren = () => {
    if (!children) return null;
    
    // Clone the child element and pass isOpen prop
    return React.cloneElement(children, { 
      isMenuOpen: isOpen,
      onMenuToggle: setIsOpen,
      isMobile
    });
  };
  
  return (
    <li 
      ref={navItemRef}
      key={idx} 
      className={`relative nav-item ${isRelative ? "relative" : ""}`}
    >
      <div className="flex flex-col items-center">
        <Link
          href={path || "#"}
          onClick={handleNavItemClick}
          className="px-5 lg:px-3 xl:px-4 py-10 lg:py-5 2xl:py-6 leading-sm 2xl:leading-lg text-base lg:text-sm 2xl:text-base font-semibold flex items-center hover:text-primary-500 dark:text-gray-200 dark:hover:text-primary-400 transition-colors"
          aria-expanded={dropdown ? isOpen : undefined}
          aria-haspopup={dropdown ? "true" : undefined}
        >
          <span>{name}</span>
          {dropdown && (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={`ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          )}
        </Link>
        
        {/* Pass the isOpen state to the dropdown */}
        {renderChildren()}
      </div>
    </li>
  );
}
