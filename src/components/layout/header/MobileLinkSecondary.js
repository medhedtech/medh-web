"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

/**
 * MobileLinkSecondary Component
 * 
 * Enhanced mobile secondary link with:
 * - Styling consistent with desktop dropdown items
 * - Active state detection
 * - Improved status badge visualization
 * - Modern hover effects
 */
const MobileLinkSecondary = ({ item }) => {
  const { name, path, status, badge } = item;
  const pathname = usePathname();
  const isActive = pathname === path;
  
  return (
    <Link
      href={path}
      className={`
        flex items-center py-2 px-3 text-sm rounded-md transition-all duration-200
        ${isActive 
          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-gray-800 font-medium' 
          : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
        }
      `}
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

export default MobileLinkSecondary;
