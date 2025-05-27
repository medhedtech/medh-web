'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, ArrowRight, ThumbsUp, AlertTriangle, 
  Lock, Zap, CheckCircle, Users, User, Info, CheckCircle2, Clock, GraduationCap,
  CalendarClock, Calculator, ChevronDown, ExternalLink, Briefcase
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { apiBaseUrl, apiUrls } from '@/apis';
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
interface Price {
  _id?: string;
  currency: string;
  individual: number;
  batch: number;
  min_batch_size?: number;
  max_batch_size?: number;
  early_bird_discount?: number;
  group_discount?: number;
  is_active?: boolean;
  valid_from?: string;
  valid_until?: string;
}

interface CoursePrice {
  currency: string;
  individual: number;
  batch: number;
  min_batch_size?: number;
  max_batch_size?: number;
  early_bird_discount?: number;
  group_discount?: number;
  is_active?: boolean;
  valid_from?: string;
  valid_until?: string;
}

interface ICourse {
  _id: string;
  course_title: string;
  course_image?: string;
  isFree?: boolean;
  prices?: Price[];
  course_fee?: number; // Fallback if prices array is not structured
  // ... other course properties
}

interface UserProfile {
  _id?: string; // Make _id optional if it might not be present
  email?: string;
  name?: string;
  full_name?: string;
  mobile?: string;
  phone_number?: string;
  // other user properties
}

interface CourseDescription {
  program_overview?: string;
  benefits?: string;
  learning_objectives?: string[];
  course_requirements?: string[];
  target_audience?: string[];
  _id?: string;
}

interface FinalEvaluation {
  final_project?: {
    evaluation_criteria?: string[];
  };
  has_final_exam?: boolean;
  has_final_project?: boolean;
}

interface Certification {
  is_certified?: boolean;
  certification_criteria?: {
    min_assignments_score?: number;
    min_quizzes_score?: number;
    min_attendance?: number;
  };
}

interface Meta {
  ratings?: {
    average?: number;
    count?: number;
  };
  views?: number;
  enrollments?: number;
  lastUpdated?: string;
}

interface CourseDetails extends ICourse {
  // any additional details specific to the course details page
  slug?: string;
  no_of_Sessions?: number;
  course_duration?: string;
  session_duration?: string;
  classType?: string;
  class_type?: string;
  course_type?: string;
  delivery_format?: string;
  delivery_type?: string;
  grade?: string;
  course_category?: string;
  course_subcategory?: string;
  course_subtitle?: string;
  course_tag?: string;
  course_level?: string;
  language?: string;
  course_description?: string | CourseDescription; // Support both formats
  course_fee?: number;
  curriculum?: any[];
  target_audience?: string[];
  features?: string[];
  meta?: Meta;
  status?: string;
  tools_technologies?: any[];
  faqs?: any[];
  course_videos?: any[];
  resource_videos?: any[];
  recorded_videos?: any[];
  show_in_home?: boolean;
  _source?: string;
  subtitle_languages?: any[];
  final_evaluation?: FinalEvaluation;
  is_Certification?: string;
  is_Assignments?: string;
  is_Projects?: string;
  is_Quizes?: string;
  related_courses?: any[];
  doubt_session_schedule?: {
    frequency?: string;
    preferred_days?: string[];
    preferred_time_slots?: any[];
  };
  certification?: Certification;
  course_modules?: any[];
  resource_pdfs?: any[];
  bonus_modules?: any[];
  createdAt?: string;
  updatedAt?: string;
  unique_key?: string;
  __v?: number;
  brochures?: string[];
  // ... other fields
}

interface PaymentDetails {
  originalPrice: number;
  originalCurrency: string;
  paymentCurrency: string;
  amountInINR: number;
  conversionRate: number;
  formattedOriginalPrice: string;
}

interface InstallmentPlan {
  id: string;
  name: string;
  installments: number;
  installmentAmount: number;
  totalAmount: number;
  downPayment: number;
  currentInstallmentNumber?: number;
  gracePeriodDays: number;
}

type EnrollmentType = 'individual' | 'batch';

interface CategoryInfo {
  primaryColor?: string;
  colorClass?: string;
  bgClass?: string;
  borderClass?: string;
}

interface EnrollmentDetailsProps {
  courseDetails: CourseDetails | null;
  categoryInfo?: CategoryInfo;
  onEnrollClick?: (data: any) => Promise<void>; // Adjust 'any' to a more specific type
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, any>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  navigateToCourse: () => void;
  pricePaid: string;
}

// Error Fallback Component
const ErrorFallback: React.FC<{ error: string; resetErrorBoundary: () => void }> = ({ error, resetErrorBoundary }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
    <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
    <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Something went wrong</h3>
    <p className="text-sm text-red-600 dark:text-red-300 mb-4 text-center">{error}</p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Try again
    </button>
  </div>
);

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, courseTitle, navigateToCourse, pricePaid }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full transform transition-all duration-300 scale-100">
        <div className="text-center">
          <CheckCircle2 className="mx-auto text-emerald-500 h-16 w-16 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Enrollment Successful!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-1">
            You are now enrolled in:
          </p>
          <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-4">{courseTitle}</p>
          
          {pricePaid && pricePaid !== "Free" && pricePaid !== "N/A" && (
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">Amount Paid:</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{pricePaid}</p>
            </div>
          )}

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            You can access the course materials and schedule from your dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={navigateToCourse}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Go to My Courses <ArrowRight size={18} />
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Close
            </button>
          </div>
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
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const { 
    loadRazorpayScript, 
    openRazorpayCheckout, 
    isScriptLoaded, 
    isLoading: razorpayLoading, 
    error: razorpayError 
  } = useRazorpay();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Enhanced blended course detection
  const isBlendedCourse = useMemo(() => {
    return (
      courseDetails?.classType === 'Blended Courses' || 
      courseDetails?.class_type === 'Blended Courses' ||
      courseDetails?.course_type === 'blended' || 
      courseDetails?.course_type === 'Blended' ||
      courseDetails?.delivery_format === 'Blended' ||
      courseDetails?.delivery_type === 'Blended'
    );
  }, [
    courseDetails?.classType, 
    courseDetails?.class_type, 
    courseDetails?.course_type,
    courseDetails?.delivery_format,
    courseDetails?.delivery_type
  ]);
  
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
  const [showInstallmentOptions, setShowInstallmentOptions] = useState<boolean>(false);
  const [selectedInstallmentPlan, setSelectedInstallmentPlan] = useState<InstallmentPlan | null>(null);
  const [customMonths, setCustomMonths] = useState<number>(6);
  const [showCustomMonthInput, setShowCustomMonthInput] = useState<boolean>(false);
  const emiDropdownStateRef = useRef<boolean>(false);
  const userToggledEmiRef = useRef<boolean>(false);

  // Check login status on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check multiple possible auth storage keys
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const user = localStorage.getItem('user') || localStorage.getItem('userData');
      
      // Consider logged in if we have a token and either userId or user data
      const isUserLoggedIn = !!token && (!!userId || !!user);
      
      // Auth check completed
      
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

  // Always force individual enrollment for blended courses
  useEffect(() => {
    if (isBlendedCourse) {
      setEnrollmentType('individual');
      setShowBatchInfo(false);
    }
  }, [isBlendedCourse]);

  // Extract data from courseDetails with better fallbacks
  const duration = courseDetails?.course_duration || 
    (courseDetails?.session_duration ? `${courseDetails.session_duration} per session` : 
    (courseDetails?.no_of_Sessions ? `${courseDetails.no_of_Sessions} sessions` : '4 months / 16 weeks'));
  
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
  
  // Get grade/level from multiple possible sources with new API structure support
  const getGradeLevel = useCallback((): string => {
    // First check course_level from new API structure
    if (courseDetails?.course_level) {
      return courseDetails.course_level;
    }
    
    // Check grade field (legacy)
    if (courseDetails?.grade) {
      return courseDetails.grade;
    }
    
    // Check target_audience from course_description object (new structure)
    if (typeof courseDetails?.course_description === 'object' && courseDetails.course_description?.target_audience?.length) {
      return courseDetails.course_description.target_audience[0];
    }
    
    // Check target_audience array directly (legacy)
    if (courseDetails?.target_audience?.length) {
      return courseDetails.target_audience[0];
    }
    
    return 'All Levels';
  }, [courseDetails]);
  
  const grade = getGradeLevel();

  // Helper function to extract description text from course_description
  const getDescriptionText = useCallback((): string => {
    if (!courseDetails?.course_description) {
      return "No description available";
    }
    
    // Handle string format (legacy)
    if (typeof courseDetails.course_description === 'string') {
      return courseDetails.course_description;
    }
    
    // Handle object format (new structure)
    const desc = courseDetails.course_description as CourseDescription;
    
    // Try program_overview first, then benefits, then combine available fields
    if (desc.program_overview) {
      return desc.program_overview;
    }
    
    if (desc.benefits) {
      return desc.benefits;
    }
    
    // Combine available text fields
    const textParts = [];
    if (desc.program_overview) textParts.push(desc.program_overview);
    if (desc.benefits) textParts.push(desc.benefits);
    
    return textParts.length > 0 ? textParts.join(' ') : "No description available";
  }, [courseDetails?.course_description]);

  // Get active price information
  const getActivePrice = useCallback((): Price | null => {
    const prices = courseDetails?.prices;
    
    if (!prices || prices.length === 0) {
      return null;
    }

    // First try to find a price matching the user's preferred currency
    const preferredPrice = prices.find(price => 
      price.is_active && price.currency === 'USD'
    );

    // If no matching currency found, try to find any active price
    const activePrice = prices.find(price => price.is_active);

    // If still no price found, use the first price
    const finalPrice = preferredPrice || activePrice || prices[0] || null;
    return finalPrice;
  }, [courseDetails]);

  // State for active pricing
  const [activePricing, setActivePricing] = useState<Price | null>(null);

  // Update activePricing when course details changes
  useEffect(() => {
    const price = getActivePrice();
    setActivePricing(price);
  }, [courseDetails?.prices, courseDetails?._id]); // Only depend on specific properties

  // Calculate final price including any applicable discounts
  const calculateFinalPrice = useCallback((price: number | undefined, discount: number | undefined): number => {
    if (!price) {
      return 0;
    }
    const safeDiscount = discount || 0;
    const finalPrice = price - (price * safeDiscount / 100);
    return finalPrice;
  }, []);
  
  // Get the final price in the user's currency
  const getFinalPrice = useCallback((): number => {
    if (!activePricing) {
      return 0;
    }
    
    // Always use individual price for blended courses
    const basePrice = isBlendedCourse 
      ? activePricing.individual
      : (enrollmentType === 'individual' ? activePricing.individual : activePricing.batch);
    
    const discountPercentage = isBlendedCourse
      ? activePricing.early_bird_discount
      : (enrollmentType === 'batch' ? activePricing.group_discount : activePricing.early_bird_discount);
    
    const finalPrice = calculateFinalPrice(basePrice, discountPercentage);
    return finalPrice;
  }, [activePricing, enrollmentType, calculateFinalPrice, isBlendedCourse]);

  // Format price for display with proper currency symbol
  const getDisplayCurrencySymbol = useCallback(() => {
    // Currency symbol mapping
    const currencySymbols: { [key: string]: string } = {
      'USD': '$',
      'INR': '₹',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$',
      'SGD': 'S$',
      'CHF': 'CHF',
      'CNY': '¥',
      'KRW': '₩',
      'THB': '฿',
      'MYR': 'RM',
      'PHP': '₱',
      'VND': '₫',
      'IDR': 'Rp',
      'BRL': 'R$',
      'MXN': '$',
      'ZAR': 'R',
      'RUB': '₽',
      'TRY': '₺',
      'AED': 'د.إ',
      'SAR': 'ر.س',
      'QAR': 'ر.ق',
      'KWD': 'د.ك',
      'BHD': 'د.ب',
      'OMR': 'ر.ع.',
      'JOD': 'د.أ',
      'LBP': 'ل.ل',
      'EGP': 'ج.م',
      'PKR': '₨',
      'BDT': '৳',
      'LKR': '₨',
      'NPR': '₨',
      'AFN': '؋',
      'IRR': '﷼',
      'IQD': 'ع.د',
      'SYP': 'ل.س',
      'YER': '﷼',
      'MAD': 'د.م.',
      'TND': 'د.ت',
      'DZD': 'د.ج',
      'LYD': 'ل.د',
      'SDG': 'ج.س.',
      'ETB': 'Br',
      'KES': 'KSh',
      'UGX': 'USh',
      'TZS': 'TSh',
      'RWF': 'RF',
      'GHS': '₵',
      'NGN': '₦',
      'XOF': 'CFA',
      'XAF': 'FCFA',
      'ZMW': 'ZK',
      'BWP': 'P',
      'SZL': 'L',
      'LSL': 'L',
      'NAD': 'N$',
      'MZN': 'MT',
      'AOA': 'Kz',
      'CDF': 'FC',
      'MGA': 'Ar',
      'SCR': '₨',
      'MUR': '₨',
      'MVR': '.ރ',
      'KMF': 'CF',
      'DJF': 'Fdj',
      'SOS': 'S',
      'ERN': 'Nfk'
    };

    // Prioritize currency from the first active price object
    if (courseDetails?.prices && courseDetails.prices.length > 0) {
      const activePrice = courseDetails.prices.find(p => p.is_active);
      if (activePrice && activePrice.currency) {
        return currencySymbols[activePrice.currency.toUpperCase()] || activePrice.currency;
      }
      // Fallback to the first price object's currency if no active one found
      if (courseDetails.prices[0]?.currency) {
        return currencySymbols[courseDetails.prices[0].currency.toUpperCase()] || courseDetails.prices[0].currency;
      }
    }
    // Fallback to course_fee's currency if that exists (assuming it might be structured like { amount: 100, currency: 'USD'})
    // This part is speculative, adjust if course_fee is just a number
    if (typeof courseDetails?.course_fee === 'object' && courseDetails.course_fee !== null) {
       // return courseDetails.course_fee.currency; // Example structure
    }
    return '₹'; // Default to INR symbol since this is primarily an Indian platform
  }, [courseDetails]);
  
  const formatPriceDisplay = useCallback((price: number | undefined | null): string => {
    // Check if course is free using multiple indicators
    const courseIsActuallyFree = courseDetails?.isFree || 
      courseDetails?.course_fee === 0 ||
      (courseDetails?.prices && courseDetails.prices.every(p => p.individual === 0 && p.batch === 0));
    
    if (courseIsActuallyFree || price === 0) return "Free";
    if (price === undefined || price === null || isNaN(price)) return "N/A";

    const symbol = getDisplayCurrencySymbol();
    // Ensure price is a number before calling toLocaleString
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) return "N/A";

    const formattedPrice = numericPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return symbol.length > 1 ? `${symbol} ${formattedPrice}` : `${symbol}${formattedPrice}`;
  }, [courseDetails, getDisplayCurrencySymbol]);

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
    
    // Standard grace period in days
    const gracePeriodDays = 5;
    
    // Fixed down payment (20% of the total amount)
    const downPaymentPercentage = 0.2;
    const downPayment = Math.round(finalPrice * downPaymentPercentage);
    const remainingAmount = finalPrice - downPayment;
    
    // Create installment plans with different month options
    const monthOptions = [3, 6, 9, 12, 18, 24];
    
    const installmentPlans: InstallmentPlan[] = monthOptions.map(months => {
      const installmentAmount = Math.ceil(remainingAmount / months);
      
      return {
        id: `${months}-month`,
        name: `${months}-month Installment`,
        installments: months,
        installmentAmount,
        totalAmount: finalPrice,
        downPayment,
        currentInstallmentNumber: 1,
        gracePeriodDays
      };
    });
    
    return installmentPlans;
  }, []);
  
  // Create custom installment plan
  const createCustomInstallmentPlan = useCallback((months: number, finalPrice: number): InstallmentPlan => {
    const downPaymentPercentage = 0.2;
    const downPayment = Math.round(finalPrice * downPaymentPercentage);
    const remainingAmount = finalPrice - downPayment;
    const installmentAmount = Math.ceil(remainingAmount / months);
    
    return {
      id: `custom-${months}-month`,
      name: `Custom ${months}-month Plan`,
      installments: months,
      installmentAmount,
      totalAmount: finalPrice,
      downPayment,
      currentInstallmentNumber: 1,
      gracePeriodDays: 5
    };
  }, []);

  // Get available installment options
  const installmentPlans = useMemo(() => {
    const finalPrice = getFinalPrice();
    
    // Only show installments for non-free courses with adequate price
    if (
      courseDetails?.isFree || 
      isFreePrice(finalPrice) || 
      finalPrice < 2000
    ) {
      return [];
    }
    
    return calculateInstallmentPlans(finalPrice);
  }, [courseDetails?.isFree, activePricing, enrollmentType]);

  // Stable reference for final price to prevent unnecessary re-renders
  const stableFinalPrice = useMemo(() => getFinalPrice(), [activePricing, enrollmentType]);

  // Check if installments are available and preserve dropdown state
  const isInstallmentAvailable = installmentPlans.length > 0;
  
  // Preserve EMI dropdown state when installments become unavailable temporarily
  useEffect(() => {
    if (!isInstallmentAvailable && showInstallmentOptions && userToggledEmiRef.current) {
      // Only close if user hasn't explicitly opened it and installments are truly unavailable
      const timer = setTimeout(() => {
        if (!isInstallmentAvailable) {
          setShowInstallmentOptions(false);
          userToggledEmiRef.current = false;
        }
      }, 500); // Longer delay to prevent premature closing
      
      return () => clearTimeout(timer);
    }
  }, [isInstallmentAvailable, showInstallmentOptions]);
  
  // Toggle installment options display
  const toggleInstallmentOptions = useCallback(() => {
    userToggledEmiRef.current = true; // Mark that user explicitly toggled
    setShowInstallmentOptions(prev => {
      const newState = !prev;
      emiDropdownStateRef.current = newState;
      return newState;
    });
  }, []);
  
  // Select an installment plan
  const selectInstallmentPlan = useCallback((plan: InstallmentPlan) => {
    setSelectedInstallmentPlan(plan);
  }, []);

  // Stable callback for custom months change
  const handleCustomMonthsChange = useCallback((months: number) => {
    setCustomMonths(months);
  }, []);

  // Stable callback for toggling custom input
  const handleToggleCustomInput = useCallback(() => {
    setShowCustomMonthInput(prev => !prev);
  }, []);
  

  
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
      if (selectedInstallmentPlan && emiId && options.notes) {
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
          interestRate: selectedInstallmentPlan.installmentAmount,
          processingFee: selectedInstallmentPlan.installmentAmount,
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
      
              // Progress tracking started
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
        currencyCode: 'USD'
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
          // Upcoming meetings retrieved
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

  // Handle course features with improved certificate detection
  const courseFeatures = useMemo(() => {
    const baseFeatures = [
      "Live interactive sessions",
      "Lifetime access to recordings",
      "Hands-on projects & assignments"
    ];
    
    // Check if course has certificate using multiple sources
    const hasCertificate = () => {
      // Check is_Certification field (string format)
      if (courseDetails?.is_Certification === "Yes") {
        return true;
      }
      
      // Check certification object (new structure)
      if (courseDetails?.certification?.is_certified === true) {
        return true;
      }
      
      // Check final_evaluation for certification indicators
      if (courseDetails?.final_evaluation?.has_final_exam || 
          courseDetails?.final_evaluation?.has_final_project) {
        return true;
      }
      
      return false;
    };
    
    // Add certificate feature if available
    const features = [...baseFeatures];
    if (hasCertificate()) {
      features.splice(1, 0, "Certificate of completion");
    }
    
    // Use custom features if provided, otherwise use dynamic features
    return courseDetails?.features || features;
  }, [courseDetails?.features, courseDetails?.is_Certification, courseDetails?.certification, courseDetails?.final_evaluation]);
  
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
  const discountPercentage = activePricing ? (
    isBlendedCourse 
      ? activePricing.early_bird_discount || 0 
      : (enrollmentType === 'batch' 
        ? activePricing.group_discount || 0
        : activePricing.early_bird_discount || 0)
  ) : 0;

  // Get the final price for display
  const finalPrice = getFinalPrice();
  
  // Determine original price (before discount) if applicable
  const originalPrice = useMemo(() => {
    if (!activePricing) return null;
    
    if (isBlendedCourse) {
      return discountPercentage > 0 ? activePricing.individual : null;
    } else {
      return discountPercentage > 0 
        ? (enrollmentType === 'individual' ? activePricing.individual : activePricing.batch) 
        : null;
    }
  }, [activePricing, discountPercentage, enrollmentType, isBlendedCourse]);

  // Update enrollment type if course type changes - Force individual for blended courses
  useEffect(() => {
    if (isBlendedCourse) {
      setEnrollmentType('individual');
      setShowBatchInfo(false);
    }
  }, [isBlendedCourse]);

  // Sync EMI dropdown state with ref
  useEffect(() => {
    emiDropdownStateRef.current = showInstallmentOptions;
  }, [showInstallmentOptions]);

    // Modern EMI Component with Industry Standards
  // TODO: @shivansh - Improve EMI option UI and fix critical issues:
  // 1. Fix auto-closing dropdown issue when scrolling or interacting with other elements
  // 2. Improve text consistency across all EMI components (font sizes, spacing, colors)
  // 3. Fix dropdown state management to prevent unexpected closures
  // 4. Enhance mobile responsiveness and touch interactions
  // 5. Standardize button styles and hover states throughout EMI section
  // 6. Fix text overflow and truncation issues on smaller screens
  // 7. Improve loading states and error handling in EMI calculations
  // 8. Add better visual feedback for selected EMI plans
  // 9. Fix accessibility issues (keyboard navigation, screen reader support)
  // 10. Optimize performance to prevent unnecessary re-renders
  const ModernEMIComponent = React.memo(({
    installmentPlans,
    selectedInstallmentPlan,
    onSelectPlan,
    finalPrice,
    primaryColor,
    formatPriceDisplay,
    createCustomInstallmentPlan
  }: {
    installmentPlans: InstallmentPlan[],
    selectedInstallmentPlan: InstallmentPlan | null,
    onSelectPlan: (plan: InstallmentPlan) => void,
    finalPrice: number,
    primaryColor: string,
    formatPriceDisplay: (price: number) => string,
    createCustomInstallmentPlan: (months: number, price: number) => InstallmentPlan
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');
    const [customDuration, setCustomDuration] = useState(12);
    const [isCalculating, setIsCalculating] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const interactionRef = useRef(false);

    // Enhanced interaction tracking
    const trackInteraction = useCallback((duration = 300) => {
      interactionRef.current = true;
      setTimeout(() => {
        interactionRef.current = false;
      }, duration);
    }, []);

    // Toggle EMI panel
    const toggleEMIPanel = useCallback(() => {
      setIsExpanded(prev => !prev);
      trackInteraction(500);
    }, [trackInteraction]);

    // Handle plan selection with analytics
    const handlePlanSelection = useCallback((plan: InstallmentPlan) => {
      setIsCalculating(true);
      trackInteraction(400);
      
      // Simulate calculation delay for better UX
      setTimeout(() => {
        onSelectPlan(plan);
        setIsCalculating(false);
      }, 150);
    }, [onSelectPlan, trackInteraction]);

    // Custom EMI calculation
    const calculateCustomEMI = useCallback((months: number) => {
      if (months < 3 || months > 48) return null;
      
      const downPayment = Math.round(finalPrice * 0.2);
      const remainingAmount = finalPrice - downPayment;
      const monthlyEMI = Math.ceil(remainingAmount / months);
      
      return {
        downPayment,
        monthlyEMI,
        totalAmount: finalPrice,
        months,
        savings: finalPrice - (downPayment + (monthlyEMI * months))
      };
    }, [finalPrice]);

    // Handle custom duration change
    const handleCustomDurationChange = useCallback((months: number) => {
      setCustomDuration(months);
      if (months >= 3 && months <= 48) {
        const customPlan = createCustomInstallmentPlan(months, finalPrice);
        handlePlanSelection(customPlan);
      }
    }, [createCustomInstallmentPlan, finalPrice, handlePlanSelection]);

    // Enhanced scroll and interaction protection
    useEffect(() => {
      if (!isExpanded) return;

      const handleGlobalInteraction = (e: Event) => {
        if (containerRef.current?.contains(e.target as Node)) {
          trackInteraction(600);
        }
      };

      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node) && !interactionRef.current) {
          setTimeout(() => {
            if (!interactionRef.current) {
              setIsExpanded(false);
            }
          }, 150);
        }
      };

      // Add comprehensive event listeners
      ['scroll', 'touchmove', 'wheel'].forEach(event => {
        document.addEventListener(event, handleGlobalInteraction, { passive: true });
      });
      
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        ['scroll', 'touchmove', 'wheel'].forEach(event => {
          document.removeEventListener(event, handleGlobalInteraction);
        });
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isExpanded, trackInteraction]);

    // Custom EMI calculation for preview
    const customEMIPreview = useMemo(() => calculateCustomEMI(customDuration), [calculateCustomEMI, customDuration]);

    return (
      <div ref={containerRef} className="mt-4 sm:mt-6">
        {/* EMI Header Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl sm:rounded-2xl border border-blue-200 dark:border-gray-600 overflow-hidden">
          <button
            type="button"
            onClick={toggleEMIPanel}
            className="w-full p-4 sm:p-6 text-left hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300"
            aria-expanded={isExpanded}
            aria-label="Toggle EMI options"
          >
            <div className="flex items-start sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 leading-tight">
                    Easy EMI Options
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {selectedInstallmentPlan 
                      ? (
                          <span className="block sm:inline">
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                              {formatPriceDisplay(selectedInstallmentPlan.installmentAmount)}/month
                            </span>
                            <span className="block sm:inline sm:ml-1">
                              for {selectedInstallmentPlan.installments} months
                            </span>
                          </span>
                        )
                      : 'Split payment into easy installments'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {selectedInstallmentPlan && (
                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 leading-tight">
                      {formatPriceDisplay(selectedInstallmentPlan.downPayment)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      down
                    </div>
                  </div>
                )}
                <ChevronDown
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-300 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>
          </button>

          {/* EMI Content Panel */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  {/* Tab Navigation */}
                  <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-4 sm:mb-6">
                    <button
                      onClick={() => {
                        setActiveTab('preset');
                        trackInteraction();
                      }}
                      className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
                        activeTab === 'preset'
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Popular Plans
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('custom');
                        trackInteraction();
                      }}
                      className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
                        activeTab === 'custom'
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Custom Duration
                    </button>
                  </div>

                  {/* Preset Plans Tab */}
                  {activeTab === 'preset' && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2 sm:space-y-3"
                    >
                      {installmentPlans.map((plan, index) => (
                        <motion.div
                          key={plan.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          onClick={() => handlePlanSelection(plan)}
                          className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            selectedInstallmentPlan?.id === plan.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-start sm:items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                                <div className={`w-3 h-3 rounded-full mt-1 sm:mt-0 flex-shrink-0 ${
                                  selectedInstallmentPlan?.id === plan.id
                                    ? 'bg-blue-500'
                                    : 'bg-gray-300 dark:bg-gray-600'
                                }`} />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white leading-tight">
                                    {plan.installments} Monthly Payments
                                  </h4>
                                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5 leading-relaxed">
                                    <span className="block sm:inline">
                                      {formatPriceDisplay(plan.downPayment)} down
                                    </span>
                                    <span className="block sm:inline sm:ml-1">
                                      + {plan.installments} EMIs
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-base sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">
                                {formatPriceDisplay(plan.installmentAmount)}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                per month
                              </div>
                            </div>
                          </div>
                          
                          {selectedInstallmentPlan?.id === plan.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              transition={{ duration: 0.3 }}
                              className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-blue-200 dark:border-blue-700"
                            >
                              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                                <div className="text-center">
                                  <div className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                                    {formatPriceDisplay(plan.downPayment)}
                                  </div>
                                  <div className="text-gray-500 dark:text-gray-400 text-xs leading-tight">Down Payment</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                                    {plan.installments}
                                  </div>
                                  <div className="text-gray-500 dark:text-gray-400 text-xs leading-tight">Installments</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                                    {formatPriceDisplay(plan.totalAmount)}
                                  </div>
                                  <div className="text-gray-500 dark:text-gray-400 text-xs leading-tight">Total Amount</div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Custom Duration Tab */}
                  {activeTab === 'custom' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 sm:space-y-6"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-600">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight">
                          Choose Your Duration
                        </h4>
                        
                        {/* Duration Slider */}
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                              Duration: {customDuration} months
                            </label>
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              3-48 months
                            </div>
                          </div>
                          
                          <div className="relative">
                            <input
                              type="range"
                              min="3"
                              max="48"
                              value={customDuration}
                              onChange={(e) => {
                                const months = parseInt(e.target.value);
                                setCustomDuration(months);
                                trackInteraction();
                              }}
                              onMouseUp={() => handleCustomDurationChange(customDuration)}
                              onTouchEnd={() => handleCustomDurationChange(customDuration)}
                              className="w-full h-2 sm:h-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                              style={{
                                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((customDuration - 3) / 45) * 100}%, #e5e7eb ${((customDuration - 3) / 45) * 100}%, #e5e7eb 100%)`
                              }}
                            />
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-2">
                              <span>3m</span>
                              <span>12m</span>
                              <span>24m</span>
                              <span>36m</span>
                              <span>48m</span>
                            </div>
                          </div>
                        </div>

                        {/* Custom EMI Preview */}
                        {customEMIPreview && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700"
                          >
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                              <div className="text-center">
                                <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400 leading-tight">
                                  {formatPriceDisplay(customEMIPreview.monthlyEMI)}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-tight">Monthly EMI</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                                  {formatPriceDisplay(customEMIPreview.downPayment)}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-tight">Down Payment (20%)</div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleCustomDurationChange(customDuration)}
                              disabled={isCalculating}
                              className="w-full mt-3 sm:mt-4 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold text-sm sm:text-base rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                              {isCalculating ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>Calculating...</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                  <span>Select This Plan</span>
                                </>
                              )}
                            </button>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* EMI Benefits */}
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <h5 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center leading-tight">
                      <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-blue-500 flex-shrink-0" />
                      EMI Benefits
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300 leading-tight">No processing fees</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300 leading-tight">5-day grace period</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300 leading-tight">Secure payments</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  });

  // Prevent EMI dropdown from closing when enrollment type changes
  const handleEnrollmentTypeChange = useCallback((newType: EnrollmentType) => {
    setEnrollmentType(newType);
    // Keep EMI dropdown open if it was already open
    // Don't reset selectedInstallmentPlan to maintain user selection
  }, []);

  // Isolated EMI Options Component to prevent parent re-renders
  const EMIOptionsSection = React.memo(({ 
    plans, 
    selectedPlan, 
    onSelect,
    finalPrice,
    customMonths: parentCustomMonths,
    onCustomMonthsChange,
    showCustomInput,
    onToggleCustomInput
  }: { 
    plans: InstallmentPlan[], 
    selectedPlan: InstallmentPlan | null, 
    onSelect: (plan: InstallmentPlan) => void,
    finalPrice: number,
    customMonths: number,
    onCustomMonthsChange: (months: number) => void,
    showCustomInput: boolean,
    onToggleCustomInput: () => void
  }) => {
    // Local state for input to prevent parent updates
    const [localCustomMonths, setLocalCustomMonths] = useState(parentCustomMonths);
    
    // Sync with parent only when needed
    useEffect(() => {
      setLocalCustomMonths(parentCustomMonths);
    }, [parentCustomMonths]);

    const handleCustomMonthsChange = useCallback((months: number) => {
      if (months >= 3 && months <= 36) {
        onCustomMonthsChange(months);
        const customPlan = createCustomInstallmentPlan(months, finalPrice);
        onSelect(customPlan);
      }
    }, [finalPrice, onSelect, onCustomMonthsChange]);

    // Stable references to prevent re-renders
    const stablePlans = useMemo(() => plans, [JSON.stringify(plans.map(p => ({ id: p.id, installments: p.installments, installmentAmount: p.installmentAmount })))]);
    const stableSelectedPlan = useMemo(() => selectedPlan, [selectedPlan?.id, selectedPlan?.installments]);

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden mt-4"
        onMouseDown={(e) => e.preventDefault()}
        onTouchStart={(e) => e.preventDefault()}
      >
        <div 
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4"
          style={{ position: 'relative', zIndex: 10 }}
        >
          <div className="flex items-center mb-3">
            <Calculator className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
            <h4 className="text-base font-medium text-gray-900 dark:text-white">EMI Payment Options</h4>
          </div>
          
          {/* Preset Plans */}
          <div className="space-y-3 mt-3">
            {stablePlans.map((plan, index) => (
              <div
                key={`emi-plan-${plan.installments}`}
                                  className={`relative p-3 border rounded-lg cursor-pointer transition-all ${
                    stableSelectedPlan?.installments === plan.installments && !stableSelectedPlan?.id.includes('custom')
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
                        20% down payment + {plan.installments} EMIs
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold text-${primaryColor}-600 dark:text-${primaryColor}-400`}>
                      {formatPriceDisplay(plan.installmentAmount)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      per month
                    </div>
                  </div>
                  {stableSelectedPlan?.installments === plan.installments && !stableSelectedPlan?.id.includes('custom') && (
                    <div className={`absolute -right-1 -top-1 p-1 rounded-full bg-${primaryColor}-500 text-white`}>
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Custom Month Selection */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Custom Duration</span>
              <button
                type="button"
                onClick={onToggleCustomInput}
                className={`text-sm font-medium text-${primaryColor}-600 dark:text-${primaryColor}-400 hover:underline`}
              >
                {showCustomInput ? 'Hide' : 'Customize'}
              </button>
            </div>
            
            {showCustomInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <label className="text-sm text-gray-600 dark:text-gray-400 min-w-0 flex-shrink-0">
                    Months (3-36):
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="36"
                    value={localCustomMonths}
                    onChange={(e) => {
                      const months = parseInt(e.target.value);
                      if (!isNaN(months)) {
                        setLocalCustomMonths(months);
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter months"
                  />
                  <button
                    type="button"
                    onClick={() => handleCustomMonthsChange(localCustomMonths)}
                    className={`px-4 py-2 bg-${primaryColor}-600 text-white text-sm font-medium rounded-md hover:bg-${primaryColor}-700 transition-colors`}
                  >
                    Apply
                  </button>
                </div>
                
                {localCustomMonths >= 3 && localCustomMonths <= 36 && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Custom Plan Preview:</div>
                                         <div className="grid grid-cols-2 gap-2 text-sm">
                       <div>
                         <span className="text-gray-500 dark:text-gray-400">Down Payment (20%):</span>
                         <div className="font-medium">{formatPriceDisplay(Math.round(finalPrice * 0.2))}</div>
                       </div>
                       <div>
                         <span className="text-gray-500 dark:text-gray-400">Monthly EMI:</span>
                         <div className="font-medium">{formatPriceDisplay(Math.ceil((finalPrice * 0.8) / localCustomMonths))}</div>
                       </div>
                     </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Selected Plan Details */}
          {stableSelectedPlan && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Selected Plan Summary</h5>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-gray-400">Total Amount</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatPriceDisplay(stableSelectedPlan.totalAmount)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-gray-400">Down Payment (20%)</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatPriceDisplay(stableSelectedPlan.downPayment)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-gray-400">Monthly EMI</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatPriceDisplay(stableSelectedPlan.installmentAmount)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-gray-400">Duration</span>
                    <span className="font-medium text-gray-900 dark:text-white">{stableSelectedPlan.installments} months</span>
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <Info className="h-3 w-3 mr-1" />
                    {stableSelectedPlan.gracePeriodDays} days grace period for each payment • No processing fees
                  </span>
                </div>
              </div>
            </motion.div>
          )}
          
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
  });

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 overflow-hidden enrollment-section w-full">
        {/* Header section */}
        <div className={`px-4 sm:px-6 py-3 sm:py-4 ${bgClass} border-b ${borderClass} flex items-center justify-between`}>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center leading-tight">
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
            <span className="hidden xs:inline">
              {isBlendedCourse ? 'Enrollment' : 'Enrollment Options'}
            </span>
            <span className="xs:hidden">Enroll</span>
          </h3>
          {/* Badge showing enrollment type */}
          <div className="inline-flex items-center justify-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white dark:bg-gray-700 text-xs font-medium shadow-sm">
            <span className={`${colorClass} font-semibold`}>
              {isBlendedCourse ? 'Individual' : (enrollmentType === 'individual' ? 'Individual' : 'Batch')}
            </span>
          </div>
        </div>
        
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Enrollment Type Selection - Only show for non-blended courses */}
          {!isBlendedCourse && (
            <div className="flex w-full rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
              <button
                onClick={() => handleEnrollmentTypeChange('individual')}
                className={`flex-1 py-3 sm:py-4 px-2 sm:px-3 flex flex-col items-center justify-center transition duration-200 ${
                  enrollmentType === 'individual' 
                    ? `${bgClass} ${colorClass} font-medium` 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                aria-pressed={enrollmentType === 'individual'}
                aria-label="Select individual enrollment"
              >
                <User className={`h-5 w-5 sm:h-6 sm:w-6 mb-1.5 sm:mb-2 ${enrollmentType === 'individual' ? colorClass : ''}`} />
                <span className="text-xs sm:text-sm font-medium leading-tight">Individual</span>
                {activePricing && (
                  <span className="text-xs mt-1 sm:mt-1.5 font-semibold leading-tight">
                    {formatPriceDisplay(activePricing.individual)}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleEnrollmentTypeChange('batch')}
                className={`flex-1 py-3 sm:py-4 px-2 sm:px-3 flex flex-col items-center justify-center transition duration-200 ${
                  enrollmentType === 'batch' 
                    ? `${bgClass} ${colorClass} font-medium` 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                aria-pressed={enrollmentType === 'batch'}
                aria-label="Select batch enrollment"
              >
                <Users className={`h-5 w-5 sm:h-6 sm:w-6 mb-1.5 sm:mb-2 ${enrollmentType === 'batch' ? colorClass : ''}`} />
                <span className="text-xs sm:text-sm font-medium leading-tight">Batch/Group</span>
                {activePricing && (
                  <span className="text-xs mt-1 sm:mt-1.5 font-semibold leading-tight">
                    {formatPriceDisplay(activePricing.batch)} per person
                  </span>
                )}
              </button>
            </div>
          )}
          
          {/* Individual Option Card for Blended Courses */}
          {isBlendedCourse && (
            <div className="rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className={`py-3 sm:py-4 px-4 sm:px-5 flex flex-col items-center justify-center ${bgClass}`}>
                <User className={`h-6 w-6 sm:h-7 sm:w-7 mb-1.5 sm:mb-2 ${colorClass}`} />
                <span className="text-sm sm:text-base font-medium leading-tight">Individual Enrollment</span>
                {activePricing && (
                  <span className="text-sm mt-1 sm:mt-1.5 font-semibold leading-tight">
                    {formatPriceDisplay(activePricing.individual)}
                  </span>
                )}
              </div>
              <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <p className="flex items-center">
                  <Info className="w-3.5 h-3.5 mr-1.5 text-blue-500 flex-shrink-0" />
                  This course is designed for individual enrollment with personalized learning experience.
                </p>
              </div>
            </div>
          )}
          
          {/* Course Price - Enhanced for clarity on mobile */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={enrollmentType}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/80 dark:to-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium mb-1 leading-tight">
                  {isBlendedCourse ? 'Individual Price' : (enrollmentType === 'individual' ? 'Individual Price' : 'Batch Price (per person)')}
                </p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h4 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent leading-tight">
                    {courseDetails?.isFree ? "Free" : formatPriceDisplay(getFinalPrice())}
                  </h4>
                  
                  {originalPrice && originalPrice > getFinalPrice() && (
                    <span className="text-xs sm:text-sm text-gray-500 line-through">
                      {formatPriceDisplay(originalPrice)}
                    </span>
                  )}
                  
                  {discountPercentage && discountPercentage > 0 && (
                    <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/40 dark:text-green-400 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                      Save {discountPercentage}%
                    </span>
                  )}
                </div>
                {/* Only show min students for batch enrollment in non-blended courses */}
                {enrollmentType === 'batch' && !isBlendedCourse && activePricing && (
                  <p className="text-xs text-gray-500 mt-1.5 sm:mt-2 flex items-center leading-tight">
                    <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 flex-shrink-0" />
                    Min {activePricing.min_batch_size} students required
                  </p>
                )}
              </div>
              <div className={`p-2.5 sm:p-3 rounded-full ${bgClass} shadow-md flex-shrink-0`}>
                <CreditCard className={`h-6 w-6 sm:h-7 sm:w-7 ${colorClass}`} />
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Modern EMI Component */}
          {isInstallmentAvailable && (
            <ModernEMIComponent
              installmentPlans={installmentPlans}
              selectedInstallmentPlan={selectedInstallmentPlan}
              onSelectPlan={selectInstallmentPlan}
              finalPrice={stableFinalPrice}
              primaryColor={primaryColor}
              formatPriceDisplay={formatPriceDisplay}
              createCustomInstallmentPlan={createCustomInstallmentPlan}
            />
          )}
          
          {/* Course Details List - More readable on mobile */}
          <div className="space-y-2 sm:space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-5">
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow">
              <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base font-medium flex items-center leading-tight">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-2.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                Duration
              </span>
              <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base leading-tight">{formattedDuration}</span>
            </div>
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow">
              <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base font-medium flex items-center leading-tight">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-2.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                Grade
              </span>
              <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base leading-tight">
                {grade}
              </span>
            </div>
          </div>
          
          {/* Course Features - More compact and well structured */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-2 sm:mb-3 flex items-center leading-tight">
              <ThumbsUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-green-500 flex-shrink-0" />
              What you'll get
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {courseFeatures.map((feature: string, index: number) => (
                <div 
                  key={index}
                  className="flex items-center text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 p-2.5 sm:p-3 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium leading-tight">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Enroll Button - Update label for blended courses */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEnrollClick}
            disabled={loading}
            className={`w-full py-3 sm:py-4 px-4 sm:px-5 bg-gradient-to-r from-${primaryColor}-600 to-${primaryColor}-700 hover:from-${primaryColor}-700 hover:to-${primaryColor}-800 text-white font-semibold text-base sm:text-lg rounded-lg sm:rounded-xl flex items-center justify-center shadow-md transition-all duration-300 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            aria-label={isLoggedIn ? (courseDetails?.isFree ? 'Enroll for free' : 'Enroll now') : 'Login to enroll'}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              <>
                {isLoggedIn ? (
                  <>
                    <span className="leading-tight">
                      {courseDetails?.isFree ? 'Enroll for Free' : 
                        selectedInstallmentPlan ? `Pay ${formatPriceDisplay(selectedInstallmentPlan.downPayment)} now (20% down)` : 'Enroll Now'}
                    </span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex-shrink-0" />
                  </>
                ) : (
                  <>
                    <span className="leading-tight">Login to Enroll</span>
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex-shrink-0" />
                  </>
                )}
              </>
            )}
          </motion.button>
          
          {/* Payment info with installment badge */}
          {!courseDetails?.isFree && (
            <div className="text-center text-xs p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-center mb-1.5">
                <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-gray-400 flex-shrink-0" />
                <span className="text-gray-500 dark:text-gray-400 leading-tight">Secure payment powered by Razorpay</span>
              </div>
              {isInstallmentAvailable && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 sm:px-2 py-0.5 rounded text-xs leading-tight">EMI Available</span>
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1.5 sm:px-2 py-0.5 rounded text-xs leading-tight">No Processing Fee</span>
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-1.5 sm:px-2 py-0.5 rounded text-xs leading-tight">20% Down Payment</span>
                </div>
              )}
            </div>
          )}
          
          {/* Fast Track Option - Enhanced mobile visibility */}
          <motion.div
            className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-gray-800 dark:to-amber-900/10 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-amber-100 dark:border-amber-800/30 text-center">
              <div className="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-amber-100/80 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-300 text-xs font-medium mb-2 sm:mb-2.5">
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 flex-shrink-0" />
                Fast Track Available
              </div>
              <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
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
        pricePaid={formatPriceDisplay(getFinalPrice())}
      />
    </>
  );
};

export default EnrollmentDetails; 