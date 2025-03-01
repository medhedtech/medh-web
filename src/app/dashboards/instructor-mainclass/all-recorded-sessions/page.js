import ProtectedPage from "@/app/protectedRoutes";
import Instructor_Recorded_Sessions from "@/components/layout/main/dashboards/Instructor_recorded_sessions";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import React from "react";

const All_Recorded_Classes = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <Instructor_Recorded_Sessions />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default All_Recorded_Classes;
