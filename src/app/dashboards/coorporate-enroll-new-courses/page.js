import ProtectedPage from "@/app/protectedRoutes";
import CoorporateNewCourses from "@/components/layout/main/dashboards/Coorporate-Enroll-New-Courses";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const Coorporate_Enroll_New_Courses = () => {
  return (
    <ProtectedPage>
      <DashboardContainer>
        <HeadingDashboard />
        <CoorporateNewCourses />
        <ThemeController />
      </DashboardContainer>
    </ProtectedPage>
  );
};

export default Coorporate_Enroll_New_Courses;
