import ProtectedPage from "@/app/protectedRoutes";
import Live_Demo_Classess_instructor from "@/components/layout/main/dashboards/Access_Live_Classess_Instructor";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import React from "react";

const Access_Live_Classes = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <Live_Demo_Classess_instructor />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default Access_Live_Classes;
