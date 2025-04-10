"use client";

import React from "react";
import Image from "next/image";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  /**
   * Source URL for the avatar image
   */
  src?: string;
  
  /**
   * Alt text for the image
   */
  alt?: string;
  
  /**
   * Size of the avatar
   */
  size?: AvatarSize;
  
  /**
   * Initials to display if no image is provided
   */
  initials?: string;
  
  /**
   * Border color for the avatar
   */
  borderColor?: string;
  
  /**
   * Status indicator
   */
  status?: "online" | "offline" | "away" | "busy" | "none";
  
  /**
   * Whether to show a border
   */
  bordered?: boolean;
  
  /**
   * Additional class names
   */
  className?: string;
  
  /**
   * Click handler
   */
  onClick?: () => void;
}

/**
 * Avatar component for displaying user profile images with fallback to initials
 */
const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = "md",
  initials,
  borderColor,
  status = "none",
  bordered = false,
  className = "",
  onClick,
}) => {
  // Size classes mapping
  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
  };
  
  // Status indicator colors
  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
    busy: "bg-red-500",
    none: "hidden",
  };
  
  // Status dot sizes
  const statusSizes = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-3.5 h-3.5",
  };
  
  // Generate background color based on initials for consistent coloring
  const getInitialsBackgroundColor = (initials?: string) => {
    if (!initials) return "bg-gray-200 dark:bg-gray-700";
    
    // Simple hash function for consistent coloring
    const hash = Array.from(initials)
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    
    return colors[hash % colors.length];
  };
  
  // Get border styles
  const getBorderStyles = () => {
    if (!bordered) return "";
    
    return borderColor 
      ? `border-2 border-${borderColor}` 
      : "border-2 border-white dark:border-gray-800";
  };
  
  return (
    <div className="relative inline-flex">
      <div 
        className={`
          ${sizeClasses[size]} 
          ${getBorderStyles()} 
          rounded-full overflow-hidden flex items-center justify-center
          ${onClick ? "cursor-pointer" : ""}
          ${className}
        `}
        onClick={onClick}
        role={onClick ? "button" : undefined}
      >
        {src ? (
          <Image 
            src={src} 
            alt={alt}
            width={parseInt(sizeClasses[size].split(" ")[0].replace("w-", "")) * 4}
            height={parseInt(sizeClasses[size].split(" ")[1].replace("h-", "")) * 4}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className={`
            ${getInitialsBackgroundColor(initials)} 
            text-white w-full h-full flex items-center justify-center font-medium
          `}>
            {initials?.slice(0, 2).toUpperCase() || "?"}
          </div>
        )}
      </div>
      
      {/* Status indicator */}
      {status !== "none" && (
        <span 
          className={`
            absolute bottom-0 right-0 
            ${statusColors[status]} 
            ${statusSizes[size]} 
            rounded-full 
            ring-2 ring-white dark:ring-gray-800
          `}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};

export default Avatar; 