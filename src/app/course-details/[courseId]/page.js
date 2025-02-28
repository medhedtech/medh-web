"use client"
import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import Preloader from "@/components/shared/others/Preloader";
import ThemeController from "@/components/shared/others/ThemeController";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { RefreshCw, ArrowLeft } from 'lucide-react';

// Dynamically import components with loading fallback
const CourseEducation = dynamic(
  () => import("@/components/sections/course-detailed/courseEducation"),
  { loading: () => <Preloader /> }
);

const AboutProgram = dynamic(
  () => import("@/components/sections/course-detailed/aboutProgram"),
  { loading: () => <Preloader /> }
);

const CourseFaq = dynamic(
  () => import("@/components/sections/course-detailed/courseFaq"),
  { loading: () => <Preloader /> }
);

const CourseCertificate = dynamic(
  () => import("@/components/sections/course-detailed/courseCertificate"),
  { loading: () => <Preloader /> }
);

const CourseRelated = dynamic(
  () => import("@/components/sections/course-detailed/courseRelated"),
  { loading: () => <Preloader /> }
);

function CourseDetailedPage({ params }) {
  const { courseId } = params;
  const [categoryName, setCategoryName] = useState("");
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const { getQuery } = useGetQuery();

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
    
    // Smooth scroll to top
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth'
    });
  }, [courseId]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await getQuery({
        url: `${apiUrls?.courses?.getCourseById}/${courseId}`,
        onSuccess: (data) => {
          setCategoryName(data?.category || "");
          setCourseDetails(data);
          setLoading(false);
          
          // Set page title and meta description
          document.title = `${data?.title || 'Course Details'} | MEDH Upskill`;
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', data?.description || 'Course details on MEDH Upskill platform');
          }
        },
        onFail: (err) => {
          console.error("Error fetching course details:", err);
          setError("Failed to load course details. Please try again later.");
          setLoading(false);
        },
      });
    } catch (error) {
      console.error("Error in fetching course details:", error);
      setError("An unexpected error occurred. Please try again later.");
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchCourseDetails();
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <Preloader />
          <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">
            Loading course details...
          </p>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Please wait while we fetch the course information
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-xl border border-red-100 dark:border-red-800/30 shadow-lg">
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-4">
              Unable to Load Course
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">{error}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {retryCount > 0 
                ? `Retry attempt: ${retryCount}` 
                : "Please try again or contact support if the problem persists."}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={handleRetry}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-200 shadow-md flex items-center justify-center"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Try Again
              </button>
              <a 
                href="/courses"
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to All Courses
              </a>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header Section with proper spacing */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          </div>
        {/* Main Content with proper spacing */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {courseDetails && (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <CourseEducation courseId={courseId} courseDetails={courseDetails} />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <AboutProgram courseId={courseId} />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <CourseFaq courseId={courseId} />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <CourseRelated 
                    categoryName={categoryName} 
                    courseId={courseId} 
                    relatedCourses={courseDetails?.related_courses || []} 
                  />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <CourseCertificate />
                </div>
              </>
            )}
            <div className="fixed bottom-6 right-6">
              <ThemeController />
            </div>
          </div>
        </main>
      </div>
    </PageWrapper>
  );
}

export default CourseDetailedPage;
