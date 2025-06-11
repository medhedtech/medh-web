"use client";
import React from "react";

const PendingContent = ({ courses = [] }) => {
  return (
    <div className="w-full">
      {courses && courses.length > 0 ? (
        courses.map((course) => (
          <div
            key={course.id}
            className="p-4 mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {course.title || "Course Title"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {course.description || "Course description will appear here."}
            </p>
            <div className="mt-3">
              <span className="inline-block px-3 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                Pending Approval
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No pending courses found.
          </p>
        </div>
      )}
    </div>
  );
};

export default PendingContent; 