"use client";
import React, { useState, useEffect, useRef } from 'react';

const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'bottom-[-6px] left-1/2 -translate-x-1/2 border-t-gray-800 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'top-[-6px] left-1/2 -translate-x-1/2 border-b-gray-800 border-l-transparent border-r-transparent border-t-transparent',
    left: 'right-[-6px] top-1/2 -translate-y-1/2 border-l-gray-800 border-t-transparent border-b-transparent border-r-transparent',
    right: 'left-[-6px] top-1/2 -translate-y-1/2 border-r-gray-800 border-t-transparent border-b-transparent border-l-transparent'
  };

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
    };
  }, []);

  const handleMouseEnter = () => {
    // Don't show tooltip if the target is an input or select
    const activeElement = document.activeElement;
    const isFormElement = activeElement.tagName === 'INPUT' || 
                         activeElement.tagName === 'SELECT' || 
                         activeElement.tagName === 'TEXTAREA';
    
    if (!isFormElement) {
      setIsVisible(true);
    }
  };

  return (
    <div 
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsVisible(false)}
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
      {isVisible && (
        <div 
          ref={tooltipRef}
          className={`
            absolute z-[9999] ${positionClasses[position]}
            px-3 py-2 text-sm text-white bg-gray-800 
            rounded-lg shadow-lg max-w-xs
            transition-opacity duration-200
            dark:bg-gray-700
          `}
          style={{ pointerEvents: 'none' }}
        >
          {content}
          <div className={`
            absolute w-0 h-0
            border-solid border-4
            ${arrowClasses[position]}
          `} />
        </div>
      )}
    </div>
  );
};

export default Tooltip; 