import ProtectedPage from "@/app/protectedRoutes";
import StudentNewCourses from "@/components/layout/main/dashboards/Student-Enroll-New-Course";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const Student_Enroll_New_Courses = () => {
  return (
    <ProtectedPage>
      <DashboardContainer>
        <HeadingDashboard />
        <StudentNewCourses />
        <ThemeController />
      </DashboardContainer>
    </ProtectedPage>
  );
};

export default Student_Enroll_New_Courses;
