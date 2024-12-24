import ProtectedPage from "@/app/protectedRoutes";
import MainClass from "@/components/layout/main/dashboards/MainClass";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const MainClasses = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <MainClass />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default MainClasses;
