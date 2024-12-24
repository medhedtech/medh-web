import React from "react";
import BillDetails from "@/components/layout/main/dashboards/BillDetails";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ProtectedPage from "@/app/protectedRoutes";

const BillingDetails = () => {
  return (
    <ProtectedPage>
      <DashboardContainer>
        <BillDetails />
      </DashboardContainer>
    </ProtectedPage>
  );
};

export default BillingDetails;
