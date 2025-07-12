import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Download, ArrowRight, Mail, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { apiBaseUrl, apiUrls } from "@/apis";
import useAuth from "@/hooks/useAuth";
import PropTypes from 'prop-types';

/**
 * TypeScript type for DownloadBrochureModal props
 */
// @ts-ignore
export interface DownloadBrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle?: string;
  brochureId?: string;
  courseId?: string;
  course?: any;
  inlineForm?: boolean;
  flipCard?: boolean;
  children?: React.ReactNode;
}

/**
 * DownloadBrochureModal Component
 * 
 * Supports multiple brochure download methods:
 * 1. Direct brochure URLs from course object (course.brochures array)
 * 2. API-based download using courseId or brochureId
 * 
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Function to close the modal
 * @param {string} courseTitle - Course title (optional, can be derived from course object)
 * @param {string} brochureId - ID for API-based brochure download
 * @param {string} courseId - ID for API-based course brochure download
 * @param {object} course - Course object containing brochures array with direct URLs
 * @param {boolean} inlineForm - Whether to display as inline form
 * @param {boolean} flipCard - Whether to use flip card animation
 * @param {ReactNode} children - Child components for flip card mode
 */
const DownloadBrochureModal = ({
  isOpen,
  onClose,
  courseTitle,
  brochureId,
  courseId,
  course = null,
  children,
}: DownloadBrochureModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-900 overflow-y-auto flex flex-col min-h-screen w-full">
      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          aria-label="Close brochure form"
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-2xl font-bold focus:outline-none"
        >
          ×
        </button>
      </div>
      <div className="w-full max-w-2xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Download Brochure</h2>
        {/* Brochure form content goes here */}
        {/* You can move your form fields here, left-aligned, responsive */}
        {children}
      </div>
    </div>,
    typeof window !== 'undefined' ? document.body : (typeof global !== 'undefined' ? global : null)
  );
};

export { DownloadBrochureModal };
export default DownloadBrochureModal;