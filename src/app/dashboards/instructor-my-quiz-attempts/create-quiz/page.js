import CreateQuize from "@/components/sections/sub-section/dashboards/CreateQuize";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const page = () => {
  return (
    <div>
      <DashboardContainer>
        <HeadingDashboard />
        <CreateQuize />
      </DashboardContainer>
      <ThemeController />
    </div>
  );
};

export default page;
