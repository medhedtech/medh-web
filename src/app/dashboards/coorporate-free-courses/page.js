import ProtectedPage from "@/app/protectedRoutes";
import CorporateFreeCourses from "@/components/layout/main/dashboards/CorporateFreeCourses";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import React from "react";

const Corporate_Free_Courses = () => {
  return (
    <ProtectedPage>
      <DashboardContainer>
        <HeadingDashboard />
        <CorporateFreeCourses />
        
      </DashboardContainer>
    </ProtectedPage>
  );
};

export default Corporate_Free_Courses;
