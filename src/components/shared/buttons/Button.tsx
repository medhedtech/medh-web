"use client";

import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant that defines the visual style
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  
  /**
   * Button size
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Whether the button is in a loading state
   */
  isLoading?: boolean;
  
  /**
   * Optional icon to display at the start of the button
   */
  startIcon?: ReactNode;
  
  /**
   * Optional icon to display at the end of the button
   */
  endIcon?: ReactNode;
  
  /**
   * Whether the button should expand to fill its container's width
   */
  fullWidth?: boolean;
  
  /**
   * Button corners style
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  
  /**
   * Any react node to render inside the button
   */
  children?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  startIcon,
  endIcon,
  fullWidth = false,
  rounded = 'md',
  className = '',
  disabled,
  type = 'button',
  ...props
}) => {
  // Size classes mapping
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    xl: 'px-6 py-3 text-lg'
  };

  // Variant classes mapping
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-sm',
    secondary: 'bg-secondary hover:bg-secondary-dark text-white shadow-sm',
    outline: 'bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm',
  };

  // Rounded classes mapping
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  // Disabled classes
  const disabledClasses = 'opacity-60 cursor-not-allowed';

  // Full width class
  const fullWidthClass = fullWidth ? 'w-full' : '';

  // Common classes
  const commonClasses = 'font-medium inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors';

  // Build the button classes
  const buttonClasses = [
    commonClasses,
    sizeClasses[size],
    variantClasses[variant],
    roundedClasses[rounded],
    fullWidthClass,
    disabled || isLoading ? disabledClasses : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {!isLoading && endIcon && <span className="ml-2">{endIcon}</span>}
    </button>
  );
};

export default Button; 