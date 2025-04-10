"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook";
import { getAllCoursesWithLimits } from "@/apis/course/course";
import CourseCard from "@/components/shared/dashboards/CourseCard";
import { ICourse } from "@/types/course.types";

/**
 * StudentFreeCourses component that displays free courses available to students
 */
const StudentFreeCourses: React.FC = () => {
  const router = useRouter();
  const [freeCourses, setFreeCourses] = useState<ICourse[]>([]);
  const { getQuery } = useGetQuery();
  const [limit] = useState<number>(90);
  const [page] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = () => {
      setLoading(true);
      getQuery({
        url: getAllCoursesWithLimits(page, limit, '', '', '', 'Upcoming', '', '', '', true),
        onSuccess: (res: { courses: ICourse[] }) => {
          // Filter the courses where isFree is true
          const freeCoursesData = res?.courses?.filter(course => course.isFree === true) || [];
          setFreeCourses(freeCoursesData);
          setLoading(false);
        },
        onFail: (err: any) => {
          console.error("Error fetching courses:", err);
          setError("Failed to load free courses. Please try again later.");
          setLoading(false);
        },
      });
    };
  
    fetchCourses();
  }, [page, limit, getQuery]);

  const handleCardClick = (id: string) => {
    router.push(`/course-details/${id}`);
  };

  const handleBackClick = () => {
    router.push("/dashboards/student");
  };

  return (
    <div className="mx-auto p-6 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackClick}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">Free Courses</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-pulse text-primary-500">Loading free courses...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : freeCourses.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-300">No free courses are currently available. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {freeCourses.map((course) => (
            <CourseCard
              key={course._id}
              {...course}
              onClick={() => handleCardClick(course._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentFreeCourses; 