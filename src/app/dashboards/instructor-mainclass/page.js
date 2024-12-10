import MainClass from "@/components/layout/main/dashboards/MainClass";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const MainClasses = () => {
  return (
    <main>
      <DashboardContainer>
        <MainClass />
      </DashboardContainer>
      <ThemeController />
    </main>
  );
};

export default MainClasses;
