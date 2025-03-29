"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, BookOpen, Tag, Clock } from "lucide-react";
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
    <section 
      id="free-courses-section"
      className="py-12 md:py-16 relative overflow-hidden"
    >
      {/* Modern background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-25 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>

      <motion.div
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        {/* Header Section */}
        <motion.div
          variants={containerVariants}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <div className="inline-flex items-center justify-center space-x-1 mb-4">
            <span className="h-px w-8 bg-primary-500/50"></span>
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400 tracking-wider uppercase">
              Free Learning
            </span>
            <span className="h-px w-8 bg-primary-500/50"></span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
            Featured Free Courses
          </h2>
          <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            Start your learning journey with our curated free courses
          </p>
        </motion.div>

        {/* Course Cards */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 gap-6"
        >
          {freeCourses.length > 0 ? (
            freeCourses.map((course) => (
              <motion.div
                key={course._id}
                variants={itemVariants}
                onClick={() => handleCardClick(course._id)}
                className="group relative bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700/50 cursor-pointer"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Course Image */}
                  <div className="relative h-48 md:h-auto md:w-48 lg:w-64">
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
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
                        <Sparkles className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" />
                        <span className="text-green-600 dark:text-green-400 text-xs font-medium">FREE</span>
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                          {course.course_title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                          {course.course_description || "No description available"}
                        </p>

                        {/* Course Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                            <BookOpen className="w-5 h-5 mr-2 text-primary-500" />
                            <span className="text-sm">Self-paced Learning</span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                            <Clock className="w-5 h-5 mr-2 text-primary-500" />
                            <span className="text-sm">{course.course_duration || "Flexible"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        Start Learning
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              variants={itemVariants}
              className="text-center py-12 px-6 rounded-2xl bg-white dark:bg-gray-800/50 backdrop-blur-lg shadow-lg border border-gray-100 dark:border-gray-700/50"
            >
              <div className="mb-6">
                <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4">
                  <Tag className="w-10 h-10 text-primary-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Coming Soon
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  We're preparing some amazing free courses for you. Check back soon!
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FreeClasses; 