"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import useGetQuery from "@/hooks/getQuery.hook";
import { Zap, BookOpen, Clock, AlertCircle, Loader2 } from "lucide-react";

const StudentProgressOverview = () => {
  const router = useRouter();
  const { getQuery } = useGetQuery();
  const [isLoading, setIsLoading] = useState(true);
  const [studentData, setStudentData] = useState({
    recentActivity: [],
    counts: {
      total: 0,
      active: 0,
      completed: 0,
      byCourseType: {
        live: 0,
        blended: 0,
        selfPaced: 0
      }
    },
    progress: {
      averageProgress: 0,
      coursesInProgress: 0,
      coursesCompleted: 0
    }
  });
  const [studentId, setStudentId] = useState(null);

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
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (studentId) {
      const fetchStudentData = async () => {
        try {
          setIsLoading(true);
          await getQuery({
            url: `/enrolled/getCount/${studentId}`,
            onSuccess: (response) => {
              if (response?.data) {
                setStudentData({
                  recentActivity: response.data.recent_activity || [],
                  counts: response.data.counts || {
                    total: 0,
                    active: 0,
                    completed: 0,
                    byCourseType: {
                      live: 0,
                      blended: 0,
                      selfPaced: 0
                    }
                  },
                  progress: response.data.progress || {
                    averageProgress: 0,
                    coursesInProgress: 0,
                    coursesCompleted: 0
                  }
                });
              }
              setIsLoading(false);
            },
            onFail: (error) => {
              console.error("Failed to fetch student data:", error);
              setIsLoading(false);
            }
          });
        } catch (error) {
          console.error("Error fetching student data:", error);
          setIsLoading(false);
        }
      };

      fetchStudentData();
    }
  }, [studentId, getQuery]);

  // Helper function to get status color
  const getStatusColor = (status, payment_status) => {
    if (payment_status === "pending") return "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
    if (status === "active") return "text-green-500 bg-green-50 dark:bg-green-900/20";
    return "text-gray-500 bg-gray-50 dark:bg-gray-900/20";
  };

  // Helper function to get course type icon
  const getCourseTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "live courses":
        return <Zap className="w-4 h-4" />;
      case "blended courses":
        return <BookOpen className="w-4 h-4" />;
      case "self paced":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 md:px-10"
    >
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push("/dashboards/student")}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <FaArrowLeft className="text-gray-700 dark:text-white" size={20} />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Course Progress Overview
          </h1>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">Total Courses</h3>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{studentData?.counts?.total || 0}</p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">Active Courses</h3>
            <p className="text-3xl font-bold text-green-500">{studentData?.counts?.active || 0}</p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">Average Progress</h3>
            <p className="text-3xl font-bold text-blue-500">{studentData?.progress?.averageProgress || 0}%</p>
          </motion.div>
        </div>
      </div>

      {/* Course List */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {studentData?.recentActivity?.map((course) => (
          <motion.div
            key={course.course_id}
            variants={itemVariants}
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden"
          >
            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-100 dark:bg-gray-700">
              <div
                className="h-full bg-primary-500 dark:bg-primary-400 transition-all duration-500"
                style={{ width: `${course?.progress || 0}%` }}
              />
            </div>

            <div className="p-6">
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300">
                  {course?.course_title || 'Untitled Course'}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Course Type</p>
                    <div className="flex items-center gap-2">
                      {getCourseTypeIcon(course?.class_type)}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {course?.class_type || 'Unknown Type'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
                    <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      {course?.progress || 0}% Complete
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(course?.status, course?.payment_status)}`}>
                      {course?.payment_status === "pending" ? "Payment Pending" : course?.status || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {(!studentData?.recentActivity || studentData.recentActivity.length === 0) && !isLoading && (
        <motion.div
          variants={itemVariants}
          className="text-center py-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Courses Found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start exploring courses to begin your learning journey!
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StudentProgressOverview;
