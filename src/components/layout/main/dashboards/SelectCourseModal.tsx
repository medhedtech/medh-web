"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, AlertCircle, Loader2, CheckCircle, Filter, BookOpen, Clock, Users, Star, Grid, List, ChevronDown, ChevronUp, Play, Award, Calendar } from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { courseTypesAPI, ICourseQueryParams } from "@/apis/courses";
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
  const fallbackImage = "/fallback-course-image.jpg";
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      {/* Course Image */}
      <div className="relative w-full h-24 mb-3 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
        <Image
          src={course.course_image || fallbackImage}
          alt={course.course_title}
          className="w-full h-full object-cover"
          width={200}
          height={96}
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
      </div>
      
      {/* Course Content */}
      <div className="space-y-2">
        {/* Course Title */}
        <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
          {course.course_title}
        </h4>
        
        {/* Course Meta Info */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          {course.no_of_Sessions && (
            <span>{course.no_of_Sessions} sessions</span>
          )}
          {course.course_duration && (
            <span>{course.course_duration}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category, isSelected, onClick, disabled, onToggleExpand }) => {
  const fallbackImage = "/fallback-category-image.jpg";
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border-2 transition-all ${
      isSelected
        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
        : disabled
        ? "border-gray-200 dark:border-gray-700 opacity-50"
        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
    }`}>
      <div className="p-4">
        {/* Category Image */}
        <div className="relative w-full h-32 mb-4 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            src={category.category_image || fallbackImage}
            alt={category.category_name}
            className="w-full h-full object-cover"
            width={200}
            height={128}
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
          
          {/* Selection Indicator */}
          {isSelected && (
            <div className="absolute top-2 right-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Category Content */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {category.category_name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {category.courseCount} courses
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Select Button */}
            <button
              onClick={!disabled ? onClick : undefined}
              disabled={disabled}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                isSelected 
                  ? "bg-blue-500 text-white" 
                  : disabled
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {isSelected ? "Selected" : "Select"}
            </button>
            
            {/* Expand Button */}
            <button
              onClick={onToggleExpand}
              className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
              title={category.isExpanded ? "Hide courses" : "Show courses"}
            >
              {category.isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
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

  // Initialize data loading state
  useEffect(() => {
    setLoading(coursesLoading || categoriesLoading);
  }, [coursesLoading, categoriesLoading]);

  // Preload data with caching
  useEffect(() => {
    const fetchData = async () => {
      // Skip if preloading is disabled
      if (!preloadData) {
        console.log("Data preloading disabled");
        return;
      }

      // Check if data is already cached and valid
      const cachedCategories = sessionStorage.getItem('medh_course_categories');
      const cachedCourses = sessionStorage.getItem('medh_blended_courses');
      const cacheTimestamp = sessionStorage.getItem('medh_data_cache_timestamp');
      
      // Cache duration: 5 minutes
      const CACHE_DURATION = 5 * 60 * 1000;
      const isCacheValid = cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < CACHE_DURATION;
      
      if (cachedCategories && cachedCourses && isCacheValid) {
        console.log("Loading data from cache");
        try {
          const categoriesData = JSON.parse(cachedCategories);
          const coursesData = JSON.parse(cachedCourses);
          
          setCategories(categoriesData);
          setCourses(coursesData);
          setCategoriesLoading(false);
          setCoursesLoading(false);
          setDataInitialized(true);
          console.log("Data loaded from cache successfully");
          return;
        } catch (err) {
          console.warn("Failed to parse cached data, fetching fresh data");
          // Clear invalid cache
          sessionStorage.removeItem('medh_course_categories');
          sessionStorage.removeItem('medh_blended_courses');
          sessionStorage.removeItem('medh_data_cache_timestamp');
        }
      }

      // Only fetch if we haven't loaded data yet or cache is invalid
      if ((categories.length > 0 && courses.length > 0 && dataInitialized) && isCacheValid) {
        console.log("Data already loaded and cache is valid, skipping fetch");
        return;
      }
      
      // Reset states
      setError(null);
      setDataInitialized(false);
      setCategoriesLoading(true);
      setCoursesLoading(true);

      try {
        console.log("Starting fresh data fetch...");
        
        // Fetch categories
        const categoriesPromise = getQuery({
          url: apiUrls?.categories?.getAllCategories,
          onSuccess: (res) => {
            const categoriesData = res?.data || [];
            console.log("Categories fetched:", categoriesData.length);
            setCategories(categoriesData);
            setCategoriesLoading(false);
            
            // Cache the data
            sessionStorage.setItem('medh_course_categories', JSON.stringify(categoriesData));
          },
          onFail: (err) => {
            console.error("Error fetching categories:", err);
            setCategoriesLoading(false);
            throw new Error("Failed to load categories");
          },
        });

        // Fetch courses using the courses by category API
        const coursesPromise = courseTypesAPI.getCoursesByCategory({
          page: 1,
          limit: 200,
          status: "Published",
          sort_by: "course_title",
          sort_order: "asc"
        }).then((response) => {
          const coursesByCategory = response?.data?.data?.coursesByCategory || {};
          console.log("Raw courses by category fetched:", Object.keys(coursesByCategory).length, "categories");
          
          // Flatten all courses from all categories
          const allCourses: any[] = [];
          Object.values(coursesByCategory).forEach((categoryCourses: any) => {
            if (Array.isArray(categoryCourses)) {
              allCourses.push(...categoryCourses);
            }
          });
          
          console.log("Total courses across all categories:", allCourses.length);
            
          // Ensure we sanitize the course data to only include primitive values
          const sanitizedCourses = allCourses.map((course: any) => ({
            _id: course._id || '',
            course_title: course.course_title || '',
            course_category: course.course_category || course.category || '',
            category: course.category || course.course_category || '',
            course_description: typeof course.course_description === 'string' 
              ? course.course_description 
              : course.course_description?.program_overview || '',
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
          }));
          
          console.log("Sanitized courses fetched:", sanitizedCourses.length);
          setCourses(sanitizedCourses);
          setCoursesLoading(false);
          
          // Cache the data
          sessionStorage.setItem('medh_blended_courses', JSON.stringify(sanitizedCourses));
        }).catch((err) => {
          console.error("Error fetching courses:", err);
          setCoursesLoading(false);
          throw new Error("Failed to load courses");
        });

        // Wait for both to complete
        await Promise.all([categoriesPromise, coursesPromise]);
        
        // Mark as initialized once both are done and update cache timestamp
        setDataInitialized(true);
        sessionStorage.setItem('medh_data_cache_timestamp', Date.now().toString());
        console.log("Fresh data fetch completed successfully");
        
      } catch (err) {
        console.error("Data fetch failed:", err);
        setError(err instanceof Error ? err.message : "Failed to load data. Please try again later.");
        setCategoriesLoading(false);
        setCoursesLoading(false);
      }
    };

    // Start fetching when component mounts or when preloadData changes
    fetchData();
  }, [getQuery, preloadData]);

  // Handle modal opening - either use preloaded data or fetch on demand
  useEffect(() => {
    if (isOpen) {
      if (dataInitialized) {
        console.log("Modal opened with preloaded data");
        setLoading(false);
      } else if (!preloadData) {
        // If preloading is disabled, fetch data when modal opens
        console.log("Modal opened without preloaded data, fetching now...");
        // Trigger the same fetch logic but only when modal opens
        const fetchDataOnDemand = async () => {
          setError(null);
          setDataInitialized(false);
          setCategoriesLoading(true);
          setCoursesLoading(true);

          try {
            await Promise.all([
              getQuery({
                url: apiUrls?.categories?.getAllCategories,
                onSuccess: (res) => {
                  const categoriesData = res?.data || [];
                  setCategories(categoriesData);
                  setCategoriesLoading(false);
                },
                onFail: (err) => {
                  console.error("Error fetching categories:", err);
                  setCategoriesLoading(false);
                  throw new Error("Failed to load categories");
                },
              }),
              courseTypesAPI.getCoursesByCategory({
                page: 1,
                limit: 200,
                status: "Published",
                sort_by: "course_title",
                sort_order: "asc"
              }).then((response) => {
                const coursesByCategory = response?.data?.data?.coursesByCategory || {};
                
                // Flatten all courses from all categories
                const allCourses: any[] = [];
                Object.values(coursesByCategory).forEach((categoryCourses: any) => {
                  if (Array.isArray(categoryCourses)) {
                    allCourses.push(...categoryCourses);
                  }
                });
                
                const sanitizedCourses = allCourses.map((course: any) => ({
                  _id: course._id || '',
                  course_title: course.course_title || '',
                  course_category: course.course_category || course.category || '',
                  category: course.category || course.course_category || '',
                  course_description: typeof course.course_description === 'string' 
                    ? course.course_description 
                    : course.course_description?.program_overview || '',
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
                }));
                setCourses(sanitizedCourses);
                setCoursesLoading(false);
              }).catch((err) => {
                console.error("Error fetching courses:", err);
                setCoursesLoading(false);
                throw new Error("Failed to load courses");
              })
            ]);
            
            setDataInitialized(true);
            console.log("On-demand data fetch completed");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load data. Please try again later.");
            setCategoriesLoading(false);
            setCoursesLoading(false);
          }
        };
        
        fetchDataOnDemand();
      }
    }
  }, [isOpen, dataInitialized, preloadData, getQuery]);

  // Reset selected categories when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedCategories([]);
      setSearchQuery('');
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

  // Responsive modal classes
  const modalContainerClass =
    'fixed inset-0 z-[9999] flex items-center justify-center bg-black/50';
  const modalContentClass =
    'relative w-full max-w-4xl mx-4 bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]';

  // Search bar
  const searchBarClass =
    'border-b border-gray-200 dark:border-gray-800 px-6 py-4';

  // Category grid
  const gridClass =
    'grid grid-cols-1 lg:grid-cols-2 gap-4 px-6 py-4 overflow-y-auto flex-1';

  // Footer
  const footerClass =
    'border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4';

  if (!isOpen) return null;
  if (postLoading) return <Preloader />;

  const modalContent = (
    <div className={modalContainerClass} onClick={onClose}>
      <div className={modalContentClass} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Select Categories</h2>
            <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Choose up to {maxSelections} categor{maxSelections > 1 ? 'ies' : 'y'} for your {planType} membership
          </p>
        </div>

        {/* Search Bar */}
        <div className={searchBarClass}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Category Grid */}
        <div className={gridClass}>
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Loading categories...</span>
            </div>
          ) : error ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
              <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <BookOpen className="w-8 h-8 text-gray-400 mb-4" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {searchQuery ? 'No categories found' : 'No categories available'}
              </span>
            </div>
          ) : (
            filteredCategories.map(category => {
              const isSelected = selectedCategories.some(c => c._id === category._id);
              const disabled = !isSelected && selectedCategories.length >= maxSelections;
              return (
                <div key={category._id} className="space-y-3">
                  <CategoryCard
                    category={category}
                    isSelected={isSelected}
                    onClick={() => toggleCategorySelection(category)}
                    disabled={disabled}
                    onToggleExpand={() => toggleCategoryExpansion(category._id)}
                  />
                  
                  {/* Courses Grid */}
                  {category.isExpanded && category.courses && category.courses.length > 0 && (
                    <div className="ml-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                        {category.courses.map(course => (
                          <CourseCard
                            key={course._id}
                            course={course}
                            categoryName={category.category_name}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {category.courses.length} course{category.courses.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className={footerClass}>
          <div className="flex flex-wrap gap-2 items-center">
            {selectedCategories.length > 0 ? (
              selectedCategories.map(category => (
                <span key={category._id} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm">
                  {category.category_name}
                  <button onClick={() => toggleCategorySelection(category)} className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">No categories selected</span>
            )}
          </div>
          <button
            onClick={handleProceedToPay}
            disabled={selectedCategories.length === 0 || isProcessing}
            className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${
              selectedCategories.length === 0 || isProcessing
                ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </span>
            ) : (
              `Pay ${amount}`
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