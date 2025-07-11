'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, ArrowRight, ThumbsUp, AlertTriangle, 
  Lock, Zap, CheckCircle, Users, User, Info, CheckCircle2, Clock, GraduationCap,
  CalendarClock, Calculator, ChevronDown, ExternalLink, Briefcase, Shield, 
  Wallet, Smartphone, QrCode, Building2, Banknote, Timer, Star, Award, Heart,
  Share2
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
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/30 overflow-hidden">
        <div className={`p-6 text-center ${bgClass}`}>
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <User className={`w-6 h-6 ${colorClass}`} />
            </div>
          </div>
          {activePricing && (
            <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {formatPriceDisplay(activePricing.individual)}
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Individual Enrollment
          </h3>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-blue-200 dark:border-blue-800/30">
          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
            <Info className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
            Personalized learning experience designed for individual learners
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <button
        onClick={() => onTypeChange('batch')}
        className={`group relative p-4 rounded-xl border-2 transition-all duration-300 ${
          enrollmentType === 'batch' 
            ? `${bgClass} border-blue-500 shadow-lg transform scale-105` 
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:shadow-md'
        }`}
        aria-pressed={enrollmentType === 'batch'}
      >
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              enrollmentType === 'batch' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Batch/Group</h3>
          {activePricing && (
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {formatPriceDisplay(activePricing.batch)}
              <span className="text-sm text-gray-500 dark:text-gray-400 block">per person</span>
            </p>
          )}
        </div>
      </button>

      <button
        onClick={() => onTypeChange('individual')}
        className={`group relative p-4 rounded-xl border-2 transition-all duration-300 ${
          enrollmentType === 'individual' 
            ? `${bgClass} border-blue-500 shadow-lg transform scale-105` 
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:shadow-md'
        }`}
        aria-pressed={enrollmentType === 'individual'}
      >
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              enrollmentType === 'individual' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              <User className="w-5 h-5" />
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Individual</h3>
          {activePricing && (
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatPriceDisplay(activePricing.individual)}
            </p>
          )}
        </div>
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
}> = ({ 
  originalPrice, 
  finalPrice, 
  currency, 
  discountAmount = 0, 
  enrollmentType,
  selectedInstallmentPlan,
  appliedCoupon,
  couponDiscount = 0
}) => {
  const formatPrice = (price: number) => `${currency} ${price.toLocaleString()}`;
  const hasDiscount = discountAmount > 0 || couponDiscount > 0;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-800 dark:to-slate-800 rounded-xl p-6 border border-slate-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          {enrollmentType === 'batch' ? 'Batch' : 'Individual'} Enrollment
        </h3>
        <div className="text-right">
          {hasDiscount && (
            <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </div>
          )}
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {formatPrice(finalPrice)}
          </div>
        </div>
      </div>

      {/* Discount breakdown */}
      {hasDiscount && (
        <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-gray-600">
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Batch discount</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                -{formatPrice(discountAmount)}
              </span>
            </div>
          )}
          {appliedCoupon && couponDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Coupon ({appliedCoupon.code})</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                -{formatPrice(couponDiscount)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm font-semibold pt-2 border-t border-slate-200 dark:border-gray-600">
            <span className="text-emerald-600 dark:text-emerald-400">Total Savings</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              -{formatPrice(discountAmount + couponDiscount)}
            </span>
          </div>
        </div>
      )}

      {/* EMI information */}
      {selectedInstallmentPlan && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              EMI Option Selected
            </span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatPrice(selectedInstallmentPlan.installmentAmount)}/month
            </span>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
            {selectedInstallmentPlan.installments} payments • Down: {formatPrice(selectedInstallmentPlan.downPayment)}
          </p>
        </div>
      )}
    </div>
  );
};

const SessionInfoCard: React.FC<{
  sessionCount: number;
  isLiveClass: boolean;
}> = ({ sessionCount, isLiveClass }) => {
  if (!isLiveClass || !sessionCount) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800/30 rounded-xl p-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <CalendarClock className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-1">
            Live Interactive Sessions
          </h4>
          <p className="text-indigo-700 dark:text-indigo-300">
            <span className="font-medium text-lg">{sessionCount}</span> live sessions with expert instructors
          </p>
        </div>
      </div>
    </motion.div>
  );
};

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

const EnrollmentButton: React.FC<{
  isLoggedIn: boolean;
  loading: boolean;
  courseDetails: CourseDetails | null;
  isTestUser: boolean;
  selectedInstallmentPlan: InstallmentPlan | null;
  appliedCoupon: Coupon | null;
  getFinalPriceWithCoupon: () => number;
  getFinalPrice: () => number;
  formatPriceDisplay: (price: number) => string;
  handleEnrollClick: () => void;
  disabled?: boolean;
}> = ({ 
  isLoggedIn, 
  loading, 
  courseDetails, 
  isTestUser, 
  selectedInstallmentPlan, 
  appliedCoupon, 
  getFinalPriceWithCoupon, 
  getFinalPrice, 
  formatPriceDisplay, 
  handleEnrollClick,
  disabled = false
}) => {
  const getButtonText = () => {
    if (!isLoggedIn) return 'Login to Enroll';
    if (courseDetails?.isFree) return 'Enroll for Free';
    
    const price = selectedInstallmentPlan 
      ? selectedInstallmentPlan.downPayment 
      : (appliedCoupon ? getFinalPriceWithCoupon() : getFinalPrice());
    
    return isTestUser ? `Test Pay ${formatPriceDisplay(price)}` : `Pay ${formatPriceDisplay(price)}`;
  };

  const getButtonIcon = () => {
    if (!isLoggedIn) return <Lock className="w-6 h-6" />;
    if (courseDetails?.isFree) return <GraduationCap className="w-6 h-6" />;
    return <CreditCard className="w-6 h-6" />;
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleEnrollClick}
      disabled={loading || disabled}
      className={`relative w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-semibold text-lg rounded-xl flex items-center justify-center gap-3 shadow-lg transition-all duration-300 overflow-hidden group ${
        loading || disabled ? 'opacity-70 cursor-not-allowed' : ''
      }`}
      aria-label={getButtonText()}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
      
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Processing...</span>
        </div>
      ) : (
        <div className="relative flex items-center gap-3">
          {getButtonIcon()}
          <span>{getButtonText()}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </motion.button>
  );
};

const PaymentSecurityInfo: React.FC<{ isTestUser: boolean }> = ({ isTestUser }) => (
  <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-slate-800 border border-slate-200 dark:border-gray-700 rounded-xl p-6">
    <div className="space-y-5">
      {/* Header - Left Aligned */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          {isTestUser ? "Test Payment by Razorpay" : "Secure Payment by Razorpay"}
        </span>
      </div>

      {/* Payment Methods - Left Aligned with 2 Columns */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
          Accepted Payment Methods
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: CreditCard, label: 'All Cards' },
            { icon: Building2, label: 'Net Banking' },
            { icon: Smartphone, label: 'UPI' },
            { icon: Wallet, label: 'Wallets' }
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium border border-blue-200 dark:border-blue-800/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Security Message - Left Aligned */}
      <div className="pt-2 border-t border-slate-200 dark:border-gray-600">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Lock className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="font-medium">Your payment information is encrypted & secure</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          256-bit SSL encryption • PCI DSS compliant
        </p>
      </div>
    </div>
  </div>
);

const CourseFeatures: React.FC<{ features: string[] }> = ({ features }) => (
  <div className="space-y-4">
    <h4 className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
        <Award className="w-5 h-5 text-emerald-500" />
      </div>
      What you'll get
    </h4>

    <div className="grid gap-3">
      {features.map((feature: string, index: number) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-800/30 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{feature}</span>
        </div>
      ))}
    </div>
  </div>
);

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
      
      setIsLoading(false);
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

    const preferredPrice = prices.find(price => 
      price.is_active && price.currency === 'USD'
    );

    const activePrice = prices.find(price => price.is_active);
    const finalPrice = preferredPrice || activePrice || prices[0] || null;
    return finalPrice;
  }, [courseDetails]);

  // State for active pricing
  const [activePricing, setActivePricing] = useState<Price | null>(initialActivePricing || null);

  // Update activePricing when course details changes
  useEffect(() => {
    const price = getActivePrice();
    setActivePricing(price);
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

  // Enhanced Razorpay payment handler
  const handleRazorpayPayment = async (): Promise<void> => {
    console.log("Initiating handleRazorpayPayment...");
    if (!courseDetails?._id || !activePricing) {
      showToast.error("Course information or pricing is missing for payment.");
      console.error("Payment initiation failed: Missing courseDetails or activePricing.");
      return;
    }

    try {
      setLoading(true);
      
      const isTestUser = userId === '67cfe3a9a50dbb995b4d94da';
      const finalPrice = appliedCoupon ? getFinalPriceWithCoupon() : getFinalPrice();
      const originalCurrency = activePricing.currency;
      
      const userEmail = userProfile?.email || 'user@example.com';
      const userName = userProfile?.full_name || userProfile?.name || 'User';
      const userPhone = userProfile?.phone_number || userProfile?.mobile || '9999999999';

      console.log("Payment details:", {
        finalPrice,
        originalCurrency,
        userEmail,
        userName,
        userPhone,
        isTestUser,
        enrollmentType,
        selectedInstallmentPlan,
        appliedCoupon,
      });

      let paymentAmount = Math.round(finalPrice * 100);
      let paymentDescription = `Payment for ${courseDetails?.course_title || "Course"} (${enrollmentType} enrollment)`;
      
      if (selectedInstallmentPlan) {
        paymentAmount = Math.round(selectedInstallmentPlan.downPayment * 100);
        paymentDescription = `Down payment for ${courseDetails?.course_title || "Course"} (EMI plan: ${selectedInstallmentPlan.installments} months)`;
      }
      
      const razorpayKey = isTestUser 
        ? process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag'
        : process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_key';
      
      console.log("Using Razorpay Key:", razorpayKey);

      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: paymentAmount,
        currency: originalCurrency,
        name: isTestUser ? "MEDH Education Platform (TEST MODE)" : "MEDH Education Platform",
        description: isTestUser ? `[TEST] ${paymentDescription}` : paymentDescription,
        image: "/images/medhlogo.svg",
        handler: async function (response: any) {
          console.log("Razorpay payment handler triggered. Response:", response);
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
          
          if (selectedInstallmentPlan) {
            response.emi_plan = selectedInstallmentPlan.installments.toString();
            response.down_payment = selectedInstallmentPlan.downPayment.toString();
            response.installment_amount = selectedInstallmentPlan.installmentAmount.toString();
            response.is_emi = 'true';
            console.log("Installment plan details added to payment response:", response);
          }
          
          if (userId) {
            console.log("Calling enrollCourse after successful payment.");
            await enrollCourse(userId, courseDetails._id, response);
          } else {
            console.error("Enrollment failed: userId is missing after successful payment.");
            showToast.error("Enrollment failed: User ID missing. Please log in again.");
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
          test_mode: isTestUser ? 'true' : 'false'
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            showToast.error("Payment cancelled", { duration: 3000 });
            console.log("Razorpay modal dismissed by user.");
          }
        }
      };

      const loadingMessage = isTestUser 
        ? "Initializing test payment gateway..." 
        : "Initializing secure payment...";
        
      showToast.loading(loadingMessage, { duration: 2000 });
      console.log("Attempting to open Razorpay checkout with options:", options);
      await openRazorpayCheckout(options);
    } catch (err: any) {
      console.error("Razorpay payment initiation error:", err);
      setError(err.message || "Failed to process payment. Please try again.");
      showToast.error("Payment failed. Please try again.", {
        duration: 4000,
        style: { background: '#EF4444', color: '#fff' },
      });
    } finally {
      setLoading(false);
      console.log("Razorpay payment process finished. Loading set to false.");
    }
  };

  // Enroll course function
  const enrollCourse = async (studentId: string, courseId: string, paymentResponse: any = {}): Promise<any> => {
    console.log("Initiating enrollCourse function.");
    console.log("EnrollCourse parameters:", { studentId, courseId, paymentResponse });
    if (!studentId || !courseId) {
      console.error("enrollCourse called with missing IDs", { studentId, courseId });
      showToast.error("Student ID and Course ID are required for enrollment. Please log in again or refresh the page.");
      return false;
    }
    console.log("Enrolling with student ID:", studentId, "and course ID:", courseId);
    try {
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
      
      if (selectedInstallmentPlan && paymentResponse.emi_id) {
        enrollmentData.is_emi = true;
        enrollmentData.emi_config = {
          totalAmount: getFinalPrice(),
          downPayment: selectedInstallmentPlan.downPayment,
          numberOfInstallments: selectedInstallmentPlan.installments,
          installmentAmount: selectedInstallmentPlan.installmentAmount,
        };
      }
      
      console.log("Enrollment data prepared for API call:", enrollmentData);
      console.log("API Base URL:", apiBaseUrl);
      console.log("Authorization Token:", localStorage.getItem('token') ? "Token present" : "Token missing");

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
        
        console.log("Enrollment API response:", response.status, response.data);

        if (response.status === 201 || response.status === 200) {
          showToast.success("Successfully enrolled in the course!");
          setIsSuccessModalOpen(true);
          return true;
        } else {
          console.error("Enrollment API returned non-success status:", response.status, response.data);
          throw new Error(response.data?.message || "Failed to enroll in the course.");
        }
      } catch (apiError: any) {
        console.error("Error during primary enrollment API call:", apiError);
        console.log("Primary enrollment API not available or failed, trying alternative approach...");
        
        if (courseDetails?.isFree || isFreePrice(getFinalPrice())) {
          showToast.success("Free course enrollment successful! You can start learning immediately.");
          setIsSuccessModalOpen(true);
          return true;
        } else if (paymentResponse?.razorpay_payment_id) {
          showToast.success("Payment successful! Enrollment confirmed.");
          setIsSuccessModalOpen(true);
          return true;
        } else {
          // Re-throw if it's a critical error not handled by fallbacks
          throw apiError;
        }
      }
    } catch (error: any) {
      console.error("Overall enrollCourse error:", error);
      showToast.error(error.response?.data?.message || "Failed to enroll in the course. Please contact support.");
      return false;
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
      setError(err.message || "An unexpected error occurred during enrollment.");
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

  // Handle course features
  // Only use features if provided by courseDetails
  const courseFeatures = useMemo(() => {
    return courseDetails?.features || [];
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
    return (
      courseDetails?.classType === 'Live Classes' || 
      courseDetails?.class_type === 'Live Classes' ||
      courseDetails?.course_type === 'live' || 
      courseDetails?.course_type === 'Live' ||
      courseDetails?.delivery_format === 'Live' ||
      courseDetails?.delivery_type === 'Live'
    );
  }, [
    courseDetails?.classType, 
    courseDetails?.class_type, 
    courseDetails?.course_type,
    courseDetails?.delivery_format,
    courseDetails?.delivery_type
  ]);

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

  // Check if current user is test user
  const isTestUser = userId === '67cfe3a9a50dbb995b4d94da';

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
          <EnrollmentTypeSelector 
            enrollmentType={enrollmentType}
            onTypeChange={handleEnrollmentTypeChange}
            activePricing={activePricing}
            formatPriceDisplay={formatPriceDisplay}
            colorClass={colorClass}
            bgClass={bgClass}
            isBlendedCourse={isBlendedCourse}
          />
          
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
                <CreditCard className={`w-6 h-6 ${colorClass}`} />
              </div>
            </motion.div>
          )}

          {/* Payment Summary */}
          {!courseDetails?.isFree && (
            <PricingSummary
              originalPrice={originalPrice || getFinalPrice()}
              finalPrice={appliedCoupon ? getFinalPriceWithCoupon() : getFinalPrice()}
              currency={getDisplayCurrencySymbol()}
              discountAmount={originalPrice ? (originalPrice - getFinalPrice()) : 0}
              enrollmentType={enrollmentType}
              selectedInstallmentPlan={selectedInstallmentPlan}
              appliedCoupon={appliedCoupon}
              couponDiscount={appliedCoupon ? calculateCouponDiscount() : 0}
            />
          )}

          {/* Session Information */}
          <SessionInfoCard 
            sessionCount={courseDetails?.no_of_Sessions || 0}
            isLiveClass={isLiveClass}
          />

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
          
          {/* Enrollment Button */}
          <div className="space-y-4">
            <EnrollmentButton 
              isLoggedIn={isLoggedIn}
              loading={loading}
              courseDetails={courseDetails}
              isTestUser={isTestUser}
              selectedInstallmentPlan={selectedInstallmentPlan}
              appliedCoupon={appliedCoupon}
              getFinalPriceWithCoupon={getFinalPriceWithCoupon}
              getFinalPrice={getFinalPrice}
              formatPriceDisplay={formatPriceDisplay}
              handleEnrollClick={handleEnrollClick}
              disabled={!userId || !courseDetails?._id || loading}
            />

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
          
          {/* Course Features */}
          {courseFeatures.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <CourseFeatures features={courseFeatures} />
            </div>
          )}
          
          {/* Fast Track Option */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <FastTrackInfo />
          </div>
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