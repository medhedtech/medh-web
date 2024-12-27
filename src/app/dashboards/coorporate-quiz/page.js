import ProtectedPage from "@/app/protectedRoutes";
import CorporateQuizDashboard from "@/components/layout/main/dashboards/CorporateQuizDashboard";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const StudentQuizes = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <CorporateQuizDashboard />
          <ThemeController />
        </DashboardContainer>
      </main>
    </ProtectedPage>
  );
};

export default StudentQuizes;
