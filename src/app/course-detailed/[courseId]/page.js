"use client"
import React, { useEffect, useState } from "react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import CourseEducation from "@/components/sections/course-detailed/courseEducation";
import AboutProgram from "@/components/sections/course-detailed/aboutProgram";
import CourseFaq from "@/components/sections/course-detailed/courseFaq";
import CourseCertificate from "@/components/sections/course-detailed/courseCertificate";
import CourseRelated from "@/components/sections/course-detailed/courseRelated";
import ThemeController from "@/components/shared/others/ThemeController";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";

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
    
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [courseId]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await getQuery({
        url: `${apiUrls?.courses?.getCourseById}/${courseId}`,
        onSuccess: (data) => {
          // Add animation delay for smoother transition
          setTimeout(() => {
            setCategoryName(data?.category || "");
            setCourseDetails(data);
            setLoading(false);
          }, 300);
          
          // Set page title dynamically
          document.title = `${data?.title || 'Course Details'} | MEDH Upskill`;
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
          <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">Loading course details...</p>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-xl border border-red-100 dark:border-red-800/30 shadow-lg">
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-4">Unable to Load Course</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">{error}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {retryCount > 0 ? `Retry attempt: ${retryCount}` : "Please try again or contact support if the problem persists."}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={handleRetry}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors shadow-md flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
              <a 
                href="/courses"
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
              >
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
      {/* Content sections with animation on load */}
      <div className="animate-fadeIn">
        <CourseEducation courseId={courseId} courseDetails={courseDetails} />
        <AboutProgram courseId={courseId} />
        <CourseFaq courseId={courseId} />
        <CourseRelated 
          categoryName={categoryName} 
          courseId={courseId} 
          relatedCourses={courseDetails?.related_courses || []} 
        />
        <CourseCertificate />
        <ThemeController />
      </div>
    </PageWrapper>
  );
}

export default CourseDetailedPage;
