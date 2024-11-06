"use client";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React, { useState } from "react";
import AssignmentsSection from "./AssignmentsSection";
import QuizPage from "./QuizPage";

const StudentQuizedashboard = () => {
  const [showQuizPage, setShowQuizPage] = useState(false);

  const handleQuizClick = () => {
    setShowQuizPage(true);
  };

  const handleBackToAssignments = () => {
    setShowQuizPage(false);
  };

  return (
    <div className="p-10px md:px-10 md:py-30px dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark ">
      <HeadingDashboard />
      {showQuizPage ? (
        <QuizPage onBack={handleBackToAssignments} />
      ) : (
        <AssignmentsSection onQuizClick={handleQuizClick} />
      )}
    </div>
  );
};

export default StudentQuizedashboard;
