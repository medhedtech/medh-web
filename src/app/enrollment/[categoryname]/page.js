'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Clock, Calendar, Users, Award, CreditCard, Star, 
  BookOpen, ChevronDown, Calculator, BrainCircuit, TrendingUp, 
  UserCheck, Check, ArrowRight, Sparkles, ArrowLeft, MessageCircle,
  FileBadge, GraduationCap, Blocks, HelpCircle, FileText, RefreshCw
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

// Core components
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";

// API and utilities
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { 
  CATEGORY_MAP, 
  getCategoryInfo, 
  normalizeCategory,
  DURATION_OPTIONS,
  GRADE_OPTIONS,
  formatPrice,
  formatDuration,
  parseDuration,
  getDurationFilter,
  getGradeFilter,
  parseApiError
} from './categoryUtils';

// Import custom styles
import './styles.css';

// Import components
import CourseFaq from '@/components/sections/course-detailed/courseFaq';
import AboutProgram from '@/components/sections/course-detailed/aboutProgram';
import CourseCertificate from '@/components/sections/course-detailed/courseCertificate';
import CourseRelated from '@/components/sections/course-detailed/courseRelated';

// Animations
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { 
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 }
  }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const bounce = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.05, 1],
    transition: { 
      duration: 1.2, 
      repeat: Infinity, 
      repeatType: "reverse"
    }
  }
};

const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Icon map for category icons
const categoryIconMap = {
  'calculator': Calculator,
  'brain-circuit': BrainCircuit,
  'trending-up': TrendingUp,
  'user-check': UserCheck
};

// Array of sections for navigation
const SECTIONS = [
  { id: 'about', label: 'About Program', icon: GraduationCap },
  { id: 'curriculum', label: 'Curriculum', icon: Blocks },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'certificate', label: 'Certificate', icon: FileBadge }
];

// Custom hook for handling dynamic course content
function useDynamicCourseContent(selectedCourse, categoryInfo) {
  const [courseContent, setCourseContent] = useState({
    // Basic details always shown
    details: true,
    about: false,
    curriculum: false, 
    prerequisites: false,
    faqs: false,
    certificate: false
  });

  useEffect(() => {
    if (!selectedCourse) return;
    
    // Determine which sections should be visible based on data
    setCourseContent({
      details: true, // Always show
      about: true, // Always show some description
      curriculum: Array.isArray(selectedCourse.curriculum) && selectedCourse.curriculum.length > 0,
      prerequisites: Array.isArray(selectedCourse.prerequisites) && selectedCourse.prerequisites.length > 0,
      faqs: Array.isArray(selectedCourse.faqs) && selectedCourse.faqs.length > 0,
      certificate: !!selectedCourse.is_Certification
    });
    
    // Optional: Load additional data here if needed
    
  }, [selectedCourse, categoryInfo]);

  return courseContent;
}

function CategoryEnrollmentPage({ params }) {
  const { categoryname } = params;
  const normalizedCategory = useMemo(() => normalizeCategory(categoryname), [categoryname]);
  const categoryInfo = useMemo(() => getCategoryInfo(normalizedCategory), [normalizedCategory]);
  const router = useRouter();
  
  // Refs for section navigation
  const sectionRefs = {
    overview: useRef(null),
    about: useRef(null),
    curriculum: useRef(null),
    reviews: useRef(null),
    faq: useRef(null),
    certificate: useRef(null)
  };

  // State for active section
  const [activeSection, setActiveSection] = useState('overview');

  // Determine icon based on category
  const CategoryIcon = useMemo(() => {
    if (!normalizedCategory) return null;
    switch(normalizedCategory) {
      case 'vedic-mathematics': return Calculator;
      case 'ai-and-data-science': return BrainCircuit;
      case 'digital-marketing': return TrendingUp;
      case 'personality-development': return UserCheck;
      default: return null;
    }
  }, [normalizedCategory]);
  
  // State for courses and filters
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseLoading, setCourseLoading] = useState(false); // For individual course loading
  const [error, setError] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sectionLoadStates, setSectionLoadStates] = useState({
    overview: false,
    about: false,
    curriculum: false,
    reviews: false,
    faq: false,
    certificate: false
  });
  const { getQuery } = useGetQuery();

  // New state for recommendations
  const [recommendedCategories, setRecommendedCategories] = useState([]);
  
  // If category doesn't exist, redirect to main enrollment page
  useEffect(() => {
    if (!normalizedCategory) {
      router.push('/enrollment');
    }
  }, [normalizedCategory, router]);

  // Set document title based on category
  useEffect(() => {
    if (categoryInfo) {
      document.title = `${categoryInfo.displayName} Courses | MEDH Upskill`;
      
      // Set CSS variable for primary color
      if (categoryInfo.colorRgb) {
        document.documentElement.style.setProperty('--color-primary-rgb', categoryInfo.colorRgb);
      }
    }
    
    return () => {
      document.documentElement.style.removeProperty('--color-primary-rgb');
    };
  }, [categoryInfo]);

  // Generate recommended categories different from current category
  useEffect(() => {
    if (normalizedCategory) {
      // Create recommendations based on all categories except current
      const allCategories = [
        { id: 'vedic-mathematics', name: 'Vedic Mathematics', icon: 'calculator', color: 'amber' },
        { id: 'ai-and-data-science', name: 'AI & Data Science', icon: 'brain-circuit', color: 'blue' },
        { id: 'digital-marketing', name: 'Digital Marketing', icon: 'trending-up', color: 'emerald' },
        { id: 'personality-development', name: 'Personality Development', icon: 'user-check', color: 'violet' }
      ];
      
      // Filter out current category and limit to 3
      const recommended = allCategories
        .filter(cat => cat.id !== normalizedCategory)
        .slice(0, 3);
        
      setRecommendedCategories(recommended);
    }
  }, [normalizedCategory]);

  // Fetch courses on component mount
  useEffect(() => {
    if (!normalizedCategory) return;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        console.log("Fetching courses for category:", categoryInfo?.displayName || categoryname);
        
        // Get category display name from categoryInfo
        const categoryTitle = categoryInfo?.displayName || categoryname || "";
        
        // Use the direct API endpoint provided
        const apiEndpoint = `https://13.202.119.19.nip.io/api/v1/courses/search?page=1&limit=100&sort_by=createdAt&sort_order=desc&course_category=${encodeURIComponent(categoryTitle)}&status=Published`;
        console.log("Using API URL:", apiEndpoint);
        
        getQuery({
          url: apiEndpoint,
          onSuccess: (response) => {
            console.log(`${categoryTitle} courses:`, response);
            const courseData = response?.courses || [];
            console.log("Courses data:", courseData.length, "courses found");
            
            // Process course data to match expected structure with the new API format
            const processedCourseData = courseData.map(course => ({
              _id: course._id,
              title: course.course_title || "",
              description: course.course_description || `A course on ${categoryTitle}`,
              long_description: course.course_description || `Comprehensive ${categoryTitle} course designed to enhance your skills and knowledge in this field.`,
              category: course.course_category || categoryTitle,
              grade: course.course_grade || "",
              thumbnail: course.course_image || null,
              course_duration: formatDuration(course.course_duration) || "",
              course_duration_days: parseDuration(course.course_duration) || 30,
              course_fee: course.course_fee || 0,
              enrolled_students: course.enrolled_students || 0,
              is_Certification: course.is_Certification === "Yes" || false,
              is_Assignments: course.is_Assignments === "Yes" || false,
              is_Projects: course.is_Projects === "Yes" || false,
              is_Quizes: course.is_Quizes === "Yes" || false,
              curriculum: Array.isArray(course.curriculum) ? course.curriculum : [],
              highlights: [],
              learning_outcomes: [],
              prerequisites: [],
              faqs: [],
              no_of_Sessions: course.no_of_Sessions || 0,
              status: course.status || "Published",
              isFree: course.isFree || false,
              hasFullDetails: true
            }));
            
            setCourses(processedCourseData);
            setFilteredCourses(processedCourseData);
            setLoading(false);
            
            // Select the first course by default if available
            if (processedCourseData.length > 0) {
              setSelectedCourse(processedCourseData[0]);
              
              // Set section load states to true since we have data
              setSectionLoadStates({
                overview: true,
                about: true,
                curriculum: true,
                reviews: true,
                faq: true,
                certificate: !!processedCourseData[0].is_Certification
              });
            }
          },
          onError: (err) => {
            console.error("Error fetching courses:", err);
            console.error("Error details:", err?.response?.data || err?.message || "Unknown error");
            setError(parseApiError(err) || `Failed to load ${categoryTitle} courses`);
            setLoading(false);
          }
        });
      } catch (err) {
        console.error("Unexpected error in fetchCourses:", err);
        setError(parseApiError(err) || 'An unexpected error occurred');
        setLoading(false);
      }
    };

    fetchCourses();
  }, [getQuery, normalizedCategory, categoryInfo]);

  // Update the loadAdditionalCourseDetails to work with the new API format
  const loadAdditionalCourseDetails = useCallback((courseId) => {
    if (!courseId) return;
    
    // Since we're already getting full course details from the search API,
    // we may not need to make another API call. However, keeping this in case
    // we need to fetch additional details in the future.
    
    // Check if we already have full details for this course
    if (selectedCourse?.hasFullDetails) return;
    
    console.log("Loading additional details for course:", courseId);
    
    // Start loading
    setCourseLoading(true);
    
    // Use direct API endpoint for course details (adjust as needed)
    const courseDetailsEndpoint = `https://13.202.119.19.nip.io/api/v1/courses/${courseId}`;
    
    getQuery({
      url: courseDetailsEndpoint,
      onSuccess: (response) => {
        console.log("Additional course details:", response);
        
        // Get the course data from the response
        const courseData = response?.course || response?.data || response;
        
        if (!courseData || !courseData._id) {
          console.error("Invalid course data received");
          setCourseLoading(false);
          return;
        }
        
        // Process and normalize the data to match our app's format
        const processedData = {
          _id: courseData._id,
          title: courseData.course_title || "",
          description: courseData.course_description || "",
          category: courseData.course_category || categoryInfo?.displayName || '',
          grade: courseData.course_grade || "",
          thumbnail: courseData.course_image || null,
          course_duration: courseData.course_duration || "",
          course_duration_days: parseDuration(courseData.course_duration) || 30,
          course_fee: courseData.course_fee || 0,
          enrolled_students: courseData.enrolled_students || 0,
          is_Certification: courseData.is_Certification === "Yes" || false,
          is_Assignments: courseData.is_Assignments === "Yes" || false,
          is_Projects: courseData.is_Projects === "Yes" || false,
          is_Quizes: courseData.is_Quizes === "Yes" || false,
          curriculum: Array.isArray(courseData.curriculum) ? courseData.curriculum : [],
          hasFullDetails: true // Mark as having full details
        };
        
        // Update the course in the courses array
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course._id === courseId ? { ...course, ...processedData } : course
          )
        );
        
        // Update filtered courses too
        setFilteredCourses(prevFiltered => 
          prevFiltered.map(course => 
            course._id === courseId ? { ...course, ...processedData } : course
          )
        );
        
        // If this is the selected course, update it
        if (selectedCourse?._id === courseId) {
          setSelectedCourse({ ...selectedCourse, ...processedData });
        }
        
        setCourseLoading(false);
      },
      onError: (err) => {
        console.error("Error fetching additional course details:", err);
        setCourseLoading(false);
      }
    });
  }, [getQuery, selectedCourse, categoryInfo]);

  // Update the filter logic to work with the new data structure
  useEffect(() => {
    if (!courses.length) return;
    
    // Get the appropriate filter functions
    const durationFilter = getDurationFilter(selectedDuration);
    const gradeFilter = getGradeFilter(selectedGrade);
    
    // Apply both filters without the search filter
    const filtered = courses.filter(course => {
      const matchesDuration = selectedDuration === 'all' ? true : durationFilter(course);
      const matchesGrade = selectedGrade === 'all' ? true : (course.grade && course.grade.toLowerCase().includes(selectedGrade.toLowerCase()));
      
      return matchesDuration && matchesGrade;
    });
    
    setFilteredCourses(filtered);
    
    // Update selected course if current selection is not in filtered results
    if (filtered.length > 0) {
      if (!selectedCourse || !filtered.some(course => course._id === selectedCourse._id)) {
        setSelectedCourse(filtered[0]);
      }
    } else {
      setSelectedCourse(null);
    }
  }, [selectedDuration, selectedGrade, courses, selectedCourse]);

  // Handle duration selection
  const handleDurationChange = (durationId) => {
    setSelectedDuration(durationId);
  };

  // Handle grade selection
  const handleGradeChange = (gradeId) => {
    setSelectedGrade(gradeId);
  };

  // Handle course selection with progress update
  const handleCourseSelection = (course) => {
    setSelectedCourse(course);
    
    // Load additional details if not already loaded
    if (!course.hasFullDetails) {
      loadAdditionalCourseDetails(course._id);
    }
  };

  // Intersection Observer for section navigation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            if (id) setActiveSection(id);
          }
        });
      },
      { rootMargin: '-10% 0px -90% 0px' }
    );

    // Observe all section refs
    Object.keys(sectionRefs).forEach((section) => {
      if (sectionRefs[section].current) {
        observer.observe(sectionRefs[section].current);
      }
    });

    return () => {
      Object.keys(sectionRefs).forEach((section) => {
        if (sectionRefs[section].current) {
          observer.unobserve(sectionRefs[section].current);
        }
      });
    };
  }, [sectionRefs, selectedCourse]);

  // Handle scroll to section
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    
    if (sectionRefs[sectionId]?.current) {
      sectionRefs[sectionId].current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-8 p-4 max-w-7xl mx-auto">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        ))}
      </div>
      <div className="flex justify-center my-10">
        <div className="category-loader">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );

  // Course loading overlay for individual course loading
  const CourseLoadingOverlay = () => (
    courseLoading && (
      <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
        <div className="category-loader">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    )
  );

  // Empty state for section with no content
  const EmptySection = ({ title, icon: Icon, description }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        {Icon && <Icon className="h-5 w-5 mr-2" />}
        {title}
      </h2>
      <div className="py-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          {Icon && <Icon className="h-8 w-8 text-gray-400 dark:text-gray-500" />}
        </div>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          {description}
        </p>
      </div>
    </div>
  );

  // Error component
  const ErrorDisplay = () => (
    <div className="max-w-3xl mx-auto px-4 py-10 text-center">
      <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-3">
          Failed to load courses
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // If category not found
  if (!categoryInfo) {
    return null; // Will be redirected by useEffect
  }

  return (
    <PageWrapper>
      <Toaster position="bottom-center" />
      <div className={`relative min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 category-page`} data-category={normalizedCategory}>
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transform-gpu">
          <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              <h1 className={`text-lg font-semibold text-gray-900 dark:text-white`}>
                {categoryInfo?.displayName || "Course Categories"} 
                {/* Add emoji based on category */}
                {normalizedCategory === 'vedic-mathematics' && " 🔢"}
                {normalizedCategory === 'ai-and-data-science' && " 🤖"}
                {normalizedCategory === 'digital-marketing' && " 📱"}
                {normalizedCategory === 'personality-development' && " 🌟"}
              </h1>
              <span className={`px-2 py-1 text-xs font-medium ${categoryInfo?.bgClass || 'bg-blue-50 dark:bg-blue-900/30'} ${categoryInfo?.colorClass || 'text-blue-700 dark:text-blue-300'} rounded-full`}>
                Category
              </span>
            </div>
          </nav>
        </header>

        {/* Content with Header Offset */}
        <main className="flex-grow pt-24">
          {loading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="category-loader">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          ) : error ? (
            <ErrorDisplay />
          ) : (
            <div className="container mx-auto px-4">
              {/* Two Column Layout */}
              <div className="flex flex-col lg:flex-row gap-8 mb-12">
                {/* Left Column - Dynamic Course Content */}
                <div className="w-full lg:w-8/12">
                  {/* Selected Course Details */}
                  {selectedCourse ? (
                    <motion.div
                      key={selectedCourse._id}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={fadeIn}
                      className="space-y-8"
                    >
                      {/* Main Course Info Card */}
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 relative">
                        <CourseLoadingOverlay />
                        <div className="space-y-6">
                          {/* Course Image and Basic Info */}
                          <div className="relative">
                            <div className="relative h-64 w-full rounded-xl overflow-hidden">
                              {selectedCourse.thumbnail ? (
                                <Image
                                  src={selectedCourse.thumbnail}
                                  alt={selectedCourse.title || 'Course thumbnail'}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                                  priority
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/images/course-placeholder.jpg';
                                    
                                    // If placeholder fails, replace with gradient
                                    e.target.onerror = () => {
                                      const parent = e.target.parentNode;
                                      if (parent) {
                                        parent.innerHTML = `
                                          <div class="w-full h-full flex items-center justify-center bg-gradient-to-r from-primary-light to-secondary-light">
                                            <div class="flex flex-col items-center">
                                              <span class="text-8xl font-bold text-white opacity-80">
                                                ${selectedCourse.title?.substring(0, 1).toUpperCase() || categoryInfo?.displayName.substring(0, 1)}
                                              </span>
                                              <span class="mt-4 text-xl text-white/90">
                                                ${selectedCourse.category || categoryInfo?.displayName}
                                              </span>
                                            </div>
                                          </div>
                                        `;
                                      }
                                    };
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-primary-light to-secondary-light">
                                  <div className="flex flex-col items-center">
                                    <span className="text-8xl font-bold text-white opacity-80">
                                      {selectedCourse.title?.substring(0, 1).toUpperCase() || categoryInfo?.displayName.substring(0, 1)}
                                    </span>
                                    <span className="mt-4 text-xl text-white/90">
                                      {selectedCourse.category || categoryInfo?.displayName}
                                    </span>
                                  </div>
                                </div>
                              )}
                              
                              {/* Category badge overlay */}
                              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm">
                                <div className="flex items-center">
                                  {CategoryIcon && <CategoryIcon className="h-4 w-4 text-white mr-1.5" />}
                                  <span className="text-sm font-medium text-white">
                                    {selectedCourse.category || categoryInfo?.displayName}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Price overlay */}
                              <div className="absolute bottom-4 right-4">
                                <div className={`px-3 py-1.5 rounded-lg ${categoryInfo?.bgClass || 'bg-emerald-500'} shadow-lg`}>
                                  <span className="text-sm font-bold text-white">
                                    {formatPrice(selectedCourse.course_fee)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Course Title & Tags */}
                          <div className="mt-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                              {selectedCourse.title}
                            </h1>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="selection-pill">
                                {selectedCourse.category || categoryInfo?.displayName || 'Course'}
                              </span>
                              {selectedCourse.is_trending && (
                                <span className="selection-pill flex items-center">
                                  <span className="relative flex h-2 w-2 mr-1">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                  </span>
                                  Trending
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Course Description */}
                      <div>
                        <p className="text-gray-600 dark:text-gray-300">
                          {selectedCourse.description || 'No description available for this course.'}
                        </p>
                      </div>
                      
                      {/* Course Metadata */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-t border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-primary mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Duration</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {selectedCourse.course_duration || formatDuration(selectedCourse.course_duration_days)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-primary mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Enrolled</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {selectedCourse.enrolled_students || 0} students
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Award className="h-5 w-5 text-primary mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Certificate</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {selectedCourse.is_Certification ? 'Included' : 'Not included'}
                            </p>
                          </div>
                        </div>
                        
                        {selectedCourse.grade && (
                          <div className="flex items-center">
                            <BookOpen className="h-5 w-5 text-primary mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Grade</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {selectedCourse.grade}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {selectedCourse.no_of_Sessions > 0 && (
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-primary mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Sessions</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {selectedCourse.no_of_Sessions} sessions
                              </p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-primary mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Price</p>
                            <p className={`text-sm font-medium ${categoryInfo?.colorClass || 'text-emerald-600 dark:text-emerald-400'}`}>
                              {formatPrice(selectedCourse.course_fee)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center min-h-[400px]">
                      <p className="text-gray-500 dark:text-gray-400 text-center">
                        No courses found matching your criteria. <br />
                        Try adjusting your filters.
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Right Column - Filters and Course Selection */}
                <div className="w-full lg:w-4/12">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-24" style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
                    {/* Category Title */}
                    <div className="mb-6">
                      <div className="flex items-center mb-2">
                        {CategoryIcon && (
                          <motion.div 
                            className={`p-2 rounded-full ${categoryInfo?.bgClass || 'bg-blue-50 dark:bg-blue-900/30'} mr-3`}
                            variants={pulse}
                            animate="animate"
                          >
                            <CategoryIcon className={`h-5 w-5 ${categoryInfo?.colorClass || 'text-blue-600 dark:text-blue-400'}`} />
                          </motion.div>
                        )}
                        <h2 className={`text-xl font-bold ${categoryInfo?.colorClass || 'text-gray-900 dark:text-white'}`}>
                          {categoryInfo?.displayName || "Category"}
                          {/* Add emoji based on category */}
                          {normalizedCategory === 'vedic-mathematics' && " 🔢"}
                          {normalizedCategory === 'ai-and-data-science' && " 🤖"}
                          {normalizedCategory === 'digital-marketing' && " 📱"}
                          {normalizedCategory === 'personality-development' && " 🌟"}
                        </h2>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {categoryInfo?.subtitle || `Explore our ${categoryInfo?.displayName || "category"} courses`}
                      </p>
                    </div>
                    
                    {/* Filter Dropdowns */}
                    <div className="space-y-4 mb-6">
                      {/* Grade Dropdown - Only shown for Vedic Math and Personality Development */}
                      {(normalizedCategory === 'vedic-mathematics' || 
                         normalizedCategory === 'personality-development') && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Grade Level
                          </label>
                          <select
                            value={selectedGrade}
                            onChange={(e) => handleGradeChange(e.target.value)}
                            className={`block w-full py-2.5 px-3 border ${selectedGrade !== 'all' ? `${categoryInfo?.borderClass || 'border-emerald-300 dark:border-emerald-700'}` : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-700 dark:text-gray-300`}
                          >
                            <option value="all">All Grades</option>
                            {GRADE_OPTIONS.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      
                      {/* Duration Dropdown - Shown for all categories */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Duration
                        </label>
                        <select
                          value={selectedDuration}
                          onChange={(e) => handleDurationChange(e.target.value)}
                          className={`block w-full py-2.5 px-3 border ${selectedDuration !== 'all' ? `${categoryInfo?.borderClass || 'border-emerald-300 dark:border-emerald-700'}` : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-700 dark:text-gray-300`}
                        >
                          <option value="all">All Durations</option>
                          {DURATION_OPTIONS.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name} - {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* Active Filters */}
                    {(selectedGrade !== 'all' || selectedDuration !== 'all') && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Active Filters
                          </h3>
                          <button
                            onClick={() => {
                              setSelectedGrade('all');
                              setSelectedDuration('all');
                            }}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            Clear All
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedGrade !== 'all' && (
                            <div className={`${categoryInfo?.bgClass || 'bg-emerald-50 dark:bg-emerald-900/20'} ${categoryInfo?.colorClass || 'text-emerald-600 dark:text-emerald-400'} px-2 py-1 rounded-full text-xs font-medium flex items-center`}>
                              Grade: {GRADE_OPTIONS.find(option => option.id === selectedGrade)?.label || selectedGrade}
                              <button
                                onClick={() => setSelectedGrade('all')}
                                className="ml-1.5 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-800/30 p-0.5"
                              >
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          )}
                          {selectedDuration !== 'all' && (
                            <div className={`${categoryInfo?.bgClass || 'bg-emerald-50 dark:bg-emerald-900/20'} ${categoryInfo?.colorClass || 'text-emerald-600 dark:text-emerald-400'} px-2 py-1 rounded-full text-xs font-medium flex items-center`}>
                              Duration: {DURATION_OPTIONS.find(option => option.id === selectedDuration)?.name || selectedDuration}
                              <button
                                onClick={() => setSelectedDuration('all')}
                                className="ml-1.5 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-800/30 p-0.5"
                              >
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Summary and Price */}
                    {selectedCourse && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Course Price:</span>
                          <span className={`text-xl font-bold ${categoryInfo?.colorClass || 'text-emerald-600 dark:text-emerald-400'}`}>
                            {formatPrice(selectedCourse.course_fee)}
                          </span>
                        </div>
                        
                        {/* Enroll Button */}
                        <div className="mb-6">
                          <motion.button
                            onClick={() => {
                              if (!selectedCourse) {
                                toast.error('Please select a course first');
                                return;
                              }
                              
                              const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
                              
                              if (!user) {
                                toast.error('Please login to enroll in this course');
                                router.push('/login');
                                return;
                              }
                              
                              // Redirect to course details page
                              router.push(`/course-details/${selectedCourse._id}`);
                            }}
                            className="w-full category-button group relative overflow-hidden"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="relative z-10 flex items-center justify-center">
                              Enroll Now
                              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <span className="absolute inset-0 bg-gradient-to-r from-primary-light to-secondary-light opacity-0 group-hover:opacity-100 transition-opacity" />
                          </motion.button>
                        </div>
                        
                        {/* Course Selection Count */}
                        <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 mb-6">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Showing <span className="font-medium">{filteredCourses.length}</span> {filteredCourses.length === 1 ? 'course' : 'courses'} matching your criteria
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Course Navigation */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                        Course Sections
                      </h3>
                      <div className="space-y-2">
                        {SECTIONS.map((section) => {
                          // Only show certificate section if course has certification
                          if (section.id === 'certificate' && (!selectedCourse || !selectedCourse.is_Certification)) {
                            return null;
                          }
                          
                          const Icon = section.icon;
                          
                          return (
                            <button
                              key={section.id}
                              onClick={() => scrollToSection(section.id)}
                              className={`w-full flex items-center py-2 px-3 rounded-lg transition-colors ${
                                activeSection === section.id 
                                  ? `${categoryInfo?.bgClass || 'bg-primary-50 dark:bg-primary-900/20'} ${categoryInfo?.colorClass || 'text-primary-600 dark:text-primary-400'}`
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              <Icon className="h-4 w-4 mr-2" />
                              <span className="text-sm font-medium">{section.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Course List with course names */}
                    {filteredCourses.length > 0 && (
                      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                          Available Courses
                        </h3>
                        <div className="max-h-[320px] overflow-y-auto pr-2 space-y-3">
                          {filteredCourses.map((course) => (
                            <motion.div 
                              key={course._id}
                              onClick={() => handleCourseSelection(course)}
                              className={`cursor-pointer group flex items-center p-3 rounded-lg border transition-all ${
                                selectedCourse?._id === course._id 
                                  ? `border-2 ${categoryInfo?.borderClass || 'border-emerald-200 dark:border-emerald-800'} ${categoryInfo?.bgClass || 'bg-emerald-50 dark:bg-emerald-900/20'}`
                                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
                              }`}
                              whileHover={{ 
                                scale: 1.02,
                                boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                              }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                  {course.title}
                                </p>
                              </div>
                              
                              {selectedCourse?._id === course._id && (
                                <CheckCircle2 className={`h-5 w-5 ${categoryInfo?.colorClass || 'text-emerald-600 dark:text-emerald-400'} ml-2 flex-shrink-0`} />
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Add Course Section Content */}
              {selectedCourse && (
                <div className="mt-12">
                  {/* About Program Section */}
                  <section 
                    id="about" 
                    ref={sectionRefs.about}
                    className="mb-12 scroll-mt-24"
                  >
                    <AboutProgram courseId={selectedCourse._id} />
                  </section>
                  
                  {/* Reviews Section */}
                  <section 
                    id="reviews" 
                    ref={sectionRefs.reviews}
                    className="mb-12 scroll-mt-24"
                  >
                    <CourseRelated categoryName={selectedCourse.category} courseId={selectedCourse._id} courseTitle={selectedCourse.title} />
                  </section>
                  
                  {/* FAQ Section */}
                  <section 
                    id="faq" 
                    ref={sectionRefs.faq}
                    className="mb-12 scroll-mt-24"
                  >
                    <CourseFaq courseId={selectedCourse._id} />
                  </section>
                  
                  {/* Certificate Section - Only if course has certification */}
                  {selectedCourse.is_Certification && (
                    <section 
                      id="certificate" 
                      ref={sectionRefs.certificate}
                      className="mb-12 scroll-mt-24"
                    >
                      <CourseCertificate />
                    </section>
                  )}
                </div>
              )}
              
              {/* Recommended Categories Section with simpler styling */}
              {recommendedCategories.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-12">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                    Explore Other Categories
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {recommendedCategories.map((category) => {
                      const Icon = categoryIconMap[category.icon] || BookOpen;
                      
                      return (
                        <motion.div
                          key={category.id}
                          whileHover={{ 
                            scale: 1.03,
                            boxShadow: "0 10px 25px rgba(0,0,0,0.07)",
                          }}
                          whileTap={{ scale: 0.98 }}
                          className={`cursor-pointer rounded-xl overflow-hidden shadow-sm 
                           border border-${category.color}-200 dark:border-${category.color}-800 
                           hover:shadow-md transition-all duration-300`}
                          onClick={() => {
                            router.push(`/enrollment/${category.id}`);
                          }}
                        >
                          <div className={`p-5 bg-${category.color}-50 dark:bg-${category.color}-900/20 h-full`}>
                            <div className="flex justify-between items-start mb-4">
                              <div className={`bg-${category.color}-100 dark:bg-${category.color}-800/40 p-3 w-12 h-12 rounded-lg flex items-center justify-center`}>
                                <Icon className={`h-6 w-6 text-${category.color}-600 dark:text-${category.color}-400`} />
                              </div>
                            </div>
                            
                            <h4 className={`text-lg font-bold text-${category.color}-700 dark:text-${category.color}-300 mb-2`}>
                              {category.name}
                            </h4>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                              Discover amazing courses in {category.name}
                            </p>
                            
                            <div className="flex items-center text-sm font-medium">
                              <motion.div 
                                className="flex items-center"
                                initial={{ x: 0 }}
                                whileHover={{ x: 5 }}
                              >
                                <span className={`text-${category.color}-600 dark:text-${category.color}-400`}>
                                  Browse courses
                                </span>
                                <ArrowRight className={`h-4 w-4 ml-1 text-${category.color}-600 dark:text-${category.color}-400`} />
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Theme Controller */}
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeController />
        </div>
      </div>
    </PageWrapper>
  );
}

export default CategoryEnrollmentPage; 