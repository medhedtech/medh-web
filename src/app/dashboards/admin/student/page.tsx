"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ProtectedPage from "@/app/protectedRoutes";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import { UserCheck, UserPlus, Users, ArrowLeft, UsersRound } from "lucide-react";
import Link from "next/link";

/**
 * AdminStudentPage - Index page for admin student management
 */
const AdminStudentPage = () => {
  const router = useRouter();

  const managementOptions = [
    {
      title: "View All Students",
      description: "Browse, search, and manage all enrolled students",
      icon: <Users className="w-10 h-10 text-blue-500" />,
      path: "/dashboards/admin-studentmange",
      color: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Add New Student",
      description: "Register a new student to the platform",
      icon: <UserPlus className="w-10 h-10 text-green-500" />,
      path: "/dashboards/admin-studentmange?action=add",
      color: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Student Profiles",
      description: "Edit student profiles and manage account settings",
      icon: <UserCheck className="w-10 h-10 text-purple-500" />,
      path: "/dashboards/admin-studentmange?action=edit",
      color: "bg-purple-50 dark:bg-purple-900/20"
    }
  ];

  return (
    <ProtectedPage>
      
        <HeadingDashboard />
        <div className="p-6">
          {/* Back button */}
          <div className="mb-6">
            <Link
              href="/dashboards/admin"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                <UsersRound className="w-6 h-6 text-primary-500" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
                Student Management
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
              Manage all aspects of student accounts including enrollment, profile updates, and more.
            </p>
          </div>

          {/* Management Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {managementOptions.map((option, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className={`p-6 ${option.color}`}>
                  {option.icon}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {option.description}
                  </p>
                  <button
                    onClick={() => router.push(option.path)}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Go to {option.title}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      
    </ProtectedPage>
  );
};

export default AdminStudentPage; 