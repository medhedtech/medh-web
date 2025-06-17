import ProtectedPage from "@/app/protectedRoutes";
import PlacementForm from "@/components/layout/main/dashboards/PlacementForm";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React from "react";

const ApplyForPlacementCorporate = () => {
  return (
    <ProtectedPage>
      
        <div className="px-8">
          <HeadingDashboard />
        </div>
        <PlacementForm />
      
    </ProtectedPage>
  );
};

export default ApplyForPlacementCorporate;
