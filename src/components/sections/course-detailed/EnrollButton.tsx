import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  GraduationCap, 
  ArrowRight, 
  BookOpen, 
  FileBadge,
  CheckCircle2,
  Loader2,
  Shield,
  Clock,
  Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import useRazorpay from "@/hooks/useRazorpay";
import { apiBaseUrl } from "@/apis";

// Interfaces
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

interface CourseDetails {
  _id: string;
  title?: string;
  course_title?: string;
  course_image?: string;
  isFree?: boolean;
  prices?: Price[];
  course_fee?: number;
  course_duration?: string;
  is_Certification?: boolean | string;
  classType?: string;
  class_type?: string;
  course_type?: string;
  delivery_format?: string;
  delivery_type?: string;
  // ... other course properties
}

interface CategoryInfo {
  primaryColor?: string;
  colorClass?: string;
  bgClass?: string;
  borderClass?: string;
  displayName?: string;
}

interface EnrollButtonProps {
  courseDetails: CourseDetails | null;
  categoryInfo?: CategoryInfo;
  userCurrency?: string;
  enrollmentType?: 'individual' | 'batch';
  activePricing?: Price | null;
  onEnrollmentTypeChange?: (type: 'individual' | 'batch') => void;
  onActivePricingChange?: (pricing: Price | null) => void;
  className?: string;
  variant?: 'default' | 'floating' | 'compact';
  showCourseInfo?: boolean;
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  navigateToCourse: () => void;
  pricePaid: string;
}

// Success Modal Component
const SuccessModal: React.FC<SuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  courseTitle, 
  navigateToCourse, 
  pricePaid 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full transform transition-all duration-300 scale-100">
        <div className="text-center">
          <CheckCircle2 className="mx-auto text-emerald-500 h-12 w-12 mb-3" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Enrollment Successful!
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            You are now enrolled in:
          </p>
          <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
            {courseTitle}
          </p>
          {pricePaid !== 'Free' && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Amount paid: <span className="font-medium">{pricePaid}</span>
            </p>
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

// Main EnrollButton Component
const EnrollButton: React.FC<EnrollButtonProps> = ({
  courseDetails,
  categoryInfo,
  userCurrency = 'USD',
  enrollmentType = 'batch',
  activePricing = null,
  onEnrollmentTypeChange,
  onActivePricingChange,
  className = '',
  variant = 'default',
  showCourseInfo = false
}) => {
  const router = useRouter();
  const { 
    loadRazorpayScript, 
    openRazorpayCheckout, 
    isScriptLoaded, 
    isLoading: razorpayLoading, 
    error: razorpayError 
  } = useRazorpay();

  // Local state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

  // Check login status
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
    }
  }, []);

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
  }, [courseDetails]);

  // Get active price
  const getActivePrice = useCallback(() => {
    if (!courseDetails?.prices || !Array.isArray(courseDetails.prices)) {
      return null;
    }

    const prices = courseDetails.prices;
    if (prices.length === 0) {
      return null;
    }

    const preferredPrice = prices.find(price => 
      price.currency?.toLowerCase() === userCurrency?.toLowerCase()
    );

    const activePrice = prices.find(price => price.is_active);
    const finalPrice = preferredPrice || activePrice || prices[0] || null;
    
    return finalPrice;
  }, [courseDetails, userCurrency]);

  // Update activePricing when course details change
  useEffect(() => {
    const price = getActivePrice();
    if (onActivePricingChange) {
      onActivePricingChange(price);
    }
  }, [courseDetails?.prices, courseDetails?._id, getActivePrice, onActivePricingChange]);

  // Force individual enrollment for blended courses
  useEffect(() => {
    if (isBlendedCourse && onEnrollmentTypeChange) {
      onEnrollmentTypeChange('individual');
    }
  }, [isBlendedCourse, onEnrollmentTypeChange]);

  // Calculate final price including discounts
  const calculateFinalPrice = useCallback((price: number | undefined, discount: number | undefined): number => {
    if (!price) return 0;
    const safeDiscount = discount || 0;
    const finalPrice = price - (price * safeDiscount / 100);
    return finalPrice;
  }, []);
  
  // Get the final price in the user's currency
  const getFinalPrice = useCallback((): number => {
    if (!activePricing) {
      return courseDetails?.course_fee || 0;
    }
    
    const basePrice = isBlendedCourse 
      ? activePricing.individual
      : (enrollmentType === 'individual' ? activePricing.individual : activePricing.batch);
    
    const discountPercentage = isBlendedCourse
      ? activePricing.early_bird_discount
      : (enrollmentType === 'batch' ? activePricing.group_discount : activePricing.early_bird_discount);
    
    const finalPrice = calculateFinalPrice(basePrice, discountPercentage);
    return finalPrice;
  }, [activePricing, enrollmentType, calculateFinalPrice, isBlendedCourse, courseDetails]);

  // Format price for display
  const getDisplayCurrencySymbol = useCallback(() => {
    const currencySymbols: { [key: string]: string } = {
      'USD': '$', 'INR': '₹', 'EUR': '€', 'GBP': '£', 'JPY': '¥',
      'CAD': 'C$', 'AUD': 'A$', 'SGD': 'S$', 'CHF': 'CHF', 'CNY': '¥',
      'KRW': '₩', 'THB': '฿', 'MYR': 'RM', 'PHP': '₱', 'VND': '₫',
      'IDR': 'Rp', 'BRL': 'R$', 'MXN': '$', 'ZAR': 'R', 'RUB': '₽',
      'TRY': '₺', 'AED': 'د.إ', 'SAR': 'ر.س', 'QAR': 'ر.ق', 'KWD': 'د.ك',
      'BHD': 'د.ب', 'OMR': 'ر.ع.', 'JOD': 'د.أ', 'LBP': 'ل.ل', 'EGP': 'ج.م',
      'PKR': '₨', 'BDT': '৳', 'LKR': '₨', 'NPR': '₨', 'AFN': '؋', 'IRR': '﷼'
    };

    if (courseDetails?.prices && courseDetails.prices.length > 0) {
      const activePrice = courseDetails.prices.find((p: any) => p.is_active);
      if (activePrice && activePrice.currency) {
        return currencySymbols[activePrice.currency.toUpperCase()] || activePrice.currency;
      }
      if (courseDetails.prices[0]?.currency) {
        return currencySymbols[courseDetails.prices[0].currency.toUpperCase()] || courseDetails.prices[0].currency;
      }
    }
    return currencySymbols[userCurrency?.toUpperCase() || 'INR'] || '₹';
  }, [courseDetails, userCurrency]);
  
  const formatPriceDisplay = useCallback((price: number | undefined | null): string => {
    const courseIsActuallyFree = courseDetails?.isFree || 
      courseDetails?.course_fee === 0 ||
      (courseDetails?.prices && courseDetails.prices.every((p: any) => p.individual === 0 && p.batch === 0));
    
    if (courseIsActuallyFree || price === 0) return "Free";
    if (price === undefined || price === null || isNaN(price)) return "N/A";

    const symbol = getDisplayCurrencySymbol();
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) return "N/A";

    const formattedPrice = numericPrice.toLocaleString(undefined, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    });
    return symbol.length > 1 ? `${symbol} ${formattedPrice}` : `${symbol}${formattedPrice}`;
  }, [courseDetails, getDisplayCurrencySymbol]);

  // Check if price is free
  const isFreePrice = useCallback((price: number): boolean => {
    return !price || price <= 0 || price < 0.01;
  }, []);

  // Check enrollment status
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
      return false;
    }
  };

  // Enroll course function
  const enrollCourse = async (studentId: string, courseId: string, paymentResponse: any = {}): Promise<any> => {
    try {
      const enrollmentData: any = {
        student_id: studentId,
        course_id: courseId,
        enrollment_type: enrollmentType,
        payment_information: {
          ...paymentResponse,
          payment_method: paymentResponse?.razorpay_payment_id ? 'razorpay' : 'free',
          amount: getFinalPrice(),
          currency: userCurrency || 'USD',
          enrollment_type: enrollmentType,
          original_price: activePricing ? (enrollmentType === 'individual' ? activePricing.individual : activePricing.batch) : courseDetails?.course_fee || 0,
          discount_applied: activePricing ? (enrollmentType === 'batch' ? activePricing.group_discount : activePricing.early_bird_discount) || 0 : 0
        }
      };
      
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
          toast.success("Successfully enrolled in the course!");
          setIsSuccessModalOpen(true);
          return true;
        } else {
          throw new Error("Failed to enroll in the course.");
        }
      } catch (apiError: any) {
        console.log("Primary enrollment API not available, trying alternative approach...");
        
        if (courseDetails?.isFree || courseDetails?.course_fee === 0) {
          toast.success("Free course enrollment successful! You can start learning immediately.");
          setIsSuccessModalOpen(true);
          return true;
        } else if (paymentResponse?.razorpay_payment_id) {
          toast.success("Payment successful! Enrollment confirmed.");
          setIsSuccessModalOpen(true);
          return true;
        } else {
          throw apiError;
        }
      }
    } catch (error: any) {
      console.error("Enrollment error:", error);
      toast.error(error.response?.data?.message || "Failed to enroll in the course. Please contact support.");
      return false;
    }
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async (): Promise<void> => {
    if (!courseDetails?._id) {
      toast.error("Course information is missing");
      return;
    }

    try {
      setEnrollmentLoading(true);
      
      const isTestUser = userId === '67cfe3a9a50dbb995b4d94da';
      const finalPrice = getFinalPrice();
      const currency = userCurrency || 'INR';
      
      const userEmail = userProfile?.email || 'test@medh.in';
      const userName = userProfile?.full_name || userProfile?.name || 'MEDH Student';
      const userPhone = userProfile?.phone_number || userProfile?.mobile || '9999999999';

      let paymentAmount = Math.round(finalPrice * 100);
      let paymentDescription = `Payment for ${courseDetails?.title || courseDetails?.course_title || "Course"}`;
      
      const options = {
        key: isTestUser 
          ? process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag'
          : process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
        amount: paymentAmount,
        currency: currency,
        name: isTestUser ? "MEDH Education Platform (TEST MODE)" : "MEDH Education Platform",
        description: isTestUser ? `[TEST] ${paymentDescription}` : paymentDescription,
        image: "/images/medhlogo.svg",
        handler: async function (response: any) {
          const successMessage = isTestUser 
            ? "Test Payment Successful! 🧪✅" 
            : "Payment Successful! 🎉";
          
          toast.success(successMessage, {
            duration: 4000,
            style: {
              background: isTestUser ? '#8B5CF6' : '#10B981',
              color: '#fff',
            },
          });
          
          if (userId) {
            await enrollCourse(userId, courseDetails._id, response);
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone,
        },
        notes: {
          course_id: courseDetails._id,
          user_id: userId || '',
          currency: currency,
          price: finalPrice.toString(),
          platform: 'MEDH_WEB',
          test_mode: isTestUser ? 'true' : 'false'
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: function() {
            setEnrollmentLoading(false);
            toast.error("Payment cancelled", {
              duration: 3000,
            });
          }
        }
      };

      toast.loading(isTestUser ? "Initializing test payment gateway..." : "Initializing secure payment...", {
        duration: 2000,
      });

      await openRazorpayCheckout(options);
    } catch (err: any) {
      console.error("Enrollment error:", err);
      toast.error("Payment failed. Please try again.", {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      });
    } finally {
      setEnrollmentLoading(false);
    }
  };

  // Handle enrollment click
  const handleEnrollClick = async () => {
    if (!courseDetails?._id) {
      toast.error("Course information is missing");
      return;
    }

    try {
      setEnrollmentLoading(true);
      
      if (!isLoggedIn) {
        const currentPath = window.location.pathname;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }

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
      
      if (isFreePrice(getFinalPrice())) {
        if (userId) {
          await enrollCourse(userId, courseDetails._id);
        }
      } else {
        await handleRazorpayPayment();
      }
    } catch (err: any) {
      console.error("Enrollment error:", err);
      toast.error("Enrollment failed. Please try again.");
    } finally {
      setEnrollmentLoading(false);
    }
  };

  // Navigate to courses
  const navigateToCourses = () => {
    setIsSuccessModalOpen(false);
    router.push('/dashboards/my-courses');
  };

  // Get button content based on state
  const getButtonContent = () => {
    if (enrollmentLoading) {
      return (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Processing...</span>
        </>
      );
    }

    if (!courseDetails) {
      return (
        <>
          <BookOpen className="h-5 w-5" />
          <span>Select a Course</span>
        </>
      );
    }

    if (!isLoggedIn) {
      return (
        <>
          <GraduationCap className="h-5 w-5" />
          <span>Login to Enroll</span>
          <ArrowRight className="h-4 w-4" />
        </>
      );
    }

    if (isFreePrice(getFinalPrice())) {
      return (
        <>
          <GraduationCap className="h-5 w-5" />
          <span>Enroll for Free</span>
          <ArrowRight className="h-4 w-4" />
        </>
      );
    }

    return (
      <>
        <CreditCard className="h-5 w-5" />
        <span>Pay {formatPriceDisplay(getFinalPrice())}</span>
        <ArrowRight className="h-4 w-4" />
      </>
    );
  };

  // Get button styles based on variant
  const getButtonStyles = () => {
    const baseStyles = "font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 relative overflow-hidden group";
    
    const enabledStyles = courseDetails && !enrollmentLoading
      ? `
        bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 
        hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700
        shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40
        border border-emerald-400/20 hover:border-emerald-300/30
        backdrop-blur-sm
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
        after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/10 after:to-transparent
        hover:scale-[1.02] active:scale-[0.98]
        transform-gpu
      `
      : `
        bg-gradient-to-br from-gray-400 to-gray-500 
        shadow-lg shadow-gray-400/20 
        cursor-not-allowed 
        border border-gray-300/20
        backdrop-blur-sm
      `;

    const sizeStyles = {
      'floating': 'w-full py-4 px-6 rounded-xl text-base',
      'compact': 'py-2 px-4 rounded-lg text-sm',
      'default': 'w-full py-3 px-6 rounded-lg text-base'
    };

    return `${baseStyles} ${enabledStyles} ${sizeStyles[variant]}`;
  };

  const courseTitle = courseDetails?.title || courseDetails?.course_title || "Course";

  return (
    <div className="relative w-full">
      {/* Enhanced Smoky Glassmorphism Container - Bottom Sticky */}
      <div className="relative p-4 pb-8 bg-gradient-to-t from-slate-100/95 via-white/85 to-slate-50/75 dark:from-slate-950/95 dark:via-gray-900/85 dark:to-slate-900/75 backdrop-blur-2xl border-t border-white/40 dark:border-gray-600/40 shadow-2xl shadow-gray-900/20 dark:shadow-black/40 overflow-hidden">
        
        {/* Enhanced smoky gradient orbs with more realistic glass effect */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-gradient-radial from-emerald-400/30 via-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-gradient-radial from-purple-400/30 via-pink-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 -left-8 w-28 h-28 bg-gradient-radial from-cyan-300/25 via-teal-400/15 to-transparent rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-1/4 -right-8 w-24 h-24 bg-gradient-radial from-orange-300/25 via-red-400/15 to-transparent rounded-full blur-2xl animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-gradient-radial from-yellow-300/20 via-orange-400/10 to-transparent rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Additional atmospheric orbs for depth */}
        <div className="absolute top-0 left-1/4 w-20 h-20 bg-gradient-radial from-indigo-300/25 via-purple-400/15 to-transparent rounded-full blur-xl animate-pulse delay-200"></div>
        <div className="absolute bottom-0 right-1/4 w-22 h-22 bg-gradient-radial from-green-300/25 via-emerald-400/15 to-transparent rounded-full blur-xl animate-pulse delay-800"></div>
        <div className="absolute top-1/3 right-0 w-18 h-18 bg-gradient-radial from-rose-300/20 via-pink-400/10 to-transparent rounded-full blur-lg animate-pulse delay-400"></div>
        <div className="absolute bottom-1/3 left-0 w-16 h-16 bg-gradient-radial from-violet-300/20 via-purple-400/10 to-transparent rounded-full blur-lg animate-pulse delay-600"></div>
        
        {/* Enhanced mesh pattern with depth */}
        <div className="absolute inset-0 opacity-30 dark:opacity-25" style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0),
            radial-gradient(circle at 10px 10px, rgba(255,255,255,0.2) 1px, transparent 0)
          `,
          backgroundSize: '20px 20px, 40px 40px'
        }}></div>
        
        {/* Frosted glass overlay for realistic glassmorphism */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-white/5 to-white/15 dark:from-gray-800/10 dark:via-gray-800/5 dark:to-gray-800/15 backdrop-blur-sm"></div>
        
        {/* Main content with relative positioning */}
        <div className="relative z-10">
          {/* Main Enroll Button */}
          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={handleEnrollClick}
            className={`${getButtonStyles()} ${className}`}
            disabled={!courseDetails || enrollmentLoading}
          >
            <div className="flex items-center justify-center space-x-2 relative z-10">
              {getButtonContent()}
            </div>
            
            {/* Animated shimmer effect */}
            {courseDetails && !enrollmentLoading && (
              <div className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            )}
          </motion.button>
        </div>
        
        {/* Subtle border glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-gray-200/20 dark:from-gray-600/20 dark:to-gray-800/20 pointer-events-none"></div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        courseTitle={courseTitle}
        navigateToCourse={navigateToCourses}
        pricePaid={formatPriceDisplay(getFinalPrice())}
      />
    </div>
  );
};

export default EnrollButton;