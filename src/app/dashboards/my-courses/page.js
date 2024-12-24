import ProtectedPage from "@/app/protectedRoutes";
import MyCoursesDashboard from "@/components/layout/main/dashboards/MyCoursesDashboard";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const My_Courses = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <MyCoursesDashboard />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default My_Courses;
