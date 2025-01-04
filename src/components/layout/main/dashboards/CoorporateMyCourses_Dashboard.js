import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React from "react";
import CoorporateEnrollCourses from "./Coorporate_Enroll_Courses";
import CoorporateNew_Courses from "@/components/shared/dashboards/Coorporate_New_Courses";

const CoorporateEmployeMyCoursesDashboard = () => {
  return (
    <div>
      <div className="px-9">
        <HeadingDashboard />
      </div>
      <CoorporateEnrollCourses />
      {/* <CoorporateNew_Courses /> */}
    </div>
  );
};

export default CoorporateEmployeMyCoursesDashboard;
