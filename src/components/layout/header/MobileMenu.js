"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import MobileMenuItems from "./MobileItems";
import MobileItems2 from "./MobileItems2";
import MobileMenuSearch from "./MobileMenuSearch";
import MobileMyAccount from "./MobileMyAccount";
import MobileSocial from "./MobileSocial";
import useIsTrue from "@/hooks/useIsTrue";

/**
 * MobileMenu Component
 * Self-contained mobile navigation menu with toggle button and slide-out panel
 * Includes search, navigation items, account access, and social links
 */
const MobileMenu = () => {
  // Page detection
  const isHome2Dark = useIsTrue("/home-2-dark");
  
  // UI state
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  
  // Handle menu toggle
  const openMenu = useCallback(() => setIsOpen(true), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);
  
  // Close menu when pressing escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, closeMenu]);
  
  // Handle clicks outside menu to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    };
    
    // Only add the listener when the menu is open
    if (isOpen) {
      // Use a small delay to avoid capturing the click that opened the menu
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeMenu]);
  
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  return (
    <>
      {/* Mobile Menu Button - Hamburger Icon */}
      <button
        type="button"
        className="lg:hidden inline-flex items-center justify-center p-2 rounded-full text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 transform hover:scale-105"
        onClick={openMenu}
        aria-expanded={isOpen}
        aria-label="Open main menu"
      >
        <span className="sr-only">Open main menu</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Mobile Menu Panel */}
      <div 
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className={`fixed top-0 right-0 w-[280px] sm:w-[330px] h-full bg-white dark:bg-gray-900 shadow-xl z-[999] transition-all duration-300 ease-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button */}
        <div className="absolute top-4 right-4">
          <button
            type="button"
            className="flex items-center justify-center p-2 rounded-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-all duration-200"
            onClick={closeMenu}
            aria-label="Close mobile menu"
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        {/* Mobile menu content */}
        <div className="px-5 sm:px-6 pt-14 pb-12 h-full overflow-y-auto bg-white dark:bg-gray-900">
          {/* Search section */}
          <MobileMenuSearch />
          
          {/* Navigation items */}
          <nav className="mt-6" aria-label="Mobile navigation">
            {isHome2Dark ? <MobileItems2 /> : <MobileMenuItems />}
          </nav>
          
          {/* Account section */}
          <div className="mt-8">
            <MobileMyAccount />
          </div>
          
          {/* Social links */}
          <div className="mt-8">
            <MobileSocial />
          </div>
        </div>
      </div>
      
      {/* Backdrop - only visible when menu is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[998]"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default MobileMenu;
