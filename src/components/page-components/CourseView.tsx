'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, RefreshCw, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { ICourse } from '@/types/course.types';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import { apiBaseUrl, apiUrls } from '@/apis';
import * as courseAPI from '@/apis/course/course';

// Core components
import ThemeController from "@/components/shared/others/ThemeController";

// Course Components
import CourseDetailsPage from '@/components/page-components/CourseDetailsPage';
import CourseFaq from '@/components/sections/course-detailed/courseFaq';
import EnrollmentDetails from '@/components/sections/course-detailed/EnrollmentDetails';

// API
import useGetQuery from "@/hooks/getQuery.hook";
import { formatDuration, parseDuration, parseApiError } from '@/app/course-details/utils';
import { Toaster, toast } from 'react-hot-toast';

interface CourseData {
  _id: string;
  course_title?: string;
  course_description?: string;
  course_category?: string;
  course_grade?: string;
  course_image?: string;
  course_duration?: string;
  course_fee?: number;
  enrolled_students?: number;
  is_Certification?: string;
  is_Assignments?: string;
  is_Projects?: string;
  is_Quizes?: string;
  curriculum?: any[];
  highlights?: any[];
  learning_outcomes?: any[];
  prerequisites?: any[];
  faqs?: any[];
  no_of_Sessions?: number;
  status?: string;
  isFree?: boolean;
  prices?: {
    currency: string;
    individual: number;
    batch: number;
    min_batch_size: number;
    max_batch_size: number;
    early_bird_discount: number;
    group_discount: number;
    is_active: boolean;
    _id: string;
  }[];
}

interface ProcessedCourse {
  _id: string;
  course_title: string;
  course_description: string;
  long_description: string;
  category: string;
  grade: string;
  thumbnail: string | null;
  course_duration: string;
  course_duration_days: number;
  course_fee: number;
  enrolled_students: number;
  is_Certification: boolean;
  is_Assignments: boolean;
  is_Projects: boolean;
  is_Quizes: boolean;
  curriculum: any[];
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
  prices?: {
    currency: string;
    individual: number;
    batch: number;
    min_batch_size: number;
    max_batch_size: number;
    early_bird_discount: number;
    group_discount: number;
    is_active: boolean;
    _id: string;
  }[];
}

interface CourseViewProps {
  courseId?: string;
}

const CourseView: React.FC<CourseViewProps> = ({ courseId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [course, setCourse] = useState<ProcessedCourse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('about');
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [userCurrency, setUserCurrency] = useState<string>("USD"); // Default currency
  const { getQuery } = useGetQuery();
  
  // Function to detect user's location and get the appropriate currency
  const getLocationCurrency = useCallback(async () => {
    try {
      setIsDetectingLocation(true);
      
      // Check if currency is specified in URL
      const currencyParam = searchParams.get('currency');
      if (currencyParam) {
        console.log(`Using currency from URL: ${currencyParam}`);
        setUserCurrency(currencyParam);
        return currencyParam;
      }
      
      // Check if we've already stored the currency in localStorage
      const cachedCurrency = localStorage.getItem('userCurrency');
      const cachedTimestamp = localStorage.getItem('userCurrencyTimestamp');
      
      // Use cached value if it exists and is less than 24 hours old
      if (cachedCurrency && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp);
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) { // 24 hours
          console.log(`Using cached currency: ${cachedCurrency}`);
          setUserCurrency(cachedCurrency);
          return cachedCurrency;
        }
      }
      
      // Make request to IP geolocation API
      const response = await axios.get('https://ipapi.co/json/', { timeout: 5000 });
      
      if (response.data && response.data.currency) {
        const detectedCurrency = response.data.currency;
        console.log(`Detected currency from IP: ${detectedCurrency}`);
        
        // Store in localStorage with timestamp
        localStorage.setItem('userCurrency', detectedCurrency);
        localStorage.setItem('userCurrencyTimestamp', Date.now().toString());
        
        setUserCurrency(detectedCurrency);
        return detectedCurrency;
      } else {
        console.log("Could not detect currency from IP, using default");
        return "USD"; // Default fallback
      }
    } catch (error) {
      console.error("Error detecting location:", error);
      return "USD"; // Default fallback on error
    } finally {
      setIsDetectingLocation(false);
    }
  }, [searchParams]);
  
  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching course:", courseId);
        
        // Get currency based on user's location
        const userCurrency = await getLocationCurrency();
        console.log(`Using currency for API request: ${userCurrency}`);
        
        // Construct the course endpoint with currency parameter
        const courseEndpoint = courseAPI.getCourseById(courseId, "", userCurrency.toLowerCase());
        
        getQuery({
          url: courseEndpoint,
          config: {
            params: {} // Currency is now included in the URL, no need for params
          },
          onSuccess: (response: { course?: CourseData; data?: CourseData } | CourseData) => {
            const courseData = (response as any)?.course || (response as any)?.data || response;
            
            if (!courseData || !courseData._id) {
              setError("Course not found or invalid data received");
              return;
            }
            
            // Process course data
            const processedCourse = {
              ...courseData,
              batches: courseData.batches?.map((batch: any) => ({
                ...batch,
                price: batch.prices?.find((p: any) => p.currency.toLowerCase() === userCurrency.toLowerCase())?.amount || batch.price
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
    
    fetchCourse();
  }, [courseId, getQuery, getLocationCurrency]); // Added getLocationCurrency to dependencies
  
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
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transform-gpu">
          <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 overflow-hidden">
              <button 
                onClick={() => router.back()}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              <div className="flex items-center overflow-hidden">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {course?.course_title || "Course Details"}
                </h1>
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full hidden sm:inline-block">
                  Course
                </span>
              </div>
              {/* Add Batch Price */}
              {course?.prices && course.prices.length > 0 && (
                <div className="ml-4 hidden sm:flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Batch Price:</span>
                  <span className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                    {course.prices.find(p => p.currency === userCurrency)?.batch?.toLocaleString('en-IN') || '0'}
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
        <main className="flex-grow pt-16 sm:pt-20 md:pt-24 relative z-10">
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
            <div className="container mx-auto px-3 sm:px-4">
              <div className="flex flex-col lg:flex-row gap-5 lg:gap-8">
                {/* Left Column - Course Content */}
                <div className="w-full lg:w-8/12 space-y-4 lg:space-y-8">
                  {/* Course Details */}
                  {course && (
                    <div className="relative z-20">
                      <CourseDetailsPage 
                        courseId={course._id} 
                        initialActiveSection={activeSection}
                      />
                    </div>
                  )}
                </div>
                
                {/* Right Column - Enrollment Details */}
                <div className="w-full lg:w-4/12 mb-8 lg:mb-0">
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
                            meta: {
                              views: 0 // Add default views if needed
                            },
                            features: [
                              "Live interactive sessions",
                              "Certificate of completion",
                              "Lifetime access to recordings",
                              "Hands-on projects & assignments"
                            ]
                          }}
                          categoryInfo={{
                            primaryColor: 'emerald',
                            colorClass: 'text-emerald-700 dark:text-emerald-300',
                            bgClass: 'bg-emerald-50 dark:bg-emerald-900/30',
                            borderClass: 'border-emerald-200 dark:border-emerald-800'
                          }}
                        />
                      </motion.div>
                    )}
                    
                    {/* Mobile Action Button */}
                    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 lg:hidden">
                      <button 
                        onClick={() => {
                          // Handle enrollment action
                          showToast.success("Enrollment feature coming soon!");
                        }} 
                        className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-sm sm:text-base"
                      >
                        Enroll Now
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
};

export default CourseView; 