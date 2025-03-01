import ProtectedPage from "@/app/protectedRoutes";
import MainClass from "@/components/layout/main/dashboards/MainClass";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import React from "react";

const MainClasses = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <MainClass />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default MainClasses;
