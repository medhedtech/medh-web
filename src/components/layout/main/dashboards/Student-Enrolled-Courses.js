"use client";
import React, { useEffect, useState } from "react";
import EnrollCoursesCard from "./EnrollCoursesCard";
import { useRouter } from "next/navigation";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Loader2, Search } from "lucide-react";
import { toast } from "react-toastify";

const StudentEnrollCourses = () => {
  const router = useRouter();
  const [enrollCourses, setEnrollCourses] = useState([]);
  const { getQuery, loading } = useGetQuery();
  const [studentId, setStudentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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
            .filter((course) => course);
          setEnrollCourses(courses);
        },
        onFail: (error) => {
          console.error("Failed to fetch enrolled courses:", error);
          toast.error("Failed to fetch enrolled courses. Please try again.");
        },
      });
    }
  }, [studentId]);

  const handleCardClick = (id) => {
    router.push(`/dashboards/my-courses/${id}`);
  };

  const filteredCourses = enrollCourses.filter(course => 
    course.course_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto p-8 mt-[-40px]"
    >
      <div className="flex flex-col space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.button
              onClick={() => router.push("/dashboards/my-courses")}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                <BookOpen className="w-6 h-6 text-primary-500 dark:text-primary-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                Enrolled Courses
              </h2>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            className="relative max-w-md w-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
            />
          </motion.div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-3"
            >
              <Loader2 className="w-6 h-6 text-primary-500" />
              <span className="text-gray-600 dark:text-gray-400">Loading your courses...</span>
            </motion.div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl"
          >
            <div className="p-4 rounded-full bg-primary-50 dark:bg-primary-900/20 mb-4">
              <BookOpen className="w-8 h-8 text-primary-500 dark:text-primary-400" />
            </div>
            {searchTerm ? (
              <>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No courses found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search term to find what you're looking for.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Enrolled Courses Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start your learning journey by enrolling in our courses.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/courses')}
                  className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                  Browse Courses
                </motion.button>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course) => (
                <motion.div
                  key={course._id}
                  variants={cardVariants}
                  layout
                  onHoverStart={() => setIsHovered(course._id)}
                  onHoverEnd={() => setIsHovered(null)}
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
      </div>
    </motion.div>
  );
};

export default StudentEnrollCourses;
