import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Lesson Course Materials | Student Dashboard | Medh",
  description: "Access and download course materials, resources, and study guides",
};

// Client component wrapper for the lesson-course-materials dashboard
const LessonCourseMaterialsDashboard = dynamic(
  () => import("@/components/sections/dashboards/LessonCourseMaterialsDashboard"),
  {
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>,
  }
);

// Server component
export default function LessonCourseMaterialsPage() {
  return <LessonCourseMaterialsDashboard />;
} 