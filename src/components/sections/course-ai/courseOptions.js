"use client";
import React from "react";
import CoursesFilter from "../courses/CoursesFilter";
import { Zap } from "lucide-react";

function CourseOptions() {
  return (
    <div
      id="courses-section"
      className="w-full pb-0 sm:pb-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-[50vh]"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 mb-4">
            Course Options in AI with Data Science
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose from our carefully curated selection of AI and Data Science courses designed to help you master the future of technology.
          </p>
        </div>

        <CoursesFilter
          fixedCategory="AI and Data Science"
          hideCategoryFilter={true}
          limit={3}
          emptyStateContent={
            <div className="flex flex-col items-center justify-center min-h-[30vh] text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20 mb-4">
                <Zap size={24} className="text-primary-500 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No courses available yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                We're currently working on bringing you the best AI and Data Science courses. Check back soon!
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
}

export default CourseOptions;
