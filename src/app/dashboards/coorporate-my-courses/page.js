import ProtectedPage from "@/app/protectedRoutes";
import CoorporateMyCoursesDashboard from "@/components/layout/main/dashboards/CoorporateMyCourses_Dashboard";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import React from "react";

const Coorporate_My_Courses = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <CoorporateMyCoursesDashboard />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default Coorporate_My_Courses;
