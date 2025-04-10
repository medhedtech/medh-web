"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "outline";
}

interface EmptyStateProps {
  /**
   * The title to display in the empty state
   */
  title: string;
  
  /**
   * Optional description text
   */
  description?: string;
  
  /**
   * Optional icon to display
   */
  icon?: React.ReactNode;
  
  /**
   * Optional action button configuration
   */
  action?: EmptyStateAction;
  
  /**
   * Additional class names
   */
  className?: string;
}

/**
 * Empty state component for when no data is available
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = "",
}) => {
  // Button variant styles
  const getButtonStyles = (variant: string = "primary") => {
    switch (variant) {
      case "primary":
        return "bg-primary-600 hover:bg-primary-700 text-white";
      case "secondary":
        return "bg-gray-600 hover:bg-gray-700 text-white";
      case "outline":
        return "bg-transparent border border-current text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-800";
      default:
        return "bg-primary-600 hover:bg-primary-700 text-white";
    }
  };
  
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="mb-6 text-gray-400 dark:text-gray-500">
        {icon || <AlertCircle size={48} />}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
          {description}
        </p>
      )}
      
      {action && (
        <button
          onClick={action.onClick}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonStyles(action.variant)}`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState; 