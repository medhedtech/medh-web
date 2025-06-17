import React from "react";

import ProtectedPage from "@/app/protectedRoutes";
import CoorporateBillDetails from "@/components/layout/main/dashboards/Coorporate-Bill-Details";

const CoorporateBillingDetails = () => {
  return (
    <ProtectedPage>
      
        <CoorporateBillDetails />
      
    </ProtectedPage>
  );
};

export default CoorporateBillingDetails;
