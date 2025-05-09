"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import SkeletonLoader from "@/components/shared/loaders/SkeletonLoader";

// Dynamically import the AssignStudent component with loading state
const AssignStudent = dynamic(
  () => import("@/components/layout/main/dashboards/AssignStudent"), 
  {
    ssr: false,
    loading: () => <SkeletonLoader type="default" />
  }
);

const AssignStudentPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulate loading state and handle initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Assign Students to Courses & Batches</h1>
        
        {isLoading ? (
          <div className="min-h-[50vh]">
            <SkeletonLoader type="default" />
          </div>
        ) : (
          <AssignStudent />
        )}
      </div>
    </div>
  );
};

export default AssignStudentPage; 