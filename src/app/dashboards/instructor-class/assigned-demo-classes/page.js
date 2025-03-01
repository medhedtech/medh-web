import ProtectedPage from "@/app/protectedRoutes";
import AssignedAllDemoClasses from "@/components/layout/main/dashboards/AssignedAllDemoClasses";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import React from "react";

const AssignedDemoClasses = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <AssignedAllDemoClasses />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default AssignedDemoClasses;
