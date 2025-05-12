"use client";

import React from "react";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import EnrollCourses from "./EnrollCourses";
import RecordedSessions from "@/components/shared/dashboards/RecordedSessions";
import NewCourses from "@/components/shared/dashboards/NewCourses";

/**
 * MyCoursesDashboard component that shows a student's courses
 * Including enrolled courses, recorded sessions, and new courses
 */
const MyCoursesDashboard: React.FC = () => {
  return (
    <div className="space-y-8 p-4">
      <div className="px-6">
        <HeadingDashboard />
      </div>
      <EnrollCourses />
      <RecordedSessions />
      <NewCourses />
    </div>
  );
};

export default MyCoursesDashboard; 