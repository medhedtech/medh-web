"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MoreHorizontal, Menu, X } from "lucide-react";

interface SubItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
  onClick?: () => void;
}

interface DashboardNavbarProps {
  activeMenu: string;
  subItems: SubItem[];
  onItemClick: (subItem: SubItem) => void;
  currentView: string;
  isSubItemActive: (subItem: SubItem) => boolean;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  activeMenu,
  subItems,
  onItemClick,
  currentView,
  isSubItemActive
}) => {
  const [showMoreDropdown, setShowMoreDropdown] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          moreButtonRef.current && !moreButtonRef.current.contains(event.target as Node)) {
        setShowMoreDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Close mobile menu when screen gets larger
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (subItems.length === 0) return null;
  
  return (
    <div className="sticky top-0 z-40 backdrop-blur-sm shadow-sm border-b border-white/5 dark:border-gray-700/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Title and Desktop Navigation */}
          <div className="flex items-center flex-1">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {activeMenu}
            </h2>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex ml-8 space-x-1">
              {subItems.slice(0, 4).map((subItem, idx) => (
                <button
                  key={idx}
                  onClick={() => !subItem.comingSoon && onItemClick(subItem)}
                  disabled={subItem.comingSoon}
                  aria-current={isSubItemActive(subItem) ? "page" : undefined}
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap
                    ${subItem.comingSoon 
                      ? "opacity-60 cursor-not-allowed" 
                      : "hover:bg-transparent dark:hover:bg-transparent"}
                    ${isSubItemActive(subItem) 
                      ? "bg-transparent dark:bg-transparent text-indigo-600 dark:text-indigo-400 ring-1 ring-inset ring-indigo-500/20 h-10" 
                      : "text-gray-700 dark:text-gray-300"}
                  `}
                >
                  <span className={isSubItemActive(subItem) ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}>
                    {subItem.icon}
                  </span>
                  
                  {subItem.name}
                  
                  {subItem.comingSoon && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-transparent dark:bg-transparent text-gray-600 dark:text-gray-400 flex items-center border border-gray-300 dark:border-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1 animate-pulse"></span>
                      Soon
                    </span>
                  )}
                </button>
              ))}
              
              {/* More dropdown */}
              {subItems.length > 4 && (
                <div className="relative">
                  <button
                    ref={moreButtonRef}
                    onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                    className={`
                      px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap
                      hover:bg-transparent dark:hover:bg-transparent text-gray-700 dark:text-gray-300
                      ${showMoreDropdown ? 'bg-transparent dark:bg-transparent' : ''}
                    `}
                    aria-expanded={showMoreDropdown}
                  >
                    <span className="flex items-center">
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">+{subItems.length - 4}</span>
                      <span className="ml-1">more</span>
                    </span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${showMoreDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showMoreDropdown && (
                      <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 z-50 mt-1 w-56 origin-top-right rounded-md bg-transparent dark:bg-transparent shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none backdrop-blur-sm"
                        role="menu"
                      >
                        <div className="py-2">
                          {subItems.slice(4).map((subItem, idx) => (
                            <motion.button
                              key={idx}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: idx * 0.03 }}
                              onClick={() => {
                                if (!subItem.comingSoon) {
                                  onItemClick(subItem);
                                  setShowMoreDropdown(false);
                                }
                              }}
                              disabled={subItem.comingSoon}
                              className={`
                                group w-full flex items-center gap-2 px-4 py-2 text-sm text-left whitespace-nowrap
                                ${subItem.comingSoon 
                                  ? "opacity-60 cursor-not-allowed" 
                                  : "hover:bg-transparent dark:hover:bg-transparent"}
                                ${isSubItemActive(subItem) 
                                  ? "bg-transparent dark:bg-transparent text-indigo-600 dark:text-indigo-400" 
                                  : "text-gray-700 dark:text-gray-300"}
                              `}
                              role="menuitem"
                            >
                              <span className={isSubItemActive(subItem) ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}>
                                {subItem.icon}
                              </span>
                              
                              {subItem.name}
                              
                              {subItem.comingSoon && (
                                <span className="ml-auto px-1.5 py-0.5 text-xs rounded-full bg-transparent dark:bg-transparent text-gray-600 dark:text-gray-400 flex items-center border border-gray-300 dark:border-gray-600">
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1 animate-pulse"></span>
                                  Soon
                                </span>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-transparent dark:hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state. */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-white/10 dark:border-gray-700/10 backdrop-blur-sm">
              {subItems.map((subItem, idx) => (
                <motion.button
                  key={idx}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => {
                    if (!subItem.comingSoon) {
                      onItemClick(subItem);
                      setMobileMenuOpen(false);
                    }
                  }}
                  disabled={subItem.comingSoon}
                  aria-current={isSubItemActive(subItem) ? "page" : undefined}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium whitespace-nowrap
                    ${subItem.comingSoon 
                      ? "opacity-60 cursor-not-allowed" 
                      : "hover:bg-transparent dark:hover:bg-transparent"}
                    ${isSubItemActive(subItem) 
                      ? "bg-transparent dark:bg-transparent text-indigo-600 dark:text-indigo-400 ring-1 ring-inset ring-indigo-500/20 h-12" 
                      : "text-gray-700 dark:text-gray-300"}
                  `}
                >
                  <span className={isSubItemActive(subItem) ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}>
                    {subItem.icon}
                  </span>
                  
                  {subItem.name}
                  
                  {subItem.comingSoon && (
                    <span className="ml-auto px-1.5 py-0.5 text-xs rounded-full bg-transparent dark:bg-transparent text-gray-600 dark:text-gray-400 flex items-center border border-gray-300 dark:border-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1 animate-pulse"></span>
                      Soon
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardNavbar;
