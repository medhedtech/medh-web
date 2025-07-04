"use client";
import { apiUrls } from "@/apis";
import Preloader from "@/components/shared/others/Preloader";
import usePostQuery from "@/hooks/postQuery.hook";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Calendar, BookOpen, Users, Clock, DollarSign } from "lucide-react";

export default function CoursePreview() {
  const router = useRouter();
  const [courseData, setCourseData] = useState(null);
  const { postQuery, loading } = usePostQuery();

  const formatCourseGrade = (grade) => {
    if (grade === "UG - Graduate - Professionals") {
      return "Professional Grad Diploma";
    }
    return grade;
  };

  useEffect(() => {
    try {
      // Try to get data from localStorage
      const storedData = localStorage.getItem("courseData");
      
      if (!storedData) {
        console.log("No course data found in localStorage");
        return;
      }

      const parsedData = JSON.parse(storedData);
      console.log("Retrieved course data:", parsedData);

      if (!parsedData || Object.keys(parsedData).length === 0) {
        console.log("Parsed data is empty or invalid");
        return;
      }

      setCourseData(parsedData);
    } catch (error) {
      console.error("Error loading course data:", error);
      showToast.error("Error loading course data");
    }
  }, []);

  const handleSubmit = async () => {
    if (!courseData) {
      showToast.error("No course data available to submit");
      return;
    }

    try {
      await postQuery({
        url: apiUrls?.courses?.createCourse,
        postData: courseData,
        onSuccess: () => {
          localStorage.removeItem("courseData");
          showToast.success("Course added successfully!");
          router.push("/dashboards/admin-listofcourse");
        },
        onFail: (error) => {
          console.error("Failed to add course:", error);
          showToast.error("Failed to add course. Please try again.");
        },
      });
    } catch (error) {
      console.error("Error submitting course:", error);
      showToast.error("An unexpected error occurred. Please try again.");
    }
  };

  if (loading) return <Preloader />;

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Course Data Available</h2>
          <p className="text-gray-600 mb-4">Please go back and fill in the course details first.</p>
          <button
            onClick={() => router.push("/dashboards/admin-addcourse")}
            className="bg-customGreen text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Add Course Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">{courseData.course_title}</h1>
            <p className="mt-2 text-gray-600">{courseData.course_description}</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Course Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Course Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">Category</label>
                    <p className="font-medium">{courseData.course_category}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Type</label>
                    <p className="font-medium">{courseData.category_type}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Grade Level</label>
                    <p className="font-medium">{formatCourseGrade(courseData.course_grade)}</p>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Schedule
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">Duration</label>
                    <p className="font-medium">{courseData.course_duration}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Sessions</label>
                    <p className="font-medium">{courseData.no_of_Sessions} sessions</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Effort Required</label>
                    <p className="font-medium">{courseData.efforts_per_Week}</p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Pricing
                </h3>
                <div className="space-y-3">
                  {courseData.prices.map((price, index) => (
                    <div key={index}>
                      <label className="text-sm text-gray-500">{price.currency}</label>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="font-medium">Individual: {price.individual}</p>
                        <p className="font-medium">Batch: {price.batch}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => router.push("/dashboards/admin-add-course")}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Edit Course
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-customGreen text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Submit Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
