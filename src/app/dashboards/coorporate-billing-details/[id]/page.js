import React from "react";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ProtectedPage from "@/app/protectedRoutes";
import CoorporateBillDetails from "@/components/layout/main/dashboards/Coorporate-Bill-Details";

const CoorporateBillingDetails = () => {
  return (
    <ProtectedPage>
      <DashboardContainer>
        <CoorporateBillDetails />
      </DashboardContainer>
    </ProtectedPage>
  );
};

export default CoorporateBillingDetails;
