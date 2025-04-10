"use client";

import React from "react";

type BadgeVariant = 
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark"
  | "outline";

type BadgeSize = "xs" | "sm" | "md" | "lg";

interface BadgeProps {
  /**
   * The variant of the badge determines its color scheme
   */
  variant?: BadgeVariant;
  
  /**
   * The size of the badge
   */
  size?: BadgeSize;
  
  /**
   * Whether the badge should have rounded full corners
   */
  rounded?: boolean;
  
  /**
   * The content to display inside the badge
   */
  children: React.ReactNode;
  
  /**
   * Additional classes to apply to the badge
   */
  className?: string;
  
  /**
   * Icon to display at the start of the badge
   */
  startIcon?: React.ReactNode;
  
  /**
   * Icon to display at the end of the badge
   */
  endIcon?: React.ReactNode;
  
  /**
   * Event handler for click events
   */
  onClick?: () => void;
}

/**
 * Badge component for displaying short status descriptors
 */
const Badge: React.FC<BadgeProps> = ({
  variant = "primary",
  size = "md",
  rounded = false,
  children,
  className = "",
  startIcon,
  endIcon,
  onClick,
}) => {
  // Determine variant-specific classes
  const variantClasses = {
    primary: "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    light: "bg-gray-100 text-gray-800 dark:bg-gray-200 dark:text-gray-800",
    dark: "bg-gray-700 text-white dark:bg-gray-800 dark:text-white",
    outline: "bg-transparent border border-current text-gray-700 dark:text-gray-300",
  };
  
  // Determine size-specific classes
  const sizeClasses = {
    xs: "text-xs px-1.5 py-0.5",
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  };
  
  // Construct the full class list
  const badgeClasses = [
    "inline-flex items-center justify-center gap-1 font-medium",
    variantClasses[variant],
    sizeClasses[size],
    rounded ? "rounded-full" : "rounded",
    onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : "",
    className,
  ].join(" ");
  
  return (
    <span className={badgeClasses} onClick={onClick}>
      {startIcon && <span className="inline-flex">{startIcon}</span>}
      {children}
      {endIcon && <span className="inline-flex">{endIcon}</span>}
    </span>
  );
};

export default Badge; 