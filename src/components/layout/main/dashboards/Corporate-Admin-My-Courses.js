import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React from "react";
import CoorporateNew_Courses from "@/components/shared/dashboards/Coorporate_New_Courses";
import CoorporateAdminEnrollCourses from "./Coorporate_Enroll_Admin_Courses";

const CoorporateAdminMyCoursesDashboard = () => {
  return (
    <div>
      <div className="px-9">
        <HeadingDashboard />
      </div>
      <CoorporateAdminEnrollCourses />
      <CoorporateNew_Courses />
    </div>
  );
};

export default CoorporateAdminMyCoursesDashboard;
