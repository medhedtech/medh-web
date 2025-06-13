"use client";

import React from "react";
import StudentEnrolledCourses from "@/components/sections/sub-section/dashboards/StudentEnrolledCourses";

/**
 * EnrolledCoursesMain - Component that wraps StudentEnrolledCourses
 */
const EnrolledCoursesMain: React.FC = () => {
  return (
    <div className="space-y-6">
      <StudentEnrolledCourses />
    </div>
  );
};

export default EnrolledCoursesMain; 