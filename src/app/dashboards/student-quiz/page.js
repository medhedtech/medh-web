import StudentQuizedashboard from "@/components/layout/main/dashboards/StudentQuizedashboard";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const StudentQuizes = () => {
  return (
    <div>
      <main>
        <DashboardContainer>
          <StudentQuizedashboard />
          <ThemeController />
        </DashboardContainer>
      </main>
    </div>
  );
};

export default StudentQuizes;
