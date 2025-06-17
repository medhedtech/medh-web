import ProtectedPage from "@/app/protectedRoutes";
import PlacementForm from "@/components/layout/main/dashboards/PlacementForm";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React from "react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
const ApplyForPlacement = () => {
  return (
    <PageWrapper>
    <ProtectedPage>
      
        <div className="py-12">
          <PlacementForm />
        </div>
      
    </ProtectedPage>
    </PageWrapper>
  );
};

export default ApplyForPlacement;
