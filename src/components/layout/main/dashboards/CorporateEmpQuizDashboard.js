"use client";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React, { useState } from "react";
import AssignmentsSection from "./AssignmentsSection";
import CoorporateAssignmentsSection from "./CoorporateAssignmentSection";
import CoorporateQuizPage from "./CoorporateQuizPage";

const CorporateEmpQuizDashboard = () => {
  const [showQuizPage, setShowQuizPage] = useState(false);

  const handleQuizClick = () => {
    setShowQuizPage(true);
  };

  const handleBackToAssignments = () => {
    setShowQuizPage(false);
  };

  return (
    <div className="p-10 md:px-2 pt-2 dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark ">
      <div className="px-6">
        <HeadingDashboard />
      </div>
      {showQuizPage ? (
        <div className="px-6">
          <CoorporateQuizPage closeQuiz={handleBackToAssignments} />
        </div>
      ) : (
        <CoorporateAssignmentsSection onQuizClick={handleQuizClick} />
      )}
    </div>
  );
};

export default CorporateEmpQuizDashboard;
