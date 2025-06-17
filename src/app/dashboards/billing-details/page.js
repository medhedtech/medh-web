import React from "react";
import BillDetails from "@/components/layout/main/dashboards/BillDetails";

import ProtectedPage from "@/app/protectedRoutes";

const BillingDetails = () => {
  return (
    <ProtectedPage>
      
        <BillDetails />
      
    </ProtectedPage>
  );
};

export default BillingDetails;
