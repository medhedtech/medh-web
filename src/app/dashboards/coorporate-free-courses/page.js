import ProtectedPage from "@/app/protectedRoutes";
import CorporateFreeCourses from "@/components/layout/main/dashboards/CorporateFreeCourses";
import StundentFreeCourses from "@/components/layout/main/dashboards/Students-Free-Courses";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const Corporate_Free_Courses = () => {
  return (
    <ProtectedPage>
      <DashboardContainer>
        <HeadingDashboard />
        <CorporateFreeCourses />
        <ThemeController />
      </DashboardContainer>
    </ProtectedPage>
  );
};

export default Corporate_Free_Courses;
