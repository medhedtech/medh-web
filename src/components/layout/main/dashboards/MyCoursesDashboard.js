import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React from "react";
import EnrollCourses from "./EnrollCourses";
import RecordedSessions from "@/components/shared/dashboards/RecordedSessions";
import NewCourses from "@/components/shared/dashboards/NewCourses";

const MyCoursesDashboard = () => {
  return (
    <div>
      <HeadingDashboard />
      <EnrollCourses />
      <RecordedSessions />
      <NewCourses />
    </div>
  );
};

export default MyCoursesDashboard;
