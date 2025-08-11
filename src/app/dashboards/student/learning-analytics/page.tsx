"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, BarChart3, TrendingUp, Target, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buildAdvancedComponent, getResponsive } from "@/utils/designSystem";

const LearningAnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboards/student" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Learning Analytics
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Advanced insights into your learning journey
            </p>
          </div>
        </div>

        {/* Coming Soon Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16"
        >
          {/* Main Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full mb-6">
              <Brain className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            </div>
          </div>

          {/* Coming Soon Message */}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Coming Soon
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            We're building advanced learning analytics to help you track your progress, 
            identify strengths, and optimize your learning experience.
          </p>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4 mx-auto">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Performance Tracking
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Detailed insights into your course progress and achievement patterns
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Learning Trends
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Visualize your learning patterns and identify improvement opportunities
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-4 mx-auto">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Goal Setting
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set personalized learning goals and track your progress towards them
              </p>
            </motion.div>
          </div>

          {/* Additional Features */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              What to Expect
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Study Time Analytics</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Track your study sessions and optimize your learning schedule</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Skill Assessment</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Evaluate your mastery of different skills and topics</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Progress Reports</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Detailed reports on your learning journey and achievements</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-orange-600 dark:bg-orange-400 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Personalized Insights</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered recommendations to improve your learning</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12"
          >
            <Link
              href="/dashboards/student"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Clock className="w-5 h-5 mr-2" />
              Return to Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LearningAnalyticsPage;
