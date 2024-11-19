import StudentUpcomigClasses from "@/components/layout/main/dashboards/Student-Upcoming-Classes";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const Student_Upcoming_Classes = () => {
  return (
    <div>
      <DashboardContainer>
        <HeadingDashboard />
        <StudentUpcomigClasses />
        <ThemeController />
      </DashboardContainer>
    </div>
  );
};

export default Student_Upcoming_Classes;
