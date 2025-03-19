'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, ArrowRight, ThumbsUp, AlertTriangle, 
  Lock, Zap, CheckCircle, Users, User, Info, CheckCircle2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { apiUrls } from '@/apis';
import { useCurrency } from '@/contexts/CurrencyContext';
import { isFreePrice } from '@/utils/priceUtils';

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

// Success Modal Component
const SuccessModal = ({ isOpen, onClose, courseTitle, navigateToCourse }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center mx-auto justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-12 w-11/12 max-w-md">
        <div className="flex justify-center mb-6">
          <svg
            width="64"
            height="63"
            viewBox="0 0 64 63"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
          >
            <path
              d="M31.9992 58.4999C47.0766 58.4999 59.2992 46.2773 59.2992 31.1999C59.2992 16.1225 47.0766 3.8999 31.9992 3.8999C16.9218 3.8999 4.69922 16.1225 4.69922 31.1999C4.69922 46.2773 16.9218 58.4999 31.9992 58.4999Z"
              fill="#7ECA9D"
            />
            <path
              d="M45.7787 18.98L28.0987 36.66L20.8187 29.38L17.1787 33.02L28.0987 43.94L49.4187 22.62L45.7787 18.98Z"
              fill="white"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-4 text-center text-[#FFA927]">
          Payment Successful
        </h2>
        <p className="mb-4 text-center text-[#737373]">
          Thank You. Your enrollment for <span className="font-semibold">{courseTitle}</span> is confirmed.
        </p>
        <div className="flex justify-center">
          <button
            onClick={navigateToCourse}
            className="px-8 py-2 bg-[#7ECA9D] text-center text-white rounded-full hover:bg-green-500 transition-colors"
          >
            Go to My Courses
          </button>
        </div>
      </div>
    </div>
  );
};

const EnrollmentDetails = ({ 
  courseDetails = null,
  categoryInfo = {},
  onEnrollClick
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [enrollmentType, setEnrollmentType] = useState('individual');
  const [showBatchInfo, setShowBatchInfo] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const { convertPrice, formatPrice: formatCurrencyPrice, currencyCode, exchangeRate } = useCurrency();

  // Check login status on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check multiple possible auth storage keys
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const user = localStorage.getItem('user') || localStorage.getItem('userData');
      
      // Consider logged in if we have a token and either userId or user data
      const isUserLoggedIn = !!token && (!!userId || !!user);
      
      console.log("Auth check:", { token: !!token, userId: !!userId, user: !!user, isLoggedIn: isUserLoggedIn });
      
      setIsLoggedIn(isUserLoggedIn);
      setUserId(userId);

      // Try to parse user profile data
      if (user) {
        try {
          const userData = JSON.parse(user);
          setUserProfile(userData);
        } catch (e) {
          console.error("Failed to parse user data:", e);
        }
      }
    }
  }, []);

  // Extract data from courseDetails
  const duration = courseDetails?.course_duration || '4 months / 16 weeks';
  
  // Get active price information
  const activePricing = useMemo(() => {
    // Use the prices array from courseDetails or fallback to a default
    const prices = courseDetails?.prices || [
      {
        currency: 'USD',
        individual: 99,
        batch: 99,
        min_batch_size: 2,
        max_batch_size: 10,
        early_bird_discount: 0,
        group_discount: 0,
        is_active: true,
        _id: 'default'
      }
    ];
    
    // Find the active price or use the first one
    return prices.find(price => price.is_active) || prices[0];
  }, [courseDetails]);

  // Calculate final price including any applicable discounts
  const calculateFinalPrice = useCallback((basePrice, discountPercentage = 0) => {
    if (isFreePrice(basePrice)) return 0;
    
    // Apply discount if any
    if (discountPercentage > 0) {
      return basePrice - (basePrice * (discountPercentage / 100));
    }
    
    return basePrice;
  }, []);
  
  // Get the final price in the user's currency
  const getFinalPrice = useCallback(() => {
    const basePrice = enrollmentType === 'individual' 
      ? activePricing.individual 
      : activePricing.batch;
    
    const discountPercentage = enrollmentType === 'batch' 
      ? activePricing.group_discount 
      : activePricing.early_bird_discount || 0;
    
    const rawPrice = calculateFinalPrice(basePrice, discountPercentage);
    
    // Convert to user's currency
    return convertPrice(rawPrice);
  }, [enrollmentType, activePricing, calculateFinalPrice, convertPrice]);

  // Format price for display with proper currency symbol
  const formatPrice = useCallback((price, showCurrency = true) => {
    if (isFreePrice(price)) return "Free";
    return formatCurrencyPrice(price, showCurrency);
  }, [formatCurrencyPrice]);
  
  // Get primary color from category or default
  const primaryColor = categoryInfo?.primaryColor || 'primary';
  const colorClass = categoryInfo?.colorClass || `text-${primaryColor}-600 dark:text-${primaryColor}-400`;
  const bgClass = categoryInfo?.bgClass || `bg-${primaryColor}-50 dark:bg-${primaryColor}-900/20`;
  const borderClass = categoryInfo?.borderClass || `border-${primaryColor}-200 dark:border-${primaryColor}-800`;

  // Handle Razorpay script loading
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Determine the payment currency and conversion for Razorpay
  const getPaymentDetails = useCallback(() => {
    // Get the base price in the original currency
    const basePrice = enrollmentType === 'individual' 
      ? activePricing.individual 
      : activePricing.batch;
    
    // Apply any discounts
    const discountPercentage = enrollmentType === 'batch' 
      ? activePricing.group_discount 
      : activePricing.early_bird_discount || 0;
    
    const priceAfterDiscount = calculateFinalPrice(basePrice, discountPercentage);
    
    // Razorpay primarily works with INR, so convert if needed
    // For production, you should fetch real-time exchange rates from your backend
    const baseCurrency = activePricing.currency || 'USD';
    const inrConversionRate = {
      'USD': 84.47, // Example rate, should be updated with real-time rates
      'EUR': 90.21,
      'GBP': 106.35,
      'INR': 1,
      'AUD': 54.98
    }[baseCurrency] || 84.47;
    
    // Convert to INR for Razorpay (amount in paise)
    const amountInINR = Math.round(priceAfterDiscount * inrConversionRate * 100);
    
    return {
      originalPrice: priceAfterDiscount,
      originalCurrency: baseCurrency,
      paymentCurrency: 'INR',
      amountInINR: amountInINR,
      conversionRate: inrConversionRate,
      formattedOriginalPrice: formatPrice(priceAfterDiscount)
    };
  }, [enrollmentType, activePricing, calculateFinalPrice, formatPrice]);

  // Subscribe to course after successful payment
  const subscribeCourse = async (studentId, courseId, amount, paymentResponse = {}) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // First verify the payment status
      const verifyPaymentResponse = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          payment_id: paymentResponse.razorpay_payment_id,
          payment_signature: paymentResponse.razorpay_signature,
          payment_order_id: paymentResponse.razorpay_order_id
        })
      });

      if (!verifyPaymentResponse.ok) {
        throw new Error('Payment verification failed');
      }

      // Make API call to subscribe to the course
      const response = await fetch(apiUrls.enrollment.markCourseAsCompleted, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          student_id: studentId,
          course_id: courseId,
          amount: amount,
          payment_details: {
            payment_id: paymentResponse.razorpay_payment_id,
            payment_signature: paymentResponse.razorpay_signature,
            payment_order_id: paymentResponse.razorpay_order_id,
            payment_method: 'razorpay',
            currency: activePricing.currency || 'USD',
            amount: amount
          },
          enrollment_type: enrollmentType,
          status: 'success'
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Check if payment needs to be refunded
        if (response.status === 400 || response.status === 409) {
          // Initiate refund if subscription fails
          await initiateRefund(paymentResponse.razorpay_payment_id);
        }
        throw new Error(responseData.message || 'Unable to complete subscription');
      }

      // Call enrollCourse API after successful subscription
      await enrollCourse(studentId, courseId);
      
      return responseData;
    } catch (error) {
      console.error("Error in subscribing course:", error);
      // Show more specific error message to user
      const errorMessage = error.message === 'Payment verification failed' 
        ? "Payment verification failed. Please contact support."
        : "Unable to complete enrollment. Please try again.";
      
      toast.error(errorMessage);
      throw error;
    }
  };

  // Initiate refund if subscription fails
  const initiateRefund = async (paymentId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !paymentId) return;

      const response = await fetch('/api/refund-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          payment_id: paymentId
        })
      });

      if (!response.ok) {
        console.error('Refund initiation failed');
        toast.error('Unable to process refund automatically. Our team will contact you.');
      } else {
        toast.success('Payment will be refunded to your account.');
      }
    } catch (error) {
      console.error('Refund error:', error);
    }
  };

  // Enroll in course after successful subscription
  const enrollCourse = async (studentId, courseId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Determine the correct API endpoint based on enrollment type
      const enrollmentEndpoint = enrollmentType === 'individual' 
        ? apiUrls.Students.createStudent
        : apiUrls.corporateStudent.createCorporateStudent;

      // Make API call to enroll in the course
      const response = await fetch(enrollmentEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          student_id: studentId,
          course_id: courseId,
          enrollment_type: enrollmentType,
          batch_size: enrollmentType === 'batch' ? activePricing.min_batch_size : 1,
          payment_status: 'completed',
          enrollment_date: new Date().toISOString(),
          course_progress: 0,
          status: 'active'
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Unable to complete enrollment');
      }

      // Track enrollment progress
      await trackEnrollmentProgress(studentId, courseId);

      setIsSuccessModalOpen(true);
      toast.success("Successfully enrolled in the course!");
      
      return responseData;
    } catch (error) {
      console.error("Error enrolling course:", error);
      toast.error(error.message || "Error enrolling in the course. Please try again!");
      throw error;
    }
  };

  // Track enrollment progress
  const trackEnrollmentProgress = async (studentId, courseId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Get the appropriate progress tracking endpoint
      const progressEndpoint = enrollmentType === 'individual'
        ? apiUrls.enrollment.getStudentCourseProgress(studentId, courseId)
        : apiUrls.corporateStudent.getCorporateStudentProgress(studentId, courseId);

      await fetch(progressEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error("Error tracking progress:", error);
      // Don't throw error as this is not critical
    }
  };

  // Check if user is already enrolled
  const checkEnrollmentStatus = async (studentId, courseId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !studentId || !courseId) return false;

      // Get enrollments based on enrollment type
      const enrollmentsEndpoint = enrollmentType === 'individual'
        ? apiUrls.enrollment.getEnrolledCourseByStudentId(studentId)
        : apiUrls.corporateStudent.getCorporateStudentEnrollments(studentId);

      const response = await fetch(enrollmentsEndpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) return false;

      const enrollments = await response.json();
      return enrollments.some(enrollment => enrollment.course_id === courseId);
    } catch (error) {
      console.error("Error checking enrollment status:", error);
      return false;
    }
  };

  // Get upcoming meetings for enrolled student
  const getUpcomingMeetings = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !studentId) return [];

      const response = await fetch(
        apiUrls.enrollment.getUpcomingMeetingsForStudent(studentId),
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) return [];

      const meetings = await response.json();
      return meetings;
    } catch (error) {
      console.error("Error fetching upcoming meetings:", error);
      return [];
    }
  };

  // Handle enrollment click with additional checks
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
        router.push(`/login?redirect=/courses/${courseDetails?._id}`);
        return;
      }

      // Check if already enrolled
      const isEnrolled = await checkEnrollmentStatus(userId, courseDetails._id);
      if (isEnrolled) {
        toast.info("You are already enrolled in this course!");
        router.push('/dashboards/my-courses');
        return;
      }
      
      // Create enrollment data with selected type
      const enrollmentData = {
        ...courseDetails,
        enrollmentType,
        priceId: activePricing._id,
        finalPrice: getFinalPrice(),
        currencyCode: currencyCode
      };
      
      // If onEnrollClick prop is provided, use that
      if (onEnrollClick) {
        await onEnrollClick(enrollmentData);
      } else {
        // If course is free, directly enroll
        if (isFreePrice(getFinalPrice())) {
          await enrollCourse(userId, courseDetails._id);
        } else {
          // Otherwise process payment via Razorpay
          await handleRazorpayPayment();
        }
      }

      // Fetch upcoming meetings after successful enrollment
      const meetings = await getUpcomingMeetings(userId);
      if (meetings.length > 0) {
        // You could store these in state or context if needed
        console.log("Upcoming meetings:", meetings);
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      setError(err.message || "Failed to process enrollment");
      toast.error("Enrollment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [courseDetails, isLoggedIn, router, onEnrollClick, enrollmentType, activePricing, userId, getFinalPrice, currencyCode]);

  // Handle enrollment through Razorpay
  const handleRazorpayPayment = async () => {
    if (!courseDetails?._id) {
      toast.error("Course information is missing");
      return;
    }

    try {
      setLoading(true);
      
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Payment system failed to load. Please try again.");
        return;
      }

      // Get payment details with proper currency conversion
      const paymentDetails = getPaymentDetails();
      
      // Get user info from profile if available
      const userEmail = userProfile?.email || "student@medh.com";
      const userName = userProfile?.full_name || userProfile?.name || "Medh Student";
      const userPhone = userProfile?.phone_number || userProfile?.mobile || "9876543210";

      // Configure Razorpay options
      const options = {
        key: "rzp_test_Rz8NSLJbl4LBA5", // Replace with your actual key in production
        amount: paymentDetails.amountInINR, // Amount in paise
        currency: paymentDetails.paymentCurrency,
        name: courseDetails?.course_title || "Course Enrollment",
        description: `Payment for ${courseDetails?.course_title || "Course"} (${enrollmentType} enrollment)`,
        image: "https://medh.education/path-to-your-logo.png", // Replace with your actual logo URL
        handler: async function (response) {
          toast.success("Payment Successful!");
          
          // Call subscription API after successful payment
          await subscribeCourse(
            userId, 
            courseDetails._id, 
            paymentDetails.originalPrice, 
            response
          );
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone,
        },
        notes: {
          enrollment_type: enrollmentType,
          course_id: courseDetails._id,
          price_id: activePricing._id,
          user_id: userId,
          original_currency: paymentDetails.originalCurrency,
          original_amount: paymentDetails.originalPrice,
          conversion_rate: paymentDetails.conversionRate
        },
        theme: {
          color: "#7ECA9D",
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      // Create Razorpay instance and open payment modal
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Enrollment error:", err);
      setError(err.message || "Failed to process enrollment");
      toast.error("Enrollment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to my courses page after successful enrollment
  const navigateToCourses = () => {
    setIsSuccessModalOpen(false);
    router.push('/dashboards/my-courses');
  };

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

  // Calculate any discount percentage to display
  const discountPercentage = enrollmentType === 'batch' 
    ? activePricing.group_discount
    : activePricing.early_bird_discount;

  // Get the final price for display
  const finalPrice = getFinalPrice();
  
  // Determine original price (before discount) if applicable
  const originalPrice = discountPercentage > 0 
    ? convertPrice(enrollmentType === 'individual' ? activePricing.individual : activePricing.batch)
    : null;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className={`px-4 py-3 ${bgClass} border-b ${borderClass}`}>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Enrollment Options
          </h3>
        </div>
        
        <div className="p-4 space-y-5">
          {/* Enrollment Type Selection */}
          <div className="flex w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setEnrollmentType('individual')}
              className={`flex-1 py-3 px-2 flex flex-col items-center justify-center transition ${
                enrollmentType === 'individual' 
                  ? `${bgClass} ${colorClass} font-medium` 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <User className={`h-5 w-5 mb-1 ${enrollmentType === 'individual' ? colorClass : ''}`} />
              <span className="text-sm">Individual</span>
            </button>
            <button
              onClick={() => setEnrollmentType('batch')}
              className={`flex-1 py-3 px-2 flex flex-col items-center justify-center transition ${
                enrollmentType === 'batch' 
                  ? `${bgClass} ${colorClass} font-medium` 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Users className={`h-5 w-5 mb-1 ${enrollmentType === 'batch' ? colorClass : ''}`} />
              <span className="text-sm">Batch/Group</span>
            </button>
          </div>
          
          {/* Course Price */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={enrollmentType}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start justify-between"
            >
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {enrollmentType === 'individual' ? 'Individual Price' : 'Batch Price (per person)'}
                </p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(finalPrice)}
                  </h4>
                  
                  {originalPrice && originalPrice > finalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                  
                  {discountPercentage > 0 && (
                    <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                      -{discountPercentage}%
                    </span>
                  )}
                </div>
              </div>
              <div className={`p-2.5 rounded-full ${bgClass}`}>
                <CreditCard className={`h-6 w-6 ${colorClass}`} />
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Course Details List */}
          <div className="space-y-2.5 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Duration</span>
              <span className="font-medium text-gray-900 dark:text-white">{duration}</span>
            </div>
            
            {/* {enrollmentType === 'batch' && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Batch Size</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {activePricing.min_batch_size} - {activePricing.max_batch_size} people
                </span>
              </div>
            )} */}
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
                    {enrollmentType === 'individual' ? 'Enroll Now' : 'Enroll in Batch'} <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Login to Enroll <Lock className="w-4 h-4 ml-2" />
                  </>
                )}
              </>
            )}
          </motion.button>
          
          {/* Payment info */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            Secure payment powered by Razorpay. Price shown in your local currency.
          </div>
          
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

      {/* Success Modal */}
      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        courseTitle={courseDetails?.course_title || 'this course'}
        navigateToCourse={navigateToCourses}
      />
    </>
  );
};

export default EnrollmentDetails; 