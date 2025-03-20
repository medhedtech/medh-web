"use client";
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IoMdClose } from 'react-icons/io';

/**
 * Reusable Modal Component
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to call when the modal is closed
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.size - Modal size (sm, md, lg, xl, or full)
 * @param {boolean} props.closeOnOutsideClick - Whether to close the modal when clicking outside
 * @param {string} props.className - Additional class names for the modal
 * @returns {React.ReactPortal|null}
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md', 
  closeOnOutsideClick = true,
  className = ''
}) => {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // Restore scrolling when modal is closed
    };
  }, [isOpen, onClose]);

  // Handle click outside of modal
  const handleOverlayClick = (e) => {
    if (closeOnOutsideClick && overlayRef.current === e.target) {
      onClose();
    }
  };

  // Determine modal width based on size prop
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  const modalWidth = sizeClasses[size] || sizeClasses.md;

  // Don't render if modal is not open
  if (!isOpen) return null;

  // Use portal to render modal at the root level
  return createPortal(
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
      onClick={handleOverlayClick}
    >
      <div 
        ref={modalRef}
        className={`${modalWidth} w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all mx-4 ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 
            id="modal-title"
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            aria-label="Close modal"
          >
            <IoMdClose size={24} />
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal; 