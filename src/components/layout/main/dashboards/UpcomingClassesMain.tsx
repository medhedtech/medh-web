"use client";

import React from "react";
import StudentUpcomingClasses from "./StudentUpcomingClasses";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

/**
 * UpcomingClassesMain - Component that wraps StudentUpcomingClasses with header
 */
const UpcomingClassesMain: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="px-6">
        <HeadingDashboard />
      </div>
      <StudentUpcomingClasses />
    </div>
  );
};

export default UpcomingClassesMain; 