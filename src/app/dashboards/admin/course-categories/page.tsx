"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import SkeletonLoader from "@/components/shared/loaders/SkeletonLoader";

// Dynamically import the CategoryManagement component with loading state
const CategoryManagement = dynamic(
  () => import("@/components/layout/main/dashboards/CateogiresManage"), 
  {
    ssr: false,
    loading: () => <SkeletonLoader type="default" />
  }
);

const CourseCategoriesPage: React.FC = () => {
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
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Course Categories</h1>
        
        {isLoading ? (
          <SkeletonLoader type="default" />
        ) : (
          <CategoryManagement />
        )}
      </div>
    </div>
  );
};

export default CourseCategoriesPage; 