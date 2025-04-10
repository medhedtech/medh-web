"use client";

import React, { ChangeEvent, useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  /**
   * Placeholder text to display when the input is empty
   */
  placeholder?: string;
  
  /**
   * The current value of the input
   */
  value: string;
  
  /**
   * Callback fired when the input value changes
   */
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  
  /**
   * Callback fired when the clear button is clicked
   */
  onClear?: () => void;
  
  /**
   * Callback fired when the user submits the search
   */
  onSubmit?: (value: string) => void;
  
  /**
   * Additional classes to apply to the component
   */
  className?: string;
  
  /**
   * Whether to auto-focus the input when mounted
   */
  autoFocus?: boolean;
  
  /**
   * The size of the search bar
   */
  size?: "sm" | "md" | "lg";
  
  /**
   * Whether to show a loading indicator
   */
  isLoading?: boolean;
}

/**
 * A search input component with clear button functionality
 */
const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  value,
  onChange,
  onClear,
  onSubmit,
  className = "",
  autoFocus = false,
  size = "md",
  isLoading = false,
}) => {
  // Determine size-specific classes
  const sizeClasses = {
    sm: {
      container: "h-8",
      input: "text-sm",
      icon: "w-4 h-4",
    },
    md: {
      container: "h-10",
      input: "text-base",
      icon: "w-5 h-5",
    },
    lg: {
      container: "h-12",
      input: "text-lg",
      icon: "w-6 h-6",
    },
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    }
  };
  
  return (
    <form 
      onSubmit={handleSubmit}
      className={`relative flex items-center ${sizeClasses[size].container} ${className}`}
    >
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className={`${sizeClasses[size].icon} text-gray-500 dark:text-gray-400`} aria-hidden="true" />
      </div>
      
      <input
        type="search"
        value={value}
        onChange={onChange}
        className={`
          block w-full pl-10 pr-10 py-2 
          ${sizeClasses[size].input}
          bg-white dark:bg-gray-800 
          border border-gray-300 dark:border-gray-700 
          rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
          dark:focus:ring-primary-500 dark:focus:border-primary-500
          placeholder-gray-400 dark:placeholder-gray-500
          text-gray-900 dark:text-white
          transition-colors duration-200
        `}
        placeholder={placeholder}
        aria-label={placeholder}
        autoFocus={autoFocus}
        disabled={isLoading}
      />
      
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          aria-label="Clear search"
        >
          <X className={sizeClasses[size].icon} aria-hidden="true" />
        </button>
      )}
      
      {isLoading && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-primary-500"></div>
        </div>
      )}
    </form>
  );
};

export default SearchBar; 