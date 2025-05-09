"use client";

import React from "react";
import dynamic from "next/dynamic";

// Using dynamic import with loading fallback for better performance
const EditCoursesComponent = dynamic(
  () => import("@/components/layout/main/dashboards/ListOfCourse"),
  {
    loading: () => <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-center">
        <div className="h-8 w-48 bg-gray-300 rounded mb-4 mx-auto"></div>
        <div className="h-4 w-72 bg-gray-300 rounded mb-2 mx-auto"></div>
        <div className="h-64 w-full max-w-4xl bg-gray-200 rounded mx-auto"></div>
      </div>
    </div>,
    ssr: false
  }
);

// Removed metadata export as it's incompatible with "use client"

export default function EditCoursesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Courses</h1>
      <EditCoursesComponent />
    </div>
  );
} 