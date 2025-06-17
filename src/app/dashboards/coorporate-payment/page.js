import ProtectedPage from "@/app/protectedRoutes";
import PaymentTable from "@/components/layout/main/dashboards/Payments";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import React from "react";

const CorporatePayment = () => {
  return (
    <ProtectedPage>
      
        <div className="px-12">
          <HeadingDashboard />
        </div>
        <PaymentTable />
        
      
    </ProtectedPage>
  );
};

export default CorporatePayment;
