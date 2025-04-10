"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  /**
   * Label for the select element
   */
  label?: string;
  
  /**
   * List of options for the select
   */
  options: SelectOption[];
  
  /**
   * Currently selected value
   */
  value: string;
  
  /**
   * Callback when value changes
   */
  onChange: (value: string) => void;
  
  /**
   * Placeholder text when no option is selected
   */
  placeholder?: string;
  
  /**
   * Custom class names to be applied
   */
  className?: string;
  
  /**
   * Whether the select is disabled
   */
  disabled?: boolean;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Whether the field is required
   */
  required?: boolean;
  
  /**
   * Additional helper text
   */
  helperText?: string;
  
  /**
   * Size of the select component
   */
  size?: "sm" | "md" | "lg";
}

/**
 * A custom select component designed with Tailwind CSS
 */
const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  disabled = false,
  error,
  required = false,
  helperText,
  size = "md",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  
  // Size variations
  const sizeClasses = {
    sm: "text-sm py-1.5 px-3",
    md: "text-base py-2 px-4",
    lg: "text-lg py-2.5 px-5",
  };
  
  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectRef]);
  
  // Find the currently selected option
  const selectedOption = options.find(option => option.value === value);
  
  // Handle selection of an option
  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    onChange(option.value);
    setIsOpen(false);
  };
  
  // Toggle the dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        onClick={toggleDropdown}
        className={`
          relative cursor-pointer flex items-center justify-between
          w-full ${sizeClasses[size]} rounded-lg 
          bg-white dark:bg-gray-800 
          border ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"} 
          ${disabled ? "bg-gray-100 dark:bg-gray-800/50 cursor-not-allowed opacity-75" : ""}
          ${isOpen ? "ring-2 ring-primary-500 border-primary-500" : "hover:border-gray-400 dark:hover:border-gray-600"}
          transition-colors duration-200
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        role="combobox"
      >
        <span className={`block truncate ${!selectedOption ? "text-gray-400 dark:text-gray-500" : ""}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        <span className="ml-2 pointer-events-none">
          <ChevronDown 
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
            aria-hidden="true" 
          />
        </span>
      </div>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div 
          className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none border border-gray-200 dark:border-gray-700"
          role="listbox"
        >
          <ul className="py-1">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`
                  px-4 py-2 flex items-center justify-between
                  ${option.disabled ? "text-gray-400 dark:text-gray-600 cursor-not-allowed" : 
                    option.value === value 
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400" 
                      : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  }
                  cursor-pointer select-none relative
                `}
                role="option"
                aria-selected={option.value === value}
              >
                <span className="block truncate">{option.label}</span>
                
                {option.value === value && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-600 dark:text-primary-400">
                    <Check className="h-5 w-5" aria-hidden="true" />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Helper text or error message */}
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Select; 