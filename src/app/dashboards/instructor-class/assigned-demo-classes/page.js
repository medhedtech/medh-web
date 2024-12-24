import ProtectedPage from "@/app/protectedRoutes";
import AssignedAllDemoClasses from "@/components/layout/main/dashboards/AssignedAllDemoClasses";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const AssignedDemoClasses = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <AssignedAllDemoClasses />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default AssignedDemoClasses;
