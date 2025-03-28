import ProtectedPage from "@/app/protectedRoutes";
import PlacementForm from "@/components/layout/main/dashboards/PlacementForm";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React from "react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
const ApplyForPlacement = () => {
  return (
    <PageWrapper>
    <ProtectedPage>
      <DashboardContainer>
        <div className="py-12">
          <PlacementForm />
        </div>
      </DashboardContainer>
    </ProtectedPage>
    </PageWrapper>
  );
};

export default ApplyForPlacement;
