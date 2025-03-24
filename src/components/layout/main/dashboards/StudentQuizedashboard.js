"use client";
import React from "react";
import QuizPage from "./QuizPage";

const StudentQuizedashboard = () => {
  const handleCloseQuiz = () => {
    // Handle quiz close logic here
    // For now, this is just a placeholder
  };

  return (
    <div className="p-4">
      <QuizPage closeQuiz={handleCloseQuiz} />
    </div>
  );
};

export default StudentQuizedashboard;
