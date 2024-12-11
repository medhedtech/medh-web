import Live_Demo_Classess_instructor from "@/components/layout/main/dashboards/Access_Live_Classess_Instructor";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const Access_Live_Classes = () => {
  return (
    <main>
      <DashboardContainer>
        <Live_Demo_Classess_instructor />
      </DashboardContainer>
      <ThemeController />
    </main>
  );
};

export default Access_Live_Classes;
