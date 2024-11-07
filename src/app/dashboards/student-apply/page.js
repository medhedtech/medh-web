import PlacementForm from "@/components/layout/main/dashboards/PlacementForm";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React from "react";

const ApplyForPlacement = () => {
  return (
    <div>
      <DashboardContainer>
        <HeadingDashboard />
        <PlacementForm />
      </DashboardContainer>
    </div>
  );
};

export default ApplyForPlacement;
