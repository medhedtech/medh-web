"use client";

import React from "react";

type ButtonVariant = 
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark"
  | "link"
  | "outline";

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonProps {
  /**
   * The variant/style of the button
   */
  variant?: ButtonVariant;
  
  /**
   * The size of the button
   */
  size?: ButtonSize;
  
  /**
   * Whether the button should be full width
   */
  fullWidth?: boolean;
  
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the button is in a loading state
   */
  loading?: boolean;
  
  /**
   * Text to display during loading state
   */
  loadingText?: string;
  
  /**
   * Icon to display at the start of the button
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Icon to display at the end of the button
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Additional class names
   */
  className?: string;
  
  /**
   * Button type attribute
   */
  type?: "button" | "submit" | "reset";
  
  /**
   * Click handler
   */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  
  /**
   * Button content
   */
  children: React.ReactNode;
  
  /**
   * Additional props to pass to the button element
   */
  [x: string]: any;
}

/**
 * Button component for actions in forms, dialogs, and more
 */
const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  loadingText,
  leftIcon,
  rightIcon,
  className = "",
  type = "button",
  onClick,
  children,
  ...rest
}) => {
  // Define variant-specific classes
  const variantClasses = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500",
    info: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    light: "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-500",
    dark: "bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-500",
    link: "bg-transparent text-primary-600 hover:text-primary-700 hover:underline p-0 focus:ring-0",
    outline: "bg-transparent border border-current text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-800 focus:ring-primary-500",
  };
  
  // Define size-specific classes
  const sizeClasses = {
    xs: "text-xs px-2.5 py-1.5",
    sm: "text-sm px-3 py-2",
    md: "text-base px-4 py-2",
    lg: "text-lg px-5 py-2.5",
    xl: "text-xl px-6 py-3",
  };
  
  // Construct the complete class list
  const buttonClasses = [
    variant !== "link" ? "font-medium rounded-lg shadow-sm" : "",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    disabled || loading ? "opacity-70 cursor-not-allowed" : "transition-colors duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
    "inline-flex items-center justify-center",
    className
  ].filter(Boolean).join(" ");
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? (
        <>
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {loadingText || children}
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button; 