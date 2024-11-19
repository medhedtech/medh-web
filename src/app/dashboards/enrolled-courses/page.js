import StudentEnrollCourses from "@/components/layout/main/dashboards/Student-Enrolled-Courses";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const Student_Enrolled_courses_01 = () => {
  return (
    <div>
      <DashboardContainer>
        <HeadingDashboard />
        <StudentEnrollCourses />
        <ThemeController />
      </DashboardContainer>
    </div>
  );
};

export default Student_Enrolled_courses_01;
