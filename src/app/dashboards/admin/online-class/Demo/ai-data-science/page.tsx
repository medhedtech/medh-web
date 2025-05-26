"use client";

import React from "react";
import dynamic from 'next/dynamic';
import Link from "next/link";
import { FaArrowLeft, FaRobot } from "react-icons/fa";
import { HiLightningBolt } from "react-icons/hi";

// Import OnlineClass component with dynamic import and ssr disabled
const OnlineClass = dynamic(
  () => import('@/components/layout/main/dashboards/OnlineClass'),
  { ssr: false }
);

export default function DemoAIDataSciencePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Category Header */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboards/admin/online-class/Demo"
              className="w-12 h-12 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl flex items-center justify-center transition-colors duration-200 group"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200" />
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 p-0.5">
                <div className="w-full h-full bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                  <FaRobot className="text-2xl text-gray-700 dark:text-gray-300" />
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Demo Classes - AI and Data Science
                  </h1>
                  <span className="text-2xl">🤖</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  free trial sessions for AI and data science courses
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OnlineClass Component */}
      <OnlineClass 
        categoryFilter="AI and Data Science" 
        sessionTypeFilter="demo"
        pageTitle="Demo Classes - AI and Data Science"
      />
    </div>
  );
} 