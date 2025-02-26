"use client";

import { Suspense } from "react";
import ProtectedPage from "@/app/protectedRoutes";
import ListOfCourse from "@/components/layout/main/dashboards/ListOfCourse";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
import Link from "next/link";

// Loading component for better UX
const LoadingState = () => (
  <div className="w-full p-8">
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AdminCourseList = () => {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return <LoadingState />;
  }

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <DashboardContainer>
          <div className="space-y-6 p-4 md:p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6">
              <div className="flex-1">
                <HeadingDashboard />
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Manage and organize your course catalog
                </p>
              </div>
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <Link
                  href="/dashboards/admin-addcourse"
                  className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 
                           transition-all duration-200 text-sm font-medium text-center
                           focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                           active:transform active:scale-95"
                >
                  Add New Course
                </Link>
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 
                           text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700
                           transition-all duration-200 text-sm font-medium text-center
                           focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                           active:transform active:scale-95"
                >
                  Export List
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 md:p-6">
                <Suspense fallback={<LoadingState />}>
                  <ListOfCourse />
                </Suspense>
              </div>
            </div>
          </div>
        </DashboardContainer>

        {/* Theme Controller */}
        <div className="fixed bottom-4 right-4 z-50 transition-transform duration-200 hover:scale-105">
          <ThemeController />
        </div>
      </div>
    </ProtectedPage>
  );
};

export default AdminCourseList;
