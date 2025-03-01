import ProtectedPage from "@/app/protectedRoutes";
import CreateQuize from "@/components/sections/sub-section/dashboards/CreateQuize";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import React from "react";

const page = () => {
  return (
    <ProtectedPage>
      <DashboardContainer>
        <HeadingDashboard />
        <CreateQuize />
      </DashboardContainer>
      
    </ProtectedPage>
  );
};

export default page;
