'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, BrainCircuit, TrendingUp, UserCheck, ArrowLeft, 
  ChevronUp, ArrowRight, Sparkles, GraduationCap, Blocks, Star,AlertCircle, RefreshCw,
  HelpCircle, FileBadge, BookOpen
} from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';

// Core components
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";

// New Course Components
// import CourseHeader from '@/components/sections/course-detailed/CourseHeader';
// import CourseNavigation from '@/components/sections/course-detailed/CourseNavigation';
import GradeFilter from '@/components/sections/course-detailed/GradeFilter';
import CourseSelector from '@/components/sections/course-detailed/CourseSelector';
import EnrollmentDetails from '@/components/sections/course-detailed/EnrollmentDetails';

// Existing Course Components
import CourseFaq from '@/components/sections/course-detailed/courseFaq';
import AboutProgram from '@/components/sections/course-detailed/aboutProgram';
import CourseCertificate from '@/components/sections/course-detailed/courseCertificate';
import CourseRelated from '@/components/sections/course-detailed/courseRelated';

// New Integrated Course Details Component
import CourseDetailsPage from '@/components/pages/CourseDetailsPage';

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
import { getAllCoursesWithLimits } from '@/apis/course/course';

// Custom CSS for sticky sidebar
const stickyStyles = `
  /* Hide scrollbar for Chrome, Safari and Opera */
  .hide-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  
  .hide-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .hide-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.3);
    border-radius: 20px;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  .hide-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
  }
  
  /* Sticky sidebar animation */
  .sticky-sidebar {
    transition: transform 0.3s ease-out;
  }
  
  /* Scroll progress indicator */
  .scroll-progress {
    transition: width 0.2s ease-out;
  }
  
  /* Smooth scroll behavior for the page */
  html {
    scroll-behavior: smooth;
  }
  
  @media (prefers-reduced-motion: reduce) {
    .sticky-sidebar, .scroll-progress, html {
      transition: none;
      scroll-behavior: auto;
    }
  }
`;

// Animations
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
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
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
};

const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
};

const bounce = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.03, 1],
    transition: { 
      duration: 1, 
      repeat: Infinity, 
      repeatType: "reverse"
    }
  }
};

const pulse = {
  animate: {
    scale: [1, 1.03, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 1.8,
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
  const unwrappedParams = React.use(params);
  const { categoryname } = unwrappedParams;
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Local currency handling - improved to avoid USD flash
  const [userCurrency, setUserCurrency] = useState(() => {
    // Initialize with cached currency or null to avoid USD flash
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('userCurrency');
      const timestamp = localStorage.getItem('userCurrencyTimestamp');
      if (cached && timestamp && Date.now() - parseInt(timestamp) < 24 * 60 * 60 * 1000) {
        return cached;
      }
    }
    return null; // Start with null to show loading state
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(true);
  
  // Initialize currency detection on mount
  useEffect(() => {
    const initializeCurrency = async () => {
      // Skip if currency is already set from cache
      if (userCurrency) {
        setIsDetectingLocation(false);
        return;
      }
      
      // Check if currency is specified in URL
      const currencyParam = searchParams.get('currency');
      if (currencyParam) {
        setUserCurrency(currencyParam);
        setIsDetectingLocation(false);
        return;
      }
      
      // Detect currency from IP
      try {
        const response = await axios.get('https://ipapi.co/json/', { timeout: 3000 });
        
        if (response.data && response.data.currency) {
          const detectedCurrency = response.data.currency;
          localStorage.setItem('userCurrency', detectedCurrency);
          localStorage.setItem('userCurrencyTimestamp', Date.now().toString());
          setUserCurrency(detectedCurrency);
        } else {
          // Fallback based on timezone if available
          const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          let fallbackCurrency = "USD";
          
          if (timeZone.includes('Asia/Kolkata') || timeZone.includes('Asia/Calcutta')) {
            fallbackCurrency = "INR";
          } else if (timeZone.includes('Europe')) {
            fallbackCurrency = "EUR";
          } else if (timeZone.includes('Asia/Tokyo')) {
            fallbackCurrency = "JPY";
          }
          
          setUserCurrency(fallbackCurrency);
        }
      } catch (error) {
        console.error("Error detecting location:", error);
        // Smart fallback based on browser language
        const language = navigator.language || navigator.userLanguage || "en-US";
        let fallbackCurrency = "USD";
        
        if (language.includes('hi') || language.includes('IN')) {
          fallbackCurrency = "INR";
        } else if (language.startsWith('ja')) {
          fallbackCurrency = "JPY";
        } else if (language.startsWith('zh')) {
          fallbackCurrency = "CNY";
        }
        
        setUserCurrency(fallbackCurrency);
      } finally {
        setIsDetectingLocation(false);
      }
    };
    
    initializeCurrency();
  }, [searchParams, userCurrency]);
  
  // Currency conversion utility functions
  const CURRENCY_RATES = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    INR: 83.12,
    JPY: 110.0,
    CAD: 1.25,
    AUD: 1.35,
    SGD: 1.35,
    CNY: 6.45,
    KRW: 1180.0
  };
  
  const convertPrice = useCallback((priceInUSD) => {
    if (typeof priceInUSD !== 'number' || isNaN(priceInUSD) || !userCurrency) {
      return 0;
    }
    
    const rate = CURRENCY_RATES[userCurrency] || 1;
    return Math.round(priceInUSD * rate * 100) / 100;
  }, [userCurrency]);
  
  const formatPrice = useCallback((price) => {
    if (typeof price !== 'number' || isNaN(price) || !userCurrency) {
      return 'Loading...';
    }
    
    if (price === 0) {
      return 'Free';
    }
    
    const currencySymbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
      JPY: '¥',
      CAD: 'C$',
      AUD: 'A$',
      SGD: 'S$',
      CNY: '¥',
      KRW: '₩'
    };
    
    const symbol = currencySymbols[userCurrency] || '$';
    const formattedNumber = Math.round(price).toLocaleString();
    
    return `${symbol}${formattedNumber}`;
  }, [userCurrency]);
  
  // Improved: Better course ID detection with more robust parsing
  const isCourseView = categoryname?.startsWith('course');
  const courseId = useMemo(() => {
    if (!isCourseView) return null;
    
    // Handle both /enrollment/course/COURSE_ID and /enrollment/course/COURSE_ID/any-slug formats
    const parts = categoryname.split('/');
    return parts.length > 1 ? parts[1] : null;
  }, [categoryname, isCourseView]);
  
  // Only normalize the category if it's not a course view
  const normalizedCategory = useMemo(() => isCourseView ? null : normalizeCategory(categoryname), [categoryname, isCourseView]);
  const categoryInfo = useMemo(() => isCourseView ? null : getCategoryInfo(normalizedCategory), [normalizedCategory, isCourseView]);
  
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const mainContentRef = useRef(null);
  const sidebarRef = useRef(null);
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

  // Reset grade selection for categories that don't use grades
  useEffect(() => {
    if (normalizedCategory === 'ai-and-data-science' || normalizedCategory === 'digital-marketing') {
      setSelectedGrade('all');
    }
  }, [normalizedCategory]);

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
        option = { id: 'Preschool', label: 'Pre-school', description: 'Early learning foundation' };
      } else if (grade.includes('grade 1') || grade.includes('grade 2')) {
        option = { id: 'Grade 1-2', label: 'Grade 1-2', description: 'Primary education basics' };
      } else if (grade.includes('grade 3') || grade.includes('grade 4')) {
        option = { id: 'Grade 3-4', label: 'Grade 3-4', description: 'Elementary fundamentals' };
      } else if (grade.includes('grade 5') || grade.includes('grade 6')) {
        option = { id: 'Grade 5-6', label: 'Grade 5-6', description: 'Upper elementary concepts' };
      } else if (grade.includes('grade 7') || grade.includes('grade 8')) {
        option = { id: 'Grade 7-8', label: 'Grade 7-8', description: 'Middle school advancement' };
      } else if (grade.includes('grade 9') || grade.includes('grade 10')) {
        option = { id: 'Grade 9-10', label: 'Grade 9-10', description: 'High school preparation' };
      } else if (grade.includes('grade 11') || grade.includes('grade 12')) {
        option = { id: 'Grade 11-12', label: 'Grade 11-12', description: 'College preparation' };
      } else if (grade.includes('undergraduate') || grade.includes('ug')) {
        option = { id: 'Undergraduate', label: 'Undergraduate', description: 'University level' };
      } else if (grade.includes('graduate') || grade.includes('pg')) {
        option = { id: 'Graduate', label: 'Graduate & Professional', description: 'Advanced studies' };
      }
      
      if (option) {
        gradeMap.set(option.id, option);
      }
    });
    
    return Array.from(gradeMap.values());
  }, []);

  // Handle grade selection
  const handleGradeChange = (gradeId) => {
    console.log('Grade selected:', gradeId); // Debug log
    setSelectedGrade(gradeId);
    // Reset selected course when grade changes
    setSelectedCourse(null);
  };

  // Filter courses when grade filter changes
  useEffect(() => {
    if (loading) return;
    
    let filteredResults = [...courses];
    
    // Apply grade filter for categories that use it
    if (['vedic-mathematics', 'personality-development'].includes(normalizedCategory) && selectedGrade !== 'all') {
      filteredResults = filteredResults.filter(course => 
        course.course_grade === availableGrades.find(g => g.id === selectedGrade)?.label
      );
    }
    
    // For categories with hidden grade selector, show all courses 
    if (['ai-and-data-science', 'digital-marketing'].includes(normalizedCategory)) {
      // No grade filtering for these categories
      filteredResults = [...courses];
    }
    
    // Apply duration filter if active
    if (selectedDuration !== 'all') {
      const durationFilter = getDurationFilter(selectedDuration);
      if (durationFilter) {
        filteredResults = filteredResults.filter(course => 
          durationFilter.test(course, durationFilter.days)
        );
      }
    }
    
    setFilteredCourses(filteredResults);
    
    // Reset selected course if it's no longer in filtered results
    if (selectedCourse && !filteredResults.some(c => c._id === selectedCourse._id)) {
      setSelectedCourse(null);
    }
  }, [selectedGrade, selectedDuration, courses, loading, normalizedCategory, availableGrades]);

  // Fetch courses useEffect
  useEffect(() => {
    if (!normalizedCategory || !userCurrency) return;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        console.log("Fetching courses for category:", categoryInfo?.displayName);
        
        console.log("Category Info:", categoryInfo);
        
        // Construct API endpoint using apiUrls helper
        const apiEndpoint = getAllCoursesWithLimits({
          page: currentPage,
          limit: itemsPerPage,
          course_title: "",
          course_tag: "",
          course_category: categoryInfo?.displayName || "",
          status: "Published",
          search: "",
          course_grade: selectedGrade !== 'all' ? selectedGrade : "",
          category: [],
          filters: {
            certification: false,
            hasAssignments: false,
            hasProjects: false,
            hasQuizzes: false,
            course_duration: selectedDuration !== 'all' ? selectedDuration : undefined
          },
          class_type: "",
          course_duration: undefined,
          course_fee: undefined,
          course_type: categoryInfo?.courseType || undefined,
          skill_level: undefined,
          language: undefined,
          sort_by: "createdAt",
          sort_order: "asc",
          category_type: categoryInfo?.categoryType || undefined,
          currency: userCurrency
        });
        
        console.log("API Endpoint:", apiEndpoint);

        getQuery({
          url: apiEndpoint,
          onSuccess: (response) => {
            const courseData = response?.data?.courses || [];
            const pagination = response?.data?.pagination || {};
            const facets = response?.data?.facets || {};
            
            console.log("API Response:", response); // Debug log to inspect raw API response
            
            // Process course data
            const processedCourseData = courseData.map(course => {
              const coursePrice = course.prices && course.prices.length > 0 
                ? course.prices.find(p => p.currency === userCurrency)?.individual || 
                  convertPrice(course.prices.find(p => p.currency === "USD")?.individual || course.course_fee || 0)
                : convertPrice(course.course_fee || 0);
                
              return {
                _id: course._id,
                title: course.course_title || "", // Use this field for display
                description: course.course_description || `A course on ${categoryInfo?.displayName}`,
                long_description: typeof course.course_description === 'object' 
                  ? course.course_description.program_overview 
                  : course.course_description || `Comprehensive ${categoryInfo?.displayName} course designed to enhance your skills and knowledge in this field.`,
                category: course.course_category || categoryInfo?.displayName,
                grade: course.course_grade || "",
                thumbnail: course.course_image || null,
                course_duration: formatDuration(course.course_duration) || "",
                course_duration_days: parseDuration(course.course_duration) || 30,
                course_fee: coursePrice,
                prices: course.prices || [],
                original_prices: course.prices,  // Store original prices data
                currency_code: userCurrency,    // Store current currency code
                enrolled_students: course.meta?.enrollments || 0,
                views: course.meta?.views || 0,
                is_Certification: course.is_Certification === "Yes",
                is_Assignments: course.is_Assignments === "Yes",
                is_Projects: course.is_Projects === "Yes",
                is_Quizes: course.is_Quizes === "Yes",
                curriculum: Array.isArray(course.curriculum) ? course.curriculum : [],
                highlights: course.highlights || [],
                learning_outcomes: course.course_description?.learning_objectives || [],
                prerequisites: course.course_description?.course_requirements || [],
                faqs: course.final_evaluation?.final_faqs || [],
                no_of_Sessions: course.no_of_Sessions || 0,
                status: course.status || "Published",
                isFree: course.isFree || false,
                hasFullDetails: true,
                slug: course.slug || "",
                category_type: course.category_type || ""
              };
            });
            
            console.log("Processed course data:", processedCourseData); // Debug log
            
            // Add fallback course data for digital marketing if no courses found
            let finalCourseData = processedCourseData;
            if (processedCourseData.length === 0 && normalizedCategory === 'digital-marketing') {
              finalCourseData = [{
                _id: 'digital-marketing-fallback',
                title: 'Digital Marketing with Data Analytics',
                description: 'Master the art of digital marketing combined with powerful data analytics to drive business growth and make data-driven marketing decisions.',
                long_description: 'This comprehensive Digital Marketing with Data Analytics course combines modern marketing strategies with data-driven insights. Learn SEO, social media marketing, content marketing, paid advertising, and how to analyze marketing performance using advanced analytics tools.',
                category: 'Digital Marketing',
                grade: '',
                thumbnail: '/images/courses/digital-marketing.jpg',
                course_duration: '3-6 months',
                course_duration_days: 120,
                course_fee: userCurrency === 'INR' ? 35000 : 450,
                prices: [{
                  currency: userCurrency,
                  individual: userCurrency === 'INR' ? 35000 : 450,
                  batch: userCurrency === 'INR' ? 24500 : 315,
                  min_batch_size: 2,
                  max_batch_size: 10,
                  early_bird_discount: 0,
                  group_discount: 0,
                  is_active: true,
                  _id: 'digital-marketing-price'
                }],
                original_prices: [],
                currency_code: userCurrency,
                enrolled_students: 1200,
                views: 5400,
                is_Certification: true,
                is_Assignments: true,
                is_Projects: true,
                is_Quizes: true,
                curriculum: [
                  { title: 'Digital Marketing Fundamentals', lessons: 8 },
                  { title: 'SEO & Content Marketing', lessons: 12 },
                  { title: 'Social Media Marketing', lessons: 10 },
                  { title: 'Paid Advertising (Google Ads, Facebook Ads)', lessons: 14 },
                  { title: 'Marketing Analytics & Data Analysis', lessons: 16 },
                  { title: 'Email Marketing & Automation', lessons: 8 },
                  { title: 'Conversion Optimization', lessons: 6 },
                  { title: 'Marketing Strategy & Planning', lessons: 6 }
                ],
                highlights: [
                  'SEO and content marketing strategies',
                  'Social media campaign management',
                  'Analytics and data-driven marketing',
                  'Digital advertising and conversion optimization'
                ],
                learning_outcomes: [
                  'Master digital marketing channels and strategies',
                  'Analyze marketing data to optimize campaigns',
                  'Create effective content and social media strategies',
                  'Run successful paid advertising campaigns'
                ],
                prerequisites: [
                  'Basic computer skills',
                  'Interest in marketing and business',
                  'No prior marketing experience required'
                ],
                faqs: [
                  {
                    question: 'What tools will I learn to use?',
                    answer: 'You will learn Google Analytics, Google Ads, Facebook Ads Manager, SEMrush, Mailchimp, and other industry-standard marketing tools.'
                  },
                  {
                    question: 'Is this course suitable for beginners?',
                    answer: 'Yes, this course is designed for beginners with no prior marketing experience. We start with fundamentals and build up to advanced strategies.'
                  }
                ],
                no_of_Sessions: 80,
                status: 'Published',
                isFree: false,
                hasFullDetails: true,
                slug: 'digital-marketing-with-data-analytics',
                category_type: 'professional'
              }];
            }
            
            setCourses(finalCourseData);
            setTotalPages(pagination.totalPages || 1);
            setTotalItems(pagination.total || finalCourseData.length);
            
            // Extract available categories from facets
            if (facets && facets.categories) {
              console.log("Available categories:", facets.categories);
            }
            
            // Extract available grade options
            const gradeOptions = [
              { id: 'preschool', label: 'Pre-school', description: 'Early learning foundation' },
              { id: 'grade1-2', label: 'Grade 1-2', description: 'Primary education basics' },
              { id: 'grade3-4', label: 'Grade 3-4', description: 'Elementary fundamentals' },
              { id: 'grade5-6', label: 'Grade 5-6', description: 'Upper elementary concepts' },
              { id: 'grade7-8', label: 'Grade 7-8', description: 'Middle school advancement' },
              { id: 'grade9-10', label: 'Grade 9-10', description: 'High school preparation' },
              { id: 'grade11-12', label: 'Grade 11-12', description: 'College preparation' },
              { id: 'graduate', label: 'UG - Graduate-Professional', description: 'University level' }];
            setAvailableGrades(gradeOptions);
            
            // Extract duration options from courses
            setAvailableDurations(extractDurationOptions(processedCourseData));
            
            setLoading(false);
          },
          onFail: (err) => {
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
    extractGradeOptions,
    userCurrency,
    convertPrice
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
    const courseDetailsEndpoint = `${apiUrls.baseURL}/courses/${courseId}`;
    
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
          description: typeof courseData.course_description === 'object' ? 
                       (courseData.course_description.text || JSON.stringify(courseData.course_description)) : 
                       courseData.course_description || "",
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
      onFail: (err) => {
        console.error("Error fetching additional course details:", err);
        setCourseLoading(false);
      }
    });
  }, [getQuery, selectedCourse, categoryInfo, userCurrency, convertPrice]);

  // Handle duration selection
  const handleDurationChange = (durationId) => {
    setSelectedDuration(durationId);
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
  }, [sectionRefs]);

  // Track scroll progress for sticky sidebar
  useEffect(() => {
    const handleScroll = () => {
      if (!mainContentRef.current) return;
      
      // Calculate scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      // Calculate progress percentage
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(scrollPercentage, 100));
      
      // Apply subtle parallax effect to sidebar
      if (sidebarRef.current) {
        const translateY = scrollTop * 0.05; // Adjust multiplier for effect intensity
        sidebarRef.current.style.transform = `translateY(${translateY}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Modified scrollToSection function to just update the activeSection state
  // without scrolling behavior
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    // No scrolling behavior - we'll update content dynamically instead
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6 p-4 max-w-7xl mx-auto">
      {/* Header skeleton */}
      <div className="flex items-center space-x-2">
        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/4"></div>
      </div>
      
      {/* Description skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>
      
      {/* Filters skeleton */}
      <div className="flex flex-wrap gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
        ))}
      </div>
      
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl overflow-hidden shadow-sm">
            <div className="h-40 bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-4 space-y-3 bg-gray-100 dark:bg-gray-800">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination skeleton */}
      <div className="flex justify-center gap-2 mt-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        ))}
      </div>
    </div>
  );

  // Course loading overlay for individual course loading
  const CourseLoadingOverlay = () => (
    courseLoading && (
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
        <div className="flex flex-col items-center">
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
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 animate-pulse">
            Loading course details...
          </p>
        </div>
      </div>
    )
  );

  // Empty state for section with no content - enhanced with better visual cues
  const EmptySection = ({ title, icon: Icon, description }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:border-gray-300 dark:hover:border-gray-600">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        {Icon && <Icon className="h-5 w-5 mr-2" />}
        {title}
      </h2>
      <div className="py-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 shadow-inner">
          {Icon && <Icon className="h-8 w-8 text-gray-400 dark:text-gray-500" />}
        </div>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          {description}
        </p>
      </div>
    </div>
  );

  // Error component - enhanced with better visual feedback
  const ErrorDisplay = () => (
    <div className="max-w-3xl mx-auto px-4 py-10 text-center">
      <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-8 border border-red-200 dark:border-red-800 shadow-sm">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 dark:bg-red-800/30 p-3">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-3">
          Failed to load courses
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors inline-flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </button>
      </div>
    </div>
  );

  // If category not found
  if (!categoryInfo && !isCourseView) {
    return null; // Will be redirected by useEffect
  }

  const getColorClasses = (color) => ({
    border: `border-${color}-200 dark:border-${color}-800`,
    bg: `bg-${color}-50 dark:bg-${color}-900/20`,
    bgIcon: `bg-${color}-100 dark:bg-${color}-800/40`,
    text: `text-${color}-600 dark:text-${color}-400`,
    heading: `text-${color}-700 dark:text-${color}-300`
  });

  // Handle clicks outside the courses dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById('courses-dropdown');
      const dropdownTrigger = document.getElementById('courses-dropdown-trigger');
      
      if (dropdown && dropdownTrigger &&
          !dropdown.contains(event.target) && 
          !dropdownTrigger.contains(event.target)) {
        dropdown.classList.add('hidden');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Ensure we have a selected course when filtered courses change
  useEffect(() => {
    if (filteredCourses.length > 0 && !selectedCourse) {
      handleCourseSelection(filteredCourses[0]);
    }
  }, [filteredCourses, selectedCourse, handleCourseSelection]);

  // New: Add specific course fetch logic
  useEffect(() => {
    // Skip if not in course view or we don't have a courseId or currency
    if (!isCourseView || !courseId || !userCurrency) return;
    
    setLoading(true);
    console.log("Fetching specific course:", courseId);
    
    // Fetch the specific course by ID
    const courseEndpoint = apiUrls.courses.getCoursesById(courseId);
    
    getQuery({
      url: courseEndpoint,
      onSuccess: (response) => {
        console.log("Course response:", response);
        
        // Get the course data from the response
        const courseData = response?.course || response?.data || response;
        
        if (!courseData || !courseData._id) {
          console.error("Invalid course data received");
          setError("Course not found or invalid data received");
          setLoading(false);
          return;
        }
        
        // Process the course data
        const processedCourse = {
          _id: courseData._id,
          title: courseData.course_title || "",
          description: courseData.course_description || "",
          long_description: courseData.course_description || "",
          category: courseData.course_category || "",
          grade: courseData.course_grade || "",
          thumbnail: courseData.course_image || null,
          course_duration: formatDuration(courseData.course_duration) || "",
          course_duration_days: parseDuration(courseData.course_duration) || 30,
          course_fee: courseData.course_fee || 0,
          enrolled_students: courseData.enrolled_students || 0,
          is_Certification: courseData.is_Certification === "Yes",
          is_Assignments: courseData.is_Assignments === "Yes",
          is_Projects: courseData.is_Projects === "Yes",
          is_Quizes: courseData.is_Quizes === "Yes",
          curriculum: Array.isArray(courseData.curriculum) ? courseData.curriculum : [],
          highlights: courseData.highlights || [],
          learning_outcomes: courseData.learning_outcomes || [],
          prerequisites: courseData.prerequisites || [],
          faqs: courseData.faqs || [],
          no_of_Sessions: courseData.no_of_Sessions || 0,
          status: courseData.status || "Published",
          isFree: courseData.isFree || false,
          hasFullDetails: true
        };
        
        // Set both courses and filtered courses with just this course
        setCourses([processedCourse]);
        setFilteredCourses([processedCourse]);
        
        // Set as the selected course
        setSelectedCourse(processedCourse);
        setLoading(false);
      },
      onError: (err) => {
        console.error("Error fetching course:", err);
        setError(parseApiError(err) || "Failed to load course details");
        setLoading(false);
      }
    });
  }, [isCourseView, courseId, getQuery]);

  // If category doesn't exist and we're not in course view, redirect to main enrollment page
  useEffect(() => {
    if (!normalizedCategory && !isCourseView) {
      router.push('/enrollment');
    }
  }, [normalizedCategory, router, isCourseView]);

  // Display formatted price in the UI (now uses the local formatPrice function)
  // The formatPrice function is defined above with currency handling

  return (
    <PageWrapper>
      <Toaster position="bottom-center" />
      <style jsx global>{stickyStyles}</style>
      <div className="flex flex-col min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-12 border-x border-transparent">


        {/* Content - Full width */}
        <main className="flex-grow pt-8 md:pt-12 lg:pt-6 flex justify-center items-center w-full">
          {loading || isDetectingLocation || !userCurrency ? (
            <div className="flex items-center justify-center min-h-[60vh] w-full">
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
            <div className="w-full max-w-8xl mx-auto px-4">
              {/* Two Column Layout - Improved mobile design */}
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full min-h-full" ref={mainContentRef}>
                {/* Left Column - Dynamic Course Content */}
                <div className={`w-full ${isCourseView ? 'lg:w-8/12' : 'lg:w-8/12'} space-y-4 lg:space-y-8`}>
                  {/* CourseDetailsPage integration - show dynamically based on selected course */}
                  {selectedCourse && (
                    <div className="relative z-10 w-full">
                      {/* We pass the activeSection to control which tab is visible */}
                      <CourseDetailsPage 
                        courseId={selectedCourse?._id} 
                        initialActiveSection={activeSection !== 'overview' ? activeSection : 'about'}
                        faqComponent={<CourseFaq courseId={selectedCourse._id} />}
                      />
                    </div>
                  )}
                </div>
                
                {/* Right Column - Filters and Course Selection */}
                <div className="w-full lg:w-4/12 mb-8 lg:mb-0 flex flex-col">
                  <div className="flex-grow flex flex-col lg:sticky lg:top-24">
                    {/* Remove scrolling from sidebar and fill available height */}
                    <div className="w-full flex-grow flex flex-col" ref={sidebarRef}>
                      {/* Only show grade filter if not in course view mode */}
                      {!isCourseView && (normalizedCategory === 'vedic-mathematics' || 
                       normalizedCategory === 'personality-development') && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <GradeFilter 
                            selectedGrade={selectedGrade}
                            availableGrades={availableGrades}
                            filteredCourses={filteredCourses}
                            selectedCourse={selectedCourse}
                            handleGradeChange={handleGradeChange}
                            handleCourseSelection={handleCourseSelection}
                            categoryInfo={categoryInfo}
                            setSelectedGrade={setSelectedGrade}
                          />
                        </motion.div>
                      )}

                      {/* For AI/Data Science and Digital Marketing, just show course selection (if not in course view) */}
                      {!isCourseView && (normalizedCategory === 'ai-and-data-science' || 
                       normalizedCategory === 'digital-marketing') && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <GradeFilter 
                            selectedGrade={selectedGrade}
                            availableGrades={availableGrades}
                            filteredCourses={filteredCourses}
                            selectedCourse={selectedCourse}
                            handleGradeChange={handleGradeChange}
                            handleCourseSelection={handleCourseSelection}
                            categoryInfo={categoryInfo}
                            setSelectedGrade={setSelectedGrade}
                            hideGradeSelector={true}
                          />
                        </motion.div>
                      )}

                      {/* For other categories, show regular filter (if not in course view) */}
                      {!isCourseView && !(['vedic-mathematics', 'personality-development', 'ai-and-data-science', 'digital-marketing'].includes(normalizedCategory)) && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <GradeFilter 
                            selectedGrade={selectedGrade}
                            availableGrades={availableGrades}
                            filteredCourses={filteredCourses}
                            selectedCourse={selectedCourse}
                            handleGradeChange={handleGradeChange}
                            handleCourseSelection={handleCourseSelection}
                            categoryInfo={categoryInfo}
                            setSelectedGrade={setSelectedGrade}
                          />
                        </motion.div>
                      )}

                      {/* Enrollment Details with full height */}
                      {selectedCourse && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="pt-4 lg:pt-6 flex-grow"
                        >
                          <EnrollmentDetails 
                            courseDetails={selectedCourse}
                            categoryInfo={isCourseView ? {
                              // Create a simple category info object for course view mode
                              displayName: selectedCourse.category,
                              colorClass: 'text-emerald-700 dark:text-emerald-300',
                              bgClass: 'bg-emerald-50 dark:bg-emerald-900/30'
                            } : categoryInfo}
                            currencyCode={userCurrency}
                            formatPriceFunc={formatPrice}
                          />
                        </motion.div>
                      )}
                    </div>

                    {/* Scroll indicator - hidden on mobile */}
                    <div className="hidden lg:block h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-2">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-500"
                        initial={{ width: "0%" }}
                        animate={{ width: `${scrollProgress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    
                    {/* Mobile Action Button */}
                    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 lg:hidden">
                      <button 
                        onClick={() => {
                          // Handle enrollment action
                          if (selectedCourse) {
                            // Implement your enrollment logic here
                            showToast.success("Enrollment feature coming soon!");
                          } else {
                            toast.error("Please select a course first!");
                          }
                        }} 
                        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                          selectedCourse 
                            ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!selectedCourse}
                      >
                        {selectedCourse ? "Enroll Now" : "Select a Course"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </PageWrapper>
  );
}

export default CategoryEnrollmentPage; 