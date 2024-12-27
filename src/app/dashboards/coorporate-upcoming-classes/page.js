import ProtectedPage from "@/app/protectedRoutes";
import CorporateUpcomigClasses from "@/components/layout/main/dashboards/CorporateUpcomingClasses";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const Student_Upcoming_Classes = () => {
  return (
    <ProtectedPage>
      <DashboardContainer>
        <div className="px-12">
          <HeadingDashboard />
        </div>
        <CorporateUpcomigClasses />
        <ThemeController />
      </DashboardContainer>
    </ProtectedPage>
  );
};

export default Student_Upcoming_Classes;
