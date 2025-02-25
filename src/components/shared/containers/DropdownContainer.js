"use client";

import { useEffect, useState, useRef } from "react";
import useIsTrue from "@/hooks/useIsTrue";
import { usePathname } from "next/navigation";

const DropdownContainer = ({ 
  children, 
  className = "", 
  position = "right", 
  width = "auto",
  animate = true,
  closeOnClickOutside = true,
  maxHeight = null,
  isOpen = null,
  onToggle = null
}) => {
  // Path detection hooks
  const pathname = usePathname();
  const isHome1 = useIsTrue("/");
  const isHome1Dark = useIsTrue("/home-1-dark");
  const isHome2 = useIsTrue("/home-2");
  const isHome2Dark = useIsTrue("/home-2-dark");
  const isHome4 = useIsTrue("/home-4");
  const isHome4Dark = useIsTrue("/home-4-dark");
  const isHome5 = useIsTrue("/home-5");
  const isHome5Dark = useIsTrue("/home-5-dark");
  
  // Internal state for dropdown visibility (when not controlled externally)
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef(null);
  
  // Determine if dropdown is controlled or uncontrolled
  const isControlled = isOpen !== null;
  const dropdownIsOpen = isControlled ? isOpen : isVisible;
  
  // Handle click outside to close dropdown
  useEffect(() => {
    if (!closeOnClickOutside) return;
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (!isControlled) {
          setIsVisible(false);
        } else if (onToggle) {
          onToggle(false);
        }
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeOnClickOutside, isControlled, onToggle]);
  
  // Toggle dropdown visibility
  const toggleDropdown = () => {
    if (!isControlled) {
      setIsVisible(!isVisible);
    } else if (onToggle) {
      onToggle(!isOpen);
    }
  };
  
  // Determine width class based on current route
  const getWidthClass = () => {
    if (width !== "auto") return width;
    
    if (
      isHome1 ||
      isHome1Dark ||
      isHome4 ||
      isHome4Dark ||
      isHome5 ||
      isHome5Dark
    ) {
      return "w-fit";
    } else if (isHome2 || isHome2Dark) {
      return "w-fit";
    }
    return "w-fit";
  };
  
  // Position classes
  const getPositionClass = () => {
    switch (position) {
      case "left":
        return "left-0";
      case "center":
        return "left-1/2 -translate-x-1/2";
      case "right":
      default:
        return "right-0";
    }
  };
  
  return (
    <div 
      ref={dropdownRef}
      className={`
        ${getWidthClass()} 
        ${getPositionClass()}
        relative bg-white dark:bg-bodyBg-dark
        rounded-md shadow-lg border border-gray-200 dark:border-gray-700
        overflow-hidden transition-all duration-300 ease-in-out
        ${animate ? 'transform' : ''}
        ${dropdownIsOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
        ${maxHeight ? `max-h-[${maxHeight}] overflow-y-auto` : ''}
        ${className}
      `}
      style={{
        maxHeight: maxHeight,
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--primary-400) var(--gray-200)'
      }}
    >
      <div className="p-2">
        {children}
      </div>
    </div>
  );
};

export default DropdownContainer;
