"use client";

import React from "react";
import dynamic from "next/dynamic";

// Using dynamic import with loading fallback
const AddCourseForm = dynamic(
  () => import("@/components/layout/main/dashboards/AddCourse"),
  {
    loading: () => <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-center">
        <div className="h-8 w-32 bg-gray-300 rounded mb-4 mx-auto"></div>
        <div className="h-4 w-64 bg-gray-300 rounded mb-2 mx-auto"></div>
        <div className="h-4 w-48 bg-gray-300 rounded mx-auto"></div>
      </div>
    </div>,
    ssr: false
  }
);

// Removed metadata export as it's incompatible with "use client"

export default function AddCoursePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Course</h1>
      <AddCourseForm />
    </div>
  );
} 