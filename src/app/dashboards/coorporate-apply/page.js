import ProtectedPage from "@/app/protectedRoutes";
import PlacementForm from "@/components/layout/main/dashboards/PlacementForm";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React from "react";

const ApplyForPlacementCorporate = () => {
  return (
    <ProtectedPage>
      <DashboardContainer>
        <div className="px-8">
          <HeadingDashboard />
        </div>
        <PlacementForm />
      </DashboardContainer>
    </ProtectedPage>
  );
};

export default ApplyForPlacementCorporate;
