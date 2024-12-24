import ProtectedPage from "@/app/protectedRoutes";
import StudentQuizedashboard from "@/components/layout/main/dashboards/StudentQuizedashboard";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const StudentQuizes = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <StudentQuizedashboard />
          <ThemeController />
        </DashboardContainer>
      </main>
    </ProtectedPage>
  );
};

export default StudentQuizes;
