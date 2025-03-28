import ProtectedPage from "@/app/protectedRoutes";
import StudentUpcomigClasses from "@/components/layout/main/dashboards/StudentUpcomingClasses";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import React from "react";

const Student_Upcoming_Classes = () => {
  return (
    <ProtectedPage>
      <DashboardContainer>
        <div className="px-12">
          <HeadingDashboard />
        </div>
        <StudentUpcomigClasses />
        
      </DashboardContainer>
    </ProtectedPage>
  );
};

export default Student_Upcoming_Classes;
