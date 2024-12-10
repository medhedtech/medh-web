import CreateQuize from "@/components/sections/sub-section/dashboards/CreateQuize";
import InstructorMyQuizAttemsPrimary from "@/components/sections/sub-section/dashboards/InstructorMyQuizAttemsPrimary";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React from "react";

const InstructorMyQuizAttemptsMain = () => {
  return (
    <div className="px-4">
      <HeadingDashboard />
      <InstructorMyQuizAttemsPrimary />
      {/* <CreateQuize /> */}
    </div>
  );
};

export default InstructorMyQuizAttemptsMain;
