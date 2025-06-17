import ProtectedPage from "@/app/protectedRoutes";
import CreateQuize from "@/components/sections/sub-section/dashboards/CreateQuize";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import React from "react";

const page = () => {
  return (
    <ProtectedPage>
      
        <HeadingDashboard />
        <CreateQuize />
      
      
    </ProtectedPage>
  );
};

export default page;
