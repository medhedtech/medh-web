import ProtectedPage from "@/app/protectedRoutes";
import Instructor_Main_Classes_Real from "@/components/layout/main/dashboards/Instructor_All_Main_Classes";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import React from "react";

const All_Main_Classes = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <Instructor_Main_Classes_Real />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default All_Main_Classes;
