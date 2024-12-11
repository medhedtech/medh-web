import Instructor_Main_Classes_Real from "@/components/layout/main/dashboards/Instructor_All_Main_Classes";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const All_Main_Classes = () => {
  return (
    <main>
      <DashboardContainer>
        <Instructor_Main_Classes_Real />
      </DashboardContainer>
      <ThemeController />
    </main>
  );
};

export default All_Main_Classes;
