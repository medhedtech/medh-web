"use client";

import { useState } from "react";
import Link from "next/link";

export default function CreateCoursePage() {
  const [courseType, setCourseType] = useState<string>("");

  const handleCourseTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCourseType(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/dashboards/admin/courses" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin Dashboard
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Create New Course</h1>
            <p className="mt-1 text-indigo-100">Select the type of course you want to create</p>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <label htmlFor="courseType" className="block mb-2 text-lg font-medium text-gray-700">
                Course Type
              </label>
              <select
                id="courseType"
                value={courseType}
                onChange={handleCourseTypeChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all"
                required
              >
                <option value="">Select a course type</option>
                <option value="blended">Blended Course</option>
                <option value="live">Live Course</option>
                <option value="free">Free Course</option>
              </select>
              <p className="text-sm text-gray-500 mt-2">
                This will determine the specific fields needed for the course.
              </p>
            </div>

            {courseType && (
              <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Course Type: {courseType.charAt(0).toUpperCase() + courseType.slice(1)}</h2>
                
                <div className="mb-6">
                  {courseType === "blended" && (
                    <p className="text-gray-600">Blended courses combine self-paced learning with instructor support. They include curriculum modules, doubt sessions, and certification options.</p>
                  )}
                  {courseType === "live" && (
                    <p className="text-gray-600">Live courses are scheduled instructor-led sessions. They include real-time interaction, fixed schedules, and instructor assignments.</p>
                  )}
                  {courseType === "free" && (
                    <p className="text-gray-600">Free courses are open access learning materials. They include lessons, resources, and optional certification.</p>
                  )}
                </div>
                
                <Link
                  href={`/dashboards/admin/courses/create/${courseType}`}
                  className="inline-flex items-center justify-center px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors shadow-sm"
                >
                  Continue to {courseType.charAt(0).toUpperCase() + courseType.slice(1)} Course Form
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 