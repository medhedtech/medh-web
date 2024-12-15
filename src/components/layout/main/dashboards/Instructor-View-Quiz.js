import SubmittedQuiz from "@/components/sections/sub-section/dashboards/Instructor-View-Submitted-Quiz";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React from "react";

const ViewAssignments = () => {
  return (
    <div className="px-4">
      <HeadingDashboard />
      <SubmittedQuiz />
    </div>
  );
};

export default ViewAssignments;
