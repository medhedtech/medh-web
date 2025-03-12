'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Clock, Calendar,Users, Award, CreditCard, Star, 
  BookOpen, ChevronDown, Calculator, BrainCircuit, TrendingUp, 
  UserCheck, Check, ArrowRight, Sparkles, ArrowLeft, MessageCircle,
  FileBadge, GraduationCap, Blocks, HelpCircle, FileText, RefreshCw, ChevronLeft, ChevronRight
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
import { GRADE_OPTIONS } from '../constants';
import { 
  CATEGORY_MAP, 
  getCategoryInfo, 
  normalizeCategory,
  DURATION_OPTIONS,
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
  
  // Add states for dynamic options
  const [availableGrades, setAvailableGrades] = useState([]);
  const [availableDurations, setAvailableDurations] = useState([]);
  
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
  const [courseLoading, setCourseLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8;
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

  // Function to extract and format duration options from courses
  const extractDurationOptions = useCallback((courses) => {
    const durationMap = new Map();
    
    courses.forEach(course => {
      if (!course.course_duration) return;
      
      const duration = course.course_duration;
      const durationId = duration.toLowerCase().replace(/\s+/g, '-');
      
      durationMap.set(durationId, {
        id: durationId,
        name: duration,
        label: duration,
        description: `${duration} duration course`
      });
    });
    
    return Array.from(durationMap.values());
  }, []);

  // Function to extract and format grade options from courses
  const extractGradeOptions = useCallback((courses) => {
    const gradeMap = new Map();
    
    courses.forEach(course => {
      if (!course.grade) return;
      
      const grade = course.grade.toLowerCase();
      let option;
      
      // Map the grade to a standardized format
      if (grade.includes('preschool') || grade.includes('pre-school')) {
        option = { id: 'preschool', label: 'Pre-school', description: 'Early learning foundation' };
      } else if (grade.includes('grade 1') || grade.includes('grade 2')) {
        option = { id: 'grade+1-2', label: 'Grade 1-2', description: 'Primary education basics' };
      } else if (grade.includes('grade 3') || grade.includes('grade 4')) {
        option = { id: 'grade+3-4', label: 'Grade 3-4', description: 'Elementary fundamentals' };
      } else if (grade.includes('grade 5') || grade.includes('grade 6')) {
        option = { id: 'grade+5-6', label: 'Grade 5-6', description: 'Upper elementary concepts' };
      } else if (grade.includes('grade 7') || grade.includes('grade 8')) {
        option = { id: 'grade+7-8', label: 'Grade 7-8', description: 'Middle school advancement' };
      } else if (grade.includes('grade 9') || grade.includes('grade 10')) {
        option = { id: 'grade+9-10', label: 'Grade 9-10', description: 'High school preparation' };
      } else if (grade.includes('grade 11') || grade.includes('grade 12')) {
        option = { id: 'grade+11-12', label: 'Grade 11-12', description: 'College preparation' };
      } else if (grade.includes('undergraduate') || grade.includes('ug')) {
        option = { id: 'undergraduate', label: 'Undergraduate', description: 'University level' };
      } else if (grade.includes('graduate') || grade.includes('pg')) {
        option = { id: 'graduate', label: 'Graduate & Professional', description: 'Advanced studies' };
      }
      
      if (option) {
        gradeMap.set(option.id, option);
      }
    });
    
    return Array.from(gradeMap.values());
  }, []);

  // Update the filter logic to work with the new data structure
  useEffect(() => {
    if (!courses.length) return;
    
    // Get the appropriate filter functions
    const durationFilter = getDurationFilter(selectedDuration);
    const gradeFilter = getGradeFilter(selectedGrade);
    
    // Apply both filters without the search filter
    const filtered = courses.filter(course => {
      const matchesDuration = selectedDuration === 'all' ? true : durationFilter(course);
      const matchesGrade = selectedGrade === 'all' ? true : gradeFilter(course);
      
      return matchesDuration && matchesGrade;
    });
    
    setFilteredCourses(filtered);
    
    // Only update selected course if there isn't one already selected or if it's not in the filtered results
    if (filtered.length > 0 && (!selectedCourse || !filtered.some(course => course._id === selectedCourse._id))) {
      setSelectedCourse(filtered[0]);
    } else if (filtered.length === 0) {
      setSelectedCourse(null);
    }
  }, [selectedDuration, selectedGrade, courses]);

  // Fetch courses useEffect
  useEffect(() => {
    if (!normalizedCategory) return;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        console.log("Fetching courses for category:", categoryInfo?.displayName);
        
        // Construct API endpoint using apiUrls helper
        const apiEndpoint = apiUrls.courses.getAllCoursesWithLimits(
          currentPage,
          itemsPerPage,
          "", // course_title
          "", // course_tag
          categoryInfo?.displayName || "", // course_category
          "Published", // status
          "", // search
          selectedGrade !== 'all' ? selectedGrade : "", // course_grade
          [], // category array
          {
            // Additional filters
            certification: false,
            hasAssignments: false,
            hasProjects: false,
            hasQuizzes: false,
            course_duration: selectedDuration !== 'all' ? selectedDuration : undefined,
            sortBy: "createdAt",
            sortOrder: "desc"
          },
          "", // class_type
          undefined, // course_duration
          undefined, // course_fee
          undefined, // course_type
          undefined, // skill_level
          undefined, // language
          "createdAt", // sort_by
          "asc", // sort_order
          undefined // category_type
        );

        getQuery({
          url: apiEndpoint,
          onSuccess: (response) => {
            const courseData = response?.courses || [];
            const pagination = response?.pagination || {};
            const metadata = response?.metadata || {};
            
            // Process course data
            const processedCourseData = courseData.map(course => ({
              _id: course._id,
              title: course.course_title || "",
              description: course.course_description || `A course on ${categoryInfo?.displayName}`,
              long_description: course.course_description || `Comprehensive ${categoryInfo?.displayName} course designed to enhance your skills and knowledge in this field.`,
              category: course.course_category || categoryInfo?.displayName,
              grade: course.course_grade || "",
              thumbnail: course.course_image || null,
              course_duration: formatDuration(course.course_duration) || "",
              course_duration_days: parseDuration(course.course_duration) || 30,
              course_fee: course.course_fee || 0,
              enrolled_students: course.enrolled_students || 0,
              is_Certification: course.is_Certification === "Yes",
              is_Assignments: course.is_Assignments === "Yes",
              is_Projects: course.is_Projects === "Yes",
              is_Quizes: course.is_Quizes === "Yes",
              curriculum: Array.isArray(course.curriculum) ? course.curriculum : [],
              highlights: course.highlights || [],
              learning_outcomes: course.learning_outcomes || [],
              prerequisites: course.prerequisites || [],
              faqs: course.faqs || [],
              no_of_Sessions: course.no_of_Sessions || 0,
              status: course.status || "Published",
              isFree: course.isFree || false,
              hasFullDetails: true
            }));
            
            setCourses(processedCourseData);
            setTotalPages(pagination.totalPages || 1);
            setTotalItems(pagination.totalCourses || 0);
            
            // Extract available options from metadata or courses
            if (metadata.available_grades) {
              setAvailableGrades(metadata.available_grades.map(grade => ({
                id: grade.id || grade.toLowerCase().replace(/\s+/g, '-'),
                label: grade,
                description: `Courses for ${grade} level`
              })));
            } else {
              const gradeOptions = [
                { id: 'preschool', label: 'Pre-school', description: 'Early learning foundation' },
                { id: 'grade1-2', label: 'Grade 1-2', description: 'Primary education basics' },
                { id: 'grade3-4', label: 'Grade 3-4', description: 'Elementary fundamentals' },
                { id: 'grade5-6', label: 'Grade 5-6', description: 'Upper elementary concepts' },
                { id: 'grade7-8', label: 'Grade 7-8', description: 'Middle school advancement' },
                { id: 'grade9-10', label: 'Grade 9-10', description: 'High school preparation' },
                { id: 'grade11-12', label: 'Grade 11-12', description: 'College preparation' },
                { id: 'graduate', label: 'UG - Graduate-Professional', description: 'University level' }]
              setAvailableGrades(gradeOptions);
            }

            if (metadata.available_durations) {
              setAvailableDurations(metadata.available_durations.map(duration => ({
                id: duration.toLowerCase().replace(/\s+/g, '-'),
                name: duration,
                label: duration,
                description: `${duration} duration course`
              })));
            } else {
              setAvailableDurations(extractDurationOptions(processedCourseData));
            }
            
            setLoading(false);
          },
          onError: (err) => {
            console.error("Error fetching courses:", err);
            setError(parseApiError(err) || `Failed to load ${categoryInfo?.displayName} courses`);
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
  }, [
    normalizedCategory,
    categoryInfo,
    currentPage,
    selectedGrade,
    selectedDuration,
    getQuery,
    extractDurationOptions,
    extractGradeOptions
  ]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  // Handle duration selection
  const handleDurationChange = (durationId) => {
    setSelectedDuration(durationId);
  };

  // Handle grade selection
  const handleGradeChange = (gradeId) => {
    setSelectedGrade(gradeId);
    // Reset selected course when grade changes
    setSelectedCourse(null);
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
                  <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700" style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
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
                      {/* Grade Filter - Only for Vedic Mathematics and Personality Development */}
                      {(normalizedCategory === 'vedic-mathematics' || 
                         normalizedCategory === 'personality-development') && availableGrades.length > 0 ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                              <GraduationCap className="w-4 h-4 mr-2" />
                              Grade Level
                            </label>
                            <div className="relative group">
                              <select
                                value={selectedGrade}
                                onChange={(e) => handleGradeChange(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 text-base transition-all duration-200 ease-in-out
                                border-2 dark:border-gray-600 rounded-xl
                                bg-white dark:bg-gray-700 
                                text-gray-900 dark:text-white
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
                                focus:border-primary-500 dark:focus:border-primary-400
                                hover:border-gray-400 dark:hover:border-gray-500
                                shadow-sm hover:shadow-md
                                cursor-pointer
                                group-hover:border-gray-400 dark:group-hover:border-gray-500"
                              >
                                <option value="all">All Grades</option>
                                {GRADE_OPTIONS.map((option) => (
                                  <option 
                                    key={option.id} 
                                    value={option.id}
                                    className="py-2"
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                                <div className="border-l border-gray-200 dark:border-gray-600 pl-3 py-2">
                                  <ChevronDown className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                                </div>
                              </div>
                            
                              <div className="absolute inset-x-0 h-1/2 bottom-0 rounded-b-xl bg-gradient-to-t from-gray-50 dark:from-gray-800/50 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                           
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              Select a grade level to view available courses
                            </p>
                          </div>

                          {/* Course List with Grade Filter */}
                          <div className="space-y-6">
                            {selectedGrade !== 'all' ? (
                              // Show filtered courses when grade is selected
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                              >
                                <div className="flex items-center justify-between">
                                  <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    Courses for {availableGrades.find(g => g.id === selectedGrade)?.label}
                                  </h3>
                                  <button
                                    onClick={() => setSelectedGrade('all')}
                                    className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center"
                                  >
                                    <RefreshCw className="w-3 h-3 mr-1" />
                                    View All
                                  </button>
                                </div>

                                <div className="space-y-2">
                                  {filteredCourses.map((course) => (
                                    <motion.div 
                                      key={course._id}
                                      onClick={() => handleCourseSelection(course)}
                                      className={`cursor-pointer group flex items-center p-4 rounded-xl transition-all duration-200 ${
                                        selectedCourse?._id === course._id 
                                          ? `border-2 ${categoryInfo?.borderClass || 'border-primary-300 dark:border-primary-700'} ${categoryInfo?.bgClass || 'bg-primary-50 dark:bg-primary-900/20'} shadow-lg`
                                          : 'border-2 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-md'
                                      }`}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                          {course.title}
                                        </p>
                                        <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                                          <Clock className="w-4 h-4 mr-1.5" />
                                          {course.course_duration || 'Flexible duration'}
                                        </div>
                                      </div>
                                      
                                      {selectedCourse?._id === course._id && (
                                        <CheckCircle2 className={`h-5 w-5 ${categoryInfo?.colorClass || 'text-primary-600 dark:text-primary-400'} ml-2 flex-shrink-0`} />
                                      )}
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            ) : (
                              // Show all courses when no grade is selected
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    All Available Courses
                                  </h3>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {courses.length} courses
                                  </span>
                                </div>

                                <div className="space-y-2">
                                  {courses.map((course) => (
                                    <motion.div 
                                      key={course._id}
                                      onClick={() => handleCourseSelection(course)}
                                      className={`cursor-pointer group flex items-center p-4 rounded-xl transition-all duration-200 ${
                                        selectedCourse?._id === course._id 
                                          ? `border-2 ${categoryInfo?.borderClass || 'border-primary-300 dark:border-primary-700'} ${categoryInfo?.bgClass || 'bg-primary-50 dark:bg-primary-900/20'} shadow-lg`
                                          : 'border-2 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-md'
                                      }`}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                          {course.title}
                                        </p>
                                        <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                                          <Clock className="w-4 h-4 mr-1.5" />
                                          {course.course_duration || 'Flexible duration'}
                                          {course.grade && (
                                            <>
                                              <span className="mx-2">•</span>
                                              <GraduationCap className="w-4 h-4 mr-1.5" />
                                              {course.grade}
                                            </>
                                          )}
                                        </div>
                                      </div>
                                      
                                      {selectedCourse?._id === course._id && (
                                        <CheckCircle2 className={`h-5 w-5 ${categoryInfo?.colorClass || 'text-primary-600 dark:text-primary-400'} ml-2 flex-shrink-0`} />
                                      )}
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        // Direct course list for AI & Data Science and Digital Marketing
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Available Courses
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {courses.length} courses
                            </span>
                          </div>

                          <div className="space-y-2">
                            {courses.map((course) => (
                              <motion.div 
                                key={course._id}
                                onClick={() => handleCourseSelection(course)}
                                className={`cursor-pointer group flex items-center p-4 rounded-xl transition-all duration-200 ${
                                  selectedCourse?._id === course._id 
                                    ? `border-2 ${categoryInfo?.borderClass || 'border-primary-300 dark:border-primary-700'} ${categoryInfo?.bgClass || 'bg-primary-50 dark:bg-primary-900/20'} shadow-lg`
                                    : 'border-2 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-md'
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                    {course.title}
                                  </p>
                                  <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    <Clock className="w-4 h-4 mr-1.5" />
                                    {course.course_duration || 'Flexible duration'}
                                    {course.enrolled_students > 0 && (
                                      <>
                                        <span className="mx-2">•</span>
                                        <Users className="w-4 h-4 mr-1.5" />
                                        {course.enrolled_students} enrolled
                                      </>
                                    )}
                                  </div>
                                </div>
                                
                                {selectedCourse?._id === course._id && (
                                  <CheckCircle2 className={`h-5 w-5 ${categoryInfo?.colorClass || 'text-primary-600 dark:text-primary-400'} ml-2 flex-shrink-0`} />
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Active Filters */}
                    {(selectedGrade !== 'all' || selectedDuration !== 'all') && (
                      <div className="mb-6">
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