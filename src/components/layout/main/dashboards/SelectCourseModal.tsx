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
          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg"
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

  const maxSelections = planType === "silver" ? 1 : 3;

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
      
      if (planType === "silver") {
        return [category]; // Silver plan allows only 1 category
      } else {
        if (prev.length < maxSelections) {
          return [...prev, category];
        }
        return prev; // Don't add if max reached
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

  if (!isOpen) return null;

  if (postLoading) return <Preloader />;

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
        onClick={onClose}
      >
        {/* CSS Variables for modal height calculations */}
        <style jsx>{`
          .modal-container {
            height: 100vh;
            height: 100dvh; /* Dynamic viewport height for mobile browsers */
          }
          
          .modal-content {
            height: 100vh;
            height: 100dvh; /* Full viewport height */
          }
        `}</style>
        
        <motion.div
          variants={modalVariants}
          className="modal-container w-full bg-white dark:bg-gray-900 overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
                    <div className="modal-content flex flex-col">
            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 sm:pt-20 sm:pb-10">
                {/* Close Button - Positioned at top right */}
                <div className="absolute top-16 right-6 z-10 sm:top-20">
                  <button
                    onClick={onClose}
                    className="p-3 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-colors backdrop-blur-sm shadow-lg"
                  >
                    <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Header Content */}
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Select {planType === "silver" ? "a Category" : `up to ${maxSelections} Categories`}
              </h2>
                      <p className="text-base text-gray-600 dark:text-gray-400">
                        Choose from our blended course categories for your {capitalize(planType)} membership
                      </p>
            </div>

                    {/* Pricing Display */}
                    <div className="mt-4 sm:mt-0 sm:ml-6">
                      <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl p-4 border border-primary-200 dark:border-primary-800">
                        <div className="text-center">
                          <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-1">
                            {capitalize(planType)} Plan
                          </p>
                          <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                            {amount}
                          </p>
                          <p className="text-xs text-primary-600 dark:text-primary-400 opacity-75">
                            {selectedPlan.toLowerCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info Banner - Enhanced */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative overflow-hidden p-6 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/20 dark:via-yellow-900/20 dark:to-orange-900/20 rounded-3xl border-2 border-amber-200/50 dark:border-amber-700/50 mb-8"
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-transparent dark:from-amber-900/30" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-200/30 to-transparent rounded-full -translate-y-16 translate-x-16" />
                    
                    <div className="relative flex items-center gap-5">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-1">
                          🌟 Blended Learning Experience
                        </h4>
                        <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
                          All categories include <span className="font-semibold">pre-recorded videos</span> with <span className="font-semibold">live interactive doubt clearing sessions</span> for the perfect learning blend
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Search Bar - Enhanced */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative"
                  >
                    <div className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <Search className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>
              <input
                type="text"
                      placeholder="Search for your perfect learning category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-16 pr-6 py-5 text-base bg-white dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-3xl focus:ring-4 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all duration-300 shadow-xl hover:shadow-2xl backdrop-blur-sm font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    
                    {/* Search Enhancement */}
                    {searchQuery && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={() => setSearchQuery("")}
                        className="absolute right-5 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </motion.button>
                    )}
                  </motion.div>

                  {isTestUser && (
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-3 rounded-lg mb-6 shadow-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span className="text-sm font-semibold">🧪 TEST MODE ACTIVE</span>
                      </div>
                      <p className="text-xs mt-1 opacity-90">
                        You are using test Razorpay credentials. Use test cards for payment (e.g. 4111 1111 1111 1111, CVV 123, any future expiry).
                      </p>
                    </div>
                  )}
                </div>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="flex items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
                    <span className="text-xl font-medium text-gray-600 dark:text-gray-400">
                      Loading categories...
                    </span>
            </div>
              </div>
            ) : error ? (
                <div className="flex items-center justify-center gap-4 text-red-500 py-16">
                  <AlertCircle className="w-8 h-8" />
                  <p className="text-lg">{error}</p>
              </div>
            ) : (
                <div className="space-y-8">
                  {/* Results Summary - Enhanced */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative overflow-hidden bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-3xl p-8 shadow-xl border-2 border-gray-100 dark:border-gray-600"
                  >
                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary-100/30 to-transparent rounded-full -translate-y-20 translate-x-20" />
                    
                    <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                          <Grid className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {filteredCategories.length} categor{filteredCategories.length !== 1 ? 'ies' : 'y'}
                          </p>
                          <p className="text-base text-gray-600 dark:text-gray-400 font-medium">
                            Ready for your learning journey
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-center sm:text-right">
                        <div className="flex items-center justify-center sm:justify-end gap-3 mb-2">
                          <div className="flex -space-x-2">
                            {Array.from({ length: maxSelections }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold ${
                                  i < selectedCategories.length
                                    ? "bg-primary-500 text-white"
                                    : "bg-gray-200 dark:bg-gray-600 text-gray-400"
                                }`}
                              >
                                {i < selectedCategories.length ? "✓" : i + 1}
                              </div>
                            ))}
                          </div>
                          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                            {selectedCategories.length}/{maxSelections}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {planType === "silver" ? "Select 1 category" : "Select up to 3 categories"}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Categories Grid */}
                  {filteredCategories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {filteredCategories.map((category) => (
                        <CategoryCard
                          key={category._id}
                      category={category}
                      isSelected={selectedCategories.some((c) => c._id === category._id)}
                      onClick={() => toggleCategorySelection(category)}
                          disabled={
                            !selectedCategories.some((c) => c._id === category._id) && 
                            selectedCategories.length >= maxSelections
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-24">
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 mb-8">
                        <BookOpen className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-4">
                        No categories found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto text-lg">
                        {searchQuery ? "Try adjusting your search terms to find the categories you're looking for." : "No blended course categories are currently available. Please check back later."}
                      </p>
                    </div>
                  )}
              </div>
            )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6 sm:pt-8 sm:pb-8">
            <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  {selectedCategories.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-lg font-medium text-gray-900 dark:text-white">Selected Categories:</p>
                      <div className="flex flex-wrap gap-3">
                        {selectedCategories.map((category) => (
                          <motion.span
                            key={category._id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="inline-flex items-center gap-3 px-4 py-2.5 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-xl text-base font-medium border border-primary-200 dark:border-primary-800"
                          >
                            {category.category_name}
                            <span className="text-sm opacity-75 bg-primary-200 dark:bg-primary-800 px-2 py-1 rounded-lg">
                              {category.courseCount} courses
                            </span>
                            <button
                              onClick={() => toggleCategorySelection(category)}
                              className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-1 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
                <div className="flex gap-4 ml-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                    className="px-8 py-4 text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-colors font-medium border border-gray-200 dark:border-gray-600"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleProceedToPay}
                  disabled={selectedCategories.length === 0 || isProcessing}
                    className={`px-10 py-4 rounded-2xl transition-all flex items-center gap-3 text-base font-semibold ${
                    selectedCategories.length === 0 || isProcessing
                        ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500"
                        : "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  {isProcessing ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                        <span>Pay {amount}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm opacity-90">•</span>
                          <span className="text-sm opacity-90">{capitalize(planType)}</span>
                        </div>
                        <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
                </div>
              </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 