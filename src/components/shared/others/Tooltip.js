"use client";
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top',
  delay = 300,
  className = '',
  maxWidth = 'xs'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);
  const timerRef = useRef(null);

  // Define positioning classes based on the position prop
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  // Define arrow positioning classes
  const arrowClasses = {
    top: 'bottom-[-5px] left-1/2 -translate-x-1/2 border-t-gray-800 dark:border-t-gray-700 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'top-[-5px] left-1/2 -translate-x-1/2 border-b-gray-800 dark:border-b-gray-700 border-l-transparent border-r-transparent border-t-transparent',
    left: 'right-[-5px] top-1/2 -translate-y-1/2 border-l-gray-800 dark:border-l-gray-700 border-t-transparent border-b-transparent border-r-transparent',
    right: 'left-[-5px] top-1/2 -translate-y-1/2 border-r-gray-800 dark:border-r-gray-700 border-t-transparent border-b-transparent border-l-transparent'
  };

  // Define max width classes
  const maxWidthClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    none: ''
  };

  // Handle clicks outside the tooltip
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target) &&
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(timerRef.current);
    };
  }, []);

  // Handle mouse enter with delay
  const handleMouseEnter = () => {
    // Clear any existing timer
    clearTimeout(timerRef.current);
    
    // Don't show tooltip if the target is an input or select
    const activeElement = document.activeElement;
    const isFormElement = activeElement.tagName === 'INPUT' || 
                         activeElement.tagName === 'SELECT' || 
                         activeElement.tagName === 'TEXTAREA';
    
    if (!isFormElement) {
      timerRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setIsVisible(false);
  };

  // Animation variants for framer-motion
  const tooltipVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0,
      x: position === 'left' ? 10 : position === 'right' ? -10 : 0
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0
    }
  };

  return (
    <div 
      ref={triggerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      onClick={(e) => {
        // Prevent tooltip from interfering with click events
        if (e.target.tagName === 'INPUT' || 
            e.target.tagName === 'SELECT' || 
            e.target.tagName === 'TEXTAREA') {
          setIsVisible(false);
        }
      }}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            ref={tooltipRef}
            className={`
              absolute z-[9999] ${positionClasses[position]} ${maxWidthClasses[maxWidth]}
              px-3 py-2 text-sm font-medium text-white bg-gray-800 
              rounded-md shadow-lg
              dark:bg-gray-700
            `}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={tooltipVariants}
            transition={{ duration: 0.15 }}
            style={{ pointerEvents: 'none' }}
            role="tooltip"
          >
            {content}
            <div className={`
              absolute w-0 h-0
              border-solid border-4
              ${arrowClasses[position]}
            `} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip; 