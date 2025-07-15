'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, ArrowRight, ThumbsUp, AlertTriangle, 
  Lock, Zap, CheckCircle, Users, User, Info, CheckCircle2, Clock, GraduationCap,
  CalendarClock, Calculator, ChevronDown, ExternalLink, Briefcase, Shield, 
  Wallet, Smartphone, QrCode, Building2, Banknote, Timer, Star, Award, Heart,
  Share2, Sparkles, TrendingUp, Award as AwardIcon, BookOpen, PlayCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// Create showToast alias for consistency
const showToast = toast;
import { apiBaseUrl, apiUrls, addToWishlist, removeFromWishlist, checkWishlistStatus } from '@/apis';
import axios from 'axios';
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import useRazorpay from "@/hooks/useRazorpay";
import RAZORPAY_CONFIG, { getCurrencySymbol, getRazorpayConfigWithUserDetails } from "@/config/razorpay";
import { apiClient } from '@/apis/apiClient';
import RazorpayCheckout from '@/components/payments/RazorpayCheckout';
import paymentsAPI from '@/apis/payments.api';

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
  interestRate?: number;
  processingFee?: number;
  startDate?: string;
}

interface EMIDetails {
  isEMI: boolean;
  numberOfInstallments: number;
  downPayment: number;
  installmentAmount: number;
  interestRate: number;
  processingFee: number;
  totalAmount: number;
  maxInstallments: number;
  courseDurationMonths: number;
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

// Improved component organization - separate smaller components

const EnrollmentTypeSelector: React.FC<{
  enrollmentType: EnrollmentType;
  onTypeChange: (type: EnrollmentType) => void;
  activePricing: any;
  formatPriceDisplay: (price: number) => string;
  colorClass: string;
  bgClass: string;
  isBlendedCourse: boolean;
}> = ({ enrollmentType, onTypeChange, activePricing, formatPriceDisplay, colorClass, bgClass, isBlendedCourse }) => {
  if (isBlendedCourse) {
    return (
      <div className="rounded-2xl bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 p-6 text-center flex flex-col items-center justify-center">
        {activePricing && (
          <div className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {formatPriceDisplay(activePricing.individual)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {/* Batch/Group */}
      <button
        onClick={() => onTypeChange('batch')}
        className={`flex flex-col items-center justify-center rounded-xl border-2 px-4 py-6 transition-all duration-200 focus:outline-none min-h-[120px] ${
          enrollmentType === 'batch'
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-300'
        }`}
        aria-pressed={enrollmentType === 'batch'}
        type="button"
      >
        <div className="flex justify-center mb-2">
          <Users className="w-7 h-7 text-emerald-500 dark:text-emerald-400" />
        </div>
        <span className="text-base font-semibold text-gray-900 dark:text-white mb-2">Batch/Group</span>
        {activePricing && (
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">{formatPriceDisplay(activePricing.batch)}</span>
        )}
        <span className="text-xs text-gray-500">per person</span>
      </button>

      {/* Individual */}
      <button
        onClick={() => onTypeChange('individual')}
        className={`flex flex-col items-center justify-center rounded-xl border-2 px-4 py-6 transition-all duration-200 focus:outline-none min-h-[120px] ${
          enrollmentType === 'individual'
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300'
        }`}
        aria-pressed={enrollmentType === 'individual'}
        type="button"
      >
        <div className="flex justify-center mb-2">
          <User className="w-7 h-7 text-blue-500 dark:text-blue-400" />
        </div>
        <span className="text-base font-semibold text-gray-900 dark:text-white mb-2">Individual</span>
        {activePricing && (
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">{formatPriceDisplay(activePricing.individual)}</span>
        )}
      </button>
    </div>
  );
};

const PricingSummary: React.FC<{
  originalPrice: number;
  finalPrice: number;
  currency: string;
  discountAmount?: number;
  enrollmentType: string;
  selectedInstallmentPlan?: InstallmentPlan | null;
  appliedCoupon?: Coupon | null;
  couponDiscount?: number;
  isBlendedCourse?: boolean;
  realPrice?: number;
}> = ({ 
  originalPrice, 
  finalPrice, 
  currency, 
  discountAmount = 0, 
  enrollmentType,
  selectedInstallmentPlan,
  appliedCoupon,
  couponDiscount = 0,
  isBlendedCourse = false,
  realPrice
}) => {
  const formatPrice = (price: number) => `${currency} ${price.toLocaleString()}`;

  // Unified card for all paid courses (live, blended, others)
  // Show slashed price, main price, and 'Save X%' badge
  const slashedPrice = originalPrice > finalPrice ? originalPrice : null;
  const percentSaved = slashedPrice ? Math.round(((slashedPrice - finalPrice) / slashedPrice) * 100) : null;

  return (
    <div className="relative overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-600 shadow-md shadow-slate-200/30 dark:shadow-slate-900/30 p-6 flex flex-col items-center justify-center">
      {/* Slashed price (psychological price) */}
      {slashedPrice && (
        <span className="text-base text-slate-400 dark:text-slate-500 line-through mb-1">{formatPrice(slashedPrice)}</span>
      )}
      {/* Main price */}
      <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">{formatPrice(finalPrice)}</span>
      {/* Percentage savings */}
      {percentSaved && (
        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">Save {percentSaved}%</span>
      )}
      {/* Plan label removed for all paid courses */}
    </div>
  );
};

// SessionInfoCard component removed as per user request

const CouponSection: React.FC<{
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedCoupon: Coupon | null;
  couponLoading: boolean;
  couponError: string;
  applyCoupon: () => void;
  removeCoupon: () => void;
  formatPriceDisplay: (price: number) => string;
  calculateCouponDiscount: () => number;
  getDisplayCurrencySymbol: () => string;
}> = ({ 
  couponCode, 
  setCouponCode, 
  appliedCoupon, 
  couponLoading, 
  couponError, 
  applyCoupon, 
  removeCoupon, 
  formatPriceDisplay, 
  calculateCouponDiscount,
  getDisplayCurrencySymbol
}) => {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800/30 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
        <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200">
          🎫 Have a Coupon Code?
        </h3>
      </div>
      
      {!appliedCoupon ? (
        <div className="space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
              placeholder="Enter coupon code"
              className="flex-1 px-4 py-3 text-sm border border-orange-300 dark:border-orange-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              disabled={couponLoading}
            />
            <button
              onClick={applyCoupon}
              disabled={couponLoading || !couponCode.trim()}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors min-w-[80px] flex items-center justify-center"
            >
              {couponLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Apply'
              )}
            </button>
          </div>
          
          {couponError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{couponError}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span className="font-semibold text-emerald-800 dark:text-emerald-200">
                {appliedCoupon.code} Applied!
              </span>
            </div>
            <button
              onClick={removeCoupon}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 font-medium px-3 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Remove
            </button>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              {appliedCoupon.description || `${appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}% off` : `${getDisplayCurrencySymbol()}${appliedCoupon.value} off`}`}
            </p>
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
              💰 You save: {formatPriceDisplay(calculateCouponDiscount())}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const PaymentSecurityInfo: React.FC<{ isTestUser: boolean }> = ({ isTestUser }) => (
  <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg px-4 py-3">
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40">
      <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-gray-900 dark:text-white">
        {isTestUser ? "Test Payment by Razorpay" : "Secure Payment by Razorpay"}
      </span>
      <span className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">
        Your payment is encrypted & secure
      </span>
      <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
        256-bit SSL • PCI DSS compliant
      </span>
    </div>
  </div>
);

// Helper to generate 4 smart EMI options for any course duration
function getSmartEMIMonths(courseDurationMonths: number): number[] {
  const minMonths = 2;
  const maxMonths = Math.max(courseDurationMonths, minMonths);
  if (maxMonths <= minMonths) return [minMonths];
  if (maxMonths - minMonths < 4) {
    // For short durations, just list all
    return Array.from({ length: maxMonths - minMonths + 1 }, (_, i) => minMonths + i);
  }
  // For longer durations, space 4 options: 2, 1/3, 2/3, max
  const mid1 = Math.round(minMonths + (maxMonths - minMonths) / 3);
  const mid2 = Math.round(minMonths + 2 * (maxMonths - minMonths) / 3);
  return Array.from(new Set([minMonths, mid1, mid2, maxMonths])).sort((a, b) => a - b);
}

const EMISelector: React.FC<{
  totalAmount: number;
  courseDurationMonths: number;
  selectedMonths: number | null;
  onSelectMonths: (months: number | null) => void;
  getDisplayCurrencySymbol: () => string; // Pass this down
}> = ({ totalAmount, courseDurationMonths, selectedMonths, onSelectMonths, getDisplayCurrencySymbol }) => {
  const allowedMonths = getSmartEMIMonths(courseDurationMonths);
  const [isExpanded, setIsExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (allowedMonths.length === 0) return null;
  
  const currencySymbol = getDisplayCurrencySymbol();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-md mx-auto mb-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 emi-selector-dropdown"
      ref={dropdownRef}
    >
      <button
        onClick={() => setIsExpanded(prev => !prev)}
        className="w-full bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-3 sm:py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 touch-manipulation"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                Choose EMI Duration
              </h3>
              {selectedMonths !== null && (
                <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">
                    {selectedMonths === 0 ? 'Pay Full Amount' : `${selectedMonths} months`}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="p-1 sm:p-1.5"
          >
            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-b-xl shadow-lg max-h-64 overflow-y-auto" 
          >
            <div className="p-3 sm:p-4 space-y-2">
              {/* Option to pay full amount (no EMI) */}
              <motion.div
                key="no-emi"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => { onSelectMonths(null); setIsExpanded(false); }}
                className={`p-2.5 sm:p-3 rounded-lg cursor-pointer transition-all duration-300 touch-manipulation ${
                  selectedMonths === null
                    ? 'bg-blue-50 dark:bg-blue-900/20 shadow-lg ring-2 ring-blue-500/20 dark:ring-blue-400/20'
                    : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md active:scale-95'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                    Pay Full Amount (No EMI)
                  </span>
                  {selectedMonths === null && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-1 rounded-full bg-blue-500"
                    >
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {allowedMonths.map((months, index) => (
                <motion.div
                  key={months}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: (index + 1) * 0.05 }}
                  onClick={() => { onSelectMonths(months); setIsExpanded(false); }}
                  className={`p-2.5 sm:p-3 rounded-lg cursor-pointer transition-all duration-300 touch-manipulation ${
                    selectedMonths === months
                      ? 'bg-blue-50 dark:bg-blue-900/20 shadow-lg ring-2 ring-blue-500/20 dark:ring-blue-400/20'
                      : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md active:scale-95'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      {months} months EMI
                    </span>
                    {selectedMonths === months && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="p-1 rounded-full bg-blue-500"
                      >
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      </motion.div>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    Approx. {currencySymbol}{Math.ceil(totalAmount / months).toLocaleString()} / month
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {selectedMonths !== null && selectedMonths !== 0 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-5 p-4 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 flex flex-col items-center shadow-inner"
        >
          <div className="text-base text-blue-700 dark:text-blue-200 mb-1">Monthly Payment</div>
          <div className="text-3xl font-extrabold text-blue-800 dark:text-blue-100 mb-2">
            {currencySymbol}{Math.ceil(totalAmount / selectedMonths!).toLocaleString()}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">for {selectedMonths} months</div>
          <div className="text-xs text-blue-500 dark:text-blue-300 mt-1">
            Total: {currencySymbol}{totalAmount.toLocaleString()} (No interest, no fees)
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const FastTrackInfo: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800/30"
  >
    <div className="text-center space-y-3">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-semibold">
        <Zap className="w-4 h-4" />
        Fast Track Available
      </div>
      <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
        Accelerated learning options available for experienced learners. Contact support for details.
      </p>
    </div>
  </motion.div>
);

// Additional helper components

const ModernLoadingState: React.FC<{ message?: string }> = ({ message = "Processing payment..." }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-8"
  >
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin">
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
    </div>
    <p className="mt-4 text-sm font-semibold text-gray-900 dark:text-white text-center">
      {message}
    </p>
    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center font-medium">
      Please don't close this window
    </p>
  </motion.div>
);

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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full transform transition-all duration-300 scale-100">
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
          <div className="flex flex-col gap-3 justify-center">
            <button
              onClick={navigateToCourse}
              className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Go to My Courses <ArrowRight size={18} />
            </button>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main EnrollmentDetails Component
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

  // Component state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedInstallmentPlan, setSelectedInstallmentPlan] = useState<InstallmentPlan | null>(null);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState<boolean>(false);
  const [couponError, setCouponError] = useState<string>('');
  
  // Wishlist state
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false);
  const [wishlistLoading, setWishlistLoading] = useState<boolean>(false);
  
  // EMI state
  const [selectedEMIMonths, setSelectedEMIMonths] = useState<number | null>(null);

  // Add a state for initial loading from localStorage to prevent flicker
  const [initialLoading, setInitialLoading] = useState(true);

  // Reset EMI selection when course changes
  useEffect(() => {
    setSelectedEMIMonths(null);
  }, [courseDetails?._id]);

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

  // Check login status on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const user = localStorage.getItem('user') || localStorage.getItem('userData');
      
      const isUserLoggedIn = !!token && (!!userId || !!user);
      
      console.log('Login check: token present?', !!token);
      console.log('Login check: userId present?', !!userId);
      console.log('Login check: user/userData present?', !!user);
      console.log('Login check: isUserLoggedIn computed as:', isUserLoggedIn);

      setIsLoggedIn(isUserLoggedIn);
      setUserId(userId);

      if (user) {
        try {
          const userData = JSON.parse(user);
          setUserProfile(userData);
        } catch (e) {
          console.error("Failed to parse user data:", e);
        }
      }
      setInitialLoading(false); // Mark initial loading complete
    }
  }, []);

  // Always force individual enrollment for blended courses
  useEffect(() => {
    if (isBlendedCourse) {
      setEnrollmentType('individual');
    }
  }, [isBlendedCourse]);

  // Check wishlist status on component mount
  useEffect(() => {
    const checkWishlistStatusOnMount = async () => {
      if (isLoggedIn && userId && courseDetails?._id) {
        try {
          const response = await axios.get(
            checkWishlistStatus(userId, courseDetails._id),
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          setIsInWishlist(response.data.data.is_in_wishlist);
        } catch (error) {
          console.error('Failed to check wishlist status:', error);
          setIsInWishlist(false);
        }
      }
    };

    checkWishlistStatusOnMount();
  }, [isLoggedIn, userId, courseDetails?._id]);

  // Call callback when enrollment type changes
  useEffect(() => {
    if (onEnrollmentTypeChange) {
      onEnrollmentTypeChange(enrollmentType);
    }
  }, [enrollmentType, onEnrollmentTypeChange]);

  // Get active price information
  const getActivePrice = useCallback((): Price | null => {
    const prices = courseDetails?.prices;
    if (!prices || prices.length === 0) {
      return null;
    }
    // Prefer INR if available and active
    const inrActive = prices.find(price => price.is_active && price.currency.toUpperCase() === 'INR');
    if (inrActive) return inrActive;
    // Otherwise, prefer any active price
    const activePrice = prices.find(price => price.is_active);
    if (activePrice) return activePrice;
    // Otherwise, fallback to first price
    return prices[0] || null;
  }, [courseDetails]);

  // State for active pricing
  const [activePricing, setActivePricing] = useState<Price | null>(initialActivePricing || null);
  const [isPricingLoading, setIsPricingLoading] = useState(true); // New state

  // Update activePricing when course details changes
  useEffect(() => {
    const price = getActivePrice();
    setActivePricing(price);
    setIsPricingLoading(false); // Set to false after price is determined
  }, [courseDetails?.prices, courseDetails?._id]);

  // Call callback when active pricing changes
  useEffect(() => {
    if (onActivePricingChange) {
      onActivePricingChange(activePricing);
    }
  }, [activePricing, onActivePricingChange]);

  // Calculate final price including any applicable discounts
  const calculateFinalPrice = useCallback((price: number | undefined, discount: number | undefined): number => {
    if (!price) return 0;
    const safeDiscount = discount || 0;
    const finalPrice = price - (price * safeDiscount / 100);
    return finalPrice;
  }, []);
  
  // Get the final price in the user's currency
  const getFinalPrice = useCallback((): number => {
    if (!activePricing) return 0;
    
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

    return Math.min(discount, basePrice);
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

  // Wishlist functions
  const toggleWishlist = async () => {
    if (!isLoggedIn) {
      showToast.error('Please login to add to wishlist');
      return;
    }

    if (!userId || !courseDetails?._id) {
      showToast.error('Course or user information is missing');
      return;
    }

    setWishlistLoading(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const removeConfig = await removeFromWishlist({
          studentId: userId,
          courseId: courseDetails._id
        } as any) as any;

        await axios.delete(removeConfig.url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          data: removeConfig.data
        });

        setIsInWishlist(false);
        showToast.success('Removed from wishlist', {
          duration: 2000,
          style: {
            background: '#EF4444',
            color: '#fff',
          },
        });
      } else {
        // Add to wishlist
        const addConfig = await addToWishlist({
          studentId: userId,
          courseId: courseDetails._id,
          priority: 'medium',
          notifications: {
            price_drop: true,
            course_updates: true,
            enrollment_opening: true
          }
        } as any) as any;

        await axios.post(addConfig.url, addConfig.data, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        setIsInWishlist(true);
        showToast.success('Added to wishlist! 💖', {
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });
      }
    } catch (error: any) {
      console.error('Wishlist operation failed:', error);
      showToast.error(
        error.response?.data?.message || 'Failed to update wishlist. Please try again.',
        {
          duration: 4000,
          style: {
            background: '#EF4444',
            color: '#fff',
          },
        }
      );
    } finally {
      setWishlistLoading(false);
    }
  };

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

  // Placeholder payment handler function
  const handleRazorpayPayment = useCallback(async (): Promise<void> => {
    // This function is handled by the RazorpayCheckout component
    // which manages the entire payment flow including order creation,
    // payment processing, and verification
    console.log("Payment handled by RazorpayCheckout component");
  }, []);

  // Enroll course function (following BillDetails pattern)
  const enrollCourse = async (studentId: string, courseId: string, paymentResponse: any = {}): Promise<void> => {
    try {
      await postQuery({
        url: apiUrls?.enrolledCourses?.createEnrollment,
        postData: {
          student_id: studentId,
          course_id: courseId,
          enrollment_type: enrollmentType,
          payment_information: {
            ...paymentResponse,
            payment_method: paymentResponse?.razorpay_payment_id ? 'razorpay' : 'free',
            amount: getFinalPrice(),
            currency: activePricing?.currency || 'INR',
          }
        },
        onSuccess: () => {
          setIsSuccessModalOpen(true);
          console.log("Student enrolled successfully!");
          showToast.success("Successfully enrolled in the course!");
        },
        onFail: (err) => {
          console.error("Enrollment failed:", err);
          showToast.error("Error enrolling in the course. Please try again!");
        },
      });
    } catch (error) {
      console.error("Error enrolling course:", error);
      showToast.error("Something went wrong! Please try again later.");
    }
  };

  // Check if already enrolled
  const checkEnrollmentStatus = async (studentId: string, courseId: string): Promise<boolean> => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/enrollments/students/${studentId}/enrollments/`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data && Array.isArray(response.data)) {
        return response.data.some((enrollment: any) => 
          enrollment.course === courseId && 
          (enrollment.status === 'active' || enrollment.status === 'in_progress')
        );
      }
      
      return false;
    } catch (error: any) {
      console.error("Failed to check enrollment status:", error);
      if (error.response?.status === 404 || error.response?.status === 401) {
        return false;
      }
      return false;
    }
  };

  // Handle enrollment click
  const handleEnrollClick = useCallback(async () => {
    console.log("Enrollment button clicked.");
    console.log("Course details:", courseDetails);
    console.log("Current userId:", userId);
    console.log("Current isLoggedIn:", isLoggedIn);

    if (!courseDetails?._id) {
      showToast.error("Course information is missing. Please refresh the page.");
      console.error("Enrollment failed: Course ID missing.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (!isLoggedIn) {
        console.log("User not logged in. Redirecting to login page.");
        showToast.error("Please login to enroll in the course.");
        router.push(`/login?redirect=/course-details/${courseDetails?._id}`);
        return;
      }

      if (!userId) {
        showToast.error("User identification is missing. Please log in again.");
        console.error("Enrollment failed: userId is null after login check.");
        router.push('/login'); // Fallback if isLoggedIn is true but userId is null
        return;
      }

      if (!activePricing && !courseDetails.isFree) {
        showToast.error("Pricing information is missing for paid courses.");
        console.error("Enrollment failed: Pricing information missing.");
        return;
      }

      // Check if already enrolled
      const isEnrolled = await checkEnrollmentStatus(userId, courseDetails._id);
      if (isEnrolled) {
        showToast.error("You are already enrolled in this course!");
        console.log("User already enrolled. Redirecting to my courses.");
        router.push('/dashboards/my-courses');
        return;
      }

      const enrollmentData = {
        ...courseDetails,
        enrollmentType,
        priceId: activePricing?._id,
        finalPrice: getFinalPrice(),
        currencyCode: 'USD'
      };

      if (onEnrollClick) {
        console.log("Using custom onEnrollClick handler.");
        await onEnrollClick(enrollmentData);
      } else {
        if (courseDetails.isFree || isFreePrice(getFinalPrice())) {
          console.log("Free course detected. Proceeding with free enrollment.");
          await enrollCourse(userId, courseDetails._id);
        } else {
          console.log("Paid course detected. Initiating Razorpay payment.");
          await handleRazorpayPayment();
        }
      }
    } catch (err: any) {
      console.error("Enrollment process error:", err);
      // Check for 401 Unauthorized error specifically
      if (err.response && err.response.status === 401) {
        setError("Authentication required. Please login to enroll.");
      } else {
        setError(err.message || "An unexpected error occurred during enrollment.");
      }
      showToast.error(err.message || "Enrollment failed. Please try again or contact support.");
    } finally {
      setLoading(false);
      console.log("Enrollment process finished. Loading set to false.");
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
    handleRazorpayPayment
  ]);

  // Navigate to my courses page after successful enrollment
  const navigateToCourses = () => {
    setIsSuccessModalOpen(false);
    router.push('/dashboards/my-courses');
  };

  // Handle course features - only compute if needed
  const courseFeatures = useMemo(() => {
    if (!courseDetails?.features) return [];
    return courseDetails.features;
  }, [courseDetails?.features]);

  // Handle enrollment type change
  const handleEnrollmentTypeChange = useCallback((newType: EnrollmentType) => {
    setEnrollmentType(newType);
  }, []);

  // Get display currency symbol
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

  // Check if course is live class
  const isLiveClass = useMemo(() => {
    const cd = courseDetails as any;
    const fields = [
      cd?.classType,
      cd?.class_type,
      cd?.courseType,
      cd?.course_type,
      cd?.deliveryFormat,
      cd?.delivery_format,
      cd?.deliveryType,
      cd?.delivery_type,
      cd?.categoryType,
      cd?.category_type,
      cd?.course_title,
      cd?.title,
      cd?.course_category,
      cd?.category,
      cd?.course_subcategory,
      cd?.subcategory,
    ];
    if (cd) {
      console.log('LIVE DETECT FIELDS:', fields, 'ALL KEYS:', Object.keys(cd));
    } else {
      console.log('LIVE DETECT FIELDS:', fields, 'cd is null/undefined');
    }
    return fields.some(
      (field) => typeof field === 'string' && field.toLowerCase().includes('live')
    );
  }, [
    (courseDetails as any)?.classType,
    (courseDetails as any)?.class_type,
    (courseDetails as any)?.courseType,
    (courseDetails as any)?.course_type,
    (courseDetails as any)?.deliveryFormat,
    (courseDetails as any)?.delivery_format,
    (courseDetails as any)?.deliveryType,
    (courseDetails as any)?.delivery_type,
    (courseDetails as any)?.categoryType,
    (courseDetails as any)?.category_type,
    (courseDetails as any)?.course_title,
    (courseDetails as any)?.title,
    (courseDetails as any)?.course_category,
    (courseDetails as any)?.category,
    (courseDetails as any)?.course_subcategory,
    (courseDetails as any)?.subcategory,
  ]);

  // Calculate course duration in months for EMI planning
  const courseDurationInMonths = useMemo((): number => {
    if (!courseDetails?.course_duration) return 6; // Default 6 months
    const durationStr = courseDetails.course_duration.toLowerCase();
    // Find all numbers before 'month' or 'months'
    const matches = Array.from(durationStr.matchAll(/(\d+)\s*month/gi));
    if (matches.length > 0) {
      // Use the first match (lowest duration)
      return parseInt(matches[0][1]);
    }
    return 6;
  }, [courseDetails?.course_duration]);

  // Generate smart EMI plans
  const generateEMIPlans = useCallback((totalAmount: number): EMIDetails[] => {
    if (!isLiveClass || totalAmount <= 0) return [];

    const plans: EMIDetails[] = [];
    const maxInstallments = Math.min(courseDurationInMonths, 12); // Max 12 months or course duration
    const minInstallments = 3; // Minimum 3 installments
    
    // Generate plans for 3, 6, 9, 12 months (within course duration)
    const planDurations = [3, 6, 9, 12].filter(months => months <= maxInstallments && months >= minInstallments);
    
    planDurations.forEach(months => {
      const processingFee = Math.min(totalAmount * 0.02, 500); // 2% or max ₹500
      const interestRate = months <= 3 ? 8 : months <= 6 ? 12 : 15; // Progressive interest
      const downPaymentPercent = months <= 3 ? 20 : months <= 6 ? 25 : 30; // Higher down payment for longer terms
      
      const downPayment = Math.round(totalAmount * (downPaymentPercent / 100));
      const remainingAmount = totalAmount - downPayment + processingFee;
      const monthlyInterest = interestRate / 12 / 100;
      
      // Calculate EMI using standard formula
      const emiAmount = Math.round(
        (remainingAmount * monthlyInterest * Math.pow(1 + monthlyInterest, months)) /
        (Math.pow(1 + monthlyInterest, months) - 1)
      );
      
      const totalWithInterest = downPayment + (emiAmount * months);
      
      plans.push({
        isEMI: true,
        numberOfInstallments: months,
        downPayment,
        installmentAmount: emiAmount,
        interestRate,
        processingFee,
        totalAmount: totalWithInterest,
        maxInstallments,
        courseDurationMonths: courseDurationInMonths
      });
    });
    
    return plans;
  }, [isLiveClass, courseDurationInMonths]);

  // Update EMI plans when price changes
  useEffect(() => {
    const basePrice = getFinalPriceWithCoupon();
    console.log('EMI basePrice:', basePrice, 'activePricing:', activePricing, 'courseDetails:', courseDetails, 'isLiveClass:', isLiveClass);
    if (isLiveClass && !courseDetails?.isFree) {
      if (basePrice > 3000) { // Only offer EMI for amounts > ₹3000
        const plans = generateEMIPlans(basePrice);
        // setAvailableEMIPlans(plans); // This state is no longer needed
        // setSelectedEMIPlan(null); // This state is no longer needed
        // setShowEMIOptions(false); // This state is no longer needed
      } else {
        // setAvailableEMIPlans([]); // This state is no longer needed
        // setSelectedEMIPlan(null); // This state is no longer needed
        // setShowEMIOptions(false); // This state is no longer needed
      }
    }
  }, [isLiveClass, courseDetails?.isFree, getFinalPriceWithCoupon, generateEMIPlans]);

  // Calculate any discount percentage to display
  const discountPercentage = activePricing ? (
    isBlendedCourse 
      ? activePricing.early_bird_discount || 0 
      : (enrollmentType === 'batch' 
        ? activePricing.group_discount || 0
        : activePricing.early_bird_discount || 0)
  ) : 0;

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

  // Check if current user is test user
  const isTestUser = userId === '67cfe3a9a50dbb995b4d94da';

  // Handle when no course is selected
  if (!courseDetails) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md mx-auto lg:max-w-none">
        <div className="p-6 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <GraduationCap className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-medium">Select a course to view enrollment details</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    // Special handling for 'Authentication required' error to show 'Login to Enroll' button
    if (error === "Authentication required. Please login to enroll.") {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md mx-auto lg:max-w-none">
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <Lock className="w-12 h-12 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Login Required</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Please log in to your account to enroll in this course and access all features.
            </p>
            <button
              onClick={() => router.push(`/login?redirect=/course-details/${courseDetails?._id}`)}
              className="w-full py-3 px-6 rounded-lg font-semibold text-base bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 shadow-md"
            >
              Login to Enroll
            </button>
          </div>
        </div>
      );
    }
    return (
      <ErrorFallback 
        error={error} 
        resetErrorBoundary={() => setError(null)} 
      />
    );
  }

  return (
    <>
      {/* Test Mode Banner */}
      {isTestUser && (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-xl mb-6 border border-purple-300">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold">🧪 TEST MODE ACTIVE</span>
          </div>
          <p className="text-xs mt-1 opacity-90">
            You're using test Razorpay credentials. Use test cards for payment.
          </p>
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md mx-auto lg:max-w-none">
        {/* Header section */}
        <div className={`px-6 py-4 ${bgClass} border-b ${borderClass} flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              {isBlendedCourse ? 'Enrollment' : 'Enrollment Options'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {/* Enhanced Wishlist Button */}
            <button
              onClick={toggleWishlist}
              disabled={wishlistLoading}
              className={`relative p-3 rounded-xl transition-all duration-300 transform ${
                isInWishlist 
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-rose-600 scale-105' 
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-600'
              } ${wishlistLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
              title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {/* Wishlist Glow Effect */}
              {isInWishlist && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 blur-md opacity-60 animate-pulse" />
              )}
              <div className="relative flex items-center gap-2">
                {wishlistLoading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Heart 
                      className={`w-5 h-5 transition-all duration-200 ${
                        isInWishlist 
                          ? 'fill-current drop-shadow-sm' 
                          : 'hover:scale-110'
                      }`} 
                    />
                    {isInWishlist && (
                      <span className="text-sm font-medium hidden sm:inline">
                        Saved
                      </span>
                    )}
                  </>
                )}
              </div>
              {/* Floating Heart Animation */}
              {isInWishlist && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-ping" />
                </div>
              )}
            </button>
            {/* Share Button */}
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  showToast.success('Link copied!', { duration: 2000 });
                } catch (err) {
                  showToast.error('Failed to copy link');
                }
              }}
              className="relative p-3 rounded-xl transition-all duration-300 transform bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-110 active:scale-95"
              title="Share course link"
              aria-label="Share course link"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Enrollment Type Selection */}
          {/* Only show EnrollmentTypeSelector for non-blended courses */}
          {!isBlendedCourse && (
            <EnrollmentTypeSelector 
              enrollmentType={enrollmentType}
              onTypeChange={handleEnrollmentTypeChange}
              activePricing={activePricing}
              formatPriceDisplay={formatPriceDisplay}
              colorClass={colorClass}
              bgClass={bgClass}
              isBlendedCourse={isBlendedCourse}
            />
          )}
          {/* Free Course Price Display */}
          {courseDetails?.isFree && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/80 dark:to-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <div className="flex-1">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                  Price
                </p>
                <h4 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                  {formatPriceDisplay(0)}
                </h4>
              </div>
              <div className={`p-3 rounded-full ${bgClass} shadow-md`}>
                <CreditCard className={colorClass} />
              </div>
            </motion.div>
          )}
          {/* Payment Summary - unified for all paid courses */}
          {!courseDetails?.isFree && activePricing && (
            <PricingSummary
              originalPrice={(() => {
                // For discount display: show slashed price if discount exists
                const base = isBlendedCourse
                  ? Math.round(activePricing.individual * 1.3)
                  : (enrollmentType === 'individual' ? Math.round(activePricing.individual * 1.3) : Math.round(activePricing.batch * 1.3));
                // Only show slashed price if discount exists
                const final = appliedCoupon ? getFinalPriceWithCoupon() : getFinalPrice();
                return (base > final) ? base : final;
              })()}
              finalPrice={appliedCoupon ? getFinalPriceWithCoupon() : getFinalPrice()}
              currency={getDisplayCurrencySymbol()}
              discountAmount={originalPrice ? (originalPrice - getFinalPrice()) : 0}
              enrollmentType={enrollmentType}
              selectedInstallmentPlan={selectedInstallmentPlan}
              appliedCoupon={appliedCoupon}
              couponDiscount={appliedCoupon ? calculateCouponDiscount() : 0}
              isBlendedCourse={isBlendedCourse}
              realPrice={activePricing.individual}
            />
          )}
          {/* Session Information */}
          {/* SessionInfoCard component removed */}
          {/* Coupon Section */}
          {!courseDetails?.isFree && (
            <CouponSection 
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              appliedCoupon={appliedCoupon}
              couponLoading={couponLoading}
              couponError={couponError}
              applyCoupon={applyCoupon}
              removeCoupon={removeCoupon}
              formatPriceDisplay={formatPriceDisplay}
              calculateCouponDiscount={calculateCouponDiscount}
              getDisplayCurrencySymbol={getDisplayCurrencySymbol}
            />
          )}
          {/* EMI Selector - always show if used in [categoryname]/page.tsx and price > 0 */}
          {(() => {
            // Detect if running inside [categoryname]/page.tsx by checking for a global marker or prop (if available)
            // Since we can't check parent directly, always show EMISelector if price > 0
            const emiEligible = !isBlendedCourse && !courseDetails?.isFree && (appliedCoupon ? getFinalPriceWithCoupon() : getFinalPrice()) > 0;
            return emiEligible ? (
              <EMISelector
                totalAmount={appliedCoupon ? getFinalPriceWithCoupon() : getFinalPrice()}
                courseDurationMonths={courseDurationInMonths}
                selectedMonths={selectedEMIMonths}
                onSelectMonths={setSelectedEMIMonths}
                getDisplayCurrencySymbol={getDisplayCurrencySymbol}
              />
            ) : null;
          })()}
          {/* Razorpay Payment Button (Reusable) */}
          {!courseDetails?.isFree && (
            initialLoading || isPricingLoading ? (
              <ModernLoadingState message="Loading enrollment options..." />
            ) : (
              !isLoggedIn && activePricing ? (
                <button
                  onClick={() => router.push(`/login?redirect=/course-details/${courseDetails?._id}`)}
                  className="w-full py-4 px-6 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white shadow-blue-500/25"
                >
                  <Lock className="w-6 h-6" /> Login to Enroll
                </button>
              ) : activePricing ? (
                <RazorpayCheckout
                  amount={(() => {
                    if (selectedEMIMonths && selectedEMIMonths > 0) {
                      // For EMI, pay the first month's installment now
                      return Math.ceil((appliedCoupon ? getFinalPriceWithCoupon() : getFinalPrice()) / selectedEMIMonths);
                    }
                    return Math.round(appliedCoupon ? getFinalPriceWithCoupon() : getFinalPrice());
                  })()}
                  courseId={courseDetails._id}
                  enrollmentType={enrollmentType}
                  paymentType="course"
                  isSelfPaced={false}
                  onSuccess={() => {
                    // Use setTimeout to avoid setting state during render
                    setTimeout(() => {
                      setIsSuccessModalOpen(true);
                      showToast.success('Successfully enrolled in the course!');
                    }, 0);
                  }}
                  onError={(message) => {
                    // Use setTimeout to avoid setting error during render
                    setTimeout(() => {
                      setError(message);
                      showToast.error(message);
                    }, 0);
                  }}
                  buttonText={isTestUser
                    ? (selectedEMIMonths && selectedEMIMonths > 0
                        ? `Test Pay 1st EMI ₹${Math.ceil((appliedCoupon ? getFinalPriceWithCoupon() : getFinalPrice()) / selectedEMIMonths).toLocaleString()}`
                        : `Test Pay ₹${(appliedCoupon ? getFinalPriceWithCoupon() : getFinalPrice()).toLocaleString()}`)
                    : (selectedEMIMonths && selectedEMIMonths > 0
                        ? `Pay 1st EMI ₹${Math.ceil((appliedCoupon ? getFinalPriceWithCoupon() : getFinalPrice()) / selectedEMIMonths).toLocaleString()}`
                        : `Pay ₹${(appliedCoupon ? getFinalPriceWithCoupon() : getFinalPrice()).toLocaleString()}`)
                  }
                  className="w-full py-4 px-6 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white shadow-blue-500/25"
                  currency={activePricing.currency}
                  originalPrice={activePricing.individual}
                  priceId={activePricing._id}
                />
              ) : (
                <div className="text-center text-red-500 dark:text-red-400 py-4">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                  <p>Pricing information unavailable. Please try again later.</p>
                </div>
              )
            )
          )}
          {/* Test Card Information */}
          {!courseDetails?.isFree && isTestUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 border border-purple-200 dark:border-purple-700 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-purple-800 dark:text-purple-200">
                  🧪 Test Payment Cards
                </span>
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                <div><strong>Success:</strong> 4111 1111 1111 1111</div>
                <div><strong>CVV:</strong> Any 3 digits | <strong>Expiry:</strong> Any future date</div>
                <div className="text-purple-600 dark:text-purple-400 mt-2">
                  💡 Use these test cards for successful payment testing
                </div>
              </div>
            </motion.div>
          )}
          {/* Payment Security Info */}
          {!courseDetails?.isFree && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <PaymentSecurityInfo isTestUser={isTestUser} />
            </motion.div>
          )}
        </div>
        {/* Fast Track Option: Only for live courses and not blended */}
        {isLiveClass && !isBlendedCourse && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <FastTrackInfo />
          </div>
        )}
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
}

export default EnrollmentDetails;