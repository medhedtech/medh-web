"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaRobot, FaPlus, FaUsers, FaCalendarAlt, FaClock, FaUser, FaChartLine, FaBookOpen, FaVideo, FaMicrophone, FaCertificate, FaStar } from "react-icons/fa";
import OnlineClassManagementPage from "@/components/Dashboard/admin/online-class/OnlineClassManagementPage";

interface ICourseStats {
  totalBatches: number;
  activeBatches: number;
  totalStudents: number;
  totalInstructors: number;
  upcomingSessions: number;
  completedSessions: number;
  averageRating: number;
  totalReviews: number;
}

export default function ManageAIDataSciencePage() {
  const router = useRouter();
  const [courseStats, setCourseStats] = useState<ICourseStats>({
    totalBatches: 0,
    activeBatches: 0,
    totalStudents: 0,
    totalInstructors: 0,
    upcomingSessions: 0,
    completedSessions: 0,
    averageRating: 4.8,
    totalReviews: 156
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading course statistics
    const loadCourseStats = async () => {
      setIsLoading(true);
      // In a real implementation, you would fetch this data from your API
      setTimeout(() => {
        setCourseStats({
          totalBatches: 12,
          activeBatches: 8,
          totalStudents: 245,
          totalInstructors: 6,
          upcomingSessions: 15,
          completedSessions: 89,
          averageRating: 4.8,
          totalReviews: 156
        });
        setIsLoading(false);
      }, 1000);
    };

    loadCourseStats();
  }, []);

  const handleCreateLiveSession = () => {
    router.push('/dashboards/admin/online-class/live/ai-data-science/create-session');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Enhanced Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link
                href="/dashboards/admin/online-class/live"
                className="group w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              
              <div className="flex items-center gap-6">
                <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 p-1 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-full h-full bg-white dark:bg-gray-800 rounded-3xl flex items-center justify-center">
                    <FaRobot className="text-3xl text-gray-700 dark:text-gray-300" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
                </div>
                
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                      AI and Data Science
                    </h1>
                    <span className="text-3xl animate-bounce">🤖</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Explore the future of technology with machine learning, artificial intelligence, and data analytics
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">Live System</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-500 text-sm" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {courseStats.averageRating} ({courseStats.totalReviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleCreateLiveSession}
                className="group px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2"
              >
                <FaPlus className="text-lg" />
                Create Live Session
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Statistics */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Batches */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Batches</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {isLoading ? "..." : courseStats.totalBatches}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <FaUsers className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {courseStats.activeBatches} active
              </span>
            </div>
          </div>

          {/* Total Students */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {isLoading ? "..." : courseStats.totalStudents}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <FaUser className="text-green-600 dark:text-green-400 text-xl" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Enrolled across all batches
              </span>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming Sessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {isLoading ? "..." : courseStats.upcomingSessions}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <FaCalendarAlt className="text-orange-600 dark:text-orange-400 text-xl" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Next 7 days
              </span>
            </div>
          </div>

          {/* Course Rating */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Course Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {isLoading ? "..." : courseStats.averageRating}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                <FaStar className="text-yellow-600 dark:text-yellow-400 text-xl" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {courseStats.totalReviews} reviews
              </span>
            </div>
          </div>
        </div>

        {/* Course Features */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-lg hover:shadow-xl transition-all duration-300 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
            <FaBookOpen className="text-blue-600 dark:text-blue-400" />
            Course Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaVideo className="text-white text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Live Interactive Sessions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Real-time video conferencing with expert instructors
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaMicrophone className="text-white text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Voice & Chat Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Multiple communication channels for better learning
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaCertificate className="text-white text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Certification</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Industry-recognized certificates upon completion
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200/50 dark:border-orange-700/50">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaChartLine className="text-white text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Progress Tracking</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Detailed analytics and performance monitoring
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl border border-indigo-200/50 dark:border-indigo-700/50">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaClock className="text-white text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Flexible Scheduling</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Multiple time slots to fit your schedule
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl border border-teal-200/50 dark:border-teal-700/50">
              <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaUsers className="text-white text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Group & Individual</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Both group classes and 1:1 personalized sessions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Original Online Class Management Component */}
      <OnlineClassManagementPage
        courseCategory="AI and Data Science"
        pageTitle="Manage AI & Data Science Classes"
        pageDescription="manage instructors and class types for AI and data science"
        icon={FaRobot}
        gradientColors="bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500"
        backUrl="/dashboards/admin/online-class/live"
      />
    </div>
  );
} 