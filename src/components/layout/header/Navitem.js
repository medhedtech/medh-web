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

  // Check if this is the EduStore item to apply special styles
  const isStore = name === "EduStore";
  
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
          className={`px-3 lg:px-2.5 xl:px-3 2xl:px-4 py-10 lg:py-5 2xl:py-6 leading-none whitespace-nowrap text-base lg:text-sm 2xl:text-base font-semibold flex items-center transition-all duration-300 
            ${isStore 
              ? "text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300" 
              : "hover:text-primary-500 dark:text-gray-200 dark:hover:text-primary-400"} 
            hover:-translate-y-0.5`}
          aria-expanded={dropdown ? isOpen : undefined}
          aria-haspopup={dropdown ? "true" : undefined}
        >
          <span className="whitespace-nowrap relative">
            {name}
          </span>
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
        
        {/* Add a subtle underline indicator for the active nav item */}
        <div className={`h-0.5 w-0 bg-primary-500 rounded-full transition-all duration-300 ${isOpen ? 'w-1/2' : ''} ${isStore ? 'w-1/2' : ''}`}></div>
        
        {/* Pass the isOpen state to the dropdown */}
        {renderChildren()}
      </div>
    </li>
  );
}
