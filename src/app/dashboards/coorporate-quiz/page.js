import ProtectedPage from "@/app/protectedRoutes";
import CorporateQuizDashboard from "@/components/layout/main/dashboards/CorporateQuizDashboard";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import React from "react";

const StudentQuizes = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <CorporateQuizDashboard />
          
        </DashboardContainer>
      </main>
    </ProtectedPage>
  );
};

export default StudentQuizes;
