import AllInstructorMainClass from "@/components/layout/main/dashboards/All-Main-Classes";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const AllMainClasses = () => {
  return (
    <main>
      <DashboardContainer>
        <AllInstructorMainClass />
      </DashboardContainer>
      <ThemeController />
    </main>
  );
};

export default AllMainClasses;
