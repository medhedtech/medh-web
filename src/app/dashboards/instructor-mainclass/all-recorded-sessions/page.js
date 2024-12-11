import Instructor_Recorded_Sessions from "@/components/layout/main/dashboards/Instructor_recorded_sessions";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const All_Recorded_Classes = () => {
  return (
    <main>
      <DashboardContainer>
        <Instructor_Recorded_Sessions />
      </DashboardContainer>
      <ThemeController />
    </main>
  );
};

export default All_Recorded_Classes;
