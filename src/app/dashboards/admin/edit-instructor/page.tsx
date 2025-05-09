"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import SkeletonLoader from "@/components/shared/loaders/SkeletonLoader";

// Dynamically import the EditInstructor component with loading state
const EditInstructor = dynamic(
  () => import("@/components/layout/main/dashboards/EditInstructor"), 
  {
    ssr: false,
    loading: () => <SkeletonLoader type="default" />
  }
);

const EditInstructorPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulate loading state and handle initialization
  useEffect(() => {
    // Simulate API loading time
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
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Instructor Profiles</h1>
        
        {isLoading ? (
          <div className="min-h-[50vh]">
            <SkeletonLoader type="default" />
          </div>
        ) : (
          <EditInstructor />
        )}
      </div>
    </div>
  );
};

export default EditInstructorPage; 