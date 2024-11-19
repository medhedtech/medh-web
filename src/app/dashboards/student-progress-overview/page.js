import StudentProgressOverview from "@/components/layout/main/dashboards/Student-ProgressOverview";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const Student_Progress_Overview = () => {
  return (
    <div>
      <DashboardContainer>
        <HeadingDashboard />
        <StudentProgressOverview />
        <ThemeController />
      </DashboardContainer>
    </div>
  );
};

export default Student_Progress_Overview;
