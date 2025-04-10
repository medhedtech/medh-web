"use client";

import React from 'react';
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SubItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
  onClick?: () => void;
}

interface MenuItemProps {
  item: {
    name: string;
    path?: string;
    icon: React.ReactNode;
    onClick?: () => void;
    subItems?: SubItem[];
    comingSoon?: boolean;
  };
  isActive: boolean;
  isMobileDevice: boolean;
  onItemClick: (menuName: string, items: SubItem[]) => void;
  renderMobileSubitems?: (item: typeof item) => React.ReactNode;
}

const SidebarMenuItem: React.FC<MenuItemProps> = ({
  item,
  isActive,
  isMobileDevice,
  onItemClick,
  renderMobileSubitems
}) => {
  // Animation variants
  const itemVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    hover: { 
      x: 3, 
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  const indicatorVariants = {
    initial: { width: 0, opacity: 0 },
    animate: { width: 64, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }
  };

  return (
    <motion.li
      initial="initial"
      animate="animate"
      variants={itemVariants}
      transition={{ duration: 0.2 }}
    >
      <motion.button
        onClick={() => {
          if (item.subItems) {
            onItemClick(item.name, item.subItems);
          } else {
            onItemClick(item.name, []);
          }
          
          if (item.onClick) {
            item.onClick();
          }
        }}
        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 border-l-2 border-primary-500" 
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        }`}
        whileHover="hover"
        whileTap="tap"
        aria-expanded={isActive}
        aria-label={`Menu: ${item.name}`}
      >
        <div className="flex items-center gap-3">
          <span className={`transition-colors ${
            isActive
              ? "text-primary-600 dark:text-primary-400"
              : "text-gray-500 dark:text-gray-400"
          }`}>
            {item.icon}
          </span>
          <span>{item.name}</span>
          
          {item.comingSoon && (
            <span className="ml-2 px-1.5 py-0.5 text-[10px] rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 font-medium">
              Soon
            </span>
          )}
        </div>
        
        {item.subItems && (
          <motion.span
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className={`${isActive ? "text-primary-500" : ""}`}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        )}
      </motion.button>
      
      {/* Mobile optimized submenu display */}
      <AnimatePresence>
        {isActive && isMobileDevice && renderMobileSubitems && renderMobileSubitems(item)}
      </AnimatePresence>
      
      {/* Desktop indicator that opens in navbar */}
      <AnimatePresence>
        {item.subItems && isActive && !isMobileDevice && (
          <motion.div 
            className="mt-1 ml-8 h-1 bg-gradient-to-r from-primary-300 to-purple-300 dark:from-primary-800 dark:to-purple-800 rounded-full"
            variants={indicatorVariants}
            initial="initial"
            animate="animate"
            exit={{ width: 0, opacity: 0, transition: { duration: 0.2 } }}
          />
        )}
      </AnimatePresence>
    </motion.li>
  );
};

export default SidebarMenuItem; 