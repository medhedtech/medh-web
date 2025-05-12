"use client";

import React from "react";
import StudentEnrolledCourses from "@/components/sections/sub-section/dashboards/StudentEnrolledCourses";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

/**
 * EnrolledCoursesMain - Component that wraps StudentEnrolledCourses with header
 */
const EnrolledCoursesMain: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="px-6">
        <HeadingDashboard />
      </div>
      <StudentEnrolledCourses />
    </div>
  );
};

export default EnrolledCoursesMain; 