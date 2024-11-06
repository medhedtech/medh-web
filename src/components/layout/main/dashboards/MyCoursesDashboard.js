import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React from "react";
import EnrollCourses from "./EnrollCourses";
import RecordedSessions from "@/components/shared/dashboards/RecordedSessions";
import NewCourses from "@/components/shared/dashboards/NewCourses";

const MyCoursesDashboard = () => {
  return (
    <div className="p-10px md:px-10 md:py-50px dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark ">
      <HeadingDashboard />
      <EnrollCourses />
      <RecordedSessions />
      <NewCourses />
    </div>
  );
};

export default MyCoursesDashboard;
