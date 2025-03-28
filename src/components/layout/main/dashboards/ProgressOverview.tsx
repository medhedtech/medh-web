"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, BookOpen, Clock, Award, Sparkles } from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CourseProgress {
  course_id: string;
  course_title: string;
  class_type: string;
  progress: number;
  status: string;
  payment_status: string;
  course_image?: string;
}

interface StudentData {
  recentActivity: CourseProgress[];
  progress: {
    averageProgress: number;
    coursesInProgress: number;
    coursesCompleted: number;
  };
}

const ProgressOverview: React.FC = () => {
  const router = useRouter();
  const { getQuery } = useGetQuery();
  const [studentData, setStudentData] = useState<StudentData>({
    recentActivity: [],
    progress: {
      averageProgress: 0,
      coursesInProgress: 0,
      coursesCompleted: 0
    }
  });
  const [studentId, setStudentId] = useState<string | null>(null);
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

  // Fetch student data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const student_id = localStorage.getItem("userId");
      if (student_id) {
        setStudentId(student_id);
      }
    }
  }, []);

  useEffect(() => {
    if (studentId) {
      const fetchStudentData = async () => {
        try {
          await getQuery({
            url: `/enrolled/getCount/${studentId}`,
            onSuccess: (response) => {
              if (response?.data) {
                const { recent_activity, progress } = response.data;
                setStudentData({
                  recentActivity: recent_activity || [],
                  progress: {
                    averageProgress: progress.averageProgress || 0,
                    coursesInProgress: progress.coursesInProgress || 0,
                    coursesCompleted: progress.coursesCompleted || 0
                  }
                });
              }
            },
            onFail: (error) => {
              console.error("Failed to fetch student data:", error);
            }
          });
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      };

      fetchStudentData();
    }
  }, [studentId, getQuery]);

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

    const element = document.getElementById('progress-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  // Helper function to get status info
  const getStatusInfo = (status: string, payment_status: string) => {
    if (payment_status === "pending") {
      return {
        color: "text-amber-500",
        bgColor: "bg-amber-50 dark:bg-amber-500/10",
        borderColor: "border-amber-200 dark:border-amber-500/20",
        icon: Clock,
        label: "Payment Pending"
      };
    }
    if (status === "active") {
      return {
        color: "text-emerald-500",
        bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
        borderColor: "border-emerald-200 dark:border-emerald-500/20",
        icon: Sparkles,
        label: "Active"
      };
    }
    return {
      color: "text-gray-500",
      bgColor: "bg-gray-50 dark:bg-gray-500/10",
      borderColor: "border-gray-200 dark:border-gray-500/20",
      icon: Award,
      label: status
    };
  };

  const handleContinueLearning = (courseId: string) => {
    router.push(`/integrated-lessons/${courseId}`);
  };

  return (
    <section 
      id="progress-section"
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
              Learning Journey
            </span>
            <span className="h-px w-8 bg-primary-500/50"></span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
            Your Progress Overview
          </h2>
          <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            Track your learning journey and stay motivated with your course progress
          </p>
        </motion.div>

        {/* Progress Stats */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl bg-white dark:bg-gray-800/50 backdrop-blur-lg shadow-lg border border-gray-100 dark:border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Average Progress</h3>
              <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                <Award className="w-6 h-6 text-primary-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {studentData.progress.averageProgress}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Overall completion rate</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl bg-white dark:bg-gray-800/50 backdrop-blur-lg shadow-lg border border-gray-100 dark:border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Courses</h3>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                <BookOpen className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {studentData.progress.coursesInProgress}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Courses in progress</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl bg-white dark:bg-gray-800/50 backdrop-blur-lg shadow-lg border border-gray-100 dark:border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Completed</h3>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {studentData.progress.coursesCompleted}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Courses completed</p>
          </motion.div>
        </motion.div>

        {/* Course Cards */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 gap-6"
        >
          {studentData.recentActivity.map((course) => {
            const statusInfo = getStatusInfo(course.status, course.payment_status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <motion.div
                key={course.course_id}
                variants={itemVariants}
                className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800/50 backdrop-blur-lg p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border ${statusInfo.borderColor}`}
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 dark:from-primary-500/10 dark:to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Course Info */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                        <span className={`text-sm font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300">
                        {course.course_title}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Course Type */}
                        <div className={`flex items-center p-3 rounded-lg ${statusInfo.bgColor}`}>
                          <BookOpen className={`w-5 h-5 mr-2 ${statusInfo.color}`} />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Course Type</p>
                            <p className={`text-sm ${statusInfo.color}`}>{course.class_type}</p>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className={`flex items-center p-3 rounded-lg ${statusInfo.bgColor}`}>
                          <Clock className={`w-5 h-5 mr-2 ${statusInfo.color}`} />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Progress</p>
                            <p className={`text-sm ${statusInfo.color}`}>{course.progress}% Complete</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleContinueLearning(course.course_id)}
                      className="flex items-center justify-center px-6 py-3 rounded-xl text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Continue Learning
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Course Progress</span>
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">{course.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {studentData.recentActivity.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="text-center py-12 px-6 rounded-2xl bg-white dark:bg-gray-800/50 backdrop-blur-lg shadow-lg border border-gray-100 dark:border-gray-700/50"
          >
            <div className="mb-6">
              <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-primary-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Start Your Learning Journey
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                Explore our courses and begin your path to success!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/courses')}
                className="inline-flex items-center px-6 py-3 rounded-xl text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Browse Courses
                <ChevronRight className="ml-2 w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default ProgressOverview; 