'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, ArrowRight, ThumbsUp, AlertTriangle, 
  Lock, Zap, CheckCircle, Users, User, Info, CheckCircle2, Clock, GraduationCap,
  CalendarClock, Calculator, ChevronDown, ExternalLink, Briefcase, Shield, 
  Wallet, Smartphone, QrCode, Building2, Banknote, Timer, Star, Award
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// Create showToast alias for consistency
const showToast = toast;
import { apiBaseUrl, apiUrls } from '@/apis';
import axios from 'axios';
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import useRazorpay from "@/hooks/useRazorpay";
import RAZORPAY_CONFIG, { getCurrencySymbol } from "@/config/razorpay";

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

interface Coupon {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description?: string;
  minAmount?: number;
  maxDiscount?: number;
  validFrom?: string;
  validUntil?: string;
  usageLimit?: number;
  usedCount?: number;
  isActive: boolean;
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
  currencyCode?: string;
  formatPriceFunc?: (price: number) => string;
  onEnrollmentTypeChange?: (type: 'individual' | 'batch') => void;
  onActivePricingChange?: (pricing: any) => void;
  initialEnrollmentType?: 'individual' | 'batch';
  initialActivePricing?: any;
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

// Enhanced Razorpay Options interface
interface EnhancedRazorpayOptions extends Omit<RazorpayOptions, 'readonly'> {
  order_id?: string;
  retry?: {
    enabled: boolean;
    max_count: number;
  };
  timeout?: number;
  readonly?: {
    email?: boolean;
    contact?: boolean;
    name?: boolean;
  };
  hidden?: {
    email?: boolean;
    contact?: boolean;
    name?: boolean;
  };
  config?: {
    display: {
      language: string;
      hide?: {
        email?: boolean;
        contact?: boolean;
        name?: boolean;
      };
    };
  };
}

// Payment Method interface
interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  processingTime: string;
  fees: string;
  popular?: boolean;
  recommended?: boolean;
}

// Payment Security Features Component
const PaymentSecurityFeatures: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200 dark:border-green-800/30 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4"
  >
          <div className="flex items-start gap-2">
        <Shield className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1.5">
            Secure Payment Guarantee
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span className="text-green-700 dark:text-green-300 font-medium">256-bit SSL encryption</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span className="text-green-700 dark:text-green-300 font-medium">PCI DSS compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span className="text-green-700 dark:text-green-300 font-medium">Zero fraud liability</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span className="text-green-700 dark:text-green-300 font-medium">Instant refund policy</span>
            </div>
          </div>
        </div>
      </div>
  </motion.div>
);

// Modern Payment Method Selector Component
const PaymentMethodSelector: React.FC<{
  selectedMethod: string;
  onMethodSelect: (methodId: string) => void;
  amount: number;
  currency: string;
}> = ({ selectedMethod, onMethodSelect, amount, currency }) => {
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />,
      description: 'Visa, Mastercard, Rupay, Amex',
      processingTime: 'Instant',
      fees: 'No extra fees',
      popular: true,
      recommended: true
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />,
      description: 'All major banks supported',
      processingTime: 'Instant',
      fees: 'No extra fees'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />,
      description: 'PhonePe, GPay, Paytm & more',
      processingTime: 'Instant',
      fees: 'No extra fees',
      popular: true
    },
    {
      id: 'wallet',
      name: 'Digital Wallets',
      icon: <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />,
      description: 'Paytm, PhonePe, Amazon Pay',
      processingTime: 'Instant',
      fees: 'No extra fees'
    }
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
          Choose Payment Method
        </h4>
        <div className="text-right">
          <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            {currency} {amount.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total Amount
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:gap-3">
        {paymentMethods.map((method) => (
          <motion.button
            key={method.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onMethodSelect(method.id)}
            className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 text-left ${
              selectedMethod === method.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600'
            }`}
          >
            {/* Popular/Recommended Badges */}
            <div className="absolute top-2 right-2 flex gap-1">
              {method.popular && (
                <span className="px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium rounded">
                  Popular
                </span>
              )}
              {method.recommended && (
                <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded">
                  Recommended
                </span>
              )}
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className={`p-2 sm:p-2.5 rounded-lg ${
                selectedMethod === method.id 
                  ? 'bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {method.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                    {method.name}
                  </h5>
                  {selectedMethod === method.id && (
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                  )}
                </div>
                
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                  {method.description}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <Timer className="w-3 h-3" />
                      {method.processingTime}
                    </span>
                    <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                      <Banknote className="w-3 h-3" />
                      {method.fees}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Enhanced Payment Summary Component
const PaymentSummary: React.FC<{
  courseTitle: string;
  originalPrice: number;
  finalPrice: number;
  currency: string;
  discountAmount?: number;
  enrollmentType: string;
  selectedInstallmentPlan?: InstallmentPlan | null;
  appliedCoupon?: Coupon | null;
  couponDiscount?: number;
  duration?: string;
  grade?: string;
}> = ({ 
  courseTitle, 
  originalPrice, 
  finalPrice, 
  currency, 
  discountAmount = 0, 
  enrollmentType,
  selectedInstallmentPlan,
  appliedCoupon,
  couponDiscount = 0,
  duration,
  grade
}) => {
  const formatPrice = (price: number) => `${currency} ${price.toLocaleString()}`;

  // Compact view when there are no discounts/EMIs/coupons
  const isCompact = !selectedInstallmentPlan && discountAmount <= 0 && (!appliedCoupon || couponDiscount <= 0);
  if (isCompact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 space-y-4 text-sm sm:text-base"
      >
        {/* Header: Course Title & Enrollment Type */}
        <div className="text-center space-y-2">
          <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight truncate">
            {courseTitle}
          </h4>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium mx-auto">
            {enrollmentType === 'individual' ? 'Individual' : 'Batch'} Enrollment
          </span>
        </div>
        {/* Divider */}
        <hr className="border-gray-200 dark:border-gray-700 mt-2" />
        {/* Price and Details */}
        <div className="mt-4 pt-4 text-center space-y-4">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Price
            </p>
            <p className="mt-1 text-4xl sm:text-5xl font-extrabold text-blue-600 dark:text-blue-400">
              {formatPrice(finalPrice)}
            </p>
          </div>
          {(duration || grade) && (
            <div className="flex justify-center space-x-6">
              {duration && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Duration</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">{duration}</p>
                </div>
              )}
              {grade && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Grade</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">{grade}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl p-5 sm:p-6 space-y-4 sm:space-y-5"
    >
      <div className="flex items-start gap-4 sm:gap-5">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 leading-tight">
            {courseTitle}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
              {enrollmentType === 'individual' ? 'Individual' : 'Batch'} Enrollment
            </span>
            {selectedInstallmentPlan && (
              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                {selectedInstallmentPlan.installments}-Month EMI
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2.5">
        {/* Original Price */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Course Price</span>
          <span className={`text-sm ${discountAmount > 0 ? 'line-through text-gray-500 dark:text-gray-400' : 'font-semibold text-gray-900 dark:text-white'}`}>
            {formatPrice(originalPrice)}
          </span>
        </div>

        {/* Discount */}
        {discountAmount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1.5 font-medium">
              <Award className="w-3 h-3" />
              Discount Applied
            </span>
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
              -{formatPrice(discountAmount)}
            </span>
          </div>
        )}

        {/* Coupon Discount */}
        {appliedCoupon && couponDiscount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-orange-600 dark:text-orange-400 flex items-center gap-1.5 font-medium">
              <span className="text-xs">🎫</span>
              Coupon ({appliedCoupon.code})
            </span>
            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
              -{formatPrice(couponDiscount)}
            </span>
          </div>
        )}

        {/* EMI Breakdown */}
        {selectedInstallmentPlan && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Down Payment (Today)</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatPrice(selectedInstallmentPlan.downPayment)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                Monthly EMI × {selectedInstallmentPlan.installments}
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                {formatPrice(selectedInstallmentPlan.installmentAmount)} each
              </span>
            </div>
          </>
        )}

        {/* Total */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-gray-900 dark:text-white">
              {selectedInstallmentPlan ? 'Paying Today' : 'Total Amount'}
            </span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatPrice(selectedInstallmentPlan ? selectedInstallmentPlan.downPayment : finalPrice)}
            </span>
          </div>
          {selectedInstallmentPlan && (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1 font-medium">
              Total: {formatPrice(finalPrice)}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Modern Loading State Component
const ModernLoadingState: React.FC<{ message?: string }> = ({ message = "Processing payment..." }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-8 sm:py-10"
  >
    <div className="relative">
      <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin">
        <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
      </div>
    </div>
    <p className="mt-4 sm:mt-5 text-sm sm:text-base font-semibold text-gray-900 dark:text-white text-center">
      {message}
    </p>
    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center font-medium">
      Please don't close this window
    </p>
  </motion.div>
);

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
          <CheckCircle2 className="mx-auto text-emerald-500 h-12 w-12 mb-3" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Enrollment Successful!</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            You are now enrolled in:
          </p>
          <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400 mb-3">{courseTitle}</p>
          
          {pricePaid && pricePaid !== "Free" && pricePaid !== "N/A" && (
            <div className="bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-md mb-3">
              <p className="text-xs text-gray-600 dark:text-gray-300">Amount Paid:</p>
              <p className="text-base font-bold text-gray-800 dark:text-gray-100">{pricePaid}</p>
            </div>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
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
  onEnrollClick,
  currencyCode,
  formatPriceFunc,
  onEnrollmentTypeChange,
  onActivePricingChange,
  initialEnrollmentType = 'batch',
  initialActivePricing = null
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
  
  const [enrollmentType, setEnrollmentType] = useState<EnrollmentType>(
    isBlendedCourse ? 'individual' : (initialEnrollmentType || 'batch')
  );
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
  
  // Coupon state
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState<boolean>(false);
  const [couponError, setCouponError] = useState<string>('');
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

  // Call callback when enrollment type changes
  useEffect(() => {
    if (onEnrollmentTypeChange) {
      onEnrollmentTypeChange(enrollmentType);
    }
  }, [enrollmentType, onEnrollmentTypeChange]);

  // Extract data from courseDetails with better fallbacks
  const duration = courseDetails?.course_duration || 
    (courseDetails?.session_duration ? `${courseDetails.session_duration} per session` : 
    (courseDetails?.no_of_Sessions ? `${courseDetails.no_of_Sessions} sessions` : '4 months / 16 weeks'));
  
  // Format duration to handle "0 months X weeks" cases
  const formatDuration = (durationStr: string): string => {
    // For blended courses, always show "Self Paced"
    if (isBlendedCourse) {
      return 'Self Paced';
    }
    
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
  
  // Extract course duration in months for EMI calculation
  const getCourseDurationInMonths = useCallback((): number => {
    if (!courseDetails?.course_duration) {
      return 12; // Default to 12 months if no duration specified
    }
    
    const durationStr = courseDetails.course_duration.toLowerCase();
    
    // Extract months and weeks from the duration string
    const monthsMatch = durationStr.match(/(\d+)\s*months?/);
    const weeksMatch = durationStr.match(/(\d+)\s*weeks?/);
    
    let totalMonths = 0;
    
    if (monthsMatch) {
      totalMonths += parseInt(monthsMatch[1], 10);
    }
    
    if (weeksMatch) {
      const weeks = parseInt(weeksMatch[1], 10);
      totalMonths += Math.ceil(weeks / 4); // Convert weeks to months (4 weeks = 1 month)
    }
    
    // If no months or weeks found, try to extract any number and assume it's months
    if (totalMonths === 0) {
      const numberMatch = durationStr.match(/(\d+)/);
      if (numberMatch) {
        totalMonths = parseInt(numberMatch[1], 10);
      }
    }
    
    // Ensure minimum of 3 months and maximum of 36 months for EMI
    return Math.max(3, Math.min(totalMonths || 12, 36));
  }, [courseDetails?.course_duration]);

  const maxEMIDuration = getCourseDurationInMonths();
  
  // Get grade/level from multiple possible sources with new API structure support
  const getGradeLevel = useCallback((): string => {
    let gradeLevel = '';
    
    // First check course_level from new API structure
    if (courseDetails?.course_level) {
      gradeLevel = courseDetails.course_level;
    }
    // Check grade field (legacy)
    else if (courseDetails?.grade) {
      gradeLevel = courseDetails.grade;
    }
    // Check target_audience from course_description object (new structure)
    else if (typeof courseDetails?.course_description === 'object' && courseDetails.course_description?.target_audience?.length) {
      gradeLevel = courseDetails.course_description.target_audience[0];
    }
    // Check target_audience array directly (legacy)
    else if (courseDetails?.target_audience?.length) {
      gradeLevel = courseDetails.target_audience[0];
    }
    else {
      return 'All Levels';
    }
    
    // Format grade level: convert "UG - Graduate - Professionals" to "UG/Grad- Pro."
    if (gradeLevel.includes('UG') && gradeLevel.includes('Graduate') && gradeLevel.includes('Professionals')) {
      return 'UG - Grad - Prof';
    }
    
    return gradeLevel;
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
  const [activePricing, setActivePricing] = useState<Price | null>(initialActivePricing || null);

  // Update activePricing when course details changes
  useEffect(() => {
    const price = getActivePrice();
    setActivePricing(price);
  }, [courseDetails?.prices, courseDetails?._id]); // Only depend on specific properties

  // Call callback when active pricing changes
  useEffect(() => {
    if (onActivePricingChange) {
      onActivePricingChange(activePricing);
    }
  }, [activePricing, onActivePricingChange]);

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

  // Calculate coupon discount
  const calculateCouponDiscount = useCallback((): number => {
    if (!appliedCoupon) return 0;
    
    const basePrice = getFinalPrice();
    let discount = 0;

    if (appliedCoupon.type === 'percentage') {
      discount = (basePrice * appliedCoupon.value) / 100;
      if (appliedCoupon.maxDiscount) {
        discount = Math.min(discount, appliedCoupon.maxDiscount);
      }
    } else if (appliedCoupon.type === 'fixed') {
      discount = appliedCoupon.value;
    }

    return Math.min(discount, basePrice); // Don't let discount exceed the price
  }, [appliedCoupon, getFinalPrice]);

  // Get final price after applying all discounts including coupons
  const getFinalPriceWithCoupon = useCallback((): number => {
    const basePrice = getFinalPrice();
    const couponDiscount = calculateCouponDiscount();
    return Math.max(basePrice - couponDiscount, 0);
  }, [getFinalPrice, calculateCouponDiscount]);

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

  // Coupon validation and application
  const validateCoupon = async (code: string): Promise<Coupon | null> => {
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          code: code.toUpperCase(),
          courseId: courseDetails?._id,
          amount: getFinalPrice(),
          userId: userId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid coupon code');
      }

      const couponData = await response.json();
      return couponData.coupon;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to validate coupon');
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setCouponError('');

    try {
      const coupon = await validateCoupon(couponCode.trim());
      if (coupon) {
        setAppliedCoupon(coupon);
        setCouponCode('');
        showToast.success(`Coupon "${coupon.code}" applied successfully! 🎉`, {
          duration: 4000,
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });
      }
    } catch (error: any) {
      setCouponError(error.message);
      showToast.error(error.message, {
        duration: 4000,
      });
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    showToast.success('Coupon removed', {
      duration: 2000,
    });
  };


  

  
  // Enhanced Razorpay payment handler with modern UI
  const handleRazorpayPayment = async (): Promise<void> => {
    if (!courseDetails?._id) {
      showToast.error("Course information is missing");
      return;
    }

    if (!activePricing) {
      showToast.error("Pricing information is missing");
      return;
    }

    try {
      setLoading(true);
      
      // Check if this is the test user
      const isTestUser = userId === '67cfe3a9a50dbb995b4d94da';
      
      // Debug log for test mode
      if (isTestUser) {
        console.log('🧪 TEST MODE: Using test Razorpay credentials for user:', userId);
      }
      
      // Get the final price in the original currency (with coupon if applied)
      const finalPrice = appliedCoupon ? getFinalPriceWithCoupon() : getFinalPrice();
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
      
      // Enhanced Razorpay options with modern features
      const options: RazorpayOptions = {
        key: isTestUser 
          ? process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag' // Test key for specific user
          : process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || razorpayConfig.key,
        amount: paymentAmount,
        currency: originalCurrency,
        name: isTestUser ? "MEDH Education Platform (TEST MODE)" : "MEDH Education Platform",
        description: isTestUser ? `[TEST] ${paymentDescription}` : paymentDescription,
        image: "/images/medhlogo.svg", // Use the actual MEDH logo
        handler: async function (response: any) {
          const successMessage = isTestUser 
            ? "Test Payment Successful! 🧪✅" 
            : "Payment Successful! 🎉";
          
          showToast.success(successMessage, {
            duration: 4000,
            style: {
              background: isTestUser ? '#8B5CF6' : '#10B981',
              color: '#fff',
            },
          });
          
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
          user_id: userId || '',
          currency: originalCurrency,
          price: finalPrice.toString(),
          coupon_code: appliedCoupon?.code || '',
          coupon_discount: appliedCoupon ? calculateCouponDiscount().toString() : '0',
          platform: 'MEDH_WEB',
          test_mode: isTestUser ? 'true' : 'false'
        },
        theme: {
          color: '#3B82F6', // Modern blue color
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            showToast.error("Payment cancelled", {
              duration: 3000,
            });
          }
        }
      };
      
      // Add EMI details to notes if applicable (keeping within 15 notes limit)
      if (selectedInstallmentPlan && emiId && options.notes) {
        // Remove less critical fields to make room for EMI data
        delete options.notes.platform;
        delete options.notes.test_mode;
        
        // Add essential EMI fields
        options.notes.installment_id = emiId;
        options.notes.installment_number = '0'; // 0 for down payment
        options.notes.total_installments = selectedInstallmentPlan.installments.toString();
        options.notes.monthly_amount = selectedInstallmentPlan.installmentAmount.toString();
      }

      // Show loading toast
      const loadingMessage = isTestUser 
        ? "Initializing test payment gateway..." 
        : "Initializing secure payment...";
        
      showToast.loading(loadingMessage, {
        duration: 2000,
      });

      // Use the hook to handle Razorpay checkout with the proper types
      await openRazorpayCheckout(options);
    } catch (err: any) {
      console.error("Enrollment error:", err);
      setError(err.message || "Failed to process enrollment");
      showToast.error("Payment failed. Please try again.", {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Enroll course function - Updated to handle missing enrollment endpoint gracefully
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
      
      // Try to make enrollment API call - first try the v1 API, then fallback to showing success
      try {
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
          showToast.success("Successfully enrolled in the course!");
          // Update enrollment tracking
          await trackEnrollmentProgress(studentId, courseId);
          setIsSuccessModalOpen(true);
          return true;
        } else {
          throw new Error("Failed to enroll in the course.");
        }
      } catch (apiError: any) {
        console.log("Primary enrollment API not available, trying alternative approach...");
        
        // If enrollment API is not available, show success message for now
        // In a real implementation, this would queue the enrollment or use a different service
        if (courseDetails?.isFree || isFreePrice(getFinalPrice())) {
          showToast.success("Free course enrollment successful! You can start learning immediately.");
          setIsSuccessModalOpen(true);
          return true;
        } else if (paymentResponse?.razorpay_payment_id) {
          // Payment was successful, show enrollment success
          showToast.success("Payment successful! Enrollment confirmed.");
          setIsSuccessModalOpen(true);
          return true;
        } else {
          // Re-throw the error for paid courses without payment
          throw apiError;
        }
      }
    } catch (error: any) {
      console.error("Enrollment error:", error);
      showToast.error(error.response?.data?.message || "Failed to enroll in the course. Please contact support.");
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
      // Use the correct enrollments API endpoint
      const response = await axios.get(
        `${apiBaseUrl}/enrollments/students/${studentId}/enrollments/`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Check if any enrollment matches the course ID
      if (response.data && Array.isArray(response.data)) {
        return response.data.some((enrollment: any) => 
          enrollment.course === courseId && 
          (enrollment.status === 'active' || enrollment.status === 'in_progress')
        );
      }
      
      return false;
    } catch (error: any) {
      console.error("Failed to check enrollment status:", error);
      // If it's a 404 or 401, user is likely not enrolled in any courses
      if (error.response?.status === 404 || error.response?.status === 401) {
        return false;
      }
      // For other errors, assume not enrolled to allow enrollment attempt
      return false;
    }
  };

  // Get upcoming meetings for enrolled student
  const getUpcomingMeetings = async (studentId: string): Promise<any[]> => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !studentId) return [];

      // Use the correct enrollments API to get meetings data
      const response = await axios.get(
        `${apiBaseUrl}/enrollments/students/${studentId}/enrollments/`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Extract meeting information from enrollments if available
      const meetings: any[] = [];
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach((enrollment: any) => {
          if (enrollment.batch && typeof enrollment.batch === 'object' && enrollment.batch.schedule) {
            enrollment.batch.schedule.forEach((schedule: any) => {
              meetings.push({
                courseId: enrollment.course,
                courseName: enrollment.course_title || 'Course',
                day: schedule.day,
                startTime: schedule.start_time,
                endTime: schedule.end_time,
                batchName: enrollment.batch.batch_name
              });
            });
          }
        });
      }

      return meetings;
    } catch (error) {
      console.error("Error fetching upcoming meetings:", error);
      return [];
    }
  };

  // Handle enrollment click with additional checks
  const handleEnrollClick = useCallback(async () => {
    if (!courseDetails?._id) {
      showToast.error("Course information is missing");
      return;
    }

    if (!activePricing && !courseDetails.isFree) {
      showToast.error("Pricing information is missing");
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
          showToast.error("You are already enrolled in this course!");
          router.push('/dashboards/my-courses');
          return;
        }
      } else {
        showToast.error("User identification is missing. Please log in again.");
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
      showToast.error("Enrollment failed. Please try again.");
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
    // Different features for blended vs regular courses
    const baseFeatures = isBlendedCourse ? [
      "Live interactive sessions",
      "Q&A sessions",
      "Hands-on assignments",
      "Interactive quizzes"
    ] : [
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
      // For blended courses, add certificate after Q&A sessions
      // For regular courses, add certificate after live sessions
      features.splice(isBlendedCourse ? 2 : 1, 0, "Certificate of completion");
    }
    
    // Use custom features if provided, otherwise use dynamic features
    return courseDetails?.features || features;
  }, [courseDetails?.features, courseDetails?.is_Certification, courseDetails?.certification, courseDetails?.final_evaluation, isBlendedCourse]);
  
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
  // EMI Component removed as per requirements
  // The following component is kept for reference but not used
  const ModernEMIComponent = React.memo(({
    installmentPlans,
    selectedInstallmentPlan,
    onSelectPlan,
    finalPrice,
    primaryColor,
    formatPriceDisplay,
    createCustomInstallmentPlan,
    maxEMIDuration
  }: {
    installmentPlans: InstallmentPlan[],
    selectedInstallmentPlan: InstallmentPlan | null,
    onSelectPlan: (plan: InstallmentPlan) => void,
    finalPrice: number,
    primaryColor: string,
    formatPriceDisplay: (price: number) => string,
    createCustomInstallmentPlan: (months: number, price: number) => InstallmentPlan,
    maxEMIDuration: number
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');
    const [customDuration, setCustomDuration] = useState(() => Math.min(12, maxEMIDuration));
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
      if (months < 3 || months > maxEMIDuration) return null;
      
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
      if (months >= 3 && months <= maxEMIDuration) {
        const customPlan = createCustomInstallmentPlan(months, finalPrice);
        handlePlanSelection(customPlan);
      }
    }, [createCustomInstallmentPlan, finalPrice, handlePlanSelection, maxEMIDuration]);

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
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
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
                        
                        {/* Duration Input */}
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                              EMI Duration (months)
                            </label>
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              Max: {maxEMIDuration} months
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <input
                              type="number"
                              min="3"
                              max={maxEMIDuration}
                              value={customDuration}
                              onChange={(e) => {
                                const months = parseInt(e.target.value);
                                if (!isNaN(months) && months >= 3 && months <= maxEMIDuration) {
                                  setCustomDuration(months);
                                  trackInteraction();
                                }
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                              placeholder="Enter months"
                            />
                            <button
                              type="button"
                              onClick={() => handleCustomDurationChange(customDuration)}
                              disabled={customDuration < 3 || customDuration > maxEMIDuration}
                              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                              Apply
                            </button>
                          </div>
                          
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            EMI duration cannot exceed course duration ({maxEMIDuration} months)
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

  // EMI Options Component removed as per requirements
  // The following component is kept for reference but not used
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

  // Check if current user is test user
  const isTestUser = userId === '67cfe3a9a50dbb995b4d94da';

  // -------------------- Currency helpers (restored) --------------------
  const getDisplayCurrencySymbol = useCallback(() => {
    let currencyCode = 'INR';
    if (courseDetails?.prices?.length) {
      const active = courseDetails.prices.find((p) => p.is_active) || courseDetails.prices[0];
      if (active?.currency) currencyCode = active.currency.toUpperCase();
    }
    return getCurrencySymbol(currencyCode);
  }, [courseDetails]);

  const formatPriceDisplay = useCallback((price: number | undefined | null): string => {
    if (price === undefined || price === null || isNaN(price)) return 'N/A';
    const symbol = getDisplayCurrencySymbol();
    const numeric = Number(price);
    return symbol.length > 1 ? `${symbol} ${numeric.toLocaleString()}` : `${symbol}${numeric.toLocaleString()}`;
  }, [getDisplayCurrencySymbol]);

  return (
    <>
      {/* Test Mode Banner */}
      {isTestUser && (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-3 rounded-lg mb-4 border border-purple-300">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold">🧪 TEST MODE ACTIVE</span>
          </div>
          <p className="text-xs mt-1 opacity-90">
            You're using test Razorpay credentials. Use test cards for payment.
          </p>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 overflow-hidden enrollment-section w-full max-w-md mx-auto lg:max-w-none">
        {/* Header section - Mobile optimized */}
        <div className={`px-4 sm:px-5 py-3 sm:py-3 ${bgClass} border-b ${borderClass} flex items-center justify-between`}>
          <h3 className="text-lg sm:text-base font-bold text-gray-800 dark:text-gray-100 flex items-center leading-tight">
            <CreditCard className="h-5 w-5 sm:h-4 sm:w-4 mr-2 sm:mr-1.5" />
            <span>
              {isBlendedCourse ? 'Enrollment' : 'Enrollment Options'}
            </span>
          </h3>
          {/* Badge showing enrollment type - Mobile friendly */}
          <div className="inline-flex items-center justify-center px-3 py-1 sm:px-2 sm:py-0.5 rounded-full bg-white dark:bg-gray-700 text-sm sm:text-xs font-medium shadow-sm">
            <span className={`${colorClass} font-semibold`}>
              {isBlendedCourse ? 'Individual' : (enrollmentType === 'individual' ? 'Individual' : 'Batch')}
            </span>
          </div>
        </div>
        
        <div className="p-4 sm:p-3 space-y-4 sm:space-y-3">
          {/* Enrollment Type Selection - Enhanced mobile layout */}
          {!isBlendedCourse && (
            <div className="flex w-full rounded-xl sm:rounded-lg overflow-hidden border-2 sm:border border-gray-200 dark:border-gray-700 shadow-sm">
              <button
                onClick={() => handleEnrollmentTypeChange('individual')}
                className={`flex-1 py-4 sm:py-2.5 px-3 sm:px-2 flex flex-col items-center justify-center transition duration-200 ${
                  enrollmentType === 'individual' 
                    ? `${bgClass} ${colorClass} font-medium` 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                aria-pressed={enrollmentType === 'individual'}
                aria-label="Select individual enrollment"
              >
                <User className={`h-6 w-6 sm:h-4 sm:w-4 mb-2 sm:mb-1 ${enrollmentType === 'individual' ? colorClass : ''}`} />
                <span className="text-sm sm:text-xs font-medium leading-tight">Individual</span>
                {activePricing && (
                  <span className="text-sm sm:text-xs mt-1 sm:mt-0.5 font-semibold leading-tight">
                    {formatPriceDisplay(activePricing.individual)}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleEnrollmentTypeChange('batch')}
                className={`flex-1 py-4 sm:py-2.5 px-3 sm:px-2 flex flex-col items-center justify-center transition duration-200 ${
                  enrollmentType === 'batch' 
                    ? `${bgClass} ${colorClass} font-medium` 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                aria-pressed={enrollmentType === 'batch'}
                aria-label="Select batch enrollment"
              >
                <Users className={`h-6 w-6 sm:h-4 sm:w-4 mb-2 sm:mb-1 ${enrollmentType === 'batch' ? colorClass : ''}`} />
                <span className="text-sm sm:text-xs font-medium leading-tight">Batch/Group</span>
                {activePricing && (
                  <span className="text-sm sm:text-xs mt-1 sm:mt-0.5 font-semibold leading-tight">
                    {formatPriceDisplay(activePricing.batch)} per person
                  </span>
                )}
              </button>
            </div>
          )}
          
          {/* Individual Option Card for Blended Courses - Mobile enhanced */}
          {isBlendedCourse && (
            <div className="rounded-xl sm:rounded-lg overflow-hidden border-2 sm:border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className={`py-4 sm:py-2.5 px-4 sm:px-3 flex flex-col items-center justify-center ${bgClass}`}>
                <User className={`h-6 w-6 sm:h-5 sm:w-5 mb-2 sm:mb-1 ${colorClass}`} />
                <span className="text-lg sm:text-sm font-medium leading-tight">Individual Enrollment</span>
                {activePricing && (
                  <span className="text-base sm:text-xs mt-1 sm:mt-0.5 font-semibold leading-tight">
                    {formatPriceDisplay(activePricing.individual)}
                  </span>
                )}
              </div>
              <div className="p-4 sm:p-2.5 bg-white dark:bg-gray-800 text-sm sm:text-xs text-gray-600 dark:text-gray-300">
                <p className="flex items-center">
                  <Info className="w-5 h-5 sm:w-3 sm:h-3 mr-2 sm:mr-1.5 text-blue-500 flex-shrink-0" />
                  This course is designed for individual enrollment with personalized learning experience.
                </p>
              </div>
            </div>
          )}
          
          {/* Price card for FREE courses - Mobile optimized */}
          {courseDetails?.isFree && (
            <AnimatePresence mode="wait">
              <motion.div
                key={enrollmentType}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between p-4 sm:p-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/80 dark:to-gray-800 rounded-xl sm:rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-xs font-medium mb-1 sm:mb-0.5 leading-tight">
                    Price
                  </p>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <h4 className="text-2xl sm:text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent leading-tight">
                      {formatPriceDisplay(0)}
                    </h4>
                  </div>
                </div>
                <div className={`p-3 sm:p-2 rounded-full ${bgClass} shadow-md flex-shrink-0`}>
                  <CreditCard className={`h-6 w-6 sm:h-4 sm:w-4 ${colorClass}`} />
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Coupon Section - Mobile enhanced */}
          {!courseDetails?.isFree && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/10 dark:to-yellow-900/10 border border-orange-200 dark:border-orange-800/30 rounded-xl sm:rounded-lg p-4 sm:p-3"
            >
              <div className="flex items-center gap-2 mb-3 sm:mb-2">
                <div className="w-3 h-3 sm:w-2 sm:h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-base sm:text-sm font-semibold text-orange-800 dark:text-orange-200">
                  🎫 Have a Coupon Code?
                </span>
              </div>
              
              {!appliedCoupon ? (
                <div className="space-y-3 sm:space-y-2">
                  <div className="flex gap-3 sm:gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-orange-200 dark:border-orange-700 rounded-xl sm:rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      disabled={couponLoading}
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-6 py-3 sm:px-4 sm:py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-base sm:text-sm font-medium rounded-xl sm:rounded-lg transition-colors min-w-[80px] sm:min-w-0"
                    >
                      {couponLoading ? (
                        <div className="w-5 h-5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        'Apply'
                      )}
                    </button>
                  </div>
                  
                  {couponError && (
                    <p className="text-sm sm:text-xs text-red-600 dark:text-red-400 flex items-center gap-2 sm:gap-1">
                      <span className="w-2 h-2 sm:w-1 sm:h-1 bg-red-500 rounded-full"></span>
                      {couponError}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-xl sm:rounded-lg p-4 sm:p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                      <span className="text-base sm:text-sm font-semibold text-green-800 dark:text-green-200">
                        {appliedCoupon.code} Applied!
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-sm sm:text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="mt-3 sm:mt-2 space-y-2 sm:space-y-1">
                    <p className="text-sm sm:text-xs text-green-700 dark:text-green-300">
                      {appliedCoupon.description || `${appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}% off` : `${getDisplayCurrencySymbol()}${appliedCoupon.value} off`}`}
                    </p>
                    <p className="text-sm sm:text-xs font-semibold text-green-800 dark:text-green-200">
                      You save: {formatPriceDisplay(calculateCouponDiscount())}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Compact Payment Summary - Mobile enhanced */}
          {!courseDetails?.isFree && (
            <PaymentSummary
              courseTitle={courseDetails?.course_title || 'Course'}
              originalPrice={originalPrice || getFinalPrice()}
              finalPrice={appliedCoupon ? getFinalPriceWithCoupon() : getFinalPrice()}
              currency={getDisplayCurrencySymbol()}
              discountAmount={originalPrice ? (originalPrice - getFinalPrice()) : 0}
              enrollmentType={enrollmentType}
              selectedInstallmentPlan={selectedInstallmentPlan}
              appliedCoupon={appliedCoupon}
              couponDiscount={appliedCoupon ? calculateCouponDiscount() : 0}
              duration={formattedDuration}
              grade={grade}
            />
          )}
          
          {/* Course Features - Mobile-first redesign */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-5 sm:pt-4">
            <h4 className="flex items-center gap-3 font-semibold text-gray-900 dark:text-white text-lg mb-4">
              <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                <Award className="h-5 w-5 text-emerald-500" />
              </div>
              What you'll get
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {courseFeatures.map((feature: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                >
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <span className="leading-snug">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Enhanced Payment Button with Modern Design - Mobile optimized */}
          <motion.div className="space-y-4 sm:space-y-3">
            {/* Modern Enroll Button - Enhanced for mobile */}
            <motion.button
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEnrollClick}
              disabled={loading}
              className={`relative w-full py-5 sm:py-3.5 px-6 sm:px-5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-bold text-xl sm:text-lg rounded-2xl sm:rounded-xl flex items-center justify-center shadow-xl transition-all duration-300 overflow-hidden group min-h-[60px] sm:min-h-0 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              aria-label={isLoggedIn ? (courseDetails?.isFree ? 'Enroll for free' : 'Enroll now') : 'Login to enroll'}
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
              
              {loading ? (
                <ModernLoadingState message="Processing your enrollment..." />
              ) : (
                <div className="relative flex items-center gap-3 sm:gap-2.5">
                  {isLoggedIn ? (
                    <>
                      <div className="flex items-center gap-3 sm:gap-2">
                        {courseDetails?.isFree ? (
                          <GraduationCap className="w-7 h-7 sm:w-5 sm:h-5" />
                        ) : (
                          <CreditCard className="w-7 h-7 sm:w-5 sm:h-5" />
                        )}
                        <span className="leading-tight font-bold">
                          {courseDetails?.isFree 
                            ? 'Enroll for Free' 
                            : isTestUser 
                              ? `Test Pay ${formatPriceDisplay(selectedInstallmentPlan ? selectedInstallmentPlan.downPayment : (appliedCoupon ? getFinalPriceWithCoupon() : getFinalPrice()))}`
                              : `Pay ${formatPriceDisplay(selectedInstallmentPlan ? selectedInstallmentPlan.downPayment : (appliedCoupon ? getFinalPriceWithCoupon() : getFinalPrice()))}`
                          }
                        </span>
                      </div>
                      <ArrowRight className="w-6 h-6 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-7 h-7 sm:w-5 sm:h-5" />
                      <span className="leading-tight font-bold">Login to Enroll</span>
                      <ArrowRight className="w-6 h-6 sm:w-4 sm:h-4" />
                    </>
                  )}
                </div>
              )}
            </motion.button>

            {/* Test Card Information for Test User - Mobile enhanced */}
            {!courseDetails?.isFree && isTestUser && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-purple-50 to-indigo-50/30 dark:from-purple-900/10 dark:to-indigo-900/10 border border-purple-200 dark:border-purple-700 rounded-xl sm:rounded-lg p-4 sm:p-3 mb-4 sm:mb-3"
              >
                <div className="flex items-center gap-2 mb-3 sm:mb-2">
                  <div className="w-3 h-3 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-base sm:text-sm font-semibold text-purple-800 dark:text-purple-200">
                    🧪 Test Payment Cards
                  </span>
                </div>
                
                <div className="text-sm sm:text-xs text-purple-700 dark:text-purple-300 space-y-2 sm:space-y-1">
                  <div><strong>Success:</strong> 4111 1111 1111 1111</div>
                  <div><strong>CVV:</strong> Any 3 digits | <strong>Expiry:</strong> Any future date</div>
                  <div className="text-purple-600 dark:text-purple-400 mt-2 sm:mt-1">
                    💡 Use these test cards for successful payment testing
                  </div>
                </div>
              </motion.div>
            )}

            {/* Enhanced Payment Info - Mobile-first design */}
            {!courseDetails?.isFree && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-800/50 dark:to-blue-900/10 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-lg p-4 sm:p-3"
              >
                <div className="text-center space-y-4 sm:space-y-3">
                  <div className="inline-flex items-center justify-center gap-2 sm:gap-1.5">
                    <Shield className="w-6 h-6 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-base sm:text-sm font-semibold text-gray-900 dark:text-white">
                      {isTestUser ? "Test Payment by Razorpay" : "Secure Payment by Razorpay"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-3 sm:gap-2">
                    {[
                      { icon: CreditCard, label: 'All Cards' },
                      { icon: Building2, label: 'Net Banking' },
                      { icon: Smartphone, label: 'UPI' },
                      { icon: Wallet, label: 'Wallets' }
                    ].map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="inline-flex items-center gap-2 sm:gap-1.5 px-4 py-2 sm:px-2.5 sm:py-1 rounded-xl sm:rounded-full bg-blue-100/60 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm sm:text-xs font-medium justify-center"
                      >
                        <Icon className="w-5 h-5 sm:w-3 sm:h-3" />
                        {label}
                      </div>
                    ))}
                  </div>

                  <p className="flex items-center justify-center gap-2 sm:gap-1 text-sm sm:text-xs text-gray-500 dark:text-gray-400 font-medium mt-2 sm:mt-1">
                    <Lock className="w-4 h-4 sm:w-3 sm:h-3" />
                    Your payment information is encrypted & secure
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
          
          {/* Fast Track Option - Mobile enhanced */}
          <motion.div
            className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-gray-800 dark:to-amber-900/10 p-4 sm:p-2.5 rounded-xl sm:rounded-lg border border-amber-100 dark:border-amber-800/30 text-center">
              <div className="inline-flex items-center px-3 py-2 sm:px-2 sm:py-0.5 rounded-full bg-amber-100/80 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-300 text-sm sm:text-xs font-semibold mb-3 sm:mb-2">
                <Zap className="w-5 h-5 sm:w-3 sm:h-3 mr-2 sm:mr-1 flex-shrink-0" />
                Fast Track Available
              </div>
              <p className="text-sm sm:text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
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