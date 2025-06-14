"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const BlogsLoadingSkeleton: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const shimmer = {
    hidden: { opacity: 0.3 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  return (
    <div className={`min-h-screen p-6 transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <motion.div 
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className={`h-8 w-64 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            />
            <motion.div 
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className={`h-4 w-96 mt-2 rounded ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            />
          </div>
          <div className="flex items-center gap-3">
            <motion.div 
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className={`h-10 w-24 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            />
            <motion.div 
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className={`h-10 w-32 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            />
          </div>
        </div>

        {/* Analytics Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className={`p-6 rounded-xl border ${
                isDark 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white/80 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className={`h-4 w-20 rounded ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`} />
                  <div className={`h-8 w-16 rounded ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`} />
                </div>
                <div className={`h-8 w-8 rounded ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className={`border rounded-xl shadow-sm overflow-hidden backdrop-blur-xl ${
          isDark 
            ? 'bg-white/5 border-white/10' 
            : 'bg-white/80 border-gray-200'
        }`}>
          {/* Toolbar Skeleton */}
          <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-1 items-center gap-4">
                <motion.div 
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                  className={`h-10 w-80 rounded-lg ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                />
                <motion.div 
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                  className={`h-10 w-24 rounded-lg ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="p-6">
            {/* Table Header */}
            <div className={`border-b pb-4 mb-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="grid grid-cols-9 gap-4">
                {Array.from({ length: 9 }).map((_, index) => (
                  <motion.div
                    key={index}
                    variants={shimmer}
                    initial="hidden"
                    animate="visible"
                    className={`h-4 rounded ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Table Rows */}
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, rowIndex) => (
                <motion.div
                  key={rowIndex}
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-9 gap-4 items-center"
                >
                  {/* Checkbox */}
                  <div className={`h-5 w-5 rounded ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`} />
                  
                  {/* Image */}
                  <div className={`h-12 w-12 rounded-lg ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`} />
                  
                  {/* Title */}
                  <div className="space-y-2">
                    <div className={`h-4 w-32 rounded ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`} />
                    <div className={`h-3 w-24 rounded ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`} />
                  </div>
                  
                  {/* Author */}
                  <div className={`h-4 w-20 rounded ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`} />
                  
                  {/* Status */}
                  <div className={`h-6 w-16 rounded-full ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`} />
                  
                  {/* Featured */}
                  <div className={`h-4 w-4 rounded ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`} />
                  
                  {/* Views */}
                  <div className={`h-4 w-12 rounded ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`} />
                  
                  {/* Likes */}
                  <div className={`h-4 w-12 rounded ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`} />
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 3 }).map((_, actionIndex) => (
                      <div
                        key={actionIndex}
                        className={`h-8 w-8 rounded ${
                          isDark ? 'bg-gray-700' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className={`mt-6 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <motion.div 
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                  className={`h-4 w-48 rounded ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                />
                <div className="flex items-center gap-2">
                  <motion.div 
                    variants={shimmer}
                    initial="hidden"
                    animate="visible"
                    className={`h-8 w-20 rounded ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}
                  />
                  <motion.div 
                    variants={shimmer}
                    initial="hidden"
                    animate="visible"
                    className={`h-8 w-24 rounded ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}
                  />
                  <motion.div 
                    variants={shimmer}
                    initial="hidden"
                    animate="visible"
                    className={`h-8 w-16 rounded ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsLoadingSkeleton; 