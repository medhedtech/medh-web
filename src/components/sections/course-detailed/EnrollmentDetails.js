'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, ArrowRight, ThumbsUp, AlertTriangle, 
  Lock, Zap, CheckCircle 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// Error Boundary Component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl text-center">
    <div className="flex justify-center mb-4">
      <AlertTriangle className="h-12 w-12 text-red-500" />
    </div>
    <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-3">
      Enrollment Error
    </h2>
    <p className="text-gray-700 dark:text-gray-300 mb-4">
      {error || "We couldn't process your enrollment. Please try again."}
    </p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
    >
      Try Again
    </button>
  </div>
);

const EnrollmentDetails = ({ 
  courseDetails = null,
  categoryInfo = {},
  onEnrollClick
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(typeof window !== 'undefined' && !!localStorage.getItem('user'));

  // Extract data from courseDetails
  const courseFee = courseDetails?.course_fee || 390;
  const duration = courseDetails?.course_duration || '4 months / 16 weeks';
  const batchSize = courseDetails?.batchSize || 'Small groups';
  const startDate = courseDetails?.start_date || 'Flexible';
  
  // Get primary color from category or default
  const primaryColor = categoryInfo?.primaryColor || 'primary';
  const colorClass = categoryInfo?.colorClass || `text-${primaryColor}-600 dark:text-${primaryColor}-400`;
  const bgClass = categoryInfo?.bgClass || `bg-${primaryColor}-50 dark:bg-${primaryColor}-900/20`;
  const borderClass = categoryInfo?.borderClass || `border-${primaryColor}-200 dark:border-${primaryColor}-800`;

  // Handle enrollment click
  const handleEnrollClick = useCallback(async () => {
    if (!courseDetails?._id) {
      toast.error("Course information is missing");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is logged in
      if (!isLoggedIn) {
        router.push(`/login?redirect=/enrollment/${courseDetails?._id}`);
        return;
      }
      
      // If onEnrollClick prop is provided, use that
      if (onEnrollClick) {
        await onEnrollClick(courseDetails);
      } else {
        // Otherwise redirect to the enrollment page for this course
        router.push(`/checkout/${courseDetails._id}`);
      }
      
      toast.success("Proceeding to enrollment");
    } catch (err) {
      console.error("Enrollment error:", err);
      setError(err.message || "Failed to process enrollment");
      toast.error("Enrollment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [courseDetails, isLoggedIn, router, onEnrollClick]);

  // Handle course features
  const courseFeatures = useMemo(() => {
    const defaultFeatures = [
      "Live interactive sessions",
      "Certificate of completion",
      "Lifetime access to recordings",
      "Hands-on projects & assignments"
    ];
    
    return courseDetails?.features || defaultFeatures;
  }, [courseDetails]);
  
  // If there's an error, show error fallback
  if (error) {
    return (
      <ErrorFallback 
        error={error} 
        resetErrorBoundary={() => setError(null)} 
      />
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className={`px-4 py-3 ${bgClass} border-b ${borderClass}`}>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Enrollment Details
        </h3>
      </div>
      
      <div className="p-4 space-y-5">
        {/* Course Price */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Course Fee</p>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
              {typeof courseFee === 'number' 
                ? `₹${courseFee.toLocaleString()}` 
                : courseFee || 'Free'}
            </h4>
          </div>
          <div className={`p-2.5 rounded-full ${bgClass}`}>
            <CreditCard className={`h-6 w-6 ${colorClass}`} />
          </div>
        </div>
        
        {/* Course Details List */}
        <div className="space-y-2.5 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400 text-sm">Duration</span>
            <span className="font-medium text-gray-900 dark:text-white">{duration}</span>
          </div>
          {/* <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400 text-sm">Batch Size</span>
            <span className="font-medium text-gray-900 dark:text-white">{batchSize}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400 text-sm">Start Date</span>
            <span className="font-medium text-gray-900 dark:text-white">{startDate}</span>
          </div> */}
        </div>
        
        {/* Course Features */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
            <ThumbsUp className="w-4 h-4 mr-2 text-green-500" />
            What you'll get
          </h4>
          <ul className="space-y-2">
            {courseFeatures.map((feature, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center text-gray-600 dark:text-gray-300"
              >
                <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </motion.li>
            ))}
          </ul>
        </div>
        
        {/* Enroll Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleEnrollClick}
          disabled={loading}
          className={`w-full py-3 px-4 bg-gradient-to-r from-${primaryColor}-600 to-${primaryColor}-700 hover:from-${primaryColor}-700 hover:to-${primaryColor}-800 text-white font-medium rounded-lg flex items-center justify-center shadow-sm transition-all duration-300 ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            <>
              {isLoggedIn ? (
                <>
                  Enroll Now <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Login to Enroll <Lock className="w-4 h-4 ml-2" />
                </>
              )}
            </>
          )}
        </motion.button>
        
        {/* Fast Track Option */}
        <motion.div
          className="border-t border-gray-200 dark:border-gray-700 pt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 text-amber-700 dark:text-amber-300 text-xs font-medium">
            <Zap className="w-3 h-3 mr-1" />
            Fast Track Available
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Fast-track options available for experienced learners.
            Contact support for details.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default EnrollmentDetails; 