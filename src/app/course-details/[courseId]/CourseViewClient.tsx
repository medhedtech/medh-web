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
import { CourseData } from '@/utils/course-seo';

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

interface ProcessedCourse extends CourseData {
  course_duration_days?: number;
  hasFullDetails?: boolean;
  batches?: any[];
}

interface CourseViewClientProps {
  initialCourse?: ProcessedCourse;
  structuredData?: object[];
}

const CourseViewClient: React.FC<CourseViewClientProps> = ({ initialCourse, structuredData }) => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params?.courseId as string;
  
  const [course, setCourse] = useState<ProcessedCourse | null>(initialCourse || null);
  const [loading, setLoading] = useState<boolean>(!initialCourse);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('about');
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [userCurrency, setUserCurrency] = useState<string>("USD");
  const [showFloatingButton, setShowFloatingButton] = useState<boolean>(false);
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { getQuery } = useGetQuery();
  
  // Initialize currency detection on mount
  useEffect(() => {
    const initializeCurrency = async () => {
      const currencyParam = searchParams.get('currency');
      if (currencyParam) {
        setUserCurrency(currencyParam);
        return;
      }
      
      const cachedCurrency = localStorage.getItem('userCurrency');
      const cachedTimestamp = localStorage.getItem('userCurrencyTimestamp');
      
      if (cachedCurrency && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp);
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setUserCurrency(cachedCurrency);
          return;
        }
      }
      
      try {
        setIsDetectingLocation(true);
        const response = await axios.get('https://ipapi.co/json/', { timeout: 5000 });
        
        if (response.data && response.data.currency) {
          const detectedCurrency = response.data.currency;
          localStorage.setItem('userCurrency', detectedCurrency);
          localStorage.setItem('userCurrencyTimestamp', Date.now().toString());
          setUserCurrency(detectedCurrency);
        } else {
          setUserCurrency("USD");
        }
      } catch (error) {
        console.error("Error detecting location:", error);
        setUserCurrency("USD");
      } finally {
        setIsDetectingLocation(false);
      }
    };
    
    initializeCurrency();
  }, [searchParams]);

  // Handle scroll to show/hide floating button
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowFloatingButton(scrollPosition > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle enrollment button click
  const handleEnrollClick = async () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/course-details/${courseId}`);
      return;
    }
    
    if (!course) {
      toast.error("Course information is missing");
      return;
    }

    try {
      setLoading(true);
      
      const enrollmentComponent = document.querySelector('.enrollment-section');
      
      if (enrollmentComponent) {
        const enrollButton = enrollmentComponent.querySelector('button[aria-label*="Enroll"]');
        if (enrollButton && enrollButton instanceof HTMLButtonElement) {
          enrollButton.click();
        } else {
          enrollmentComponent.scrollIntoView({ behavior: 'smooth' });
          
          enrollmentComponent.classList.add('ring-2', 'ring-emerald-500', 'ring-opacity-50');
          setTimeout(() => {
            enrollmentComponent.classList.remove('ring-2', 'ring-emerald-500', 'ring-opacity-50');
          }, 2000);
        }
      } else {
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
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const userData = localStorage.getItem('user') || localStorage.getItem('userData');
      
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
      
      {/* Enhanced Structured Data for Course SEO */}
      {structuredData && structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data)
          }}
        />
      ))}
      
      <div className="relative min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 category-page" data-category="course-view">
        {/* Fixed Header - Improved for mobile */}
        <header className="fixed top-0 left-0 right-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transform-gpu">
          <nav className="w-full max-w-none lg:max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
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
                      course.course_type === 'Blended') 
                      ? 'Individual Price:' 
                      : 'Batch Price:'}
                  </span>
                  <span className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                    {course.prices.find(p => p.currency === userCurrency)
                      ? ((course.classType === 'Blended Courses' || 
                          course.course_type === 'blended' || 
                          course.course_type === 'Blended')
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

        {/* Content with Header Offset - Edge-to-edge mobile */}
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
            <div className="w-full max-w-none lg:max-w-8xl lg:mx-auto px-0 sm:px-4 lg:px-8">
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full min-h-full">
                {/* Left Column - Course Content (Full width on mobile, 2/3 on desktop) */}
                <div className="w-full lg:w-3/4 space-y-4 lg:space-y-6 pb-20 sm:pb-24 lg:pb-0">
                  {/* Course Details with consistent container styling */}
                  {course && (
                    <div className="relative z-10 w-full bg-white dark:bg-gray-800 rounded-lg lg:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm lg:shadow-sm">
                      <CourseDetailsPage 
                        courseId={course._id} 
                        initialActiveSection={activeSection}
                        classType={course.classType || course.course_type || 'Live'}
                        courseData={course}
                      />
                    </div>
                  )}
                </div>
                
                {/* Right Column - Mobile & Desktop Sidebar */}
                <div className="w-full lg:w-1/4 mb-8 lg:mb-0 flex flex-col">
                  <div className="flex-grow flex flex-col lg:sticky lg:top-20">
                    {/* Mobile & Desktop sidebar content */}
                    <div className="w-full flex-grow flex flex-col space-y-4 lg:space-y-6 px-4 sm:px-0">
                      {/* Mobile & Desktop Enrollment Details */}
                      {course && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="flex-grow max-w-sm lg:max-w-none mx-auto w-full"
                        >
                          {/* Mobile: Edge-to-edge styling, Desktop: Card styling */}
                          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
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
                                classType: course.classType || course.course_type,
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
                          </div>
                        </motion.div>
                      )}
                    </div>
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
                           course.course_type === 'Blended')
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

export default CourseViewClient; 