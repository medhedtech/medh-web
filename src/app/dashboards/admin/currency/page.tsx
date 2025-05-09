"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import SkeletonLoader from "@/components/shared/loaders/SkeletonLoader";

// Dynamically import the AdminCurrency component with loading state
const AdminCurrency = dynamic(
  () => import("@/components/layout/main/dashboards/AdminCurrency"), 
  {
    ssr: false,
    loading: () => <SkeletonLoader type="default" />
  }
);

const AdminCurrencyPage: React.FC = () => {
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
      {isLoading ? (
        <div className="p-6">
          <SkeletonLoader type="default" />
        </div>
      ) : (
        <AdminCurrency />
      )}
    </div>
  );
};

export default AdminCurrencyPage; 