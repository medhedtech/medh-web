"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

/**
 * MobileLinkPrimary Component
 * 
 * Enhanced mobile primary navigation link with:
 * - Consistent styling with desktop navigation
 * - Active state detection
 * - Improved status badge handling
 * - Better accessibility
 */
const MobileLinkPrimary = ({ item }) => {
  const { name, path, status, badge } = item;
  const pathname = usePathname();
  const isActive = pathname === path;
  
  // For accordion headers that don't navigate (empty or # paths)
  const isAccordionHeader = !path || path === '#';
  
  return (
    <Link
      href={path || '#'}
      className={`
        flex items-center text-sm font-medium transition-all duration-200 py-2
        ${isActive 
          ? 'text-primary-600 dark:text-primary-400' 
          : 'text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400'
        }
      `}
      onClick={(e) => {
        // Prevent navigation for accordion headers
        if (isAccordionHeader) {
          e.preventDefault();
        }
      }}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="flex-grow">{name}</span>
      
      {/* Status badge handling */}
      {status && (
        <span
          className={`
            ml-2 px-2 py-0.5 text-xs font-medium rounded-full 
            ${status.toLowerCase() === 'new' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
              : status.toLowerCase() === 'popular'
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                : 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400'
            }
          `}
        >
          {status}
        </span>
      )}
      
      {/* Badge (for count or other indicators) */}
      {badge && (
        <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
          {badge}
        </span>
      )}
    </Link>
  );
};

export default MobileLinkPrimary;
