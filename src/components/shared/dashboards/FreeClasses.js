"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CourseCard from "./CourseCard";
import { ChevronRight, Sparkles, BookOpen, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { getAllCoursesWithLimits } from "@/apis/course/course";
import Image from "next/image";

const FreeCourses = () => {
  const router = useRouter();
  const [freeCourses, setFreeCourses] = useState([]);
  const { getQuery, loading } = useGetQuery();
  const [limit] = useState(90);
  const [page] = useState(1);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const handleCardClick = (id, isFreeCourse) => {
    const queryString = isFreeCourse ? "?isFreeCourse=true" : "";
    router.push(`/dashboards/my-courses/${id}${queryString}`);
  };

  useEffect(() => {
    const fetchCourses = () => {
      getQuery({
        url: getAllCoursesWithLimits({
          page,
          limit,
          status: "Published",
          filters: {
            isFree: true
          }
        }),
        onSuccess: (res) => {
          const freeCourses = res?.courses?.filter((course) => course.isFree === true) || [];
          setFreeCourses(freeCourses.slice(0, 4));
        },
        onFail: (err) => {
          console.error("Error fetching courses:", err);
        },
      });
    };

    fetchCourses();
  }, [page, limit]);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto py-12 px-6 md:px-10"
    >


      {freeCourses.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {freeCourses.map((course) => (
            <motion.div
              key={course?._id}
              variants={itemVariants}
              className="group relative bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700/50"
              onClick={() => handleCardClick(course?._id, true)}
            >
              {/* Course Image */}
              <div className="relative h-48 w-full overflow-hidden">
                {course?.course_image && (
                  <Image
                    src={course.course_image}
                    alt={course.course_title}
                    layout="fill"
                    objectFit="cover"
                    className="transform group-hover:scale-110 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Free Badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
                    <Sparkles size={14} className="mr-1 text-green-600 dark:text-green-400" />
                    <span className="text-green-600 dark:text-green-400 text-xs font-medium">FREE</span>
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                  {course.course_title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {course.course_description || "No description available"}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen size={16} className="text-gray-500 dark:text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {course.course_duration || "Self-paced"}
                    </span>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline"
                  >
                    Learn More
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-lg p-10 text-center border border-gray-100 dark:border-gray-700/50"
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
              <Tag size={40} className="text-primary-500 dark:text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              No Free Courses Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Check back later for new free courses or explore our premium courses.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FreeCourses;
