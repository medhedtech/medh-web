"use client";

import { Suspense } from "react";
import ProtectedPage from "@/app/protectedRoutes";
import ListOfCourse from "@/components/layout/main/dashboards/ListOfCourse";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import Link from "next/link";
import useAuth from '@/hooks/useAuth';
import { FaPlus, FaFileExport } from 'react-icons/fa';

// Loading component for better UX
const LoadingState = () => (
  <div className="w-full p-8 animate-fade-in">
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-1/4"></div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl p-4 space-y-3 transform hover:scale-[1.01] transition-all duration-200">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-lg w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-lg w-1/2"></div>
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
        
          <div className="space-y-6 p-4 md:p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 
                          bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6
                          transform hover:translate-y-[-2px] transition-all duration-200">
              <div className="flex-1">
                <HeadingDashboard />
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden
                          transform hover:translate-y-[-2px] transition-all duration-200">
              <div className="p-4 md:p-6">
                <Suspense fallback={<LoadingState />}>
                  <ListOfCourse />
                </Suspense>
              </div>
            </div>
          </div>
        

        {/* Theme Controller */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="transform hover:scale-110 transition-transform duration-200
                        hover:rotate-12 active:rotate-0">
            
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
};

export default AdminCourseList;

// Add these styles to your global CSS
/*
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}

:root {
  --primary: #10B981;
  --primary-dark: #059669;
}

.bg-primary {
  background-color: var(--primary);
}

.bg-primary-dark {
  background-color: var(--primary-dark);
}

.hover\:bg-primary-dark:hover {
  background-color: var(--primary-dark);
}

.focus\:ring-primary:focus {
  --tw-ring-color: var(--primary);
}

.text-primary {
  color: var(--primary);
}
*/
