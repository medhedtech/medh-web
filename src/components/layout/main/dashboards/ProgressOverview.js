"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Zap } from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook";
import Image from "next/image";

const ProgressOverview = () => {
  const { getQuery } = useGetQuery();
  const [studentData, setStudentData] = useState({
    recentActivity: [],
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
        staggerChildren: 0.2
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
            url: `/enroll/getCount/${studentId}`,
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

  // Helper function to get status color
  const getStatusColor = (status, payment_status) => {
    if (payment_status === "pending") return "text-yellow-500";
    if (status === "active") return "text-green-500";
    return "text-gray-500";
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full py-8 px-6 md:px-10"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-2">
            <Zap size={14} className="mr-1" />
            Course Progress
          </span>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Progress Overview
          </h2>
        </div>
        
        <motion.a
          href="/dashboards/student-progress-overview"
          className="group inline-flex items-center px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/20 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View All
          <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
        </motion.a>
      </div>

      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 gap-6"
      >
        {studentData.recentActivity.map((course) => (
          <motion.div
            key={course.course_id}
            variants={itemVariants}
            className="group relative bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700/50"
          >
            {/* Progress indicator background */}
            <div 
              className="absolute bottom-0 left-0 h-1 bg-primary-200 dark:bg-primary-800/30 w-full"
            >
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 transition-all duration-700"
                style={{ width: `${course.progress || 0}%` }}
              />
            </div>

            <div className="p-6 relative">
              <div className="flex items-start gap-4">
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300">
                    {course.course_title}
                  </h3>
                  
                  {/* Course details */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Course Type</span>
                      <span className="font-medium text-primary-600 dark:text-primary-400">
                        {course.class_type}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-primary-600 dark:text-primary-400">
                        {course.progress || 0}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Status</span>
                      <span className={`font-medium ${getStatusColor(course.status, course.payment_status)}`}>
                        {course.payment_status === "pending" ? "Payment Pending" : course.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {studentData.recentActivity.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="text-center py-8"
        >
          <p className="text-gray-600 dark:text-gray-400">
            No recent activity found. Start exploring courses to begin your learning journey!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProgressOverview;
