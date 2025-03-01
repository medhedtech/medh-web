import ProtectedPage from "@/app/protectedRoutes";
import AllInstructorMainClass from "@/components/layout/main/dashboards/All-Main-Classes";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import React from "react";

const AllMainClasses = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <AllInstructorMainClass />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default AllMainClasses;
