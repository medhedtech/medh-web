"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import SkeletonLoader from "@/components/shared/loaders/SkeletonLoader";
import { useSearchParams } from "next/navigation";

// Dynamically import the EditStudent component with loading state
const EditStudent = dynamic(
  () => import("@/components/layout/main/dashboards/EditStudent"), 
  {
    ssr: false,
    loading: () => <SkeletonLoader type="default" />
  }
);

const EditStudentPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const studentId = searchParams.get('id');

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
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          {studentId ? "Edit Student" : "Select a Student to Edit"}
        </h1>
        
        {isLoading ? (
          <div className="min-h-[50vh]">
            <SkeletonLoader type="default" />
          </div>
        ) : (
          <EditStudent studentId={studentId} />
        )}
      </div>
    </div>
  );
};

export default EditStudentPage; 