'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, ArrowRight, ThumbsUp, AlertTriangle, 
  Lock, Zap, CheckCircle, Users, User, Info, CheckCircle2, Clock, GraduationCap,
  CalendarClock, Calculator, ChevronDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { apiBaseUrl, apiUrls } from '@/apis';
import { useCurrency } from '@/contexts/CurrencyContext';
import { isFreePrice } from '@/utils/priceUtils';
import axios from 'axios';
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import useRazorpay from "@/hooks/useRazorpay";
import RAZORPAY_CONFIG from "@/config/razorpay";

// Local implementation of the price utility functions
const getCoursePriceValue = (
  course: any, 
  isBatch: boolean = true
): number => {
  // If course has prices array, use it
  if (course.prices && Array.isArray(course.prices) && course.prices.length > 0) {
    // Use the first active price (typically in base currency)
    const activePrice = course.prices.find((p: any) => p.is_active === true);
    
    if (activePrice) {
      return isBatch ? activePrice.batch : activePrice.individual;
    }
  }
  
  // Fall back to price/batchPrice if available
  if (isBatch && course.batchPrice !== undefined) {
    return course.batchPrice;
  }
  
  if (!isBatch && course.price !== undefined) {
    return course.price;
  }
  
  // Fall back to course_fee (with discount applied for batch)
  if (course.course_fee !== undefined) {
    return isBatch ? course.course_fee * 0.75 : course.course_fee;
  }
  
  // Last resort fallbacks
  return isBatch ? 24.00 : 32.00;
};

const getMinBatchSize = (course: any): number => {
  // If course has prices array, use min_batch_size from there
  if (course.prices && Array.isArray(course.prices) && course.prices.length > 0) {
    const activePrice = course.prices.find((p: any) => p.is_active === true);
    
    if (activePrice && activePrice.min_batch_size) {
      return activePrice.min_batch_size;
    }
  }
  
  // Fall back to course.minBatchSize if available
  if (course.minBatchSize !== undefined) {
    return course.minBatchSize;
  }
  
  // Default min batch size
  return 2;
};

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
  isFree?: boolean;
  no_of_Sessions?: number;
  target_audience?: string[];
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

interface EMISchedule {
  installmentNumber: number;
  dueDate: Date;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'failed';
  paidDate?: Date;
  transactionId?: string;
  paymentMethod?: string;
  reminderSent?: boolean;
  gracePeriodEnds?: Date;
}

interface EMIDetails {
  totalAmount: number;
  downPayment: number;
  numberOfInstallments: number;
  installmentAmount: number;
  interestRate: number;
  processingFee: number;
  startDate: Date;
  gracePeriodDays: number;
  status: 'active' | 'completed' | 'defaulted' | 'cancelled';
  schedule: EMISchedule[];
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
  missedPayments: number;
  autoDebitEnabled: boolean;
  autoDebitDetails?: {
    mandateId: string;
    bankAccount: string;
    validUntil: Date;
  };
}

interface EMIOption {
  bank: string;
  term: number;
  interestRate: number;
  monthlyAmount: number;
  totalAmount: number;
  processingFee: number;
  downPayment: number;
}

interface InstallmentPlan {
  installments: number;
  amount: number;
  processingFee: number;
  installmentAmount: number;
  downPayment: number;
  gracePeriodDays: number;
  interestRate: number;
}

type EnrollmentType = 'individual' | 'batch';

// Add extended options interface for Razorpay with EMI support
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  handler: (response: any) => Promise<void>;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    enrollment_type: string;
    course_id: string;
    price_id: string;
    user_id: string;
    currency: string;
    price: string;
    installment_id?: string;
    installment_number?: string;
    total_installments?: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
  method?: string;
}

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
  const [showInstallmentOptions, setShowInstallmentOptions] = useState<boolean>(false);
  const [selectedInstallmentPlan, setSelectedInstallmentPlan] = useState<InstallmentPlan | null>(null);

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

  // Extract data from courseDetails with better fallbacks
  const duration = courseDetails?.course_duration || 
    (courseDetails?.no_of_Sessions ? `${courseDetails.no_of_Sessions} sessions` : '4 months / 16 weeks');
  
  // Format duration to handle "0 months X weeks" cases
  const formatDuration = (durationStr: string): string => {
    // Check if the duration matches the pattern "X months Y weeks"
    const regex = /(\d+)\s*months?\s*(\d+)\s*weeks?/i;
    const match = durationStr.match(regex);
    
    if (match) {
      const months = parseInt(match[1], 10);
      const weeks = parseInt(match[2], 10);
      
      // If months is 0, only show weeks
      if (months === 0) {
        return `${weeks} week${weeks !== 1 ? 's' : ''}`;
      }
      
      // Otherwise show months with weeks in a slash format
      return `${months} month${months !== 1 ? 's' : ''} / ${weeks} week${weeks !== 1 ? 's' : ''}`;
    }
    
    // Return original string if it doesn't match expected format
    return durationStr;
  };

  const formattedDuration = formatDuration(duration);
  
  const grade = courseDetails?.grade || 
    (courseDetails?.target_audience?.length ? courseDetails.target_audience[0] : 'All Levels');

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
    
    // Get the active currency from the pricing or fall back to INR
    const displayCurrency = activePricing?.currency || 'INR';
    
    // Use proper locale based on currency
    const locale = displayCurrency === 'INR' ? 'en-IN' : 'en-US';
    
    // Format the price with the appropriate currency symbol
    const formattedPrice = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: displayCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol'
    }).format(price);
    
    console.log('Formatted Price:', formattedPrice);
    return formattedPrice;
  }, [activePricing]);
  
  // Get primary color from category or default
  const primaryColor = categoryInfo?.primaryColor || 'primary';
  const colorClass = categoryInfo?.colorClass || `text-${primaryColor}-600 dark:text-${primaryColor}-400`;
  const bgClass = categoryInfo?.bgClass || `bg-${primaryColor}-50 dark:bg-${primaryColor}-900/20`;
  const borderClass = categoryInfo?.borderClass || `border-${primaryColor}-200 dark:border-${primaryColor}-800`;

  // Check if a price is free
  const isFreePrice = (price: number): boolean => {
    return !price || price <= 0 || price < 0.01;
  };

  // Calculate Installment options based on final price
  const calculateInstallmentPlans = useCallback((finalPrice: number): InstallmentPlan[] => {
    if (!finalPrice || finalPrice < 2000) {
      // Installments usually available for amounts above 2000 INR
      return [];
    }
    
    // Processing fee (3% for installment plans)
    const processingFeePercentage = 3;
    const calculateFee = (amount: number) => Math.round(amount * processingFeePercentage / 100);
    
    // Standard grace period in days
    const gracePeriodDays = 5;
    
    // Calculate down payment (typically 20% of the total amount)
    const calculateDownPayment = (amount: number) => Math.round(amount * 0.2);
    
    // Interest rates for different plans (0% for 3-month, 3% for 6-month, 6% for 9-month)
    const interestRates = {
      3: 0,    // 0% for 3 months
      6: 3,    // 3% for 6 months
      9: 6,    // 6% for 9 months
      12: 9    // 9% for 12 months
    };
    
    // Create installment plans with 3, 6, 9, and 12 installments
    const installmentPlans: InstallmentPlan[] = [
      {
        installments: 3,
        amount: finalPrice,
        processingFee: calculateFee(finalPrice),
        downPayment: calculateDownPayment(finalPrice),
        gracePeriodDays,
        interestRate: interestRates[3],
        installmentAmount: Math.ceil((finalPrice - calculateDownPayment(finalPrice)) / 3 + calculateFee(finalPrice) / 3)
      },
      {
        installments: 6,
        amount: finalPrice,
        processingFee: calculateFee(finalPrice),
        downPayment: calculateDownPayment(finalPrice),
        gracePeriodDays,
        interestRate: interestRates[6],
        installmentAmount: Math.ceil(
          ((finalPrice - calculateDownPayment(finalPrice)) * (1 + interestRates[6] / 100)) / 6 + 
          calculateFee(finalPrice) / 6
        )
      },
      {
        installments: 9,
        amount: finalPrice,
        processingFee: calculateFee(finalPrice),
        downPayment: calculateDownPayment(finalPrice),
        gracePeriodDays,
        interestRate: interestRates[9],
        installmentAmount: Math.ceil(
          ((finalPrice - calculateDownPayment(finalPrice)) * (1 + interestRates[9] / 100)) / 9 + 
          calculateFee(finalPrice) / 9
        )
      },
      {
        installments: 12,
        amount: finalPrice,
        processingFee: calculateFee(finalPrice),
        downPayment: calculateDownPayment(finalPrice),
        gracePeriodDays,
        interestRate: interestRates[12],
        installmentAmount: Math.ceil(
          ((finalPrice - calculateDownPayment(finalPrice)) * (1 + interestRates[12] / 100)) / 12 + 
          calculateFee(finalPrice) / 12
        )
      }
    ];
    
    return installmentPlans;
  }, []);
  
  // Get available installment options
  const installmentPlans = useMemo(() => {
    // Only show installments for non-free courses with adequate price
    if (
      courseDetails?.isFree || 
      isFreePrice(getFinalPrice()) || 
      getFinalPrice() < 2000
    ) {
      return [];
    }
    
    return calculateInstallmentPlans(getFinalPrice());
  }, [courseDetails, getFinalPrice, isFreePrice, calculateInstallmentPlans]);
  
  // Toggle installment options display
  const toggleInstallmentOptions = () => {
    setShowInstallmentOptions(!showInstallmentOptions);
  };
  
  // Select an installment plan
  const selectInstallmentPlan = (plan: InstallmentPlan) => {
    setSelectedInstallmentPlan(plan);
  };
  
  // Check if installments are available
  const isInstallmentAvailable = useMemo(() => {
    return installmentPlans.length > 0;
  }, [installmentPlans]);
  
  // Handle enrollment through Razorpay with Installment support
  const handleRazorpayPayment = async (): Promise<void> => {
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
      
      // Get the final price in the original currency
      const finalPrice = getFinalPrice();
      const originalCurrency = activePricing.currency;
      
      // Get user info from profile if available
      const userEmail = userProfile?.email || RAZORPAY_CONFIG.prefill.email;
      const userName = userProfile?.full_name || userProfile?.name || RAZORPAY_CONFIG.prefill.name;
      const userPhone = userProfile?.phone_number || userProfile?.mobile || RAZORPAY_CONFIG.prefill.contact;

      // Import functions for currency handling
      const { getRazorpayConfigForCurrency, isCurrencySupported } = await import('@/config/razorpay');
      
      // Get Razorpay configuration for the course currency
      const razorpayConfig = await getRazorpayConfigForCurrency(
        originalCurrency,
        userId || undefined
      );
      
      // Determine payment amount based on full payment or EMI
      let paymentAmount = Math.round(finalPrice * 100); // Full payment in smallest currency unit
      let paymentDescription = `Payment for ${courseDetails?.course_title || "Course"} (${enrollmentType} enrollment)`;
      
      // If installment plan is selected, only charge down payment first
      if (selectedInstallmentPlan) {
        paymentAmount = Math.round(selectedInstallmentPlan.downPayment * 100);
        paymentDescription = `Down payment for ${courseDetails?.course_title || "Course"} (EMI plan: ${selectedInstallmentPlan.installments} months)`;
      }
      
      // Create a unique EMI ID if using installments
      const emiId = selectedInstallmentPlan ? `EMI-${Date.now()}-${Math.random().toString(36).substring(2, 8)}` : undefined;
      
      // Start date for EMI (first day of next month)
      const startDate = new Date();
      startDate.setDate(1); // Set to 1st of current month
      startDate.setMonth(startDate.getMonth() + 1); // Move to next month
      
      // Configure Razorpay options
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || razorpayConfig.key,
        amount: paymentAmount,
        currency: originalCurrency,
        name: courseDetails?.course_title || "Course Enrollment",
        description: paymentDescription,
        image: "/images/logo.png", // Use local image path instead of external URL
        handler: async function (response: any) {
          toast.success("Payment Successful!");
          
          // Add EMI info to payment response if applicable
          if (selectedInstallmentPlan && emiId) {
            response.emi_id = emiId;
            response.emi_plan = selectedInstallmentPlan.installments.toString();
            response.down_payment = selectedInstallmentPlan.downPayment.toString();
            response.installment_amount = selectedInstallmentPlan.installmentAmount.toString();
            response.is_emi = 'true';
          }
          
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
          user_id: userId || '',
          currency: originalCurrency,
          price: finalPrice.toString(),
        },
        theme: {
          color: razorpayConfig.theme.color,
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };
      
      // Add EMI details to notes if applicable
      if (selectedInstallmentPlan && emiId) {
        options.notes.installment_id = emiId;
        options.notes.installment_number = '0'; // 0 for down payment
        options.notes.total_installments = selectedInstallmentPlan.installments.toString();
      }

      // Use the hook to handle Razorpay checkout with the proper types
      await openRazorpayCheckout(options);
    } catch (err: any) {
      console.error("Enrollment error:", err);
      setError(err.message || "Failed to process enrollment");
      toast.error("Enrollment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Enroll course function
  const enrollCourse = async (studentId: string, courseId: string, paymentResponse: any = {}): Promise<any> => {
    try {
      // Create enrollment data to send
      const enrollmentData: any = {
        student_id: studentId,
        course_id: courseId,
        enrollment_type: enrollmentType,
        payment_information: {
          ...paymentResponse,
          payment_method: paymentResponse?.razorpay_payment_id ? 'razorpay' : 'free',
          amount: selectedInstallmentPlan ? selectedInstallmentPlan.downPayment : getFinalPrice(),
          currency: activePricing?.currency || 'INR',
        }
      };
      
      // Add EMI information if using installment plan
      if (selectedInstallmentPlan && paymentResponse.emi_id) {
        // Create EMI schedule
        const schedule = [];
        const startDate = new Date();
        startDate.setDate(1); // Set to 1st of month
        startDate.setMonth(startDate.getMonth() + 1); // Start next month
        
        for (let i = 1; i <= selectedInstallmentPlan.installments; i++) {
          const dueDate = new Date(startDate);
          dueDate.setMonth(dueDate.getMonth() + (i - 1));
          
          const gracePeriodEnds = new Date(dueDate);
          gracePeriodEnds.setDate(dueDate.getDate() + selectedInstallmentPlan.gracePeriodDays);
          
          schedule.push({
            installmentNumber: i,
            dueDate,
            amount: selectedInstallmentPlan.installmentAmount,
            status: 'pending',
            gracePeriodEnds
          });
        }
        
        // Add EMI details to enrollment data
        enrollmentData.is_emi = true;
        enrollmentData.emi_config = {
          totalAmount: getFinalPrice(),
          downPayment: selectedInstallmentPlan.downPayment,
          numberOfInstallments: selectedInstallmentPlan.installments,
          startDate: startDate.toISOString(),
          interestRate: selectedInstallmentPlan.interestRate,
          processingFee: selectedInstallmentPlan.processingFee,
          gracePeriodDays: selectedInstallmentPlan.gracePeriodDays,
          installmentAmount: selectedInstallmentPlan.installmentAmount,
          emiId: paymentResponse.emi_id,
          schedule
        };
      }
      
      // Make enrollment API call
      const response = await axios.post(
        `${apiBaseUrl}/enrolled/create`,
        enrollmentData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.status === 201 || response.status === 200) {
        toast.success("Successfully enrolled in the course!");
        // Update enrollment tracking
        await trackEnrollmentProgress(studentId, courseId);
        setIsSuccessModalOpen(true);
        return true;
      } else {
        throw new Error("Failed to enroll in the course.");
      }
    } catch (error: any) {
      console.error("Enrollment error:", error);
      toast.error(error.response?.data?.message || "Failed to enroll in the course.");
      return false;
    }
  };

  // Track enrollment progress
  const trackEnrollmentProgress = async (studentId: string, courseId: string): Promise<void> => {
    try {
      // Create tracking data
      const trackingData = {
        student_id: studentId,
        course_id: courseId,
        progress: 0,
        status: 'started'
      };
      
      // Use the progress tracking endpoint
      const response = await axios.post(
        `${apiBaseUrl}/progress/track`,
        trackingData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      console.log("Progress tracking started:", response.data);
    } catch (error) {
      console.error("Failed to track enrollment progress:", error);
      // Continue anyway, not critical
    }
  };

  // Check if already enrolled
  const checkEnrollmentStatus = async (studentId: string, courseId: string): Promise<boolean> => {
    try {
      // Construct URL to check enrollment status
      const response = await axios.get(
        `${apiBaseUrl}/enrolled/status?student_id=${studentId}&course_id=${courseId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      return response.data.enrolled || false;
    } catch (error) {
      console.error("Failed to check enrollment status:", error);
      return false;
    }
  };

  // Get upcoming meetings for enrolled student
  const getUpcomingMeetings = async (studentId: string): Promise<any[]> => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !studentId) return [];

      // Use getQuery for upcoming meetings
      const endpoint = `${apiBaseUrl}/enrolled/get-upcoming-meetings/${studentId}`;
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

    if (!activePricing && !courseDetails.isFree) {
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
      } else {
        toast.error("User identification is missing. Please log in again.");
        router.push('/login');
        return;
      }
      
      // Create enrollment data with selected type
      const enrollmentData = {
        ...courseDetails,
        enrollmentType,
        priceId: activePricing?._id,
        finalPrice: getFinalPrice(),
        currencyCode: currency.code
      };
      
      // If onEnrollClick prop is provided, use that
      if (onEnrollClick) {
        await onEnrollClick(enrollmentData);
      } else {
        // If course is free, directly enroll
        if (courseDetails.isFree || isFreePrice(getFinalPrice())) {
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
  }, [
    courseDetails, 
    isLoggedIn, 
    userId, 
    router, 
    onEnrollClick, 
    enrollmentType, 
    activePricing, 
    getFinalPrice, 
    currency.code, 
    checkEnrollmentStatus, 
    enrollCourse, 
    isFreePrice, 
    handleRazorpayPayment, 
    getUpcomingMeetings
  ]);

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
      // Disable batch enrollment option for blended courses
      setShowBatchInfo(false);
    }
  }, [isBlendedCourse]);

  // Add this enhanced UI component for EMI options
  const EMIOptionsSection = ({ 
    plans, 
    selectedPlan, 
    onSelect 
  }: { 
    plans: InstallmentPlan[], 
    selectedPlan: InstallmentPlan | null, 
    onSelect: (plan: InstallmentPlan) => void 
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden mt-4"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <div className="flex items-center mb-3">
            <Calculator className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
            <h4 className="text-base font-medium text-gray-900 dark:text-white">EMI Payment Options</h4>
          </div>
          
          <div className="space-y-3 mt-3">
            {plans.map((plan, index) => (
              <div
                key={`emi-plan-${plan.installments}`}
                className={`relative p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedPlan?.installments === plan.installments
                    ? `border-${primaryColor}-500 bg-${primaryColor}-50 dark:bg-${primaryColor}-900/20`
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => onSelect(plan)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {plan.installments} Monthly Installments
                    </span>
                    <div className="flex gap-2 mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {plan.interestRate > 0 ? `${plan.interestRate}% interest` : 'No interest'}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {plan.processingFee > 0 ? `+${formatPriceDisplay(plan.processingFee, true)} fee` : 'No fee'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold text-${primaryColor}-600 dark:text-${primaryColor}-400`}>
                      {formatPriceDisplay(plan.installmentAmount, true)}<span className="text-xs font-normal">/mo</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatPriceDisplay(plan.downPayment, true)} down payment
                    </div>
                  </div>
                  {selectedPlan?.installments === plan.installments && (
                    <div className={`absolute -right-1 -top-1 p-1 rounded-full bg-${primaryColor}-500 text-white`}>
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  )}
                </div>
                
                {selectedPlan?.installments === plan.installments && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-400">Total Amount</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatPriceDisplay(plan.amount, true)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-400">Down Payment</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatPriceDisplay(plan.downPayment, true)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-400">Monthly Payment</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatPriceDisplay(plan.installmentAmount, true)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-400">Processing Fee</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatPriceDisplay(plan.processingFee, true)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Info className="h-3 w-3 mr-1" />
                        {plan.gracePeriodDays} days grace period for each payment
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            <p className="flex items-center mb-1">
              <Info className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              EMI payments are processed securely through our payment gateway
            </p>
            <p className="flex items-center">
              <Lock className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              Missed payments may restrict access to course content
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 overflow-hidden enrollment-section w-full">
        {/* Enhanced header with clearer pricing visibility */}
        <div className={`px-4 sm:px-6 md:px-8 lg:px-10 py-4 ${bgClass} border-b ${borderClass} flex items-center justify-between`}>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <CreditCard className="h-5 w-5 mr-2 hidden sm:inline-block" />
            Enrollment Options
          </h3>
          {!isBlendedCourse && (
            <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-white dark:bg-gray-700 text-xs font-medium shadow-sm">
              <span className={`${colorClass} font-semibold`}>
                {enrollmentType === 'individual' ? 'Individual' : 'Batch'}
              </span>
            </div>
          )}
        </div>
        
        <div className="p-5 sm:p-6 md:p-4 space-y-6">
          {/* Enrollment Type Selection - Better optimized for mobile with clear touch targets */}
          {!isBlendedCourse && (
            <div className="flex w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
              <button
                onClick={() => setEnrollmentType('individual')}
                className={`flex-1 py-4 px-3 flex flex-col items-center justify-center transition duration-200 ${
                  enrollmentType === 'individual' 
                    ? `${bgClass} ${colorClass} font-medium` 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                aria-pressed={enrollmentType === 'individual'}
                aria-label="Select individual enrollment"
              >
                <User className={`h-6 w-6 mb-2 ${enrollmentType === 'individual' ? colorClass : ''}`} />
                <span className="text-sm font-medium">Individual</span>
                {activePricing && (
                  <span className="text-xs mt-1.5 font-semibold">
                    {formatPriceDisplay(activePricing.individual)}
                  </span>
                )}
              </button>
              <button
                onClick={() => setEnrollmentType('batch')}
                className={`flex-1 py-4 px-3 flex flex-col items-center justify-center transition duration-200 ${
                  enrollmentType === 'batch' 
                    ? `${bgClass} ${colorClass} font-medium` 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                aria-pressed={enrollmentType === 'batch'}
                aria-label="Select batch enrollment"
              >
                <Users className={`h-6 w-6 mb-2 ${enrollmentType === 'batch' ? colorClass : ''}`} />
                <span className="text-sm font-medium">Batch/Group</span>
                {activePricing && (
                  <span className="text-xs mt-1.5 font-semibold">
                    {formatPriceDisplay(activePricing.batch)} per person
                  </span>
                )}
              </button>
            </div>
          )}
          
          {/* Course Price - Enhanced for clarity on mobile */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={enrollmentType}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between p-5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/80 dark:to-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-0.5">
                  {isBlendedCourse ? 'Individual Price' : (enrollmentType === 'individual' ? 'Individual Price' : 'Batch Price (per person)')}
                </p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h4 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                    {courseDetails?.isFree ? "Free" : formatPriceDisplay(getFinalPrice())}
                  </h4>
                  
                  {originalPrice && originalPrice > finalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPriceDisplay(originalPrice)}
                    </span>
                  )}
                  
                  {discountPercentage > 0 && (
                    <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/40 dark:text-green-400 px-2.5 py-1 rounded-full">
                      Save {discountPercentage}%
                    </span>
                  )}
                </div>
                {enrollmentType === 'batch' && !isBlendedCourse && activePricing && (
                  <p className="text-xs text-gray-500 mt-2 flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1.5" />
                    Min {activePricing.min_batch_size} students required
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-full ${bgClass} shadow-md`}>
                <CreditCard className={`h-7 w-7 ${colorClass}`} />
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* EMI Payment Options replaced with Installment plans */}
          {isInstallmentAvailable && (
            <div className="mt-4">
              <button
                type="button"
                onClick={toggleInstallmentOptions}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border ${
                  showInstallmentOptions 
                    ? `border-${primaryColor}-500 dark:border-${primaryColor}-400` 
                    : 'border-gray-200 dark:border-gray-700'
                } shadow-sm hover:shadow-md transition-all flex items-center justify-between`}
              >
                <div className="flex items-center">
                  <CalendarClock className={`h-5 w-5 text-${primaryColor}-500 mr-2.5`} />
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    Pay with EMI
                  </span>
                  {selectedInstallmentPlan && (
                    <span className={`ml-2 text-sm font-medium text-${primaryColor}-600 dark:text-${primaryColor}-400`}>
                      ({selectedInstallmentPlan.installments} months)
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  {selectedInstallmentPlan && (
                    <span className={`mr-2 text-sm font-medium text-${primaryColor}-600 dark:text-${primaryColor}-400`}>
                      {formatPriceDisplay(selectedInstallmentPlan.installmentAmount, true)}/mo
                    </span>
                  )}
                  <ChevronDown
                    className={`h-5 w-5 transition-transform duration-200 ${
                      showInstallmentOptions ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>
            </div>
          )}
          
          {isInstallmentAvailable && showInstallmentOptions && (
            <AnimatePresence>
              <EMIOptionsSection
                plans={installmentPlans}
                selectedPlan={selectedInstallmentPlan}
                onSelect={selectInstallmentPlan}
              />
            </AnimatePresence>
          )}
          
          {/* Course Details List - More readable on mobile */}
          <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-5">
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow">
              <span className="text-gray-700 dark:text-gray-300 font-medium flex items-center">
                <Clock className="w-5 h-5 mr-2.5 text-gray-500 dark:text-gray-400" />
                Duration
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">{formattedDuration}</span>
            </div>
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow">
              <span className="text-gray-700 dark:text-gray-300 font-medium flex items-center">
                <GraduationCap className="w-5 h-5 mr-2.5 text-gray-500 dark:text-gray-400" />
                Grade
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {grade}
              </span>
            </div>
          </div>
          
          {/* Course Features - More compact and well structured */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="font-semibold text-gray-900 dark:text-white text-md mb-3 flex items-center">
              <ThumbsUp className="w-4 h-4 mr-2 text-green-500" />
              What you'll get
            </h4>
            <div className="flex flex-wrap -mx-1">
              {courseFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="w-full sm:w-1/2 px-1 mb-2"
                >
                  <div className="flex items-center text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                    <span className="text-xs font-medium">{feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Enroll Button - Modified to show installment selection if available */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEnrollClick}
            disabled={loading}
            className={`w-full py-4 px-5 bg-gradient-to-r from-${primaryColor}-600 to-${primaryColor}-700 hover:from-${primaryColor}-700 hover:to-${primaryColor}-800 text-white font-semibold text-lg rounded-xl flex items-center justify-center shadow-md transition-all duration-300 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            aria-label={isLoggedIn ? (courseDetails?.isFree ? 'Enroll for free' : 'Enroll now') : 'Login to enroll'}
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              <>
                {isLoggedIn ? (
                  <>
                    {courseDetails?.isFree ? 'Enroll for Free' : 
                      selectedInstallmentPlan ? `Pay ₹${selectedInstallmentPlan.installmentAmount} now - ${selectedInstallmentPlan.installments} installments` : 
                      (isBlendedCourse ? 'Enroll Now' : 
                      (enrollmentType === 'individual' ? 'Enroll Now' : 'Enroll in Batch'))} <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  <>
                    Login to Enroll <Lock className="w-5 h-5 ml-2" />
                  </>
                )}
              </>
            )}
          </motion.button>
          
          {/* Payment info with installment badge */}
          {!courseDetails?.isFree && (
            <div className="text-center text-xs p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-center mb-1.5">
                <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">Secure payment powered by Razorpay</span>
              </div>
              {isInstallmentAvailable && (
                <div className="flex items-center justify-center gap-2">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs">Installments</span>
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded text-xs">Credit Card</span>
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded text-xs">UPI</span>
                </div>
              )}
            </div>
          )}
          
          {/* Fast Track Option - Enhanced mobile visibility */}
          <motion.div
            className="border-t border-gray-200 dark:border-gray-700 pt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-gray-800 dark:to-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30 text-center">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-amber-100/80 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-300 text-xs font-medium mb-2.5">
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                Fast Track Available
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Fast-track options available for experienced learners.
                Contact support for details.
              </p>
            </div>
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