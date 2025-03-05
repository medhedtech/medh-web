"use client";
import Link from "next/link";
import React from "react";

/**
 * MobileLink Component
 * 
 * Enhanced mobile navigation link with:
 * - Exact match with desktop navigation styling and behavior
 * - Support for isRelative property from NavItems.js
 * - Active state highlighting
 * - Consistent styling with desktop navigation
 * - Improved accessibility
 */
const MobileLink = ({ item }) => {
  const { name, path, isActive, isRelative } = item;
  
  // If path is empty (like in the "Courses" or "More" items in desktop nav),
  // use # to prevent page navigation but allow accordion to work
  const linkPath = path || '#';
  
  // Apply styles consistently with desktop navigation
  const baseStyles = `
    flex items-center py-2 transition-colors duration-200
    ${isActive 
      ? 'text-primary-600 dark:text-primary-400 font-medium' 
      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
    }
  `;
  
  // Add position relative class if needed (matching desktop nav)
  const positionClass = isRelative ? 'relative' : '';
  
  return (
    <Link
      className={`${baseStyles} ${positionClass}`}
      href={linkPath}
      aria-current={isActive ? 'page' : undefined}
      onClick={(e) => {
        // Prevent navigation for items with empty paths
        if (linkPath === '#') {
          e.preventDefault();
        }
      }}
    >
      {/* Link text with optional active styling */}
      <span className={isActive ? 'relative' : ''}>
        {name}
        {isActive && (
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary-500 dark:bg-primary-400 rounded opacity-0 lg:opacity-100" />
        )}
      </span>
    </Link>
  );
};

export default MobileLink;
