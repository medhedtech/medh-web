"use client";
import React, { useEffect, useState } from "react";
import EnrollCoursesCard from "./EnrollCoursesCard";
import { useRouter } from "next/navigation";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronRight, Loader } from "lucide-react";

const EnrollCourses = () => {
  const router = useRouter();
  const [enrollCourses, setEnrollCourses] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const { getQuery, loading } = useGetQuery();
  const [isHovered, setIsHovered] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const handleCardClick = (id) => {
    router.push(`/dashboards/my-courses/${id}`);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setStudentId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (studentId) {
      getQuery({
        url: `${apiUrls?.EnrollCourse?.getEnrolledCoursesByStudentId}/${studentId}`,
        onSuccess: (data) => {
          const courses = data
            .map((enrollment) => enrollment.course_id)
            .filter((course) => course)
            .slice(0, 4);
          setEnrollCourses(courses);
        },
        onFail: (error) => {
          console.error("Failed to fetch enrolled courses:", error);
        },
      });
    }
  }, [studentId]);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto mt-[-40px] p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
            <BookOpen className="w-6 h-6 text-primary-500 dark:text-primary-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
            Enrolled Courses
          </h2>
        </motion.div>

        <motion.a
          href="/dashboards/enrolled-courses"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </motion.a>
      </div>

      {loading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-3"
          >
            <Loader className="w-6 h-6 text-primary-500" />
            <span className="text-gray-600 dark:text-gray-400">Loading your courses...</span>
          </motion.div>
        </div>
      ) : enrollCourses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl"
        >
          <div className="p-4 rounded-full bg-primary-50 dark:bg-primary-900/20 mb-4">
            <BookOpen className="w-8 h-8 text-primary-500 dark:text-primary-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Enrolled Courses Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            Start your learning journey by enrolling in our courses. We have a wide range of options to choose from.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/courses')}
            className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            Browse Courses
          </motion.button>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {enrollCourses.map((course, index) => (
              <motion.div
                key={course._id}
                variants={cardVariants}
                onHoverStart={() => setIsHovered(course._id)}
                onHoverEnd={() => setIsHovered(null)}
                layout
              >
                <EnrollCoursesCard
                  title={course.course_title}
                  image={course.course_image}
                  isLive={course.course_tag === "Live"}
                  progress={40}
                  onClick={() => handleCardClick(course._id)}
                  isHovered={isHovered === course._id}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EnrollCourses;
