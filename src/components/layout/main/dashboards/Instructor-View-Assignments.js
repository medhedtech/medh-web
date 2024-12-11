import SubmittedAssignments from "@/components/sections/sub-section/dashboards/Instructor-View-Submitted-Assignments";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React from "react";

const ViewAssignments = () => {
  return (
    <div className="px-4">
      <HeadingDashboard />
      <SubmittedAssignments />
    </div>
  );
};

export default ViewAssignments;
