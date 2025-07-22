"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, AlertCircle, Loader2, CheckCircle, Filter, BookOpen, Clock, Users, Star, Grid, List, ChevronDown, ChevronUp, Play, Award, Calendar } from "lucide-react";
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
import { createMembershipEnrollment } from "@/apis/membership/membership";

interface SelectCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: string;
  amount: string;
  selectedPlan: string;
  closeParent: () => void;
  preloadData?: boolean; // Optional prop to control preloading
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
  isExpanded?: boolean;
}

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
  onToggleExpand: () => void;
}

interface CourseCardProps {
  course: Course;
  categoryName: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, categoryName }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      {/* Course Title Only */}
      <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
        {course.course_title}
      </h4>
    </div>
  );
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category, isSelected, onClick, disabled, onToggleExpand }) => {
  const fallbackImage = "/fallback-category-image.jpg";
  
  return (
    <div className={`group relative bg-white dark:bg-gray-800 rounded-2xl border transition-all duration-300 cursor-pointer aspect-[3/4] ${
      isSelected
        ? "border-blue-500 shadow-lg shadow-blue-500/10 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800"
        : disabled
        ? "border-gray-100 dark:border-gray-700 opacity-60"
        : "border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-md hover:-translate-y-1"
    }`}>
      <div className="p-4 h-full flex flex-col">
        {/* Category Image */}
        <div className="relative w-full flex-1 mb-3 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
          <Image
            src={category.category_image || fallbackImage}
            alt={category.category_name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            width={200}
            height={200}
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
          
          {/* Selection Indicator */}
          {isSelected && (
            <div className="absolute top-2 right-2 animate-in fade-in zoom-in duration-200">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
          
          {/* Course Count Badge */}
          <div className="absolute bottom-2 left-2">
            <div className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full">
              <span className="text-xs font-medium text-white">
                {category.courseCount} courses
              </span>
            </div>
          </div>
        </div>

        {/* Category Content */}
        <div className="flex flex-col justify-between flex-shrink-0 space-y-3">
          <div className="min-h-0 text-center">
            <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight tracking-tight">
              {category.category_name}
            </h3>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Select Button */}
            <button
              onClick={!disabled ? onClick : undefined}
              disabled={disabled}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all duration-200 ${
                isSelected 
                  ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25" 
                  : disabled
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:shadow-sm"
              }`}
            >
              {isSelected ? "Selected" : "Select"}
            </button>
            
            {/* Expand Button */}
            <button
              onClick={onToggleExpand}
              className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 flex items-center justify-center group flex-shrink-0"
              title={category.isExpanded ? "Hide courses" : "Show courses"}
            >
              {category.isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
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
  preloadData = true,
}: SelectCourseModalProps) {
  const studentId = localStorage.getItem("userId");
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [enhancedCategories, setEnhancedCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [coursesLoading, setCoursesLoading] = useState<boolean>(true);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [dataInitialized, setDataInitialized] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
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

  // Debug logging
  console.log('SelectCourseModal - planType:', planType, 'normalizedPlanType:', normalizedPlanType, 'maxSelections:', maxSelections);

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

  // Initialize component state
  useEffect(() => {
    // Set initial loading state to false so modal can open immediately
    setLoading(false);
    setCategoriesLoading(false);
    setCoursesLoading(false);
  }, []);

  // Update loading state based on individual loading states
  useEffect(() => {
    setLoading(coursesLoading || categoriesLoading);
  }, [coursesLoading, categoriesLoading]);

  // Handle modal opening and data fetching
  useEffect(() => {
    if (isOpen && !dataInitialized) {
      console.log("Modal opened, fetching data...");
      
      const fetchData = async () => {
        setError(null);
        setCategoriesLoading(true);
        setCoursesLoading(true);

        try {
          // Fetch categories
          const categoriesResult = await getQuery({
            url: apiUrls?.categories?.getAllCategories,
          });
          const categoriesData = categoriesResult?.data || [];
          console.log("Categories fetched:", categoriesData.length);
          setCategories(categoriesData);
          setCategoriesLoading(false);

          // Fetch courses
          const coursesResult = await getQuery({
            url: getAllCoursesWithLimits({
              page: 1,
              limit: 200,
              status: "Published",
              class_type: "Blended Courses",
              sort_by: "course_title",
              sort_order: "asc"
            }),
          });
          
          const coursesData = coursesResult?.data?.courses || coursesResult?.courses || coursesResult || [];
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
          
          console.log("Courses fetched:", sanitizedCourses.length);
          setCourses(sanitizedCourses);
          setCoursesLoading(false);
          setDataInitialized(true);
          
          console.log("Data fetch completed successfully");
          
        } catch (err) {
          console.error("Data fetch failed:", err);
          setError(err instanceof Error ? err.message : "Failed to load data. Please try again later.");
          setCategoriesLoading(false);
          setCoursesLoading(false);
        }
      };
      
      fetchData();
    }
  }, [isOpen, dataInitialized, getQuery]);

  // Reset selected categories when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedCategories([]);
      setSearchQuery('');
      setShowPreview(false);
    }
  }, [isOpen]);

  // Enhanced categories with course counts - compute when data is ready
  useEffect(() => {
    // Don't compute if data isn't ready
    if (!dataInitialized || categories.length === 0 || courses.length === 0) {
      setEnhancedCategories([]);
      return;
    }

    console.log("Computing enhanced categories with", categories.length, "categories and", courses.length, "courses");
    
    const enhanced = categories.map(category => {
      const categoryName = category.category_name;
      const categoryBlendedCourses = courses.filter(course => {
        const courseCategory = course.course_category || course.category || '';
        const classType = course.class_type || '';
        const categoryMatch = courseCategory.toLowerCase() === categoryName.toLowerCase();
        const typeMatch = classType.toLowerCase().includes('blended');
        
        // Debug logging for first few courses
        if (courses.indexOf(course) < 3) {
          console.log(`Course "${course.course_title}": category="${courseCategory}" (match: ${categoryMatch}), type="${classType}" (match: ${typeMatch})`);
        }
        
        // For now, let's be more lenient with class_type matching
        // return categoryMatch && typeMatch;
        return categoryMatch; // Show all courses in the category for now
      });
      
      console.log(`Category "${categoryName}" has ${categoryBlendedCourses.length} blended courses`);
      console.log(`Sample courses for ${categoryName}:`, categoryBlendedCourses.slice(0, 2).map(c => ({ title: c.course_title, category: c.course_category, classType: c.class_type })));
      
      return {
        ...category,
        courseCount: categoryBlendedCourses.length,
        courses: categoryBlendedCourses,
        isExpanded: false
      };
    }).filter(category => category.courseCount > 0); // Only show categories with blended courses
    
    console.log("Enhanced categories result:", enhanced.length);
    setEnhancedCategories(enhanced);
  }, [categories, courses, dataInitialized]);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return enhancedCategories;
    
    const query = searchQuery.toLowerCase();
    return enhancedCategories.filter(category =>
      category.category_name.toLowerCase().includes(query) ||
      category.courses?.some(course => 
        course.course_title.toLowerCase().includes(query)
      )
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

  const toggleCategoryExpansion = (categoryId: string) => {
    setEnhancedCategories(prev => 
      prev.map(cat => 
        cat._id === categoryId 
          ? { ...cat, isExpanded: !cat.isExpanded }
          : cat
      )
    );
  };

  const handleShowPreview = () => {
    if (!selectedCategories.length) {
      showToast.error("Please select at least one category");
      return;
    }
    setShowPreview(true);
  };

  const handleBackToSelection = () => {
    setShowPreview(false);
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
          membership_type: "blended_courses",
          ...(isTestUser && { test_mode: 'true' })
        }
      };

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
      // Calculate duration months based on plan
      const getDurationMonths = (plan: string): number => {
        const planLower = plan.toLowerCase();
        switch (planLower) {
          case 'monthly': return 1;
          case 'quarterly': return 3;
          case 'half_yearly': return 6;
          case 'yearly': 
          case 'annually': return 12;
          default: return 1;
        }
      };

      // Use the new membership API
      const membershipResponse = await createMembershipEnrollment({
        membership_type: planType.toLowerCase() as 'silver' | 'gold',
        duration_months: getDurationMonths(selectedPlan),
        billing_cycle: selectedPlan.toLowerCase() === 'yearly' ? 'annually' : selectedPlan.toLowerCase() as 'monthly' | 'quarterly' | 'half_yearly',
        selected_categories: selectedCategories.map((category) => category._id),
        payment_info: {
          amount: planAmount,
          currency: 'INR',
          payment_method: 'credit_card' // Razorpay supports multiple payment methods
        }
      });

      if (!membershipResponse.data) {
        throw new Error("Failed to create membership");
      }

      const membershipData = membershipResponse?.data;
      const membershipId = membershipData?.enrollment?._id;
      const expiryDate = membershipData?.enrollment?.expiry_date;

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

      // Process all enrollments in parallel using the correct API endpoint
      await Promise.all(
        enrolledCourses.map(async (courseId) => {
          try {
            // Create enrollment for each course
            await postQuery({
              url: apiUrls?.enrolledCourses?.createEnrollment,
              postData: {
                student_id: studentId,
                course_id: courseId,
                membership_id: membershipId,
                expiry_date: expiryDate,
                is_self_paced: true,
                enrollment_type: 'membership',
                amount: 0, // No additional cost for membership courses
                status: "active",
              },
            });
          } catch (enrollmentError) {
            console.error(`Failed to enroll in course ${courseId}:`, enrollmentError);
            // Continue with other enrollments even if one fails
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

  // Full screen modal classes
  const modalContainerClass =
    'fixed inset-0 z-[9999] bg-white dark:bg-gray-900';
  const modalContentClass =
    'relative w-full h-full flex flex-col';

  // Search bar
  const searchBarClass =
    'border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4';

  // Category grid
  const gridClass =
    'grid grid-cols-3 gap-4 px-4 sm:px-6 py-4 overflow-y-auto flex-1';

  // Footer
  const footerClass =
    'border-t border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4';

  if (!isOpen) return null;
  if (postLoading) return <Preloader />;

  // Calculate plan duration for display
  const getPlanDuration = (plan: string): string => {
    const planLower = plan.toLowerCase();
    switch (planLower) {
      case 'monthly': return '1 Month';
      case 'quarterly': return '3 Months';
      case 'half_yearly': return '6 Months';
      case 'yearly': 
      case 'annually': return '12 Months';
      default: return plan;
    }
  };

  // Collapsible state for categories in preview
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const togglePreviewCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Preview content
  const previewContent = (
    <div className={modalContainerClass}>
      <div className={modalContentClass}>
        {/* Header */}
        <div className="px-6 lg:px-8 py-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={handleBackToSelection} className="p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
                <ChevronDown className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rotate-90" />
              </button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">Review Your Order</h1>
                <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400 mt-1">
                  Confirm your membership selection before checkout
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50/30 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 lg:py-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Main Content - Order Details */}
              <div className="xl:col-span-2 space-y-6 lg:space-y-8">
                
                {/* Membership Plan */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="px-4 lg:px-6 py-4 lg:py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Membership Plan</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your selected plan details</p>
                  </div>
                  <div className="p-4 lg:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{planType.charAt(0).toUpperCase() + planType.slice(1).toLowerCase()}</div>
                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Plan Type</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">{getPlanDuration(selectedPlan)}</div>
                        <div className="text-sm font-medium text-green-600 dark:text-green-400">Duration</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                          {selectedCategories.reduce((sum, cat) => sum + (cat.courseCount || 0), 0)}
                        </div>
                        <div className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Courses</div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Course Categories */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="px-4 lg:px-6 py-4 lg:py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Course Categories</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {selectedCategories.length} categories with full access to all courses
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                        {selectedCategories.length}/{maxSelections} selected
                      </span>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {selectedCategories.map((category, index) => {
                      const isExpanded = expandedCategories.has(category._id);
                      return (
                        <div key={category._id} className="group">
                          {/* Category Header */}
                                                                               <button
                            onClick={() => togglePreviewCategoryExpansion(category._id)}
                            className="w-full px-4 lg:px-6 py-4 lg:py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                                <span className="text-sm font-bold text-white">{index + 1}</span>
                              </div>
                              <div className="text-left">
                                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {category.category_name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {category.courseCount} courses • Full lifetime access
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {category.category_image && (
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-sm">
                                  <Image
                                    src={category.category_image}
                                    alt={category.category_name}
                                    className="w-full h-full object-cover"
                                    width={48}
                                    height={48}
                                  />
                                </div>
                              )}
                              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                              }`} />
                            </div>
                          </button>
                          
                          {/* Collapsible Course List */}
                          {isExpanded && (
                            <div className="px-4 lg:px-6 pb-4 lg:pb-6 bg-gray-50/30 dark:bg-gray-800/30">
                              <div className="pl-8 lg:pl-14 space-y-3">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                  Included Courses ({category.courseCount})
                                </h4>
                                <div className="grid grid-cols-1 gap-2">
                                  {category.courses?.map((course, courseIndex) => (
                                    <div key={course._id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                                      <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                          {courseIndex + 1}
                                        </span>
                                      </div>
                                      <div className="flex-1">
                                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                                          {course.course_title}
                                        </h5>
                                        {course.course_duration && (
                                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            Duration: {course.course_duration}
                                          </p>
                                        )}
                                      </div>
                                      <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                                        Included
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>

              {/* Sidebar - Order Summary */}
              <div className="xl:col-span-1">
                <div className="sticky top-6 lg:top-8 space-y-4 lg:space-y-6">
                  
                  {/* Price Summary */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="px-4 lg:px-6 py-4 lg:py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Summary</h3>
                    </div>
                    <div className="p-4 lg:p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{planType.charAt(0).toUpperCase() + planType.slice(1).toLowerCase()} Plan</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{amount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{getPlanDuration(selectedPlan)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Categories</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedCategories.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Courses</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedCategories.reduce((sum, cat) => sum + (cat.courseCount || 0), 0)}
                        </span>
                      </div>
                      <hr className="border-gray-200 dark:border-gray-700" />
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-gray-900 dark:text-white">Total</span>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">{amount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-4 lg:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">What's Included</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Lifetime access to all courses</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Download certificates</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Mobile & desktop access</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">24/7 support</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 lg:px-8 py-4 lg:py-6 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handleBackToSelection}
              className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 order-2 sm:order-1"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
              <span className="font-medium">Back to Selection</span>
            </button>
            
            <button
              onClick={handleProceedToPay}
              disabled={isProcessing}
              className={`flex items-center justify-center gap-3 px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-semibold text-sm lg:text-base transition-all duration-200 order-1 sm:order-2 w-full sm:w-auto ${
                isProcessing
                  ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed text-gray-400'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Complete Purchase</span>
                  <span className="px-3 py-1 bg-white/20 rounded-lg font-bold">{amount}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const modalContent = (
    <div className={modalContainerClass}>
      <div className={modalContentClass}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
              <div>
                <h2 className="text-xl font-medium text-gray-900 dark:text-white tracking-tight">Choose Categories</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Select up to {maxSelections} categor{maxSelections > 1 ? 'ies' : 'y'} for your {planType} plan
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedCategories.length}/{maxSelections}
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-white dark:bg-gray-800 border-0 shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:shadow-md text-sm placeholder-gray-400 transition-all duration-200"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

                {/* Category Grid */}
        <div className="grid grid-cols-7 gap-4 px-6 py-6 overflow-y-auto flex-1 bg-white dark:bg-gray-900">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500 mb-2" />
              <span className="text-xs text-gray-600 dark:text-gray-300">Loading...</span>
            </div>
          ) : error ? (
            <div className="col-span-full flex flex-col items-center justify-center py-8">
              <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
              <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
              <button 
                onClick={() => window.location.reload()}
                className="mt-1 px-2 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-8">
              <BookOpen className="w-6 h-6 text-gray-400 mb-2" />
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {searchQuery ? 'No categories found' : 'No categories available'}
              </span>
            </div>
          ) : (
            filteredCategories.map(category => {
              const isSelected = selectedCategories.some(c => c._id === category._id);
              const disabled = !isSelected && selectedCategories.length >= maxSelections;
              return (
                <div key={category._id} className="space-y-2">
                  <CategoryCard
                    category={category}
                    isSelected={isSelected}
                    onClick={() => toggleCategorySelection(category)}
                    disabled={disabled}
                    onToggleExpand={() => toggleCategoryExpansion(category._id)}
                  />
                  
                  {/* Courses List */}
                  {category.isExpanded && category.courses && category.courses.length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                      <div className="space-y-2">
                        {category.courses.map(course => (
                          <div key={course._id} className="group bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-sm transition-all duration-200">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {course.course_title}
                            </h4>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

                         {/* Footer */}
        <div className="border-t border-gray-100 dark:border-gray-800 px-6 py-4 bg-white dark:bg-gray-900">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Selected Categories */}
            <div className="flex-1">
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Categories</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.length > 0 ? (
                  selectedCategories.map(category => (
                    <span key={category._id} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-medium group">
                      <span>{category.category_name}</span>
                      <button 
                        onClick={() => toggleCategorySelection(category)} 
                        className="hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400 italic">No categories selected yet</span>
                )}
              </div>
            </div>
            
            {/* Action Section */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {selectedCategories.reduce((sum, cat) => sum + (cat.courseCount || 0), 0)} courses
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Total access
                </div>
              </div>
              <button
                onClick={handleShowPreview}
                disabled={selectedCategories.length === 0}
                className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  selectedCategories.length === 0
                    ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed text-gray-400'
                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                }`}
              >
                <span className="flex items-center gap-2">
                  Review Selection
                  <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof window !== "undefined") {
    const modalRoot = document.getElementById("modal-root");
    if (modalRoot) {
      return createPortal(showPreview ? previewContent : modalContent, modalRoot);
    }
  }
  return null;
} 