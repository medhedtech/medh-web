import ProtectedPage from "@/app/protectedRoutes";
import StudentProgressOverview from "@/components/layout/main/dashboards/Student-ProgressOverview";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import React from "react";

const Student_Progress_Overview = () => {
  return (
    <ProtectedPage>
      <DashboardContainer>
        <HeadingDashboard />
        <StudentProgressOverview />
        
      </DashboardContainer>
    </ProtectedPage>
  );
};

export default Student_Progress_Overview;
