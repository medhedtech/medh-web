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
import { isFreePrice, getCoursePriceValue, getMinBatchSize } from '@/utils/priceUtils';
import axios from 'axios';
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import useRazorpay from "@/hooks/useRazorpay";
import RAZORPAY_CONFIG from "@/config/razorpay";

// Types
interface CoursePrice {
  currency: string;
  individual: number;
  batch: number;
  min_batch_size: number;
  max_batch_size: number;
  early_bird_discount: number;
  group_discount: number;
  is_active: boolean;
  _id: string;
}

interface CourseDetails {
  _id: string;
  course_title: string;
  course_duration?: string;
  grade?: string;
  features?: string[];
  prices?: CoursePrice[];
  course_category?: string;
  course_description?: string;
  course_fee?: number;
  curriculum?: any[];
  meta?: {
    views: number;
  };
  classType?: string;
}

interface CategoryInfo {
  primaryColor?: string;
  colorClass?: string;
  bgClass?: string;
  borderClass?: string;
}

interface ErrorFallbackProps {
  error: string | null;
  resetErrorBoundary: () => void;
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  navigateToCourse: () => void;
}

interface EnrollmentDetailsProps {
  courseDetails: CourseDetails | null;
  categoryInfo?: CategoryInfo;
  onEnrollClick?: (enrollmentData: any) => Promise<void>;
}

interface UserProfile {
  email?: string;
  full_name?: string;
  name?: string;
  phone_number?: string;
  mobile?: string;
}

interface PaymentDetails {
  originalPrice: number;
  originalCurrency: string;
  paymentCurrency: string;
  amountInINR: number;
  conversionRate: number;
  formattedOriginalPrice: string;
}

type EnrollmentType = 'individual' | 'batch';

// Error Boundary Component
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
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
const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, courseTitle, navigateToCourse }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center mx-auto justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-12 w-11/12 max-w-md">
        <div className="flex justify-center mb-6">
          <svg
            width="64px"
            height="64px"
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

const EnrollmentDetails: React.FC<EnrollmentDetailsProps> = ({ 
  courseDetails = null,
  categoryInfo = {},
  onEnrollClick
}) => {
  const router = useRouter();
  const { convertPrice, formatPrice, currency } = useCurrency();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const isBlendedCourse = courseDetails?.classType === 'Blended Courses';
  const [enrollmentType, setEnrollmentType] = useState<EnrollmentType>(isBlendedCourse ? 'individual' : 'batch');
  const [showBatchInfo, setShowBatchInfo] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [minStudentsRequired, setMinStudentsRequired] = useState<number>(0);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    originalPrice: 0,
    originalCurrency: 'USD',
    paymentCurrency: 'INR',
    amountInINR: 0,
    conversionRate: 1,
    formattedOriginalPrice: '0'
  });
  const { getQuery } = useGetQuery();
  const { postQuery, loading: postLoading } = usePostQuery();
  const { 
    loadRazorpayScript, 
    openRazorpayCheckout, 
    isScriptLoaded, 
    isLoading: razorpayLoading, 
    error: razorpayError 
  } = useRazorpay();

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
      
      // Set loading to false after checking authentication
      setIsLoading(false);
    }
  }, []);

  // Extract data from courseDetails
  const duration = courseDetails?.course_duration || '4 months / 16 weeks';
  
  // Get active price information
  const getActivePrice = useCallback((): CoursePrice | null => {
    const prices = courseDetails?.prices;
    console.log('Course Details:', courseDetails);
    console.log('Course Prices:', prices);
    console.log('Current Currency:', currency.code);
    
    if (!prices || prices.length === 0) {
      console.log('No prices found');
      return null;
    }

    // First try to find a price matching the user's preferred currency
    const preferredPrice = prices.find(price => 
      price.is_active && price.currency === currency.code
    );
    console.log('Preferred Price:', preferredPrice);

    // If no matching currency found, try to find any active price
    const activePrice = prices.find(price => price.is_active);
    console.log('Active Price:', activePrice);

    // If still no price found, use the first price
    const finalPrice = preferredPrice || activePrice || prices[0] || null;
    console.log('Final Selected Price:', finalPrice);
    return finalPrice;
  }, [courseDetails, currency.code]);

  // State for active pricing
  const [activePricing, setActivePricing] = useState<CoursePrice | null>(null);

  // Update activePricing when course details or currency changes
  useEffect(() => {
    const price = getActivePrice();
    console.log('Setting Active Pricing:', price);
    setActivePricing(price);
  }, [courseDetails, currency.code, getActivePrice]);

  // Calculate final price including any applicable discounts
  const calculateFinalPrice = useCallback((price: number | undefined, discount: number | undefined): number => {
    if (!price) {
      console.log('No price provided for calculation');
      return 0;
    }
    const safeDiscount = discount || 0;
    const finalPrice = price - (price * safeDiscount / 100);
    console.log('Calculated Final Price:', { price, discount: safeDiscount, finalPrice });
    return finalPrice;
  }, []);
  
  // Get the final price in the user's currency
  const getFinalPrice = useCallback((): number => {
    if (!activePricing) {
      console.log('No active pricing found for final price calculation');
      return 0;
    }
    
    const basePrice = enrollmentType === 'individual' 
      ? activePricing.individual
      : activePricing.batch;
    
    console.log('Base Price:', { enrollmentType, basePrice });
    
    const discountPercentage = enrollmentType === 'batch' 
      ? activePricing.group_discount
      : activePricing.early_bird_discount;
    
    console.log('Discount Percentage:', discountPercentage);
    
    const finalPrice = calculateFinalPrice(basePrice, discountPercentage);
    console.log('Final Price Calculation:', {
      enrollmentType,
      basePrice,
      discountPercentage,
      finalPrice
    });
    return finalPrice;
  }, [activePricing, enrollmentType, calculateFinalPrice]);

  // Format price for display with proper currency symbol
  const formatPriceDisplay = useCallback((price: number, showCurrency: boolean = true): string => {
    console.log('Formatting Price:', { price, showCurrency });
    if (!price || price <= 0) {
      console.log('Price is free or invalid');
      return "Free";
    }
    
    // Use the context's currency formatting if available
    if (formatPrice) {
      return formatPrice(convertPrice(price), showCurrency);
    }
    
    // Fallback to Intl formatting
    const formattedPrice = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency?.code || 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
    console.log('Formatted Price:', formattedPrice);
    return formattedPrice;
  }, [currency, formatPrice, convertPrice]);
  
  // Get primary color from category or default
  const primaryColor = categoryInfo?.primaryColor || 'primary';
  const colorClass = categoryInfo?.colorClass || `text-${primaryColor}-600 dark:text-${primaryColor}-400`;
  const bgClass = categoryInfo?.bgClass || `bg-${primaryColor}-50 dark:bg-${primaryColor}-900/20`;
  const borderClass = categoryInfo?.borderClass || `border-${primaryColor}-200 dark:border-${primaryColor}-800`;

  // Determine the payment currency and conversion for Razorpay
  const getPaymentDetails = useCallback((): PaymentDetails => {
    if (!activePricing) {
      return {
        originalPrice: 0,
        originalCurrency: 'USD',
        paymentCurrency: 'INR',
        amountInINR: 0,
        conversionRate: 1,
        formattedOriginalPrice: '0'
      };
    }

    // Get the base price in the original currency
    const basePrice = enrollmentType === 'individual' 
      ? activePricing.individual
      : activePricing.batch;
    
    // Apply any discounts
    const discountPercentage = enrollmentType === 'batch' 
      ? activePricing.group_discount
      : activePricing.early_bird_discount;
    
    const priceAfterDiscount = calculateFinalPrice(basePrice, discountPercentage);
    
    // Razorpay primarily works with INR, so convert if needed
    const baseCurrency = activePricing.currency;
    const inrConversionRate = {
      'USD': 84.47,
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
      formattedOriginalPrice: formatPriceDisplay(priceAfterDiscount)
    };
  }, [enrollmentType, activePricing, calculateFinalPrice, formatPriceDisplay]);

  // Enroll in course after successful payment
  const enrollCourse = async (studentId: string, courseId: string, paymentResponse: any = {}): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!activePricing) {
        throw new Error('No active pricing found');
      }

      // Use postQuery to call the enrolled courses API
      const response = await postQuery({
        url: apiUrls?.enrolledCourses?.createEnrolledCourse,
        postData: {
          student_id: studentId,
          course_id: courseId,
          enrollment_type: enrollmentType,
          batch_size: enrollmentType === 'batch' ? activePricing.min_batch_size : 1,
          payment_status: 'completed',
          enrollment_date: new Date().toISOString(),
          course_progress: 0,
          status: 'active',
          // Include payment details if provided
          payment_details: paymentResponse ? {
            payment_id: paymentResponse.razorpay_payment_id || '',
            payment_signature: paymentResponse.razorpay_signature || '',
            payment_order_id: paymentResponse.razorpay_order_id || '',
            payment_method: 'razorpay',
            amount: getFinalPrice(),
            currency: currency.code,
            payment_date: new Date().toISOString()
          } : null
        }
      });

      // Track enrollment progress
      await trackEnrollmentProgress(studentId, courseId);

      setIsSuccessModalOpen(true);
      console.log("Student enrolled successfully!");
      
      return response;
    } catch (error: any) {
      console.error("Error enrolling course:", error);
      toast.error(error.message || "Error enrolling in the course. Please try again!");
      throw error;
    }
  };

  // Track enrollment progress
  const trackEnrollmentProgress = async (studentId: string, courseId: string): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Use getQuery for tracking progress
      const progressEndpoint = enrollmentType === 'individual'
        ? `/api/students/enrollments/progress/${studentId}/${courseId}`
        : `/api/corporate/enrollments/progress/${studentId}/${courseId}`;

      await getQuery({
        url: progressEndpoint,
        onSuccess: (data) => {
          console.log("Progress tracking successful:", data);
        },
        onFail: (error) => {
          console.error("Error tracking progress:", error);
        }
      });
    } catch (error) {
      console.error("Error tracking progress:", error);
      // Don't throw error as this is not critical
    }
  };

  // Check if user is already enrolled
  const checkEnrollmentStatus = async (studentId: string, courseId: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !studentId || !courseId) return false;

      // Use getQuery for checking enrollment
      const endpoint = enrollmentType === 'individual'
        ? `/enroll-courses/student/${studentId}`
        : `/enroll-courses/corporate/${studentId}`;

      let isEnrolled = false;
      
      await getQuery({
        url: endpoint,
        onSuccess: (data) => {
          isEnrolled = Array.isArray(data) && data.some(enrollment => enrollment.course_id === courseId);
        },
        onFail: (error) => {
          console.error("Error checking enrollment status:", error);
        }
      });

      return isEnrolled;
    } catch (error) {
      console.error("Error checking enrollment status:", error);
      return false;
    }
  };

  // Get upcoming meetings for enrolled student
  const getUpcomingMeetings = async (studentId: string): Promise<any[]> => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !studentId) return [];

      // Use getQuery for upcoming meetings
      const endpoint = `/enroll/get-upcoming-meetings/${studentId}`;
      let meetings: any[] = [];
      
      await getQuery({
        url: endpoint,
        onSuccess: (data) => {
          meetings = data || [];
        },
        onFail: (error) => {
          console.error("Error fetching upcoming meetings:", error);
        }
      });

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

    if (!activePricing) {
      toast.error("Pricing information is missing");
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
      if (userId) {
        const isEnrolled = await checkEnrollmentStatus(userId, courseDetails._id);
        if (isEnrolled) {
          toast.error("You are already enrolled in this course!");
          router.push('/dashboards/my-courses');
          return;
        }
      }
      
      // Create enrollment data with selected type
      const enrollmentData = {
        ...courseDetails,
        enrollmentType,
        priceId: activePricing._id,
        finalPrice: getFinalPrice(),
        currencyCode: currency.code
      };
      
      // If onEnrollClick prop is provided, use that
      if (onEnrollClick) {
        await onEnrollClick(enrollmentData);
      } else {
        // If course is free, directly enroll
        if (isFreePrice(getFinalPrice())) {
          if (userId) {
            await enrollCourse(userId, courseDetails._id);
          }
        } else {
          // Otherwise process payment via Razorpay
          await handleRazorpayPayment();
        }
      }

      // Fetch upcoming meetings after successful enrollment
      if (userId) {
        const meetings = await getUpcomingMeetings(userId);
        if (meetings.length > 0) {
          // You could store these in state or context if needed
          console.log("Upcoming meetings:", meetings);
        }
      }
    } catch (err: any) {
      console.error("Enrollment error:", err);
      setError(err.message || "Failed to process enrollment");
      toast.error("Enrollment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [courseDetails, isLoggedIn, router, onEnrollClick, enrollmentType, activePricing, userId, getFinalPrice, currency.code]);

  // Handle enrollment through Razorpay
  const handleRazorpayPayment = async (): Promise<void> => {
    if (!courseDetails?._id) {
      toast.error("Course information is missing");
      return;
    }

    try {
      setLoading(true);
      
      // Get payment details with proper currency conversion
      const paymentDetails = getPaymentDetails();
      
      // Get user info from profile if available
      const userEmail = userProfile?.email || RAZORPAY_CONFIG.prefill.email;
      const userName = userProfile?.full_name || userProfile?.name || RAZORPAY_CONFIG.prefill.name;
      const userPhone = userProfile?.phone_number || userProfile?.mobile || RAZORPAY_CONFIG.prefill.contact;

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || RAZORPAY_CONFIG.key,
        amount: paymentDetails.amountInINR,
        currency: paymentDetails.paymentCurrency,
        name: courseDetails?.course_title || "Course Enrollment",
        description: `Payment for ${courseDetails?.course_title || "Course"} (${enrollmentType} enrollment)`,
        image: "/images/logo.png", // Use local image path instead of external URL
        handler: async function (response: any) {
          toast.success("Payment Successful!");
          
          // Call enrollment API directly with payment details
          if (userId) {
            await enrollCourse(
              userId, 
              courseDetails._id, 
              response
            );
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone,
        },
        notes: {
          enrollment_type: enrollmentType,
          course_id: courseDetails._id,
          price_id: activePricing?._id || '',
          user_id: userId,
          original_currency: paymentDetails.originalCurrency,
          original_amount: paymentDetails.originalPrice,
          conversion_rate: paymentDetails.conversionRate
        },
        theme: {
          color: RAZORPAY_CONFIG.theme.color,
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      // Use the hook to handle Razorpay checkout
      const razorpayOptions = {
        ...options,
        notes: {
          enrollment_type: options.notes.enrollment_type,
          course_id: options.notes.course_id,
          price_id: activePricing?._id || '',
          user_id: options.notes.user_id || '',
          original_currency: options.notes.original_currency,
          original_amount: options.notes.original_amount.toString(),
          conversion_rate: options.notes.conversion_rate.toString()
        }
      };
      await openRazorpayCheckout(razorpayOptions);
    } catch (err: any) {
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
  const discountPercentage = activePricing ? (enrollmentType === 'batch' 
    ? activePricing.group_discount
    : activePricing.early_bird_discount) : 0;

  // Get the final price for display
  const finalPrice = getFinalPrice();
  console.log('Final Price for Display:', finalPrice);
  
  // Determine original price (before discount) if applicable
  const originalPrice = activePricing && discountPercentage > 0 
    ? convertPrice(enrollmentType === 'individual' 
      ? activePricing.individual
      : activePricing.batch)
    : null;

  useEffect(() => {
    if (courseDetails && !isLoading) {
      // Get pricing information using the utility functions
      const individualPrice = getCoursePriceValue(courseDetails, false);
      const batchPrice = getCoursePriceValue(courseDetails, true);
      const minBatchSize = getMinBatchSize(courseDetails);
      
      // Set prices with current currency conversion
      setPaymentDetails(prevDetails => ({
        originalPrice: enrollmentType === 'batch' ? batchPrice : individualPrice,
        originalCurrency: 'USD', // Assuming USD as base currency
        paymentCurrency: currency.code,
        amountInINR: convertPrice(enrollmentType === 'batch' ? batchPrice : individualPrice, 'INR'),
        conversionRate: 1, // This will be updated by the API
        formattedOriginalPrice: formatPriceDisplay(
          convertPrice(enrollmentType === 'batch' ? batchPrice : individualPrice)
        )
      }));
      
      // Also update batch size
      setMinStudentsRequired(minBatchSize);
    }
  }, [courseDetails, enrollmentType, currency.code, isLoading, convertPrice, formatPriceDisplay]);

  // Update enrollment type if course type changes
  useEffect(() => {
    if (isBlendedCourse && enrollmentType === 'batch') {
      setEnrollmentType('individual');
    }
  }, [isBlendedCourse, enrollmentType]);

  // Ensure batch pricing is disabled for blended courses
  useEffect(() => {
    if (isBlendedCourse) {
      setEnrollmentType('individual');
    }
  }, [isBlendedCourse]);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className={`px-4 py-3 ${bgClass} border-b ${borderClass}`}>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Enrollment Options
          </h3>
        </div>
        
        <div className="p-4 space-y-5">
          {/* Enrollment Type Selection - Hide for blended courses */}
          {!isBlendedCourse && (
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
          )}
          
          {/* Show enrollment type label for blended courses */}
          {isBlendedCourse && (
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <Info className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-sm">This blended learning course is available for individual enrollment only</span>
              </div>
            </div>
          )}
          
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
                  {isBlendedCourse ? 'Individual Price' : (enrollmentType === 'individual' ? 'Individual Price' : 'Batch Price (per person)')}
                </p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatPriceDisplay(finalPrice)}
                  </h4>
                  
                  {originalPrice && originalPrice > finalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPriceDisplay(originalPrice)}
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
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Grade</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {courseDetails?.grade}
              </span>
            </div>
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
                    {isBlendedCourse ? 'Enroll Now' : (enrollmentType === 'individual' ? 'Enroll Now' : 'Enroll in Batch')} <ArrowRight className="w-4 h-4 ml-2" />
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