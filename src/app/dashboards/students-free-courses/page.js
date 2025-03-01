import ProtectedPage from "@/app/protectedRoutes";
import StundentFreeCourses from "@/components/layout/main/dashboards/Students-Free-Courses";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import React from "react";

const Student_Free_Courses = () => {
  return (
    <ProtectedPage>
      <DashboardContainer>
        <HeadingDashboard />
        <StundentFreeCourses />
        
      </DashboardContainer>
    </ProtectedPage>
  );
};

export default Student_Free_Courses;
