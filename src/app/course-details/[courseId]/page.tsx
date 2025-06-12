'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, RefreshCw, AlertCircle, ArrowRight, Clock, Users, Award, Edit2
} from 'lucide-react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

// Core components
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";

// Course Components
import CourseDetailsPage from '@/components/pages/CourseDetailsPage';
import CourseFaq from '@/components/sections/course-detailed/courseFaq';
import EnrollmentDetails from '@/components/sections/course-detailed/EnrollmentDetails';

// API
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { getCourseById } from '@/apis/course/course';

interface CourseDescription {
  program_overview?: string;
  benefits?: string;
  learning_objectives?: string[];
  course_requirements?: string[];
  target_audience?: string[];
  _id?: string;
}

interface CurriculumWeek {
  id?: string;
  weekTitle?: string;
  weekDescription?: string;
  topics?: any[];
  lessons?: any[];
  liveClasses?: any[];
  sections?: any[];
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CourseMetadata {
  ratings?: {
    average: number;
    count: number;
  };
  views?: number;
  enrollments?: number;
  lastUpdated?: string;
}

interface CoursePricing {
  currency: string;
  individual: number;
  batch: number;
  min_batch_size: number;
  max_batch_size: number;
  early_bird_discount: number;
  group_discount: number;
  is_active: boolean;
  _id: string;
}

interface FinalEvaluation {
  final_project?: {
    evaluation_criteria: any[];
  };
  has_final_exam?: boolean;
  has_final_project?: boolean;
}

interface Certification {
  is_certified?: boolean;
  certification_criteria?: {
    min_assignments_score: number;
    min_quizzes_score: number;
    min_attendance: number;
  };
}

interface DoubtSessionSchedule {
  frequency?: string;
  preferred_days?: string[];
  preferred_time_slots?: any[];
}

interface CourseData {
  _id: string;
  course_title?: string;
  course_subtitle?: string;
  course_tag?: string;
  course_description?: CourseDescription | string;
  course_category?: string;
  course_subcategory?: string;
  course_grade?: string;
  course_level?: string;
  language?: string;
  course_image?: string;
  brochures?: string[];
  course_duration?: string;
  session_duration?: string;
  course_fee?: number;
  course_type?: string;
  delivery_format?: string;
  delivery_type?: string;
  status?: string;
  enrolled_students?: number;
  is_Certification?: string;
  is_Assignments?: string;
  is_Projects?: string;
  is_Quizes?: string;
  curriculum?: CurriculumWeek[];
  highlights?: any[];
  learning_outcomes?: any[];
  prerequisites?: any[];
  faqs?: any[];
  no_of_Sessions?: number;
  isFree?: boolean;
  show_in_home?: boolean;
  tools_technologies?: any[];
  course_videos?: any[];
  resource_videos?: any[];
  recorded_videos?: any[];
  resource_pdfs?: any[];
  course_modules?: any[];
  bonus_modules?: any[];
  related_courses?: any[];
  subtitle_languages?: any[];
  final_evaluation?: FinalEvaluation;
  certification?: Certification;
  doubt_session_schedule?: DoubtSessionSchedule;
  meta?: CourseMetadata;
  prices?: CoursePricing[];
  createdAt?: string;
  updatedAt?: string;
  unique_key?: string;
  slug?: string;
  _source?: string;
  __v?: number;
}

interface ApiResponse {
  success?: boolean;
  data?: CourseData;
  course?: CourseData;
  source?: string;
}

interface ProcessedCourse {
  _id: string;
  course_title: string;
  course_subtitle?: string;
  course_tag?: string;
  course_description: string;
  long_description: string;
  category: string;
  subcategory?: string;
  grade: string;
  level?: string;
  language?: string;
  thumbnail: string | null;
  course_duration: string;
  session_duration?: string;
  course_duration_days: number;
  course_fee: number;
  enrolled_students: number;
  is_Certification: boolean;
  is_Assignments: boolean;
  is_Projects: boolean;
  is_Quizes: boolean;
  curriculum: CurriculumWeek[];
  highlights: any[];
  learning_outcomes: any[];
  prerequisites: any[];
  faqs: any[];
  no_of_Sessions: number;
  status: string;
  isFree: boolean;
  hasFullDetails: boolean;
  classType?: string;
  class_type?: string;
  course_type?: string;
  delivery_format?: string;
  delivery_type?: string;
  tools_technologies?: any[];
  brochures?: string[];
  course_videos?: any[];
  resource_videos?: any[];
  recorded_videos?: any[];
  final_evaluation?: FinalEvaluation;
  certification?: Certification;
  doubt_session_schedule?: DoubtSessionSchedule;
  meta?: CourseMetadata;
  prices?: CoursePricing[];
  _source?: string;
  batches?: any[]; // For backward compatibility
}

const CourseView: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params?.courseId as string;
  
  const [course, setCourse] = useState<ProcessedCourse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('about');
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [userCurrency, setUserCurrency] = useState<string>("USD"); // Default currency
  const [showMobileEnroll, setShowMobileEnroll] = useState<boolean>(false);
  const [showFloatingButton, setShowFloatingButton] = useState<boolean>(false);
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { getQuery } = useGetQuery();
  
  // Initialize currency detection on mount
  useEffect(() => {
    const initializeCurrency = async () => {
      // Check if currency is specified in URL
      const currencyParam = searchParams.get('currency');
      if (currencyParam) {
        setUserCurrency(currencyParam);
        return;
      }
      
      // Check if we've already stored the currency in localStorage
      const cachedCurrency = localStorage.getItem('userCurrency');
      const cachedTimestamp = localStorage.getItem('userCurrencyTimestamp');
      
      // Use cached value if it exists and is less than 24 hours old
      if (cachedCurrency && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp);
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) { // 24 hours
          setUserCurrency(cachedCurrency);
          return;
        }
      }
      
      // Detect currency from IP if not cached
      try {
        setIsDetectingLocation(true);
        const response = await axios.get('https://ipapi.co/json/', { timeout: 5000 });
        
        if (response.data && response.data.currency) {
          const detectedCurrency = response.data.currency;
          localStorage.setItem('userCurrency', detectedCurrency);
          localStorage.setItem('userCurrencyTimestamp', Date.now().toString());
          setUserCurrency(detectedCurrency);
        } else {
          setUserCurrency("USD"); // Default fallback
        }
      } catch (error) {
        console.error("Error detecting location:", error);
        setUserCurrency("USD"); // Default fallback on error
      } finally {
        setIsDetectingLocation(false);
      }
    };
    
    initializeCurrency();
  }, []); // Only run once on mount

  // Fetch course data when courseId or userCurrency changes
  useEffect(() => {
    if (courseId && userCurrency) {
      const fetchCourseData = async () => {
        try {
          setLoading(true);
          setError(null);
          
          console.log("Fetching course:", courseId);
          
          // Construct the course endpoint with currency parameter
          const courseEndpoint = getCourseById(courseId, "", userCurrency.toLowerCase());
          
          getQuery({
            url: courseEndpoint,
            config: {
              params: {} // Currency is now included in the URL, no need for params
            },
            onSuccess: (response: ApiResponse | CourseData) => {
              // Handle new API response structure with data wrapper
              const courseData = (response as ApiResponse)?.data || (response as ApiResponse)?.course || response as CourseData;
              
              if (!courseData || !courseData._id) {
                setError("Course not found or invalid data received");
                return;
              }
              
              // Process course description - handle both object and string formats
              let processedDescription = "";
              let longDescription = "";
              
              if (typeof courseData.course_description === 'object' && courseData.course_description) {
                processedDescription = courseData.course_description.program_overview || "";
                longDescription = [
                  courseData.course_description.program_overview,
                  courseData.course_description.benefits,
                  courseData.course_description.learning_objectives?.join('\n'),
                  courseData.course_description.course_requirements?.join('\n'),
                  courseData.course_description.target_audience?.join('\n')
                ].filter(Boolean).join('\n\n');
              } else if (typeof courseData.course_description === 'string') {
                processedDescription = courseData.course_description;
                longDescription = courseData.course_description;
              }
              
              // Process course data with new structure
              const processedCourse: ProcessedCourse = {
                _id: courseData._id,
                course_title: courseData.course_title || "Untitled Course",
                course_subtitle: courseData.course_subtitle,
                course_tag: courseData.course_tag,
                course_description: processedDescription,
                long_description: longDescription,
                category: courseData.course_category || "General",
                subcategory: courseData.course_subcategory,
                grade: courseData.course_grade || courseData.course_level || "All Levels",
                level: courseData.course_level,
                language: courseData.language || "English",
                thumbnail: courseData.course_image || null,
                course_duration: courseData.course_duration || "Not specified",
                session_duration: courseData.session_duration,
                course_duration_days: parseInt(courseData.course_duration?.replace(/\D/g, '') || "0") || 0,
                course_fee: courseData.course_fee || 0,
                enrolled_students: courseData.enrolled_students || courseData.meta?.enrollments || 0,
                is_Certification: courseData.is_Certification === "Yes" || courseData.certification?.is_certified === true,
                is_Assignments: courseData.is_Assignments === "Yes",
                is_Projects: courseData.is_Projects === "Yes",
                is_Quizes: courseData.is_Quizes === "Yes",
                curriculum: courseData.curriculum || [],
                highlights: courseData.highlights || [],
                learning_outcomes: courseData.learning_outcomes || [],
                prerequisites: courseData.prerequisites || [],
                faqs: courseData.faqs || [],
                no_of_Sessions: courseData.no_of_Sessions || 0,
                status: courseData.status || "Draft",
                isFree: courseData.isFree || courseData.course_fee === 0,
                hasFullDetails: true,
                classType: courseData.course_type || "Live",
                class_type: courseData.course_type,
                course_type: courseData.course_type,
                delivery_format: courseData.delivery_format,
                delivery_type: courseData.delivery_type,
                tools_technologies: courseData.tools_technologies || [],
                brochures: courseData.brochures || [],
                course_videos: courseData.course_videos || [],
                resource_videos: courseData.resource_videos || [],
                recorded_videos: courseData.recorded_videos || [],
                final_evaluation: courseData.final_evaluation,
                certification: courseData.certification,
                doubt_session_schedule: courseData.doubt_session_schedule,
                meta: courseData.meta,
                prices: courseData.prices || [],
                _source: courseData._source || (response as ApiResponse)?.source,
                // Process batches for backward compatibility
                batches: courseData.prices?.map((price: CoursePricing) => ({
                  ...price,
                  price: price.currency.toLowerCase() === userCurrency.toLowerCase() ? price.batch : price.batch
                }))
              };
              
              setCourse(processedCourse);
              setLoading(false);
            },
            onFail: (error: any) => {
              console.error("Error fetching course:", error);
              setError(error?.message || "Failed to fetch course details");
              setLoading(false);
            }
          });
        } catch (error: any) {
          console.error("Error in fetchCourse:", error);
          setError(error?.message || "An unexpected error occurred");
          setLoading(false);
        }
      };
      
      fetchCourseData();
    }
  }, [courseId, userCurrency, getQuery]);
  
  // Handle scroll to show/hide floating button
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      // Show floating button after scrolling down 300px
      const scrollPosition = window.scrollY;
      setShowFloatingButton(scrollPosition > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle enrollment button click
  const handleEnrollClick = async () => {
    if (!isLoggedIn) {
      // Redirect to login if user is not logged in
      router.push(`/login?redirect=/course-details/${courseId}`);
      return;
    }
    
    if (!course) {
      toast.error("Course information is missing");
      return;
    }

    try {
      setLoading(true);
      
      // Find the enrollment details component
      const enrollmentComponent = document.querySelector('.enrollment-section');
      
      if (enrollmentComponent) {
        // Find the enroll button inside the component and trigger a click on it
        const enrollButton = enrollmentComponent.querySelector('button[aria-label*="Enroll"]');
        if (enrollButton && enrollButton instanceof HTMLButtonElement) {
          enrollButton.click();
        } else {
          // Fallback to scrolling if button can't be found
          enrollmentComponent.scrollIntoView({ behavior: 'smooth' });
          
          // Highlight the enrollment section briefly
          enrollmentComponent.classList.add('ring-2', 'ring-emerald-500', 'ring-opacity-50');
          setTimeout(() => {
            enrollmentComponent.classList.remove('ring-2', 'ring-emerald-500', 'ring-opacity-50');
          }, 2000);
        }
      } else {
        // Fallback if enrollment section isn't found
        setEnrollmentModalOpen(true);
      }
    } catch (error) {
      console.error("Error in enrollment:", error);
      toast.error("Something went wrong. Please try enrolling from the course details section.");
    } finally {
      setLoading(false);
    }
  };

  // Check if user is logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for token and user data in localStorage
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const userData = localStorage.getItem('user') || localStorage.getItem('userData');
      
      // Set login status based on token and user data
      setIsLoggedIn(!!token && (!!userId || !!userData));
    }
  }, []);

  // Error component
  const ErrorDisplay: React.FC = () => (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-10 text-center">
      <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-5 sm:p-8 border border-red-200 dark:border-red-800 shadow-sm">
        <div className="mb-4 sm:mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 dark:bg-red-800/30 p-2 sm:p-3">
            <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-red-600 dark:text-red-400 mb-2 sm:mb-3">
          Failed to load course
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors inline-flex items-center text-sm sm:text-base"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <PageWrapper>
      <Toaster position="bottom-center" />
      <div className="relative min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 category-page" data-category="course-view">
        {/* Fixed Header - Improved for mobile */}
        <header className="fixed top-0 left-0 right-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transform-gpu">
          <nav className="container mx-auto px-2 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 overflow-hidden">
              <button 
                onClick={() => router.back()}
                className="p-1.5 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300" />
              </button>
              <div className="flex items-center overflow-hidden">
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-none">
                  {course?.course_title || "Course Details"}
                </h1>
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full hidden sm:inline-block">
                  Course
                </span>
              </div>
              {/* Show price based on course type */}
              {course?.prices && course.prices.length > 0 && (
                <div className="ml-4 hidden sm:flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                    {(course.classType === 'Blended Courses' || 
                      course.course_type === 'blended' || 
                      course.course_type === 'Blended' || 
                      course.class_type === 'Blended Courses') 
                      ? 'Individual Price:' 
                      : 'Batch Price:'}
                  </span>
                  <span className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                    {course.prices.find(p => p.currency === userCurrency)
                      ? ((course.classType === 'Blended Courses' || 
                          course.course_type === 'blended' || 
                          course.course_type === 'Blended' || 
                          course.class_type === 'Blended Courses')
                          ? course.prices.find(p => p.currency === userCurrency)?.individual?.toLocaleString('en-IN')
                          : course.prices.find(p => p.currency === userCurrency)?.batch?.toLocaleString('en-IN')) 
                      : '0'}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <ThemeController />
            </div>
          </nav>
        </header>

        {/* Content with Header Offset */}
        <main className="flex-grow pt-12 sm:pt-6 md:pt-8 relative z-10">
          {loading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-emerald-500 mb-3 sm:mb-4"></div>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">Loading course details...</p>
              </div>
            </div>
          ) : error ? (
            <ErrorDisplay />
          ) : (
            <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">

              
              <div className="flex flex-col lg:flex-row gap-5 lg:gap-8">
                {/* Left Column - Course Content */}
                <div className="w-full lg:w-9/12 space-y-4 lg:space-y-8 pb-20 sm:pb-24 lg:pb-0">
                  {/* Course Details */}
                  {course && (
                    <div className="relative z-20">
                      <CourseDetailsPage 
                        courseId={course._id} 
                        initialActiveSection={activeSection}
                        classType={course.classType || course.class_type || course.course_type || 'Live'}
                        courseData={course}
                      />
                    </div>
                  )}
                </div>
                
                {/* Right Column - Enrollment Details */}
                <div className="w-full lg:w-3/12 mb-8 lg:mb-0">
                  <div className="lg:sticky lg:top-24 space-y-5 sm:space-y-6 relative z-20">
                    {/* Enrollment Details */}
                    {course && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <EnrollmentDetails 
                          courseDetails={{
                            _id: course._id,
                            course_title: course.course_title,
                            course_duration: course.course_duration,
                            grade: course.grade,
                            prices: course.prices,
                            course_category: course.category,
                            course_description: course.course_description,
                            course_fee: course.course_fee,
                            curriculum: course.curriculum,
                            classType: course.classType || course.class_type || course.course_type,
                            class_type: course.class_type,
                            course_type: course.course_type,
                            delivery_format: course.delivery_format,
                            delivery_type: course.delivery_type,
                            meta: course.meta || {
                              ratings: { average: 0, count: 0 },
                              views: 0,
                              enrollments: 0
                            },
                            features: [
                              "Live interactive sessions",
                              course.is_Certification && "Certificate of completion",
                              "Lifetime access to recordings",
                              course.is_Assignments && "Hands-on assignments",
                              course.is_Projects && "Real-world projects",
                              course.is_Quizes && "Interactive quizzes"
                            ].filter(Boolean) as string[]
                          } as any}
                          categoryInfo={{
                            primaryColor: 'emerald',
                            colorClass: 'text-emerald-700 dark:text-emerald-300',
                            bgClass: 'bg-emerald-50 dark:bg-emerald-900/30',
                            borderClass: 'border-emerald-200 dark:border-emerald-800'
                          }}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        
        {/* Enhanced Mobile Action Button - Sticky and more prominent */}
        {!loading && !error && course && (
          <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="container mx-auto px-3 py-3 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Price</span>
                  <span className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                    {course.prices && course.prices.length > 0 
                      ? `₹${(course.classType === 'Blended Courses' || 
                           course.course_type === 'blended' || 
                           course.course_type === 'Blended' || 
                           course.class_type === 'Blended Courses')
                           ? course.prices.find(p => p.currency === userCurrency)?.individual?.toLocaleString('en-IN') 
                           : course.prices.find(p => p.currency === userCurrency)?.batch?.toLocaleString('en-IN') || '0'}`
                      : 'Free'}
                  </span>
                </div>
                <button 
                  onClick={handleEnrollClick} 
                  className="flex-1 ml-4 py-2.5 px-4 rounded-lg font-medium text-white transition-all bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-sm sm:text-base flex items-center justify-center"
                  aria-label="Enroll in this course"
                >
                  <span>{isLoggedIn ? 'Enroll Now' : 'Login to Enroll'}</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default CourseView; 