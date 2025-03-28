import ProtectedPage from "@/app/protectedRoutes";
import PaymentTable from "@/components/layout/main/dashboards/Payments";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";

const StudentPayment = () => {
  return (
    <PageWrapper>
    <ProtectedPage>
      <DashboardContainer>
        <div className="py-12">
          <PaymentTable />
        </div>
        
      </DashboardContainer>
    </ProtectedPage>
    </PageWrapper>
  );
};

export default StudentPayment;
