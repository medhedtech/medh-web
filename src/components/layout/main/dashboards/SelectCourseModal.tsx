"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, AlertCircle, Loader2, CheckCircle, Filter, BookOpen, Clock, Users, Star, Grid, List } from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { getAllCoursesWithLimits } from "@/apis/course/course";
import usePostQuery from "@/hooks/postQuery.hook";
import Education from "@/assets/images/course-detailed/education.svg";
import Preloader from "@/components/shared/others/Preloader";
import { useRouter } from "next/navigation";
import useRazorpay from "@/hooks/useRazorpay";
import RAZORPAY_CONFIG, { USD_TO_INR_RATE } from "@/config/razorpay";
import { showToast } from "@/utils/toastManager";
import Image from "next/image";
import { createPortal } from "react-dom";

interface SelectCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: string;
  amount: string;
  selectedPlan: string;
  closeParent: () => void;
}

interface Course {
  _id: string;
  course_title: string;
  course_category?: string;
  category?: string;
  course_description?: string;
  course_image?: string;
  course_fee?: number;
  no_of_Sessions?: number;
  course_duration?: string;
  session_duration?: string;
  class_type?: string;
  course_level?: string;
  status?: string;
  enrolledStudents?: number;
  meta?: {
    views?: number;
  };
}

interface Category {
  _id: string;
  category_name: string;
  category_image?: string;
  courseCount?: number;
  courses?: Course[];
}

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, isSelected, onClick, disabled }) => {
  const fallbackImage = "/fallback-category-image.jpg";
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      whileHover={!disabled ? { 
        scale: 1.03, 
        y: -8,
        transition: { duration: 0.2, ease: "easeOut" }
      } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={!disabled ? onClick : undefined}
      className={`group relative bg-white dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl transition-all duration-500 overflow-hidden cursor-pointer shadow-lg ${
        isSelected
          ? "ring-4 ring-primary-400/50 shadow-2xl shadow-primary-500/20 bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-primary-900/30 dark:via-gray-800/80 dark:to-primary-900/30 border-2 border-primary-300 dark:border-primary-600"
          : disabled
          ? "opacity-40 cursor-not-allowed grayscale"
          : "border-2 border-gray-100 dark:border-gray-700/30 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-2xl hover:shadow-primary-500/10"
      }`}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-5 right-5 z-10"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-gray-800">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
        </motion.div>
      )}

      {/* Floating Badge */}
      <div className="absolute top-5 left-5 z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-amber-500 text-black dark:text-white shadow-lg"
        >
          <Star className="w-3 h-3 mr-1" />
          Blended
        </motion.div>
      </div>

      <div className="p-7">
        {/* Category Image */}
        <div className="relative w-full h-40 mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 via-primary-50 to-amber-50 dark:from-primary-900/40 dark:via-primary-800/30 dark:to-amber-900/20 group-hover:scale-105 transition-transform duration-500">
          <Image
            src={category.category_image || fallbackImage}
            alt={category.category_name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            width={200}
            height={160}
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          
          {/* Overlay Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Category Content */}
        <div className="space-y-5">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 mb-2">
              {category.category_name}
            </h3>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Learning Category
            </p>
          </div>

          {/* Course Count - Enhanced Design */}
          <div className="flex justify-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 border border-primary-200 dark:border-primary-700"
            >
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div className="text-center">
                <span className="text-lg font-bold text-primary-700 dark:text-primary-300">
                  {category.courseCount || 0}
                </span>
                <p className="text-xs font-medium text-primary-600 dark:text-primary-400">
                  Courses
                </p>
              </div>
            </motion.div>
          </div>

          {/* Features - Enhanced Design */}
          <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700/50">
            {[
              { icon: CheckCircle, text: "Pre-recorded videos", color: "text-emerald-500" },
              { icon: Users, text: "Live doubt sessions", color: "text-blue-500" },
              { icon: Clock, text: "Self-paced learning", color: "text-purple-500" }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index + 0.3 }}
                className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
              >
                <feature.icon className={`w-4 h-4 ${feature.color}`} />
                <span className="font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div 
            className="pt-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className={`text-center py-3 px-4 rounded-2xl font-semibold text-sm transition-all duration-300 ${
              isSelected 
                ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg" 
                : "bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 group-hover:text-primary-600"
            }`}>
              {isSelected ? "✓ Selected" : "Click to Select"}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-primary-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${disabled ? 'hidden' : ''}`} />
    </motion.div>
  );
};

// ----------------------------------------------------------------------------------
// Razorpay Test Key Handling
// ----------------------------------------------------------------------------------
// In test mode OR for the dedicated test user (ID: 67cfe3a9a50dbb995b4d94da), we want
// to ensure that we ALWAYS hit the Razorpay sandbox with the test credentials.
// Define the test key via env var for security; fall back to a hard-coded placeholder
// that should be REPLACED with the actual sandbox key when deploying.
// ----------------------------------------------------------------------------------

const RAZORPAY_TEST_KEY = process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY || "rzp_test_REPLACE_ME";
const RAZORPAY_ENV     = process.env.NEXT_PUBLIC_RAZORPAY_ENV || "live"; // 'live' | 'test'

/**
 * Returns the correct Razorpay key depending on environment or the logged-in user.
 */
const getRazorpayKey = (userId?: string): string => {
  // Explicit test env variable wins first
  if (RAZORPAY_ENV.toLowerCase() === "test") {
    if (!RAZORPAY_TEST_KEY || RAZORPAY_TEST_KEY.includes("REPLACE_ME")) {
      console.warn(
        "[Razorpay] Test mode requested but NEXT_PUBLIC_RAZORPAY_TEST_KEY is not set. Falling back to live key."
      );
      return RAZORPAY_CONFIG.key;
    }
    return RAZORPAY_TEST_KEY;
  }

  // Fallback: use test key when the special test user is logged in
  if (userId === "67cfe3a9a50dbb995b4d94da") {
    if (!RAZORPAY_TEST_KEY || RAZORPAY_TEST_KEY.includes("REPLACE_ME")) {
      console.warn(
        "[Razorpay] Test user detected but NEXT_PUBLIC_RAZORPAY_TEST_KEY is not set. Falling back to live key."
      );
      return RAZORPAY_CONFIG.key;
    }
    return RAZORPAY_TEST_KEY;
  }

  // Otherwise default to whatever is configured in RAZORPAY_CONFIG
  return RAZORPAY_CONFIG.key;
};

// ----------------------------------------------------------------------------------
// Razorpay Error Human-Readable Mapping
// ----------------------------------------------------------------------------------

const getFriendlyRazorpayError = (err: any): string => {
  const raw = err?.error?.description || err?.description || "";
  const lower = typeof raw === "string" ? raw.toLowerCase() : "";

  if (lower.includes("3dsecure")) {
    return "Your card is not enrolled for 3-D Secure authentication. Please use a card that supports 3-D Secure or contact your bank to enable it.";
  }

  if (lower.includes("network")) {
    return "Network error while processing the payment. Please check your connection and try again.";
  }

  if (lower.includes("expired")) {
    return "The card has expired. Please use a valid card.";
  }

  return `Payment failed: ${raw || "Unknown error"}`;
};

export default function SelectCourseModal({
  isOpen,
  onClose,
  planType,
  amount,
  selectedPlan,
  closeParent,
}: SelectCourseModalProps) {
  const studentId = localStorage.getItem("userId");
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { getQuery } = useGetQuery();
  const { postQuery, loading: postLoading } = usePostQuery();
  const [planAmount, setPlanAmount] = useState<number>(() => {
    // Remove any non-digit/period characters (handles ₹, $, commas, etc.)
    const numeric = parseFloat(amount.replace(/[^0-9.]/g, ""));
    return isNaN(numeric) ? 0 : numeric;
  });
  const router = useRouter();
  const { openRazorpayCheckout } = useRazorpay();

  // Normalize planType to lowercase for robust logic
  const normalizedPlanType = (planType || "").toLowerCase();
  const maxSelections = normalizedPlanType === "silver" ? 1 : normalizedPlanType === "gold" ? 3 : 1;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  // Fetch data on modal open
  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen) return;
      
      setLoading(true);
      setError(null);

      try {
        // Fetch categories and courses in parallel
        await Promise.all([
          getQuery({
            url: apiUrls?.categories?.getAllCategories,
            onSuccess: (res) => setCategories(res?.data || []),
            onFail: (err) => {
              console.error("Error fetching categories:", err);
              throw new Error("Failed to load categories");
            },
          }),
          getQuery({
            url: getAllCoursesWithLimits({
              page: 1,
              limit: 200, // Get more courses to count by category
              status: "Published",
              class_type: "Blended Courses", // Filter for blended courses only
              sort_by: "course_title",
              sort_order: "asc"
            }),
            onSuccess: (res) => {
              const coursesData = res?.data?.courses || res?.courses || res || [];
              console.log("Raw courses data:", coursesData);
              
              // Ensure we sanitize the course data to only include primitive values
              const sanitizedCourses = Array.isArray(coursesData) 
                ? coursesData.map((course: any) => ({
                    _id: course._id || '',
                    course_title: course.course_title || '',
                    course_category: course.course_category || course.category || '',
                    category: course.category || course.course_category || '',
                    course_description: typeof course.course_description === 'string' 
                      ? course.course_description 
                      : course.program_overview || '',
                    course_image: course.course_image || '',
                    course_fee: typeof course.course_fee === 'number' ? course.course_fee : 0,
                    no_of_Sessions: typeof course.no_of_Sessions === 'number' ? course.no_of_Sessions : 0,
                    course_duration: course.course_duration || '',
                    session_duration: course.session_duration || '',
                    class_type: course.class_type || '',
                    course_level: course.course_level || '',
                    status: course.status || '',
                    enrolledStudents: typeof course.enrolledStudents === 'number' ? course.enrolledStudents : 0,
                    meta: {
                      views: typeof course.meta?.views === 'number' ? course.meta.views : 0
                    }
                  }))
                : [];
              
              console.log("Sanitized courses:", sanitizedCourses);
              setCourses(sanitizedCourses);
            },
            onFail: (err) => {
              console.error("Error fetching courses:", err);
              throw new Error("Failed to load courses");
            },
          })
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

      fetchData();
  }, [isOpen, getQuery]);

  // Enhanced categories with course counts
  const enhancedCategories = useMemo(() => {
    return categories.map(category => {
      const categoryName = category.category_name;
      const categoryBlendedCourses = courses.filter(course => {
        const courseCategory = course.course_category || course.category || '';
        const classType = course.class_type || '';
        return courseCategory.toLowerCase() === categoryName.toLowerCase() && 
               classType.toLowerCase().includes('blended');
      });
      
      return {
        ...category,
        courseCount: categoryBlendedCourses.length,
        courses: categoryBlendedCourses
      };
    }).filter(category => category.courseCount > 0); // Only show categories with blended courses
  }, [categories, courses]);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return enhancedCategories;
    
    const query = searchQuery.toLowerCase();
    return enhancedCategories.filter(category =>
      category.category_name.toLowerCase().includes(query)
    );
  }, [enhancedCategories, searchQuery]);

  const toggleCategorySelection = (category: Category) => {
      setSelectedCategories(prev => {
      const isAlreadySelected = prev.some((c) => c._id === category._id);
      
      if (isAlreadySelected) {
          return prev.filter((c) => c._id !== category._id);
        }
      
      // Silver: only 1, Gold: up to 3
      if (normalizedPlanType === "silver") {
        return [category]; // Silver plan allows only 1 category
      } else if (normalizedPlanType === "gold") {
        if (prev.length < maxSelections) {
          return [...prev, category];
        }
        return prev; // Don't add if max reached
      } else {
        // Default fallback: only 1
        return [category];
      }
    });
  };

  const handleProceedToPay = async () => {
    if (!selectedCategories.length) {
      showToast.error("Please select at least one category");
      return;
    }

    setIsProcessing(true);
    
    try {
      const token = localStorage.getItem("token");
      const studentId = localStorage.getItem("userId");
      const userEmail = localStorage.getItem("userEmail") || "";
      const userName = localStorage.getItem("userName") || "Student";
      const userPhone = localStorage.getItem("userPhone") || "";

      if (!token || !studentId) {
        showToast.error("Please log in first to continue with payment.");
        setIsProcessing(false);
        return;
      }

      // Calculate total courses across selected categories
      const totalCourses = selectedCategories.reduce((sum, category) => sum + (category.courseCount || 0), 0);
      
      // Enhanced Razorpay configuration (with automatic test-mode detection)
      const razorpayOptions = {
        ...RAZORPAY_CONFIG,
        // Override the key based on environment / user
        key: getRazorpayKey(studentId || undefined),
        amount: Math.round(planAmount * 100), // amount in paise for INR
        currency: "INR",
        name: isTestUser
          ? "MEDH - Online Learning Platform (TEST MODE)"
          : "MEDH - Online Learning Platform",
        description: `${isTestUser ? '[TEST] ' : ''}${capitalize(planType)} Membership - Access to ${selectedCategories.length} categor${selectedCategories.length > 1 ? 'ies' : 'y'} (${totalCourses} courses)`,
        image: Education,
        order_id: "", // This should be generated from your backend
        
        // Customer details
        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone,
        },
        
        // Enhanced payment success handler
        handler: async function (response: any) {
          try {
            showToast.success("Payment successful! Setting up your membership...");
            
            // Verify payment on backend (recommended)
            const paymentData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: planAmount,
              plan_type: planType,
              categories: selectedCategories.map(cat => cat._id),
              student_id: studentId
            };
            
            console.log("Payment successful:", paymentData);
            await handleSubmit();
            
          } catch (error) {
            console.error("Post-payment processing error:", error);
            showToast.error("Payment successful but enrollment failed. Please contact support.");
            setIsProcessing(false);
          }
        },
        
        // Enhanced modal configuration
        modal: {
          ondismiss: function() {
            showToast.info("Payment cancelled. Your selection has been saved.");
            setIsProcessing(false);
          },
          confirm_close: true,
          escape: true,
          backdropclose: false
        },
        
        // Enhanced error handling
        error: function(error: any) {
          console.error("Razorpay error:", error);
          showToast.error(getFriendlyRazorpayError(error));
          setIsProcessing(false);
        },
        
        // Theme customization
        theme: {
          color: "#3B82F6", // Primary blue color
          backdrop_color: "rgba(0, 0, 0, 0.6)"
        },
        
        // Additional options
        retry: {
          enabled: true,
          max_count: 3
        },
        
        timeout: 300, // 5 minutes timeout
        
        // Notes for transaction tracking
        notes: {
          plan_type: planType,
          categories_count: selectedCategories.length.toString(),
          courses_count: totalCourses.toString(),
          student_id: studentId,
          membership_type: "blended_courses"
        }
      };

      // Flag note for testing if applicable
      if (isTestUser) {
        razorpayOptions.notes!.test_mode = 'true';
      }

      // Show loading state with better UX
      showToast.info("Initializing secure payment...");
      
      await openRazorpayCheckout(razorpayOptions);
      
    } catch (error) {
      console.error("Payment initialization error:", error);
      
      // More specific error messages
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('network')) {
        showToast.error("Network error. Please check your connection and try again.");
      } else if (errorMessage.includes('razorpay')) {
        showToast.error("Payment service unavailable. Please try again later.");
      } else {
        showToast.error("Failed to initialize payment. Please refresh and try again.");
      }
      
      setIsProcessing(false);
    }
  };

  const handleSubscribe = async () => {
    if (!studentId) return;
    
    try {
      const membershipResponse = await postQuery({
        url: apiUrls?.Membership?.addMembership,
        postData: {
          student_id: studentId,
          category_ids: selectedCategories.map((category) => category._id),
          amount: planAmount,
          plan_type: planType,
          duration: selectedPlan.toLowerCase(),
        },
      });

      if (!membershipResponse.success) {
        throw new Error("Failed to create membership");
      }

      const membershipId = membershipResponse?.data?._id;
      const expiryDate = membershipResponse?.data?.expiry_date;
      const categoryNames = membershipResponse?.data?.category_ids?.map(
        (category: Category) => category.category_name
      ) || [];

      if (!membershipId || !expiryDate) {
        throw new Error("Invalid membership data received");
      }

      // Get all courses from selected categories
      const enrolledCourses: string[] = [];
      selectedCategories.forEach(category => {
        if (category.courses) {
          category.courses.forEach(course => {
            enrolledCourses.push(course._id);
          });
        }
      });

      // Process all enrollments in parallel
      await Promise.all(
        enrolledCourses.map(async (courseId) => {
          const subscriptionResponse = await postQuery({
            url: apiUrls?.Subscription?.AddSubscription,
            postData: {
              student_id: studentId,
              course_id: courseId,
              amount: removeFirstChr(amount) * 84.71,
              status: "success",
            },
          });

          if (subscriptionResponse.success) {
            await postQuery({
              url: apiUrls?.EnrollCourse?.enrollCourse,
              postData: {
                student_id: studentId,
                course_id: courseId,
                membership_id: membershipId,
                expiry_date: expiryDate,
                is_self_paced: true,
              },
            });
          }
        })
      );

      showToast.success(`Successfully enrolled in ${enrolledCourses.length} courses across ${selectedCategories.length} categories!`);
      router.push("/dashboards/student-membership");
    } catch (err) {
      console.error("Error during subscription process:", err);
      showToast.error(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    }
  };

  const removeFirstChr = (str = ""): number => {
    if (!str.length) return 0;
    return Number(str.substring(1));
  };

  function capitalize(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const handleSubmit = () => {
    handleSubscribe();
    onClose();
    closeParent();
  };

  // ---------------------------------------------------------------------------
  // TEST MODE DETECTION (mirrors EnrollmentDetails.tsx)
  // ---------------------------------------------------------------------------
  const isTestUser = studentId === '67cfe3a9a50dbb995b4d94da';

  // Responsive modal classes
  const modalContainerClass =
    'fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm';
  const modalContentClass =
    'relative w-full max-w-3xl mx-auto bg-white/80 dark:bg-gray-900/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[80vh] max-h-[95vh]';

  // Sticky search bar
  const searchBarClass =
    'sticky top-0 z-20 bg-white/80 dark:bg-gray-900/90 backdrop-blur-lg px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800';

  // Category grid
  const gridClass =
    'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 pb-6 overflow-y-auto flex-1';

  // Sticky footer
  const footerClass =
    'sticky bottom-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4';

  if (!isOpen) return null;
  if (postLoading) return <Preloader />;

  const modalContent = (
    <div className={modalContainerClass} onClick={onClose}>
      <div className={modalContentClass} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 pt-8 pb-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-primary-50/80 to-amber-50/80 dark:from-primary-900/40 dark:to-amber-900/40">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Step 1 of 2: Choose Categories</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <p className="text-base text-gray-600 dark:text-gray-300 mb-2">Select your learning categories for your <span className="font-semibold text-primary-600 dark:text-primary-400">{planType.charAt(0).toUpperCase() + planType.slice(1)}</span> membership.</p>
        </div>

        {/* Sticky Search Bar */}
        <div className={searchBarClass}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:outline-none text-base text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm"
              aria-label="Search categories"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Category Grid */}
        <div className={gridClass}>
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-4" />
              <span className="text-lg text-gray-600 dark:text-gray-300">Loading categories...</span>
            </div>
          ) : error ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
              <span className="text-lg text-red-600 dark:text-red-400">{error}</span>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <BookOpen className="w-10 h-10 text-gray-400 mb-4" />
              <span className="text-lg text-gray-600 dark:text-gray-300">No categories found.</span>
            </div>
          ) : (
            filteredCategories.map(category => {
              const isSelected = selectedCategories.some(c => c._id === category._id);
              const disabled = !isSelected && selectedCategories.length >= maxSelections;
              return (
                <button
                  key={category._id}
                  onClick={() => toggleCategorySelection(category)}
                  disabled={disabled}
                  className={`relative flex flex-col items-center p-5 rounded-2xl shadow-lg transition-all duration-300 border-2 bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-primary-500 group ${
                    isSelected
                      ? 'border-primary-500 ring-2 ring-primary-400'
                      : disabled
                      ? 'border-gray-200 dark:border-gray-700 opacity-40 grayscale cursor-not-allowed'
                      : 'border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                  }`}
                  aria-pressed={isSelected}
                  aria-label={disabled ? `Maximum of ${maxSelections} categories can be selected` : undefined}
                >
                  {/* Blended Badge */}
                  <span className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black dark:text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3 mr-1" /> Blended
                  </span>
                  {/* Checkmark overlay */}
                  {isSelected && (
                    <span className="absolute top-4 right-4 bg-primary-500 text-white rounded-full p-2 shadow-lg">
                      <CheckCircle className="w-5 h-5" />
                    </span>
                  )}
                  {/* Category Image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-primary-100 via-primary-50 to-amber-50 dark:from-primary-900/40 dark:via-primary-800/30 dark:to-amber-900/20 flex items-center justify-center">
                    <Image
                      src={category.category_image || '/fallback-category-image.jpg'}
                      alt={category.category_name}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  {/* Category Name */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-1 line-clamp-2">{category.category_name}</h3>
                  {/* Course Count */}
                  <span className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-2">{category.courseCount} Courses</span>
                  {/* Features as chips */}
                  <div className="flex flex-wrap gap-2 justify-center mb-2">
                    <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">Pre-recorded</span>
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">Live Doubts</span>
                    <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">Self-paced</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
        {selectedCategories.length >= maxSelections && (
  <div className="mt-2 text-sm text-amber-600 dark:text-amber-400 text-center font-medium">
    {`You can select up to ${maxSelections} categor${maxSelections > 1 ? 'ies' : 'y'} for this membership.`}
  </div>
)}

        {/* Sticky Footer */}
        <div className={footerClass}>
          <div className="flex flex-wrap gap-2 items-center">
            {selectedCategories.length > 0 ? (
              selectedCategories.map(category => (
                <span key={category._id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium border border-primary-200 dark:border-primary-800">
                  {category.category_name}
                  <button onClick={() => toggleCategorySelection(category)} className="ml-1 p-1 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-500 dark:text-gray-400 text-sm">No categories selected</span>
            )}
          </div>
            <button
              onClick={handleProceedToPay}
              disabled={selectedCategories.length === 0 || isProcessing}
              className={`ml-4 px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 flex items-center gap-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                selectedCategories.length === 0 || isProcessing
                  ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500'
                  : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white'
              }`}
              aria-disabled={selectedCategories.length === 0 || isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Pay {amount}</span>
                  <CheckCircle className="w-5 h-5" />
                </>
              )}
            </button>
        </div>
      </div>
    </div>
  );

  if (typeof window !== "undefined") {
    const modalRoot = document.getElementById("modal-root");
    if (modalRoot) {
      return createPortal(modalContent, modalRoot);
    }
  }
  return null;
} 