"use client";

import React from "react";
import { motion } from "framer-motion";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: "default" | "pills" | "underline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

/**
 * A reusable tab navigation component for switching between different views
 */
const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onChange,
  className = "",
  variant = "default",
  size = "md",
  fullWidth = false,
}) => {
  // Size-specific classes
  const sizeClasses = {
    sm: "text-xs py-1.5 px-3",
    md: "text-sm py-2 px-4",
    lg: "text-base py-2.5 px-5",
  };
  
  // Variant-specific styles
  const getTabStyles = (isActive: boolean, isDisabled: boolean) => {
    if (isDisabled) {
      return "text-gray-400 dark:text-gray-600 cursor-not-allowed";
    }
    
    switch (variant) {
      case "pills":
        return isActive
          ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 font-medium"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors";
      case "underline":
        return isActive
          ? "text-primary-600 dark:text-primary-400 font-medium"
          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors";
      default:
        return isActive
          ? "text-primary-600 dark:text-primary-400 font-medium"
          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors";
    }
  };
  
  // Container styles
  const containerStyles = {
    default: "border-b border-gray-200 dark:border-gray-700",
    pills: "flex p-1 gap-1 bg-gray-50 dark:bg-gray-800 rounded-lg",
    underline: "border-b border-gray-200 dark:border-gray-700",
  };
  
  return (
    <div className={`${className} ${fullWidth ? "w-full" : "w-fit"}`}>
      <div className={`${containerStyles[variant]} flex`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const isDisabled = tab.disabled || false;
          
          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && onChange(tab.id)}
              className={`relative ${sizeClasses[size]} rounded-md ${getTabStyles(isActive, isDisabled)} 
                ${variant === "default" ? "-mb-px" : ""} 
                ${fullWidth ? "flex-1 text-center" : ""}
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
              `}
              disabled={isDisabled}
              aria-selected={isActive}
              role="tab"
            >
              <div className="flex items-center justify-center gap-2">
                {tab.icon && <span>{tab.icon}</span>}
                <span>{tab.label}</span>
              </div>
              
              {variant === "default" && isActive && (
                <motion.div
                  layoutId="default-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 dark:bg-primary-400"
                  initial={false}
                  transition={{ duration: 0.3 }}
                />
              )}
              
              {variant === "underline" && isActive && (
                <motion.div
                  layoutId="underline-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 dark:bg-primary-400"
                  initial={false}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation; 