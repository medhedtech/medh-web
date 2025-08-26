import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Download, ArrowRight, Mail, CheckCircle, AlertCircle, ArrowLeft, User, Phone } from "lucide-react";
import { apiBaseUrl, apiUrls } from "@/apis";
import { brochureAPI } from '@/apis/broucher';
import useAuth from "@/hooks/useAuth";
import toast from 'react-hot-toast';
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    agreedToTerms: false
  });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (!isOpen) return;
    
    // Check authentication status
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const user = localStorage.getItem('user') || localStorage.getItem('userData');
      
      const isUserLoggedIn = !!token && (!!userId || !!user);
      setIsLoggedIn(isUserLoggedIn);

      // If user is logged in, try to open brochure directly
      if (isUserLoggedIn && course?.brochures && course.brochures.length > 0) {
        handleDirectDownload();
        return;
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, course]);

  const handleDirectDownload = async () => {
    if (!courseId && !course?._id) {
      toast.error('Course information not available');
      return;
    }

    const targetCourseId = courseId || course?._id;
    
    try {
      setIsSubmitting(true);
      
      // Try direct download with course brochures first (fastest method)
      if (course?.brochures && course.brochures.length > 0) {
        const brochureUrl = course.brochures[0];
        window.open(brochureUrl, '_blank', 'noopener,noreferrer');
        toast.success('Brochure opened in new tab!');
        onClose();
        return;
      }

      // Fallback to API call if no direct brochure URL available
      const response = await brochureAPI.downloadBrochure(targetCourseId);
      
      if (response.data?.brochureUrl) {
        // Open the brochure PDF in a new tab
        window.open(response.data.brochureUrl, '_blank', 'noopener,noreferrer');
        toast.success('Brochure opened in new tab!');
        onClose();
      } else {
        throw new Error('Brochure URL not received');
      }
    } catch (error: any) {
      console.error('Direct download failed:', error);
      
      // Final fallback - show the form for email delivery
      toast.error('Unable to open brochure directly. Please use the form to receive it via email.');
      setIsLoggedIn(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'Please agree to receive communications';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Use direct fetch for non-authenticated requests to avoid auth headers
      const requestData = {
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phoneNumber.startsWith('+') ? formData.phoneNumber : '+91' + formData.phoneNumber,
        course_title: courseTitle || course?.course_title || '',
        course_id: courseId || course?._id
      };
      
      // Use direct backend URL with explicit CORS settings to avoid any middleware
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api/v1';
      const response = await fetch(`${backendUrl}/broucher/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit', // Explicitly omit credentials to avoid auth issues
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        // Handle different error status codes
        if (response.status === 401) {
          throw new Error('Authentication required. Please try logging in first.');
        } else if (response.status === 404) {
          throw new Error('Course not found. Please check the course details.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }
      }

      const data = await response.json();
      
      if (data.success) {
        setIsSubmitted(true);
        toast.success('Brochure will be sent to your email shortly!');
      } else {
        throw new Error(data.message || 'Failed to send brochure');
      }
    } catch (error: any) {
      console.error('Failed to send brochure:', error);
      const errorMessage = error.message || 'Failed to send brochure. Please try again.';
      toast.error(errorMessage);
      
      // Prevent any automatic redirects by stopping event propagation
      if (typeof window !== 'undefined') {
        // Override any global error handlers that might redirect
        window.addEventListener('unhandledrejection', (e) => {
          if (e.reason?.message?.includes('401') || e.reason?.message?.includes('Unauthorized')) {
            e.preventDefault();
          }
        }, { once: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Download Brochure</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Please fill in your details below to receive the brochure for this course via email.
        </p>
        
        {courseTitle && (
          <div className="mb-4 text-base font-semibold text-primary-700 dark:text-primary-300">
            {courseTitle}
          </div>
        )}
        
        {isSubmitted ? (
          <div className="flex flex-col items-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Brochure Sent!</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
              We've sent the brochure to <span className="font-semibold">{formData.email}</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 text-sm border ${
                    errors.fullName ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && <span className="text-xs text-red-500 mt-1">{errors.fullName}</span>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 text-sm border ${
                    errors.email ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email}</span>}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-lg text-sm text-gray-700 dark:text-gray-300 select-none">
                  +91
                </span>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 text-sm border-l-0 border ${
                      errors.phoneNumber ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                    } rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200`}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              {errors.phoneNumber && <span className="text-xs text-red-500 mt-1">{errors.phoneNumber}</span>}
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="agreedToTerms"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
              />
              <label htmlFor="agreedToTerms" className="text-xs text-gray-700 dark:text-gray-300">
                I agree to receive the brochure and communications from Medh
              </label>
            </div>
            {errors.agreedToTerms && <span className="text-xs text-red-500">{errors.agreedToTerms}</span>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg font-semibold text-base transition-all duration-300 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Get Brochure'}
            </button>
          </form>
        )}
      </div>
    </div>,
    typeof window !== 'undefined' ? document.body : (typeof global !== 'undefined' ? global : null)
  );
};

export { DownloadBrochureModal };
export default DownloadBrochureModal;