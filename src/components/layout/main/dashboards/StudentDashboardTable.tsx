"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  Calendar, 
  Bell, 
  BarChart3, 
  Gift
} from "lucide-react";

interface DashboardTableProps {
  userName?: string;
}

const StudentDashboardTable: React.FC<DashboardTableProps> = ({ userName }) => {
  const router = useRouter();
  
  // Get user name from localStorage if not provided
  const storedUserName = localStorage.getItem("userName") || "";
  const storedFullName = localStorage.getItem("fullName") || "";
  const storedName = storedUserName || storedFullName;
  const displayName = userName || storedName || "Student";

  const dashboardItems = [
    {
      name: "Enrolled Courses",
      icon: <BookOpen className="w-4 h-4" />,
      path: "/dashboards/student/enrolled-courses",
      details: "All / Live / Blended / Corporate / School Institute"
    },
    {
      name: "Upcoming Classes",
      icon: <Calendar className="w-4 h-4" />,
      path: "/dashboards/student/upcoming-classes",
      details: "Course / Timings / Session Count / Online Link"
    },
    {
      name: "Recent Announcements",
      icon: <Bell className="w-4 h-4" />,
      path: "/dashboards/student/announcements"
    },
    {
      name: "Progress Overview",
      icon: <BarChart3 className="w-4 h-4" />,
      path: "/dashboards/student/progress"
    },
    {
      name: "Free Courses",
      icon: <Gift className="w-4 h-4" />,
      path: "/dashboards/student/free-courses",
      details: "View / Progress"
    }
  ];



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {displayName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your courses, track progress, and update your profile
          </p>
        </div>

        {/* Dashboard Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Column - Main Categories */}
            <div className="lg:col-span-1">
              <div className="p-6 border-r border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Dashboard
                </h2>
                <div className="space-y-4">
                  {dashboardItems.map((item, index) => (
                    <div key={index} className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="text-gray-500 dark:text-gray-400">
                          {item.icon}
                        </div>
                        <span className="text-gray-900 dark:text-white font-medium">
                          &gt; {item.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Details/Sub-categories */}
            <div className="lg:col-span-1">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Details
                </h2>
                <div className="space-y-4">
                  {dashboardItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="text-gray-500 dark:text-gray-400">
                          {item.icon}
                        </div>
                        <div>
                          {item.details ? (
                            <span className="text-gray-900 dark:text-white font-medium">
                              {item.details}
                            </span>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500 italic">
                              Click to view
                            </span>
                          )}
                        </div>
                      </div>
                      <Link 
                        href={item.path}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming Classes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">78%</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardTable;
