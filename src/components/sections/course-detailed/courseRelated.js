"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "../courses/CourseCard";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import { BookOpen, Layers } from "lucide-react";

function CourseRelated({ categoryName, courseId, relatedCourses }) {
  const [courses, setCourses] = useState([]);
  const { getQuery } = useGetQuery();
  const [limit] = useState(3);
  const [page] = useState(1);
  const { postQuery } = usePostQuery();

  useEffect(() => {
    const fetchCourses = () => {
      if (!relatedCourses || relatedCourses.length === 0) {
        console.error("Related course IDs are missing.");
        return;
      }

      postQuery({
        url: apiUrls?.courses?.getAllRelatedCources,
        postData: {
          course_ids: relatedCourses,
        },
        onSuccess: (res) => {
          console.log("Related courses response:", res);
          setCourses(res?.courses || []);
        },
        onFail: (err) => {
          console.error("Error fetching related courses:", err);
        },
      });
    };

    fetchCourses();
  }, [relatedCourses]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 bg-white dark:bg-[#050622]">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-4">
        <div className="p-5">
          <div className="flex items-center mb-4">
            <div className="w-1.5 h-6 bg-green-500 rounded-sm mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-50">Related Courses</h2>
            <Layers className="ml-2 text-gray-400 w-5 h-5" />
          </div>
          
          <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-800/90 dark:to-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-md overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 dark:bg-green-900/10 rounded-full -mr-16 -mt-16 z-0"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-full -ml-12 -mb-12 z-0"></div>
            
            <div className="relative z-10">
              {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {courses.map((course, index) => (
                    <CourseCard key={index} course={course} className="w-full" />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-700 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                      <BookOpen size={24} />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">No Related Courses</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We couldn't find any related courses for this category at the moment.
                  </p>
                </div>
              )}
              
              {courses.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    Explore more courses to enhance your skills
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseRelated;
