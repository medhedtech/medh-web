import ProtectedPage from "@/app/protectedRoutes";
import CoorporateEnroll_Courses from "@/components/layout/main/dashboards/CoorporateEnroll_Courses";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import React from "react";

const Coorporate_Enrolled_courses_01 = () => {
  return (
    <ProtectedPage>
      <DashboardContainer>
        <HeadingDashboard />
        <CoorporateEnroll_Courses />
        
      </DashboardContainer>
    </ProtectedPage>
  );
};

export default Coorporate_Enrolled_courses_01;
