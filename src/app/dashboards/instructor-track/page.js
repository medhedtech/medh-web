import ProtectedPage from "@/app/protectedRoutes";
import Instructor_Tracking_component from "@/components/layout/main/dashboards/Instructor_Track";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import React from "react";

const InstructorTrack = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div>
            <HeadingDashboard />
          </div>
          <Instructor_Tracking_component />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default InstructorTrack;
