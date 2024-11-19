import StundentFreeCourses from "@/components/layout/main/dashboards/Students-Free-Courses";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const Student_Free_Courses = () => {
  return (
    <div>
      <DashboardContainer>
        <HeadingDashboard />
        <StundentFreeCourses />
        <ThemeController />
      </DashboardContainer>
    </div>
  );
};

export default Student_Free_Courses;
