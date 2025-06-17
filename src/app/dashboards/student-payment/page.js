import ProtectedPage from "@/app/protectedRoutes";
import PaymentTable from "@/components/layout/main/dashboards/Payments";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";

const StudentPayment = () => {
  return (
    <PageWrapper>
    <ProtectedPage>
      
        <div className="py-12">
          <PaymentTable />
        </div>
        
      
    </ProtectedPage>
    </PageWrapper>
  );
};

export default StudentPayment;
