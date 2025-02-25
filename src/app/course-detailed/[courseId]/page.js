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
  const { getQuery } = useGetQuery();

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      await getQuery({
        url: `${apiUrls?.courses?.getCourseById}/${courseId}`,
        onSuccess: (data) => {
          console.log("Course details fetched successfully:", data);
          setCategoryName(data?.category || "");
          setCourseDetails(data);
          setLoading(false);
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

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Preloader />
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-xl border border-red-100 dark:border-red-800/30">
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-4">Error Loading Course</h2>
            <p className="text-gray-700 dark:text-gray-300">{error}</p>
            <button 
              onClick={fetchCourseDetails}
              className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
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
    </PageWrapper>
  );
}

export default CourseDetailedPage;
