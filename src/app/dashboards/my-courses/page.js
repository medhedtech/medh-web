import MyCoursesDashboard from "@/components/layout/main/dashboards/MyCoursesDashboard";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const My_Courses = () => {
  return (
    <div>
      <main>
        {/* <DsahboardWrapper> */}
        <DashboardContainer>
          <MyCoursesDashboard />
        </DashboardContainer>
        {/* </DsahboardWrapper> */}
        <ThemeController />
      </main>
    </div>
  );
};

export default My_Courses;
