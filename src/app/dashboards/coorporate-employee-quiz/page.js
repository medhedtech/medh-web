import ProtectedPage from "@/app/protectedRoutes";
import CorporateEmpQuizDashboard from "@/components/layout/main/dashboards/CorporateEmpQuizDashboard";
import CorporateQuizDashboard from "@/components/layout/main/dashboards/CorporateQuizDashboard";
import StudentQuizedashboard from "@/components/layout/main/dashboards/StudentQuizedashboard";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const CorporateEmpQuizes = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <CorporateEmpQuizDashboard />
          <ThemeController />
        </DashboardContainer>
      </main>
    </ProtectedPage>
  );
};

export default CorporateEmpQuizes;
