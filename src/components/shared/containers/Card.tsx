"use client";

import React from "react";

interface CardProps {
  /**
   * The main content of the card
   */
  children: React.ReactNode;
  
  /**
   * Optional title for the card
   */
  title?: string | React.ReactNode;
  
  /**
   * Optional subtitle for the card
   */
  subtitle?: string | React.ReactNode;
  
  /**
   * Optional footer content
   */
  footer?: React.ReactNode;
  
  /**
   * Optional header actions (e.g., buttons)
   */
  headerActions?: React.ReactNode;
  
  /**
   * Whether to add padding to the content
   */
  padded?: boolean;
  
  /**
   * Whether to add a border
   */
  bordered?: boolean;
  
  /**
   * Whether the card has a shadow
   */
  shadowed?: boolean;
  
  /**
   * Whether the card has rounded corners
   */
  rounded?: boolean;
  
  /**
   * Optional image to display at the top of the card
   */
  image?: {
    src: string;
    alt: string;
  };
  
  /**
   * Optional click handler for the entire card
   */
  onClick?: () => void;
  
  /**
   * Additional class names for the card
   */
  className?: string;
  
  /**
   * Additional class names for the card content
   */
  contentClassName?: string;
}

/**
 * Card component for displaying content in a visually distinct container
 */
const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  headerActions,
  padded = true,
  bordered = true,
  shadowed = true,
  rounded = true,
  image,
  onClick,
  className = "",
  contentClassName = "",
}) => {
  const cardClasses = [
    "bg-white dark:bg-gray-800",
    bordered ? "border border-gray-200 dark:border-gray-700" : "",
    shadowed ? "shadow-sm" : "",
    rounded ? "rounded-lg overflow-hidden" : "",
    onClick ? "cursor-pointer transition-all hover:shadow-md" : "",
    className,
  ].filter(Boolean).join(" ");
  
  const contentClasses = [
    padded ? "p-5" : "",
    contentClassName,
  ].filter(Boolean).join(" ");
  
  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      {/* Card Image */}
      {image && (
        <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700">
          <img 
            src={image.src} 
            alt={image.alt} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Card Header */}
      {(title || subtitle || headerActions) && (
        <div className={`flex justify-between items-start ${padded ? 'px-5 pt-5 pb-3' : ''}`}>
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {subtitle}
              </p>
            )}
          </div>
          
          {headerActions && (
            <div className="ml-4 flex-shrink-0">
              {headerActions}
            </div>
          )}
        </div>
      )}
      
      {/* Card Content */}
      <div className={contentClasses}>
        {children}
      </div>
      
      {/* Card Footer */}
      {footer && (
        <div className={`border-t border-gray-100 dark:border-gray-700 ${padded ? 'px-5 py-3' : ''}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 