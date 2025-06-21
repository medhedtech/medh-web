"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, BookOpen, Tag, Clock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import Image from "next/image";
import { getAllCoursesWithLimits } from "@/apis/course/course";

interface Course {
  _id: string;
  course_title: string;
  course_description: string;
  course_duration: string;
  course_image: string;
  isFree: boolean;
}

const FreeClasses: React.FC = () => {
  const router = useRouter();
  const [freeCourses, setFreeCourses] = useState<Course[]>([]);
  const { getQuery, loading } = useGetQuery();
  const [limit] = useState(90);
  const [page] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  const handleCardClick = (id: string) => {
    router.push(`/dashboards/my-courses/${id}?isFreeCourse=true`);
  };

  // Intersection Observer effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('free-courses-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  useEffect(() => {
    const fetchCourses = () => {
      getQuery({
        url: getAllCoursesWithLimits({
          page,
          limit,
          search: "",
          status: "Published",
          filters: {
            isFree: true
          }
        }),
        onSuccess: (res) => {
          const freeCourses = res?.courses?.filter((course: Course) => course.isFree === true) || [];
          setFreeCourses(freeCourses.slice(0, 4));
        },
        onFail: (err) => {
          console.error("Error fetching courses:", err);
        },
      });
    };

    fetchCourses();
  }, [page, limit, getQuery]);

  return (
    <div id="free-courses-section" className="p-6">
      {/* Course Cards */}
      <motion.div 
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {loading ? (
          // Loading skeletons
          Array(4).fill(null).map((_, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm overflow-hidden flex flex-col animate-pulse"
            >
              <div className="h-40 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
                <div className="mt-auto h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </motion.div>
          ))
        ) : freeCourses.length > 0 ? (
          freeCourses.map((course) => (
            <motion.div
              key={course._id}
              variants={itemVariants}
              onClick={() => handleCardClick(course._id)}
              className="group bg-white dark:bg-gray-800/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col cursor-pointer border border-gray-100 dark:border-gray-700/50"
            >
              {/* Course Image */}
              <div className="relative h-40 overflow-hidden">
                {course?.course_image && (
                  <Image
                    src={course.course_image}
                    alt={course.course_title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Free Badge */}
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 text-xs font-medium">
                    <Sparkles className="w-3 h-3 mr-1" />
                    FREE
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {course.course_title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {course.course_description || "No description available"}
                </p>

                {/* Course Details */}
                <div className="flex items-center mt-auto mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-1 text-primary-500" />
                  <span>{course.course_duration || "Self-paced"}</span>
                </div>

                {/* Action Button */}
                <button
                  className="w-full px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/30 font-medium rounded-lg transition-colors duration-300 flex items-center justify-center gap-1"
                >
                  Start Learning
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div 
            variants={itemVariants}
            className="text-center py-8 px-6 rounded-xl bg-white dark:bg-gray-800/50 shadow-sm border border-gray-100 dark:border-gray-700/50 col-span-full"
          >
            <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-primary-500/70" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              We're preparing some amazing free courses for you. Check back soon!
            </p>
            <button onClick={() => router.push('/courses')} className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/30 font-medium rounded-lg transition-colors duration-300">
              Browse Paid Courses
              <ArrowRight className="ml-1 w-4 h-4" />
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default FreeClasses; 