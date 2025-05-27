import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Quiz | Student Dashboard | Medh",
  description: "Take quizzes, track your progress, and view quiz results",
};

// Client component wrapper for the quiz dashboard
const QuizDashboard = dynamic(
  () => import("@/components/sections/dashboards/QuizDashboard"),
  {
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>,
  }
);

// Server component
export default function QuizPage() {
  return <QuizDashboard />;
} 